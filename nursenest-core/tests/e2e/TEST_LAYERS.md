# Playwright test layering (confidence model)

Tests are grouped by **deployment risk**, not by folder structure alone. **Do not demote a test without updating this doc and getting review.**

## Layer A — deploy blockers (must pass before promote)

| Area | Files / entrypoints |
|------|---------------------|
| Paid auth seed | `setup/auth.setup.ts` (`setup-paid-auth` project) |
| Fast sanity gate | `paid-user/paid-user-00-fast-sanity.spec.ts` |
| Core entitlements | `paid-user/paid-user-entitlements.spec.ts` |
| API health (paid) | `paid-user/paid-user-api-health.spec.ts` |
| Login flow (explicit) | `paid-user/paid-user-login-flow.spec.ts` |

**Playwright projects:** `setup-paid-auth` → `chromium-paid` (see `playwright.config.ts` `testMatch` for exact file list).

**npm:** `test:e2e:paid-fast-sanity` and CI “master” paid bundles (see `package.json`).

## Layer B — important regression (fix before release; may not block every hotfix)

| Area | Examples |
|------|----------|
| Navigation / journey | `paid-user-navigation.spec.ts`, `paid-user-journey.spec.ts` |
| Flashcards / CAT / adaptive | `paid-user-cat-smoke.spec.ts`, `paid-user-adaptive-question-flow.spec.ts` |
| Mobile / i18n / session | `paid-user-mobile.spec.ts`, `paid-user-i18n.spec.ts`, `paid-user-session-persistence.spec.ts` |
| Stress / performance / degraded | `paid-user-stress.spec.ts`, `paid-user-performance.spec.ts`, `paid-user-degraded-mode.spec.ts` |
| Subscriber audit | `paid-subscriber-audit.spec.ts` |
| Stripe journey | `stripe-subscriber-journey.spec.ts` (`chromium-stripe-journey`, opt-in env) |

## Layer C — non-blocking / extended signal

| Area | Examples |
|------|----------|
| Visual regression | `paid-user-visual-regression.spec.ts` |
| Key-page perf budgets | `paid-user-key-pages-performance.spec.ts` |
| Production i18n bundle | `production-i18n-bundle.spec.ts` |
| Data-load / long-running | `paid-user-data-load.spec.ts` |

## Public / marketing / free-tier

| Layer | Notes |
|-------|--------|
| Public smoke | `public/smoke.spec.ts`, `public/pre-deploy-regression.spec.ts` — product-dependent |
| Freemium | `auth/freemium-paywall.spec.ts` (`chromium-free`) |
| Marketing / crawl | `public/link-crawl-audit.spec.ts`, `navigation/country-selector.spec.ts` — longer, env-sensitive |

## Helpers (canonical)

- **Learner shell:** `helpers/learner-shell.ts` — single source of truth for pathname rules.
- **Login:** `helpers/learner-login.ts` — UI login; browser `waitForFunction` must stay in sync with `isLearnerShell`.
- **Auth diagnostics:** `helpers/auth-diagnostics.ts` — failure context (URL, paywall, onboarding).
- **Core surface:** `helpers/learner-core-surface.ts` — `main` content thresholds without optional widgets.
