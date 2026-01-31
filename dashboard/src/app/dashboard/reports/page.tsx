import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download } from 'lucide-react';

export default function ReportsPage() {
    return (
        <div className="p-8">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Reports</h1>
                    <p className="text-muted-foreground mt-1">
                        Download and share scan reports
                    </p>
                </div>
            </div>

            <Card>
                <CardContent className="py-16 text-center">
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">PDF Reports</h3>
                    <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                        Generate professional PDF reports of your scans to share with your team
                        or clients. Available on Starter plans and above.
                    </p>
                    <Badge variant="outline" className="text-sm">
                        Upgrade to Starter for PDF reports
                    </Badge>
                </CardContent>
            </Card>
        </div>
    );
}
