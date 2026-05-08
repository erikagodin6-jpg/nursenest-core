# Release gate — quick checklist

Use with [`nursenest-core/docs/testing/release-gate-runbook.md`](../nursenest-core/docs/testing/release-gate-runbook.md) and `nursenest-core/scripts/validate-release-gate-env.mjs`.

## Prerequisites

- [ ] Working directory: `nursenest-core/` (active Next app package)
- [ ] App reachable at the origin set in `BASE_URL` (or implicit default `http://localhost:3000` for local-only runs)
- [ ] For remote/staging: `export BASE_URL=https://…` and `export PLAYWRIGHT_SKIP_WEB_SERVER=1`
- [ ] Optional creds for full coverage: paid, free, admin (see validate script output)

## Env checklist (from `validate-release-gate-env.mjs`)

- [ ] **Target URL:** `BASE_URL` (preferred) or `PLAYWRIGHT_BASE_URL` or `NURSENEST_PRODUCTION_BASE_URL` — or implicit default `http://localhost:3000` for local
- [ ] **Paid learner (optional):** one of `E2E_PAID_*`, `QA_PAID_*`, or `PLAYWRIGHT_TEST_*` email+password pairs
- [ ] **Free learner (optional):** `E2E_FREE_*` or `QA_FREE_*` email+password
- [ ] **Admin (optional):** `E2E_ADMIN_EMAIL` + `E2E_ADMIN_PASSWORD`

## Commands

Run from `nursenest-core/`:

| Step | Command |
|------|---------|
| Preflight | `npm run qa:release-gate:check-env` |
| List tests | `npm run qa:release-gate:list` or `npx playwright test -c playwright.release-gate.config.ts --list` |
| Guest / free slice | `npm run qa:release-gate:guest` |
| Paid slice | `npm run qa:release-gate:paid` |
| Mobile slice | `npm run qa:release-gate:mobile` |
| Full gate | `npm run qa:release-gate` or `npm run qa:release-gate:all` |

### Dev server locally

```bash
export BASE_URL=http://127.0.0.1:3000
npm run dev   # align PORT with BASE_URL
```

### Production-style locally

```bash
npm run build && npm run start   # set PORT/BASE_URL consistently
```

### Staging

```bash
export BASE_URL=https://your-staging-host.example.com
export PLAYWRIGHT_SKIP_WEB_SERVER=1
npm run qa:release-gate
```

## Artifact locations

| Kind | Path under `nursenest-core/` |
|------|------------------------------|
| Playwright output dir | `test-results/release-gate/artifacts/` |
| JSON report | `test-results/release-gate/release-gate-report.json` |
| HTML report (optional) | Set `RELEASE_GATE_HTML_REPORT=1` → `test-results/release-gate/playwright-report/` |

## Copy-paste validation

```bash
cd nursenest-core
npm run typecheck:critical
npx playwright test -c playwright.release-gate.config.ts --list
npm run qa:release-gate:list
```
