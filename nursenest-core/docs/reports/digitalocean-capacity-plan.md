# DigitalOcean Capacity Plan

Generated: 2026-06-01

## Executive Summary

Production is still under-sized for crawler bursts and high-concurrency public rendering.

The current app is no longer on the older `basic-s` shape recorded in prior incident reports. The live DigitalOcean App Platform service is now configured as `apps-s-1vcpu-1gb`, with autoscaling bounds of `min_instance_count=1` and `max_instance_count=4`. However, the currently running instance list shows only one web instance, and the app spec has no autoscaling metric policy. Practically, the origin is still operating as a single-instance service.

Current capacity should be treated as **NO-GO for Search Console recovery crawls** until the web floor is raised to at least two instances, the database is scaled, and public route caching is improved.

## Current Infrastructure

| Component | Current Size | CPU | RAM | Instance Count | Notes |
| --- | --- | ---: | ---: | ---: | --- |
| App Platform `web` | `apps-s-1vcpu-1gb` | shared 1 vCPU | 1 GB | 1 running | Professional tier size, but only one live instance observed. |
| App autoscaling config | min 1 / max 4 | n/a | n/a | 1-4 configured | Metrics block is empty, so this should not be treated as active CPU/RAM autoscaling. |
| Node runtime heap | `--max-old-space-size=768` | n/a | 768 MB heap cap | per instance | Leaves limited headroom for native memory, Next.js runtime, Prisma, and request bursts. |
| Postgres | `db-s-1vcpu-1gb` | 1 vCPU | 1 GB | 1 node | Single-node managed Postgres; no read replica observed. |

## Capacity Evidence

Recent production crawl artifacts show:

| Test | Concurrency | Result | p50 | p95 | Errors |
| --- | ---: | --- | ---: | ---: | --- |
| 100 URL crawl | 12 | degraded pass | 14.39s | 20.00s | 1 HTTP 504, 1 fetch error |
| 500 URL crawl | 12 | fail in prior recovery test | near timeout ceiling | 20.00s | 299 HTTP 504, 107 fetch errors, 173 upstream failures |

Interpretation:

- The origin is already saturated at concurrency 12 for public crawls.
- The observed public-page service rate is roughly `0.6-0.8 req/s` at p95-limited latency.
- A 7,500+ URL recrawl at this speed takes hours and risks unhealthy-upstream events.
- Because the current running floor is one instance, a saturated or restarting instance can still produce `origin_no_healthy_upstream`.

## Current Maximum Capacity Estimate

These are conservative estimates based on observed production behavior. They assume public routes remain dynamically rendered and database-backed at roughly current cost.

| Workload | Current Safe Estimate | Current Absolute Burst Estimate | Failure Mode |
| --- | ---: | ---: | --- |
| Concurrent active users | 20-40 active learners | 50-75 short bursts | Slow lesson/question actions, DB queueing, event-loop pressure |
| Simultaneous dynamic requests | 6-8 in flight | 12 in flight | p95 approaches 20s, 504 risk |
| Crawl throughput | 20-30 URLs/minute | 35-45 URLs/minute briefly | p95 timeout ceiling, unhealthy upstream |
| Lesson throughput | 25-40 lesson page loads/minute | 50/minute briefly | lesson/index loading and DB contention |
| Blog throughput | 25-45 blog page loads/minute | 60/minute briefly | metadata/body render pressure, sitemap/blog cache misses |

These estimates are not certification limits. They are the current practical guardrails to avoid repeating the 504 incident.

## Target Capacity

For Search Console recovery, the target should be:

| Workload | Target |
| --- | ---: |
| Concurrent active users | 150-300 active learners |
| Simultaneous dynamic requests | 50-100 in flight |
| Crawl throughput | 300-600 URLs/minute without upstream failures |
| Lesson throughput | 200-400 lesson page loads/minute |
| Blog throughput | 300-600 blog page loads/minute, mostly cached |

Those targets require both scaling and route optimization. Scaling alone will not make 7,500 dynamic public URLs cheap if every crawler hit performs full server rendering and repeated DB/content loading.

## Recommendation: Scale Up And Scale Out

### Immediate Stabilization

Move the web service to:

| Component | Recommended Immediate Size |
| --- | --- |
| App Platform `web` | `apps-s-2vcpu-4gb` |
| Min instances | 2 |
| Max instances | 4 |
| Node heap | `--max-old-space-size=2048` |
| Postgres | Upgrade to at least 2 vCPU / 4 GB managed Postgres |

Why:

- Two web instances removes the single healthy-upstream failure mode.
- 2 vCPU / 4 GB gives Next.js enough CPU and memory headroom for route rendering.
- A larger DB prevents the app tier from simply moving saturation into Postgres.

### Launch-Safe Configuration

For crawl recovery and paid launch traffic:

| Component | Launch-Safe Size |
| --- | --- |
| App Platform `web` | `apps-d-2vcpu-4gb` |
| Min instances | 2 |
| Max instances | 6 |
| Postgres | 2 vCPU / 4 GB minimum; 4 vCPU / 8 GB preferred if slow queries remain |
| Cache | Redis/edge cache for public route payloads and sitemap/blog metadata |

Dedicated CPU is preferred for production because the current bottleneck is latency under burst, not just average CPU usage.

## Autoscaling Configuration

Recommended App Platform policy:

```yaml
services:
  - name: web
    instance_size_slug: apps-d-2vcpu-4gb
    autoscaling:
      min_instance_count: 2
      max_instance_count: 6
      metrics:
        cpu:
          percent: 60
```

Operational notes:

- Keep `min_instance_count=2`; autoscaling should add capacity, not provide baseline HA.
- Set CPU target around 60% because Next.js latency degrades before CPU is fully pegged.
- If DigitalOcean supports only a simpler metrics schema in the current App Platform API, use the equivalent CPU utilization policy.
- Add alerts for readiness failures, restart count, CPU > 70%, memory > 75%, p95 > 2s, and 5xx > 0.5%.

## Throughput After Recommended Scaling

Assuming no major route optimization:

| Configuration | Crawl Throughput | Lesson Throughput | Blog Throughput | Concurrent Active Users |
| --- | ---: | ---: | ---: | ---: |
| Current: 1 x `apps-s-1vcpu-1gb` | 20-30 URLs/min | 25-40/min | 25-45/min | 20-40 |
| Immediate: 2 x `apps-s-2vcpu-4gb` | 100-180 URLs/min | 120-200/min | 150-250/min | 100-180 |
| Launch-safe: 2 x `apps-d-2vcpu-4gb` | 150-250 URLs/min | 180-300/min | 250-400/min | 150-250 |
| Launch-safe + caching | 300-600 URLs/min | 250-500/min | 500-1,000/min | 300+ |

## Required Route Optimizations

Before running a 2,000+ URL certification crawl:

1. Cache sitemap generation and avoid full-corpus computation per request.
2. Cache blog list/detail metadata and related-content queries.
3. Cache public lesson indexes and lesson hub inventory.
4. Move article/lesson public pages toward ISR/static rendering where content is stable.
5. Reduce anonymous public route DB/session work.
6. Add per-route latency logging for lesson, blog, sitemap, question, and localized routes.
7. Add DB pool telemetry and slow-query capture during crawls.

## Crawl Guardrails

Until the immediate scale-up is deployed:

| Crawl Size | Recommended Concurrency |
| ---: | ---: |
| 100 URLs | 4-6 |
| 500 URLs | Do not run on current single instance |
| 1,000 URLs | Do not run on current single instance |
| 2,000 URLs | Do not run on current single instance |

After scaling to at least 2 x `apps-s-2vcpu-4gb`:

| Crawl Size | Starting Concurrency | Max Test Concurrency |
| ---: | ---: | ---: |
| 100 URLs | 8 | 12 |
| 500 URLs | 8 | 16 |
| 1,000 URLs | 12 | 24 |
| 2,000 URLs | 12 | 24 |

Do not increase concurrency unless p95 stays under 2s, p99 stays under 5s, 5xx remains zero, and readiness stays healthy.

## GO / NO-GO

Current infrastructure: **NO-GO** for Search Console recovery crawl.

Minimum GO condition:

- `web` running at least 2 healthy instances.
- Web size at least `apps-s-2vcpu-4gb`.
- Postgres larger than current `db-s-1vcpu-1gb`.
- 500 URL crawl passes with 0 upstream failures.
- p95 under 2 seconds and p99 under 5 seconds.

Recommended GO condition:

- 2 x `apps-d-2vcpu-4gb`, autoscaling to 6.
- Cached sitemap/blog/lesson public routes.
- 2,000 URL crawl passes with 0 504s, 0 readiness failures, and 0 restarts.

