import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { url, scanTypes } = body;

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // Normalize URL
        const targetUrl = url.startsWith('http') ? url : `https://${url}`;

        // Run selected scanners
        const results: Record<string, unknown> = {};
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        // Get user's JWT for Edge Function authentication
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;

        const scannerPromises: Promise<void>[] = [];

        if (scanTypes?.includes('security') || !scanTypes) {
            scannerPromises.push(
                fetch(`${supabaseUrl}/functions/v1/security-headers-scanner`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ targetUrl }),
                })
                    .then(res => res.json())
                    .then(data => { results.security = data; })
                    .catch(err => { results.security = { error: err.message, score: 0 }; })
            );
        }

        if (scanTypes?.includes('api_keys') || !scanTypes) {
            scannerPromises.push(
                fetch(`${supabaseUrl}/functions/v1/api-key-scanner`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ targetUrl }),
                })
                    .then(res => res.json())
                    .then(data => { results.api_keys = data; })
                    .catch(err => { results.api_keys = { error: err.message, score: 0 }; })
            );
        }

        // Wait for all scanners to complete
        await Promise.all(scannerPromises);

        // Calculate overall score
        const scores = Object.values(results)
            .filter((r): r is { score: number } => typeof (r as { score?: number }).score === 'number')
            .map(r => r.score);

        const overallScore = scores.length > 0
            ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
            : 0;

        // Store scan in database
        const { data: scan, error: insertError } = await supabase
            .from('scans')
            .insert({
                user_id: user.id,
                url: targetUrl,
                status: 'completed',
                overall_score: overallScore,
                results,
                completed_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (insertError) {
            console.error('Failed to save scan:', insertError);
            // Still return results even if save fails
        }

        return NextResponse.json({
            scanId: scan?.id,
            url: targetUrl,
            overallScore,
            results,
            completedAt: new Date().toISOString(),
        });

    } catch (error) {
        console.error('Scan error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Scan failed' },
            { status: 500 }
        );
    }
}
