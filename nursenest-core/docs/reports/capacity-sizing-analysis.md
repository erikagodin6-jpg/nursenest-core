# Capacity Sizing Analysis

Generated: 2026-06-01

## Executive Finding

The current origin is under-provisioned for public crawl bursts.

The service is running on a single shared 1 vCPU / 2 GB instance. It failed at 500 URLs with concurrency 12 after the runtime heap flag was corrected. This is far below the capacity needed for Google crawl bursts or broad sitemap recrawls.

## Current App Platform Size

| Setting | Current |
| --- | --- |
| Tier | `basic` |
| Instance size | `basic-s` |
| CPU | Shared 1 vCPU |
| Memory | 2 GB |
| Instance count | 1 |
| Single-instance only | Yes |
| Monthly app instance cost | $20/month |

## Available App Platform Sizes

Relevant upgrade options from DigitalOcean:

| Slug | CPU | Memory | Tier | Scalable | Monthly / instance |
| --- | ---: | ---: | --- | --- | ---: |
| `apps-s-1vcpu-2gb` | Shared 1 vCPU | 2 GB | professional | Yes | $25 |
| `apps-d-1vcpu-2gb` | Dedicated 1 vCPU | 2 GB | professional | Yes | $39 |
| `apps-s-2vcpu-4gb` | Shared 2 vCPU | 4 GB | professional | Yes | $50 |
| `apps-d-2vcpu-4gb` | Dedicated 2 vCPU | 4 GB | professional | Yes | $78 |
| `apps-d-2vcpu-8gb` | Dedicated 2 vCPU | 8 GB | professional | Yes | $98 |

## Observed Capacity

After correcting runtime heap to 768 MB:

| Crawl Size | Concurrency | Outcome |
| ---: | ---: | --- |
| 100 URLs | 12 | Degraded pass, p95 20s, 1 timeout |
| 500 URLs | 12 | Failed, 299 HTTP 504, 107 timeouts, 173 upstream failures |

The current instance cannot reliably complete 500 URLs at concurrency 12.

## Capacity Estimates

These estimates assume public routes remain roughly as expensive as observed. They should be revisited after route caching and metadata/render optimization.

### 100 concurrent requests

Recommended minimum:

- 2 x `apps-s-2vcpu-4gb`

Better:

- 2 x `apps-d-2vcpu-4gb`

Rationale:

- Current p95 is already near 20s at concurrency 12.
- 100 concurrent requests is approximately 8x the tested concurrency.
- Single shared vCPU is not credible for this load.

### 500 concurrent requests

Recommended minimum:

- CDN/static caching for public pages before attempting this.
- 4+ instances on `apps-d-2vcpu-4gb` or stronger.
- DB pool and route-cache work must precede this target.

Rationale:

- Without caching, this would multiply current render/DB pressure far beyond current failure threshold.
- App Platform instance scaling alone will not solve DB and route render bottlenecks if every request hits dynamic server rendering.

### Google crawl bursts

Near-term practical target:

- 2 x `apps-s-2vcpu-4gb` or 2 x `apps-d-2vcpu-4gb`.
- Keep public sitemap crawl concurrency to 6-12 until route caching is improved.
- Add crawler-safe cache headers/ISR for marketing, blog, lesson preview, and sitemap routes.

Preferred target:

- 2+ dedicated instances.
- Cached sitemaps.
- Cached blog/article metadata.
- Static/fallback content for public lessons/questions.
- Route-family rate-aware audit tooling.

## Why Multiple Instances Matter

The current `basic-s` instance is single-instance only. When it becomes unhealthy, App Platform has no alternate upstream, so public traffic receives:

- `504`
- `x-do-failure-code: UH`
- `x-do-failure-msg: no_healthy_upstream`

Moving to professional scalable instances is required for high availability.

## Non-Capacity Work Still Required

Scaling is necessary but not sufficient.

The following route-cost work remains required:

1. Cache public marketing layout message loading.
2. Cache or precompute blog/article metadata.
3. Avoid dynamic full-corpus sitemap generation during crawler pressure.
4. Segment large sitemaps and ensure sitemap routes respond under 500ms.
5. Reduce or skip staff session/auth checks for anonymous public marketing routes where safe.
6. Add runtime telemetry and alerting for event-loop lag, RSS, heap, and restart events.

## Recommendation

Immediate:

- Do not run another 500+ URL crawl on single `basic-s`.
- Move to at least 2 instances.

Minimum production recovery size:

- 2 x `apps-s-2vcpu-4gb`.

Stronger launch-safe size:

- 2 x `apps-d-2vcpu-4gb`.

## Verdict

Current capacity: insufficient.

Google crawl burst readiness: NO-GO.

Required before certification: scalable professional tier, at least two instances, and route-level caching/performance hardening.
