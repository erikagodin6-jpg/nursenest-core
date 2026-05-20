# Lesson hub performance — May 9, 2026

## Root cause (filtered / non–category-first marketing hub)

On **search, topic, or allied-filtered** lesson hub requests (`/lessons` when not the default category-first index), the server called `prepareLessonsForHubCurriculumWithDiagnostics` on **`renderableAll`** (hundreds to 1000+ rows) even though the loader already returns **only the current page** in `pageResult.items`. Hub curriculum prepare runs dedupe plus `organizeHubLessonsForPresentation`; doing that over the full catalog on every request was unnecessary CPU and scaled linearly with total pathway size.

**Note:** Default unfiltered hubs (`/canada/rn/nclex-rn/lessons` without query params) render `MarketingLessonsHubCategoryFirstIndex` and do not use this code path.

## Fix

1. **`lessons/page.tsx` (filtered hub)**  
   - Prepare curriculum **only** from `pageResult.items` (slug-safe filter).  
   - Keep **full** slug-safe `renderableAll` for `fillMarketingHubLessonInventoryToMinimum` (`loaderRenderable`) and for `LessonHubFullLessonLinkNav` (sr-only crawl links).  
   - Pagination chrome uses **`marketingHubPaginationFromLoaderTotals`**: grid rows are the verified page slice; `total` / `pageCount` come from **`pageResult.total`** so pagination matches the loader.  
   - Toolbar / lesson-library badge count uses **`pageResult.total`** so it stays aligned with pagination when the verified inventory list is page-sized.

2. **`pathway-lesson-hub-page-slice.ts`**  
   - New helper `marketingHubPaginationFromLoaderTotals` for loader-total pagination when grid items are already page-scoped.

## Files changed

- `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx`
- `src/lib/lessons/pathway-lesson-hub-page-slice.ts`
- `src/lib/lessons/pathway-lesson-hub-page-slice.test.ts`
- `tests/e2e/public/lesson-hub-performance.spec.ts`

## Queries / payload

- Prisma verify behavior unchanged (still capped by page verify budget).  
- Primary win: **fewer rows through hub prepare** on filtered hubs (O(page) vs O(catalog)).

## Tests

- Unit: `pathway-lesson-hub-page-slice.test.ts` (includes `marketingHubPaginationFromLoaderTotals`).  
- E2E smoke: `tests/e2e/public/lesson-hub-performance.spec.ts` (canonical CA PN URL `/canada/pn/rex-pn/lessons`).

## Validation (local)

- `npm run typecheck:critical` — pass  
- `node --import tsx --test src/lib/lessons/pathway-lesson-hub-page-slice.test.ts` — pass  
- `npm run build` / Playwright — run in CI or locally when server available  

## Commit

- Message: `fix(performance): optimize lesson hub and detail loading`  
- After push, append: `git rev-parse HEAD`

## Git

- **SHA:** `4c3a121da`
