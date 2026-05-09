# Billing duplicate-charge audit (P0)

**Branch:** `hotfix/billing-prevent-duplicate-subscriptions`
**Repo:** `nursenest-core` (production app source under `nursenest-core/nursenest-core/`)
**Date:** 2026-05-08

## Phase 1 — Inventory of Stripe / billing surfaces

Server-side entry points (Next.js App Router):

| Surface | Path | Purpose |
|---|---|---|
| Checkout session create | `nursenest-core/src/app/api/subscriptions/checkout/route.ts` (POST) | Server-only price resolution → `stripe.checkout.sessions.create` |
| Stripe webhook | `nursenest-core/src/app/api/subscriptions/webhook/route.ts` (POST) | Verify signature → claim `evt_…` → apply via `applyStripeWebhookEvent` |
| Customer portal | `nursenest-core/src/app/api/billing/portal/route.ts` (POST) | Looks up most-recent `Subscription.stripeCustomerId` → `stripe.billingPortal.sessions.create` |
| Cancel subscription | `nursenest-core/src/app/api/billing/cancel-subscription/route.ts` | Cancel via API |
| Admin reconcile | `nursenest-core/src/app/api/admin/billing/stripe-reconcile/route.ts` | Admin-only Stripe reconcile |
| Cron reconcile | `nursenest-core/src/app/api/cron/stripe-reconcile/route.ts` | Periodic Stripe → DB reconcile |
| Stripe SDK client | `nursenest-core/src/lib/stripe/stripe-client.ts` | Cached `Stripe` singleton |
| Webhook handlers | `nursenest-core/src/lib/stripe/apply-stripe-webhook-event.ts` | `checkout.session.completed`, `customer.subscription.{created,updated,deleted}`, `invoice.payment_{succeeded,failed}`, `charge.refunded` |
| Webhook idempotency | `nursenest-core/src/lib/stripe/stripe-webhook-idempotency.ts` | `claimStripeWebhookEventOrDuplicate` / `releaseStripeWebhookEventClaim` (claim-first via `StripeWebhookEvent`) |
| Webhook signature verify | `nursenest-core/src/lib/stripe/stripe-webhook-verify.ts` | `constructStripeWebhookEvent` |
| Webhook event policy | `nursenest-core/src/lib/stripe/stripe-webhook-event-policy.ts` | Allowlist of handled event types |
| DB reconcile (orphan + mirror) | `nursenest-core/src/lib/subscriptions/stripe-subscription-reconcile.ts` | Owner of `persistStripeSubscriptionMirrorForUser`, `reconcileUserSubscriptionFromStripe` |
| Pricing maps | `nursenest-core/src/lib/stripe/pricing-map.ts`, `nursenest-core/src/lib/pricing/regional-pricing-map.ts` | Server-resolved Stripe price IDs |

DB schema (`nursenest-core/nursenest-core/prisma/schema.prisma`):

- `model Subscription` (line 706) with `stripeSubscriptionId String @unique` (line 711). Status enum at line 3115: `ACTIVE | GRACE | CANCELLED | PAST_DUE`. Note: Stripe `trialing` already maps to DB `ACTIVE` via `mapStripeSubscriptionStatus`.
- `model StripeWebhookEvent { id String @id ... }` (line 735). Used as the claim row for webhook event-id idempotency.
- `model StripeOwnerPaidSubscriptionNotify` (line 741). Notification dedupe.

## Phase 2 — Risk doc (failure modes A–F)

### A. Double-click / fast retry on the “Subscribe” button (server-side)
- **Where it strikes:** `nursenest-core/src/app/api/subscriptions/checkout/route.ts` calls `stripe.checkout.sessions.create` on every POST without an idempotency key. Two near-simultaneous POSTs (browser double click, link prefetch, retry on 502) produce two distinct Stripe Checkout Sessions backed by the same user.
- **Severity:** High. Each Session is a path to a real subscription if the user completes either; if both are completed (rare but observed in practice during retries) Stripe creates two paid subscriptions for one user.
- **Pre-hotfix state:** ❌ No idempotency key, no in-flight guard.

### B. Active subscriber re-enters checkout (or completes a stale session)
- **Where it strikes:** Same checkout route. There is **no DB precheck** for an existing `Subscription` row in `ACTIVE`/`PAST_DUE`/`GRACE` for the user. Existing subscribers can hit `/pricing` again and start a brand-new checkout that becomes a second paid Stripe subscription on the same `stripeCustomerId`. End result: customer with two concurrent subscriptions (and two charges).
- **Severity:** High. Primary “triple-charge” vector when combined with (A).
- **Pre-hotfix state:** ❌ No precheck. The route only blocks demo users and free pathways.
- **Note:** `recordCheckoutFailure`’s `CheckoutFailureReason` union (`nursenest-core/src/lib/observability/production-signal-metrics.ts`) already includes `"already_subscribed"` — the metric was scaffolded but never wired.

### C. Stripe webhook duplicate delivery
- **Where it strikes:** `nursenest-core/src/app/api/subscriptions/webhook/route.ts`.
- **Pre-hotfix state:** ✅ **Already protected.** Route claim-first inserts `StripeWebhookEvent { id: evt_… }` before running handlers; on `Prisma P2002` it returns `200 { ok: true, duplicate: true }`. Handlers are upserts keyed off Stripe ids; `releaseStripeWebhookEventClaim` runs on handler exception so Stripe’s own retry loop is not permanently deduped.

### D. DB-level uniqueness on Stripe subscription id
- **Pre-hotfix state:** ✅ `Subscription.stripeSubscriptionId @unique` is in place. Two distinct `sub_…` ids for the same user remain distinct rows — this is *correct* schema-wise, but it does NOT prevent (B) above; the prevention has to happen *before* `checkout.sessions.create`.

### E. Duplicate Stripe `Customer` per user
- **Where it strikes:** Same checkout route. Existing reuse logic queries `prisma.subscription.findFirst({ where: { userId, stripeCustomerId: { not: "" } } })`, but `Subscription.stripeCustomerId` is `String?` (nullable), so `{ not: "" }` does **not filter null rows**. The most recent row could be `null` (e.g., from an orphan reconcile) which causes the lookup to skip a perfectly good older customer id, and Stripe creates a brand-new customer.
- **Severity:** Medium (data hygiene, billing dashboard noise, multiple customer rows for one human, more risk of orphan subs).
- **Pre-hotfix state:** ⚠️ Partially correct. Filter must be `{ not: null }` (matching the working portal route filter at `nursenest-core/src/app/api/billing/portal/route.ts:31`).

### F. Webhook handler creates a row from an orphan subscription **without** customer id reuse
- **Where it strikes:** `apply-stripe-webhook-event.ts → applyCustomerSubscriptionUpsert → resolveUserIdForOrphanStripeSubscription → persistStripeSubscriptionMirrorForUser`.
- **Pre-hotfix state:** ✅ Reconciler exists; idempotent upsert keyed by `stripeSubscriptionId @unique`. No change needed for this hotfix; flagged here so triage understands which path repairs orphan rows.

### Failure-mode → fix mapping

| Failure mode | Mitigation in this hotfix | Files touched |
|---|---|---|
| A. Double-click race | Stripe **idempotency key** `checkout-sub-v1:${userId}:${priceId}` on `checkout.sessions.create` | `src/app/api/subscriptions/checkout/route.ts` |
| B. Active subscriber re-enters checkout | Server precheck for `Subscription` rows in `ACTIVE`/`PAST_DUE`/`GRACE` → 409 with `already_subscribed`, redirect hint to `/app/account/billing` | `src/app/api/subscriptions/checkout/route.ts`, `src/lib/stripe/checkout-api-diagnostics.ts` |
| C. Webhook duplicate delivery | Already enforced by claim-first `StripeWebhookEvent` row + 200-with-duplicate replay path. **No change.** | (verified) |
| D. DB uniqueness on `stripeSubscriptionId` | Already in schema (`@unique`). **No change, no migration.** | (verified) |
| E. Duplicate Stripe customer per user | Replace the `{ not: "" }` filter with `{ not: null }` in checkout to match the portal’s working filter | `src/app/api/subscriptions/checkout/route.ts` |
| F. Orphan subscription reconcile | Already covered by `persistStripeSubscriptionMirrorForUser` + unique constraint. **No change.** | (verified) |

## Idempotency-key choice (deterministic)

Format chosen: `checkout-sub-v1:${userId}:${priceId}`.

- **Why include `priceId`:** Allows distinct keys for genuinely different products (CA vs US, monthly vs yearly, regional pricing). Two requests for the same user+price collapse on Stripe’s side to a single Session within the 24h idempotency window.
- **Why not include a wall clock / billing cycle:** A near-real-time double click is the dominant failure case; a 24h Stripe idempotency window is more than sufficient. Any “user really wants a different sub later” case is correctly handled by the active-subscription guard (returning 409) and the customer portal.
- **Why prefix `v1`:** Lets us bump the namespace without colliding with cached Stripe responses if we ever need to retroactively change the canonicalization.

## Phase 4 — Webhook + DB

- Webhook dedupe is **already implemented** via `StripeWebhookEvent.id @id` and the claim-first pattern.
- `Subscription.stripeSubscriptionId @unique` already prevents duplicate `sub_…` rows from concurrent applications.
- **No migration is added by this hotfix.** A migration would be the highest-risk change and is unnecessary because all DB-level invariants already exist.

## Phase 5 — Tests

Static contract tests (Node `node:test` + `tsx`, matching the existing pattern in `stripe-webhook-policy.test.ts` and `stripe-webhook-idempotency.contract.test.ts`):

- `nursenest-core/src/lib/stripe/checkout-duplicate-charge-protection.test.ts`
  - Active-subscription precheck imports `SubscriptionStatus` and queries `[ACTIVE, PAST_DUE, GRACE]`.
  - 409 response with `already_subscribed` code, `/app/account/billing` redirect hint, and `recordCheckoutFailure("already_subscribed", req)`.
  - `stripe.checkout.sessions.create` is called with a deterministic `idempotencyKey` derived from `userId` and `priceId`.
  - Customer reuse query uses `{ not: null }` (not `{ not: "" }`).
- Diagnostic export `CHECKOUT_ALREADY_SUBSCRIBED_CODE` lives in `nursenest-core/src/lib/stripe/checkout-api-diagnostics.ts` and matches the route response.

Wired into `npm run test:unit:stripe` so it runs as part of `qa:predeploy:low-memory`.
