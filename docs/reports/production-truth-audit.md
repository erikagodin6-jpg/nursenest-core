# Production Truth Audit

Generated: 2026-06-01T19:09:32.412Z
Origin: https://nursenest.ca

## Verdict

**NO-GO.** Core probes return HTTP 200, but the full sitemap crawl is not healthy: 7491 URLs returned HTTP 504, 87 timed out/aborted, and 2 returned HTTP 520. Canonical, orphan, internal-link, hub, and GSC findings cannot be certified while most sitemap URLs return error responses.

## Required Probes

| Route | Status | Response ms | Cache | Upstream |
| --- | ---: | ---: | --- | --- |
| / | 200 | 1159 | MISS | 200 |
| /healthz | 200 | 269 | MISS | 200 |
| /readyz | 200 | 352 | MISS | 200 |
| /blog | 200 | 939 | MISS | 200 |
| /blog?page=2 | 200 | 791 | MISS | 200 |
| /blog?page=5 | 200 | 1420 | MISS | 200 |
| /blog?page=10 | 200 | 909 | MISS | 200 |
| /sitemap.xml | 200 | 80 | MISS | 200 |
| /sitemap-blog.xml | 200 | 1889 | MISS | 200 |

## URL Inventory

| Inventory | Count |
| --- | ---: |
| Total public sitemap URLs | 7871 |
| Blog sitemap URLs | 5824 |
| Lesson sitemap URLs | 1463 |
| Pathway sitemap URLs | 274 |
| Localized sitemap URLs | 1 |
| Allied sitemap URLs | 24 |

## HTTP Results

| Status | Count |
| --- | ---: |
| HTTP 200 | 291 |
| HTTP 301 | 0 |
| HTTP 404 | 0 |
| HTTP 500 | 0 |
| HTTP 504 | 7491 |
| HTTP 520 | 2 |
| Fetch errors/timeouts | 87 |

## Route Family Results

| Family | 200 | 301 | 404 | 500 | 504 | 520 | Fetch errors |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| public | 19 | 0 | 0 | 0 | 134 | 0 | 1 |
| pathway | 56 | 0 | 0 | 0 | 389 | 0 | 4 |
| blog | 216 | 0 | 0 | 0 | 5502 | 1 | 82 |
| lesson | 0 | 0 | 0 | 0 | 1463 | 1 | 0 |
| localized | 0 | 0 | 0 | 0 | 3 | 0 | 0 |

## Sitemap Segments

| Sitemap | Status | URL count | Earliest lastmod | Latest lastmod |
| --- | ---: | ---: | --- | --- |
| sitemap-en.xml | 200 | 1 | 2026-06-01 | 2026-06-01 |
| sitemap-fr.xml | 200 | 0 | - | - |
| sitemap-es.xml | 200 | 0 | - | - |
| sitemap-hi.xml | 200 | 0 | - | - |
| sitemap-pt.xml | 200 | 0 | - | - |
| sitemap-ar.xml | 200 | 0 | - | - |
| sitemap-de.xml | 200 | 0 | - | - |
| sitemap-jp.xml | 200 | 0 | - | - |
| sitemap-ko.xml | 200 | 0 | - | - |
| sitemap-zh.xml | 200 | 0 | - | - |
| sitemap-zh-tw.xml | 200 | 0 | - | - |
| sitemap-it.xml | 200 | 0 | - | - |
| sitemap-tl.xml | 200 | 0 | - | - |
| sitemap-core.xml | 200 | 44 | 2026-06-01 | 2026-06-01 |
| sitemap-blog.xml | 200 | 5822 | 2025-09-15T12:00:00.000Z | 2026-06-01 |
| sitemap-fr-blog.xml | 200 | 1 | 2026-06-01 | 2026-06-01 |
| sitemap-es-blog.xml | 200 | 1 | 2026-06-01 | 2026-06-01 |
| sitemap-pathways.xml | 200 | 274 | 2026-06-01 | 2026-06-01 |
| sitemap-lessons.xml | 200 | 1463 | 2026-06-01 | 2026-06-01 |
| sitemap-localized.xml | 200 | 1 | 2026-06-01 | 2026-06-01 |
| sitemap-clinical-modules.xml | 200 | 75 | 2026-06-01 | 2026-06-01 |
| sitemap-allied.xml | 200 | 24 | 2026-06-01 | 2026-06-01 |
| sitemap-new-grad.xml | 200 | 46 | 2026-06-01 | 2026-06-01 |
| sitemap-cnple.xml | 200 | 24 | 2026-06-01 | 2026-06-01 |
| sitemap-authority-clusters.xml | 200 | 96 | 2026-06-01 | 2026-06-01 |

## Indexability Findings

| Finding | Count | Notes |
| --- | ---: | --- |
| Canonical issues | 3 | Sampled HTML checks only; three safe code fixes were applied locally. |
| Noindex issues | 0 | No noindex pages found in sampled HTML checks. |
| Non-200 pages | 7580 | Dominated by 504 and 20s aborts. |
| Orphan pages | Not certifiable | Link graph cannot be trusted while 7580 sitemap URLs are non-200. |
| Missing from sitemap | 0 discovered | This crawl starts from sitemaps; non-sitemap discovery requires a separate graph crawl after 5xx is fixed. |
| Fully indexable sampled URLs | 288 | Requires rerun after deploy. |

CSV exports:

- `docs/reports/non-200-pages.csv`
- `docs/reports/canonical-errors.csv`
- `docs/reports/orphaned-pages.csv`
- `docs/reports/missing-from-sitemap.csv`

## Blocking Root Cause

The live site can answer small probes, but it does not sustain a sitemap-scale crawl. This matches the earlier origin-capacity/runtime incident pattern: most failures are HTTP 504 under crawl load rather than isolated page-template 404s. SEO recovery must pause at the crawlability gate until route families return stable 200s.
