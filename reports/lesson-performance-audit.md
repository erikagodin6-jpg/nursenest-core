# PathwayLesson performance audit

**Scope:** Canonical `PathwayLesson` stack under `nursenest-core/` (Next app). Marketing + `/app` learner lesson hubs, detail routes, generated indexes, sitemap emission, allied/NP/RN parity catalogs.

## Catalogs and loaders

| Surface | Primary loader / entry | Pagination / caps |
|--------|-------------------------|-------------------|
| Marketing pathway lessons hub | `getPathwayLessonsPage` / `getPathwayLessonsPageFresh` in `pathway-lesson-loader.ts` | `PATHWAY_HUB_PAGE_SIZE_*`, `maxSafeOffsetPage`, topic slices via `sliceNormalizedHubLessons` |
| Marketing topic hub | `pathway-lesson-loader.ts` (topic-specific DB branch, up to 200 rows + sections for gate pipeline) | In-memory slice after `sortAndFilterLessonsForPathwayContext` |
| App subscriber hub | `paginatePathwayLessonsForAppSubscriberHubMatchingDetailResolver` in `app-lessons-hub-row-renderability.ts` | Batch `take: 80`, `PATHWAY_APP_SUBSCRIBER_HUB_DETAIL_RESOLVER_SCAN_CAP` |
| App lesson detail | `getPublishedPathwayLessonRecordById` + `resolveAppSubscriberPathwayLessonForDetail` | Full row by id (contract-aligned with hub) |
| Marketing lesson detail | `pathway-lesson-detail-page-body.tsx` + `loadPathwayLessonWithLegacySlugRedirect` | Deferred panels via `pathway-lesson-detail-deferred` |
| Sitemap pathway lessons | `listPathwayLessonSlugBatch` in `pathway-lesson-loader.ts` (used from `sitemap-static-xml.ts`) | Batched `PATHWAY_LESSON_SITEMAP_BATCH` |

## SSR / data-cache pressure

- **Marketing hubs:** `unstable_cache` + deployment revision tags on hot list paths; DB vs catalog resolved via `pathwayHasPublishedDbLessons`.
- **App hub:** Each candidate pathway row calls `resolveAppSubscriberPathwayLessonForDetail` → `getPublishedPathwayLessonRecordById`, which loads **full** `PathwayLesson` JSON (including `sections`) to match the same presentability gates as `/app/lessons/[id]`. Hub list Prisma `select` is already narrow; cost is dominated by **per-row full lesson hydration** (intentional for contract parity).
- **Topic DB list:** Single `findMany` with `take: 200` and **sections** enabled for `normalizeLesson` + hub filters (needed for `structuralQuality` / marketing filters).

## Allied / NP / RN parity

- Allied hubs: `filterCatalogLessonsForAlliedProfessionHub`, `allied-profession-taxonomy`, `isAlliedMarketingCorePathwayId` wired from `pathway-lesson-loader.ts`.
- NP merges: `np-pathway-lesson-structural-normalization.ts` (normalize pipeline).
- RN/PN parity: scripts `generate-rpn-parity-expansion-catalog.mjs`, `verify-rpn-lessons-visible.mjs`; catalog sync in `pathway-lesson-catalog-sync.ts`.

## Duplicate transforms / heavy selects

- **Related lessons:** `getRelatedPathwayLessonsImpl` uses `PATHWAY_LESSON_HUB_LIST_SELECT_WITH_SECTIONS` then strips to hub card shape — sections required for `pathwayLessonEligibleForPublicMarketingSurface` after normalize.
- **Sitemap (optimized May 2026):** When `restrictToPublicMarketingSurface: true` **and** `structural_public_complete` exists in DB, `listPathwayLessonSlugBatch` uses **slug-only** `select` and skips `normalizeLesson` / overlay work (URLs unchanged; SQL gate matches marketing `notFound` contract).

## Linked learning / study linkage

- `pathway-lesson-linked-learning-assets.ts`, `pathway-lesson-linked-learning-hrefs.ts`, `computePathwayLessonLinkedLearningSignals` used on marketing + app detail.
- Flashcards / practice / CAT: `pathway-lesson-actions.tsx`, `pathway-lesson-study-loop-orchestrator.tsx`, learner page `lessons/[id]/page.tsx` (`loadRelatedExamQuestionStemsForPathwayLesson`, adaptive candidates).

## Premium / SEO / JSON-LD

- Premium gate: `pathway-lesson-premium.ts`, `pathway-lesson-route-access.ts` (`pathwayLessonEligibleForPublicMarketingSurface`).
- Marketing detail: `PathwayLessonMedicalEducationJsonLd`, breadcrumbs, `pathway-lesson-hub-seo.ts`, `pathway-lesson-content-dates.ts`.

## Recommendations (non-breaking)

1. Keep hub/detail **contract single-sourced**; any “light” hub resolver must stay aligned with `classifyAppSubscriberPathwayLessonRecord`.
2. Prefer **SQL structural gate** for sitemap-only workloads (implemented) to avoid scanning `sections` JSON at scale.
3. Monitor `PATHWAY_APP_SUBSCRIBER_HUB_DETAIL_RESOLVER_SCAN_CAP` vs lesson volume for worst-case hub latency.


## Validation note (CI / local)

- `npm --prefix nursenest-core run content:source-of-truth:verify` failed in this clone with lesson-index summary mismatch for `ca-rpn-rex-pn` (live vs file counts). Re-run after `npm run build:lesson-indexes` / index sync; unrelated to the sitemap select-path change.
