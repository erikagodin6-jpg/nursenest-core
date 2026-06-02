# Hybrid blog (DB primary + static long-tail supplement) — implementation report

**Date:** 2026-05-10  
**Scope:** Public marketing blog surfaces only. Admin/editorial pipeline and `BlogPost` authoring flows were not changed.

## Summary

- **`BlogPost` (Postgres)** remains the canonical source for authored content. **`src/content/blog-static-longtail/*.md`** adds SEO long-tail supplements.
- **Slug conflicts:** wherever index, detail, hubs, or sitemap merge static supplements with DB rows, **DB wins** (dedupe by slug, DB row retained).
- **Bundled** `src/content/blog-static-posts` corpus is unchanged; optional **`BLOG_STATIC_MARKETING_HIDDEN_SLUGS`** (comma-separated) can hide specific bundled slugs from public static list/detail helpers (`static-blog-posts.ts`).

## Truthpack

`.vibecheck/truthpack/` was **not present** in this workspace clone; no truthpack fields were asserted for this report.

## Schema

No Prisma migrations or `BlogPost` model changes were introduced for this hybrid layer.

## Key files

| Area | Path |
|------|------|
| Safe queries + merge + sitemap rows | `src/lib/blog/safe-blog-queries.ts` |
| Index merge + caps | `src/lib/blog/blog-public-merge.ts` |
| Bundled static access | `src/lib/blog/static-blog-posts.ts` |
| Supplement union + tag/category helpers | `src/lib/blog/blog-static-supplement.ts` |
| Long-tail load/parse | `src/lib/blog/blog-static-longtail-load.ts`, `blog-static-longtail-types.ts`, `blog-static-longtail-validate.ts` |
| Long-tail markdown | `src/content/blog-static-longtail/*.md` (3 posts) |
| Live vs scheduled visibility | `src/lib/blog/blog-visibility.ts` |
| Blog sitemap slice | `src/lib/seo/sitemap-blog-xml.ts` → `getMergedBlogSitemapSlugRows()` |
| Contract tests | `src/lib/blog/hybrid-blog-static-longtail.contract.test.ts` (in `test:blog-recovery`) |
| Validation CLI | `scripts/blog/validate-blog-static-longtail.mts` |
| Collision diagnostic | `scripts/blog/diagnose-blog-slug-collisions.mts` |

## Long-tail corpus (3 slugs)

1. `why-potassium-changes-are-dangerous-in-acute-kidney-injury-nursing-exams`
2. `why-furosemide-can-worsen-electrolyte-problems-on-nursing-exams`
3. `why-shortness-of-breath-after-iv-fluids-matters-on-nclex-style-questions`

## Merge behavior

- **Global `/blog` index:** DB rows merge with supplement rows; live DB slugs exclude overlapping supplements.
- **Detail `/blog/[slug]`:** DB preferred; long-tail fills when no live DB row.
- **Tag / category hubs:** Scoped overlap queries keep Prisma `IN` lists bounded.
- **Sitemap:** Static + long-tail union; `mergeBlogSitemapRowsDbPrimary` dedupes (DB wins on shared slugs).

## Validation

`npm run validate:blog-static-longtail` — required fields, unique slugs, tags, body, SEO, disclaimer heuristics.

## Collision diagnostic

`npm run diagnose:blog-slug-collisions` — optional `--write-report` → `docs/reports/blog-slug-collision-diagnostic.txt`. Read-only; uses configured `DATABASE_URL`.

## Commands run (exit codes)

| Command | Exit |
|---------|------|
| `npm run validate:blog-static-longtail` | 0 |
| `npm run typecheck:critical` | 0 |
| `npm run test:blog-recovery` | 0 |
| `npm run test:homepage` | 0 |
| `npx tsx scripts/blog/diagnose-blog-slug-collisions.mts --write-report` | 0 |

## Fixes in this continuation

- Implemented missing `isBlogSlugHiddenFromPublicMarketingCatalog` in `blog-visibility.ts` (env `BLOG_STATIC_MARKETING_HIDDEN_SLUGS`).
- Finished `validate-blog-static-longtail.mts` + `package.json` script; validation requires non-empty `tags`.
- Added `diagnose-blog-slug-collisions.mts` + `diagnose:blog-slug-collisions` script.
- Contract test category hub assertion aligned to frontmatter category **Pathophysiology**.
