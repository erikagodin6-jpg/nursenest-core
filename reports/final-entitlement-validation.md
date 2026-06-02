# Final entitlement validation

**Date:** 2026-05-07  
**Primary reference:** `reports/entitlement-hardening-audit.md`

## Server source of truth (unchanged architecture)

| Concern | Location |
|---------|----------|
| DB-backed access | `nursenest-core/src/lib/entitlements/get-user-access.ts` (`getUserAccess`) |
| Subscriber APIs | `requireSubscriberSession` → `getUserAccess` → `accessScopeFromUserAccess` |
| Page-level resolution | `resolveEntitlementForPage`, `resolveEntitlement`, `loadPersonalProfilePayload` |

**Rule:** JWT or client session display fields **do not** replace DB-backed gates for premium content.

## Cache / paywall semantics

- Learner `/app` surfaces: **do not weaken** `Cache-Control: private, no-store, must-revalidate` where already configured (`audit:paywall-security` asserts selected routes).

## Verification executed (this session)

| Command | Result |
|---------|--------|
| `npm run audit:paywall-security` (from `nursenest-core/`) | **PASS** — 12 tests |

## Recommended suite (pre-promote)

| Command | Purpose |
|---------|---------|
| `npm run verify:no-cross-tier-leakage` | Pathway / tier leakage |
| `npm run test:unit:mobile-subscriber-api` | Mobile-style subscriber API contracts |
| `npm run test:pathway-lessons` | PathwayLesson + marketing viewer + batch catalog |
| `npm run test:e2e:tier-matrix` | Playwright — requires webServer + test accounts |

## Known environment caveat

`entitlement-hardening-audit.md` notes `test:e2e:tier-matrix` may fail locally if webServer cannot resolve `server/index.ts` — run on CI or fix local webServer per `playwright` config.

## Sign-off placeholder

- [ ] Staging: unpaid user receives **403** on premium API routes.
- [ ] Staging: paid user **never** sees false lock after cold start (mobile + web).
- [ ] Ops: Stripe webhook row present for test subscription used in QA.
