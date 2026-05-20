# Phase 4 — Subscription & monetization integrity hardening

This document maps NurseNest billing and entitlement lifecycles, documents hardening delivered in this phase, lists tests and observability events, and provides an operator recovery runbook. Tier names follow Prisma enums (`TierCode`, `SubscriptionStatus`, `TrialStatus`). A VibeCheck truthpack was not present in this clone under `.vibecheck/truthpack/` — run `vibecheck truthpack` locally if your workspace uses it.

## 1. Lifecycle map (code anchors)

| Stage | Primary modules / routes |
| --- | --- |
| Checkout / session | `src/app/api/subscriptions/checkout/route.ts`, `src/lib/stripe/checkout-plan-metadata.ts` |
| Webhooks | `src/app/api/subscriptions/webhook/route.ts`, `src/lib/stripe/stripe-webhook-idempotency.ts`, `src/lib/stripe/apply-stripe-webhook-event.ts` |
| Reconcile / sync | `src/lib/stripe/stripe-subscription-reconciliation-run.ts`, `src/app/api/admin/billing/stripe-reconcile/route.ts`, cron `stripe-reconcile` |
| Entitlements | `src/lib/entitlements/get-user-access.ts`, `subscription-paid-access.ts`, `past-due-policy.ts` |
| Subscriber APIs | `src/lib/entitlements/require-subscriber-session.ts` |

## 2. Webhook idempotency

Claim-first insert on `StripeWebhookEvent`; P2002 → duplicate returns 200 `{duplicate:true}`. Handler failure releases claim for Stripe retry. Logs: `event_applied`, `duplicate_delivery_skipped` (with `durationMs`).

## 3. Tests

- `src/lib/billing/entitlement-drift-severity.test.ts`
- `src/lib/stripe/stripe-webhook-idempotency.contract.test.ts`
- `tests/e2e/paid-user/paid-unlock-smoke.spec.ts` (skip without env)
- `npm run test:unit:stripe` includes new files

## 4. Drift detection (report-only)

`src/lib/billing/entitlement-drift-signals.server.ts`; admin `GET /api/admin/billing/integrity-summary` with optional `?emitLog=1` → `entitlement_drift_suspected`.

## 5. Admin UI

`/admin` billing integrity card + banner; `/admin/subscriptions` drift panel + Stripe linkage columns.

## 6. Log events

`stripe_webhook/event_applied`, `stripe_webhook/duplicate_delivery_skipped`, `billing_sync/entitlement_reconcile_run_complete`, `entitlement/entitlement_drift_suspected`, `access/denied` (+ `outcome:premium_api_403`), `api_questions/premium_denied_freemium_exhausted`.

## 7. Recovery

Dry-run `POST /api/admin/billing/stripe-reconcile`; apply only super-tier + confirm header. Resend Stripe events when webhooks missed.

## 8. Validation

`npm run typecheck`, `npm run build`, `npm run test:unit:stripe`, `npm run qa:release-gate`, `npm run smoke:paid-unlock` (exit 0 skip without `E2E_PAID_SMOKE_*`).
