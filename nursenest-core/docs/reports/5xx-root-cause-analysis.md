# 5XX Root Cause Analysis

Generated: 2026-06-01T02:39:39.237Z

## Failures By Route Family

| Family | 5xx count |
| --- | ---: |
| blog | 4117 |
| lessons | 1464 |
| NP | 136 |
| RN | 98 |
| localized routes | 39 |
| RPN | 28 |
| other | 15 |
| questions | 13 |

## Failures By Inferred Root Cause

| Root cause | Count |
| --- | ---: |
| origin_no_healthy_upstream | 5910 |

## Interpretation

- `origin_no_healthy_upstream` / `origin_unhealthy_or_runtime_crash` means DigitalOcean/Cloudflare did not have a healthy app response. Route-level SEO metadata changes cannot fix those until deployment/runtime health is stable.
- `gateway_timeout_or_route_render_timeout` means the request reached the edge but the page did not complete in time or the upstream returned timeout HTML.
- `server_exception_or_rendering_failure` should be traced by route family and fixed with static fallbacks or guarded loaders.

## Recovery Applied

`scripts/start-standalone.mjs` now runs the production bootstrap proxy/readiness watchdog instead of directly binding the Next standalone child to the public port. The parent process:

- serves `/healthz` immediately without database dependency;
- keeps `/readyz` at `503` until the child standalone server accepts the internal readiness probe;
- forwards traffic only after handlers are ready;
- logs child bind/readiness failures with structured `startup_watchdog` events;
- exits decisively when the child cannot bind or become ready.

This addresses the observed `x-do-failure-code: UH` / `no_healthy_upstream` failure mode where App Platform has no healthy origin during cold start, child crash, or crawl-pressure recovery windows.

CSV: `reports/gsc-5xx-emergency/5xx-urls.csv`
