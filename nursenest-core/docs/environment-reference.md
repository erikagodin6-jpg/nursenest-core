# Environment variables reference

Values belong in the host secret store (e.g. Vercel / DigitalOcean), **never** committed to git.  
Canonical validation: `src/lib/env/production-env-guard.ts` (startup) + `src/lib/db/validate-production-db-env.ts` (Postgres hints).

## Strict startup

- **`NN_STRICT_PRODUCTION_ENV`**: set to `1` / `true` in production to **exit the process** if any **critical** env check fails. Use in CI or after confirming all vars are set. Omit or `0` to only log warnings (default).

## Build safety

| Variable | Purpose |
|----------|---------|
| `NN_BUILD_SAFE_MODE` | Build-only fallback for `next build`. When set to `1` / `true`, the app keeps core runtime behavior unchanged but trims non-critical sitemap fan-out during build: long-tail question-topic URLs, tools/detail URLs, locale-marketing sitemap slices, long-tail regional/exam/programmatic SEO expansions, and blog/localized-blog sitemap enrichment. Keep this as a **build-time** env in DigitalOcean App Platform. |

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
| `SENTRY_ENABLED` | Server/edge runtime Sentry enable flag. Also required before source map upload is allowed. |
| `NEXT_PUBLIC_SENTRY_ENABLED` | Optional client/browser enable flag. Defaults to `SENTRY_ENABLED` when omitted at build time. |
| `SENTRY_DSN` | Server/edge DSN (falls back to `NEXT_PUBLIC_SENTRY_DSN` if only one DSN is provided). |
| `NEXT_PUBLIC_SENTRY_DSN` | Browser DSN. Keep aligned with the same Sentry project when browser events are enabled. |
| `SENTRY_AUTH_TOKEN` | Build-time auth for source map uploads only. Not used for runtime event sending. |
| `SENTRY_ORG` | Build-time source map upload org. |
| `SENTRY_PROJECT` | Build-time source map upload project. |
| `SENTRY_ENVIRONMENT` | Server/edge Sentry environment override. |
| `NEXT_PUBLIC_SENTRY_ENVIRONMENT` | Optional browser environment override; defaults from `SENTRY_ENVIRONMENT` / platform env during build. |
| `SENTRY_RELEASE` | Release identifier for stack trace/source map resolution. Defaults to commit SHA envs when omitted. |
| `NEXT_PUBLIC_SENTRY_RELEASE` | Optional browser release override; defaults from server release envs during build. |
| `SENTRY_TRACES_SAMPLE_RATE` | Server/edge traces sample rate override (0..1). Keep conservative in production. |
| `NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE` | Browser traces sample rate override (0..1). Keep very low in production. |
| `SENTRY_PROFILES_SAMPLE_RATE` | Server profiling sample rate override. Default `0`. |
| `NEXT_PUBLIC_SENTRY_REPLAY_ENABLED` | Enables Session Replay. Default OFF. Leave unset unless intentionally rolling out replay. |
| `NEXT_PUBLIC_SENTRY_REPLAY_SESSION_SAMPLE_RATE` | Replay session sample rate override when replay is enabled. |
| `NEXT_PUBLIC_SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE` | Replay-on-error sample rate override when replay is enabled. |
| PostHog keys | See `src/lib/observability/posthog-server.ts` |

Source map uploads run only when **all** of the following are set at build time:

- `SENTRY_ENABLED=true`
- `SENTRY_AUTH_TOKEN`
- `SENTRY_ORG`
- `SENTRY_PROJECT`

If any of those are missing, runtime Sentry can still run, but source map upload is skipped safely.

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

## DigitalOcean App Platform (integration checklist)

Use **`nursenest-core`** as the app **source directory**. Align env with how Next evaluates them:

| Concern | Build-time (compile / `next.config` eval) | Runtime (`next start`) |
|--------|---------------------------------------------|---------------------------|
| `NEXT_PUBLIC_*` (PostHog, Sentry browser, Turnstile site key, `NEXT_PUBLIC_APP_URL`, …) | **Required** on the component that runs `npm run build` — values are inlined. | Same values unless you rebuild after changing them. |
| `next.config.ts` → `env` (`AUTH_TRUST_HOST`, `NEXT_PUBLIC_SENTRY_*`) | Evaluated when config loads during **build**. | Not re-read from disk for client bundle after deploy without rebuild. |
| `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` + `SENTRY_ENABLED=true` | Needed for **source map upload** during build. | Not used for sending events. |
| `RUN_HEAVY_BUILD_TASKS` | Set to `true` on the **build** job if the full programmatic redirect/rewrite graph must ship (default npm script uses `false` to save memory). | Does not add redirects at runtime. |
| `DATABASE_URL` | Only if a build step imports Prisma and queries (unusual); optional marketing home DB skips during `NEXT_PHASE=phase-production-build`. | **Required** for real homepage stats/blog and most APIs. |
| Stripe / Resend / Spaces / Inngest secrets | Usually not needed for compile. | **Required** on the web service. |

External dashboards: **Stripe** webhook → `https://<your-domain>/api/subscriptions/webhook` (must be a hostname with **valid TLS for that exact name** — production default in-repo is `https://www.nursenest.ca/...`; see `docs/INTEGRATIONS_RUNBOOK.md` § Billing); **Inngest** app sync URL → `https://<your-domain>/api/inngest`; **Resend** verified domain; **Spaces** CORS/keys; **Sentry** DSN + optional release auth token.

Full operator narrative: `docs/INTEGRATIONS_RUNBOOK.md`.

## Related files

- `src/instrumentation.ts` — runs DB validation + production env guard  
- `src/lib/db/env-bootstrap.ts` — `DATABASE_URL` tuning  
- `src/lib/env/public-app-origin.ts` — billing absolute URLs  
