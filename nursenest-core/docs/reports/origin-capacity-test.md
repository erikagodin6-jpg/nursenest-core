# Origin Capacity Test

Generated: 2026-06-01

## Scope

Production origin: `https://nursenest.ca`

Method:

- Discovered URLs from live `sitemap.xml` child sitemaps.
- Audited public URLs with concurrency 12.
- Per-request timeout: 20s.
- Captured status, response time, DigitalOcean upstream headers, and health before/after each batch.

Artifacts:

- `reports/origin-capacity-test/discovered-urls.json`
- `reports/origin-capacity-test/batch-100.json`
- `reports/origin-capacity-test/batch-100.csv`
- `reports/origin-capacity-test/batch-500.json`
- `reports/origin-capacity-test/batch-500.csv`
- `reports/origin-capacity-test/batch-1000.json`
- `reports/origin-capacity-test/batch-1000.csv`

## Results

### Initial Run Before Heap Config Correction

| Batch | Concurrency | Result | HTTP 200 | HTTP 504 | Fetch Errors | Upstream Failures | p95 |
| ---: | ---: | --- | ---: | ---: | ---: | ---: | ---: |
| 100 | 12 | PASS but slow | 100 | 0 | 0 | 0 | 12,125ms |
| 500 | 12 | PASS but slow | 500 | 0 | 0 | 0 | 8,675ms |
| 1,000 | 12 | FAIL | 367 | 606 | 27 | 606 | 20,001ms |

### Recovery Run After Heap Config Correction

Production `NODE_OPTIONS` was changed from `--max-old-space-size=4096` to `--max-old-space-size=768`, then the crawl was rerun.

| Batch | Concurrency | Result | HTTP 200 | HTTP 504 | Fetch Errors | Upstream Failures | p95 |
| ---: | ---: | --- | ---: | ---: | ---: | ---: | ---: |
| 100 | 12 | DEGRADED PASS | 99 | 0 | 1 | 0 | 20,003ms |
| 500 | 12 | FAIL | 94 | 299 | 107 | 173 | 20,002ms |
| 1,000 | 12 | NOT RUN | - | - | - | - | - |

## Health Probe State

Before the initial 1,000 URL batch:

- `/healthz`: 200
- `/readyz`: 200

After the initial 1,000 URL batch:

- `/healthz`: 504, `x-do-failure-code=UH`
- `/readyz`: 504, `x-do-failure-code=UH`

Before the recovery 500 URL batch:

- `/healthz`: 200
- `/readyz`: 200

After the recovery 500 URL batch:

- `/healthz`: 504, `x-do-failure-code=UH`
- `/readyz`: 504, `x-do-failure-code=UH`

## Threshold

Observed initial failure threshold:

- Stable but slow at 500 URLs / concurrency 12.
- Unstable at 1,000 URLs / concurrency 12.

Observed recovery failure threshold after heap correction:

- Degraded but no upstream failure at 100 URLs / concurrency 12.
- Unstable at 500 URLs / concurrency 12.

The current capacity threshold is therefore below 500 sitemap URLs at concurrency 12 on the current single `basic-s` instance.

## 2,000 URL Test

Not rerun after heap correction.

Reason: the 500 URL recovery test already caused a production origin outage. Continuing to 1,000 or 2,000 URLs before changing runtime capacity would knowingly extend the incident without adding useful diagnostic value.

## Interpretation

The origin does not have sufficient headroom for moderate crawler bursts. Because the current tier is single-instance only, one failed instance means App Platform has no healthy upstream.

## Required Fix Before Retest

Minimum:

- Upgrade from `basic-s` to a scalable professional tier.
- Run at least 2 instances.
- Deploy runtime telemetry and route-level caching/performance fixes.

Preferred:

- 2 x `apps-s-1vcpu-2gb` as a near-term floor.
- Re-evaluate after public blog/metadata route caching reduces render pressure.

## Verdict

Capacity certification: FAIL.

SEO work remains paused.
