# Incident alerting — concise rules (operator sheet)

**Canonical thresholds:** `src/lib/observability/alert-thresholds.ts` (`ALERT_THRESHOLDS`).  
**Deeper maps / Sentry metrics:** `docs/operations-alert-signal-map.md`, `docs/alerting-runbooks.md`.  
**Non-production verification:** `docs/verify-structured-observability.md`, `scripts/verify-structured-observability.sh`.

**CI static wiring:** `npm run test:observability-signals` — asserts emit sites for incident `event` names (prevents silent refactors from dropping signals).

Structured JSON lines use `nn.observability.v1` with `scope: "structured"` and `event` matching `StructuredLogEventName` in `src/lib/observability/structured-log.ts`.

---

## Alert-ready signals (actual `event` names)

| `event` | When | Default threshold (see `ALERT_THRESHOLDS`) | Pair with Sentry / metric |
|--------|------|---------------------------------------------|---------------------------|
| `request_failed` | Wrapped handler returned HTTP ≥ 500 | `structuredLogDrain.requestFailedCount5m` **20** / 5m | `api.route.count` `status_bucket:5xx` |
| `route_timeout` | Duration ≥ `NN_ROUTE_TIMEOUT_LOG_MS` (default 45s) | `structuredLogDrain.routeTimeoutCount5m` **5** / 5m | `api.route.slow` |
| `route_degraded` | Duration ≥ `NN_SLOW_API_ROUTE_MS` (default 8s), or resilience auto-degrade | `structuredLogDrain.routeDegradedCount15m` **50** / 15m; auto-degraded `resilience.autoDegradedEngagements15m` **4** / 15m | `resilience.auto_degraded.engaged` |
| `db_query_slow` | Prisma op &gt; 500ms (warn), &gt; 1s critical | `db.slowQueryCount10m` **20** | `db.query.slow` |
| `db_query_failed` | Prisma client error (before rethrow) | Rate vs baseline | `db.client.error` |
| `auth_login_failed` | Credential authorize failure | `auth.failureSpikeCount5m` **40** / 5m; `auth.dbOrSystemFailureCount5m` **5** / 5m | `auth.login.failure` `{bucket}` |
| `signup_failed` | `POST /api/signup` validation / DB | Spike vs traffic | — |
| `password_reset_failed` | Forgot / reset password path failures | Spike vs traffic | — |
| `checkout_failed` | `POST /api/subscriptions/checkout` | Revenue: sustained spike | `billing.checkout.failure` `{reason}` |
| `webhook_failed` | Stripe handler or idempotency claim after verify | `billing.webhookFailureCount15m` **3** / 15m | `billing.webhook.failure` `{phase}` |
| `webhook_ignored` | Unhandled Stripe event type (acked) | **Do not page** on spike alone | Audit only |
| `entitlement_resolve_failed` | `getUserAccess` / `resolveEntitlement` threw after auth | `entitlement.resolveFailureCount15m` **15** / 15m | `entitlement.resolve.failure` `{surface}` |
| `question_load_failed` | Questions APIs after entitlement resolved | `structuredLogDrain.questionOrLessonLoadFailedCount15m` **30** / 15m | — |
| `lesson_load_failed` | `GET /api/lessons` query failure | Same as above | — |

**Triage (1 line each):**  
- **request_failed / route_timeout:** App 5xx or pathological latency — check deploy, DB, upstream.  
- **route_degraded (slow_handler):** Tune route or raise `NN_SLOW_API_ROUTE_MS`; check DB.  
- **route_degraded (auto_degraded):** Resilience engaged — check `db_query_slow` / circuit burst.  
- **db_query_*:** Postgres / pool / query plans; confirm `route` + `correlationId` on line.  
- **auth_login_failed:** Bucket filter — `db_error` / `system_error` = infra.  
- **checkout_failed / webhook_failed:** Stripe dashboard, secrets, idempotency — use `correlationId`.  
- **entitlement_resolve_failed:** Subscription DB reads — compare with `db_query_failed`.  
- **question_load_failed / lesson_load_failed:** Content queries — Prisma errors vs entitlement OK.

---

## Correlation ID propagation

| Layer | Mechanism |
|-------|-----------|
| Edge `proxy` | `x-nn-correlation-id` set if absent; `request_start` for `/api/*` (`src/proxy.ts`) |
| API routes | `correlationIdFromRequest(req)`; `runWithPrismaQueryContextFromRequest` → Prisma slow/fail + `db_query_*` |
| RSC / server | `correlationIdFromHeaders()` (`x-nn-correlation-id` and fallbacks) |
| Auth / checkout / webhooks | Explicit `correlationIdFromRequest` on handlers |

---

## Non-production triggering

1. Enable JSON lines: `NN_STRUCTURED_OBSERVABILITY=1` (or rely on `NODE_ENV=production` / `VERCEL=1` per `observability-record.ts`).
2. Send a stable id: `curl -H "x-nn-correlation-id: verify-$(date +%s)" ...`
3. **Safe checks (no paid side effects):**
   - `GET /api/health` — confirms correlation on stderr JSON.
   - `POST /api/subscriptions/checkout` without session — `checkout_failed` + `errorClass: unauthorized`.
   - `POST /api/signup` with `{}` — `signup_failed` without creating a user.
   - Lower `NN_SLOW_API_ROUTE_MS` / `NN_ROUTE_TIMEOUT_LOG_MS` temporarily to force `route_degraded` / `route_timeout` on a slow wrapped route (dev only).

Full curl list: `docs/verify-structured-observability.md`.

---

## Blind spot (by design)

Handlers that **do not** call `runWithApiTelemetry` / `recordApiRouteTelemetry` will not emit `request_end` / `request_failed` / `route_timeout` from telemetry — add wrapping when promoting a route to SLO coverage. See `docs/production-monitoring-alerts.md` (gap section).

**RSC / server components:** `lesson_load_failed` and `question_load_failed` are emitted from **API routes** when list/detail queries fail after entitlement resolves. A Prisma failure inside an RSC page path may surface as a render error without those events unless the page calls the same helpers — triage with `entitlement_resolve_failed` (RSC) and `db_query_*` when the request used Prisma ALS.
