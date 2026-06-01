# Allied Dashboard Truthfulness Audit

Generated: 2026-06-01T12:00:37.987Z

Scope: learner dashboard, study plan, readiness report, analytics, and account performance surfaces after an Allied learner signs in.

## Executive Verdict

The learner dashboard infrastructure exists, but Allied-specific truthfulness depends on whether each panel can resolve profession-scoped content. Current repository evidence supports generic learner analytics and readiness infrastructure, not complete Allied profession readiness. Dashboard surfaces should avoid implying mature CAT, practice exam, flashcard, or simulation coverage for Allied learners until those inventories exist by profession.

## Dashboard Surface Matrix

| Surface | Route/evidence | Verdict | Truthfulness requirement |
| --- | --- | --- | --- |
| Learner dashboard | `src/app/(app)/app/(learner)` plus `load-learner-shell-pathway-metadata.ts` resolves `alliedProfessionKey`. | Partially supported | Dashboard can identify Allied profession context, but cards must only link to inventory-backed modules. |
| Study plans | `src/app/(app)/app/(learner)/study-plan/page.tsx` loads premium dashboard snapshot. | Risk | Study plans should not recommend flashcards, CAT, practice exams, or simulations for Allied professions unless those surfaces have evidence. |
| Readiness reports | `/app/account/readiness` and `loadReadinessDashboardData` exist. | Risk | Readiness should be based on actual learner attempts and profession-scoped item pools, not static Allied manifest percentages. |
| Analytics | `/app/account/analytics` exists and is subscription-gated. | Partially supported | Analytics can exist as a platform feature, but pathway-specific insight quality will be limited for professions with low/no inventory. |
| Flashcards dashboard links | `/app/flashcards` accepts `alliedProfession` query context. | Unsupported for claim strength | Routing support is not the same as profession-specific flashcard inventory; this audit found zero evidenced profession flashcards. |

## Profession Dashboard Risk Matrix

| Profession | Lessons | Questions | Flashcards | Simulations | Dashboard-safe modules |
| --- | --- | --- | --- | --- | --- |
| Respiratory Therapy | 6/300 | 90/2500 | 0/3000 | 5/100 | lessons, limited practice, limited cases |
| Paramedicine | 6/300 | 200/2500 | 0/3000 | 6/100 | lessons, limited practice, limited cases |
| Medical Laboratory Technology | 6/300 | 11/2500 | 0/3000 | 1/100 | lessons, limited practice, limited cases |
| Physiotherapy | 6/250 | 81/2000 | 0/2500 | 2/75 | lessons, limited practice, limited cases |
| Occupational Therapy | 6/250 | 127/2000 | 0/2500 | 3/75 | lessons, limited practice, limited cases |
| PSW | 0/200 | 0/1500 | 0/2000 | 0/50 | none evidenced |
| Social Work | 6/250 | 0/2000 | 0/2500 | 0/75 | lessons |
| Psychotherapy | 6/250 | 0/2000 | 0/2500 | 0/75 | lessons |

## Required Dashboard Guardrails

1. Hide or disable empty profession-specific widgets instead of showing "coming soon" inside a paid dashboard.
2. Label readiness as "insufficient data" until the learner has enough profession-scoped attempts.
3. Do not show static 97-100% Allied readiness manifest values as learner-facing readiness.
4. Ensure "Study next" never recommends a content type with zero profession inventory.
