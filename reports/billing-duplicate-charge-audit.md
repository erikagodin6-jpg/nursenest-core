# Billing duplicate charge — inventory (Phase 1)

**App root:** `nursenest-core/nursenest-core`. **Date:** 2026-05-08.

## Entry points

| Area | Path |
|------|------|
| Checkout POST | `nursenest-core/src/app/api/subscriptions/checkout/route.ts` |
| Webhook | `nursenest-core/src/app/api/subscriptions/webhook/route.ts` |
| Apply events | `nursenest-core/src/lib/stripe/apply-stripe-webhook-event.ts` |
| Idempotency | `nursenest-core/src/lib/stripe/stripe-webhook-idempotency.ts` |
| Portal | `nursenest-core/src/app/api/billing/portal/route.ts` |
| Cancel | `nursenest-core/src/app/api/billing/cancel-subscription/route.ts` |

## Schema

- `Subscription.stripeSubscriptionId @unique`
- `StripeWebhookEvent.id` = Stripe `evt_…`

