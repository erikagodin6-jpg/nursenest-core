# Alerting runbooks

**Step-by-step incident playbooks:** [`production-incident-runbooks.md`](./production-incident-runbooks.md).

**Signal → severity → metric names:** [`operations-alert-signal-map.md`](./operations-alert-signal-map.md).

Threshold constants live in `src/lib/observability/alert-thresholds.ts` (`ALERT_THRESHOLDS`). Implement alert rules in **Sentry** (metrics + issues), **log drains** (JSON `nn.observability.v1`), or **Vercel** (cron synthetic failures), using the same names below.

**Default owner:** `platform-engineering` — replace with your PagerDuty/Opsgenie rotation in each rule.

---

## 1) CRITICAL

| Alert | Trigger | Window | Metric / signal | Owner | Next action | Runbook |
| --- | --- | --- | --- | --- | --- | --- |
| Homepage down | Synthetic `marketing_home` non-2xx OR `public_home_stats` fails | Per cron + 5m | `synthetic.check.failed` `{ check: marketing_home \| public_home_stats }` | platform-engineering | 1) Open deployment URL `/` and `/api/public/home-stats`. 2) Check Vercel/runtime logs for 5xx. 3) If DB: follow [DB unavailable](#db-runbook). 4) Roll back last deploy if correlated. | [Homepage](#homepage-runbook) |
| Login page down | Synthetic `login_page` non-2xx | Per cron + 5m | `synthetic.check.failed` `{ check: login_page }` | platform-engineering | 1) Hit `/login` in browser. 2) Check `proxy`/middleware auth redirects. 3) Verify `NEXTAUTH_URL` / auth env. 4) Inspect Sentry for `next-auth` errors. | [Login](#login-runbook) |
| Checkout / pricing path down | Synthetic `pricing_options` non-2xx OR checkout 5xx spike | Per cron + 5m | `synthetic.check.failed` `{ check: pricing_options }` + `api.route.count` `5xx` `flow:billing` | platform-engineering | 1) `GET /api/pricing/options`. 2) Stripe keys + `NEXT_PUBLIC_APP_URL`. 3) Test `POST /api/subscriptions/checkout` in staging. 4) Check `billing.checkout.failure` reasons. | [Billing](#billing-runbook) |
| DB unavailable | `/api/health/ready` 503 OR `ready_database_unavailable` logs | 3m | `health.ready.failure`, `scope:health` `event:ready_database_unavailable` | platform-engineering | 1) DB provider status. 2) `DATABASE_URL` / pool. 3) Run read-only query. 4) Scale connection limit if pool exhausted. | [DB](#db-runbook) |
| 5xx spike | `api.route.count` `status_bucket:5xx` ≥ **25** | 5m rolling | Sentry metric `api.route.count` | platform-engineering | 1) Sentry Issues sorted by new. 2) Filter `flow` tag. 3) Identify route from `route` / issue stack. 4) Roll back or hotfix. | [API errors](#api-errors-runbook) |
| Crash loop / restart storm | **Issue:** same release, same fingerprint **> 50 events/15m** OR deployment failures | 15m | Sentry Issues + Vercel deployment notifications | platform-engineering | 1) Sentry: top stack, release diff. 2) Vercel: failed builds / runtime crashes. 3) Disable bad feature flag. 4) Roll back. **Note:** Serverless has no classic “restart”; use error burst + deploy health. | [Crash loop](#crash-loop-runbook) |

### Homepage runbook

- Verify synthetic base URL (`NEXT_PUBLIC_APP_URL` / `VERCEL_URL`).
- Check `marketing.paywall.proof_neutral` spike (degraded stats).

### Login runbook

- Confirm auth routes and session cookies on apex vs `www`.

### Billing runbook

- Stripe dashboard for outages; webhook delivery log.

### DB runbook

- See `docs/environment-reference.md` for `DATABASE_URL`; Prisma `P1001`/`P2024` in logs.

### API errors runbook

- `http_5xx` in structured logs with `correlation` → trace request.

### Crash loop runbook

- Compare `git` release; check `SENTRY_RELEASE` mapping.

---

## 2) HIGH

| Alert | Trigger | Window | Metric / signal | Owner | Next action | Runbook |
| --- | --- | --- | --- | --- | --- | --- |
| Paywall proof unavailable | `marketing.paywall.proof_neutral` ≥ **30** | 15m | `marketing.paywall.proof_neutral` `{ surface }` | platform-engineering | 1) Check `public_home_stats` payload `proofDisplay`. 2) Inspect DB optional read warnings in logs (`home_stats_optional_read_failed`). 3) Fix content counts or DB read path. | [Proof](#proof-runbook) |
| Question / lesson load errors | `api.route.count` `5xx` `flow:content` ≥ **8** OR sustained 503 on `/api/lessons` / `/api/questions/discovery` | 5m | `api.route.count`, routes `GET /api/lessons`, `GET /api/questions/discovery` | platform-engineering | 1) Sentry stack for route. 2) Prisma errors → [DB](#db-runbook). 3) Check entitlements middleware. | [Content](#content-runbook) |
| Entitlement resolve failures | `entitlement.resolve.failure` ≥ **15** OR structured `entitlement_resolve_failed` spike | 15m | `entitlement.resolve.failure` `{ surface }` | platform-engineering | 1) Stripe/DB subscription reads (`getUserAccess`). 2) Compare with `db.client.error`. 3) Users see “verify access” / 503 on content. | [Entitlements](#entitlements-runbook) |
| Auth failure spike | `auth.login.failure` ≥ **40** (filter: exclude only `bad_password` if desired) OR `db_error`/`system_error` ≥ **5** | 5m | `auth.login.failure` `{ bucket }` | platform-engineering | 1) Rate-limit abuse? 2) DB up? 3) Credential provider logs. 4) Lockout false positives. | [Auth](#auth-runbook) |
| Webhook failures | `billing.webhook.failure` ≥ **3** | 15m | `billing.webhook.failure` `{ phase }` | platform-engineering | 1) Stripe webhook logs + secret. 2) Fix handler; replay events from Stripe dashboard. 3) Verify idempotency table. | [Webhooks](#webhooks-runbook) |
| Degraded-mode spike | `resilience.auto_degraded.engaged` ≥ **4** | 15m | `resilience.auto_degraded.engaged` | platform-engineering | 1) Read `auto_degraded_mode_enabled` logs (reason). 2) Slow queries / circuit breaker deps. 3) Reduce load; fix DB. | [Degraded](#degraded-runbook) |

### Proof runbook

- Surfaces: `fallback` (exception path), `partial_stats` (optional reads failed).

### Content runbook

- Lesson list uses `flow:content` telemetry.

### Entitlements runbook

- Surfaces: `page` (RSC `resolveEntitlementForPage`), `api_questions_id` (single-question API).
- Structured: `entitlement_resolve_failed`; monitoring: `scope: entitlement`, `event: resolve_failed`.

### Auth runbook

- Buckets in `recordCredentialsLoginFailure`.

### Webhooks runbook

- Phases: `handler` (apply failed), `dedupe` (idempotency write failed).

### Degraded runbook

- Auto mode: `src/lib/config/auto-degraded-mode.ts` (slow query / circuit bursts).

---

## 3) MEDIUM

| Alert | Trigger | Window | Metric / signal | Owner | Next action | Runbook |
| --- | --- | --- | --- | --- | --- | --- |
| Slow query spike | `db.query.slow` ≥ **20** OR `db.query.duration_ms` p95 ≥ **3000ms** | 10m / 15m | `db.query.slow`, `db.query.duration_ms` | platform-engineering | 1) Identify query in logs (`perf` / Prisma). 2) Add index or reduce fanout. 3) Check DB load. | [Slow DB](#slow-db-runbook) |
| Elevated 429s | `api.route.rate_limited` ≥ **120** | 5m | `api.route.rate_limited` `{ flow }` | platform-engineering | 1) Abuse IP? 2) Legit client retry storm? 3) Adjust rate limits / CDN. | [429](#429-runbook) |
| Repeated client runtime errors | Unhandled rejection / error **≥ 50** same fingerprint | 15m | Sentry Issues `feature:unhandledrejection` | platform-engineering | 1) Replay in Session Replay. 2) Ship fix; source maps OK? | [Client](#client-runbook) |
| Memory growth | `synthetic.runtime.heap_used_mb` ≥ **900** OR monotonic rise 3 samples | Per cron | `synthetic.runtime.heap_used_mb` | platform-engineering | 1) Heap snapshot in staging. 2) Look for leaks in caches. 3) Scale instance if applicable. | [Memory](#memory-runbook) |
| Cache miss spike | Edge cache hit ratio drops **2×** vs 24h baseline | 1h | Platform-specific (Vercel Analytics / CDN) | platform-engineering | 1) Purge misconfiguration? 2) Traffic pattern change? 3) Revalidate storm. | [Cache](#cache-runbook) |

### Slow DB runbook

- `logSlowPrismaQuery` + `recordSlowDbQuery`.

### 429 runbook

- Emitted from `api-route-telemetry` on HTTP 429.

### Client runbook

- `src/sentry.client.config.ts` tags `route`.

### Memory runbook

- Synthetic cron samples `GET /api/health` `memory.heapUsedMb`.

### Cache runbook

- Tune after you have CDN metrics; placeholder threshold in `ALERT_THRESHOLDS.cache`.

---

## Routing / escalation

| Severity | Channel | Response SLA (suggested) | Escalate when |
| --- | --- | --- | --- |
| CRITICAL | Pager / phone | 15 min | No ack in 15m → secondary on-call |
| HIGH | Pager or high-priority Slack | 1 h | Open > 2h without update |
| MEDIUM | Slack `#alerts` | Next business day | Same alert fires 3 days in a row |

**Rotation:** Map `platform-engineering` to your on-call schedule; **billing** alerts may CC **finance-ops** for webhook replay decisions.

**Noise control:** Use Sentry alert filters to exclude `bad_password` for auth spikes; require **min 3** consecutive windows for MEDIUM cache/memory.
