# Origin Stability Certification

Generated: 2026-06-01

## Certification Result

NO-GO.

Production recovered after manual web component restarts, but the origin is not certified for large crawler traffic.

## Required Pass Criteria

| Requirement | Required | Observed |
| --- | --- | --- |
| 1,000 URL crawl | Complete | Not rerun after 500 URL failure |
| Upstream failures | 0 | 173 at 500 URLs after heap correction; 606 at prior 1,000 URLs |
| Unhealthy instances | 0 | Instance became unhealthy |
| Container restarts/replacements | 0 | Web component restarted/replaced |
| Readiness failures | 0 | `/readyz` returned 504 after load |

## Evidence Summary

Initial capacity testing showed:

| Batch | Concurrency | HTTP 200 | HTTP 504 | Fetch Errors | Upstream Failures | Result |
| ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 100 | 12 | 100 | 0 | 0 | 0 | Pass but slow |
| 500 | 12 | 500 | 0 | 0 | 0 | Pass but slow |
| 1,000 | 12 | 367 | 606 | 27 | 606 | Fail |

After deploying the runtime heap config correction, recovery testing showed:

| Batch | Concurrency | HTTP 200 | HTTP 504 | Fetch Errors | Upstream Failures | Result |
| ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 100 | 12 | 99 | 0 | 1 | 0 | Degraded pass |
| 500 | 12 | 94 | 299 | 107 | 173 | Fail |
| 1,000 | 12 | - | - | - | - | Not run; blocked by 500 failure |

Before the failed 500 URL recovery crawl:

- `/healthz`: 200
- `/readyz`: 200

After the failed 500 URL recovery crawl:

- `/healthz`: 504, `x-do-failure-code=UH`, `x-do-failure-msg=no_healthy_upstream`
- `/readyz`: 504, `x-do-failure-code=UH`, `x-do-failure-msg=no_healthy_upstream`

## Recovery Action Taken

The web component was manually restarted twice.

Recovery deployments:

- `39ab7d09-782c-4de0-ad88-3a84c69b45c6`
- `510fb5a6-8e09-4a47-ab19-7a89fe28af8c`

Post-restart checks:

- `/healthz`: 200
- `/readyz`: 200
- `/`: 200 after the first restart; health restored after the second restart

This restored availability at rest. It does not prove crawl stability.

## Fixes Applied / Prepared

Production config changed:

- Live `NODE_OPTIONS` changed to `--max-old-space-size=768`.

Files changed locally:

- `scripts/start-production.mjs`
- `scripts/start-standalone-runtime.cjs`

Fixes:

- Clamp runtime `--max-old-space-size` to `NODE_MAX_OLD_SPACE_SIZE_MB` when present.
- Add runtime process telemetry for RSS, heap, CPU usage, event-loop lag, and exit/signal snapshots.

Verification:

```bash
node --check scripts/start-production.mjs
```

Result: PASS.

## Why SEO Remains Paused

The latest crawl failure was an infrastructure availability failure, not a canonical/noindex/sitemap-content truth failure.

Any SEO audit run while the origin is returning `504 no_healthy_upstream` will misclassify large numbers of valid URLs as broken. Historical 504-derived SEO findings should be treated as invalid until origin stability is certified.

## Required Before GO

1. Deploy the heap clamp.
2. Move off single-instance `basic-s` hosting.
3. Run at least two web instances on a scalable tier.
4. Re-run capacity tests in order:
   - 100 URLs
   - 500 URLs
   - 1,000 URLs
   - 2,000 URLs
5. Confirm each run has:
   - 0 `no_healthy_upstream`
   - 0 container restarts
   - 0 readiness failures
   - 0 health failures
6. Only after the 2,000 URL crawl passes, resume sitemap, indexability, canonical, and internal-link audits.

## Certification Decision

Origin stability: FAIL.

SEO recovery: PAUSED.

Operational recommendation: increase origin capacity before any further 500+ URL crawl. The heap correction alone did not resolve the failure.
