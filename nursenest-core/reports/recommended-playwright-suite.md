# Recommended Playwright suite — production QA coverage plan (audit only)

Maps **test types** to **existing configs / npm scripts** where possible. Extend with new specs only after this plan is reviewed — **no new files** in this audit.

**Tags:** `SAFE_FOR_AI` — document in CI dashboards and bot runners · `DEV_ONLY` — restricted credentials, billing, or heavy infra

---

## A. Smoke tests (fast, high signal)

| Goal | What to run | Typical routes touched | Tag |
|------|-------------|-------------------------|-----|
| **Deploy smoke (minimal)** | `npm run qa:smoke` → `playwright.smoke.config.ts` (`tests/e2e/smoke-production/*`) | `/`, logged-in marketing nav, free user, paid user, admin shell | DEV_ONLY (paid/admin creds) |
| **Critical public + paid paths** | `tests/e2e/release/critical-production-routes.spec.ts` | `/`, `/login`, `/signup`, guest lesson, `/app`, `/app/lessons`, `/app/flashcards`, `/app/practice-tests?cat=1`, `/admin` | DEV_ONLY |
| **Post-deploy** | `tests/e2e/release/release-postdeploy-smoke.spec.ts` (per project usage) | Candidate URL smoke | DEV_ONLY |
| **Health** | `release-health-apis`, `healthz-liveness-burst` | `/api/health`, `/healthz` | SAFE_FOR_AI |

**Gap to close with new smoke (recommended):** one **read-only** `/app/practice-tests/start` or **linear** “open runner + assert stem” step — still **DEV_ONLY** (paid).

---

## B. Regression tests (breadth)

| Goal | What to run | Tag |
|------|-------------|-----|
| **CI master slice** | `npm run test:e2e:ci-master` → `playwright.ci-master.config.ts` | DEV_ONLY |
| **Pre-deploy public** | `npm run qa:pre-deploy:public` (per `RELEASE_QA.md`) | SAFE_FOR_AI |
| **Pathways** | `playwright.pathways.config.ts`, `pathways-prenursing-allied` | SAFE_FOR_AI |
| **Learning routes** | `playwright.learning-routes.config.ts` | DEV_ONLY |
| **Site-wide audit** | `playwright.site-wide-audit.config.ts` | SAFE_FOR_AI |
| **RN full content** | `playwright.rn-full-content.config.ts` | DEV_ONLY |

---

## C. Mobile viewport tests

| Goal | What to run | Tag |
|------|-------------|-----|
| **Mobile project** | `playwright.mobile.config.ts` + `tests/e2e/mobile/*` | SAFE_FOR_AI |
| **Paid mobile** | `paid-user-mobile.spec.ts` | DEV_ONLY |
| **Lesson flows mobile** | `lesson-flows.mobile.spec.ts` | DEV_ONLY |
| **CAT viewport** | `cat-exam-compact-viewport`, `paid-user-cat-focused-viewport`, env-driven `cat-focused-practice-session-viewport` | DEV_ONLY |

**Recommendation:** Add **Pixel 5** (or `devices['Pixel 5']`) project duplicate of **critical-production-routes** for top 5 URLs — **SAFE_FOR_AI** template once stable.

---

## D. Entitlement tests

| Goal | What to run | Tag |
|------|-------------|-----|
| **Release gate core** | `paid-user-entitlements.spec.ts` | DEV_ONLY |
| **Tier matrix** | `tier-matrix-cross-tier-gating`, `tier-matrix-paid-owned-pathway`, `tier-matrix-public-marketing-smoke` | DEV_ONLY |
| **Guest paywall contracts** | `auth/site-guest-paywall-contract`, `freemium-paywall` | SAFE_FOR_AI |
| **Lesson paywall** | `lessons/lesson-paywall-correctness.spec.ts` | SAFE_FOR_AI |

**Gap:** **Entitlement refresh after subscription row change** (admin or webhook) — manual or **DEV_ONLY** integration test.

---

## E. SEO tests

| Goal | What to run | Tag |
|------|-------------|-----|
| **SEO endpoints** | `public/seo-endpoints.spec.ts` | SAFE_FOR_AI |
| **SEO surface audit** | `public/seo-surface-audit.spec.ts` | SAFE_FOR_AI |
| **Sitemap caching** | `public/sitemap-caching.spec.ts` | SAFE_FOR_AI |
| **Link crawl** | `public/link-crawl-audit.spec.ts`, `crawl-health/public-crawl-regression` | SAFE_FOR_AI |
| **Localized SEO** | `seo/localized-seo.spec.ts` | SAFE_FOR_AI |

---

## F. Subscription tests

| Goal | What to run | Tag |
|------|-------------|-----|
| **Pricing read-only** | `smoke/smoke-checkout-path.spec.ts`, `pricing/pricing-smoke.spec.ts` | SAFE_FOR_AI |
| **Billing shell** | `release/release-account-billing-smoke.spec.ts` | DEV_ONLY |
| **Full Stripe journey** | `paid-user/stripe-subscriber-journey.spec.ts` with `E2E_STRIPE_CHECKOUT_JOURNEY=1` + webhook forwarding (see file header) | DEV_ONLY |

**Never** point Stripe tests at production without explicit policy.

---

## G. Suggested “production QA day” matrix (order)

| Step | Suite | Owner | Tag |
|------|-------|-------|-----|
| 1 | `qa:release-gate` | CI / release captain | DEV_ONLY |
| 2 | `critical-production-routes` against **candidate** `BASE_URL` | Release | DEV_ONLY |
| 3 | `qa:smoke` smoke-production | Ops | DEV_ONLY |
| 4 | `qa:pre-deploy:public` | Growth / SEO | SAFE_FOR_AI |
| 5 | `playwright.mobile.config.ts` (subset) | Mobile DRI | SAFE_FOR_AI |
| 6 | Manual **linear practice test** + **question bank** (checklist) | Eng | DEV_ONLY |
| 7 | Staging **Stripe journey** opt-in OR webhook replay verification | Eng | DEV_ONLY |

---

## H. New specs (recommendations only — not implemented)

| Spec idea | Est. priority | Tag |
|-----------|---------------|-----|
| `practice-test-linear-smoke.spec.ts` — paid, 1 exam, 5 MCQs, submit | P0 | DEV_ONLY |
| `onboarding-pathway-matrix.spec.ts` — table-driven goals | P1 | SAFE_FOR_AI |
| `allied-lessons-hub-smoke.spec.ts` | P2 | SAFE_FOR_AI |
| `subscriber-marketing-lesson-crossover.spec.ts` | P2 | DEV_ONLY |

---

## Reference

- `docs/RELEASE_QA.md` — authoritative **release-blocking** list.  
- `playwright.release-gate.config.ts` — exact `testMatch` for gate.  
- `playwright.smoke.config.ts` vs `playwright.smoke-extended.config.ts` — widen smoke deliberately, not ad hoc.
