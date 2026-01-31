'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Zap,
    LayoutDashboard,
    Scan,
    Users,
    FileText,
    Settings,
    LogOut,
    Plus,
    ChevronDown,
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Scans', href: '/dashboard/scans', icon: Scan },
    { name: 'Competitors', href: '/dashboard/competitors', icon: Users },
    { name: 'Reports', href: '/dashboard/reports', icon: FileText },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    async function handleLogout() {
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border">
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
                        <Link href="/dashboard" className="flex items-center space-x-2">
                            <Zap className="h-7 w-7 text-primary" />
                            <span className="text-xl font-bold">VibeCheck</span>
                        </Link>
                    </div>

                    {/* New Scan Button */}
                    <div className="p-4">
                        <Button asChild className="w-full">
                            <Link href="/dashboard/scans/new">
                                <Plus className="mr-2 h-4 w-4" />
                                New Scan
                            </Link>
                        </Button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href ||
                                (item.href !== '/dashboard' && pathname.startsWith(item.href));

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                            : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                                        }`}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <Separator />

                    {/* User Menu */}
                    <div className="p-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="w-full justify-start gap-3 px-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                                            U
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="flex-1 text-left text-sm truncate">
                                        User
                                    </span>
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56">
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/settings">
                                        <Settings className="mr-2 h-4 w-4" />
                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="pl-64">
                <div className="min-h-screen">
                    {children}
                </div>
            </main>
        </div>
    );
}
