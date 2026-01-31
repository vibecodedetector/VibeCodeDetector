---
name: Stripe Billing Integration
description: Manage Stripe products, prices, subscriptions, and payment links for VibeCheck pricing tiers
---

# Stripe Billing Integration

This skill provides guidance for integrating Stripe billing with VibeCheck's pricing tiers.

## VibeCheck Pricing Tiers

| Tier | Price | Scans/Month | Key Features |
|------|-------|-------------|--------------|
| **Free** | $0 | 3 | Basic security, SEO overview |
| **Starter** | $29/month | 25 | Full security, API leak detection, PDF reports |
| **Professional** | $79/month | 100 | Legal compliance, AI detection, 3 competitors |
| **Enterprise** | $199/month | Unlimited | White-label, unlimited competitors, 5 seats |

## Setting Up Products

### Create Products for Each Tier

```tool
mcp_stripe_create_product
name: VibeCheck Starter
description: 25 scans/month with full security scanner, complete SEO audit, and API key leak detection
```

### Create Prices

```tool
mcp_stripe_create_price
product: <product_id>
unit_amount: 2900  # $29.00 in cents
currency: usd
```

## Managing Subscriptions

### List All Subscriptions

```tool
mcp_stripe_list_subscriptions
limit: 10
```

### List Customer Subscriptions

```tool
mcp_stripe_list_subscriptions
customer: <customer_id>
```

### Cancel a Subscription

```tool
mcp_stripe_cancel_subscription
subscription: <subscription_id>
```

### Update Subscription (Change Tier)

```tool
mcp_stripe_update_subscription
subscription: <subscription_id>
items: [
  {"id": "<existing_item_id>", "deleted": true},
  {"price": "<new_price_id>"}
]
proration_behavior: create_prorations
```

## Payment Links

Create payment links for easy checkout:

```tool
mcp_stripe_create_payment_link
price: <price_id>
quantity: 1
redirect_url: https://vibecheck.app/dashboard?session={CHECKOUT_SESSION_ID}
```

## Customer Management

### Create a Customer

```tool
mcp_stripe_create_customer
name: <customer_name>
email: <customer_email>
```

### List Customers

```tool
mcp_stripe_list_customers
limit: 10
email: <optional_email_filter>
```

## Invoicing

### Create an Invoice

```tool
mcp_stripe_create_invoice
customer: <customer_id>
days_until_due: 7
```

### Add Invoice Items

```tool
mcp_stripe_create_invoice_item
customer: <customer_id>
price: <price_id>
invoice: <invoice_id>
```

### Finalize Invoice

```tool
mcp_stripe_finalize_invoice
invoice: <invoice_id>
```

## Coupons and Discounts

### Create a Percentage Coupon

```tool
mcp_stripe_create_coupon
name: Launch Special 20% Off
percent_off: 20
duration: repeating
duration_in_months: 3
```

### Create an Amount Coupon

```tool
mcp_stripe_create_coupon
name: $10 Off First Month
amount_off: 1000  # $10.00 in cents
currency: USD
duration: once
```

## Refunds

```tool
mcp_stripe_create_refund
payment_intent: <payment_intent_id>
amount: <optional_partial_amount_in_cents>
```

## Checking Balance

```tool
mcp_stripe_retrieve_balance
```

## Subscription Tier Mapping

When syncing with Supabase, map Stripe price IDs to tier names:

```typescript
const TIER_MAPPING = {
  'price_xxx_free': { tier: 'free', scansLimit: 3 },
  'price_xxx_starter': { tier: 'starter', scansLimit: 25 },
  'price_xxx_professional': { tier: 'professional', scansLimit: 100 },
  'price_xxx_enterprise': { tier: 'enterprise', scansLimit: -1 }, // unlimited
};
```

## Webhook Events to Handle

Configure webhooks for these events:

1. `customer.subscription.created` - Create/update user profile
2. `customer.subscription.updated` - Update tier and limits
3. `customer.subscription.deleted` - Revert to free tier
4. `invoice.payment_succeeded` - Reset monthly scan count
5. `invoice.payment_failed` - Send notification, grace period

## Documentation Reference

For implementation questions:

```tool
mcp_stripe_search_stripe_documentation
question: <your_integration_question>
language: node
```
