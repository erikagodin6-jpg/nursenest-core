# Hotfix: prevent duplicate subscription checkout processing

**Branch:** `hotfix/billing-prevent-duplicate-subscriptions`

## Root cause

1. Checkout allowed a new Stripe Checkout Session while the user already had a billable `Subscription` (`ACTIVE`, `GRACE`, `PAST_DUE`). Each Checkout can create a new `sub_…`; DB uniqueness is on `stripeSubscriptionId`, not per user.
2. `stripe.checkout.sessions.create` lacked an **idempotency key**, so retries/double-submit could multiply sessions.

Webhooks already dedupe via **StripeWebhookEvent** (event id) and upsert by **stripeSubscriptionId**.

## Implementation summary

- **409** `already_subscribed` + `billingPortalRedirectPath: /app/account/billing` when blocking subscription exists.
- **`sessions.create(body, { idempotencyKey })`** using `buildCheckoutSubscriptionIdempotencyKey(userId, priceId)`.
- **`stripeCustomerId: { not: null }`** for customer reuse.
- Metrics: `recordCheckoutFailure("already_subscribed")`; diagnostics `CHECKOUT_ALREADY_SUBSCRIBED_CODE`.

## Migration

**None.** `stripeSubscriptionId @unique` and `StripeWebhookEvent` PK already exist.

## Tests

- `npm run typecheck:critical`
- `npm run test:unit:stripe`

## Operator checklist (production)

1. Stripe Dashboard: duplicate `sub_…` per customer — cancel/refund per finance policy.
2. Confirm entitlements match intended subscription after cleanup.
3. Watch metrics/audit for `already_subscribed` after deploy.

## Remaining risks

- Cancelled-only users may still checkout (intended).
- Enforcing one row per user at DB level would be a separate product decision.

