import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/**
 * API Key Leak Scanner
 * Detects exposed API keys, secrets, and credentials in client-side code
 */

const API_KEY_PATTERNS = [
    // AWS
    { name: 'AWS Access Key', pattern: /AKIA[0-9A-Z]{16}/g, severity: 'critical' },
    { name: 'AWS Secret Key', pattern: /(?<![A-Za-z0-9/+=])[A-Za-z0-9/+=]{40}(?![A-Za-z0-9/+=])/g, severity: 'critical', requiresContext: true },

    // Stripe
    { name: 'Stripe Live Secret Key', pattern: /sk_live_[a-zA-Z0-9]{24,}/g, severity: 'critical' },
    { name: 'Stripe Test Secret Key', pattern: /sk_test_[a-zA-Z0-9]{24,}/g, severity: 'medium' },
    { name: 'Stripe Restricted Key', pattern: /rk_live_[a-zA-Z0-9]{24,}/g, severity: 'critical' },

    // OpenAI
    { name: 'OpenAI API Key', pattern: /sk-[a-zA-Z0-9]{48}/g, severity: 'critical' },
    { name: 'OpenAI API Key (new)', pattern: /sk-proj-[a-zA-Z0-9]{48}/g, severity: 'critical' },

    // Google
    { name: 'Google API Key', pattern: /AIza[0-9A-Za-z-_]{35}/g, severity: 'high' },
    { name: 'Google OAuth Client ID', pattern: /[0-9]+-[0-9A-Za-z_]{32}\.apps\.googleusercontent\.com/g, severity: 'medium' },

    // Firebase
    { name: 'Firebase API Key', pattern: /(?:apiKey|FIREBASE_API_KEY)\s*[:=]\s*['"](AIza[0-9A-Za-z-_]{35})['"]/gi, severity: 'high' },

    // GitHub
    { name: 'GitHub Personal Access Token', pattern: /ghp_[a-zA-Z0-9]{36}/g, severity: 'critical' },
    { name: 'GitHub OAuth Token', pattern: /gho_[a-zA-Z0-9]{36}/g, severity: 'critical' },
    { name: 'GitHub App Token', pattern: /ghu_[a-zA-Z0-9]{36}/g, severity: 'critical' },

    // Supabase
    { name: 'Supabase Service Role Key', pattern: /eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*/g, severity: 'high', additionalCheck: (match: string) => match.includes('service_role') },

    // MongoDB
    { name: 'MongoDB Connection String', pattern: /mongodb(\+srv)?:\/\/[^:]+:[^@]+@[^\s'"]+/gi, severity: 'critical' },

    // PostgreSQL
    { name: 'PostgreSQL Connection String', pattern: /postgres(ql)?:\/\/[^:]+:[^@]+@[^\s'"]+/gi, severity: 'critical' },

    // Twilio
    { name: 'Twilio API Key', pattern: /SK[a-f0-9]{32}/g, severity: 'high' },
    { name: 'Twilio Auth Token', pattern: /(?:twilio|TWILIO).*['"]\b[a-f0-9]{32}\b['"]/gi, severity: 'critical' },

    // Slack
    { name: 'Slack Bot Token', pattern: /xoxb-[0-9]{10,13}-[0-9]{10,13}-[a-zA-Z0-9]{24}/g, severity: 'critical' },
    { name: 'Slack Webhook URL', pattern: /https:\/\/hooks\.slack\.com\/services\/[A-Z0-9]+\/[A-Z0-9]+\/[a-zA-Z0-9]+/g, severity: 'high' },

    // SendGrid
    { name: 'SendGrid API Key', pattern: /SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}/g, severity: 'critical' },

    // Mailchimp
    { name: 'Mailchimp API Key', pattern: /[a-f0-9]{32}-us[0-9]{1,2}/g, severity: 'high' },

    // Private Keys
    { name: 'Private Key', pattern: /-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/g, severity: 'critical' },

    // Generic patterns
    { name: 'Generic API Key', pattern: /(?:api[_-]?key|apikey)\s*[:=]\s*['"][a-zA-Z0-9_-]{20,}['"]/gi, severity: 'medium' },
    { name: 'Generic Secret', pattern: /(?:secret|password|passwd|pwd)\s*[:=]\s*['"][^'"]{8,}['"]/gi, severity: 'high' },
];

interface Finding {
    id: string;
    severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
    title: string;
    description: string;
    recommendation: string;
    location?: string;
    evidence?: string;
}

interface ScanResult {
    scannerType: string;
    score: number;
    findings: Finding[];
    sourcesScanned: number;
    scannedAt: string;
    url: string;
}

function redactSecret(secret: string): string {
    if (secret.length <= 12) return '***REDACTED***';
    return secret.substring(0, 6) + '...' + secret.substring(secret.length - 4);
}

function calculateEntropy(str: string): number {
    const freq: Record<string, number> = {};
    for (const char of str) {
        freq[char] = (freq[char] || 0) + 1;
    }
    return Object.values(freq).reduce((entropy, count) => {
        const p = count / str.length;
        return entropy - p * Math.log2(p);
    }, 0);
}

async function fetchWithTimeout(url: string, timeout = 10000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, { signal: controller.signal });
        return response;
    } finally {
        clearTimeout(timeoutId);
    }
}

async function fetchSources(url: string): Promise<Array<{ content: string; location: string }>> {
    const sources: Array<{ content: string; location: string }> = [];

    try {
        // Fetch main HTML
        const response = await fetchWithTimeout(url);
        const html = await response.text();
        sources.push({ content: html, location: 'HTML source' });

        // Extract and fetch external JS files (limit to first 5)
        const scriptMatches = html.matchAll(/<script[^>]+src=["']([^"']+)["'][^>]*>/gi);
        const scriptUrls: string[] = [];

        for (const match of scriptMatches) {
            if (scriptUrls.length >= 5) break;
            let scriptUrl = match[1];

            // Skip common CDN libraries
            if (scriptUrl.includes('cdn.') || scriptUrl.includes('unpkg.com') || scriptUrl.includes('cdnjs.')) {
                continue;
            }

            // Resolve relative URLs
            if (scriptUrl.startsWith('//')) {
                scriptUrl = 'https:' + scriptUrl;
            } else if (scriptUrl.startsWith('/')) {
                const base = new URL(url);
                scriptUrl = base.origin + scriptUrl;
            } else if (!scriptUrl.startsWith('http')) {
                const base = new URL(url);
                scriptUrl = new URL(scriptUrl, base).href;
            }

            scriptUrls.push(scriptUrl);
        }

        // Fetch JS files
        await Promise.all(
            scriptUrls.map(async (jsUrl) => {
                try {
                    const jsResponse = await fetchWithTimeout(jsUrl, 5000);
                    const jsContent = await jsResponse.text();
                    // Limit content size to prevent memory issues
                    if (jsContent.length <= 500000) {
                        sources.push({ content: jsContent, location: jsUrl });
                    }
                } catch {
                    // Skip failed JS fetches
                }
            })
        );

        // Extract inline scripts
        const inlineScripts = html.match(/<script[^>]*>([^<]+)<\/script>/gi) || [];
        inlineScripts.forEach((script, index) => {
            const content = script.replace(/<\/?script[^>]*>/gi, '');
            if (content.length > 50) {
                sources.push({ content, location: `Inline script #${index + 1}` });
            }
        });

    } catch (error) {
        // Return whatever we have
    }

    return sources;
}

Deno.serve(async (req: Request) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        });
    }

    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const { targetUrl } = await req.json();

        if (!targetUrl) {
            return new Response(JSON.stringify({ error: 'targetUrl is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Normalize URL
        const url = targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`;

        // Fetch all sources
        const sources = await fetchSources(url);
        const findings: Finding[] = [];
        const foundSecrets = new Set<string>(); // Deduplicate

        for (const { content, location } of sources) {
            for (const { name, pattern, severity, requiresContext, additionalCheck } of API_KEY_PATTERNS) {
                // Reset regex lastIndex
                pattern.lastIndex = 0;

                let match;
                while ((match = pattern.exec(content)) !== null) {
                    const secret = match[0];

                    // Skip if already found
                    if (foundSecrets.has(secret)) continue;

                    // Skip low entropy matches for generic patterns
                    if (requiresContext) {
                        const entropy = calculateEntropy(secret);
                        if (entropy < 4.0) continue;
                    }

                    // Run additional check if specified
                    if (additionalCheck && !additionalCheck(secret)) continue;

                    foundSecrets.add(secret);

                    findings.push({
                        id: `leak-${name.toLowerCase().replace(/\s+/g, '-')}-${findings.length}`,
                        severity: severity as Finding['severity'],
                        title: `Exposed ${name}`,
                        description: `Found a potential ${name} exposed in client-side code. This could allow attackers to access your services.`,
                        recommendation: `Immediately revoke this key and generate a new one. Never expose secret keys in client-side code. Use environment variables and server-side API routes instead.`,
                        location,
                        evidence: redactSecret(secret),
                    });
                }
            }
        }

        // Calculate score
        let score = 100;
        for (const finding of findings) {
            switch (finding.severity) {
                case 'critical': score -= 30; break;
                case 'high': score -= 20; break;
                case 'medium': score -= 10; break;
                case 'low': score -= 5; break;
            }
        }

        const result: ScanResult = {
            scannerType: 'api-key-leak',
            score: Math.max(0, Math.min(100, score)),
            findings,
            sourcesScanned: sources.length,
            scannedAt: new Date().toISOString(),
            url,
        };

        return new Response(JSON.stringify(result), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return new Response(
            JSON.stringify({
                scannerType: 'api-key-leak',
                score: 0,
                error: errorMessage,
                findings: [{
                    id: 'scan-failed',
                    severity: 'critical',
                    title: 'Scan failed',
                    description: `Could not scan the target: ${errorMessage}`,
                    recommendation: 'Verify the URL is accessible and try again.',
                }],
                scannedAt: new Date().toISOString(),
            }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    }
});
