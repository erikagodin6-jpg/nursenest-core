# Production monitoring and alerts

This app emits **Sentry Metrics** (when `SENTRY_ENABLED=true`), **structured JSON** lines (`nn.observability.v1`, when `NN_STRUCTURED_OBSERVABILITY=1` or production defaults in `observability-record.ts`), and **stderr** logs via `safeServerLog`.

## 1) Monitoring added (signals)

| Area | What to use | Implementation |
| --- | --- | --- |
| **5xx & slow HTTP** | Sentry: `api.route.count` (attribute `status_bucket`: `5xx` / `4xx` / `2xx`), `api.route.slow`, `api.route.duration_ms`; structured: `scope=api`, `event=request_completed` | Routes that call `recordApiRouteTelemetry` / `runWithApiTelemetry` (`api-route-telemetry.ts`). |
| **Slow responses** | Same as above; Node hook logs `http.slow_request` for `/api/*` when **> 1000 ms** (`http-access-log-hook.ts`). Threshold for route telemetry: `NN_SLOW_API_ROUTE_MS` (default 8000). | |
| **DB errors** | Sentry: `db.client.error` (`bucket`: `connection`, `timeout`, `unique`, …); structured: `scope=db`, `event=prisma_client_error` | Prisma extension in `src/lib/db.ts`. |
| **DB slow queries** | Sentry: `db.query.slow` (`severity`: `warn` \| `critical`), `db.query.duration_ms`; structured: `scope=db`, `event=slow_query` | `logSlowPrismaQuery` / `production-signal-metrics.ts` (warn > 500 ms, critical > 1000 ms). |
| **Auth (credential) failures** | Sentry: `auth.login.failure` (`bucket`: `bad_password`, `not_found`, `locked_out`, …); structured: `scope=auth`, `event=credentials_login_failure` | `recordCredentialsLoginFailure` in `src/lib/auth.ts`. |
| **Checkout failures** | Sentry: `billing.checkout.failure` (`reason`: `unauthorized`, `session_failed`, …); structured: `scope=billing`, `event=checkout_failure` | `recordCheckoutFailure` in `subscriptions/checkout/route.ts`. |
| **Readiness / DB down** | Sentry: `health.ready.failure` (`kind=database`); structured: `scope=health`, `event=ready_database_unavailable` | `GET /api/health/ready` when DB check fails (`health/ready/route.ts`). |
| **Unhandled errors** | Sentry Issues + performance traces | `@sentry/nextjs` (`sentry.server.config.ts`, `instrumentation.ts`). |

**Uptime / “site down”** is not asserted inside the app process: use an **external synthetic check** (Sentry Crons/Uptime, Better Stack, Pingdom, etc.) against:

- **Liveness:** `GET /api/health` — no database.
- **Readiness:** `GET /api/health/ready` — `SELECT 1` with timeout (`HEALTH_READY_DB_TIMEOUT_MS`, default 2500 ms). Alert when status ≠ 200 or `ok: false`.

## 2) Alerts configured (Sentry UI)

Create **Metric alerts** in Sentry (Settings → Alerts → Create Alert → Metric). Use environment = production.

| Alert | Suggested condition | Notes |
| --- | --- | --- |
| **High 5xx rate** | `api.route.count` where `status_bucket = 5xx` increases above baseline per 5–15 min | Requires routes wrapped with `runWithApiTelemetry` / `recordApiRouteTelemetry`. Also use **Issue** alerts for error events. |
| **Slow API** | `api.route.slow` or `api.route.duration_ms` p95 / count over threshold | Tune `NN_SLOW_API_ROUTE_MS`. |
| **DB slow** | `db.query.slow` with `severity = critical` OR `db.query.duration_ms` high | Matches Prisma timings > 1 s. |
| **DB errors** | `db.client.error` count > N per window | Buckets reduce noise (`connection`, `timeout`, …). |
| **Login failure spike** | `auth.login.failure` total or specific `bucket` (e.g. `db_error`, `system_error`) | Ignore `bad_password` / `not_found` for security-noise-only dashboards; alert on `db_error` + `system_error`. |
| **Checkout failures** | `billing.checkout.failure` with `reason = session_failed` or `stripe_unavailable` | Business-critical. |
| **Database unavailable** | `health.ready.failure` or synthetic check failing on `/api/health/ready` | Pair with external uptime. |
| **Site down** | External monitor: `GET /api/health` returns non-200 or timeout | Optionally second check on `/` or main marketing URL. |

**Log drain alerts:** If logs ship to Datadog/Axiom/etc., query JSON `schema=nn.observability.v1` and alert on `severity=error` or `event=http_5xx` / `ready_database_unavailable`.

## 3) Environment

| Variable | Purpose |
| --- | --- |
| `SENTRY_ENABLED=true` | Enables Sentry SDK + metrics helpers. |
| `NN_STRUCTURED_OBSERVABILITY=1` | Forces JSON monitoring lines even outside Vercel/production defaults. |
| `NN_SLOW_API_ROUTE_MS` | Slow-route threshold for API route telemetry (ms). |
