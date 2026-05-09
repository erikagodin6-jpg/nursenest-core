# Long-tail SEO blog publishing report

**Date:** 2026-05-09  

**Inventory:** 300 unique topics — `reports/longtail-patho-pharm-topic-inventory.md` (rendered from `longtail-patho-pharm-topic-inventory.csv` via `npm run blog:longtail:inventory-md`).

## Honest publish counts

- Topics planned: **300**
- Drafted in this program (CI/agent): **0**
- Published: **0**
- Read-only DB inventory slug matches: **0** (`npm run blog:longtail:slugs-db-check`)

## Staff flow (dry-run; no secrets)

1. `npm run blog:longtail:topics-for-batch` → paste into `/admin/blog/topic-batch`
2. Preview → Save schedule (`DRAFT_ONLY` until QA)
3. Cron: `POST /api/cron/blog-batch-schedule` with bearer `CRON_SECRET` (`src/app/api/cron/blog-batch-schedule/route.ts`)

## SEO / sitemap proof paths

- Article surface: `nursenest-core/src/app/(marketing)/(default)/blog/[slug]/page.tsx` (JSON-LD + breadcrumbs)
- Merged blog sitemap: `src/lib/seo/sitemap-blog-xml.ts`, `src/lib/blog/safe-blog-queries.ts` (`getMergedBlogSitemapSlugRows`)
- Localized blog sitemap: `src/lib/seo/sitemap-localized-blog-xml.ts`

## Commands (exit codes, verification run)

| Command | Code |
| --- | ---: |
| `npm run typecheck:critical` | 0 |
| `npm run test:homepage` | 0 |
| `npm run test:seo-sitemap` | 1 (`long-tail-seo-trio-blog-seed.contract.test.ts` body &lt; 1500 words) |
| `npx tsx nursenest-core/scripts/blog/verify-admin-publish-path.mts` | 0 (dry-run) |
| `npx tsx nursenest-core/scripts/blog/verify-blog-publication-readiness.mts` | 0 |
| `npx tsx nursenest-core/scripts/blog/longtail-inventory-slugs-db-check.mts` | 0 |

## Git (deliverable tip)

`e39c04307` — docs(seo): long-tail blog plan, 300-topic inventory CSV, blog Playwright smoke  

Prior: `1faa3fef7` — publishing report + plan appendix; `3a5e874d1` — longtail npm scripts + inventory renderer.

## Not done (why)

No AI generation or publishes without staff admin session, `AI_ADMIN_GENERATION_ENABLED`, and provider billing.
