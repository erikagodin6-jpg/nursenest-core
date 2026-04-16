# Horizontal scaling (DigitalOcean App Platform + NurseNest Core)

## DigitalOcean App Platform (`/.do/app-nursenest-core-next.yaml`)

| Setting | Value | Notes |
| --- | --- | --- |
| `min_instance_count` | **2** | Never one instance. |
| `max_instance_count` | **3** | Hard cap — do not raise without budget approval. |
| `autoscaling.metrics.cpu.percent` | **60** | **Only** CPU drives scale; no hidden RPS/memory metrics. |
| Health (liveness) | `GET /healthz` | No DB; `failure_threshold: 9` reduces thrash on cold start. |
| Readiness (operators) | `GET /api/health/ready` | DB probe with timeout (`HEALTH_READY_DB_TIMEOUT_MS`). |

Scale-down behavior is platform-default (gradual). Tune `initial_delay_seconds` / `period_seconds` in the UI if probes flap after deploy.

## Stateless requirements (verified in code)

| Topic | Status |
| --- | --- |
| Sessions | **JWT only** — `session.strategy: "jwt"` in `src/lib/auth.ts`; no Prisma adapter / DB sessions. |
| Uploads / marketing | **Spaces (S3)** — `marketing-assets` API streams from DO Spaces; not local disk. |
| Admin diagnostics disk | **Off in production** — `allowDiagnosticsDiskWrite()` is false unless `ALLOW_DIAGNOSTICS_DISK_WRITE=true`. |
| Rate limits (primary) | **Postgres-backed** when `DATABASE_URL` is set (`checkRateLimitUnified`). |

**Caveat:** In-process maps for 429 **streak** / abuse-strike tightening in `rate-limit.ts` are per-instance (Retry-After consistency). Primary counters use shared storage in production.

## Request logging (`http-access-log-hook.ts`)

When `ACCESS_LOG_STRUCTURED` is on (default in production): every non-static request logs `request_complete` with `responseTimeMs`, `statusCode`, `route`, `cpuUsageUserUs`, `cpuUsageSystemUs`, `memoryUsageHeapMb`, `memoryUsageRssMb`. **> 1000ms** → `slow_request`. **5xx** → `request_error_response`. Server errors also flow to `instrumentation.ts` `onRequestError`.

## Rate limiting (`proxy.ts` → `enforceApiRateLimit`)

All `/api/*` routes are gated except webhook/health exemptions. **Anonymous** `/api/questions*` and `/api/lessons*` use a dedicated tighter per-IP bucket (`learner_anon_content`) before generic public limits.

## Prisma

Slow queries **> 500ms** log via `logSlowPrismaQuery`; `findMany` bounds policy in `prisma-find-many-bounds.ts` and API pagination limits.

## Load testing

```bash
cd nursenest-core
BASE_URL=https://your-deployment.ondigitalocean.app npm run loadtest:k6:horizontal
```

Validates latency/failures at 50–100 VUs. **Autoscale 2→3** must be confirmed in DO graphs (CPU > target) or a CPU-heavy scenario — HTTP-only probes may not force a third instance.

---

## Readiness verdict (copy for audits)

**Horizontal Scaling Readiness:** SAFE — *with operational caveats below.*

**Blocking issues:** None for multi-instance JWT sessions, DB-backed primary rate limits, and Spaces-backed assets.

**Fixes applied (this doc’s implementation pass):**

- DO spec documented as CPU-only, min 2 / max 3 enforced in YAML.
- Structured HTTP access logs with required fields + slow + 5xx lines.
- Dedicated anonymous rate limit for `/api/questions` and `/api/lessons`.
- k6 script `tools/loadtest/k6-app-platform-horizontal.js` + npm script `loadtest:k6:horizontal`.

**Remaining risks:**

- 429 streak / strike maps are not cross-instance consistent (secondary to Postgres counters).
- Without `DATABASE_URL`, rate limits fall back to in-memory (not OK for multi-instance — ensure Postgres in production).
- k6 does not by itself prove autoscaling to 3 instances; validate in DO UI under load.
