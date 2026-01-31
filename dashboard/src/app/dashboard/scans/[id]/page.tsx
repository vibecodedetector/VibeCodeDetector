import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    ArrowLeft,
    ExternalLink,
    Shield,
    Key,
    Search,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Clock,
    Download,
    RefreshCw,
} from 'lucide-react';

// Demo scan data - would come from Supabase
const scan = {
    id: 'demo',
    url: 'myapp.vercel.app',
    status: 'completed',
    createdAt: '2026-01-31T15:00:00Z',
    completedAt: '2026-01-31T15:00:28Z',
    scanTypes: ['security', 'seo', 'api_keys'],
    results: {
        security: {
            score: 68,
            findings: [
                { severity: 'critical', title: 'Missing Content-Security-Policy header', description: 'CSP header not found. This helps prevent XSS attacks.' },
                { severity: 'high', title: 'X-Frame-Options header missing', description: 'Without this header, your site may be vulnerable to clickjacking.' },
                { severity: 'high', title: 'No rate limiting detected', description: 'API endpoints may be vulnerable to brute force attacks.' },
                { severity: 'medium', title: 'Referrer-Policy not set', description: 'Consider setting a strict referrer policy.' },
                { severity: 'medium', title: 'Permissions-Policy missing', description: 'This header controls browser features.' },
            ],
        },
        seo: {
            score: 78,
            findings: [
                { severity: 'medium', title: 'Meta description too short', description: 'Current length: 45 chars. Recommended: 120-160 chars.' },
                { severity: 'medium', title: 'Missing Open Graph image', description: 'Add og:image for better social sharing.' },
                { severity: 'low', title: 'No structured data found', description: 'Consider adding JSON-LD schema for rich snippets.' },
            ],
        },
        api_keys: {
            score: 60,
            findings: [
                { severity: 'critical', title: 'AWS Access Key exposed', description: 'Found AKIA... pattern in bundle.js. Revoke immediately!' },
                { severity: 'medium', title: 'Supabase anon key in client code', description: 'This is expected but ensure RLS policies are configured.' },
            ],
        },
    },
};

function getScoreColor(score: number) {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
}

function getScoreBg(score: number) {
    if (score >= 80) return 'bg-green-500/10';
    if (score >= 60) return 'bg-yellow-500/10';
    if (score >= 40) return 'bg-orange-500/10';
    return 'bg-red-500/10';
}

function getSeverityStyles(severity: string) {
    switch (severity) {
        case 'critical':
            return { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' };
        case 'high':
            return { icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' };
        case 'medium':
            return { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' };
        default:
            return { icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
    }
}

const scannerIcons = {
    security: Shield,
    seo: Search,
    api_keys: Key,
};

const scannerNames = {
    security: 'Security Scanner',
    seo: 'SEO Analyzer',
    api_keys: 'API Key Detector',
};

export default function ScanDetailsPage() {
    const overallScore = Math.round(
        (scan.results.security.score + scan.results.seo.score + scan.results.api_keys.score) / 3
    );

    const totalFindings = {
        critical: 2,
        high: 2,
        medium: 4,
        low: 1,
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/dashboard/scans"
                    className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Scans
                </Link>

                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold">{scan.url}</h1>
                            <a
                                href={`https://${scan.url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <ExternalLink className="h-5 w-5" />
                            </a>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                Scanned on Jan 31, 2026 at 3:00 PM
                            </div>
                            <Badge variant="secondary">Completed in 28s</Badge>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Export PDF
                        </Button>
                        <Button>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Rescan
                        </Button>
                    </div>
                </div>
            </div>

            {/* Score Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className={getScoreBg(overallScore)}>
                    <CardContent className="pt-6 text-center">
                        <div className={`text-5xl font-bold ${getScoreColor(overallScore)}`}>
                            {overallScore}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">Overall Score</p>
                    </CardContent>
                </Card>

                {Object.entries(scan.results).map(([key, result]) => {
                    const Icon = scannerIcons[key as keyof typeof scannerIcons];
                    return (
                        <Card key={key}>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between mb-2">
                                    <Icon className="h-5 w-5 text-muted-foreground" />
                                    <span className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
                                        {result.score}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {scannerNames[key as keyof typeof scannerNames]}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {result.findings.length} issues found
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Findings Summary */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Findings Summary</CardTitle>
                    <CardDescription>Issues found during the scan, grouped by severity</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-red-500"></div>
                            <span className="font-medium">{totalFindings.critical} Critical</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                            <span className="font-medium">{totalFindings.high} High</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                            <span className="font-medium">{totalFindings.medium} Medium</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                            <span className="font-medium">{totalFindings.low} Low</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Results by Scanner */}
            {Object.entries(scan.results).map(([key, result]) => {
                const Icon = scannerIcons[key as keyof typeof scannerIcons];

                return (
                    <Card key={key} className="mb-6">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Icon className="h-6 w-6" />
                                    <div>
                                        <CardTitle>{scannerNames[key as keyof typeof scannerNames]}</CardTitle>
                                        <CardDescription>{result.findings.length} issues found</CardDescription>
                                    </div>
                                </div>
                                <div className={`text-3xl font-bold ${getScoreColor(result.score)}`}>
                                    {result.score}/100
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {result.findings.map((finding, index) => {
                                    const styles = getSeverityStyles(finding.severity);
                                    const SeverityIcon = styles.icon;

                                    return (
                                        <div
                                            key={index}
                                            className={`p-4 rounded-lg border ${styles.bg} ${styles.border}`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <SeverityIcon className={`h-5 w-5 mt-0.5 ${styles.color}`} />
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-medium">{finding.title}</h4>
                                                        <Badge variant="outline" className="text-xs capitalize">
                                                            {finding.severity}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        {finding.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
