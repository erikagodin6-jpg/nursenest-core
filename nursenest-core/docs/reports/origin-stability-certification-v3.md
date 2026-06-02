# Origin Stability Certification V3

Generated: 2026-06-01

## GO / NO-GO

**NO-GO**

The origin is not stable enough to resume SEO, Search Console, sitemap, canonical, internal-linking, or indexability work.

## Certification Criteria

| Criterion | Required | Current |
|---|---|---|
| Web instances | 2+ | 1 |
| 100 URL crawl | 0 failures | failed/degraded |
| 500 URL crawl | 0 failures | not run after 100 failed |
| 1000 URL crawl | 0 failures | not run after 100 failed |
| 2000 URL crawl | gated by 1000 pass | not eligible |
| `origin_no_healthy_upstream` | 0 | previously reproduced at larger crawls |
| `/healthz` after crawl | 200 | 504 |
| `/readyz` after crawl | 200 | 504 |
| process exits/restarts | 0 | instance replacement/restart observed |
| p95 under 3s on 2000 crawl | required | not eligible |

## Current Blockers

1. DigitalOcean account/API write operations return HTTP 403.
2. Account status is reported as `locked`.
3. Web component remains `basic-s`, `instance_count=1`.
4. Latest 100 URL crawl caused health endpoint failure.
5. Runtime telemetry/readiness fixes are local but not deployed.

## Recovery Sequence Required

1. Unlock DigitalOcean account/team and restore App Platform write permissions.
2. Scale web component to at least:

```text
apps-s-1vcpu-2gb
instance_count=2
```

3. Deploy latest runtime fixes:
   - heap clamp
   - runtime telemetry every 15 seconds
   - active request telemetry
   - corrected readiness architecture
4. Validate:

```text
100 URLs @ concurrency 12
500 URLs @ concurrency 12
1000 URLs @ concurrency 12
```

5. Only if 1000 passes, run:

```text
2000 URLs @ concurrency 12
```

## SEO Stop Condition

Continue to pause:

- Search Console submissions
- SEO audits
- canonical audits
- internal link audits
- indexability audits
- sitemap recovery work

until this certification can be changed to **GO**.

