# Release QA and deploy safety

This document defines **what must be green before production**, how to run it, and what environment is required. It complements static checks in [`release-safety-checks.md`](./release-safety-checks.md) (content/registry validation).

**Rules:** Do not weaken auth, entitlements, or paid-access assertions to “go green.” Fix the product or test data (e.g. QA seed).

---

## 1. Release-blocking tests (deploy gate)

Run **`npm run qa:release-gate`** against the **candidate** `BASE_URL` (staging or local with DB).

| # | What | Spec / entry |
|---|------|----------------|
| 1 | Learner pathname contract (Node) | `tests/e2e/helpers/learner-shell.test.ts` via `npm run test:e2e:learner-shell-contract` |
| 2 | Liveness + DB readiness | `tests/e2e/release/release-health-apis.spec.ts` |
| 3 | Paid auth seed (storage state) | `tests/e2e/setup/auth.setup.ts` (`setup-paid-auth` project) |
| 4 | Fast sanity — shell, lessons hub, guards | `tests/e2e/paid-user/paid-user-00-fast-sanity.spec.ts` |
| 5 | Entitlements — premium lesson + question + flashcards vs anonymous | `tests/e2e/paid-user/paid-user-entitlements.spec.ts` |
| 6 | API / network health — lessons + questions + flashcards paths | `tests/e2e/paid-user/paid-user-api-health.spec.ts` |
| 7 | CAT / practice exam — hub → exam → items | `tests/e2e/paid-user/paid-user-cat-smoke.spec.ts` |
| 8 | Account overview (read-only, no Stripe writes) | `tests/e2e/release/release-account-billing-smoke.spec.ts` |

**Exact files in the blocking layer:**

1. `tests/e2e/helpers/learner-shell.test.ts` (contract, not Playwright)
2. `tests/e2e/release/release-health-apis.spec.ts`
3. `tests/e2e/setup/auth.setup.ts`
4. `tests/e2e/paid-user/paid-user-00-fast-sanity.spec.ts`
5. `tests/e2e/paid-user/paid-user-entitlements.spec.ts`
6. `tests/e2e/paid-user/paid-user-api-health.spec.ts`
7. `tests/e2e/paid-user/paid-user-cat-smoke.spec.ts`
8. `tests/e2e/release/release-account-billing-smoke.spec.ts`

Config: `playwright.release-gate.config.ts` (health project, then setup + `release-blocking-paid`).

Optional: set `E2E_RELEASE_SKIP_BILLING=1` to skip account/billing smoke only when explicitly justified (same as spec `test.skip`).

---

## 2. Important regression (fix before release; may not block every hotfix)

| Area | Examples |
|------|----------|
| Extended paid CI slice | `npm run test:e2e:ci-master` → fast-sanity, journey, entitlements, navigation, api-health (`playwright.ci-master.config.ts`) |
| Subscriber audit | `tests/e2e/paid-user/paid-subscriber-audit.spec.ts` |
| Session persistence | `tests/e2e/paid-user/paid-user-session-persistence.spec.ts` |
| Navigation / i18n / mobile | `paid-user-navigation`, `paid-user-i18n`, `paid-user-mobile` |
| Stress / performance / degraded | `paid-user-stress`, `paid-user-performance`, `paid-user-degraded-mode` |
| Public marketing | `npm run qa:pre-deploy:public` |
| Login flow (explicit UI) | `tests/e2e/paid-user/paid-user-login-flow.spec.ts` |
| Auth audit (optional creds) | `tests/e2e/auth/auth-audit.spec.ts` |
| Adaptive questions | `tests/e2e/paid-user/paid-user-adaptive-question-flow.spec.ts` |

---

## 3. Informational / non-blocking

| Area | Examples |
|------|----------|
| Visual regression | `paid-user-visual-regression.spec.ts` |
| Key-page performance budgets | `paid-user-key-pages-performance.spec.ts` |
| Production i18n bundle | `production-i18n-bundle.spec.ts` |
| Long data-load | `paid-user-data-load.spec.ts` |
| Marketing crawl / SEO audits | `link-crawl-audit`, `seo-surface-audit` |
| Stripe checkout journey | `stripe-subscriber-journey.spec.ts` (opt-in env) |

Demoting a test from “important” to “informational” requires review and doc update.

---

## 4. Commands

### Pre-deploy (candidate environment)

```bash
cd nursenest-core
export BASE_URL="https://your-candidate.example"   # or local http://127.0.0.1:3000
export PLAYWRIGHT_SKIP_WEB_SERVER=1               # when testing a remote URL
# Paid credentials in env or .env.playwright.local — see playwright.env.ts
npm run qa:release-gate
```

### Post-deploy (production smoke, no paid creds required)

```bash
cd nursenest-core
export BASE_URL="https://www.nursenest.ca"
export PLAYWRIGHT_SKIP_WEB_SERVER=1
npx playwright test tests/e2e/release/release-postdeploy-smoke.spec.ts --project=chromium
# or:
npm run qa:post-deploy-smoke
```

### Local emergency smoke (fastest signal)

```bash
cd nursenest-core
npm run test:e2e:learner-shell-contract
npx playwright test -c playwright.release-gate.config.ts --project=release-health
# With paid creds:
npm run test:e2e:paid-fast-sanity
```

### One-liners (aliases)

| Script | Purpose |
|--------|---------|
| `npm run qa:release-gate` | Full release gate (contract + health + paid blockers) |
| `npm run qa:release-gate:health` | `/api/health` + `/api/health/ready` only |
| `npm run qa:important-regression` | CI master paid bundle + public pre-deploy |
| `npm run qa:post-deploy-smoke` | Post-deploy health + home |

---

## 5. Environment contract

| Variable / artifact | Purpose |
|---------------------|---------|
| `BASE_URL` | Playwright `use.baseURL`; must match the app under test (include scheme, no trailing slash path). |
| `E2E_PAID_EMAIL` + `E2E_PAID_PASSWORD` **or** `PLAYWRIGHT_TEST_EMAIL` + `PLAYWRIGHT_TEST_PASSWORD` | Paid E2E user; see `tests/e2e/helpers/paid-test-credentials.ts`. |
| `tests/e2e/.auth/paid-user.json` | Written by `setup-paid-auth`; path override via `NN_PAID_AUTH_FILE` if needed (`auth-state-paths.ts`). |
| `NEXTAUTH_SECRET` / `AUTH_URL` / `NEXTAUTH_URL` | Local webServer in Playwright config so Auth.js works in dev. |
| `PLAYWRIGHT_SKIP_WEB_SERVER=1` | Do not start `npm run dev` (use when app already running or remote URL). |
| `E2E_RELEASE_SKIP_BILLING=1` | Skip account/billing smoke in `release-account-billing-smoke.spec.ts` only. |
| Health endpoints | `GET /api/health` (liveness), `GET /api/health/ready` (DB readiness; may return 503 if DB down). |

Route expectations for paid users are documented in `tests/e2e/helpers/learner-shell.ts` and `TEST_LAYERS.md`.

---

## 6. Health gate behavior

- **`/api/health`** — Process/app liveness; must return **200** with JSON indicating live/ok for release gate.
- **`/api/health/ready`** — Database (and related) readiness; must return **200** with `ok: true` when healthy. **503** is treated as **not ready** (do not promote until resolved or explicitly waived for a known maintenance window).

---

## 7. Billing / account safety

- **`release-account-billing-smoke.spec.ts`** — Read-only: loads `/app/account/overview`, asserts learner shell and no subscriber paywall. No checkout, no subscription writes.
- Deeper billing UI may be covered in journey/audit specs; still avoid automated **writes** against live Stripe.

---

## 8. Admin

There is **no** dedicated safe admin E2E in this repo. Admin remains **manual** or tool-based until a read-only admin smoke exists. Do not add destructive admin mutations for CI convenience.

---

## 9. Deploy decision matrix

| If this fails | Action |
|-----------------|--------|
| `setup-paid-auth` / login | **Block deploy** — auth or seed broken |
| Learner shell / onboarding stuck | **Block deploy** |
| Entitlements / paywall on premium surfaces | **Block deploy** |
| Lessons / questions / flashcards / CAT | **Block deploy** |
| `/api/health` or `/api/health/ready` | **Block deploy** (readiness 503 = not ready) |
| Account overview (billing smoke) | **Block deploy** unless `E2E_RELEASE_SKIP_BILLING=1` is explicitly approved |
| Navigation / journey / i18n / mobile extended | **Review before deploy** — fix soon |
| Optional widgets / minor layout / copy | **Review** — may ship with ticket |
| Visual regression / perf budgets / long data-load | **Informational** unless policy says otherwise |

---

## 10. What must be green before production

Minimum:

1. `npm run validate:release` (or your CI equivalent: typecheck + content + i18n + release-safety tests) — see `package.json` `validate:release`.
2. `npm run qa:release-gate` on the **same build** deployed to production (candidate/staging URL with production-like DB).
3. After promote: `npm run qa:post-deploy-smoke` against **production** `BASE_URL`.

---

## Related

- `tests/e2e/TEST_LAYERS.md` — layer overview
- `docs/release-safety-checks.md` — static / registry checks
