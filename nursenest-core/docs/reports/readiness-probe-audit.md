# Readiness Probe Audit

Generated: 2026-06-01

## Executive Finding

`/readyz` is not the source of the crawl-time outage.

The route is intentionally lightweight and does not load lesson indexes, sitemap data, translations, Prisma queries, or content catalogs. At rest it returns quickly. During the 1,000 URL crawl, `/readyz` failed only after DigitalOcean had no healthy upstream left to route to.

## Route Implementation

File:

- `src/app/(runtime)/readyz/route.ts`

Behavior:

- `runtime = "nodejs"`
- `dynamic = "force-dynamic"`
- `GET` returns plain text `ready`
- `HEAD` returns status 200
- `cache-control: no-store`

No database, sitemap, translation, or content loaders are invoked by this route.

## Production Bootstrap Behavior

The production standalone startup uses a watchdog/bootstrap layer:

- Parent process starts before the Next standalone child is fully serving.
- Parent returns readiness only after the child responds to an internal bootstrap probe.
- Before readiness, public `/readyz` returns 503 from the bootstrap layer.
- After readiness, traffic is proxied to the child process.

Runtime logs during the investigation included lightweight readiness intercepts such as:

- `startup_watchdog bootstrap_healthz_intercepted`
- `url="/readyz"`
- `status=200`

These intercepts are intentionally cheap. They do not explain the 504s.

## Health Evidence

Before crawl load:

| Endpoint | Status | Notes |
| --- | ---: | --- |
| `/healthz` | 200 | Healthy at rest |
| `/readyz` | 200 | Healthy at rest |

After the 1,000 URL crawl:

| Endpoint | Status | DigitalOcean Failure |
| --- | ---: | --- |
| `/healthz` | 504 | `UH no_healthy_upstream` |
| `/readyz` | 504 | `UH no_healthy_upstream` |

This means the platform could not route to a healthy web instance. It does not indicate that the readiness handler itself became slow or expensive.

## Probe Cost Audit

| Check | Result |
| --- | --- |
| Loads lesson indexes | No |
| Loads sitemap data | No |
| Loads translations | No |
| Runs Prisma queries | No |
| Performs network calls | No |
| Performs full app render | No |
| Depends on blog/article catalogs | No |
| Depends on user session/auth | No |

## Readiness Gap

The current probe is good for cheap availability checks, but it does not certify crawl-load survivability.

It answers:

- "Is there a process currently reachable?"

It does not answer:

- "Can this single origin survive sustained crawler concurrency?"
- "Is the event loop saturated?"
- "Are public page renders timing out?"
- "Is the instance close to memory pressure?"

## Recommendation

Keep App Platform `/readyz` cheap. Do not add Prisma, sitemap, or translation checks to the platform readiness probe.

Add separate diagnostics for operators:

1. A protected deep health endpoint or script that checks database connectivity, sitemap generation, and representative public route rendering.
2. Event-loop delay logging during crawl pressure.
3. Memory/RSS telemetry in runtime logs.
4. Synthetic route-family crawls for blog, lessons, localized routes, and pathway pages.

## Verdict

Readiness route design: PASS.

Origin readiness under crawl load: FAIL, because the only web instance becomes unavailable.

The readiness probe should remain lightweight, but origin stability requires capacity and runtime fixes.
