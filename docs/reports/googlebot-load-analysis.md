# Googlebot Load Analysis

Date: 2026-06-01

## Scope

- Base URL: http://127.0.0.1:3000
- User agent: `Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html) NurseNestCapacityAudit/1.0`
- Discovered URL inventory: 6
- URL batch sizes: 5
- Concurrency levels: 2
- Request timeout: 30000 ms

## Failure Threshold

First observed failure at 5 URLs with concurrency 2.

## Results

| URLs | Concurrency | 200s | Errors | Upstream Failures | Avg ms | p50 ms | p95 ms | p99 ms | Max ms | Max RSS MB | Max CPU % | Restarts | readyz Non-200 |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 5 | 2 | 5 | 0 | 0 | 9080 | 1784 | 21331 | 21331 | 21331 | 674.7 | 90.9 | 0 | 4 |

## Slowest Requests

| URLs | Concurrency | Status | ms | URL |
| ---: | ---: | ---: | ---: | --- |
| 5 | 2 | 200 | 21331 | http://127.0.0.1:3000/lessons |
| 5 | 2 | 200 | 20625 | http://127.0.0.1:3000/question-bank |
| 5 | 2 | 200 | 1784 | http://127.0.0.1:3000/blog |

## Interpretation

- A failure is counted when any crawl request returns a fetch error or HTTP 5xx, any DigitalOcean upstream failure header appears, a monitored app process exits during a batch, or `/readyz`/`/healthz` returns non-200 during monitoring.
- CPU and memory are sampled from local Node/Next standalone processes on the same host as the crawl.
- Restart events are local process disappearances, not DigitalOcean container restart counters.

## Raw Artifacts

Raw JSON and CSV outputs are in `reports/googlebot-load-analysis/`.
