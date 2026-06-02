# Googlebot Load Analysis

Date: 2026-06-01

## Scope

- Base URL: `http://127.0.0.1:3000`
- Runtime: local `.next/standalone` production artifact behind `scripts/start-standalone.mjs`
- User agent: `Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html) NurseNestCapacityAudit/1.0`
- Corrected sitemap-derived inventory: 1,623 URLs
- Requested matrix: 100, 500, 1000, 2000 URLs at concurrency 4, 8, 12, 16, 24
- Request timeout: 30s

Important limitation: this is a local origin simulation, not a DigitalOcean App Platform telemetry pull. Restart events are local process disappearances. DigitalOcean container restart counters and platform CPU graphs were not available from this workspace.

## Failure Threshold

GO/NO-GO: **NO-GO**

Exact observed thresholds from the corrected sitemap-derived crawl:

- First readiness failure: **100 URLs at concurrency 4**
- First p95 breach above 2s: **500 URLs at concurrency 4**
- First non-completing/saturation threshold: **1000 URLs at concurrency 4**
- First hard request-error threshold: **not reached in completed corrected batches**
- Restart threshold: **not reached; 0 local restarts observed**

The dominant failure mode is not missing pages. It is origin saturation: `/readyz` returns non-200 under crawl pressure while the Next child process remains alive and CPU-heavy.

## Corrected Crawl Results

| URLs | Concurrency | 200s | Errors | Avg ms | p50 ms | p95 ms | p99 ms | Max ms | Max RSS MB | Max CPU % | Restarts | readyz Non-200 |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 100 | 4 | 100 | 0 | 1,198 | 1,269 | 1,816 | 2,200 | 2,208 | 1,075.9 | 91.3 | 0 | 20 |
| 500 | 4 | 500 | 0 | 1,525 | 1,141 | 3,565 | 5,431 | 25,783 | 1,671.7 | 119.7 | 0 | 144 |
| 1000 | 4 | incomplete | incomplete | n/a | n/a | n/a | n/a | n/a | ~2,880 live RSS | ~141 live CPU | 0 | 503 live `/readyz` |

The corrected 1000 URL / concurrency 4 batch was stopped after extended runtime because the local child process continued consuming high CPU, RSS climbed near 2.9 GB, and live `/readyz` remained 503. This establishes the practical local breaking point before testing higher concurrency levels against the corrected inventory.

## Superseded Seed-URL Matrix

Before correcting sitemap URL rewriting, the harness fell back to 6 repeated seed URLs. That provisional matrix completed all requested sizes/concurrency levels, but it is not representative of the crawl surface and is excluded from the threshold call. It did, however, show the same failure pattern:

- No request errors or upstream failure headers.
- Repeated `/readyz` non-200 responses under load.
- p95 crossed 2s at concurrency 8.
- p95 crossed 5s at 2000 URLs/concurrency 16 and all concurrency-24 batches.

Raw superseded artifacts remain under `reports/googlebot-load-analysis/` for traceability, but the corrected threshold is based on the 1,623-URL sitemap-derived run.

## Interpretation

The application can keep returning HTTP 200 for crawled pages while readiness fails. That matches the production symptom pattern where low-scale spot checks pass but crawler pressure can make the origin unhealthy.

The corrected crawl shows three escalating limits:

1. **Health limit:** `/readyz` becomes unreliable at the first requested tier, 100 URLs / concurrency 4.
2. **Latency limit:** p95 exceeds 2s at 500 URLs / concurrency 4.
3. **Capacity limit:** 1000 URLs / concurrency 4 does not complete cleanly locally and drives RSS toward ~2.9 GB.

## Raw Artifacts

- Corrected discovery: `reports/googlebot-load-analysis/discovered-urls.json`
- Corrected completed batches:
  - `reports/googlebot-load-analysis/urls-100-concurrency-4.json`
  - `reports/googlebot-load-analysis/urls-500-concurrency-4.json`
- Harness: `nursenest-core/scripts/googlebot-load-analysis.mjs`

