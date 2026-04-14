# Pathway lesson catalog and content protection

## Source of truth

Pathway marketing lessons (`/…/lessons/…`) load body text from `src/content/pathway-lessons/catalog.json`. The file is **imported only on the server** (`pathway-lesson-loader.ts`). It is **not** sent to the browser as a JSON payload; the server renders **HTML for preview sections only** when the user is not entitled to full access.

## What “locked” means

- **SSR / HTML**: `visibleSectionsForLesson` limits rendered sections to `previewSectionCount` (clamped to the number of normalized sections). Full bodies for later sections never appear in the response HTML for locked users.
- **Teaching supplements** (exam takeaways blocks, memory-anchor strip, common-traps strip) render only when `canViewFullPathwayLesson` is true (`fullAccess` on the marketing lesson detail page), so they are not duplicated in HTML for preview-only visitors.
- **Client components**: `PathwayLessonActions` receives only ids and flags, not lesson bodies.
- **APIs**: There is **no** public GET that returns full pathway lesson sections. `POST /api/lessons/pathway-progress` mutates progress only after `canViewFullPathwayLesson` passes; otherwise **403**.

## Residual risk

- The catalog is **versioned in git**. Anyone with repo access can read lesson copy. **True paywall** for written marketing lessons is **social + legal + server render rules**, not secret bytes on disk.
- If a future change imports the catalog into a **client** module or exposes it via a new API, that would bypass these protections. Keep loaders server-only and audit new routes.

## Normalization

Legacy four-block JSON is normalized to five canonical blocks with stable ordering and non-empty fallbacks so partial catalog rows do not break the page.
