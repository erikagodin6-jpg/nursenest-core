# Release verification (production-safe)

How to confirm the live site works for real users **before** and **after** deployment. This wraps existing Playwright smoke specs and health checks; it does not replace the full **[`RELEASE_QA.md`](./RELEASE_QA.md)** release gate for pre-promote builds.

---

## 1. Critical user journeys

| Journey | Guest | Free | Paid | Admin | How we verify |
|--------|-------|------|------|-------|----------------|
| Homepage logged out | ✓ | — | — | — | `smoke/guest-homepage`, post-deploy home |
| Homepage logged in | — | — | ✓ | — | `smoke/logged-in-homepage-nav` |
| Signup + auto-login | — | — | — | — | `smoke/auth-signup-auto-login` (needs `QA_SIGNUP_EMAIL_DOMAIN`) |
| Login | — | — | ✓ | — | `smoke/auth-login` |
| Logout | — | — | ✓ | — | `smoke/auth-logout` |
| Forgot password | ✓ | — | — | — | `smoke/smoke-forgot-password` |
| Pricing | ✓ | — | — | — | `smoke/smoke-checkout-path`, `qa:pre-deploy:public` |
| Checkout path (UI only, no Stripe charge) | ✓ | — | — | — | `smoke/smoke-checkout-path` |
| Paid access (lessons / questions) | — | — | ✓ | — | `smoke/paid-user-access` |
| Free access (gates / preview) | — | ✓ | — | — | `smoke/free-user-access` |
| Lessons / questions (deeper) | — | — | ✓ | — | Covered by `paid-user-access` in the core bundle |
| Mobile marketing nav | ✓ | — | — | — | `smoke/smoke-mobile-nav` |
| Admin login + dashboard | — | — | — | ✓ | `smoke/admin-dashboard` (needs `E2E_ADMIN_*`) |

**QA account env vars** (see `tests/e2e/helpers/smoke-credentials.ts`, `admin-e2e-credentials.ts`):

| Role | Variables |
|------|-----------|
| Guest | None (anonymous) |
| Free | `QA_FREE_EMAIL` / `QA_FREE_PASSWORD` (or `E2E_FREE_*`) |
| Paid | `QA_PAID_EMAIL` / `QA_PAID_PASSWORD` (or `E2E_PAID_*` / `PLAYWRIGHT_TEST_*`) |
| Admin | `E2E_ADMIN_EMAIL` / `E2E_ADMIN_PASSWORD` |
| Signup flow | `QA_SIGNUP_EMAIL_DOMAIN` (catch-all domain allowed by app policy) |

Skipped tests (missing creds) are **expected** in CI or minimal envs; they are not false positives.

---

## 2. Commands

| Command | When | What |
|---------|------|------|
| `npm run qa:verify:production` | After deploy (or against staging) | **Health + home** (`qa:post-deploy-smoke`), then **core journey** bundle (`playwright.verify-production.config.ts`). Requires `BASE_URL` and `PLAYWRIGHT_SKIP_WEB_SERVER=1` (set by script). |
| `npm run qa:verify:production:core` | Core journeys only (no duplicate health/home) | Same Playwright config as step 2 above; set `BASE_URL` yourself. |
| `npm run qa:post-deploy-smoke` | Minimal prod ping | `/api/health`, `/api/health/ready`, marketing home. |
| `npm run qa:smoke` | **Minimal** — Guest / Free / Paid / Admin (`tests/e2e/smoke-production`) | `playwright.smoke.config.ts` via `scripts/run-smoke.mjs` |
| `npm run qa:smoke:extended` | Legacy broad smoke (localized, extra auth specs) | `playwright.smoke-extended.config.ts` |
| `npm run qa:release-gate` | **Before** promote to production | See [`RELEASE_QA.md`](./RELEASE_QA.md). |

**Example (production):**

```bash
cd nursenest-core
export BASE_URL="https://www.nursenest.ca"
# Optional: paid/free/admin/signup — load from .env.playwright.local or export
npm run qa:verify:production
```

The script exits **non-zero** if any step fails.

---

## 3. Monitoring / alert checklist

Use your log/metrics stack (e.g. PostHog, Sentry, host dashboards, DB alerts). Watch for:

| Signal | Why |
|--------|-----|
| Login / signup error rate spikes | Auth regression or rate limits |
| `POST /api/subscriptions/checkout` failures | Stripe, env keys, or entitlement mismatch |
| HTTP **5xx** rate / route | Deploy or dependency breakage |
| p95 latency on `/app/*`, `/api/*` | Performance regressions |
| Failed client `fetch` / API errors in RUM | Broken entitlements or CORS |
| `/api/health/ready` **503** | DB or migration issues |
| Webhook / payment processor errors | Billing integrity |

Structured server logs already exist for many paths; align alerts with `docs/fallback-monitoring.md` where relevant.

---

## 4. Related docs

- **[`RELEASE_QA.md`](./RELEASE_QA.md)** — release gate, paid projects, health semantics.
- **[`release-deploy-checklist.md`](./release-deploy-checklist.md)** — human checklist before/after deploy.
- **[`release-safety-checks.md`](./release-safety-checks.md)** — static validation (`validate:release`).
