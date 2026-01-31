import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, ExternalLink, Clock } from 'lucide-react';

// Placeholder data
const scans = [
    {
        id: '1',
        url: 'myapp.vercel.app',
        status: 'completed',
        score: 72,
        scanTypes: ['security', 'seo', 'api_keys'],
        createdAt: '2026-01-31T15:00:00Z',
        issues: { critical: 1, high: 2, medium: 5 },
    },
    {
        id: '2',
        url: 'startup-landing.com',
        status: 'completed',
        score: 85,
        scanTypes: ['security', 'seo'],
        createdAt: '2026-01-30T10:30:00Z',
        issues: { critical: 0, high: 1, medium: 3 },
    },
    {
        id: '3',
        url: 'side-project.dev',
        status: 'running',
        score: null,
        scanTypes: ['security', 'seo', 'api_keys'],
        createdAt: '2026-01-31T17:30:00Z',
        issues: null,
    },
    {
        id: '4',
        url: 'portfolio-site.io',
        status: 'completed',
        score: 92,
        scanTypes: ['seo'],
        createdAt: '2026-01-28T08:00:00Z',
        issues: { critical: 0, high: 0, medium: 2 },
    },
];

function getScoreColor(score: number) {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
}

function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function ScansPage() {
    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Scans</h1>
                    <p className="text-muted-foreground mt-1">
                        View and manage all your website scans
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/scans/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Scan
                    </Link>
                </Button>
            </div>

            {/* Usage Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Scans This Month</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">4 / 25</div>
                        <p className="text-sm text-muted-foreground">21 remaining</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Average Score</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-500">83</div>
                        <p className="text-sm text-muted-foreground">+5 from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Total Issues Found</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">12</div>
                        <p className="text-sm text-muted-foreground">1 critical, 3 high</p>
                    </CardContent>
                </Card>
            </div>

            {/* Scans Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Scans</CardTitle>
                    <CardDescription>Complete history of all your website scans</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Website</TableHead>
                                <TableHead>Score</TableHead>
                                <TableHead>Issues</TableHead>
                                <TableHead>Scan Types</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {scans.map((scan) => (
                                <TableRow key={scan.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{scan.url}</span>
                                            <a
                                                href={`https://${scan.url}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-muted-foreground hover:text-foreground"
                                            >
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {scan.status === 'running' ? (
                                            <div className="flex items-center gap-2">
                                                <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                                <span className="text-muted-foreground">Scanning</span>
                                            </div>
                                        ) : (
                                            <span className={`text-xl font-bold ${getScoreColor(scan.score!)}`}>
                                                {scan.score}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {scan.issues ? (
                                            <div className="flex gap-1.5">
                                                {scan.issues.critical > 0 && (
                                                    <Badge variant="destructive" className="text-xs">
                                                        {scan.issues.critical} critical
                                                    </Badge>
                                                )}
                                                {scan.issues.high > 0 && (
                                                    <Badge variant="secondary" className="text-xs bg-orange-500/10 text-orange-500">
                                                        {scan.issues.high} high
                                                    </Badge>
                                                )}
                                                {scan.issues.critical === 0 && scan.issues.high === 0 && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        {scan.issues.medium} medium
                                                    </Badge>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            {scan.scanTypes.map((type) => (
                                                <Badge key={type} variant="outline" className="text-xs capitalize">
                                                    {type.replace('_', ' ')}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-muted-foreground text-sm">
                                            <Clock className="h-3 w-3" />
                                            {formatDate(scan.createdAt)}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/dashboard/scans/${scan.id}`}>View Details</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
