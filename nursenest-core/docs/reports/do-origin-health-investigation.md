# DigitalOcean Origin Health Investigation

Generated: 2026-06-01

## Executive Finding

This is an origin capacity and runtime stability incident, not an SEO metadata issue.

The production service recovered at rest after restart, but a sustained 1,000 URL crawl at concurrency 12 caused the only web instance to become unhealthy. After failure, even `/healthz` and `/readyz` returned:

- HTTP `504`
- `x-do-failure-code: UH`
- `x-do-failure-msg: no_healthy_upstream`
- `x-do-orig-status: 503`

## DigitalOcean App State

| Item | Observed |
| --- | --- |
| App | `nursenest-core-next` |
| App ID | `d6a4b825-4d70-4dd4-8d71-04b354d36f43` |
| Component | `web` |
| Region | Toronto |
| Active deployment before restart | `4643dd7a-2cf4-4fa8-af2a-5d60de32f597` |
| Recovery restart deployment | `39ab7d09-782c-4de0-ad88-3a84c69b45c6` |
| Instance size | `basic-s` |
| Instance count | `1` |
| Health path | `/readyz` |
| Health interval | 15s |
| Health timeout | 15s |
| Failure threshold | 12 |

## Restart / Availability Evidence

Before load:

- `/healthz`: 200
- `/readyz`: 200

During the 1,000 URL crawl:

- 606 URLs returned `504 no_healthy_upstream`.
- 27 requests timed out at the client-side 20s audit timeout.
- Health probes after the batch returned `504 no_healthy_upstream`.

Runtime logs showed:

- New web process start at `2026-06-01T03:40:47Z`.
- Previous component exited with code `128`.
- Instance name changed during the incident, confirming a restart/replacement event.

After manual restart:

- Restart deployment: `39ab7d09-782c-4de0-ad88-3a84c69b45c6`
- Restart completed: `2026-06-01T03:47:47Z`
- `/healthz`: 200, TTFB ~112ms
- `/readyz`: 200, TTFB ~149ms
- `/`: 200, TTFB ~1296ms, total ~5385ms

## Correlation With Crawl Load

The origin stayed healthy for:

- 100 URLs at concurrency 12
- 500 URLs at concurrency 12

The origin failed at:

- 1,000 URLs at concurrency 12

The failure is correlated with sustained crawl load, not with initial boot or an immediately broken route.

## Runtime Configuration Risk

The service is running on a 2 GB `basic-s` instance, but the app spec had runtime `NODE_OPTIONS` configured with `--max-old-space-size=4096`.

That allows Node's old-space heap target to exceed the container memory budget. Under sustained public crawl load, this is a credible cause of process termination, App Platform instance replacement, and `no_healthy_upstream`.

Mitigation added in code:

- `scripts/start-production.mjs` now clamps `--max-old-space-size` to `NODE_MAX_OLD_SPACE_SIZE_MB` when that env var is present.
- Current production env already includes `NODE_MAX_OLD_SPACE_SIZE_MB=768`; after deployment, runtime old-space will be clamped to 768 MB instead of 4096 MB.

## Route Load Evidence

Runtime logs during crawl showed slow public page rendering:

- `marketing.blog_post` routes at ~2.5s to ~4.2s
- `metadata.generation` for blog routes at ~3.2s to ~7.2s
- `pathway_lessons` DB timings near ~0.6s to ~2.7s
- `pathway_lessons db_timeout` fallback events

The crawl is therefore applying both CPU/render pressure and database/query pressure.

## Root Cause

Primary root cause:

- Single-instance DigitalOcean App Platform service (`basic-s`, 1 instance, single-instance-only tier) cannot absorb sustained sitemap crawl traffic.

Contributing causes:

- Runtime heap limit allowed to exceed container memory budget.
- Public blog/article pages have multi-second render and metadata-generation paths under load.
- `/readyz` is lightweight and passes at rest, but after instance failure App Platform has no healthy upstream.
- Current health check confirms liveness at rest, not crawl-load survivability.

## Required Next Action

Do not resume SEO crawl/indexing work yet.

Recommended stabilization order:

1. Deploy the runtime heap clamp.
2. Move off `basic-s` single-instance hosting.
3. Use at least two scalable instances, preferably `apps-s-1vcpu-2gb` or stronger.
4. Re-run the 1,000 URL capacity test.
5. Only attempt 2,000 URL certification after 1,000 URLs produce 0 upstream failures.

## Current Verdict

NO-GO for SEO recovery crawl.

Production is back up after restart, but origin stability is not certified.
