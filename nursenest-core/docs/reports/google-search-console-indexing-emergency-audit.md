# Google Search Console Indexing Emergency Audit

Generated: 2026-05-30T04:30:35.117Z

## Executive Summary

Search Console reported:

- 5xx: 8,122
- 404: 18,985
- Blocked by robots.txt: 2,037
- Crawled - Currently Not Indexed: 718
- Noindex: 5,611

No local GSC URL CSV exports found. Reports use the aggregate counts from the prompt plus source/sitemap/robots analysis. Export affected URLs from GSC into data/gsc-indexing/ for frequency-accurate grouping.

## Current Local Findings

- Robots.txt blocks only private/internal/duplicate infrastructure paths.
- Sitemap index uses 12 child urlsets and is DB-free.
- Public crawl bypass exists in `src/proxy.ts` for all sitemap children and robots.
- Existing sitemap guards exclude app/admin/api/internal/auth-noindex/SEO-rewrite surfaces.
- Frequency-accurate 404/5xx/noindex attribution requires GSC URL exports; aggregate counts alone are not enough to identify every failing URL.

## Deliverables

- `docs/reports/seo-5xx-audit.md`
- `docs/reports/robots-audit.md`
- `docs/reports/404-audit.md`
- `docs/reports/crawled-not-indexed-audit.md`
- `docs/reports/noindex-audit.md`
- `docs/reports/sitemap-health-report.md`

## P0 Next Steps

1. Export URL lists from Search Console for all five issue categories.
2. Save them as CSVs under `data/gsc-indexing/` with filenames containing `5xx`, `404`, `blocked`, `crawled-not-indexed`, and `noindex`.
3. Rerun `npm run audit:gsc-indexing`.
4. Run live sitemap verification at 5,000+ URLs and fix every non-200/noindex/redirect result.
5. Add 301s only for valuable legacy URLs; return 410 for obsolete generated URLs; ignore exploit garbage.
