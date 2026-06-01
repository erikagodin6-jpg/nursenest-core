# Production Performance Baseline

Generated: 2026-06-01T11:09:21.833Z

## Measurement Status

No authenticated Playwright baseline file is present at `tests/e2e/performance/perf-baseline.json`, so this report uses static route evidence plus existing telemetry coverage. Authenticated cold/warm timing must be recorded with `npm run test:e2e:performance-budgets:record` against staging or production-like data.

## Hot Route Baseline

| Flow | Route | Target | Source KB | Prisma | findMany | count | fetch | useEffect | Telemetry |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Lesson launcher | /app/lessons | <1.5s | 79.7 KB | 14 | 4 | 4 | 3 | 2 | 2 |
| Lesson detail | /app/lessons/[id] | <1s | 59.7 KB | 8 | 1 | 0 | 0 | 0 | 3 |
| Flashcard launcher | /app/flashcards | <1s | 111.1 KB | 0 | 0 | 0 | 1 | 6 | 2 |
| Flashcard session | /app/flashcards/session | <2s | 91.4 KB | 24 | 11 | 3 | 0 | 0 | 2 |
| Practice launcher | /app/practice-tests | <2s | 78.8 KB | 4 | 3 | 0 | 2 | 5 | 3 |
| Practice session | /app/practice-tests/[id] | <2s | 237.1 KB | 3 | 1 | 0 | 7 | 24 | 3 |
| CAT launcher | /app/practice-tests/cat-launch | <2s | 101 KB | 9 | 6 | 2 | 2 | 5 | 3 |
| CAT session | /app/practice-tests/[id]?mode=cat | <2s | 237.1 KB | 9 | 5 | 2 | 7 | 24 | 4 |
| Dashboard | /app | <1.5s | 81.3 KB | 13 | 4 | 2 | 0 | 0 | 2 |

## Bottleneck Ranking

1. **CAT session**: 237.1 KB scanned, 9 Prisma call sites, 5 findMany call sites, 2 count call sites, 7 client fetch call sites.
2. **Flashcard session**: 91.4 KB scanned, 24 Prisma call sites, 11 findMany call sites, 3 count call sites, 0 client fetch call sites.
3. **Practice session**: 237.1 KB scanned, 3 Prisma call sites, 1 findMany call sites, 0 count call sites, 7 client fetch call sites.
4. **Lesson launcher**: 79.7 KB scanned, 14 Prisma call sites, 4 findMany call sites, 4 count call sites, 3 client fetch call sites.
5. **CAT launcher**: 101 KB scanned, 9 Prisma call sites, 6 findMany call sites, 2 count call sites, 2 client fetch call sites.

## Existing Evidence Reused

- Learning activity audit: Generated: 2026-06-01T11:08:40.853Z
- Flashcard hub report: Date: 2026-05-29

## Current Gaps

- Cold/warm authenticated browser timings are not present locally. Running them anonymously would measure redirects or login shells, not learner activity performance.
- Production load tests are intentionally not launched by this script; those require a controlled target and paid learner storage state to avoid noisy or unsafe traffic.
- The patched CAT endpoints now emit `Server-Timing` through the shared API telemetry wrapper, closing the largest observed CAT telemetry gap.
