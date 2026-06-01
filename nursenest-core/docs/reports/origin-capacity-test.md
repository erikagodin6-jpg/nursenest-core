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

| Batch | Concurrency | Result | HTTP 200 | HTTP 504 | Fetch Errors | Upstream Failures | p95 |
| ---: | ---: | --- | ---: | ---: | ---: | ---: | ---: |
| 100 | 12 | PASS but slow | 100 | 0 | 0 | 0 | 12,125ms |
| 500 | 12 | PASS but slow | 500 | 0 | 0 | 0 | 8,675ms |
| 1,000 | 12 | FAIL | 367 | 606 | 27 | 606 | 20,001ms |

## Health Probe State

Before the 1,000 URL batch:

- `/healthz`: 200
- `/readyz`: 200

After the 1,000 URL batch:

- `/healthz`: 504, `x-do-failure-code=UH`
- `/readyz`: 504, `x-do-failure-code=UH`

## Threshold

Observed failure threshold:

- Stable but slow at 500 URLs / concurrency 12.
- Unstable at 1,000 URLs / concurrency 12.

The capacity threshold is therefore between 500 and 1,000 sitemap URLs at concurrency 12 on the current single `basic-s` instance.

## 2,000 URL Test

Not run.

Reason: the 1,000 URL test already caused a production origin outage. Continuing to 2,000 URLs before changing runtime capacity would knowingly extend the incident without adding useful diagnostic value.

## Interpretation

The origin does not have sufficient headroom for large crawler bursts. Because the current tier is single-instance only, one failed instance means App Platform has no healthy upstream.

## Required Fix Before Retest

Minimum:

- Deploy runtime heap clamp.
- Upgrade from `basic-s` to a scalable professional tier.
- Run at least 2 instances.

Preferred:

- 2 x `apps-s-1vcpu-2gb` as a near-term floor.
- Re-evaluate after public blog/metadata route caching reduces render pressure.

## Verdict

Capacity certification: FAIL.

SEO work remains paused.
