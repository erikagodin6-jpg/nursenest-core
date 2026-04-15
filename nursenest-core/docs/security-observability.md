# Security observability

Production logs use the prefix **`[nursenest-core]`** with **`scope`** and **`event`** tokens (see `safeServerLog` in `src/lib/observability/safe-server-log.ts`). Structured JSON meta is passed through **`redactMetaForLog`** (`src/lib/env/redact-secrets.ts`).

## Correlation IDs

**Headers** (first match wins): `x-vercel-id`, `x-request-id`, `cf-ray`, `x-correlation-id`, `x-amzn-trace-id`.

**Code**: `correlationIdFromRequest(req)` for Route Handlers; `correlationIdFromHeaders()` when only `headers()` is available (`src/lib/observability/request-correlation.ts`).

Use **`correlation`** in log meta to tie a line to the same HTTP request across services that forward these headers.

## Log severity (`severity` field)

| Value | Meaning |
| --- | --- |
| `info` | Successful or neutral operational events |
| `expected_denial` | Policy outcome (no session, RBAC deny, invalid reset token, wrong current password) — **not** an application bug |
| `warning` | Misconfiguration or suspicious but non-fatal (e.g. Stripe webhook missing secret, email not delivered) |
| `error` | True failures (DB/entitlement resolution, webhook handler crash, cron failure) — often paired with Sentry for `safeServerLogCritical` |

Filter alerts: prefer **`severity != expected_denial`** for error budgets, or alert specifically on **`error`** / `safeServerLogCritical` scopes.

---

## 1) Event catalog (security-relevant)

| Scope | Event | Typical `severity` | Who / what |
| --- | --- | --- | --- |
| `admin_audit` | `api_gate` | `info` / `expected_denial` | Admin/staff API: `result` (`allowed` / `denied_no_session` / `denied_rbac`), `actorPrefix`, `path`, `correlation` |
| `access` | `unauthorized_no_session` | `expected_denial` | Subscriber API with no session |
| `access` | `denied` | `expected_denial` | Subscriber gate: `reason: no_active_entitlement`, `userIdPrefix`, tier/country |
| `entitlement` | `resolve_failed` | `error` | DB/access resolution failure (503 to client) |
| `auth` | `password_reset_token_issued` | `info` | Forgot-password: token created (`userIdPrefix`, not email) |
| `auth` | `password_reset_email_not_delivered` | `warning` | Email provider issue |
| `auth` | `password_reset_token_rejected` | `expected_denial` | Bad/expired reset token |
| `auth` | `password_reset_token_consumed` | `info` | Successful reset |
| `auth` | `password_changed` | `info` | Authenticated change-password |
| `auth` | `change_password_failed` | `expected_denial` or `error` | Wrong current password vs server error |
| `auth` | `forgot_password_failed` / `reset_password_failed` | `error` | Exception paths |
| `stripe_webhook` | `event_received` | `info` | Stripe event accepted (`type`, `eventIdPrefix`, `keyMode`, `correlation`) |
| `stripe_webhook` | `signature_verification_failed` | `warning` | Invalid signature |
| `stripe_webhook` | `configuration_or_signature_missing` | `warning` | Missing webhook secret or `stripe-signature` header |
| `stripe_webhook` | `handler_failed` | `error` | Handler threw (Sentry) |
| `stripe_webhook` | `dedupe_record_failed` | `error` | Idempotency persistence failed after success |
| `stripe_webhook` | `dedupe_after_success` | `info` | Duplicate delivery after apply |
| `billing_sync` | `webhook_event_applied` | `info` | Handler finished for event (`type`, `eventIdPrefix`, `correlation`) |
| `cron` | `authorization_failed` | `expected_denial` | Wrong/missing `Authorization: Bearer` for cron |
| `cron` | `reject_missing_cron_secret` | `error` | `CRON_SECRET` unset in production-like env |
| `cron` | `stripe_reconcile_complete` / `stripe_reconcile_failed` | `info` / `error` | Scheduled Stripe ↔ DB reconciliation |

**Auth incident prefix** (credentials / lockout / NextAuth diagnostics): lines prefixed **`[auth-incident]`** from `logAuthIncidentLine` — also passed through **`redactMetaForLog`**.

**Other hooks**: `productEvent("stripe_webhook_ok" | "stripe_webhook_failed", …)` (`src/lib/observability/product-events.ts`), Sentry tags on webhook/critical paths.

---

## 2) Code map

| Area | Location |
| --- | --- |
| Safe logging + Sentry critical | `src/lib/observability/safe-server-log.ts` |
| Correlation helpers | `src/lib/observability/request-correlation.ts` |
| Redaction | `src/lib/env/redact-secrets.ts` |
| Admin RBAC audit | `src/lib/admin/admin-audit-log.ts`, `ensure-admin.ts` |
| Subscriber entitlement gate | `src/lib/entitlements/require-subscriber-session.ts` |
| Stripe webhook + billing apply | `src/app/api/subscriptions/webhook/route.ts`, `src/lib/stripe/apply-stripe-webhook-event.ts` |
| Password flows | `src/app/api/auth/forgot-password/route.ts`, `reset-password/route.ts`, `change-password/route.ts` |
| Cron auth | `src/lib/cron/enforce-cron-secret.ts` |
| Auth incidents | `src/lib/auth/auth-incident-log.ts`, `src/lib/auth.ts` |

---

## 3) Redaction rules

1. **Never** log raw passwords, reset tokens, session cookies, `Authorization` headers, or full Stripe/webhook secrets.
2. **Structured meta** is shallow-redacted: keys matching sensitive substrings (`secret`, `password`, `token`, …) have values replaced (see `isLikelySensitiveKey`).
3. **Truncated references** use suffixes like `userIdPrefix`, `eventIdPrefix`, `tokenHashPrefix` — these are **explicitly not** treated as secrets (see `redact-secrets.ts`).
4. **Database URLs** in strings are masked when they look like connection strings.
5. **Auth incident** payloads go through the same **`redactMetaForLog`** step before `JSON.stringify`.

---

## 4) Suggested alert conditions

Tune thresholds to your traffic; examples:

| Signal | Condition | Notes |
| --- | --- | --- |
| Webhook processing | Spike in `stripe_webhook` + `handler_failed` or Sentry `flow: stripe_webhook` | Billing drift; check Stripe dashboard retries |
| Webhook signature | Spike in `signature_verification_failed` | Wrong `STRIPE_WEBHOOK_SECRET`, proxy altering body, or attack |
| Dedupe | `dedupe_record_failed` **any** | Risk of double application if retried — investigate DB |
| Entitlements | `entitlement` + `resolve_failed` rate | User-facing 503s; DB or `getUserAccess` |
| Cron | `cron` + `reject_missing_cron_secret` | Misconfiguration in prod |
| Cron reconcile | `stripe_reconcile_failed` or `errorCount` high in `stripe_reconcile_complete` summary | Stripe/DB sync issues |
| Admin abuse | Spike in `admin_audit` with `denied_rbac` | Possible probing; correlate `actorPrefix` / `path` |
| Rate limits | Existing `security` + `rate_limit_exceeded` (see `rate-limit.ts`) | Brute-force or abuse |

Metrics: **`productEvent`** names (`stripe_webhook_ok`, `stripe_webhook_failed`) are suitable for dashboards if wired to your analytics pipeline.

---

## 5) Operator runbook (incident checklist)

1. **Identify the window** — note UTC time range and environment (`VERCEL_ENV`, deployment id).
2. **Find a correlation** — search logs for `correlation`, `eventIdPrefix` (Stripe), or `userIdPrefix` / `actorPrefix` from a user report.
3. **Classify** — `severity: expected_denial` → usually support/explain; `error` / `safeServerLogCritical` → engineering.
4. **Stripe webhooks** — Dashboard → Developers → Webhooks → event id; compare `event_received` / `webhook_event_applied` / `handler_failed` lines; confirm `keyMode` (test vs live) matches the event.
5. **Entitlement mismatches** — Check subscription rows for the user; run reconciliation job (`/api/cron/stripe-reconcile` with secret) if documented in `docs/cron-pipelines.md`.
6. **Admin access** — Use `admin_audit` lines: `denied_no_session` vs `denied_rbac` to distinguish auth vs tier/RBAC.
7. **Escalate with** — redacted log excerpts, correlation id, scope/event, and whether Sentry shows a linked issue.

---

## Answering operator questions

| Question | Where to look |
| --- | --- |
| Who did what? | `actorPrefix` / `userIdPrefix`, `admin_audit` `role` / `tier` |
| When? | Log timestamp (platform); Stripe `eventIdPrefix` for billing |
| Which account / subscription? | `userIdPrefix`; Stripe `eventIdPrefix` + type; DB lookup by id prefix + time |
| Success? | `severity: info`, `result: allowed`, `webhook_event_applied`, HTTP outcome in edge logs |
| Trace related requests? | `correlation` field; same `eventIdPrefix` across webhook retries |
