# Phase 2 — Release gate stability

## Summary

Phase 2 hardens the Phase 1 release gate without changing product UI, routes, entitlement logic, or learner/admin behavior. The work adds explicit environment validation, stable workspace artifact paths, transparent credential skips, and a memory-conscious release smoke wrapper for predeploy use.

## Commands added or changed

| Command | Purpose |
| --- | --- |
| `npm run qa:release-gate:check-env` | Validates release-gate target URL and reports optional paid/free/admin credential coverage without printing secret values. |
| `npm run qa:release-gate:list` | Runs env validation, then lists the full release-gate project/test inventory. |
| `npm run qa:release-gate` | Runs env validation, then the full configured release gate. |
| `npm run qa:release-gate:smoke` | Runs the selective wrapper: guest/health/mobile always when `BASE_URL` is valid; paid/free/admin projects only when their credential group is complete. |
| `npm run qa:release-gate:smoke:list` | Dry-run/list mode for the selective wrapper. |
| `npm run qa:predeploy:low-memory` | Runs `typecheck:critical`, targeted unit anchors, and release-gate list mode. It avoids full `tsc` and avoids browser execution. |

## Environment requirements

### Required

One release target URL is required and must be a full `http` or `https` URL:

- `BASE_URL` (preferred)
- `PLAYWRIGHT_BASE_URL`
- `NURSENEST_PRODUCTION_BASE_URL`

Missing or invalid target URL is a hard failure.

### Optional credential groups

Missing credentials are not hard failures. They are reported as `WILL SKIP` with the affected project names.

| Group | Accepted env pairs | Affected coverage when missing |
| --- | --- | --- |
| Paid learner | `E2E_PAID_EMAIL` + `E2E_PAID_PASSWORD`, or `QA_PAID_EMAIL` + `QA_PAID_PASSWORD`, or `PLAYWRIGHT_TEST_EMAIL` + `PLAYWRIGHT_TEST_PASSWORD` | `release-blocking-paid`, `release-synthetic-paid-smoke` |
| Free learner | `E2E_FREE_EMAIL` + `E2E_FREE_PASSWORD`, or `QA_FREE_EMAIL` + `QA_FREE_PASSWORD` | `release-free-user` plus the free-tier gate inside `release-phase-1-guest` |
| Admin staff | `E2E_ADMIN_EMAIL` + `E2E_ADMIN_PASSWORD` | `release-admin-user` |

### Stripe opt-ins

- `E2E_RELEASE_SKIP_BILLING=1` still only skips the read-only account/billing smoke.
- `E2E_STRIPE_CHECKOUT_JOURNEY=1` remains an explicit opt-in for `stripe-subscriber-journey.spec.ts`; it is reported by the preflight but is not added to the default release gate.

## Artifact paths

Release-gate artifacts now stay inside the workspace:

- `test-results/release-gate/artifacts` — Playwright output directory, including failure screenshots, videos, and retained traces.
- `test-results/release-gate/release-gate-report.json` — JSON report.

The release config uses `screenshot: "only-on-failure"`, `video: "retain-on-failure"`, and `trace: "retain-on-failure"`. JSON reporting is used instead of the HTML reporter so `--list` remains stable in low-memory/no-browser predeploy runs.

## Skip behavior

`scripts/validate-release-gate-env.mjs` prints exactly which credential group is missing and which projects will skip. The selective wrapper also prints the project list it will run before invoking Playwright.

With no credentials and a valid `BASE_URL`, `npm run qa:release-gate:smoke` runs:

- `release-health`
- `release-phase-1-guest`
- `release-mobile`

With free credentials, it also runs:

- `release-free-user`

With admin credentials, it also runs:

- `release-admin-user`

With paid credentials, it also runs:

- `setup-paid-auth`
- `release-blocking-paid`
- `release-synthetic-paid-smoke`

## Memory / OOM guidance

Use `npm run qa:predeploy:low-memory` for predeploy environments where full `npm run typecheck` has previously exited `137`. It keeps the stronger full typecheck script unchanged and instead uses:

1. `npm run typecheck:critical`
2. `npm run test:unit:flashcards`
3. `npm run test:unit:practice`
4. `npm run test:unit:stripe`
5. `npm run test:unit:onboarding`
6. `npm run qa:release-gate:list`

For full `npm run typecheck` in constrained hosts, export a larger heap before retrying, for example:

```bash
NODE_OPTIONS=--max-old-space-size=6144 npm run typecheck
```

Do not replace the full typecheck in CI with the low-memory command unless the deploy policy explicitly accepts the narrower gate.

## Validation results

| Command | Result |
| --- | --- |
| `node scripts/validate-release-gate-env.mjs` | **Expected fail** without target URL; reports missing `BASE_URL` and optional credential groups without secret values. |
| `BASE_URL=http://127.0.0.1:3000 node scripts/validate-release-gate-env.mjs` | **Pass**; reports paid/free/admin groups as `WILL SKIP` in this environment. |
| `BASE_URL=http://127.0.0.1:3000 npm run qa:release-gate:check-env` | **Pass**; npm script wrapper for the same preflight. |
| `BASE_URL=http://127.0.0.1:3000 node scripts/run-release-gate-smoke.mjs --list` | **Pass**; lists health, guest, and mobile projects only because paid/free/admin credentials are absent. |
| `npm run typecheck:critical` | **Pass** |
| `npm run test:unit:flashcards` | **Pass** |
| `npm run test:unit:practice` | **Pass** |
| `npm run test:unit:stripe` | **Pass** |
| `npm run test:unit:onboarding` | **Pass** |
| `BASE_URL=http://127.0.0.1:3000 npx playwright test -c playwright.release-gate.config.ts --list` | **Pass**; lists 19 tests across 9 files. |
| `BASE_URL=http://127.0.0.1:3000 npm run qa:release-gate:list` | **Pass**; validates env then lists 19 tests across 9 files. |
| `BASE_URL=http://127.0.0.1:3000 npm run qa:release-gate:smoke:list` | **Pass**; validates env then lists the 9 no-credential guest/health/mobile tests. |
| `BASE_URL=http://127.0.0.1:3000 npm run qa:predeploy:low-memory` | **Pass**; runs critical typecheck, targeted unit anchors, and release-gate list mode. |

## Remaining limitations

- Full browser execution still requires a live app target. This environment can list projects without starting the app, but a full run needs a stable local or deployed `BASE_URL`.
- Paid/free/admin browser slices require dedicated QA accounts. Phase 2 makes missing coverage explicit; it does not create or seed accounts.
- Full Stripe checkout remains opt-in and manual/staging-oriented because it can create real billing side effects.
