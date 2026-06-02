# Allied weak-topic entitlement — convergence

**Date:** 2026-05-11

## Canonical APIs

| API | Role |
|-----|------|
| `filterWeakTopicsForAlliedEntitlement` | Production weak-topic lists (dashboard, study snapshot, lesson continue, adaptive via dashboard). |
| `filterTopicRowsForAlliedEntitlement` | Trend / strong-topic rows. |
| `classifyAlliedCoreWeakTopicSemantics` | Explicit **shared_core** vs **exclusive** vs **contested_registry** vs **profession_primary_legacy** semantics. |
| `SHARED_ALLIED_WEAK_TOPIC_SLUG_ALLOWLIST` | Explicit shared slugs — avoid inferring “shared” only from absent registry rows long term. |

## Behavior (see module header in `src/lib/allied/allied-weak-topic-filter.ts`)

- **Allied marketing core:** exclusive topics gated by `exclusiveWinningProfessionForTopic` vs Stripe-backed canonical occupation (`subscriberCanonicalAlliedProfessionKey` via `AccessScope`). Shared / no winner / contested → allowed like prior “hub-unregistered” behavior; contested mirrors shared until catalog repair.
- **Non–allied-core + ALLIED tier:** occupation present → legacy `topicSlugsIn` narrowing (`filterWeakTopicsForAlliedProfession`, deprecated for new callers). **Missing occupation → fail closed (empty).**
- **Missing occupation on allied core:** exclusive rows dropped; shared/unregistered may remain (product recovery elsewhere).
- **Staff QA:** `accessScopeIsStaffLearnerEntitlementBypass` → unfiltered pass-through.

## Deprecated / legacy

- `filterWeakTopicsForAlliedProfession` / `filterTopicRowsForAlliedProfession` — internal + non-core only; **new code → entitlement helpers.**
- `buildClinicalIntelligenceForAlliedProfession` without `entitlement` — prefer `buildClinicalIntelligenceForAllied` (`src/lib/learner/clinical-intelligence.ts`).

## Labs governance (TODO registry)

- `src/lib/labs/allied-lab-occupation-coverage.ts` — expectations for `alliedExclusiveProfessionKeys`, RT-only, MLT-only, shared core, vent/waveform, ABG interpretation.

## Historical analytics contamination

Pre–entitlement-aware aggregates may include cross-profession weak-topic noise. **No automatic DB rewrite.** Options: invalidate materialized rollups if introduced later; one-off recompute from gated question rows; accept decay as new attempts accrue.

## Verification (release)

- `npm run typecheck:critical`
- `npm run test:unit:stripe`
- `npm run test:homepage`
- `npm run sitemap:validate`
- `node --import tsx --test src/lib/allied/allied-weak-topic-filter.entitlement.test.ts`

## Related reports

- `docs/reports/allied-occupation-entitlement-surface-sweep.md`
- `docs/reports/allied-subscription-occupation-migration.md`
