# Blog admin vs public source of truth

Generated for recovery audits. **Canonical public English blog posts** live in `BlogPost`. Localized marketing posts use `LocalizedBlogArticle` (separate routes).

## Where admin writes

| Surface | Path | Model |
| --- | --- | --- |
| Admin blog list + create | `src/app/api/admin/blog/route.ts` | `prisma.blogPost` |
| Admin blog patch / publish | `src/app/api/admin/blog/[id]/route.ts` | `prisma.blogPost` |
| Control panel draft persist | `src/app/api/admin/blog/control-panel/persist-draft/route.ts` | `prisma.blogPost` |
| Localized admin | `src/app/api/admin/blog/localized/*` | `prisma.localizedBlogArticle` |

## Where public reads (canonical)

| Surface | Path | Loader |
| --- | --- | --- |
| Blog index | `src/app/(marketing)/(default)/blog/page.tsx` | `getPublishedBlogPostsPage` → `safe-blog-queries` |
| Blog detail | `src/app/(marketing)/(default)/blog/[slug]/page.tsx` | `getPublishedBlogPostBySlug` |
| Scoped nursing hub | `src/app/(marketing)/(default)/nursing/[careerSlug]/blog/*` | same safe blog queries |
| Scoped allied hub | `src/app/(marketing)/(default)/allied-health/[slug]/blog/*` | same safe blog queries |

## Where public reads (localized)

| Surface | Path | Loader |
| --- | --- | --- |
| Localized index + detail | `src/app/(marketing)/[locale]/[slug]/[examCode]/[exam]/blog/*` | `getPublishedLocalizedBlogPostsPage` / `getPublishedLocalizedBlogBySlug` |

## Where sitemap reads

| Surface | Path | Loader |
| --- | --- | --- |
| Merged `/sitemap.xml` | `src/app/sitemap.xml/route.ts` | `listBlogSitemapEntriesSafe` → `getMergedBlogSitemapSlugRows` |

## Do they match?

- **Admin canonical editor ↔ public `/blog` ↔ merged sitemap:** **Yes** — all resolve through `BlogPost` via `safe-blog-queries` and `blogLiveWhere` / `blogPostIsLive` gates.
- **Localized routes:** **Different model** (`LocalizedBlogArticle`) — intentional; not mixed into the main merged blog sitemap slice today.
- **`ContentItem`:** **Not a live public blog source** for these routes.

## Mismatches to watch

- Rows with `postStatus: PUBLISHED` but non-`PUBLISHED` `workflowStatus` are hidden on public surfaces (by design).
- Static TS fallbacks exist for empty-DB builds only; production reads DB-backed `BlogPost` first.
