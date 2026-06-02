# Phase 4B — unified cross-platform entitlement enforcement

This document summarizes the **canonical server-side entitlement contract** for learner-protected surfaces and how audits/tests enforce it.

## Canonical result

- **Module:** `canonical-learner-access.server.ts`
- **API:** `toCanonicalLearnerAccess(userAccess, resolutionSource)` and `loadCanonicalLearnerAccessForUserId(userId)` wrap existing **`getUserAccess`** + **`accessScopeFromUserAccess`**. No new tier names or reason codes — types come from `user-access-types.ts` / Prisma `TierCode`.
- **Premium HTTP APIs:** continue to use **`requireSubscriberSession()`**, which already resolves **`getUserAccess`** → **`accessScopeFromUserAccess`** (same DB mirror as marketing checkout → `/app`).

## Paid website session ↔ `/app`

Same **NextAuth** session and **Postgres** `User` + `Subscription` rows. Entitlements are never taken from client query params for gating decisions on protected content.

## Admin diagnostics (non-sensitive)

- **Subscriptions & billing:** `AdminPhase4bCanonicalEntitlementsPanel` documents the helper chain and shows aggregate **tier mismatch** counts from existing drift signals (no Stripe customer ids in the Phase 4B panel).
- **Learner QA:** `AdminLearnerQaEntitlementDiagnostics` shows grant/deny, `reasonCode`, tier, pathway id, resolution helper label, and per-user **mismatch codes** from `loadCanonicalLearnerDiagnosticsForUserId` (bounded Prisma reads; no customer ids).

## Audit script

- **Command:** `npm run audit:entitlement-surfaces` → `scripts/audit-entitlement-surfaces.mts`
- **Exit 1:** only if a **critical** `src/app/api/learner/**/route.ts` file lacks `requireSubscriberSession`, `resolveEntitlement`, `getUserAccess`, `loadCanonicalLearnerAccessForUserId`, or `toCanonicalLearnerAccess`.
- **Exit 0 + JSON warnings:** soft-allowlisted learner routes (baseline, reset-progress, hub stats, study settings, pre-nursing), heuristic client `hasAccess` usage under `src/app/(app)/app`, and `RN` tier string equality checks under the learner app tree.

## ECG / adaptive / labs / allied

- **ECG:** `ecg-module.server.ts` uses **`loadCanonicalLearnerAccessForUserId`** so ECG gates stay aligned with the canonical contract (tier / premium / pathway rules unchanged in config).
- **Adaptive learner APIs:** documented in route JSDoc; enforcement remains **`requireSubscriberSession`** (see `adaptive-recommendations/route.ts`).
- **Allied ≠ RN:** enforced via `prismaTierCodesForProfileTier("ALLIED")` — regression covered in `phase-4b-unified-entitlement.contract.test.ts`.

## Tests (bounded)

```bash
node --import tsx --test \
  src/lib/entitlements/canonical-learner-access.server.test.ts \
  src/lib/entitlements/phase-4b-unified-entitlement.contract.test.ts
```

## Validation commands (CI / local)

Per rollout checklist:

- `npm run test:unit:stripe`
- `npm run smoke:paid-unlock` (runs `scripts/paid-unlock-smoke.mjs`; exits **0** with a skip message when `E2E_PAID_SMOKE_EMAIL` / `E2E_PAID_SMOKE_PASSWORD` are unset)
- `npm run audit:entitlement-surfaces`
- `npm run typecheck:critical`

**Note:** Full-repo `tsc` / build may OOM in constrained environments (~137); prefer `typecheck:critical` unless you are on a machine with sufficient Node heap.

## Learner surface audit (helper matrix)

| Surface | Server helper | Client-only gate? |
| --- | --- | --- |
| `/app` RSC layout | `resolveEntitlementForPage` / `getUserAccess` (via existing layout loaders) | No (paywall remains server-backed) |
| Premium learner APIs | `requireSubscriberSession` or `resolveEntitlement` | No |
| ECG module | `loadCanonicalLearnerAccessForUserId` | No |
| Personal profile API | `resolveEntitlement` | No |
| Baseline / hub stats / study settings / pre-nursing | `auth()` only (+ domain rules); allowlisted in audit | N/A (not sold as full bank) |

For a machine-readable scan, run `npm run audit:entitlement-surfaces` and inspect the JSON `missingServerGate*` / `warnings` arrays.
