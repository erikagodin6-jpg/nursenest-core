# Sitemap segmentation — Phase 1 report

**Date:** 2026-05-10  
**Scope:** Index-first `/sitemap.xml`, `/sitemap-core.xml`, `/sitemap-lessons.xml`, robots single-line contract, tests.

## Files changed / added

| Area | Path |
|------|------|
| Sitemap index route | `src/app/sitemap.xml/route.ts` |
| Core urlset route | `src/app/sitemap-core.xml/route.ts` (new) |
| Lessons urlset route | `src/app/sitemap-lessons.xml/route.ts` (new) |
| Index child registry | `src/lib/seo/sitemap-index-children.ts` (new) |
| Index XML builder | `src/lib/seo/sitemap-urlset-build.ts` (`buildSitemapIndexXml`) |
| Core collector option | `src/lib/seo/sitemap-static-xml.ts` (`omitPathwayLessonSeoUrls`) |
| robots.txt | `src/app/robots.txt/route.ts` |
| Planning doc | `docs/planning/sitemap-architecture-audit-and-roadmap.md` |
| Tests | `src/lib/seo/sitemap-index.contract.test.ts`, `sitemap-segment-dedupe.contract.test.ts`, `sitemap-merged-route.test.ts`, `robots-route-source.contract.test.ts`, `src/app/robots.txt/route.test.ts` |

Unchanged routes: `sitemap-blog.xml`, `sitemap-allied.xml`, `sitemap-new-grad.xml` (referenced from index).

## Child sitemap routes (Phase 1)

1. `/sitemap-core.xml` — core collector minus pathway-lesson SEO urls; blog overlap stripped.
2. `/sitemap-blog.xml` — blog-only (unchanged).
3. `/sitemap-lessons.xml` — `collectPathwayLessonSeoUrls` only.
4. `/sitemap-allied.xml` — unchanged.
5. `/sitemap-new-grad.xml` — unchanged.

`/sitemap.xml` — `<sitemapindex>` listing five children.

## URL counts per segment

Not captured in CI; count `<url>` per segment after deploy via HTTP GET.

## Collectors left in core (not moved to lessons)

Programmatic study SEO, content-backed study hubs, exam/NP/OSCE marketing URLs — unchanged from pre-split behavior.

## robots.txt

Single `Sitemap:` line → `/sitemap.xml` index only.

## Tests run

`npm run typecheck:critical` and `node --import tsx --test` on robots + sitemap SEO tests (see PR).

## Risks / follow-up

- Core vs allied duplicate `<loc>` possible (pre-existing).
- Full lesson collector not runnable in plain Node tests (Next cache); separation enforced in source.
- Follow-up: localized chunk, CI cross-file uniqueness — planning doc.
