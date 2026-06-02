# Learner dashboard Phase 1 — implementation plan (hero + readiness / next-action strip)

**Scope:** Post-homepage premiumization Phase 1 slice only — dashboard **top hero** and **readiness + next-action strip**. No routing, entitlements, API contracts, or i18n loader changes.

## Verified entry points

| Item | Location |
|------|-----------|
| Route | `/app` — `src/app/(student)/app/(learner)/page.tsx` |
| Shell + hero | `LearnerDashboardPageShell` — `src/components/student/learner-dashboard-page-shell.tsx` |
| Dashboard body | `LearnerStudyHome` — `src/components/student/learner-study-home.tsx` |
| Snapshot loader | `loadPremiumDashboardSnapshot` — `src/lib/learner/premium-dashboard-snapshot.ts` |

## Existing data (no new sources)

- **Next action:** `nextAction` from `buildDashboardModel` (pathway-scoped in `page.tsx`).
- **Readiness:** `snapshot.readiness` (`ReadinessResult`).
- **Exam countdown:** `countdown` from `buildCountdownCopy`; exam tile only when `countdown.daysRemaining != null`.
- **Streak:** `snapshot.studyStreakDays` (tile only when > 0).

## UI approach

1. **Hero:** `nn-learner-page-hero` + `nn-learner-dashboard-hero` + `nn-product-surface-accent`; remove redundant border/bg/shadow utilities duplicated by hero tokens.
2. **Strip:** `LearnerDashboardReadinessNextStrip` — `LearnerSurfaceCard` + `PrimaryActionCard`; optional exam/streak tiles gated on real fields.

## QA

- `npm run typecheck:critical`, `npm run test:homepage`
- `npx playwright test --project=chromium-paid tests/e2e/paid-user/learner-dashboard-phase1-hero-readiness.spec.ts`
