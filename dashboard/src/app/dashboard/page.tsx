import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Shield,
    Key,
    Search,
    Plus,
    ArrowRight,
    TrendingUp,
    Clock,
    AlertTriangle,
} from 'lucide-react';

// Placeholder data - would come from Supabase
const stats = [
    { label: 'Total Scans', value: '12', change: '+3 this month', icon: Search },
    { label: 'Security Issues', value: '5', change: '2 critical', icon: Shield, alert: true },
    { label: 'Leaked Keys Found', value: '1', change: 'AWS key detected', icon: Key, alert: true },
    { label: 'SEO Score Avg', value: '76', change: '+12 improvement', icon: TrendingUp },
];

const recentScans = [
    {
        id: '1',
        url: 'myapp.vercel.app',
        status: 'completed',
        score: 72,
        scannedAt: '2 hours ago',
        issues: { critical: 1, high: 2, medium: 5 },
    },
    {
        id: '2',
        url: 'startup-landing.com',
        status: 'completed',
        score: 85,
        scannedAt: '1 day ago',
        issues: { critical: 0, high: 1, medium: 3 },
    },
    {
        id: '3',
        url: 'side-project.dev',
        status: 'running',
        score: null,
        scannedAt: 'Just now',
        issues: null,
    },
];

function getScoreColor(score: number) {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
}

export default function DashboardPage() {
    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Overview of your website security and performance
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/scans/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Scan
                    </Link>
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.label}
                            </CardTitle>
                            <stat.icon className={`h-5 w-5 ${stat.alert ? 'text-orange-500' : 'text-muted-foreground'}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stat.value}</div>
                            <p className={`text-sm mt-1 ${stat.alert ? 'text-orange-500' : 'text-muted-foreground'}`}>
                                {stat.change}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Scans */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Recent Scans</CardTitle>
                        <CardDescription>Your latest website scans and their results</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/dashboard/scans">
                            View all
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentScans.map((scan) => (
                            <div
                                key={scan.id}
                                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                                        {scan.status === 'running' ? (
                                            <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <span className={`text-xl font-bold ${getScoreColor(scan.score!)}`}>
                                                {scan.score}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium">{scan.url}</p>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            {scan.scannedAt}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {scan.status === 'completed' && scan.issues && (
                                        <div className="flex gap-2">
                                            {scan.issues.critical > 0 && (
                                                <Badge variant="destructive" className="gap-1">
                                                    <AlertTriangle className="h-3 w-3" />
                                                    {scan.issues.critical}
                                                </Badge>
                                            )}
                                            {scan.issues.high > 0 && (
                                                <Badge variant="secondary" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
                                                    {scan.issues.high} high
                                                </Badge>
                                            )}
                                            {scan.issues.medium > 0 && (
                                                <Badge variant="secondary">
                                                    {scan.issues.medium} medium
                                                </Badge>
                                            )}
                                        </div>
                                    )}

                                    {scan.status === 'running' && (
                                        <Badge variant="secondary">Scanning...</Badge>
                                    )}

                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/dashboard/scans/${scan.id}`}>
                                            View
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                    <CardContent className="pt-6">
                        <Shield className="h-10 w-10 text-purple-500 mb-4" />
                        <h3 className="font-semibold text-lg mb-2">Security Deep Dive</h3>
                        <p className="text-muted-foreground text-sm mb-4">
                            Run a comprehensive security audit on your website
                        </p>
                        <Button variant="secondary" size="sm" asChild>
                            <Link href="/dashboard/scans/new?type=security">Start Scan</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
                    <CardContent className="pt-6">
                        <Key className="h-10 w-10 text-amber-500 mb-4" />
                        <h3 className="font-semibold text-lg mb-2">API Key Check</h3>
                        <p className="text-muted-foreground text-sm mb-4">
                            Scan for exposed API keys and credentials
                        </p>
                        <Button variant="secondary" size="sm" asChild>
                            <Link href="/dashboard/scans/new?type=api_keys">Start Scan</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                    <CardContent className="pt-6">
                        <Search className="h-10 w-10 text-green-500 mb-4" />
                        <h3 className="font-semibold text-lg mb-2">SEO Analysis</h3>
                        <p className="text-muted-foreground text-sm mb-4">
                            Check your site&apos;s SEO health and get recommendations
                        </p>
                        <Button variant="secondary" size="sm" asChild>
                            <Link href="/dashboard/scans/new?type=seo">Start Scan</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
