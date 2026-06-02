# Alert-ready structured signals (operator sheet)

**Purpose:** Wire **log drains** and **Sentry** to the same names as code. Thresholds mirror `src/lib/observability/alert-thresholds.ts` (`ALERT_THRESHOLDS`). Full playbooks: [`alerting-runbooks.md`](./alerting-runbooks.md).

## Structured events (`scope: structured`, JSON `event` field)

| Event | When | Key fields for filters | Sentry metric (if any) | Default threshold (see `ALERT_THRESHOLDS`) |
|--------|------|-------------------------|-------------------------|--------------------------------|
| `request_failed` | Handler returned HTTP ≥ 500 | `httpStatus`, `route`, `flow`, `correlationId` | `api.route.count` `status_bucket:5xx` | `structuredLogDrain.requestFailedCount5m` **20** / 5m |
| `route_timeout` | Handler duration ≥ `NN_ROUTE_TIMEOUT_LOG_MS` (default 45s) | `durationMs`, `route`, `errorClass: handler_duration_exceeded` | `api.route.slow` (pair) | `routeTimeoutCount5m` **5** / 5m |
| `route_degraded` | Duration ≥ `NN_SLOW_API_ROUTE_MS` (default 8s), or auto-degraded mode | `errorClass`: `slow_handler` or `auto_degraded` | `resilience.auto_degraded.engaged` | `routeDegradedCount15m` **50** / 15m; auto-degraded **4** / 15m |
| `db_query_slow` | Prisma op &gt; 500ms | `durationMs`, `message` (query hint), `route`, `correlationId` | `db.query.slow` | `db.slowQueryCount10m` **20** |
| `db_query_failed` | Prisma client error (before rethrow) | `errorClass` (`bucket` or `bucket:CODE`), `route`, `correlationId` | `db.client.error` | Alert on **rate** vs baseline; pair with DB health |
| `auth_login_failed` | Credential authorize | `errorClass` = bucket (`bad_password`, `db_error`, …) | `auth.login.failure` | **40** / 5m; `db_error`+`system_error` **5** / 5m |
| `signup_failed` | `POST /api/signup` validation / DB | `errorClass`, `correlationId` | — | Spike vs traffic |
| `password_reset_failed` | Forgot-password / reset-password failures | `route`, `flow: auth` | — | Spike vs traffic |
| `checkout_failed` | `POST /api/subscriptions/checkout` | `errorClass` = reason | `billing.checkout.failure` | Revenue: any sustained spike |
| `webhook_failed` | Stripe handler or idempotency claim after verify | `errorClass`: `handler` \| `claim` | `billing.webhook.failure` | **3** / 15m |
| `webhook_ignored` | Unhandled Stripe event type (acked) | — | — | **Do not page** on spike alone |
| `entitlement_resolve_failed` | `resolveEntitlement` / `getUserAccess` threw after auth | `route` (e.g. `rsc:resolveEntitlementForPage`, `/api/questions`, `/api/lessons`, `api:requireSubscriberSession`) | `entitlement.resolve.failure` `{surface}` | **15** / 15m |
| `question_load_failed` | Questions APIs | `route`, `correlationId` | — | `questionOrLessonLoadFailedCount15m` **30** / 15m |
| `lesson_load_failed` | `GET /api/lessons` | `route`, `correlationId` | — | same |

## Non-production verification

1. `NN_STRUCTURED_OBSERVABILITY=1 npm run dev`
2. Correlation: send `x-nn-correlation-id: verify-<id>` on API calls (see [`verify-structured-observability.md`](./verify-structured-observability.md)).
3. **request_failed / route_degraded / route_timeout:** use a dev-only slow route or temporarily lower `NN_SLOW_API_ROUTE_MS` / `NN_ROUTE_TIMEOUT_LOG_MS` — or rely on staging load tests.
4. **checkout_failed:** `curl -X POST /api/subscriptions/checkout` without session → `checkout_failed` + `errorClass: unauthorized`.
5. **db_query_failed:** easiest correlation check — trigger any Prisma error inside a route wrapped with `runWithPrismaQueryContextFromRequest` and confirm JSON includes `route` + `correlationId`.
6. **entitlement_resolve_failed (subscriber_api):** requires `getUserAccess` to throw (e.g. DB down or test double); expect `surface: subscriber_api` on `entitlement.resolve.failure`.
7. **entitlement_resolve_failed (list routes):** same failure mode while resolving `resolveEntitlement` for `GET /api/questions` or `GET /api/lessons` — expect `surface: api_questions_list` or `api_lessons_list` (not `question_load_failed` / `lesson_load_failed`, which remain for query failures after entitlement succeeds).

## Correlation propagation

| Layer | Mechanism |
|--------|-----------|
| Edge proxy | `x-nn-correlation-id` set on `/api/*` (`src/proxy.ts`); `request_start` structured log |
| Route handlers | `runWithPrismaQueryContextFromRequest` → Prisma slow/fail logs + `db_query_failed` ALS |
| RSC / server | `correlationIdFromHeaders()` (`x-nn-correlation-id`, fallbacks) |
| Auth / checkout / webhooks | `correlationIdFromRequest(req)` on each handler |

**Verdict for alerting:** rules are **ready** once drains parse `nn.structured_log.v1` / `nn.observability.v1` and Sentry metrics above are dashboarded — code emits consistent names; tune thresholds per traffic.
