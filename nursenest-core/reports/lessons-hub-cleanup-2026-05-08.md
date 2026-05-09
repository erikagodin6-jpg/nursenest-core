# Lessons hub cleanup — 2026-05-08

## Root cause

1. **Marketing category-first index** could call `getPathwayLessonListWarehouseLocaleForHub` before row verify. That path uses `lessonHubDbQueryOrThrow` and throws `HubLessonsListDatabaseError` (timeouts, safe mode, missing `DATABASE_URL`). Anonymous visitors still hit this path whenever `hasTrustedGeneratedMarketingLessonIndex` was false, even though the hub listing is backed by bundled / generated lesson indexes (`getEffectiveCatalogLessonsForPathwaySync` → hub-list strip).

2. **`/allied/allied-health/lessons` global entry** rendered `GlobalAlliedLessonsPage` → same `PathwayLessonsHubPage` with `us/allied/allied-health` params, which always `permanentRedirect`’d to `/allied/allied-health/lessons` — the **same** URL the browser was already on, causing a **redirect loop** in dev/Playwright.

## Approach

1. **Index-first, DB optional for public hubs**  
   - **Anonymous**: `skipDbVerify = !userId` — no warehouse `groupBy` and no per-slug marketing verify on category-first index or category lesson surfaces.  
   - **Signed-in**: resilient helper catches `HubLessonsListDatabaseError`, falls back to prepared rows, logs warnings.

2. **Helper** — `src/lib/lessons/marketing-hub-category-rows-db-resilient.ts` + unit tests.

3. **Allied canonical loop** — `skipAlliedHealthHubCanonicalRedirect: true` from `allied/allied-health/lessons/page.tsx`.

4. **E2E** — RN assertions for hub marker, lesson library, category tiles, no app error screen; allied legacy redirect smoke; optional `NN_E2E_ALLIED_GLOBAL_HUB_BODY=1` for full allied body checks.

## Files touched

- `src/lib/lessons/marketing-hub-category-rows-db-resilient.ts`
- `src/lib/lessons/marketing-hub-category-rows-db-resilient.test.ts`
- `src/components/pathway-lessons/marketing-lessons-hub-category-first-index.tsx`
- `src/components/pathway-lessons/marketing-lessons-hub-category-lessons-surface.tsx`
- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx`
- `src/app/(marketing)/(default)/allied/allied-health/lessons/page.tsx`
- `package.json`
- `tests/e2e/public/pathway-lessons-hub-premium.spec.ts`
- `reports/lessons-hub-cleanup-2026-05-08.md`

## Validation

| Command | Result |
|---------|--------|
| `npm run typecheck:critical` | Pass |
| `npm run test:pathway-lessons` | Pass |
| `npx playwright test tests/e2e/public/pathway-lessons-hub-premium.spec.ts --project=chromium --workers=1` | Pass with dev server running at `BASE_URL` |

