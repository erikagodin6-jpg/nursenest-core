# Origin Performance Certification

Generated: 2026-06-01

## Certification Criteria

| Criterion | Required | Current result |
| --- | ---: | --- |
| 100 URL crawl | 0 failures, p95 < 2s | FAIL: p95 20,003ms in latest artifact |
| 500 URL crawl | 0 failures, p95 < 2s | FAIL: 299 HTTP 504, 107 fetch errors |
| 1,000 URL crawl | 0 failures, p95 < 2s | FAIL: 606 HTTP 504, 27 fetch errors |
| 2,000 URL crawl | 0 failures, p95 < 2s | NOT RUN: unsafe before remediation |
| p99 | < 5s | FAIL: p99 near 20s ceiling under crawl |
| Upstream failures | 0 | FAIL: 606 upstream failures in 1,000 batch |
| Unhealthy instances | 0 | FAIL: health probes returned/timed out as unhealthy after load |
| Container restarts | 0 | FAIL: prior incident recorded process replacement/exit |
| Readiness failures | 0 | FAIL: `/readyz` returned 504 or timed out after crawl |

## Current Production State

At low pressure, representative routes and health probes return 200. Fresh spot check:

- `/healthz`: 200 in ~191ms.
- `/readyz`: 200 in ~207ms.
- Representative public routes returned 200 sequentially.

This is not sufficient for certification because crawl-load artifacts show saturation and upstream failure.

## GO / NO-GO

NO-GO.

Origin performance is not certified for Search Console recovery or large crawler bursts.

## Required Before Re-Certification

1. Reduce public route payloads, especially localized, question, flashcard, lesson, NP, and blog pages.
2. Remove duplicate blog slug DB work across metadata and page body.
3. Warm or degrade homepage public stats on crawler/cache-miss paths.
4. Validate DB pool pressure with direct production metrics.
5. Scale the origin to at least two instances before retrying 1,000+ URL crawls.
6. Re-run crawl matrix in ascending order: 100, 500, 1,000, 2,000 at concurrency 4, then 8, then 12.

## SEO Work Status

SEO, content, backlinks, authority clusters, and GSC submissions remain paused until origin performance is certified.

