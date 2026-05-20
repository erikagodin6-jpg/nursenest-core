# Phase 1 — Operational hardening (release QA, paid workflows, mobile practice)

## Summary

Production-safe hardening focused on **Playwright release gate coverage**, **paid learner flows** (lessons, flashcards, linear practice, onboarding, billing), **guest/marketing entry** (including mobile signup viewport), **mobile linear practice alignment** with the CAT-style runner, and **documented unit-test anchors** for Stripe webhook policy and flashcard/CAT inventory parity. No billing or entitlement logic was changed.

## Tests added or updated

| Asset | Purpose |
| --- | --- |
| `tests/e2e/helpers/linear-practice-exam-flow.ts` | Shared **linear** practice hub → runner start, **Submit answer**, rationale panel (split `aside.nn-practice-exam-rationale-panel` or inline `[data-nn-practice-per-item-rationale]`), optional **Next item**. |
| `tests/e2e/release/phase-1-release-qa-guest.spec.ts` | **Release gate guest project**: `/`, `/pricing` (checkout CTA), `/signup`, `/login`, **mobile viewport `/signup`**, unauthenticated `/app/onboarding` → auth, **free-tier lessons gate** (credential-gated). |
| `tests/e2e/paid-user/phase-1-paid-learner-workflows.spec.ts` | **Release gate paid slice**: pathway lessons + lesson detail + optional **Mark studied**; **flashcards pool** vs CAT hub start visibility; **flashcard reveal**; **linear practice** first item + rationale + optional next; **onboarding**; **`/app/account/billing`**; **admin shell** in a fresh browser context (staff-gated). |
| `tests/e2e/mobile/mobile-learner-study-interactions.spec.ts` | **Linear practice mobile** updated from legacy `.nn-question-stem` / **Check answer** to the current **CAT-style runner** (`.nn-cat-question-stem`, **Submit answer**, rationale panel) + overflow assertions. |

## Release gate wiring

- `playwright.release-gate.config.ts`: new project **`release-phase-1-guest`**; **`release-blocking-paid`** regex extended with `phase-1-paid-learner-workflows.spec.ts`.
- `package.json` (app + repo root): **`qa:release-gate`**, **`test:e2e:release`** (alias), and **`test:unit:*`** scripts for Phase 1 validation commands (see below).

### Routes covered (E2E)

**Guest / marketing:** `/`, `/pricing`, `/signup`, `/login`, `/app/onboarding` (unauthenticated redirect), `/app/lessons` (free-tier gate when creds exist).

**Paid (existing + new):** `/app`, `/app/lessons`, `/app/lessons/:id`, `/app/flashcards`, `/app/practice-tests` (linear + CAT probe), `/app/practice-tests/:id` (linear runner), `/app/onboarding`, `/app/account/billing`, `/admin` (optional).

**Still covered by existing release specs (unchanged):** `paid-user-00-fast-sanity` (dashboard + lessons hub), `paid-user-cat-smoke` (CAT hub + three items), `paid-user-entitlements`, `paid-user-api-health`, `release-account-billing-smoke` (`/app/account/overview`, skippable via `E2E_RELEASE_SKIP_BILLING`).

## Skipped / credential-gated

| Condition | Behavior |
| --- | --- |
| No paid E2E credentials | `setup-paid-auth` stub; **`release-blocking-paid`** only lists `paid-e2e-requires-env` (skipped) — same as before. Required: `E2E_PAID_EMAIL` + `E2E_PAID_PASSWORD` or `QA_PAID_*` or `PLAYWRIGHT_TEST_*`. |
| Free-tier gate test | Skipped unless `E2E_FREE_EMAIL` + `E2E_FREE_PASSWORD` or `QA_FREE_*`. |
| Admin smoke | Skipped unless `E2E_ADMIN_EMAIL` + `E2E_ADMIN_PASSWORD`. |
| Stripe full checkout | Remains **opt-in** only in `tests/e2e/paid-user/stripe-subscriber-journey.spec.ts` behind **`E2E_STRIPE_CHECKOUT_JOURNEY=1`** (not added to the release gate). |

## Server-side / contract tests (webhook and inventory)

Documented anchors (run via new npm scripts or `node --import tsx --test`):

- **Stripe webhook / checkout policy:** `src/lib/stripe/stripe-webhook-policy.test.ts`, `src/lib/stripe/stripe-webhook-signature-contract.test.ts`
- **Flashcards vs CAT pool parity (static):** `src/lib/practice-tests/flashcards-inventory-cat-pool-parity.contract.test.ts`
- **Onboarding routing:** `src/lib/context/context-routing.test.ts`

## Commands run (this pass)

| Command | Result |
| --- | --- |
| `npm run typecheck` (in `nursenest-core/`) | **Pass** (full `tsc`, long-running). |
| `npm run test:unit:flashcards` | **Pass** |
| `npm run test:unit:practice` | **Pass** |
| `npm run test:unit:stripe` | **Pass** |
| `npm run test:unit:onboarding` | **Pass** |
| `npx playwright test -c playwright.release-gate.config.ts --list` | **Pass** (lists `release-phase-1-guest` + health; paid slice reflects stub when creds absent). |
| `npm run test:e2e:mobile` / full `qa:release-gate` | **Not executed** in this environment (no `BASE_URL` target / no long-running `next dev` + paid session). On failure locally: Playwright artifacts under `nursenest-core/test-results/` (screenshots/traces per Playwright config). |

### Note on `npm test -- flashcards`

This package does not define a root `npm test` script; use **`npm run test:unit:flashcards`** (or the underlying `node --import tsx --test …` invocations) from `nursenest-core/`.

## Remaining gaps (Phase 2 candidates)

1. **Release gate E2E in CI** requires secrets + stable `BASE_URL` (or `PLAYWRIGHT_SKIP_WEB_SERVER=1` against a deployed preview).
2. **`critical-production-routes.spec.ts`** is still **not** in the release regex (intentionally avoids duplicating heavy guest+paid login flows already split across health, guest Phase 1, and paid slice).
3. **CAT "first question only"** is not split out separately from `paid-user-cat-smoke` (still 3 items for stronger regression; adds runtime).
4. **Hydration / oversized client components** from audit reports were not revisited in this pass (no bundle or RSC boundary edits).
5. **Stripe end-to-end checkout** remains opt-in; release gate does not invoke live checkout.

## Recommended Phase 2 refactors

- Split `practice-test-runner-client.tsx` with **behavior-preserving** extracts (footer, linear board, CAT board) once E2E coverage is stable.
- Optional **single** "release smoke" spec that chains storage-state steps to cut duplicate cold navigations (tradeoff: harder failure isolation).
- Consider a **`release-free-auth` setup** project (like paid) to avoid per-test `loginWithCredentials` for free-tier gates when those runs become frequent.

## Audit inputs

Prior handoff referenced audit markdown under `reports/`; full re-read of every audit file was not repeated in this session.

---

## Phase 1 stabilization pass (2026-05-08)

### Release gate wiring (verified)

- **`playwright.release-gate.config.ts`** projects include:
  - `release-health` — `release-health-apis`, `healthz-liveness-burst`
  - **`release-phase-1-guest`** — `phase-1-release-qa-guest.spec.ts`
  - `release-mobile` — depends on guest; `phase-3-release-mobile-smoke.spec.ts`
  - `release-free-user`, `release-admin-user`, smoke-production specs
  - **`release-blocking-paid`** — regex includes `paid-user-00-fast-sanity`, `paid-user-entitlements`, `paid-user-api-health`, `paid-user-cat-smoke`, **`phase-1-paid-learner-workflows`**, `release-account-billing-smoke`
  - `release-synthetic-paid-smoke` — depends on `release-blocking-paid`
- **`BASE_URL`** (or `PLAYWRIGHT_BASE_URL` / `NURSENEST_PRODUCTION_BASE_URL`) is **required** — config throws if unset.
- Scripts from **`nursenest-core/`** package root: **`npm run qa:release-gate`** (= `validate-release-gate-env.mjs` + Playwright), **`npm run qa:predeploy`** (same). Repo root: **`npm run qa:release-gate`** delegates via `--prefix nursenest-core`.
- Low-memory predeploy: **`npm run qa:predeploy:low-memory`** runs `typecheck:critical` + unit scripts + **`qa:release-gate:list`** (same validator + `--list`).

### Commands run (stabilization)

| Command | Result |
| --- | --- |
| `npm run typecheck:critical` | **PASS** (EXIT 0) |
| `npm run test:unit:flashcards` | **PASS** |
| `npm run test:unit:practice` | **PASS** |
| `npm run test:unit:stripe` | **PASS** |
| `npm run test:unit:onboarding` | **PASS** |
| `BASE_URL=http://127.0.0.1:3000 npx playwright test -c playwright.release-gate.config.ts --list` | **PASS** (lists projects; without paid creds, `release-blocking-paid` shows stub `paid-e2e-requires-env` only) |

**Not executed:** full `npm run qa:release-gate` / browser E2E (needs running app + secrets).

### Skip / credential clarity

- **`phase-1-paid-learner-workflows.spec.ts`**: nested **`subscriber journeys`** block uses `test.skip(!hasPaidTestCredentials(), …)` with explicit env var list. **`optional admin smoke`** is separate — skips only with **`SKIP_ADMIN_REASON`** (`E2E_ADMIN_EMAIL` + `E2E_ADMIN_PASSWORD`), not blocked by missing paid vars.
- **`paid-e2e-requires-env.spec.ts`**: skip message names **`phase-1-paid-learner-workflows`** and other paid specs when unpaid.
- **`phase-1-release-qa-guest.spec.ts`**: free-tier test skips with **`E2E_FREE_EMAIL` + `E2E_FREE_PASSWORD`** (or **`QA_FREE_*`**).

### `parsed.summary` / flashcards hub

- **`parseFlashcardInventoryResponse`** success type allows `summary: FlashcardCustomSessionSummary | null`; inventory path uses **`const invSummary = parsed.summary`** then **`invSummary != null`** before reading `matchingCards`. No extra guard added — aligns with **`npm run typecheck:critical`** (clean).

### Full `tsc` / OOM

- Prefer **`npm run typecheck:critical`** in CI/agents. For full **`npm run typecheck`**, use **`NODE_OPTIONS=--max-old-space-size=8192`** (or higher) if the process exits **137** or **OOM**.

### Browser / gate artifacts

- Release config **`outputDir`**: `test-results/release-gate/artifacts`; JSON report: `test-results/release-gate/release-gate-report.json`.

### How to run full release gate locally / staging

```bash
cd nursenest-core
export BASE_URL=https://your-staging.example   # or http://127.0.0.1:3000
# Optional: export E2E_PAID_EMAIL / E2E_PAID_PASSWORD, E2E_FREE_*, E2E_ADMIN_*
npm run qa:release-gate
# Or list only:
npm run qa:release-gate:list
```

