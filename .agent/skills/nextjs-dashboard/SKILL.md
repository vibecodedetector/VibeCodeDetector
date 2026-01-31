---
name: Next.js Dashboard Development
description: Build and maintain the VibeCheck dashboard UI with Next.js, React, and Tailwind CSS
---

# Next.js Dashboard Development

This skill provides guidance for building the VibeCheck user dashboard with Next.js.

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 14+ (App Router) |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| State | React hooks + Supabase realtime |
| Auth | Supabase Auth |
| Forms | React Hook Form + Zod |

## Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── reset-password/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Dashboard home
│   │   ├── scans/
│   │   │   ├── page.tsx          # Scan history
│   │   │   ├── new/page.tsx      # New scan
│   │   │   └── [id]/page.tsx     # Scan details
│   │   ├── competitors/
│   │   │   └── page.tsx
│   │   ├── reports/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── api/
│   │   ├── scans/route.ts
│   │   └── webhooks/
│   │       └── stripe/route.ts
│   ├── layout.tsx
│   └── page.tsx                  # Landing page
├── components/
│   ├── ui/                       # shadcn components
│   ├── dashboard/
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   └── scan-card.tsx
│   ├── scans/
│   │   ├── scan-form.tsx
│   │   ├── scan-results.tsx
│   │   └── score-gauge.tsx
│   └── charts/
│       └── findings-chart.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── stripe.ts
│   └── utils.ts
├── hooks/
│   ├── use-user.ts
│   ├── use-scans.ts
│   └── use-subscription.ts
└── types/
    └── database.ts               # Generated Supabase types
```

## Project Initialization

```bash
# Create Next.js app
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Install dependencies
npm install @supabase/supabase-js @supabase/ssr stripe @stripe/stripe-js
npm install react-hook-form @hookform/resolvers zod
npm install recharts lucide-react

# Initialize shadcn/ui
npx -y shadcn@latest init
npx -y shadcn@latest add button card input form dialog sheet
```

## Supabase Client Setup

### Browser Client (`lib/supabase/client.ts`)

```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### Server Client (`lib/supabase/server.ts`)

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}
```

## Authentication Flow

### Login Page

```typescript
'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  
  async function handleLogin(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (!error) {
      router.push('/dashboard');
    }
  }
  
  // ... form implementation
}
```

### Protected Routes Middleware

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => cookies.forEach(c => response.cookies.set(c)),
      },
    }
  );
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return response;
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
```

## Dashboard Components

### Scan Score Gauge

```typescript
interface ScoreGaugeProps {
  score: number;
  label: string;
}

export function ScoreGauge({ score, label }: ScoreGaugeProps) {
  const getColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className={`text-4xl font-bold ${getColor(score)}`}>
        {score}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
```

### Findings Summary Card

```typescript
interface FindingsSummaryProps {
  findings: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export function FindingsSummary({ findings }: FindingsSummaryProps) {
  return (
    <div className="flex gap-4">
      <Badge variant="destructive">🔴 {findings.critical} Critical</Badge>
      <Badge variant="warning">🟠 {findings.high} High</Badge>
      <Badge variant="secondary">🟡 {findings.medium} Medium</Badge>
      <Badge variant="outline">🟢 {findings.low} Low</Badge>
    </div>
  );
}
```

## API Routes

### Create Scan

```typescript
// app/api/scans/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { targetUrl, scanTypes } = await request.json();
  
  // Check scan limits
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('scans_used, scans_limit')
    .eq('id', user.id)
    .single();
    
  if (profile && profile.scans_used >= profile.scans_limit) {
    return NextResponse.json({ error: 'Scan limit reached' }, { status: 403 });
  }
  
  // Create scan
  const { data: scan, error } = await supabase
    .from('scans')
    .insert({
      user_id: user.id,
      target_url: targetUrl,
      scan_types: scanTypes,
      status: 'pending',
    })
    .select()
    .single();
    
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  // Increment scans_used
  await supabase
    .from('user_profiles')
    .update({ scans_used: profile.scans_used + 1 })
    .eq('id', user.id);
  
  // TODO: Queue scan job
  
  return NextResponse.json(scan);
}
```

## Real-time Scan Updates

```typescript
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useScanStatus(scanId: string) {
  const [status, setStatus] = useState<string>('pending');
  const supabase = createClient();
  
  useEffect(() => {
    const channel = supabase
      .channel(`scan:${scanId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'scans',
          filter: `id=eq.${scanId}`,
        },
        (payload) => {
          setStatus(payload.new.status);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [scanId]);
  
  return status;
}
```

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Styling Guidelines

1. **Dark Mode First** - Design for dark mode, add light mode support
2. **Use CSS Variables** - Leverage Tailwind's CSS variable system
3. **Consistent Spacing** - Use Tailwind's spacing scale (p-4, gap-6, etc.)
4. **Responsive** - Mobile-first, use sm/md/lg breakpoints
5. **Animations** - Subtle transitions (150-300ms) for interactions

## Performance Tips

1. Use React Server Components where possible
2. Implement loading.tsx for streaming
3. Use Image component for optimized images
4. Lazy load heavy components (charts, editors)
5. Cache API responses with React Query or SWR
