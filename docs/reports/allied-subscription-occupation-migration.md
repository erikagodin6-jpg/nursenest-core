# Allied subscription occupation migration

**Date:** 2026-05-10

## Goal

Subscribers without resolved **allied occupation** must not receive all allied occupations. Complete selection or admin repair.

## Detection

- **Entitlement:** `reason === "allied_occupation_required"`.
- **Admin:** `/admin/diagnostics/allied-occupation`.

## Safe default

Missing occupation → **pending** (`hasPremium: false` for gated surfaces). No silent RN or "all allied" default.

## Repair

1. User completes occupation / support ticket.
2. Admin sets `Subscription.alliedCareer` + `User.alliedProfessionKey` to canonical values.

## Copy principle

One selected profession pathway per Allied subscription; changes via support or controlled workflow.

## Verification

- Admin diagnostic trends after deploy.
- Spot-check occupation-scoped premium routes.
