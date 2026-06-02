# Crawl Capacity Analysis

Generated: 2026-06-01

## Safety Note

The requested 2,000 URL crawl was not rerun in this pass. Existing production evidence already shows the origin becomes unhealthy below that level. Repeating larger production crawls before remediation would knowingly recreate the `no_healthy_upstream` incident.

## Existing Controlled Crawl Evidence

| URLs | Concurrency | Status | HTTP 200 | HTTP 504 | Fetch errors | Upstream failures | p95 | Health after |
| ---: | ---: | --- | ---: | ---: | ---: | ---: | ---: | --- |
| 100 | 12 | Degraded | 87 | 0 | 13 | 0 | 20,003ms | `/healthz` and `/readyz` timed out at 20s |
| 500 | 12 | Fail | 94 | 299 | 107 | 173 | 20,002ms | Unhealthy / no healthy upstream observed in prior report |
| 1,000 | 12 | Fail | 367 | 606 | 27 | 606 | 20,001ms | `/healthz` 504, `/readyz` 504, `x-do-failure-code=UH` |
| 2,000 | 12 | Not run | - | - | - | - | - | Unsafe after 500/1,000 failures |

## Requested Concurrency Matrix

The exact 4/8/12/16/24 matrix has not been fully executed against production because concurrency 12 already caused origin instability. Current known threshold:

| Concurrency | 100 URLs | 500 URLs | 1,000 URLs | 2,000 URLs |
| ---: | --- | --- | --- | --- |
| 4 | Not measured | Not measured | Not measured | Not measured |
| 8 | Not measured | Not measured | Not measured | Not measured |
| 12 | Degraded/fails health-after | Fails | Fails | No-go |
| 16 | No-go until remediation | No-go until remediation | No-go until remediation | No-go until remediation |
| 24 | No-go until remediation | No-go until remediation | No-go until remediation | No-go until remediation |

## Breaking Point

The practical breaking point is below `500 URLs / concurrency 12` on the current single-instance origin.

More precisely:

- At rest and under sequential sampling, the app is healthy.
- At `100 URLs / concurrency 12`, pages are often slow enough to hit a 20s client deadline and health probes time out after the batch.
- At `500 URLs / concurrency 12`, upstream failures appear.
- At `1,000 URLs / concurrency 12`, the origin returns hundreds of 504s and health probes return `no_healthy_upstream`.

## CPU, Memory, Readiness, Restart Evidence

From existing reports and black-box recorder artifacts:

- Runtime logs showed process start/replacement during the incident.
- Prior report observed component exit code `128`.
- Health probes after the 1,000 URL crawl returned `504` with `x-do-failure-code=UH`.
- Black-box recorder samples show child process RSS around ~379-382 MB soon after startup/restart, then repeated signal/exit cycles during recovery windows.
- The app was on a single DigitalOcean `basic-s` instance, so one unhealthy instance meant zero healthy upstreams.

## Capacity Verdict

Capacity certification: FAIL.

The origin is not ready for crawler bursts or Search Console recovery until the app is either horizontally scaled or public route generation cost is reduced enough to keep p95 under 2s during a 2,000 URL crawl.

