# Origin Stability Certification

Generated: 2026-06-01

## Certification Result

NO-GO.

Production recovered after a manual web component restart, but the origin is not certified for large crawler traffic.

## Required Pass Criteria

| Requirement | Required | Observed |
| --- | --- | --- |
| 2,000 URL crawl | Complete | Not run |
| Upstream failures | 0 | 606 at 1,000 URLs |
| Unhealthy instances | 0 | Instance became unhealthy |
| Container restarts/replacements | 0 | Web component restarted/replaced |
| Readiness failures | 0 | `/readyz` returned 504 after load |

## Evidence Summary

Capacity testing showed:

| Batch | Concurrency | HTTP 200 | HTTP 504 | Fetch Errors | Upstream Failures | Result |
| ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 100 | 12 | 100 | 0 | 0 | 0 | Pass but slow |
| 500 | 12 | 500 | 0 | 0 | 0 | Pass but slow |
| 1,000 | 12 | 367 | 606 | 27 | 606 | Fail |

Before the 1,000 URL crawl:

- `/healthz`: 200
- `/readyz`: 200

After the 1,000 URL crawl:

- `/healthz`: 504, `x-do-failure-code=UH`, `x-do-failure-msg=no_healthy_upstream`
- `/readyz`: 504, `x-do-failure-code=UH`, `x-do-failure-msg=no_healthy_upstream`

## Recovery Action Taken

The web component was manually restarted.

Recovery deployment:

- `39ab7d09-782c-4de0-ad88-3a84c69b45c6`

Post-restart checks:

- `/healthz`: 200
- `/readyz`: 200
- `/`: 200

This restored availability at rest. It does not prove crawl stability.

## Code Fix Prepared

File changed:

- `scripts/start-production.mjs`

Fix:

- Clamp runtime `--max-old-space-size` to `NODE_MAX_OLD_SPACE_SIZE_MB` when present.
- The production environment already declares `NODE_MAX_OLD_SPACE_SIZE_MB=768`, so the next deployment should prevent the old-space heap target from exceeding the current container memory budget.

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

Operational recommendation: deploy the runtime fix and increase origin capacity before any further large crawl.
