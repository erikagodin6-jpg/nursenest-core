# TypeScript error buckets (targeted learner / CAT / shell pass)

## Summary

| Metric | Value |
|--------|------:|
| **`tsc` errors before** | 28 |
| **`tsc` errors after** | 13 |
| **Fixed in this pass** | 15 |
| **Learner + lesson-adjacent + CAT + shell paths** | **type-clean** (no remaining errors in those files) |

Command: `npx tsc --noEmit` (run from `nursenest-core/`).

## Bucket: learner-flow critical — **addressed**

| File | Issue |
|------|--------|
| `src/app/(student)/app/(learner)/page.tsx` | Typed `snapshot`; `let` narrowing — use `premiumSnapshot` const inside branch |
| `src/app/api/learner/study-settings/route.ts` | Prisma row nulls vs `PartialStudySettings`; PATCH body cast to `Partial<StudySettings>` |
| `src/lib/learner/study-settings.ts` | `persistenceRowToPartial` + `rowToStudySettings` |
| `src/lib/learner/study-settings.test.ts` | Invalid session length — `as unknown as` for intentional bad runtime value |

## Bucket: CAT-flow critical — **addressed**

| File | Issue |
|------|--------|
| `src/lib/practice-tests/cat-results-coach.ts` | `sanitizeCatExamReportForCoach` return completed `CatExamReport` |
| `src/lib/practice-tests/cat-results-coach.test.ts` | `makeReport` includes `result`, `readinessLevel`, `abilityScore`, `confidenceLevelLabel` |
| `src/lib/practice-tests/enrich-cat-results-coach.ts` | Prisma `ContentStatus`: `"DRAFT"` not `"draft"` |

## Bucket: shell / header critical — **addressed**

| File | Issue |
|------|--------|
| `src/components/auth/learner-shell-user-bar.tsx` | Document `click` listener uses `PointerEvent` |
| `src/components/layout/site-header.tsx` | Same |

## Bucket: lesson-adjacent — **addressed**

| File | Issue |
|------|--------|
| `src/lib/lessons/load-lesson-study-loop-bank-pack.ts` | `Row.options` / `correctAnswer` as `Prisma.JsonValue` |

## Deferred (not fixed this pass)

- **Marketing** (3): exam questions page pathway type; pre-nursing breadcrumbs.
- **Blog / admin blog** (6): JsonValue, Prisma delegate typing, readonly OR, etc.
- **Checkout** (1): subscription route `Status | null`.
- **Link density** (2): `link-density-config.ts` indexing.

See `typescript-error-buckets.json` for machine-readable lists.
