# Blog pipeline — source of truth

## Canonical public blog

- **`BlogPost`** (Prisma) is the only canonical model for English-default `/blog` and merged marketing blog surfaces documented in the audit inventory.
- **Localized/regional** content may use `LocalizedBlogArticle` with separate routing; it is not substituted for canonical `BlogPost` on `/blog/[slug]` in this pipeline work.

## Write paths

| Flow | Writes to | Live promotion |
|------|-----------|----------------|
| Admin control panel + generation pipeline | `BlogPost` via `persistControlPanelDraft` | `publishImmediately` → `publishGeneratedBlogArticle` → `publishBlogPostCanonical` |
| Async `BlogArticleGenerationJob` | Same pipeline | Same publish stack when `publishImmediately` |
| Campaign chunk generator | `BlogPost` (draft/scheduled) | Output gate blocks thin AI bodies before insert |
| Admin PATCH publish | `BlogPost` | `publishBlogPostCanonical` / admin routes (existing) |

## Visibility contract

- Public index, detail, and sitemap entries align with **`blogLiveWhere` / `blogPostIsLive`**: `PUBLISHED` requires `workflowStatus === PUBLISHED` and non-future `publishAt` when set.

## Logs

- `[blog-generation] created BlogPost slug=… id=… publishedAt=…` — emitted from `publishGeneratedBlogArticle` after canonical publish.
- `[blog-generation] rejected slug=… reason=…` — emitted when generated publish eligibility fails (and control-panel output gate fails before publish).
