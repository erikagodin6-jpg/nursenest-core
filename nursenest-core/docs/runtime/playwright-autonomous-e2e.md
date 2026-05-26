# Playwright Autonomous Runtime E2E

NurseNest uses Playwright as the default browser-runtime safety net for Codex/Cursor changes. The critical suite is intentionally small and pathway-aware: it validates CAT entrypoints, theme persistence, flashcards discovery, practice exam launcher behavior, route loops, chunk failures, and optional authenticated launch checks when paid QA credentials are configured.

## Commands

- `npm run test:e2e:runtime-critical` runs Chromium, Firefox, and WebKit.
- `npm run test:e2e:runtime-critical:webkit` runs the Safari-equivalent gate.
- `npm run codex:runtime-gate` is the Codex/Cursor automation hook.
- `npm run test:e2e:runtime-visual:update` records visual baselines for the runtime visual suite.
- `npm run test:e2e:runtime-visual` compares current screenshots to accepted baselines.

Use `BASE_URL=http://127.0.0.1:3039` or `PLAYWRIGHT_BASE_URL=...` to point at an existing server. For local loopback URLs, the config starts `npm run dev:next` automatically.

## MCP Browser Automation

Cursor reads `.cursor/mcp.json` and exposes two browser servers:

- `playwright` for headless Chromium
- `playwright-webkit` for headless WebKit/Safari checks

The same server can be started manually:

```bash
npx @playwright/mcp@0.0.75 --headless --browser=chromium
npx @playwright/mcp@0.0.75 --headless --browser=webkit
```

Codex does not need MCP to run the blocking suite; it should prefer:

```bash
npm run codex:runtime-gate
```

Use MCP when visual or accessibility inspection is needed after a failure.

## Runtime Failure Detection

`tests/e2e/helpers/runtime-critical-observer.ts` fails tests on:

- `route_transition_failure`
- `cat_runtime_bootstrap_failed`
- `activity_bootstrap_failure`
- `chunk_load_failed`
- `malformed_session_detected`
- critical `/_next/static/chunks/*` failures
- critical `/api/practice-tests`, `/api/flashcards/custom-session`, and `/api/auth/session` 5xx responses
- page errors, unhandled rejections, likely route loops, and hydration/runtime crashes

Known local development noise such as missing marketing copy, local DB fail-soft diagnostics, and analytics/favicon requests is filtered so the gate stays focused on runtime reliability.

## Authenticated Checks

The critical suite always runs unauthenticated checks. It also runs authenticated launch checks when one of these credential pairs is available:

- `QA_PAID_EMAIL` / `QA_PAID_PASSWORD`
- `E2E_PAID_EMAIL` / `E2E_PAID_PASSWORD`
- `PLAYWRIGHT_TEST_EMAIL` / `PLAYWRIGHT_TEST_PASSWORD`

Credentials can live in `.env.playwright.local` for local machines and CI secrets for GitHub Actions.

## Codex/Cursor Workflow

1. Make the code change.
2. Run `npm run typecheck:critical`.
3. Run focused unit tests for the touched runtime.
4. Run `npm run codex:runtime-gate`.
5. If WebKit is the concern, run `npm run test:e2e:runtime-critical:webkit`.
6. Inspect `test-results/runtime-critical/results.json`, `playwright-report/runtime-critical`, screenshots, videos, and traces on failure.
7. Patch the regression and rerun the same command before committing.

## CI

`.github/workflows/deployment-gates.yml` installs Chromium, Firefox, and WebKit and uploads:

- `playwright-report/runtime-critical`
- `test-results/runtime-critical`
- `test-results`

The runtime browser gate blocks deploys when the critical suite fails.
