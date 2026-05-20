# Phase 6B — Allied lesson index pipeline (reference)

This document records how **US/CA allied** pathways participate in the normalized lesson index gate so Phase 6C work does not regress allied merges.

## Sources of truth

- **Bundled allied shard:** `src/content/pathway-lessons/allied-bundled-catalog.json` merged in `pathway-lesson-catalog-sync.ts` (`getAlliedBundledPathways`, dedicated overlays).
- **Canonical pathway IDs:** `ALLIED_MARKETING_CORE_PATHWAY_IDS` from `canonical-lessons-hubs.ts` (`us-allied-core`, `ca-allied-core`).
- **Build gate:** `npm run build` runs `scripts/run-lesson-indexes-for-build.mjs` → `build:lesson-indexes` → `verify:lesson-indexes` unless `NN_SKIP_LESSON_INDEX_BUILD` is set.

## Build script behavior (`build-normalized-lesson-indexes.runner.mts`)

1. **Fail-fast:** `getCatalogLessonsRawFromBundledOnly(alliedId)` must be non-empty for each allied marketing pathway (catches sparse checkout / merge regressions).
2. **Ordering:** `sortPathwayIdsAlliedFirst` emits **`us-allied-core` / `ca-allied-core` before** other pathways so allied indexes land early in logs and any downstream tooling sees allied first.
3. Output: `generated-indexes/<pathwayId>.json` including **`us-allied-core.json`**.

## Verification (`verify-normalized-lesson-indexes.runner.mts`)

For each generated JSON, compares merged raw counts, summary slugs, and marketing-effective slug sets against a **live catalog leg** (temp index dir + cache reset) so disk indexes cannot drift from merge logic.

## Do not regress

- Do not remove allied IDs from `listCatalogPathwayIdsWithLessonsSync` enumeration or allied-first ordering in the index build without updating this doc and QA gates.
- Do not skip `verify:lesson-indexes` in CI without a documented replacement check.
