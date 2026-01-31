---
name: Supabase Edge Functions
description: Deploy and manage Supabase Edge Functions for lightweight scanner operations
---

# Supabase Edge Functions

This skill covers deploying Supabase Edge Functions for VibeCheck's serverless operations.

## Use Cases

Edge Functions are ideal for:
- Lightweight scanner operations (security headers, basic checks)
- Webhook handlers (Stripe, alerts)
- API proxy endpoints
- Scheduled tasks (cron-based monitoring)

## Basic Function Template

```typescript
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req: Request) => {
  // CORS headers
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    const { targetUrl } = await req.json();
    
    // Your logic here
    const result = await performScan(targetUrl);
    
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
```

## Deploy Edge Function

```tool
mcp_supabase-mcp-server_deploy_edge_function
project_id: <project_id>
name: <function_name>
entrypoint_path: index.ts
verify_jwt: true
files: [{"name": "index.ts", "content": "<function_code>"}]
```

## List Existing Functions

```tool
mcp_supabase-mcp-server_list_edge_functions
project_id: <project_id>
```

## Get Function Source

```tool
mcp_supabase-mcp-server_get_edge_function
project_id: <project_id>
function_slug: <function_name>
```

## Check Function Logs

```tool
mcp_supabase-mcp-server_get_logs
project_id: <project_id>
service: edge-function
```

---

## Example: Security Headers Scanner

```typescript
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SECURITY_HEADERS = [
  { name: 'Content-Security-Policy', weight: 20, severity: 'high' },
  { name: 'X-Frame-Options', weight: 15, severity: 'medium' },
  { name: 'X-Content-Type-Options', weight: 10, severity: 'medium' },
  { name: 'Referrer-Policy', weight: 10, severity: 'low' },
  { name: 'Permissions-Policy', weight: 10, severity: 'low' },
  { name: 'Strict-Transport-Security', weight: 20, severity: 'high' },
  { name: 'X-XSS-Protection', weight: 5, severity: 'low' },
];

interface Finding {
  header: string;
  present: boolean;
  value?: string;
  severity: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    const { targetUrl } = await req.json();
    
    // Fetch the target URL headers
    const response = await fetch(targetUrl, { method: 'HEAD' });
    
    const findings: Finding[] = [];
    let totalScore = 100;
    
    for (const header of SECURITY_HEADERS) {
      const value = response.headers.get(header.name);
      const present = !!value;
      
      findings.push({
        header: header.name,
        present,
        value: value ?? undefined,
        severity: present ? 'pass' : header.severity,
      });
      
      if (!present) {
        totalScore -= header.weight;
      }
    }
    
    return new Response(JSON.stringify({
      score: Math.max(0, totalScore),
      findings,
      scannedAt: new Date().toISOString(),
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message,
      score: 0,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
```

---

## Example: Stripe Webhook Handler

```typescript
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from 'npm:stripe@14';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!);
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

Deno.serve(async (req: Request) => {
  const signature = req.headers.get('stripe-signature')!;
  const body = await req.text();
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
  
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      
      // Get user by Stripe customer ID
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single();
        
      if (profile) {
        // Map price to tier
        const priceId = subscription.items.data[0].price.id;
        const tier = mapPriceToTier(priceId);
        
        await supabase
          .from('user_profiles')
          .update({
            subscription_tier: tier.name,
            scans_limit: tier.limit,
          })
          .eq('id', profile.id);
      }
      break;
    }
    
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single();
        
      if (profile) {
        await supabase
          .from('user_profiles')
          .update({
            subscription_tier: 'free',
            scans_limit: 3,
          })
          .eq('id', profile.id);
      }
      break;
    }
  }
  
  return new Response(JSON.stringify({ received: true }));
});

function mapPriceToTier(priceId: string) {
  const mapping: Record<string, { name: string; limit: number }> = {
    'price_starter': { name: 'starter', limit: 25 },
    'price_professional': { name: 'professional', limit: 100 },
    'price_enterprise': { name: 'enterprise', limit: -1 },
  };
  return mapping[priceId] ?? { name: 'free', limit: 3 };
}
```

---

## Multi-File Functions

For complex functions with dependencies:

```tool
mcp_supabase-mcp-server_deploy_edge_function
project_id: <project_id>
name: complex-scanner
entrypoint_path: index.ts
verify_jwt: true
files: [
  {"name": "index.ts", "content": "<main_code>"},
  {"name": "utils.ts", "content": "<utility_functions>"},
  {"name": "patterns.ts", "content": "<detection_patterns>"},
  {"name": "deno.json", "content": "{\"imports\": {}}"}
]
```

---

## Environment Variables

Edge functions access secrets via `Deno.env.get()`:

```typescript
const apiKey = Deno.env.get('SOME_API_KEY');
```

Set secrets through the Supabase dashboard or CLI.

## Authentication

When `verify_jwt: true`:
- Function expects `Authorization: Bearer <jwt>` header
- Invalid/missing JWT returns 401
- User info available in request context

For public functions (webhooks), set `verify_jwt: false`.

## Best Practices

1. **Keep functions focused** - One responsibility per function
2. **Handle errors gracefully** - Return meaningful error responses
3. **Use TypeScript** - Type safety and better DX
4. **Log sparingly** - Logs cost money, use console.log judiciously
5. **Set timeouts** - Don't let functions hang indefinitely
6. **CORS** - Always handle OPTIONS requests for browser calls
