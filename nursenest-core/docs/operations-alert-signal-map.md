# Operations alert signal map

**Purpose:** Map **exact** production signals to **severity** and **operator action**. Threshold numbers live in `src/lib/observability/alert-thresholds.ts` (`ALERT_THRESHOLDS`) — keep alert rules in Sentry / log drains in sync with that file.

**Schemas:** Monitoring JSON uses `nn.observability.v1` (`emitMonitoringRecord`). Structured lesson uses `nn.structured_log.v1` inside `meta` when `scope === "structured"` (`structured-log.ts`).

---

## A) Sentry Metrics (numeric; best for rate alerts)

| Metric | Attributes | Typical alert | `ALERT_THRESHOLDS` key |
|--------|------------|---------------|-------------------------|
| `api.route.count` | `status_bucket`, `flow` | 5xx spike | `api.fiveXxSpikeCount5m`, `api.fiveXxElevatedCount5m` |
| `api.route.slow` | `flow` | Slow route burst | (pair with `NN_SLOW_API_ROUTE_MS`) |
| `auth.login.failure` | `bucket` | Spike; filter `db_error` / `system_error` | `auth.failureSpikeCount5m`, `auth.dbOrSystemFailureCount5m` |
| `billing.checkout.failure` | `reason` | Revenue | (see checkout route + `recordCheckoutFailure`) |
| `billing.webhook.failure` | `phase` | Integrity | `billing.webhookFailureCount15m` |
| `db.client.error` | `bucket`, `prismaCode` | DB instability | — |
| `db.query.slow` | `severity` | Slow queries | `db.slowQueryCount10m` |
| `entitlement.resolve.failure` | `surface`: `page` \| `api_questions_id` | Paywall / RSC trust loss | `entitlement.resolveFailureCount15m` |
| `health.ready.failure` | `kind` | DB down | — |
| `marketing.paywall.proof_neutral` | `surface` | Stats degraded | `marketing.proofNeutralSpikeCount15m` |
| `resilience.auto_degraded.engaged` | `reason` | Tier-2 skips | `resilience.autoDegradedEngagements15m` |
| `api.route.rate_limited` | `flow` | Abuse / storm | `rateLimit.elevated429Count5m` |

---

## B) Structured log events (`scope: "structured"`, `event` column)

Use log drains (Axiom, Datadog, etc.) to count **`event`** per window. Spike thresholds: `ALERT_THRESHOLDS.structuredLogDrain`.

| `event` | Meaning | Pair with |
|---------|---------|-----------|
| `request_failed` | Handler returned ≥500 | `api.route.count` 5xx |
| `route_timeout` | Duration ≥ `NN_ROUTE_TIMEOUT_LOG_MS` (default 45s) | Infra / DB |
| `route_degraded` | Slow handler (`api-route-telemetry`) **or** auto-degraded (`errorClass: auto_degraded`) | `route_degraded` + `meta.errorClass` |
| `db_query_slow` / `db_query_failed` | Prisma | `db.client.error` |
| `auth_login_failed` | Credential sign-in | `auth.login.failure` |
| `signup_failed` | Signup validation / DB | — |
| `password_reset_failed` | Resend / token issues | — |
| `checkout_failed` | Stripe session / policy | `billing.checkout.failure` |
| `webhook_failed` | After verified Stripe event | `billing.webhook.failure` |
| `webhook_ignored` | Unhandled event type (often OK) | Do **not** page on spike alone |
| `entitlement_resolve_failed` | `getUserAccess` path threw | `entitlement.resolve.failure` |
| `question_load_failed` / `lesson_load_failed` | Content API | Route 5xx + Prisma |

---

## C) Correlation ID

- **Header:** `x-nn-correlation-id` (`NN_CORRELATION_HEADER`).
- **Proxy** (`src/proxy.ts`): sets id for `/api/*`; logs `request_start`.
- **API handlers:** `correlationIdFromRequest(req)` on `Request`; RSC: `correlationIdFromHeaders()`.
- **Verification:** `docs/verify-structured-observability.md`, `scripts/verify-structured-observability.sh`.

---

## D) Runbooks

Step-by-step playbooks: `docs/alerting-runbooks.md`. Monitoring overview: `docs/production-monitoring-alerts.md`. Full structured inventory: `docs/structured-log-event-inventory.md`.
