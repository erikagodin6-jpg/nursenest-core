# Authenticated QA stabilization — final report

Date: 2026-05-09

## Commands verified (from `nursenest-core/`)

| Command | Exit |
|---------|------|
| `npm run typecheck:critical` | 0 |
| `npm run test:homepage` | 0 |
| `npx playwright test -c playwright.visual-qa.config.ts --project=visual-qa-authenticated-baseline --list` | 0 |

## Deliverables

- `scripts/seed-authenticated-qa-learner.mts` + `npm run seed:auth-qa`
- `tests/e2e/helpers/spawn-wait-for-app-ready.ts` + call from `tests/e2e/setup/auth.setup.ts`
- `tests/e2e/visual-qa/authenticated-learner-visual-baseline.spec.ts` + `visual-qa-authenticated-baseline` project
- `docs/screenshots/authenticated-qa-matrix/README.md` (git root) + `docs/screenshots/README.md` row
- `docs/visual-qa.md` + `scripts/qa-paid-test-account-reset.mts` seed order notes

## Reliability assessment

**Partially improved.** Paid login now waits on `wait-for-app-ready` before credentials flow. DB seed fills weak topics, flashcards, planner, readiness row, and (when `Core Readiness Exam` + bank questions exist) graded sessions. **Not fully proven** without a full `chromium-paid` run and first-time `--update-snapshots` capture on a real env.

## Truthpack

`.vibecheck/truthpack/product.json` was not found in this workspace; entitlements follow existing `Subscription` + app access code paths.
