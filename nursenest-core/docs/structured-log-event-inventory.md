# Structured log event inventory (`nn.structured_log.v1`)

Server-side structured events are emitted via `emitStructuredLog` in `src/lib/observability/structured-log.ts`. Each line is a **`nn.observability.v1`** record (`emitMonitoringRecord`) with:

- **`scope`**: always `"structured"` for these events  
- **`event`**: the structured event name (same as `StructuredLogEventName`)  
- **`correlationId`**: optional; from `correlationIdFromRequest` when the handler has a `Request`  
- **`severity`**: `info` \| `warn` \| `error`  
- **`meta`**: includes `schema: "nn.structured_log.v1"` plus event-specific fields (`method`, `errorClass`, `message`, `degraded`, …)

See `StructuredLogFields` in `structured-log.ts` for the allowlist of top-level transport fields.

## Emitted events (by name)

| `event` | Severity (typical) | Source | `correlationId` | Notable `meta` / notes |
| --- | --- | --- | --- | --- |
| `request_start` | info | `src/proxy.ts` | Yes (from Edge request) | `route`, `method` — fires for `/api*` only |
| `request_end` | info/warn/error | `api-route-telemetry.ts` | Yes | `httpStatus`, `durationMs`, `degraded`, `flow` |
| `request_failed` | error | `api-route-telemetry.ts` | Yes | When `httpStatus >= 500`; `errorClass: http_5xx` |
| `route_timeout` | error | `api-route-telemetry.ts` | Yes | When `durationMs >= NN_ROUTE_TIMEOUT_LOG_MS` (default 45s) |
| `route_degraded` | warn | `api-route-telemetry.ts` (slow handler) **or** `production-signal-metrics.ts` (auto-degraded) | Yes† / No‡ | Handler: `errorClass: slow_handler`. Resilience: `errorClass: auto_degraded` |
| `db_query_slow` | warn/error | `production-signal-metrics.ts` | No* | `durationMs`, `errorClass: slow_query_warn \| slow_query_critical` |
| `db_query_failed` | error | `production-signal-metrics.ts` | No* | Prisma extension in `db.ts`; `errorClass` = prisma bucket |
| `auth_login_failed` | warn/error | `production-signal-metrics.ts` | Yes† | `recordCredentialsLoginFailure`; `errorClass` = bucket name |
| `auth_login_succeeded` | info | `src/lib/auth.ts` | Yes | Successful credential sign-in |
| `signup_failed` | warn/error | `src/app/api/signup/route.ts` | Yes | `flow: auth`, `errorClass` = reason key |
| `password_reset_requested` | info | `forgot-password/route.ts` | Yes | Happy-path signal |
| `password_reset_failed` | error | `forgot-password/route.ts` | Yes | Failure paths |
| `paywall_stats_unavailable` | warn | `production-signal-metrics.ts` | No* | `route: /api/public/home-stats`, `degraded: true` |
| `checkout_started` | info | `subscriptions/checkout/route.ts` | Yes | `flow: billing` |
| `checkout_failed` | warn/error | `production-signal-metrics.ts` | Yes‡ | `recordCheckoutFailure`; `errorClass` = reason |
| `webhook_received` | info | `subscriptions/webhook/route.ts` | Yes | `flow: webhook`, `message` has event type/id prefix |
| `webhook_failed` | error | `production-signal-metrics.ts`, `webhook/route.ts` | Yes‡ | `recordStripeWebhookFailure`; `errorClass` = `handler` \| `dedupe` \| `claim` |
| `webhook_ignored` | info | `subscriptions/webhook/route.ts` | Yes | Unhandled Stripe event type — **not** a failure; audit only |
| `question_load_failed` | error | `questions/route.ts`, `questions/discovery/route.ts`, `questions/[id]/route.ts` | Yes | Domain-specific failure |
| `lesson_load_failed` | error | `lessons/route.ts` | Yes | Domain-specific failure |
| `entitlement_resolve_failed` | error | `resolve-entitlement-for-page.ts`, `questions/[id]/route.ts`, `require-subscriber-session.ts` | Yes† / async headers | Pairs with Sentry `entitlement.resolve.failure` (`surface`: page / api_questions_id / subscriber_api) |

\*No request object exists in the Prisma extension / resilience helpers; correlation is not attached today.  
†`correlationId` when available: credentials `Request`, `api-route-telemetry`, `correlationIdFromHeaders()` for RSC.  
‡`checkout_failed`, `webhook_failed`, and slow-handler `route_degraded` include `correlationId` from the originating `Request`.

## Client mirror (breadcrumbs only)

`emitClientStructuredLog` (`structured-client-log.ts`) emits Sentry breadcrumbs for `question_load_failed` and `lesson_load_failed` with the same **event names** for cross-correlation with server issues. It does **not** emit `nn.observability.v1` JSON lines unless paired with UX tracking when Sentry is enabled.
