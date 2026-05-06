# PathwayLesson content payload analysis

## Hub list card shape

- `stripPathwayLessonToHubListShape` (`pathway-lesson-hub-list-shape.ts`) clears `sections` after list normalization so cards carry **metadata + structural flags**, not bodies.
- Prisma hub list constants: `PATHWAY_LESSON_HUB_LIST_SELECT` / `PATHWAY_LESSON_HUB_LIST_SELECT_WITH_SECTIONS` in `pathway-lesson-loader.ts` (no `preTest`/`postTest` blobs on list select).

## Full-record paths (expected heavy JSON)

| Consumer | Payload |
|----------|---------|
| `getPublishedPathwayLessonRecordById` | Full row + overlays → `PathwayLessonRecord` with `sections` |
| `getPathwayLesson` | Slug-resolved full lesson for marketing + detail |
| App hub renderability scan | Full record per scanned pathway id (contract) |

## Metadata-only selects

- `PATHWAY_LESSON_METADATA_LIST_SELECT` (`pathway-lesson-metadata-select.ts`) for dashboard-style lists without `sections`.
- App hub **pagination query** uses minimal `select` (id, title, seoDescription, topic, slug, …) — cards still depend on downstream full load for gating.

## Catalog / build

- `catalog.json` merged via `pathway-lesson-catalog-sync.ts`; `normalizeLesson` is CPU-heavy on large `sections` arrays.
- `pathwayLoaderAsyncMemo` dedupes overlay fetch and other loader entrypoints in-process.

## Mobile / shared packages

- No API contract changes in this pass; mobile surfaces consume stable lesson identifiers and routes documented in truthpack-adjacent routing (`marketingPathwayLessonsIndexPath`, etc.).

