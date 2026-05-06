# Phase 3 — reliability automation

This document describes release-gate reporting, production health checks, synthetic paid-learner smoke, failure-classification tags, predeploy orchestration, and required environment variables.

## 1. Release gate (`npm run qa:release-gate`)

- **Config:** `nursenest-core/playwright.release-gate.config.ts`
- **Reporters:**
  - `tests/e2e/reporters/release-blocker-console-reporter.ts` — per-failure console block (likely class, attachment paths).
  - `tests/e2e/reporters/paid-user-summary-reporter.ts` — paid-user failure rollup (unchanged behavior).
  - **`tests/e2e/reporters/release-gate-summary-reporter.ts`** — end-of-run Markdown + JSON under `test-results/release-gate-summary.{md,json}` and one stdout line prefixed with `[release-gate-summary]`.
- **Projects (order):** `release-health` → `release-phase-1-guest` → `release-mobile` → `setup-paid-auth` → `release-blocking-paid` → `release-synthetic-paid-smoke`.
- **Credential-gated skips** are listed separately from **other explicit skips** (e.g. empty CAT pool harness). Skips are **not** failures.

## 2. Production health check

- **Script:** `scripts/health-check-production.mjs` (monorepo root).
- **Run:** `node scripts/health-check-production.mjs` or `npm run health-check:production`.
- **Base URL:** `BASE_URL` **or** `PLAYWRIGHT_BASE_URL` (first defined wins).
- **Checks:** HEAD `/`, `/pricing`, `/signup`, `/login`, `/lessons`; GET `/api/health`, `/api/health/ready`; GET `/api/flashcards/inventory?pathwayId=us-rn-nclex-rn` and GET `/api/practice-tests` **without auth** — expect **401 or 403** (documented in JSON `notes`).
- **Exit codes:** Default **always 0**; JSON includes `suggestedExitCode`. Pass **`--strict-exit`** to exit with `suggestedExitCode` for strict CI.

## 3. Synthetic paid learner smoke

- **Spec:** `tests/e2e/release/phase-3-synthetic-paid-learner-smoke.spec.ts`
- **Project:** `release-synthetic-paid-smoke` (after `release-blocking-paid`).
- **Credentials:** `E2E_PAID_EMAIL` + `E2E_PAID_PASSWORD`, or `QA_PAID_*`, or `PLAYWRIGHT_TEST_*`. If missing, describe-level skip (**exit 0**).
- **Flow (read-only):** `/app` → lessons hub → flashcards session → CAT hub (first item or explicit empty-pool skip) → linear practice first question → `/app/account/billing`. No purchases.

## 4. Failure classification tags

- **Helper:** `tests/e2e/helpers/failure-classification-tags.ts`
- **Tags:** `auth_failure`, `entitlement_failure`, `empty_pool`, `route_crash`, `timeout`, `mobile_overflow`, `missing_env`, `stripe_webhook_skipped`
- **Usage:** `attachFailureClassification(test.info(), "route_crash")` in specs.

## 5. Predeploy checklist

- **Script:** `scripts/predeploy-check.mjs` — `typecheck` → `build` → `qa:release-gate` → `test:e2e:mobile` in `nursenest-core/`.
- **npm:** `npm run predeploy:check`

## 6. Environment variables

| Variable | Used by | Purpose |
|----------|---------|---------|
| `BASE_URL` | Playwright, health script | App origin |
| `PLAYWRIGHT_BASE_URL` | Playwright, health script | Alternate origin |
| `E2E_PAID_EMAIL`, `E2E_PAID_PASSWORD` | Paid E2E | Paid learner auth |
| `QA_PAID_EMAIL`, `QA_PAID_PASSWORD` | Paid E2E | Alias |
| `PLAYWRIGHT_TEST_EMAIL`, `PLAYWRIGHT_TEST_PASSWORD` | Paid E2E | Legacy alias |
| `E2E_FREE_EMAIL`, `E2E_FREE_PASSWORD` | Guest release spec | Optional free-tier gate |
| `PLAYWRIGHT_SKIP_WEB_SERVER` | Playwright | Skip dev server |
| `NN_HEALTH_CHECK_TIMEOUT_MS` | Health script | Request timeout (ms) |

## 7. Remaining manual checks

- Stripe live webhooks and checkout (not automated; no mandatory Stripe in CI).
- DNS/TLS and CDN configuration.

## 8. Deployment checklist

1. Set `BASE_URL` to the candidate environment.
2. `npm run predeploy:check` (or individual npm scripts).
3. Optionally `node scripts/health-check-production.mjs --strict-exit` post-promote.
4. Collect CI artifact `test-results/release-gate-summary.md`.
