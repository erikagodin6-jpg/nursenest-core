# Resource Exhaustion Analysis

Generated: 2026-06-01

## Executive Finding

The resource exhaustion point is below 500 public sitemap URLs at concurrency 12 on the current single-instance origin.

After the runtime heap limit was corrected to 768 MB, a 100 URL crawl survived but was slow. A 500 URL crawl failed and left public health endpoints returning `504 no_healthy_upstream`.

## Current Production Runtime

| Resource | Current |
| --- | --- |
| App Platform tier | `basic` |
| Instance size | `basic-s` |
| CPU | Shared 1 vCPU |
| Memory | 2 GB |
| Instance count | 1 |
| Runtime heap flag after config fix | `--max-old-space-size=768` |
| Prisma connection limit in logs | `connection_limit=5` |
| Health path | `/readyz` |

## Recovery Test Results

After deploying the heap config correction:

| Batch | Concurrency | Result | HTTP 200 | HTTP 504 | Fetch Errors | Upstream Failures | p50 | p95 | Health After |
| ---: | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 100 | 12 | Degraded pass | 99 | 0 | 1 | 0 | 10,693ms | 20,003ms | 200 |
| 500 | 12 | Fail | 94 | 299 | 107 | 173 | 158ms | 20,002ms | 504 |
| 1,000 | 12 | Not rerun | - | - | - | - | - | - | Blocked by 500 failure |

Artifacts:

- `reports/origin-capacity-test/batch-100.json`
- `reports/origin-capacity-test/batch-100.csv`
- `reports/origin-capacity-test/batch-500.json`
- `reports/origin-capacity-test/batch-500.csv`

## Exhaustion Signal

The clearest exhaustion signal is App Platform upstream health:

- Before 500 URL batch: `/healthz` 200, `/readyz` 200.
- After 500 URL batch: `/healthz` 504, `/readyz` 504.
- 173 responses carried DigitalOcean `UH no_healthy_upstream`.

This means the router had no healthy web instance available.

## CPU / Memory / RSS / Heap

Direct App Platform CPU and RSS graphs were not available through the installed `doctl` CLI.

Available evidence:

- Runtime heap flag was corrected from 4096 MB to 768 MB.
- Failure still reproduced after that correction.
- Current image does not include the new local runtime telemetry hook yet.
- Existing request logs include slow request memory fields in app code, but the retained post-failure log window did not expose a complete pressure timeline for the failed 500 URL run.

Local code prepared for the next image:

- `scripts/start-standalone-runtime.cjs` now logs `runtime_resource` snapshots with:
  - RSS MB
  - heap used MB
  - heap total MB
  - external/array buffer MB
  - CPU user/system ms
  - event-loop lag mean/p95/max
  - signal/before-exit/exit snapshots

## DB Pool

The production startup log confirms:

- `connection_limit=5`
- `pool_timeout=15`
- `connect_timeout=10`
- `statement_timeout=120000`

Under crawl load, previous logs showed:

- Prisma slow query events.
- `pathway_lessons db_timeout` fallback events.
- Blog/article render and metadata generation taking multiple seconds.

Exact pool occupancy was not available during the failed run.

## Event Loop Lag

Exact event-loop lag was not captured on the current image.

The next image containing the telemetry hook will report event-loop lag continuously. This is required to distinguish CPU/event-loop saturation from memory pressure.

## Current Resource Exhaustion Point

Confirmed:

- 100 URLs at concurrency 12: no upstream failure, but p95 reached 20s.
- 500 URLs at concurrency 12: origin failure.

Therefore, the current safe threshold is below 500 public URLs at concurrency 12.

## Interpretation

The heap correction reduced one obvious memory risk, but the origin still cannot sustain moderate crawler bursts.

The remaining bottleneck is likely a combination of:

- single shared CPU,
- route rendering work,
- marketing i18n/message loading,
- slow blog/article metadata generation,
- DB query pressure,
- no second instance to absorb or replace a saturated instance.

## Required Next Measurements

After deploying the telemetry-enabled image:

1. Run 100 URLs at concurrency 12.
2. Capture `runtime_resource` samples.
3. Run 250 URLs at concurrency 12.
4. Capture `runtime_resource` samples.
5. Stop if health degrades.
6. Do not rerun 500 or 1,000 on a single `basic-s` instance unless capacity has changed.

## Verdict

Resource exhaustion: CONFIRMED.

Exact CPU/RSS/heap inflection point: not yet measurable on the current image.

The platform should be scaled before another 500+ URL crawl.
