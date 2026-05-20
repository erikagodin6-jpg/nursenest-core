# Lesson hub and detail — performance audit (2026-05-09)

## Root cause (primary)

Filtered marketing lesson hubs (search, topic, pagination, allied filters) loaded the paginated list via `loadPathwayLessonsHubPageWithTelemetry` using **`getPathwayLessonsPageFresh` by default**, which **bypasses Next.js Data Cache** (`unstable_cache` in `getPathwayLessonsPageWithDataCache`). That repeats full `resolveMarketingHubRenderableLessonList` work on cold requests and drives high TTFB / server time.

Default **unfiltered** hubs render **`MarketingLessonsHubCategoryFirstIndex`** (category tiles first) and were unchanged.

## Fix

- **`defaultMarketingHubLessonsPageFetch`** (`marketing-hub-lessons-page-fetch.ts`) calls **`getPathwayLessonsPage`** unless **`NN_MARKETING_HUB_USE_FRESH_LIST=1`** (editorial / staging bypass).
- **`marketing-hub-optional-data.ts`** uses the same default for aggregates.
- Diagnostics: when route pipeline logging is on, `cacheSource` reflects `cached_getPathwayLessonsPage` vs `live_getPathwayLessonsPageFresh`.

## Before / after (expected)

| Surface | Before | After |
|--------|--------|--------|
| Filtered hub repeat loads | Fresh resolver each time | Next Data Cache hits until revalidate / tag invalidation |
| Unfiltered hub | Category-first | Same |

Capture production timings via logs (`hub_list_resolved`, edge TTFB).

## Files changed

- `nursenest-core/src/lib/exam-pathways/marketing-hub-lessons-page-fetch.ts`
- `nursenest-core/src/lib/exam-pathways/marketing-hub-optional-data.ts`
- `nursenest-core/src/lib/lessons/pathway-lesson-loader.ts` (comment)

## Tests

- `nursenest-core/tests/e2e/public/lesson-hub-performance.spec.ts`

## Validation

```bash
cd nursenest-core
npm run typecheck:critical
npm run build
npm run test:homepage
npx playwright test tests/e2e/public/lesson-hub-performance.spec.ts --project=chromium
```

## Ops

- **`NN_MARKETING_HUB_USE_FRESH_LIST=1`** — bypass list cache when imports must show immediately; omit in production for speed.
