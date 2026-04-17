# Environment variables reference

Values belong in the host secret store (e.g. Vercel / DigitalOcean), **never** committed to git.  
Canonical validation: `src/lib/env/production-env-guard.ts` (startup) + `src/lib/db/validate-production-db-env.ts` (Postgres hints).

## Strict startup

- **`NN_STRICT_PRODUCTION_ENV`**: set to `1` / `true` in production to **exit the process** if any **critical** env check fails. Use in CI or after confirming all vars are set. Omit or `0` to only log warnings (default).

## Naming and environments

| Canonical | Legacy / alias | Notes |
|-----------|----------------|--------|
| `AUTH_SECRET` | `NEXTAUTH_SECRET` | Either works; prefer `AUTH_SECRET`. |
| `DATABASE_URL` | — | **Only** supported DB URL. `PROD_DATABASE_URL` is ignored — remove it. See `docs/database-environment.md`. |
| `AUTH_URL` | `NEXTAUTH_URL` | Public origin only (no path). |

Test/staging/production should use **different** secrets and DB URLs; never reuse production `AUTH_SECRET` or `DATABASE_URL` in local `.env` that could be committed.

---

## Auth & sessions

| Variable | Required (prod) | Purpose |
|----------|------------------|---------|
| `AUTH_SECRET` or `NEXTAUTH_SECRET` | **Yes** | JWT/session signing |
| `AUTH_URL` / `NEXTAUTH_URL` | Recommended | Public origin; origin-only URL |
| `NEXTAUTH_URL` | Legacy | Same as `AUTH_URL` if set |

## Database

| Variable | Required (prod) | Purpose |
|----------|------------------|---------|
| `DATABASE_URL` | **Yes** | Prisma Postgres URL (only variable; do not use `PROD_DATABASE_URL`) |
| `DIRECT_URL` | Optional | Direct (non-pooler) URL for migrations; often derived by env-bootstrap (`DATABASE_DIRECT_URL` is a legacy alias) |
| `PRISMA_CONNECTION_LIMIT` | Optional | Pool size override |
| `PRISMA_POOL_TIMEOUT` | Optional | Pool timeout override |
| `NN_DB_MAX_CONCURRENT_QUERIES` | Optional | App-side query semaphore |

Add `?statement_timeout=…` and `connection_limit=…` on the URL when possible (see `validate-production-database-env` warnings).

## Billing (Stripe)

| Variable | Required (prod) | Purpose |
|----------|------------------|---------|
| `NEXT_PUBLIC_APP_URL` | **Yes** | Public `https` origin for Stripe success/cancel/portal return URLs |
| `STRIPE_SECRET_KEY` | **Yes** (for billing) | Server Stripe SDK |
| `STRIPE_WEBHOOK_SECRET` | **Yes** | Webhook signature verification |
| Stripe price env keys | Per catalog | See `src/lib/stripe/pricing-map.ts` |

## Storage (Spaces / S3-compatible)

| Variable | Purpose |
|----------|---------|
| `SPACES_*` / config in `src/lib/storage/spaces-config.ts` | Object storage credentials and buckets |

## Monitoring & analytics

| Variable | Purpose |
|----------|---------|
| `SENTRY_ENABLED` | Enable Sentry SDK |
| `SENTRY_*` | DSN, sampling (see `sentry.*.config.ts`) |
| PostHog keys | See `src/lib/observability/posthog-server.ts` |

## Email

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Transactional email (password reset, etc.) |

## AI (optional features)

| Variable | Purpose |
|----------|---------|
| `OPENAI_API_KEY` | OpenAI (see `openai-env.ts`) |
| `AI_*` | Model overrides for coach/admin generation |

## Captcha

| Variable | Purpose |
|----------|---------|
| Turnstile / captcha keys | `src/lib/captcha/verify-turnstile.ts` |

## Deployment & cron

| Variable | Purpose |
|----------|---------|
| `CRON_SECRET` | Shared secret for `/api/cron/*` (see `enforce-cron-secret`) |
| `VERCEL_URL` | Set by Vercel (not a substitute for `NEXT_PUBLIC_APP_URL` on custom domains) |

## Admin / audit (optional)

| Variable | Purpose |
|----------|---------|
| `NN_ADMIN_AUDIT_GET` | `1` to log successful admin GETs in audit stream |
| `ADMIN_ACCESS_DEBUG` | Verbose staff-session logs (avoid in prod) |

## Logging safety

- Use `safeServerLog` / `safeServerLogCritical` — meta keys matching `*token*`, `*secret*`, etc. are redacted via `src/lib/env/redact-secrets.ts`.
- Database URLs in logs should use `maskDatabaseUrl` (`database-env.ts`).

## Related files

- `src/instrumentation.ts` — runs DB validation + production env guard  
- `src/lib/db/env-bootstrap.ts` — `DATABASE_URL` tuning  
- `src/lib/env/public-app-origin.ts` — billing absolute URLs  
