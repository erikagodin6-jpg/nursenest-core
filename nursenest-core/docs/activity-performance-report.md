# Activity Performance Report

Generated: 2026-05-29T00:54:48.843Z

## Scope

This report covers platform-level learner activity startup budgets for Questions, Flashcards, Lessons, Clinical Skills, Pharmacology, ECG, CAT, Dashboard, and Analytics.

Live measurements come from `tests/e2e/performance/perf-baseline.json` when recorded with `npm run test:e2e:performance-budgets:record`. If no baseline exists, the table shows configured CI budgets only.

## Budgets And Latest Samples

| Route | Budget | TTFB Budget | DB Budget | Max Queries | Latest First Content | Latest TTI | Worst API | Status |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Learner Dashboard (/app) | 2000ms | 1000ms | 300ms | 15 | — | — | — | No sample |
| Question Bank (/app/questions) | 2000ms | 500ms | 400ms | 15 | — | — | — | No sample |
| Flashcards Hub (/app/flashcards) | 2000ms | 500ms | 300ms | 12 | — | — | — | No sample |
| Lesson Library (/app/lessons) | 2000ms | 500ms | 400ms | 15 | — | — | — | No sample |
| Clinical Skills (/app/clinical-skills) | 2000ms | 500ms | 350ms | 15 | — | — | — | No sample |
| Pharmacology (/app/pharmacology) | 2000ms | 500ms | 350ms | 15 | — | — | — | No sample |
| ECG Workstation (/modules/ecg/basic/lessons) | 2000ms | 500ms | 350ms | 18 | — | — | — | No sample |
| CAT Exam Launch (/app/practice-tests/cat-launch) | 3000ms | 500ms | 500ms | 20 | — | — | — | No sample |
| LOFT / OSCE Simulation (/app/osce) | 3000ms | 500ms | 600ms | 22 | — | — | — | No sample |
| Analytics Dashboard (/app/analytics) | 2500ms | 1500ms | 500ms | 20 | — | — | — | No sample |

## Instrumentation

- Client activity vitals emit `activity_performance_vitals` with TTFB, hydration approximation, LCP, approximate TTI, CPU blocking time, JS heap usage, network request count, route transfer KB, and script transfer KB.
- Learner shell server timing emits `activity_shell_server_timing` for targeted learner routes.
- CI route budgets are defined in `src/lib/performance/route-registry.ts`.
- Playwright budget enforcement lives in `tests/e2e/performance/learner-activity-performance-budgets.spec.ts`.

## Current Measurement Status

No local Playwright baseline was present when this report was generated.

## Static Audit Findings

| Area | Verified Finding | Risk | Action Taken |
| --- | --- | --- | --- |
| Shared learner shell | `loadLearnerStudyNextBlock` and `loadLearnerExamDateState` were eligible to run before activity content on activity routes. | Noncritical personalization can delay Questions, Flashcards, Lessons, Clinical Skills, Pharmacology, and CAT startup. | Activity route classification now skips these optional shell loads for targeted activity routes. |
| Client measurements | No single app-wide activity vitals emitter existed for all targeted activities. | TTFB, hydration, LCP, network requests, and transfer size could not be compared consistently by activity. | Added `ActivityPerformanceVitals` under the app provider layer. |
| ECG budget | ECG existed in route registry but was not CI-enforced and had a 3s first-content budget. | ECG could regress outside the new <2s platform target. | ECG budget is now 2s and CI-enforced. |
| Performance report script | `npm run perf:activity-report` pointed at a missing script. | War-room reporting could not be regenerated locally or in CI. | Added `scripts/generate-activity-startup-report.ts`. |
| Cache observability | `emitCacheObservabilitySummary` passed arrays into `safeServerLog`, which only accepts primitive-safe metadata. | TypeScript failed and cache summaries were not type-safe for log drains. | Serialized cache layer and alert summaries as JSON strings and added primitive counts. |
| LOFT / OSCE | LOFT was registered but not CI-enforced, and the OSCE hub performed an existence query followed by a list query. | Simulation launch could regress outside the <3s target and duplicate DB work on cold starts. | LOFT is now CI-enforced; OSCE hub/API list reads use Redis-backed cache and a bounded DB read. |
| Optional activity personalization | Clinical Skills, Lessons, Flashcards, Pharmacology, and Practice Tests could wait on optional progress, inventory, or discovery lookups. | Nonessential personalization could consume most or all of the startup budget before learners see the activity shell. | Added startup budgets and fallbacks so visible content wins over optional metrics. |

## Data Bottleneck Watchlist

These are verified static risks that need live timing samples before deeper rewrites:

- Lessons hub: combines entitlement, staff access, learner path lookup, visible pathway calculation, snapshot fallback, DB fallback, pagination, progress aggregation, and optional locale work in the startup path.
- Flashcards hub: performs session, entitlement, compatible pathway resolution, user pathway lookup, inventory loading, snapshot fallback, and pathway options before rendering the full hub payload.
- Clinical Skills hub: loads full skill progress map plus latest progress touch before rendering the hub client.
- Pharmacology hub: resolves entitlement, compatible pathways, and user learner path before rendering the hub.
- CAT launch: redirect alias is lightweight; actual CAT startup remains under `/app/practice-tests` and must be measured with the Playwright budget run.
- LOFT / OSCE: station list is now cache-backed, but station detail routes still need live timing samples before deeper changes.
- ECG module: access gate and module status checks run before module shell; media-heavy content must remain streamed/lazy after shell.

## Next Measurement Command

Run against a warm local or staging production-like server with a paid learner storage state:

```bash
npm run test:e2e:performance-budgets:record
npm run perf:activity-report
```

CI gate:

```bash
npm run perf:governance:strict
```

