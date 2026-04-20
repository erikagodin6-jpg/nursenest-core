# Integrations runbook — NurseNest Core

Single reference for **how each integration is wired**, **what to configure locally vs DigitalOcean (DO) App Platform**, and **how to verify it**. Production app source lives under `nursenest-core/` (set DO **source directory** to this folder).

**Related:** `environment-reference.md`, `SECRETS_AND_ENV.md`, `deploy-safety.md`, `OBJECT_STORAGE_STRATEGY.md`, `cron-pipelines.md`, repository root `docs/database-environment.md`.

**Convention:** `NEXT_PUBLIC_*` is inlined at **build**; set it on DO **build** env as well as runtime if your pipeline separates them. Server secrets are **runtime** only unless noted.

---

## 1. Core platform (Next.js, origins, build)

### What it does

Hosts the Next.js App Router app (`output: "standalone"`), serves marketing + `/app` learner shell + APIs. `next.config.ts` documents build memory, Turbopack root, and optional heavy redirect graphs.

### Where initialized

- `nursenest-core/next.config.ts` — images `remotePatterns`, optional `withSentryConfig`, `env` passthrough for `AUTH_TRUST_HOST` and Sentry public flags at config evaluation.
- `nursenest-core/src/instrumentation.ts` — Node/Edge boot hooks (Sentry server load, `registerNodeInstrumentation`).
- `nursenest-core/src/proxy.ts` — request proxy (auth, admin, API rate limits, marketing redirects); replaces legacy middleware.

### Required env vars

| Variable | Role |
|----------|------|
| `NEXT_PUBLIC_APP_URL` | Public origin (no path). **Production guard expects it.** Stripe return URLs, emails, absolute links (`public-app-origin`, SEO helpers). |
| `NODE_ENV` | `production` in deploy. |
| `PORT` | Set by DO / platform for `next start` (see `scripts/start-standalone.mjs`). |

### Local / Cursor

1. Copy `.env.example` → `.env.local`.
2. Set `NEXT_PUBLIC_APP_URL=http://localhost:3000` (or your dev port).
3. `npm run dev` from `nursenest-core/`.

### DigitalOcean

- **Source directory:** `nursenest-core`.
- **Build command:** use repo `package.json` / DO spec (often `npm run build` + post-build prune scripts — see `package.json` `build:deploy*`).
- **Runtime command:** `npm run start` (standalone Node).
- Mirror **`NEXT_PUBLIC_*` and any `next.config` `env` block values on the build environment** if DO only injects secrets at runtime; otherwise client bundles miss updates.

### Dashboard / outside repo

None (platform only).

### Webhooks

N/A at platform level.

### Test procedure

- `curl -sS -o /dev/null -w "%{http_code}" "$NEXT_PUBLIC_APP_URL/healthz"` (or `/api/healthz` per your routing).
- `npm run qa:verify:health` if configured in CI.

### Common failure modes

- **Wrong absolute URLs** in emails/Stripe: `NEXT_PUBLIC_APP_URL` missing or HTTP in prod.
- **Missing redirects** in prod: default `npm run build` sets `RUN_HEAVY_BUILD_TASKS=false` — full programmatic redirect/rewrite graph needs that flag **true during build** (see `next.config.ts` header comments).
- **Homepage public stats stuck at zero / no blog teaser:** ensure `DATABASE_URL` is set at **runtime** and do **not** set `MARKETING_HOME_SKIP_OPTIONAL_DB=true` unless degrading intentionally. (Optional DB is skipped automatically only while `NEXT_PHASE=phase-production-build` during `next build`.)

### Who depends on it

Entire app; billing, auth callbacks, SEO, emails.

---

## 2. Database (PostgreSQL + Prisma)

### What it does

Primary data store for users, lessons, subscriptions, progress, admin, blog, etc.

### Where initialized

- `src/lib/db/env-bootstrap.ts` — mutates `DATABASE_URL` / `DIRECT_URL` (SSL, pool limits, PgBouncer, statement timeout rules) **on import**; must run before `PrismaClient`.
- `src/lib/db.ts` — shared `PrismaClient` singleton.
- `src/lib/instrumentation/register-node.ts` — `validateProductionDatabaseEnv()`, `logDatabaseEnvOnce()`.

### Required env vars

| Variable | Role |
|----------|------|
| `DATABASE_URL` | **Required in prod.** Pooled app URL. |
| `DIRECT_URL` | Recommended on DO managed Postgres + pooler — direct port for `prisma migrate`. Legacy: `DATABASE_DIRECT_URL` → mapped to `DIRECT_URL`. |
| `PRISMA_USE_PGBOUNCER`, `PRISMA_CONNECTION_LIMIT`, `PRISMA_POOL_TIMEOUT`, `PRISMA_STATEMENT_TIMEOUT_MS`, `PRISMA_CONNECT_TIMEOUT_SEC` | Optional tuning (see `env-bootstrap.ts`). |

Do **not** use `PROD_DATABASE_URL` (ignored).

### Local / Cursor

1. Local Postgres or cloud dev DB; set `DATABASE_URL` in `.env.local`.
2. `npm run db:generate` (or project’s Prisma generate script).
3. `npx prisma migrate deploy` (or `migrate dev`) against your DB.

### DigitalOcean

- Create **DO Managed PostgreSQL** (or compatible).
- Set `DATABASE_URL` to pooler URI if used; set `DIRECT_URL` to non-pooler URI for migrations.
- Run migrations from CI or a one-off job with network access to the DB — **not** necessarily during every app build.

### Dashboard / outside repo

DO database control panel: users, firewall, connection pools.

### Webhooks

N/A.

### Test procedure

- App boot: no Prisma panic (`env-bootstrap` assertion).
- `/api/health` or DB-touching admin page after login.
- `npx prisma migrate status`.

### Common failure modes

- **SSL / pooler:** DO hosts often need `sslmode=require` and `pgbouncer=true` + correct `DIRECT_URL` for migrate.
- **Build-time import:** If CI runs `next build` with code paths that import `@/lib/db`, `DATABASE_URL` must exist for that job or those paths must stay unused during build.

### Who depends on it

Nearly all server routes, auth, Stripe reconciliation, lessons, CAT, dashboard, sitemap enrichment, admin.

---

## 3. Authentication (Auth.js / NextAuth)

### What it does

Credentials (and related) sessions for learners and staff; JWT/session cookies; `/app` gating via `src/proxy.ts` + `src/lib/auth-middleware.ts`.

### Where initialized

- `src/lib/auth.ts` — NextAuth config, providers, callbacks (imports `prisma`).
- `src/app/api/auth/[...nextauth]/route.ts` — Auth.js HTTP handler.
- `src/lib/auth-trust-env.ts` — side-effect import normalizes empty `AUTH_URL` / default `AUTH_TRUST_HOST` (no `process.env.foo =` in hot paths that break webpack — uses `globalThis` env).
- `next.config.ts` `env.AUTH_TRUST_HOST` — baked default for proxied hosts.

### Required env vars

| Variable | Role |
|----------|------|
| `AUTH_SECRET` or `NEXTAUTH_SECRET` | **Required in prod** — signing. |
| `AUTH_URL` / `NEXTAUTH_URL` | **Strongly recommended** — public origin for callbacks (no path). |

### Local / Cursor

Set `AUTH_SECRET` (long random) and `AUTH_URL=http://localhost:3000` in `.env.local`.

### DigitalOcean

Set secrets on the **web component** runtime. Ensure proxy/load balancer forwards **Host** / HTTPS so Auth.js trusts the host (`AUTH_TRUST_HOST` default helps).

### Dashboard / outside repo

None unless you add OAuth providers later.

### Webhooks

None for core Auth.js.

### Test procedure

- Sign in/out on `/login`, open `/app` as authenticated user.
- Staff: admin route after role is DB-backed (not JWT-only).

### Common failure modes

- **`UntrustedHost`:** fix `AUTH_URL` / trust host / reverse proxy headers.
- **Session missing on `/app`:** compare cookie domain, `NEXT_PUBLIC_APP_URL`, and proxy.

### Who depends on it

All of `/app/*`, admin staff sessions, paywall/session-aware APIs.

---

## 4. Billing (Stripe)

### What it does

Checkout, customer portal, webhooks → subscription state in DB → entitlements (`get-user-access` and related).

### Where initialized

- `src/lib/stripe/stripe-client.ts` — lazy SDK with `STRIPE_SECRET_KEY`.
- `src/app/api/subscriptions/checkout/route.ts` — checkout creation.
- `src/app/api/subscriptions/webhook/route.ts` — **Stripe webhook endpoint**.
- `src/lib/stripe/pricing-map.ts` — env-driven price IDs; startup logs in `register-node.ts`.
- `src/app/api/cron/stripe-reconcile/route.ts` — optional reconciliation cron.

### Required env vars

| Variable | Role |
|----------|------|
| `STRIPE_SECRET_KEY` | **Required** for live billing. |
| `STRIPE_WEBHOOK_SECRET` | **Required** for webhook signature verification (`whsec_…`). |
| `NEXT_PUBLIC_APP_URL` | Success/cancel/portal return URLs. |
| `STRIPE_PRICE_*` | Many keys — catalog in `pricing-map.ts` / `regional-pricing-map.ts` (see `.env.example` comments). |

There is **no** `STRIPE_PUBLISHABLE_KEY` in this codebase (server-driven checkout).

### Local / Cursor

Use **Stripe test mode** keys and CLI forwarding for webhooks (recommended).

### DigitalOcean

Runtime secrets for all `STRIPE_*` and `NEXT_PUBLIC_APP_URL`. Ensure outbound HTTPS to `api.stripe.com`.

### Dashboard / outside repo

- **Stripe Dashboard:** Products, Prices, Customers, **Developers → Webhooks**.
- Point webhook to: `https://<your-domain>/api/subscriptions/webhook`.
- Events: subscribe to what `route.ts` handles (subscription lifecycle — align with implementation).

### Webhooks

| Endpoint | Secret env |
|----------|------------|
| `POST /api/subscriptions/webhook` | `STRIPE_WEBHOOK_SECRET` |

**Stripe CLI (local):** `stripe listen --forward-to localhost:3000/api/subscriptions/webhook` and set the printed signing secret in `.env.local`.

### Test procedure

- Test checkout in Stripe test mode; confirm DB subscription row updates after webhook.
- Dashboard → **Webhook deliveries** for failures (4xx/5xx).

### Common failure modes

- **400 on webhook:** wrong `STRIPE_WEBHOOK_SECRET` or body not raw.
- **Price misconfig:** missing `STRIPE_PRICE_*` → checkout errors or startup warnings in `pricing-map` logs.

### Who depends on it

Paywall, `/app` entitlement checks, admin billing views, CAT/lesson access.

---

## 5. Email (Resend)

### What it does

Transactional email (password reset, retention/welcome paths that send mail).

### Where initialized

- `src/lib/email/resend-transactional.ts` — API client using `RESEND_API_KEY`.
- `src/lib/send-password-reset-email.ts` — password reset flow checks key presence.
- Inngest step `sendWelcomeEmailIfNeeded` → ultimately email stack when configured.

### Required env vars

| Variable | Role |
|----------|------|
| `RESEND_API_KEY` | Send mail; if unset, flows that need send may no-op or error per call site. |
| `PASSWORD_RESET_EMAIL_FROM` / `RETENTION_EMAIL_FROM` | Optional From headers (see `.env.example`). |
| `AUTH_URL` / `NEXT_PUBLIC_APP_URL` | Links inside mail bodies (`app-origin` helpers). |

### Local / Cursor

Optional for pure UI dev. For E2E flows: Resend test key or mock.

### DigitalOcean

Set `RESEND_API_KEY` on runtime component.

### Dashboard / outside repo

- **Resend:** verify **sending domain**, DNS (SPF/DKIM), API keys.
- Keep From domain aligned with verified domain.

### Webhooks

Resend inbound webhooks are **not** required for basic transactional send; use Resend dashboard for delivery/bounce analytics.

### Test procedure

- Trigger forgot-password; confirm message in Resend logs / inbox.
- If welcome email wired through Inngest, complete signup path and check Inngest run + email.

### Common failure modes

- **Domain not verified** → 403 / rejected sends.
- **Missing API key** → reset email path fails or degrades per implementation.

### Who depends on it

Auth password reset, retention/onboarding email paths.

---

## 6. Object storage (DigitalOcean Spaces, S3-compatible)

### What it does

Public marketing/admin uploads (images, assets); CDN-style URLs. Server uses AWS SDK v3–compatible client.

### Where initialized

- `src/lib/storage/spaces-config.ts`, `spaces-s3-client.ts`, `spaces-upload.ts`.
- Admin routes: e.g. `src/app/api/admin/storage/upload/route.ts`, `api/admin/media/upload/route.ts`.
- Marketing asset proxy: `src/app/api/marketing-assets/[...path]/route.ts` (optional allowlist).

### Required env vars

| Variable | Role |
|----------|------|
| `SPACES_KEY`, `SPACES_SECRET` | API keys (**server only**). |
| `SPACES_REGION`, `SPACES_BUCKET` | Defaults per `spaces-config` (e.g. `tor1`). |
| `SPACES_ENDPOINT` | Optional custom endpoint. |
| `NEXT_PUBLIC_MARKETING_CDN_BASE`, `NEXT_PUBLIC_MARKETING_USE_SPACES_PROXY*` | Client-visible asset base / proxy toggles (see `marketing-resolve-image-url.ts`, `spaces-proxy-env.ts`). |

### Local / Cursor

Optional: omit keys to skip uploads; marketing may use local/public fallbacks per code paths.

### DigitalOcean

- Create **Spaces** bucket + keys; restrict CORS and ACLs per `OBJECT_STORAGE_STRATEGY.md` / `STORAGE_POLICY.md`.
- Set env on runtime (and any build step that validates asset catalogs).

### Dashboard / outside repo

- **DO Spaces:** bucket, ACL/CORS, CDN endpoint, **Spaces access keys**.

### Webhooks

None for Spaces in typical setup.

### Test procedure

- Admin upload small image; confirm object appears in bucket and URL loads.
- Hit `/api/marketing-assets/...` if proxy mode enabled.

### Common failure modes

- **403 / signature:** wrong region/endpoint or clock skew.
- **Next/Image blocked:** add host to `next.config.ts` `images.remotePatterns` (already includes common DO Spaces hostnames).

### Who depends on it

Marketing pages, admin media, course/marketing imagery.

---

## 7. Captcha (Cloudflare Turnstile)

### What it does

Bot resistance on signup (and related) when **both** site key and server secret are set.

### Where initialized

- `src/lib/captcha/verify-turnstile.ts` — server verify; **fail-open if secret unset**.
- `src/components/auth/turnstile-signup.tsx`, `signup-form.tsx` — `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.

### Required env vars

| Variable | Role |
|----------|------|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Widget (public). |
| `TURNSTILE_SECRET_KEY` | **Server** verify; if unset, `verifyTurnstileToken` returns true (captcha off). |

### Local / Cursor

Optional. For realistic signup testing, use Turnstile **test keys** from Cloudflare docs.

### DigitalOcean

Set both env vars on runtime; rebuild if you change **only** the public key (client bundle).

### Dashboard / outside repo

- **Cloudflare Turnstile:** create site, allow domains (`localhost` for dev), copy site + secret keys.

### Webhooks

N/A.

### Test procedure

- Signup with keys set: fail without token; pass with token.
- With secret unset: signup should still work (fail-open).

### Common failure modes

- **Domain mismatch** in Turnstile dashboard → widget error.
- **Secret set, site key missing** → `isTurnstileEnforced()` false per implementation.

### Who depends on it

Public signup UX and abuse posture.

---

## 8. Background jobs (Inngest)

### What it does

Durable/async steps (e.g. welcome email pipeline) via Inngest Cloud hitting your **`/api/inngest`** serve handler.

### Where initialized

- `src/lib/server/inngest.ts` — `Inngest` client + function definitions + `triggerWelcomeEmailRequested`.
- `src/app/api/inngest/route.ts` — `serve({ GET, POST, PUT })` for Inngest.
- `src/app/api/signup/route.ts` — may emit `triggerWelcomeEmailRequested`.

### Required env vars

Standard Inngest deploy keys (names may vary by Inngest version — **not hard-coded** in repo). Typical:

| Variable | Role |
|----------|------|
| `INNGEST_EVENT_KEY` | Send events from app to Inngest Cloud. |
| `INNGEST_SIGNING_KEY` | Verify/sync between Inngest and your app (see current Inngest docs). |

### Local / Cursor

Run **Inngest dev server** (`npx inngest-cli@latest dev`) pointing at your app, or rely on cloud dev app URL.

### DigitalOcean

- Runtime env with keys above.
- **App URL** registered in Inngest dashboard must reach `https://<domain>/api/inngest`.

### Dashboard / outside repo

- **Inngest Cloud:** app, sync URL, signing keys, function list, run logs.

### Webhooks

Inngest calls **your** `/api/inngest` (not a Stripe-style secret in Dashboard “webhooks” menu — use Inngest’s sync model).

### Test procedure

- After deploy: Inngest UI shows synced functions.
- Trigger signup → function run succeeds; email step behaves per Resend config.

### Common failure modes

- **401/404 on `/api/inngest`:** wrong keys or URL not synced.
- **Functions not registered:** build/deploy didn’t include route or env missing.

### Who depends on it

Signup → welcome email orchestration (extensible for more functions).

---

## 9. Caching & rate limits (Upstash Redis)

### What it does

Distributed Redis for rate limiting and related features when URL/token present; otherwise in-memory / DB fallbacks (may not share state across instances).

### Where initialized

- `src/lib/server/redis.ts` — `@upstash/redis` REST client from env.

### Required env vars

| Variable | Role |
|----------|------|
| `UPSTASH_REDIS_REST_URL` | REST API URL. |
| `UPSTASH_REDIS_REST_TOKEN` | Token. |

Optional feature flags: `NN_ENABLE_RATE_LIMITING`, `RATE_LIMIT_DISTRIBUTED`, `LOGIN_LOCKOUT_DISTRIBUTED` (see `environment-reference` / `rate-limit.ts`).

### Local / Cursor

Omit both → local fallbacks (fine for single dev server).

### DigitalOcean

Create **Upstash** Redis; paste REST URL + token into runtime env. **Required for multi-instance** consistent limits.

### Dashboard / outside repo

- **Upstash:** database, token rotation, regions.

### Webhooks

N/A.

### Test procedure

- Hit rate-limited API until 429; repeat from another IP/instance if testing distributed behavior.

### Common failure modes

- **429s too aggressive / not shared:** Redis env missing on one instance.
- **Connection errors:** wrong region or revoked token.

### Who depends on it

`src/lib/server/rate-limit.ts`, login lockout paths, API protection.

---

## 10. Observability

### 10a. Sentry

#### What it does

Server, edge, and optional browser error reporting; optional session replay; build-time source maps when enabled.

#### Where initialized

- `src/instrumentation.ts` — loads `sentry.server.config` / `sentry.edge.config` when `isSentryServerRuntimeEnabled()`.
- `src/lib/observability/sentry-flags.ts`, `sentry-dsn.ts` — enablement rules.
- `next.config.ts` — `withSentryConfig` when `SENTRY_ENABLED=true` **and** source map tokens present.

#### Required env vars

| Variable | Role |
|----------|------|
| `SENTRY_ENABLED` | Server on (`true`). |
| `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN` | DSNs (see `sentry-dsn.ts`). |
| `NEXT_PUBLIC_SENTRY_ENABLED` | Client on (optional; build defaults in `next.config` `env`). |
| `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` | **Build-time only** — source map upload. |
| `SENTRY_RELEASE` / `NEXT_PUBLIC_SENTRY_RELEASE`, environments, sample rates, replay flags | Optional tuning (see `environment-reference.md`). |

Default `npm run build` sets `SENTRY_ENABLED=false` to avoid requiring Sentry during compile; **production image builds** that want maps + runtime Sentry should override.

#### Local / Cursor

Optional DSN in `.env.local`; keep sample rates low.

#### DigitalOcean

- **Build:** enable Sentry + org/project/token if uploading maps.
- **Runtime:** DSN + `SENTRY_ENABLED=true`.

#### Dashboard / outside repo

**Sentry.io:** project, DSN, auth token for releases, alert rules.

#### Webhooks

Optional Sentry **issue alerts** → Slack/PagerDuty via Sentry integrations (outside repo).

#### Test procedure

Throw test error in dev-only route; confirm event in Sentry.

#### Common failure modes

- **No source maps:** token/org/project missing at build.
- **Double client config:** `NEXT_PUBLIC_*` not set on build → client silent.

#### Who depends on it

On-call, regression detection across learner + admin surfaces.

---

### 10b. PostHog

#### What it does

Product analytics (browser + optional server capture).

#### Where initialized

- `src/lib/observability/posthog-client.ts` — browser `posthog-js` (lazy).
- `src/components/providers/analytics-provider.tsx` — initializes client, pageviews.
- `src/lib/observability/posthog-server.ts` — server capture.
- `src/lib/observability/posthog-hogql-query.ts` — **personal API key** for admin/HogQL (never client).

#### Required env vars

| Variable | Role |
|----------|------|
| `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` | Browser (host defaults to US cloud). |
| `POSTHOG_KEY`, `POSTHOG_HOST` | Server (key may fall back to public key). |
| `POSTHOG_PERSONAL_API_KEY`, `POSTHOG_PROJECT_ID` | Admin-only analytics queries. |

#### Local / Cursor

Omit keys → analytics no-op (safe).

#### DigitalOcean

Set keys; **rebuild** when changing `NEXT_PUBLIC_*`.

#### Dashboard / outside repo

**PostHog:** project, API keys, reverse proxy (optional), cohorts.

#### Webhooks

Optional PostHog → destinations; not required for core capture.

#### Test procedure

- Browse with keys set; see live events in PostHog **Activity**.

#### Common failure modes

- **Ad blockers** → missing client events (expected).
- **Wrong project key** in server vs client.

#### Who depends on it

Growth, funnel analysis, optional server-side funnel events.

---

## 11. AI providers (OpenAI, Gemini)

### What it does

Optional admin generation, study coach, and related features when keys and feature flags allow.

### Where initialized

- `src/lib/ai/openai-env.ts` — resolves OpenAI key/base URL/model envs.
- Various `src/app/api/admin/**` and learner AI routes (grep `OPENAI_API_KEY`, `GEMINI_API_KEY`).

### Required env vars

| Variable | Role |
|----------|------|
| `OPENAI_API_KEY` or `AI_INTEGRATIONS_OPENAI_API_KEY` | OpenAI. |
| `OPENAI_BASE_URL` / `AI_INTEGRATIONS_OPENAI_BASE_URL` | Optional non-default API base. |
| `AI_OPENAI_MODEL`, `AI_ADMIN_MODEL`, `AI_ADMIN_GENERATION_ENABLED`, etc. | Feature gating (see `.env.example`). |
| `GEMINI_API_KEY`, `GEMINI_MODEL` | Google Gemini where implemented. |

### Local / Cursor

Developer keys in `.env.local`; never commit.

### DigitalOcean

Runtime secrets on components that run admin/AI routes.

### Dashboard / outside repo

- **OpenAI / Google AI Studio:** keys, usage limits, billing alerts.

### Webhooks

None standard.

### Test procedure

- Hit specific admin “generate” action with key set; expect 200 + structured response.
- With key unset: expect controlled 4xx/disabled message per route.

### Common failure modes

- **429 / quota** from provider.
- **Model string invalid** for account tier.

### Who depends on it

Admin content tools, optional learner AI surfaces.

---

## 12. Internal cron & scheduled jobs

### What it does

HTTP cron endpoints for blog publish batches, Stripe reconcile, monitoring probes, etc.

### Where initialized

- Routes under `src/app/api/cron/*` (e.g. `stripe-reconcile`, `blog-publish`, `jobs`, `content-completion`, `monitoring-synthetic`, `blog-batch-schedule`).
- Shared secret enforcement: `CRON_SECRET` + `Authorization: Bearer …` (see `enforce-cron-secret` patterns in codebase).

### Required env vars

| Variable | Role |
|----------|------|
| `CRON_SECRET` | Bearer secret for cron POSTs. |
| `NURSE_NEST_ENFORCE_CRON_SECRET` | Stricter behavior when set (see docs). |
| `STRIPE_RECONCILE_CRON_APPLY` | Reconcile dry-run vs apply (see cron route). |

### Local / Cursor

Call cron routes manually with `curl` + `Authorization: Bearer $CRON_SECRET`.

### DigitalOcean

- **App Platform Scheduled Jobs** or external scheduler (cron-job.org, etc.) → `POST https://<domain>/api/cron/...`
- Store `CRON_SECRET` in DO env.

### Dashboard / outside repo

DO **Scheduled Jobs** UI or third-party cron.

### Webhooks

N/A (outbound HTTP **to** your app).

### Test procedure

- `curl -X POST -H "Authorization: Bearer $CRON_SECRET" https://<host>/api/cron/stripe-reconcile` (read route for method/body requirements).

### Common failure modes

- **401:** wrong secret or header name.
- **Timeout:** job longer than platform max — split work or increase timeout if supported.

### Who depends on it

Blog automation, billing consistency, ops probes.

---

## 13. Marketing, SEO, i18n, CDN (cross-cutting)

### What it does

Shard-based i18n, canonical URLs, sitemaps, robots, optional marketing CDN / Spaces proxy, homepage/blog data paths.

### Where initialized

- `src/lib/seo/site-origin.ts` — `MARKETING_SITE_ORIGIN` from `NEXT_PUBLIC_APP_URL` (see build-time note in `environment-reference.md`).
- `src/lib/seo/canonical-site.ts` — hardcoded production canonical + `resolveCanonicalSiteOrigin()`.
- `src/app/sitemap.xml/route.ts` — dynamic sitemap (DB-backed sections).
- `src/app/robots.txt/route.ts` — mostly static robots body.
- `src/lib/marketing-i18n/*` — shard loading; optional CDN base envs in `.env.example`.

### Required env vars

| Variable | Role |
|----------|------|
| `NEXT_PUBLIC_APP_URL` | Absolute marketing URLs where used. |
| `MARKETING_I18N_CDN_BASE`, `NEXT_PUBLIC_MARKETING_CDN_BASE` | Optional CDN for shards/assets. |
| `MARKETING_HOME_SKIP_OPTIONAL_DB` | `true` = force-skip optional home DB (stats/blog); `false` = always attempt DB (including static gen — needs DB). Unset = skip only during `phase-production-build` (see `(marketing)/(default)/page.tsx`). |
| `NN_BUILD_SAFE_MODE` | Build-only sitemap trim (see `environment-reference.md`). |
| SEO validation toggles (`SEO_HTTP_VALIDATE_*`) | Dev/CI only — see `seo-http-emit-validation.ts`. |

### Local / Cursor

Default local JSON shards under `public/i18n`; no CDN required.

### DigitalOcean

Set public URL + optional CDN bases on **build and runtime** as needed.

### Dashboard / outside repo

CDN/DNS in front of DO app (optional).

### Webhooks

N/A.

### Test procedure

- Fetch `/sitemap.xml`, `/robots.txt`; validate `Sitemap:` line matches policy.
- Switch locale; confirm shards load without 404.

### Common failure modes

- **Stale locale JSON:** CDN cache vs deploy order.
- **Wrong canonical host** in metadata if `NEXT_PUBLIC_APP_URL` wrong at build.

### Who depends on it

All marketing routes, SEO, hreflang, blog listing metadata.

---

## Quick dependency map (by surface)

| Surface | Integrations |
|---------|----------------|
| **Learner `/app`** | Auth, Postgres, Stripe entitlements, Redis (limits), Sentry, PostHog, optional AI |
| **Admin** | Auth + DB staff roles, Stripe (read/config), Spaces uploads, AI keys, PostHog HogQL (optional) |
| **Marketing / SEO** | Postgres (dynamic pages), i18n files/CDN, Spaces/CDN images, Sentry/PostHog |
| **APIs** | Same as above + Turnstile (signup), Inngest endpoint, cron secret, webhooks |

---

## Revision

Update this file when adding a new third-party SDK or env var class; keep `.env.example` and `environment-reference.md` in sync.
