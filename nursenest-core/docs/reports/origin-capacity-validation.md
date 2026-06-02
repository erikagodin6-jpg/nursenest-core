# Origin Capacity Validation

Generated: 2026-06-01

## Verdict

**NO-GO / BLOCKED**

Capacity validation cannot proceed because production remains a single `basic-s` web instance and DigitalOcean write operations required for scaling return HTTP 403.

## Required Test Matrix

| Test | Required Result | Status |
|---|---|---|
| 100 URLs @ concurrency 12 | 0 failures | FAIL on current single instance |
| 500 URLs @ concurrency 12 | 0 failures | NOT RUN after 100 degraded |
| 1000 URLs @ concurrency 12 | 0 failures | NOT RUN after 100 degraded |

## Latest 100 URL Test

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
| `/healthz` after | timeout, then 504 |
| `/readyz` after | timeout, then 504 |

## Why 500/1000 Were Not Run

The required prerequisite is:

```text
minimum 2 web instances
```

That prerequisite is not met.

Running 500/1000 URL crawls on the current single-instance origin would knowingly reproduce a larger production outage and would not validate the intended recovery architecture.

## Capacity Certification Status

| Criterion | Status |
|---|---|
| 2+ web instances | FAIL |
| heap clamp deployed | PARTIAL PASS |
| telemetry deployed | BLOCKED |
| readiness architecture fixed in production | BLOCKED |
| 100 URL crawl clean | FAIL |
| 500 URL crawl clean | NOT RUN |
| 1000 URL crawl clean | NOT RUN |
| health endpoints remain 200 | FAIL |
| no process exits/restarts | FAIL / auto replacement observed |

## Required Next Action

Resolve DigitalOcean 403 and scale the web service before rerunning this validation.

