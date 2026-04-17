# Verify structured observability (non-production)

**Prerequisite:** JSON lines only print when structured observability is on (`NN_STRUCTURED_OBSERVABILITY=1` or production defaults in `observability-record.ts`).

## Checklist

1. **Start the app** with explicit structured logging:
   ```bash
   cd nursenest-core && NN_STRUCTURED_OBSERVABILITY=1 pnpm dev
   ```
2. **Pick a stable correlation id** (e.g. `verify-test-001`).
3. **Hit an instrumented API** with the proxy header (middleware sets `x-nn-correlation-id` if absent; manual header proves propagation):
   ```bash
   curl -sS -D - -o /dev/null \
     -H "x-nn-correlation-id: verify-test-001" \
     "http://127.0.0.1:3000/api/health"
   ```
   - Expect stderr JSON lines containing `"scope":"structured"` or `"scope":"api"` depending on path.
4. **Telemetry-wrapped route** (emits `request_end` + `request_failed` on 5xx):
   ```bash
   curl -sS "http://127.0.0.1:3000/api/public/home-stats" \
     -H "x-nn-correlation-id: verify-test-002"
   ```
5. **Checkout correlation** (expect 401 + structured `checkout_failed` when unauthenticated):
   ```bash
   curl -sS -X POST "http://127.0.0.1:3000/api/subscriptions/checkout" \
     -H "content-type: application/json" \
     -H "x-nn-correlation-id: verify-test-003" \
     -d '{"tier":"RN","duration":"monthly","acceptPolicies":true,"policyVersion":"test"}'
   ```
   - Grep server output for `"event":"checkout_failed"` and matching `correlationId`.
6. **Signup structured failure** (safe: invalid body → `signup_failed` without creating a user):
   ```bash
   curl -sS -X POST "http://127.0.0.1:3000/api/signup" \
     -H "content-type: application/json" \
     -H "x-nn-correlation-id: verify-test-004" \
     -d '{}'
   ```
7. **Password reset** (optional; may send mail if configured — skip in shared envs):
   - Use `forgot-password` only on local/dev with mail disabled or expect `password_reset_failed` / `password_reset_requested` in logs per outcome.

## Script

`scripts/verify-structured-observability.sh` runs steps 3–5 and prints the correlation ids to search in logs.

## Correlation propagation

- **Edge `proxy`** (`src/proxy.ts`): ensures `x-nn-correlation-id` on incoming requests; logs `request_start` for `/api/*`.  
- **Route handlers**: `correlationIdFromRequest` reads `x-nn-correlation-id` first, then platform ids (`x-vercel-id`, `x-request-id`, …).  
- **RSC / `headers()`**: `correlationIdFromHeaders()` (async) for server components such as entitlement resolution.  
- **Prisma extension** (`src/lib/db.ts`): `db_query_failed` / `db_query_slow` attach **`route` + `correlationId`** when the request ran inside `runWithPrismaQueryContextFromRequest` (most `runWithApiTelemetry` routes). `db_query_slow` also includes low-cardinality query hint in `message`. Background jobs without ALS: alert on **rate** alone or use `request_end` time proximity.

## Alert-ready signals (log drain / `scope: structured`)

| Spike or failure | Structured `event` / key | Notes |
|------------------|--------------------------|--------|
| Auth failure spike | `auth_login_failed` | `errorClass` = bucket (`bad_password`, `db_error`, …). |
| DB failure spike | `db_query_failed` | `errorClass` includes Prisma code when known (e.g. `connection:P1001`). |
| Slow DB | `db_query_slow` | `message` includes low-cardinality `queryHint`; critical tier when &gt; 1s op. |
| Route slow / platform risk | `route_degraded` | From `api-route-telemetry` (slow handler) or `recordAutoDegradedEngaged` (resilience). |
| Route extremely slow | `route_timeout` | Handler duration ≥ `NN_ROUTE_TIMEOUT_LOG_MS` (default 45s). |
| Degraded learner mode | `route_degraded` + `errorClass: auto_degraded` | From slow-query / circuit burst (`production-signal-metrics`). |
| Webhook processing failure | `webhook_failed` | After verified event; `errorClass` = `handler` \| `claim`. |
| Stripe webhook visibility | `webhook_received`, `webhook_ignored` | Ignored = unhandled event type (ok). |
| Checkout failure | `checkout_failed` | `errorClass` = reason (`unauthorized`, `session_failed`, …). |
| Question API failure | `question_load_failed` | List, discovery, and `GET /api/questions/[id]` (subscriber vs freemium in `userState`). |
| Lesson list failure | `lesson_load_failed` | `GET /api/lessons`. |
| Entitlement read failure | `entitlement_resolve_failed` | RSC `resolveEntitlementForPage`, `GET /api/questions` / `GET /api/questions/[id]`, `GET /api/lessons`, **`requireSubscriberSession`** when `getUserAccess` throws. |
| Signup / password | `signup_failed`, `password_reset_failed` | Auth flows. |

**Wrapped routes** (emit `request_end`, `route_degraded`, `route_timeout`): include `GET /api/lessons`, `GET /api/questions`, `GET /api/questions/discovery`, `GET /api/questions/[id]`, `POST /api/exams/start`, `POST /api/subscriptions/checkout`, `POST /api/subscriptions/webhook`, `GET /api/public/home-stats`, synthetic cron — not every `/api/*` route.

**Alert thresholds:** Numeric defaults for drains + Sentry are in `src/lib/observability/alert-thresholds.ts`. Operator-facing map: `docs/operations-alert-signal-map.md`.
