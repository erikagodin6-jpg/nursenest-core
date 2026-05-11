# Release gate — operational runbook

Executable QA against **local**, **production-build**, or **staging** using `playwright.release-gate.config.ts`. No learner UX changes — this doc covers **how to run** the gate and **which env vars** matter.

**Related:** [`RELEASE_QA.md`](../RELEASE_QA.md) (what is blocking), [`reports/release-gate-checklist.md`](../../../reports/release-gate-checklist.md) (short checklist), [`scripts/validate-release-gate-env.mjs`](../../scripts/validate-release-gate-env.mjs) (preflight).

---

## Target URL (`BASE_URL`)

Resolution order (same as `tests/e2e/helpers/e2e-env.ts` and `playwright.release-gate.config.ts`):

1. `BASE_URL` (preferred)
2. `PLAYWRIGHT_BASE_URL`
3. `NURSENEST_PRODUCTION_BASE_URL`
4. Default: **`http://localhost:3000`** (implicit local; preflight reports `(implicit default)` when none of the above are set)

Playwright `use.baseURL` is set from that chain. Tests should prefer **`page.goto('/path')`** (relative) so navigation tracks the configured origin.

---

## 1. Local — dev server

From the **active app directory** (`nursenest-core/`):

```bash
cd nursenest-core
```

Run the app with whatever entrypoint you use for local dev; **export `BASE_URL` to match the origin your browser hits** (scheme + host + port).

Example — Next dev on loopback port 3000 (align with implicit default):

```bash
export BASE_URL=http://127.0.0.1:3000
npm run dev -- --hostname 127.0.0.1 --port 3000
```

If your dev server uses another port (e.g. `PORT=8080`), set:

```bash
export PORT=8080
export BASE_URL=http://127.0.0.1:8080
npm run dev
```

Release gate preflight (optional before a full run):

```bash
npm run qa:release-gate:check-env
```

Run tests against the **already running** server:

```bash
export PLAYWRIGHT_SKIP_WEB_SERVER=1
npm run qa:release-gate
```

Or let Playwright start a dev server **only when `BASE_URL` points at localhost/127.0.0.1** (see `playwright.release-gate.config.ts` `webServer`); unset `PLAYWRIGHT_SKIP_WEB_SERVER` and keep `BASE_URL` on localhost with the port you want.

---

## 2. Local — production build (`next build` + `next start`)

Use the standalone/start script after a successful build so you validate **compiled** output:

```bash
npm run build
export BASE_URL=http://127.0.0.1:3000
export PORT=3000
npm run start
```

In another terminal:

```bash
export BASE_URL=http://127.0.0.1:3000
export PLAYWRIGHT_SKIP_WEB_SERVER=1
npm run qa:release-gate
```

---

## 3. Staging / preview / remote

Point **`BASE_URL`** at the deployed origin (HTTPS):

```bash
export BASE_URL=https://your-staging-host.example.com
export PLAYWRIGHT_SKIP_WEB_SERVER=1
npm run qa:release-gate:check-env
npm run qa:release-gate
```

No implicit default applies meaningfully here — set `BASE_URL` explicitly so artifacts and failures reference the correct host.

If the release includes Canada RPN / REx-PN, immediately follow the candidate gate with:

```bash
npm run verify:rpn-lessons-visible
```

Treat that command as required candidate evidence for the RPN slice, not as an optional audit.

---

## Required credentials (optional groups)

Exact names are enforced/report-only in **`scripts/validate-release-gate-env.mjs`**. Summary:

| Role | Env pairs (any **one** complete pair) | Playwright projects skipped if missing |
|------|----------------------------------------|----------------------------------------|
| **Paid learner** | `E2E_PAID_EMAIL` + `E2E_PAID_PASSWORD`; **or** `QA_PAID_EMAIL` + `QA_PAID_PASSWORD`; **or** `PLAYWRIGHT_TEST_EMAIL` + `PLAYWRIGHT_TEST_PASSWORD` | `release-blocking-paid`, `release-synthetic-paid-smoke` (paid specs degrade to stub/skip where configured) |
| **Free learner** | `E2E_FREE_EMAIL` + `E2E_FREE_PASSWORD`; **or** `QA_FREE_EMAIL` + `QA_FREE_PASSWORD` | `release-free-user` |
| **Admin / staff** | `E2E_ADMIN_EMAIL` + `E2E_ADMIN_PASSWORD` | `release-admin-user` |

Other flags surfaced by preflight:

- `E2E_STRIPE_CHECKOUT_JOURNEY` — Stripe hosted checkout journey opt-in
- `E2E_RELEASE_SKIP_BILLING` — skips billing/account smoke when `1`

Dotenv load order for Playwright: see `playwright.env.ts` (`PLAYWRIGHT_DOTENV_PATH`, `.env.local`, `.env.playwright.local`, `.env`).

---

## npm scripts (subset)

| Script | Purpose |
|--------|---------|
| `npm run qa:release-gate:check-env` | Preflight only (`validate-release-gate-env.mjs`) |
| `npm run qa:release-gate:list` | `playwright … --list` (discovery; no preflight) |
| `npm run qa:release-gate:guest` | Projects: `release-health`, `release-phase-1-guest`, `release-free-user` |
| `npm run qa:release-gate:paid` | `release-blocking-paid`, `release-synthetic-paid-smoke` (+ dependency `setup-paid-auth`) |
| `npm run qa:release-gate:mobile` | `release-mobile` |
| `npm run qa:release-gate` / `qa:release-gate:all` | Full gate (all projects in config) |

Full config and project names: **`playwright.release-gate.config.ts`**.

---

## Artifacts / reports

| Output | Location |
|--------|----------|
| Test output / screenshots / traces | `nursenest-core/test-results/release-gate/artifacts/` |
| JSON report | `nursenest-core/test-results/release-gate/release-gate-report.json` |
| HTML report | Enable `RELEASE_GATE_HTML_REPORT=1` → `test-results/release-gate/playwright-report/` |

Trace policy: `trace: 'on-first-retry'`; screenshots `only-on-failure`; video `retain-on-failure` (see config `use`).

---

## Copy-paste: list tests only

```bash
cd nursenest-core
npx playwright test -c playwright.release-gate.config.ts --list
# or
npm run qa:release-gate:list
```

## Copy-paste: full gate (local target)

```bash
cd nursenest-core
export BASE_URL=http://127.0.0.1:3000
npm run qa:release-gate:check-env
npm run qa:release-gate
```
