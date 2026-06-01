# Origin Stability Certification V2

Generated: 2026-06-01

## Verdict

**NO-GO**

Production is healthy at rest after the manual rebuild deployment, but the origin has not been made highly available. The web component remains a single `basic-s` instance, and the attempted scale change to two web instances was rejected by the DigitalOcean API with HTTP 403. Because the origin is still single-instance and prior 500/1000 URL crawls already caused `origin_no_healthy_upstream`, additional large capacity crawls were not run.

SEO audits and Search Console recovery should remain paused.

## Phase 1: Deployment

Status: **PASS**

Deployment:

- App: `nursenest-core-next`
- App ID: `d6a4b825-4d70-4dd4-8d71-04b354d36f43`
- Deployment ID: `2a9127f6-689b-441a-8cc1-855fdea70b92`
- Cause: manual
- Phase: `ACTIVE`
- Created: `2026-06-01 04:34:41 UTC`
- Updated: `2026-06-01 04:39:15 UTC`

Build verification:

- `npm run build:production`: passed locally before deployment
- Production start path: `node scripts/start-production.mjs`
- Heap clamp: present in committed production start script
- Build commit containing heap clamp: `992662344c98198c87309a0d72be3af43b043c6f`

Post-deploy health checks:

| Endpoint | Status | Response Time |
|---|---:|---:|
| `/healthz` | 200 | 0.506931s |
| `/readyz` | 200 | 0.606337s |

## Phase 2: Availability Increase

Status: **BLOCKED**

Current production web configuration:

| Component | Instance Size | Instance Count | Scaling |
|---|---|---:|---|
| `web` | `basic-s` | 1 | single instance |

Attempted target configuration:

| Component | Instance Size | Instance Count | Scaling |
|---|---|---:|---|
| `web` | `apps-s-1vcpu-2gb` | 2 | fixed two instances |

DigitalOcean rejected the App Platform spec update:

```text
PUT /v2/apps/d6a4b825-4d70-4dd4-8d71-04b354d36f43
HTTP 403 forbidden
```

The retry outside the sandbox boundary returned the same HTTP 403. This is an external platform authorization, billing, or plan-permission blocker, not a local build failure.

Autoscaling was not enabled because the minimum required fixed two-instance configuration could not be applied.

## Phase 3: Post-Deploy Capacity Tests

Status: **NOT RUN**

Required tests:

- 500 URLs @ concurrency 12
- 1000 URLs @ concurrency 12

Reason not run:

The scaling step failed and production remains on the same single-instance class that previously failed under 500/1000 URL crawl pressure. Running the same large crawl again without increased availability would risk another public origin outage and would not validate the requested recovery state.

Most recent known capacity evidence before this deployment:

| Test | Result | Notes |
|---|---|---|
| 100 URLs @ concurrency 12 | degraded pass | 99 HTTP 200, 1 fetch error, p95 about 20s |
| 500 URLs @ concurrency 12 | fail | 299 HTTP 504, 107 fetch errors, 173 upstream failures |
| 1000 URLs @ concurrency 12 | fail | prior run produced hundreds of HTTP 504 responses |

## Phase 4: 2000 URL Gate

Status: **NOT RUN**

The 2000 URL crawl is gated behind a successful 1000 URL crawl. Since Phase 2 was blocked and Phase 3 was not safely executable, the 2000 URL test was not attempted.

## Required Pass Criteria

| Criterion | Status |
|---|---|
| Production deployment succeeds | PASS |
| `/healthz` remains 200 at rest | PASS |
| `/readyz` remains 200 at rest | PASS |
| Minimum 2 web instances | FAIL |
| Autoscaling enabled if supported | NOT VERIFIED |
| 500 URL crawl has 0 upstream failures | NOT RUN |
| 1000 URL crawl has 0 upstream failures | NOT RUN |
| 2000 URL crawl has 0 upstream failures | NOT RUN |
| 0 process exits during crawl | NOT VERIFIED |

## Root Cause Status

Root cause remains:

```text
single-instance origin capacity exhaustion
```

The heap clamp reduces the risk of Node/V8 memory overcommit on a 2 GB container, but it does not make a single instance capable of absorbing crawl bursts. Origin recovery requires at least two web instances, and likely a professional scalable App Platform tier.

## Next Required Action

Resolve the DigitalOcean 403 preventing App Platform spec updates to a scalable multi-instance tier.

Minimum recommended recovery target:

```text
web instance_size_slug: apps-s-1vcpu-2gb
web instance_count: 2
```

Preferred launch-safe target:

```text
web instance_size_slug: apps-s-2vcpu-4gb
web instance_count: 2
```

After the platform accepts the scale change:

1. Confirm two healthy web instances.
2. Run 500 URL crawl @ concurrency 12.
3. Run 1000 URL crawl @ concurrency 12.
4. Run 2000 URL crawl only if 1000 passes.
5. Resume SEO and Search Console recovery only after this report can be revised to GO.

