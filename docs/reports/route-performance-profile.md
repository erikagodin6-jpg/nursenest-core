# Route Performance Profile

Generated: 2026-06-01

## Scope

Production origin: `https://nursenest.ca`

Method:

- Fresh low-pressure route profile: 2 sequential samples per representative route, 25s timeout.
- Existing capacity artifacts reused for crawl-load behavior:
  - `reports/origin-route-profile/latest.json`
  - `reports/origin-capacity-test/batch-100.csv`
  - `reports/origin-capacity-test/batch-500.csv`
  - `reports/origin-capacity-test/batch-1000.csv`
  - `reports/origin-capacity-test/summary.json`

Current health spot check after profiling:

| Probe | Status | Time |
| --- | ---: | ---: |
| `/healthz` | 200 | 191ms |
| `/readyz` | 200 | 207ms |

## Fresh Sequential Route Profile

These samples prove the origin can answer at low pressure. They do not certify crawl capacity.

| Route family | Samples | Avg | p50 | p95 | p99 | Errors | Slowest representative |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Homepage | 2 | 1,038ms | 917ms | 1,159ms | 1,159ms | 0 | `/` at 1,159ms, 892 KB |
| Lessons | 2 | 675ms | 574ms | 775ms | 775ms | 0 | `/pre-nursing/lessons` at 775ms, 1.59 MB |
| Questions | 4 | 1,318ms | 1,114ms | 2,218ms | 2,218ms | 0 | `/question-bank` at 2,218ms, 1.58 MB |
| Flashcards | 2 | 1,230ms | 1,122ms | 1,338ms | 1,338ms | 0 | `/flashcards` at 1,338ms, 1.58 MB |
| NP routes | 2 | 1,088ms | 726ms | 1,450ms | 1,450ms | 0 | `/us/np/aanp-practice-test` at 1,450ms, 1.64 MB |
| RN routes | 2 | 233ms | 99ms | 366ms | 366ms | 0 | `/nclex-rn` at 366ms, 35 KB |
| Localized routes | 4 | 1,530ms | 1,539ms | 1,588ms | 1,588ms | 0 | `/es` at 1,588ms, 3.15 MB |
| Blog routes | 2 | 361ms | 91ms | 630ms | 630ms | 0 | `/blog/acute-abdominal-pain-workup-np-certification` at 630ms cold-ish, 91ms cache hit, 1.68 MB |
| Sitemap routes | 4 | 79ms | 14ms | 147ms | 147ms | 0 | `/sitemap.xml` at 147ms, cache hit at 14ms |

## Crawl-Load Profile

Existing production crawl evidence shows route behavior changes sharply under sustained concurrency.

| Batch | Concurrency | Audited | 200 | 504 | Fetch errors | Upstream failures | p50 | p95 | p99/max |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 100 | 12 | 100 | 87 | 0 | 13 | 0 | 20,001ms | 20,003ms | 20,010ms |
| 500 | 12 | 500 | 94 | 299 | 107 | 173 | 158ms | 20,002ms | 20,011ms |
| 1,000 | 12 | 1,000 | 367 | 606 | 27 | 606 | 151ms | 20,001ms | 20,006ms |

The low p50 in failed batches is misleading: many requests fail quickly through the load balancer after the origin becomes unhealthy, while survivors and timeout rows hit the 20s audit deadline.

## Slowest Requests Under 100-URL Crawl

| URL | Status | Time |
| --- | ---: | ---: |
| `/terms` | 200 | 20,010ms |
| `/refund-policy` | 200 | 20,010ms |
| `/blog/acute-abdominal-pain-workup-np-certification` | 200 | 20,008ms |
| `/pricing` | 200 | 20,007ms |
| `/about` | timeout | 20,004ms |

## Finding

The production issue is not missing pages. At low pressure the representative pages return 200. Under crawl pressure, p95 reaches the 20s timeout ceiling, health probes stop responding, and DigitalOcean reports `origin_no_healthy_upstream` / `no_healthy_upstream`.

