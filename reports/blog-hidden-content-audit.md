# Blog Hidden Content Audit

Generated: 2026-05-01T01:08:21.595Z

## Scope

- Repo root: `/root/nursenest-core`
- App root: `/root/nursenest-core/nursenest-core`
- DATABASE_URL configured: `false`
- Database queried successfully: `false`

## Source Of Truth

- Admin canonical writes:
  - src/app/api/admin/blog/route.ts -> prisma.blogPost.create/findMany
  - src/app/api/admin/blog/[id]/route.ts -> prisma.blogPost.update/delete via canonical publish helper
  - src/app/api/admin/blog/localized/*.ts -> prisma.localizedBlogArticle writes
- Public canonical reads:
  - src/app/(marketing)/(default)/blog/page.tsx -> getPublishedBlogPostsPage
  - src/app/(marketing)/(default)/blog/[slug]/page.tsx -> getPublishedBlogPostBySlug
  - src/app/(marketing)/(default)/nursing/[careerSlug]/blog/* -> getPublishedBlogPostsPage / getPublishedBlogPostBySlug
  - src/app/(marketing)/(default)/allied-health/[slug]/blog/* -> getPublishedBlogPostsPage / getPublishedBlogPostBySlug
- Public localized reads:
  - src/app/(marketing)/[locale]/[slug]/[examCode]/[exam]/blog/page.tsx -> getPublishedLocalizedBlogPostsPage
  - src/app/(marketing)/[locale]/[slug]/[examCode]/[exam]/blog/[postSlug]/page.tsx -> getPublishedLocalizedBlogBySlug
- Sitemap reads:
  - src/app/sitemap.xml/route.ts -> listBlogSitemapEntriesSafe -> canonical BlogPost sitemap rows
  - src/lib/seo/sitemap-localized-blog-xml.ts exists, but current route wiring does not clearly call it
- Mismatches:
  - Canonical public blog reads BlogPost, not ContentItem.
  - Localized public blog reads LocalizedBlogArticle, not canonical BlogPost bodies directly.
  - Static fallback TS posts are not the live detail body source when DB-backed BlogPost rows exist.
  - Localized sitemap generation code exists, but current sitemap route appears canonical-only.

## Summary

- Total inventory records: **1616**
- Hidden or orphaned: **206**
- Ready to publish: **0**
- Recoverable after review/import: **3**
- Need review: **311**
- Blocked: **1302**
- Duplicate signatures: **721**

## Summary buckets (recovery triage)

- Total discovered: **1616**
- Already live (reachable + published): **0**
- Hidden but recoverable (pipeline): **3**
- Blocked: **1302**
- Duplicates: **721**
- File / backup / manifest only: **1616**
- DB-only, not public: **0**
- Ready to publish (canonical gate): **0**
- Needs review: **311**

## Highest-Signal Findings

- `BlogPost` is the canonical source for `/blog`, scoped nursing/allied blog hubs, and the main blog sitemap.
- `LocalizedBlogArticle` powers locale-aware regional blog routes, but current sitemap wiring appears canonical-only; localized live rows are not clearly included in the main sitemap.
- `ContentItem` blog/article-like rows would be orphaned from the live public blog because public routes do not read `ContentItem`.
- `data/blog-manifest/batch-01/batch-01-import-ready.json` contains full-body draft posts with strong publish potential but they are not live until imported to `BlogPost`.
- `data/blog-content/newgrad-prod-batch-*` contains indexed posts plus HTML bodies on disk; these are recoverable but not public.
- `src/lib/seo/long-form-seo-blog-posts.ts` plus `long-form-seo-blog-posts-chunk2.ts` embed additional full posts + topic rows (same materialization gap: not live until imported to `BlogPost` / `LocalizedBlogArticle`).
- Static fallback posts exist in `src/content/blog-static-posts.ts`, but live detail pages still resolve from DB-backed `BlogPost` rows when the database is available.

## Safest Publish Path

1. Recover DB-backed hidden canonical posts first using the existing canonical publish path (`BlogPost` only), because those rows already match the live route and sitemap contract.
2. For repo-resident full-body content (`batch-01`, `newgrad-prod-batch-*`, selected long-form posts), import into `BlogPost` through existing import/materialization scripts instead of wiring public routes directly to disk files.
3. Do not publish `ContentItem` blog rows, sample manifests, or metadata-only manifests directly. They need explicit mapping or full-body generation/import first.
4. Treat localized bundle content and localized DB rows as a second phase: confirm route mapping and sitemap expectations before publishing, because the main sitemap currently looks canonical-only.

## Nearby Checkouts

- `/root/nursenestest-core-reclone`: present
- `/root/nursenest-core-corrupt-20260430-223920`: present

## Output Files

- Inventory JSON: `reports/blog-hidden-content-inventory.json`
- Audit report: `reports/blog-hidden-content-audit.md`
