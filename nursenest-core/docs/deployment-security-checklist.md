# Deployment security & resilience checklist

Use before promoting a build to production and after changing auth, billing, entitlements, or env. See also `docs/security-observability.md` and `docs/security-regression-checklist.md`.

## Permission & trust boundaries (inventory)

| Boundary | Primary locations |
| --- | --- |
| **Session / JWT** | `src/lib/auth.ts` (credentials, lockout, rate limit), `src/lib/auth-callbacks.ts`, `src/lib/auth/node-jwt-callback.ts` (`credentialVersion` invalidation), `src/lib/auth-middleware.ts` (Edge `authorized`), `src/proxy.ts` (global API rate limit + `x-nn-admin-path`) |
| **Entitlements** | `src/lib/entitlements/get-user-access.ts`, `require-subscriber-session.ts`, `content-access-scope.ts`, pathway rules in `src/lib/exam-pathways/pathway-entitlements.ts` |
| **Admin / staff** | `src/lib/admin/ensure-admin.ts`, `src/lib/auth/admin-path-policy.ts`, `src/lib/admin/admin-audit-log.ts`, `/api/admin/*`, `/admin/*` |
| **Stripe** | `src/app/api/subscriptions/webhook/route.ts`, `src/lib/stripe/apply-stripe-webhook-event.ts`, `stripe-webhook-idempotency.ts`, `stripe-webhook-verify.ts`, `src/app/api/subscriptions/checkout/route.ts` |
| **Cron** | `src/lib/cron/enforce-cron-secret.ts`, `src/app/api/cron/*/route.ts` |
| **Abuse / size** | `src/lib/server/rate-limit.ts`, `src/lib/http/json-body-limit.ts`, `src/lib/questions/question-api-limits.ts`, `src/lib/api/api-pagination-limits.ts` |
| **Debug / diagnostics** | `src/app/api/debug/*` (e.g. `auth-user` behind `requireAdmin`; session route gated in prod) |
| **Env validation** | `src/instrumentation.ts` → `runProductionEnvGuard`, `validateProductionDatabaseEnv` |

## Pre-deploy (staging)

1. **Env**: `AUTH_SECRET` (≥32 chars recommended), `DATABASE_URL`, `NEXT_PUBLIC_APP_URL`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_SECRET_KEY` (billing), `AUTH_URL`/`NEXTAUTH_URL` origin-only, `CRON_SECRET` if cron jobs run, `NN_STRICT_PRODUCTION_ENV=1` in CI/staging smoke when you want boot to fail on critical gaps.
2. **Auth**: Smoke login, password change, forgot/reset; confirm forced logout after password change (`credentialVersion`).
3. **Entitlements**: Subscriber vs non-subscriber on `/api/questions`, `/api/lessons`, practice tests; pathway tier/country denial matches account.
4. **Admin**: Non-staff receives 403 on `/api/admin/users/lookup` and representative `/api/admin/*`.
5. **Stripe**: Dashboard test webhook or `stripe trigger` → event applied; replay same `evt_` id → dedupe path.
6. **Cron**: `POST /api/cron/jobs` (or your job) with `Authorization: Bearer <CRON_SECRET>` → 200; wrong secret → 401.
7. **Rate limits**: Optional 429 checks on strict auth paths (see `src/lib/server/rate-limit.ts`).
8. **Automated**: `npm run test:security-regression`.

## Production verification (safe)

- **Logs**: `[nursenest-core] env_guard` lines absent or warnings-only after deploy; no spike in `stripe_webhook` `handler_failed`, `entitlement` `resolve_failed`, `admin_audit` `denied_*` (see `docs/security-observability.md`).
- **Sentry**: Error rate stable; webhook/cron tagged issues not regressing.
- **Billing**: Stripe Dashboard shows successful webhook deliveries; subscription rows match expectations for test checkout.

## Rollback

1. **Platform**: Revert to previous deployment image / Vercel rollback / DO App Platform rollback.
2. **Env**: If a bad env var shipped, restore prior values in the host dashboard; no code rollback needed.
3. **Database**: Webhook handler is idempotent after success — avoid manually mutating `StripeWebhookEvent` unless engineering-approved; use Stripe Dashboard to replay if needed.
4. **Strict boot**: If `NN_STRICT_PRODUCTION_ENV=1` blocks startup, fix critical env keys or temporarily set `NN_STRICT_PRODUCTION_ENV=0` **only** to restore service while remediating (not a long-term fix).

## Degraded-mode toggles (operational)

- `NN_ENABLE_RATE_LIMITING` — default on; disable only for isolated debugging.
- `NN_ENABLE_CIRCUIT_BREAKER`, `NN_ENABLE_QUERY_TIMEOUTS`, `NN_ENABLE_RESPONSE_GUARD` — see `src/lib/config/production-safety-flags.ts`.
