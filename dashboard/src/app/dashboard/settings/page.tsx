import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Bell, User, Shield } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="p-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your account settings and preferences
                </p>
            </div>

            {/* Profile Settings */}
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <User className="h-5 w-5" />
                        <div>
                            <CardTitle>Profile</CardTitle>
                            <CardDescription>Your account information</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" defaultValue="User" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue="user@example.com" disabled />
                        </div>
                    </div>
                    <Button>Save Changes</Button>
                </CardContent>
            </Card>

            {/* Subscription */}
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5" />
                            <div>
                                <CardTitle>Subscription</CardTitle>
                                <CardDescription>Manage your billing and plan</CardDescription>
                            </div>
                        </div>
                        <Badge variant="secondary">Free Plan</Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border border-border p-4 mb-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-medium">Free Plan</h4>
                                <p className="text-sm text-muted-foreground">3 scans per month</p>
                            </div>
                            <Button>Upgrade</Button>
                        </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                        <p className="mb-2">Your usage this month:</p>
                        <div className="flex gap-4">
                            <span>Scans used: <strong>1 / 3</strong></span>
                            <span>Resets: <strong>Feb 1, 2026</strong></span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5" />
                        <div>
                            <CardTitle>Notifications</CardTitle>
                            <CardDescription>Configure how you receive alerts</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Email notifications</p>
                                <p className="text-sm text-muted-foreground">Receive scan results via email</p>
                            </div>
                            <Button variant="outline" size="sm">Configure</Button>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Slack integration</p>
                                <p className="text-sm text-muted-foreground">Get notified in Slack</p>
                            </div>
                            <Badge variant="outline">Pro</Badge>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Discord webhook</p>
                                <p className="text-sm text-muted-foreground">Send alerts to Discord</p>
                            </div>
                            <Badge variant="outline">Pro</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Security */}
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5" />
                        <div>
                            <CardTitle>Security</CardTitle>
                            <CardDescription>Manage your account security</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Change password</p>
                                <p className="text-sm text-muted-foreground">Update your password</p>
                            </div>
                            <Button variant="outline" size="sm">Change</Button>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Delete account</p>
                                <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
                            </div>
                            <Button variant="destructive" size="sm">Delete</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
