import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users } from 'lucide-react';

export default function CompetitorsPage() {
    return (
        <div className="p-8">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Competitors</h1>
                    <p className="text-muted-foreground mt-1">
                        Track and analyze competitor websites
                    </p>
                </div>
                <Button disabled>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Competitor
                </Button>
            </div>

            <Card>
                <CardContent className="py-16 text-center">
                    <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Competitor Intelligence</h3>
                    <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                        Track your competitors&apos; technology stack, traffic estimates, and strategy.
                        Available on Professional and Enterprise plans.
                    </p>
                    <Badge variant="outline" className="text-sm">
                        Upgrade to Pro for competitor tracking
                    </Badge>
                </CardContent>
            </Card>
        </div>
    );
}
