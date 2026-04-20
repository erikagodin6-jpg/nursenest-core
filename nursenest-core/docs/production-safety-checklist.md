# Production safety checklist

Use this document for **every production or production-like** promotion. It complements **[`deploy-safety.md`](./deploy-safety.md)** (sequence, health, rollback), **[`release-deploy-checklist.md`](./release-deploy-checklist.md)** (promotion), **[`production-entitlement-validation.md`](./production-entitlement-validation.md)** (billing/access), **[`deployment-security-checklist.md`](./deployment-security-checklist.md)** (security), and **[`INTEGRATIONS_RUNBOOK.md`](./INTEGRATIONS_RUNBOOK.md)** (Stripe, email, observability).

---

## UI visibility rules

- [ ] **Marketing shell**: Header, logo (image or wordmark), primary nav, and hero are **visible** on first paint — not `opacity: 0` / clipped in a way that looks blank (see E2E: `tests/e2e/public/homepage-first-paint.spec.ts`, `tests/e2e/public/site-core-ux-never-broken.spec.ts`).
- [ ] **Critical controls**: Header, nav, and footer labels do **not** clip, wrap mid-label, or hide primary CTAs on **mobile (≤390px)** and desktop (per `.cursor/rules/nursenest-production-governance.mdc`).
- [ ] **Learner `/app`**: `[data-testid="learner-shell"]` and main landmark (`#nn-learner-main` / `[data-nn-learner-main]` / `.nn-learner-app main`) render for authenticated users; paywall/guest surfaces show explicit **Subscription required** + `/pricing` — not an empty page.
- [ ] **Semantic / theme**: Product UI uses **CSS variables** / semantic tokens — avoid hardcoded hex-only surfaces for learner dashboards (see `src/app/semantic-status-tokens.css`, governance rules).
- [ ] **No blank “success” states**: Error boundaries and degraded modes show **copy + retry** where applicable (learner shell, marketing failsafe layouts).

---

## Integration safety rules

- [ ] **Auth**: Premium and staff decisions use **server-side** `getUserAccess` / `requireSubscriberSession` / DB role — **not** JWT alone (see `production-entitlement-validation.md`).
- [ ] **Stripe**: Webhooks verified with **`STRIPE_WEBHOOK_SECRET`**; checkout uses **server-mapped** price IDs only; billing keys present where checkout is enabled (`INTEGRATIONS_RUNBOOK.md`).
- [ ] **Email (Resend)**: Transactional sends fail **loudly** in logs when misconfigured; password reset / verification paths match runbook; production has **`RESEND_API_KEY`** if email is required.
- [ ] **Analytics (PostHog)**: Client init is **non-blocking**; absence of `NEXT_PUBLIC_POSTHOG_KEY` does not break pages.
- [ ] **Sentry**: Server/client flags consistent; **`next.config.ts` `env`** for `NEXT_PUBLIC_SENTRY_*` is aligned between **build job** and **runtime** so release/environment do not drift.
- [ ] **Captcha (Turnstile)**: When **both** site key and secret are set, signup is enforced; when unset, verify path is **fail-open** per code policy — confirm that matches product intent for the environment.
- [ ] **i18n**: Marketing/learner bundles load or **fail open** (fallback English / minimal shell); CDN optional reads do not block shell render (`load-marketing-messages` timeouts / merges).
- [ ] **Storage / media**: Image remote patterns and CDN URLs match deployment; no raw `gs://` in product UI.
- [ ] **Rate limits**: Postgres-backed limits in production are **operational**; understand **fail-closed** behavior when the limit store is unavailable (`rate-limit-unified.ts` — expect 429s, not silent bypass).

---

## Deployment checks

- [ ] **Precheck**: `npm run deploy:precheck` (or CI **Verify Build** equivalent) — Prisma client, typecheck, **`next build`** green on the same Node/tooling as production.
- [ ] **Migrations**: `prisma migrate deploy` (or managed workflow) against the **same** `DATABASE_URL` the app will use; no drift between migrate and run.
- [ ] **Health routing**: Platform hits **`/readyz`** (routing) and **`/healthz`** (liveness) as configured (see `deploy-safety.md`, `.do/app-nursenest-core-next.yaml` if applicable).
- [ ] **Traffic**: No promotion to 100% until **liveness** passes; rollback path documented (previous App Platform deployment or droplet git + redeploy).
- [ ] **Cron / jobs**: `CRON_SECRET` and scheduled routes documented (`docs/cron-pipelines.md`); Stripe reconcile and other crons reachable only with secret.
- [ ] **Build env parity**: `AUTH_TRUST_HOST`, `NEXT_PUBLIC_SENTRY_*`, and other **`next.config` `env` inlines** match between **build** and **run** environments.

---

## Environment checks

- [ ] **`DATABASE_URL`**: Set, `postgresql` scheme, includes sensible **`connect_timeout`** / **`statement_timeout`** in options where policy requires (see `validate-production-db-env`).
- [ ] **`AUTH_SECRET` or `NEXTAUTH_SECRET`**: Set in production; **`AUTH_URL` / `NEXTAUTH_URL`** origin-only (no `/login` path).
- [ ] **Stripe**: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and price env keys for every **live** plan surface; live webhook endpoint URL is **`https://www.nursenest.ca/api/subscriptions/webhook`** and `STRIPE_WEBHOOK_SECRET` matches that endpoint’s signing secret (`docs/stripe-webhook-production-operations.md`).
- [ ] **Email**: `RESEND_API_KEY` and from-addresses if transactional email is required.
- [ ] **Redis / optional**: If used for rate limits or caches, URL and TLS match runtime; login rate limit **fails open** on Redis error — monitor anyway.
- [ ] **Public vs secret**: No secrets in `NEXT_PUBLIC_*`; no secrets committed to repo; `.env.example` documents non-secret defaults only.
- [ ] **Strict startup (optional)**: `NN_STRICT_PRODUCTION_ENV=1` on canary/staging if you want process exit on critical env gaps (`production-env-guard.ts`).

---

## Pre-deploy verification steps

- [ ] **`npm run validate:release`** (or the subset your team uses for this train) — typecheck, content/programmatic/i18n validations, release-safety tests.
- [ ] **Paywall / API policy tests**: e.g. `npm run test:paywall-surface-policy` (or equivalent) so subscriber gates and cache semantics for `/app` stay enforced.
- [ ] **Internal / SEO**: Marketing hero/nav validation scripts if this release touched marketing (`validate:marketing-hero-nav`, programmatic SEO guards).
- [ ] **Staging smoke**: Anonymous homepage + nav + pricing; **paid** session: `/app` + lessons hub; **free** session: paywall on `/app/lessons` (see `production-entitlement-validation.md`, Playwright paid/free projects when creds exist).
- [ ] **Stripe test mode**: If using test keys on staging, confirm **no** live keys leak into staging UI copy or webhooks.

---

## Post-deploy smoke tests

- [ ] **HTTP / readiness**: `npm run qa:verify:health` with `BASE_URL` / `ORIGIN_BASE_URL` pointing at production (and optionally `VERIFY_READINESS=1`, `VERIFY_CANONICAL_HOME=1` per `scripts/verify-deploy-health.mjs`).
- [ ] **Full release script (if used)**: `npm run qa:verify:production` or `qa:verify:production:core` per `package.json` / `release-verification.md`.
- [ ] **Anonymous**: `/` loads; header + hero visible; **Pricing** and **Login** links work; no console **errors** on first load (smoke helpers / browser once).
- [ ] **Authenticated paid** (test account): `/app` dashboard shell; `/app/lessons` shows lesson cards; **no** “Subscription required” paywall; `GET /api/questions` returns **200** (not 401/403) when session present.
- [ ] **Authenticated free** (test account): `/app/lessons` shows **Subscription required** + link to **`/pricing`**; question bank paywall copy present.
- [ ] **Checkout path** (staging or prod test mode): success URL triggers **`GET /api/auth/sync-session`** then session refresh — entitlement in DB matches UI after webhook (see entitlement doc).
- [ ] **Webhooks**: Stripe dashboard shows **2xx** for recent events; app logs show no spike in `webhook_failed` / `claim_failed`.
- [ ] **Admin**: Staff-only routes still **403/redirect** for learners; staff login still works (server RBAC unchanged).

---

## Sign-off

| Role | Name | Date | Notes |
|------|------|------|-------|
| Deployer | | | |
| Reviewer (optional) | | | |

---

## See also

- [`AGENTS.md`](../AGENTS.md) — repo-wide safety rules for agents and humans.
- [`docs/RELEASE_QA.md`](./RELEASE_QA.md) — QA layers and Playwright projects.
- [`docs/environment-reference.md`](./environment-reference.md) — env matrix and DO notes (if present in tree).
