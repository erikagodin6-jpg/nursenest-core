# Route Family 504 Analysis

Generated: 2026-06-01

Source: `nursenest-core/reports/production-seo-current/results.json`

## Summary

Total audited sitemap URLs: 7,918.

The median 504 response times were mostly around 100-250 ms, which indicates an upstream/origin availability failure rather than route-local 30 second render timeouts.

| Route Family | URLs | 5xx/Failures | Failure % | Median ms | Status Breakdown |
|---|---:|---:|---:|---:|---|
| blog | 5,801 | 4,725 | 81.5% | 126 | 1,076x200, 4,725x504 |
| lessons | 1,469 | 1,469 | 100.0% | 132 | 1,469x504 |
| NP | 192 | 190 | 99.0% | 123 | 2x200, 190x504 |
| other | 167 | 155 | 92.8% | 125 | 12x200, 155x504 |
| RPN | 79 | 79 | 100.0% | 125 | 79x504 |
| RN | 73 | 73 | 100.0% | 114 | 73x504 |
| allied | 62 | 62 | 100.0% | 253 | 62x504 |
| localized | 45 | 45 | 100.0% | 111 | 45x504 |
| questions | 29 | 29 | 100.0% | 122 | 29x504 |
| homepage | 1 | 1 | 100.0% | 66 | 1x504 |

## Interpretation

Because `/healthz` and `/readyz` also returned 504 in the same audit window, the route-family failures should be treated as correlated origin unavailability.

The successful cached `/blog` and sitemap probes do not prove the dynamic route families were healthy. They prove cached Cloudflare/Next responses could still be served while origin MISS traffic failed.

## Root Cause By Family

| Family | Root Cause |
|---|---|
| homepage | origin unavailable for cache MISS plus previously heavy marketing layout work |
| lessons | origin unavailable; route-specific lesson cost not proven by this audit |
| questions | origin unavailable; route-specific question cost not proven by this audit |
| NP/RN/RPN/allied/localized | origin unavailable across public marketing route families |
| blog | mixed cache hits and origin failures; cached hub pages stayed healthy |

## Remediation Priority

1. Deploy runtime safe-mode/hardening.
2. Validate `/`, `/healthz`, `/readyz`.
3. Rerun full crawl.
4. Only then investigate route-local render costs for any family that still fails.

