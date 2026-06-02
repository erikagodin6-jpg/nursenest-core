# Load vs Readiness Analysis

Generated: 2026-06-01

## Verdict

**NO-GO**

A 100 URL crawl at concurrency 12 was enough to degrade the single-instance production origin. The crawl did not produce `origin_no_healthy_upstream` during the sampled URL requests, but both health probes timed out immediately after the crawl and later returned HTTP 504 from the DigitalOcean edge.

The 500 and 1000 URL crawls were not run because production is still single-instance and a 100 URL crawl already reproduced readiness failure.

## Test Run

Command:

```text
ORIGIN_CAPACITY_SIZES=100 ORIGIN_CAPACITY_CONCURRENCY=12 ORIGIN_CAPACITY_TIMEOUT_MS=20000 npx tsx scripts/origin-capacity-test.mts
```

Result:

| Metric | Value |
|---|---:|
| URLs audited | 100 |
| Concurrency | 12 |
| HTTP 200 | 87 |
| Fetch errors | 13 |
| Upstream failures during URL audit | 0 |
| p50 | 20001ms |
| p95 | 20003ms |
| max | 20010ms |
| `/healthz` before | 200 |
| `/readyz` before | 200 |
| `/healthz` after | timeout |
| `/readyz` after | timeout |

Manual health checks after the crawl:

| Endpoint | Status | Response Time |
|---|---:|---:|
| `/healthz` | 504 | 117.033462s |
| `/readyz` | 504 | 117.071916s |
| `/healthz` later | 504 | 0.085383s |
| `/readyz` later | 504 | 0.119442s |

## Production Logs During Load

Evidence from live production:

```text
blog db_timeout {"label":"blog_post.by_slug","timeout_ms":12000}
blog fallback_used {"label":"blog_post.by_slug","reason":"db_timeout","timeout_ms":12000}
staff_session.auth timeout
perf memory_sample {"rssMb":955,"heapMb":711,"rssVsLimitPct":47,"limitMb":2048}
perf high_memory {"heapUsedMb":711,"rssMb":955}
pathway_lessons hub_list_db_unavailable_fail_closed {"db_failure_category":"db_timeout"}
practice_questions_hub db_timeout {"timeout_ms":1200}
startup_watchdog bootstrap_healthz_intercepted {"pathname":"/readyz","handlersReady":false,"msSinceBoot":1820575}
```

Interpretation:

- The app saturates under crawl load before reaching 500 URLs.
- Database-bound routes time out under concurrent crawls.
- Staff-session auth checks time out under load.
- Heap reached about 711 MB and RSS about 955 MB during the 100 URL crawl.
- The old child preload still logs `handlersReady=false` for `/readyz`, confirming the production image does not yet include the local watchdog fix.

## Restart / Recovery

DigitalOcean appears to have replaced or restarted the instance automatically after the 100 URL crawl. Logs show a fresh startup sequence at:

```text
2026-06-01T07:15:46Z
```

Manual recovery attempts were blocked:

```text
doctl apps restart ... -> HTTP 403 forbidden
doctl apps create-deployment ... -> HTTP 403 forbidden
```

Later spot checks recovered to HTTP 200 without a successful manual restart, which indicates DigitalOcean eventually restored or replaced the unhealthy instance. The incident is still valid: the 100 URL crawl caused readiness failure and a 504 recovery window.

Final spot checks:

| Endpoint | Status | Response Time |
|---|---:|---:|
| `/healthz` | 200 | 1.403554s |
| `/readyz` | 200 | 0.904887s |

## Correlation

The sequence is:

```text
100 URL crawl @ concurrency 12
  -> blog and route DB timeouts
  -> staff session auth timeouts
  -> high memory warning
  -> healthAfter probe timeouts
  -> public health endpoints return 504
  -> DigitalOcean restarts/replaces instance
  -> edge still reports no healthy upstream during recovery window
```

This explains why `origin_no_healthy_upstream` appears during larger crawls: the single web instance becomes overloaded enough that App Platform marks it unhealthy or cannot route to it. With only one instance, there is no healthy peer to absorb traffic.

## Why 500/1000 Were Not Run

The requested 500 and 1000 URL tests are unsafe on the current production shape:

```text
web instance_size_slug: basic-s
web instance_count: 1
```

The platform scaling attempt to two instances was previously blocked by DigitalOcean HTTP 403. Since 100 URLs already caused readiness failure, running 500 or 1000 would likely extend the outage and would not prove recovery.

## Required Next Step

Deploy the local watchdog correction and resolve the DigitalOcean permission blocker so the web component can run with at least two instances before rerunning:

```text
500 URLs @ concurrency 12
1000 URLs @ concurrency 12
2000 URLs @ concurrency 12 only if 1000 passes
```
