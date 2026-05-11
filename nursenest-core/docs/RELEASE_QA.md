# Release QA and deploy safety

**Runbook (commands, BASE_URL, staging):** [`docs/testing/release-gate-runbook.md`](./testing/release-gate-runbook.md).

This document defines **what must be green before production**, how to run it, and what environment is required. It complements static checks in [`release-safety-checks.md`](./release-safety-checks.md) (content/registry validation).

**Rules:** Do not weaken auth, entitlements, or paid-access assertions to “go green.” Fix the product or test data (e.g. QA seed).

---

## 1. Release-blocking tests (deploy gate)

Run **`npm run qa:release-gate`** against the **candidate** `BASE_URL` (staging or local with DB).

| # | What | Spec / entry |
|---|------|----------------|
| 1 | Guest marketing + auth entry shells | `tests/e2e/release/phase-1-release-qa-guest.spec.ts` |
| 2 | Liveness + DB readiness | `tests/e2e/release/release-health-apis.spec.ts` |
| 3 | Paid auth seed (storage state) | `tests/e2e/setup/auth.setup.ts` (`setup-paid-auth` project) |
| 4 | Fast sanity — shell, lessons hub, guards | `tests/e2e/paid-user/paid-user-00-fast-sanity.spec.ts` |
| 5 | Entitlements — premium lesson + question + flashcards vs anonymous | `tests/e2e/paid-user/paid-user-entitlements.spec.ts` |
| 6 | API / network health — lessons + questions + flashcards paths | `tests/e2e/paid-user/paid-user-api-health.spec.ts` |
| 7 | Paid learner workflows — lessons, flashcards, practice, billing, explicit Canada RPN lessons route | `tests/e2e/paid-user/phase-1-paid-learner-workflows.spec.ts` |
| 8 | CAT / practice exam — hub → exam → items | `tests/e2e/paid-user/paid-user-cat-smoke.spec.ts` |
| 9 | Account overview (read-only, no Stripe writes) | `tests/e2e/release/release-account-billing-smoke.spec.ts` |

**Exact files in the blocking layer:**

1. `tests/e2e/release/phase-1-release-qa-guest.spec.ts`
2. `tests/e2e/release/release-health-apis.spec.ts`
3. `tests/e2e/setup/auth.setup.ts`
4. `tests/e2e/paid-user/paid-user-00-fast-sanity.spec.ts`
5. `tests/e2e/paid-user/paid-user-entitlements.spec.ts`
6. `tests/e2e/paid-user/paid-user-api-health.spec.ts`
7. `tests/e2e/paid-user/phase-1-paid-learner-workflows.spec.ts`
8. `tests/e2e/paid-user/paid-user-cat-smoke.spec.ts`
9. `tests/e2e/release/release-account-billing-smoke.spec.ts`

Config: `playwright.release-gate.config.ts` (health project, then setup + `release-blocking-paid`).

When the release includes Canada RPN / REx-PN, the blocking gate must also cover:

- public hub rendering + auth callback preservation for `/canada/pn/rex-pn` in `phase-1-release-qa-guest.spec.ts`
- an entitled learner route for `ca-rpn-rex-pn` in `phase-1-paid-learner-workflows.spec.ts`
- runtime inventory verification via `npm run verify:rpn-lessons-visible`

Optional: set `E2E_RELEASE_SKIP_BILLING=1` to skip account/billing smoke only when explicitly justified (same as spec `test.skip`).

---

## 2. Important regression (fix before release; may not block every hotfix)

| Area | Examples |
|------|----------|
| Extended paid CI slice | `npm run test:e2e:ci-master` → fast-sanity, journey, entitlements, navigation, api-health (`playwright.ci-master.config.ts`) |
| Subscriber audit | `tests/e2e/paid-user/paid-subscriber-audit.spec.ts` |
| Session persistence | `tests/e2e/paid-user/paid-user-session-persistence.spec.ts` |
| Navigation / i18n / mobile | paid-user navigation/mobile/i18n suites under `tests/e2e/paid-user/` |
| Stress / performance / degraded | paid-user stress/performance/degraded suites under `tests/e2e/paid-user/` |
| Public marketing | targeted Playwright suites under `tests/e2e/public/` plus `playwright.site-wide-audit.config.ts` when a broader public audit is needed |
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

### Execution modes (local dev vs staging vs production-like)

All modes require **`BASE_URL`** (or **`PLAYWRIGHT_BASE_URL`** / **`NURSENEST_PRODUCTION_BASE_URL`**) so Playwright `use.baseURL` matches the app under test. Specs use **relative** URLs; `http://127.0.0.1:3000` fallbacks in tests are **fallback-only** when `baseURL` is missing.

| Mode | When | Typical env |
|------|------|-------------|
| **Local dev (auto webServer)** | Host is `localhost` or `127.0.0.1` and you want Playwright to run **`npm run dev`** | `BASE_URL=http://127.0.0.1:3000` — omit **`PLAYWRIGHT_SKIP_WEB_SERVER`** |
| **Local app already running** | Dev or **`npm run build && npm run start`** on same machine | `PLAYWRIGHT_SKIP_WEB_SERVER=1` |
| **Staging / preview** | HTTPS candidate | `BASE_URL=https://…` + **`PLAYWRIGHT_SKIP_WEB_SERVER=1`** |

Copy/paste commands and credential tables: **`reports/release-gate-checklist.md`**.

**Slice scripts** (same `BASE_URL` rules):

| Script | Projects run |
|--------|----------------|
| `npm run qa:release-gate:list` | Preflight + list tests only |
| `npm run qa:release-gate:guest` | `release-health`, `release-phase-1-guest` |
| `npm run qa:release-gate:paid` | `release-blocking-paid`, `release-synthetic-paid-smoke` (runs **`setup-paid-auth`** first) |
| `npm run qa:release-gate:mobile` | `release-mobile` (runs **`release-phase-1-guest`** first) |
| `npm run qa:release-gate:all` | Same as full **`npm run qa:release-gate`** |

**Artifacts:** failures land under **`test-results/release-gate/artifacts/`**; JSON at **`test-results/release-gate/release-gate-report.json`**. Optional HTML: set **`RELEASE_GATE_HTML_REPORT=1`** → **`test-results/release-gate/playwright-report/`**, then `npx playwright show-report test-results/release-gate/playwright-report`.

### Pre-deploy (candidate environment)

```bash
cd nursenest-core
export BASE_URL="https://your-candidate.example"   # or local http://127.0.0.1:3000
export PLAYWRIGHT_SKIP_WEB_SERVER=1               # when testing a remote URL
# Paid credentials in env or .env.playwright.local — see playwright.env.ts
npm run production:preflight
npm run verify:do-runtime
npm run qa:release-gate
npm run verify:rpn-lessons-visible               # required when Canada RPN / REx-PN is in release scope
```

### Post-deploy (production smoke, no paid creds required)

```bash
cd nursenest-core
export BASE_URL="https://www.nursenest.ca"
export PLAYWRIGHT_SKIP_WEB_SERVER=1
npm run qa:post-deploy-smoke
# alias:
npm run qa:postdeploy
```

### Post-deploy — full verification (health + core user journeys)

Runs minimal health/home, then the curated smoke bundle (auth, pricing, mobile, paid/free/admin when creds are set). See **`docs/release-verification.md`**.

```bash
cd nursenest-core
export BASE_URL="https://www.nursenest.ca"
npm run qa:verify:production
```

### Local emergency smoke (fastest signal)

Health-only (no Playwright paid setup):

```bash
npm run test:e2e:learner-shell-contract
npx playwright test -c playwright.release-gate.config.ts --project=release-health
```

With paid creds, fast sanity alone:

```bash
npx playwright test -c playwright.release-gate.config.ts --project=release-blocking-paid tests/e2e/paid-user/paid-user-00-fast-sanity.spec.ts
```

### One-liners (aliases)

| Script | Purpose |
|--------|---------|
| `npm run qa:release-gate` | Full release gate (all projects in `playwright.release-gate.config.ts`) |
| `npm run qa:release-gate:list` | Preflight env + list tests (`--list`) |
| `npm run qa:release-gate:guest` | Health + phase-1 guest marketing only |
| `npm run qa:release-gate:paid` | Paid blocking + synthetic paid smoke |
| `npm run qa:release-gate:mobile` | Mobile Pixel smoke (runs phase-1 guest dependency) |
| `npm run qa:release-gate:all` | Same as `qa:release-gate` |
| `npm run qa:predeploy` | Same as `qa:release-gate` |
| `npm run qa:release-gate:health` | `/api/health` + `/api/health/ready` release-health project only |
| `npm run production:preflight` | Schema / build / deploy preflight validation before candidate promotion |
| `npm run verify:do-runtime` | Runtime DigitalOcean / app-platform verification before promotion |
| `npm run release:runtime-checklist` | Human-readable runtime verification checklist helper |
| `npm run verify:rpn-lessons-visible` | Required RPN runtime/public-surface verification when REx-PN is in scope |
| `npm run qa:post-deploy-smoke` | Post-deploy health + home (`playwright.postdeploy.config.ts`) |
| `npm run qa:postdeploy` | Same as `qa:post-deploy-smoke` |
| `npm run qa:verify:production` | Post-deploy smoke **+** core journey bundle (`scripts/verify-production-release.mjs`) |
| `npm run qa:verify:production:core` | Core journey bundle only (`playwright.verify-production.config.ts`) |

---

## 5. Environment contract

| Variable / artifact | Purpose |
|---------------------|---------|
| `BASE_URL` | Playwright `use.baseURL`; must match the app under test (include scheme, no trailing slash path). |
| **Paid learner** — `E2E_PAID_EMAIL` + `E2E_PAID_PASSWORD` **or** `QA_PAID_EMAIL` + `QA_PAID_PASSWORD` **or** `PLAYWRIGHT_TEST_EMAIL` + `PLAYWRIGHT_TEST_PASSWORD` | Paid E2E user; see `tests/e2e/helpers/paid-test-credentials.ts`. |
| **Free learner** — `E2E_FREE_EMAIL` + `E2E_FREE_PASSWORD` **or** `QA_FREE_EMAIL` + `QA_FREE_PASSWORD` | Used by `release-free-user` smoke; skips if unset. |
| **Admin staff** — `E2E_ADMIN_EMAIL` + `E2E_ADMIN_PASSWORD` | Used by `release-admin-user`; skips if unset. |
| `tests/e2e/.auth/paid-user.json` | Written by `setup-paid-auth`; path override via `NN_PAID_AUTH_FILE` if needed (`auth-state-paths.ts`). |
| `NEXTAUTH_SECRET` / `AUTH_URL` / `NEXTAUTH_URL` | Local webServer in Playwright config so Auth.js works in dev. |
| `PLAYWRIGHT_SKIP_WEB_SERVER=1` | Do not start `npm run dev` (use when app already running or remote URL). |
| `RELEASE_GATE_HTML_REPORT=1` | Append HTML reporter output to **`test-results/release-gate/playwright-report/`** (see checklist). |
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

**`tests/e2e/smoke/admin-dashboard.spec.ts`** — optional smoke: staff login, `/admin` shell, non-401 admin API probes. Requires `E2E_ADMIN_EMAIL` / `E2E_ADMIN_PASSWORD` (see `tests/e2e/helpers/admin-e2e-credentials.ts`). Skips when unset. Do not add destructive admin mutations for CI convenience.

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

1. `npm run ci:verify`
2. `npm run production:preflight`
3. `npm run verify:do-runtime` (or `npm run release:runtime-checklist` if you need the human-readable checklist)
4. `npm run qa:release-gate` on the **same build** deployed to production (candidate/staging URL with production-like DB)
5. If Canada RPN / REx-PN is in scope: `npm run verify:rpn-lessons-visible`
6. After promote: `npm run qa:verify:production` (or at minimum `npm run qa:post-deploy-smoke`) against **production** `BASE_URL`

---

## Related

- `docs/release-verification.md` — critical journeys, monitoring checklist, QA account matrix
- `docs/release-deploy-checklist.md` — human deploy checklist
- `tests/e2e/TEST_LAYERS.md` — layer overview
- `docs/release-safety-checks.md` — static / registry checks
