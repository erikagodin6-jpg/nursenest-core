# Allied subscription occupation migration

**Date:** 2026-05-11 (updated)

## Goal

Subscribers without resolved **allied occupation** must not receive all allied occupations. Complete selection or admin repair.

## Detection

- **Entitlement:** `reason === "allied_occupation_required"`.
- **Admin:** `/admin/diagnostics/allied-occupation`.

## Safe default

Missing occupation → **pending** (`hasPremium: false` for gated surfaces). No silent RN or "all allied" default.

## Required product UX

1. **Missing occupation recovery** — dedicated screen or account/dashboard banner when tier is ALLIED but occupation unresolved; deep links to checkout/support as needed.
2. **One-time profession selection** — checkout requires `alliedCareer` for new Allied subscriptions (contract tests in `checkout-allied-metadata.contract.test.ts`).
3. **Immutable profession warning** — pricing/checkout copy: occupation is not self-serve changeable post-purchase; route to support for corrections.
4. **Admin remediation** — diagnostics page + ability to align `Subscription.alliedCareer` and `User.alliedProfessionKey` to canonical keys after support verification.

## Repair

1. User completes occupation / support ticket.
2. Admin sets `Subscription.alliedCareer` + `User.alliedProfessionKey` to canonical values.

## Copy principle

One selected profession pathway per Allied subscription; changes via support or controlled workflow.

## Weak-topic alignment

See `docs/reports/allied-weak-topic-entitlement-convergence.md` — non–allied-core pathways **fail closed** on missing occupation; allied core drops exclusive rows but may show shared/unregistered slugs until recovery.

## Verification

- Admin diagnostic trends after deploy.
- Spot-check occupation-scoped premium routes.
- `npm run test:unit:stripe` (checkout metadata contracts).
