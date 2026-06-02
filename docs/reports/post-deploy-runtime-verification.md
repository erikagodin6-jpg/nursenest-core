# Post-Deploy Runtime Verification

Generated: 2026-06-01

## Status

NO-GO pending deployment and full crawl.

## Pre-Deploy Verification Completed

Code-level verification after the safe-mode patch:

- `typecheck:critical`: PASS.
- client/server boundary validation: PASS.
- admin content audit route contract tests: PASS.
- sitemap validation: PASS.
- Full local Next build: inconclusive due build-tool/artifact failures after prep, not TypeScript errors.

Live at-rest probe from the currently deployed build:

| Endpoint | Status | Time |
|---|---:|---:|
| `/` | 200 | 0.656 s |
| `/healthz` | 200 | 0.099 s |
| `/readyz` | 200 | 0.181 s |
| `/blog` | 200 | 0.012 s |
| `/sitemap.xml` | 200 | 0.012 s |
| `/sitemap-blog.xml` | 200 | 0.011 s |

100 URL production sample crawl:

| Metric | Result |
|---|---:|
| URLs audited | 100 |
| HTTP 200 | 98 |
| HTTP 504 | 1 |
| Fetch timeout | 1 |
| p95 | 20,003 ms |
| upstream failures | 0 |

## Required Post-Deploy Verification

After deploying this branch:

1. Probe `/`, `/healthz`, `/readyz`, `/blog`, `/sitemap.xml`, `/sitemap-blog.xml`.
2. Crawl all sitemap URLs from the current production sitemap set.
3. Export fresh results under `reports/production-runtime-verification/`.

## Success Criteria

- Homepage: 200.
- `/healthz`: 200.
- `/readyz`: 200.
- 504 count: 0.
- 5xx count: under 50.

## Search Console Recommendation

NO-GO until the post-deploy full crawl passes.
