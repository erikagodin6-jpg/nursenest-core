# Release gate checklist — copy/paste runs

Run all commands from **`nursenest-core/`** unless noted. The gate **requires** a target URL via **`BASE_URL`** (or **`PLAYWRIGHT_BASE_URL`** / **`NURSENEST_PRODUCTION_BASE_URL`**).

Preflight (prints URL + which credential groups are present):

```bash
cd nursenest-core
npm run qa:release-gate:check-env
```

List tests without executing:

```bash
cd nursenest-core
export BASE_URL=http://127.0.0.1:3000
npm run qa:release-gate:list
```

---

## 1. Local — Playwright starts Next dev (`npm run dev`)

Use when you want the runner to spawn the app (localhost only).

```bash
cd nursenest-core
export BASE_URL=http://127.0.0.1:3000
# Optional: NEXTAUTH_SECRET, DATABASE_URL if auth/DB needed for login
unset PLAYWRIGHT_SKIP_WEB_SERVER
npm run qa:release-gate
```

**Slices:**

```bash
export BASE_URL=http://127.0.0.1:3000
npm run qa:release-gate:guest    # health + phase-1 guest marketing
npm run qa:release-gate:paid    # paid blocking + synthetic paid smoke (runs setup-paid-auth first)
npm run qa:release-gate:mobile  # Pixel 7 smoke (runs release-phase-1-guest then mobile)
npm run qa:release-gate:all     # same as npm run qa:release-gate
```

---

## 2. Local — app already running OR production-like server

Do **not** let Playwright start a second server:

```bash
cd nursenest-core
export BASE_URL=http://127.0.0.1:3000
export PLAYWRIGHT_SKIP_WEB_SERVER=1
npm run qa:release-gate
```

**Production build / start (example — align with your `package.json` start script):**

```bash
# Terminal A: build + start standalone or your deploy preview
cd nursenest-core
npm run build && npm run start
# Terminal B:
export BASE_URL=http://127.0.0.1:3000
export PLAYWRIGHT_SKIP_WEB_SERVER=1
npm run qa:release-gate
```

---

## 3. Staging / candidate URL

```bash
cd nursenest-core
export BASE_URL=https://your-staging.example
export PLAYWRIGHT_SKIP_WEB_SERVER=1
# Paid / free / admin: set variables below or .env.playwright.local
npm run qa:release-gate
```

---

## 4. Required / optional credentials

| Role | Variables (one complete pair) | If missing |
|------|-------------------------------|------------|
| **Paid learner** | `E2E_PAID_EMAIL` + `E2E_PAID_PASSWORD` **or** `QA_PAID_EMAIL` + `QA_PAID_PASSWORD` **or** `PLAYWRIGHT_TEST_EMAIL` + `PLAYWRIGHT_TEST_PASSWORD` | `release-blocking-paid` runs stub spec (`paid-e2e-requires-env`); real paid tests skipped |
| **Free learner** | `E2E_FREE_EMAIL` + `E2E_FREE_PASSWORD` **or** `QA_FREE_EMAIL` + `QA_FREE_PASSWORD` | `release-free-user` skips |
| **Admin staff** | `E2E_ADMIN_EMAIL` + `E2E_ADMIN_PASSWORD` | `release-admin-user` skips |

Optional local file: **`nursenest-core/.env.playwright.local`** (gitignored). See `playwright.env.ts`.

---

## 5. Artifacts (failure diagnostics)

| Output | Location |
|--------|----------|
| Per-test output (screenshots, traces, video) | `nursenest-core/test-results/release-gate/artifacts/` |
| JSON report | `nursenest-core/test-results/release-gate/release-gate-report.json` |
| HTML report (opt-in) | Set **`RELEASE_GATE_HTML_REPORT=1`** → `nursenest-core/test-results/release-gate/playwright-report/` then `npx playwright show-report test-results/release-gate/playwright-report` |

Default reporters always include **list** + **json**. Screenshots / traces / videos follow **`playwright.release-gate.config.ts`** (`screenshot: only-on-failure`, `trace: retain-on-failure`, `video: retain-on-failure`).

---

## 6. HTML report (optional)

```bash
cd nursenest-core
export BASE_URL=http://127.0.0.1:3000
export RELEASE_GATE_HTML_REPORT=1
export PLAYWRIGHT_SKIP_WEB_SERVER=1   # if app already up
npm run qa:release-gate
npx playwright show-report test-results/release-gate/playwright-report
```

---

## 7. Repo root (monorepo wrapper)

From repository root:

```bash
export BASE_URL=http://127.0.0.1:3000
npm run qa:release-gate
```

---

## Related docs

- `docs/RELEASE_QA.md` — full policy and matrix
- `docs/release-verification.md` — post-deploy journeys
- `scripts/validate-release-gate-env.mjs` — preflight implementation
