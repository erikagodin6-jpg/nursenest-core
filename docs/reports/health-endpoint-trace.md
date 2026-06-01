# Health Endpoint Trace

Generated: 2026-06-01

## `/healthz`

Implementation:

- `nursenest-core/src/app/(runtime)/healthz/route.ts`

Behavior:

- `GET` returns `200 ok`.
- `HEAD` returns `200`.
- Headers: `content-type: text/plain; charset=utf-8`, `cache-control: no-store`.
- Logs only if the probe is slow.

Dependencies:

- No database.
- No cache.
- No sitemap.
- No blog.
- No lessons.
- No translations.
- No auth/session.

Target:

- p95 under 100 ms.

## `/readyz`

Implementation:

- `nursenest-core/src/app/(runtime)/readyz/route.ts`

Behavior:

- `GET` checks database readiness with a 450 ms timeout.
- `HEAD` checks database readiness with a 450 ms timeout.
- Returns `200 ready` if readiness succeeds or DB is intentionally skipped.
- Returns `503 not ready` if required DB readiness fails or times out.
- Logs slow/failing probes with classification and duration.

Dependencies:

- Bounded database readiness only.
- No content queries.
- No sitemap.
- No blog index.
- No lesson index.
- No user/session state.
- No full i18n load.

Target:

- p95 under 500 ms.

## Production Evidence

The stale crawl showed `/healthz` and `/readyz` returning 504 with upstream status 503 while cached blog and sitemap routes returned 200. That means the origin was unhealthy or unavailable to DigitalOcean at probe time.

At-rest live verification after hardening:

| Endpoint | Status | Time |
|---|---:|---:|
| `/healthz` | 200 | 0.099 s |
| `/readyz` | 200 | 0.181 s |

## Remaining Risk

At-rest probes do not certify crawl-load readiness. The fixed build must be deployed and validated with the full sitemap crawl.

