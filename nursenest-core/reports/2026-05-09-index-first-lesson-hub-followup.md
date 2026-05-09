# Index-first lesson hub follow-up (performance)

**Date:** 2026-05-09  
**Scope:** Public marketing lesson hubs (category-first, generated indexes), optional DB progress for paid users, category pagination cap, lesson detail / adjacent behavior, and automated tests.

## Summary

- **Index-first public hubs:** Trusted `src/content/pathway-lessons/generated-indexes/{pathwayId}.json` drives lightweight hub lists when slugs match merged raw catalog (`hasTrustedGeneratedMarketingLessonIndex`). Anonymous users skip expensive marketing DB row verification when the index is trusted.
- **Category pagination:** `MARKETING_HUB_CATEGORY_PAGE_SIZE` is **48** (40–60 band).
- **Progress (paid/staff):** `loadMarketingHubLessonProgressMapWithTimeout` batches visible slugs, **12s** default timeout, degrades to no progress chrome on failure (`timedOut`). Optional `progressFetcher` for tests.

## Tests

- `src/lib/lessons/marketing-hub-progress-safe.test.ts`
- `src/lib/lessons/marketing-hub-category-page-cap.contract.test.ts`
- `tests/e2e/public/lesson-hub-performance.spec.ts`

## Validation

| Command | Result |
|---------|--------|
| npm run typecheck:critical | Pass |
| npm run test:pathway-lessons | Pass |
| npm run test:homepage | Pass |
| playwright lesson-hub-performance.spec.ts (chromium) | Pass with NN_SKIP_DEV_AUTH_SECRET=1 + next dev |

## Note

E2E needs a running app on BASE_URL (default localhost:3000).

Does not redo c35bc52b2 (cached filtered hub list).
