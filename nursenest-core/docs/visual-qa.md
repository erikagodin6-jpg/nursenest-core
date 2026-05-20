# Visual QA — authenticated route pack and baselines

This document describes **local** visual acceptance for learner hubs and marketing pathway surfaces. It prevents the common failure mode where `/app/*` screenshots are taken **signed out** (before/after PNGs identical on the sign-in gate).

## Truthpack

The `.vibecheck/truthpack/` bundle is **not present in this workspace clone**. When it exists elsewhere in the monorepo, treat it as the source of truth for routes and product names; if it conflicts with this doc, **truthpack wins**.

## Required environment (fail loud)

Scripts validate before Playwright runs (`scripts/validate-visual-qa-env.mjs` via `tests/e2e/visual-qa/visual-qa-global-setup.ts`):

| Variable | Why |
|----------|-----|
| `AUTH_SECRET` **or** `NEXTAUTH_SECRET` | Must match the Next.js app you are testing (same as `npm run dev`). |
| `NEXTAUTH_URL` **or** `AUTH_URL` | Must be the **origin** under test (e.g. `http://127.0.0.1:3000`). Misalignment produces valid login but **empty session on `/app`**, i.e. the sign-in gate. |
| Paid learner pair (for auth only) | `E2E_PAID_EMAIL` + `E2E_PAID_PASSWORD`, or `QA_PAID_*`, or `PLAYWRIGHT_TEST_EMAIL` + `PLAYWRIGHT_TEST_PASSWORD`. Never commit real values. |

Optional:

| Variable | Purpose |
|----------|---------|
| `PLAYWRIGHT_BASE_URL` | Base URL for Playwright (default `http://127.0.0.1:3000`). Falls back to `BASE_URL`. |
| `PLAYWRIGHT_SKIP_WEB_SERVER` | Set to `1` if the app is already running (same pattern as other E2E configs). |
| `DATABASE_URL` | Forwarded into the auto-started `npx next dev` webServer when set (matches `playwright.mobile.config.ts`). |
| `PLAYWRIGHT_VISUAL_QA_AUTH_STATE` | Override path for saved `storageState` JSON (default: `playwright/.auth/learner-paid.json`). |
| `VISUAL_QA_LABEL` | Label segment in PNG names (`before`, `after`, etc.); default `capture`. Non-alphanumeric characters are sanitized. |

Copy **`nursenest-core/.env.playwright.example`** → **`.env.playwright.local`** (gitignored) and fill placeholders. See also `tests/e2e/README.md` and `docs/RELEASE_QA.md`.

## Playwright storage state (paid learner)

Visual QA uses a **dedicated** auth file so it never overwrites the default E2E file `tests/e2e/.auth/paid-user.json`:

- **Default path:** `nursenest-core/playwright/.auth/learner-paid.json` (gitignored).
- **Mechanism:** `playwright.visual-qa.config.ts` sets `PLAYWRIGHT_PAID_AUTH_STATE` to that path for the `setup-visual-qa-auth` project only, then reuses the existing **`tests/e2e/setup/auth.setup.ts`** (same UI login + premium checks as release gate).

### Create or refresh storage state

From `nursenest-core/` with the app reachable and env vars set:

```bash
npm run visual-qa:auth
```

### Deterministic paid learner data (local DB)

For weak-area tiles, graded practice aggregates, flashcard deck `nn-auth-qa-e2e-deck`, and planner rows, run **after** `qa-paid-test-account-reset.mts` and **before** Playwright:

```bash
npm run seed:auth-qa
```

See `scripts/seed-authenticated-qa-learner.mts` header for `AUTH_QA_USER_EMAIL`, `AUTH_QA_SEED_RESET`, and email alias rules.

Prerequisites: seeded paid QA user with completed onboarding and premium access (see `scripts/qa-paid-test-account-reset.mts` and paid E2E docs). If login fails, see attachments under `test-results/` from the setup project.

## NPM scripts (from `nursenest-core/`)

| Script | Purpose |
|--------|---------|
| `npm run visual-qa:check-env` | Validate secrets + auth URL only. |
| `npm run visual-qa:auth` | Validate + run **setup** project (writes `playwright/.auth/learner-paid.json`). |
| `npm run visual-qa:capture` | Validate + require storage file + run **route pack** PNG capture. |
| `npm run visual-qa:critical` | Validate + require storage file + run **3× `toHaveScreenshot`** regression vs committed snapshots. |
| `npm run visual-qa:baseline` | Copy `latest/**/*.png` → `baseline/**/*.png` under `.visual-acceptance/routes/`. |
| `npm run test:e2e:visual-qa-guest-baseline` | Guest marketing homepage pixel baselines (ocean / blossom / midnight + mobile); writes under git-root `docs/screenshots/visual-regression-baseline/` (PNG gitignored at repo root). |

Update screenshot baselines after intentional UI changes:

```bash
npx playwright test -c playwright.visual-qa.config.ts --project=visual-qa-critical-regression --update-snapshots
```

## Where PNGs live

- **Route pack:** `nursenest-core/.visual-acceptance/routes/<route-slug>/latest/<viewport>-<label>.png`
  - `viewport`: `mobile` (390×844), `tablet` (768×1024), `desktop` (1280×800) — aligned with existing visual regression (`paid-user-visual-regression.spec.ts` mobile size).
- **`latest/`** is gitignored (ephemeral).
- **`baseline/`** is optional: commit a **small** set for team review, or keep baselines local-only / CI artifact; policy is up to the team.

## Route pack (canonical URLs)

Resolved from code (`CANONICAL_PATHWAY_HUB`, `CANADA_NEW_GRAD_MARKETING_HUB_PATH`, `US_NEW_GRAD_TRANSITION_PATHWAY`, CAT helpers, app routes):

| # | Slug | URL | Notes |
|---|------|-----|------|
| 1 | `study-home` | `/app` | **Also covers “Dashboard (learner)”** — same route. |
| 2 | `rn-hub` | `/us/rn/nclex-rn` | Marketing RN NCLEX hub. |
| 3 | `rpn-hub` | `/canada/rpn/rex-pn` | Canada RPN hub (matches CAT entrypoint tests). |
| 4 | `np-hub` | `/np-exam-prep` | Generic US NP discovery hub. Pair with the NP specialty extension pack below. |
| 5 | `allied-landing` | `/allied/allied-health` | Allied global landing. |
| 6 | `allied-occupation-mlt` | `/allied/mlt` | Example occupation hub (`professionKey` from allied registry). |
| 7 | `new-grad-landing` | `/us/rn/new-grad-transition` | US new-grad transition pathway root. |
| 8 | `new-grad-work-area-canada` | `/canada/new-grad` | Canada new-grad marketing hub (distinct from US RN transition). |
| 9 | `flashcards-hub` | `/app/flashcards?pathwayId=us-rn-nclex-rn` | Pathway ID matches `PAID_E2E_DEFAULT_PATHWAY_ID` / QA seed. |
| 10 | `practice-questions` | `/app/questions?pathwayId=us-rn-nclex-rn` | Practice question bank. |
| 11 | `practice-tests` | `/app/practice-tests?pathwayId=us-rn-nclex-rn` | Practice tests hub. |
| 12 | `cat-hub` | `/us/rn/nclex-rn/cat` | Marketing CAT entry (canonical). |
| 13 | `lesson-detail` | First `/app/lessons/*` from hub | **Skip** if no lesson cards in local DB (see spec `test.skip` reason). |
| 14 | _(merged)_ | `/app` | Reported as **Study home** above (dashboard). |
| 15 | `report-card` | `/app/account/report` | Canonical report card (`/app/account/report-card` redirects here). |

**Skips:** Lesson detail skips when the hub has no links (empty seed). Do not hard-fail the whole pack.

### NP specialty extension pack

When NP marketing, sitemap, or specialty discovery work changes, treat the following public routes as the required NP spot-check extension pack even if they are not all part of the minimal authenticated pack above:

- `/np-exam-practice-questions`
- `/np-exam-prep`
- `/np-clinical-cases`
- `/us/np/fnp`
- `/us/np/agpcnp`
- `/us/np/pmhnp`
- `/us/np/whnp`
- `/us/np/pnp-pc`
- `/cnple-practice-questions`
- `/canada-np-exam-prep`
- `/np-study-guide-canada`
- `/canada/np/cnple`

Verify on mobile and desktop that:

- Generic NP umbrella pages render specialty selection before specialty-specific conversion CTAs dominate.
- CNPLE remains clearly Canada-scoped.
- Footer and mega-menu specialty discovery links stay visible without crowding RN / PN prominence.
- No specialty label wraps awkwardly or clips in header / footer chrome.

## `renderTrace` / dev overlays

Server `renderTrace()` uses **`console.debug`** unless `NN_RENDER_TRACE` is truthy (`src/lib/observability/render-trace.ts`). Client `LearnerRenderTraceBanner` uses **`console.info`** for NN_RENDER_TRACE labels — not `console.error`. No change was required for this workstream.

## Figma parity (manual)

Compare `latest/` PNGs to design exports for **emotional tone, hierarchy, and density** — not pixel-perfect matching.

Example file keys (from product design threads — verify access in Figma):

- Flashcards: `pNrPmY3Dt2oxcUJ5NtdiNW`
- Platform design system: `rnyXBAgnLlvD6ms1c8gyHs`

Workflow: export frames at comparable viewport widths, overlay or flip between PNG and Figma in your tool of choice; log deltas in PR notes.

## Visual acceptance checklist (short)

- **Hierarchy:** One primary focal point per screen; supporting content recedes.
- **Density:** Comfortable rhythm; no “wall of equal cards” without breathing room.
- **Emotional tone:** Calm, motivating, premium — aligned with learner governance rules (not internal-dashboard chrome on `/app/*`).
- **CTA:** Primary next step is obvious; destructive or paywalled actions are visually secondary.
- **Depth:** Learner surfaces feel “study-first,” not inventory-first.
- **Anti-dashboard:** Avoid flat metric grids that read as engineering status pages on marketing or study hubs.

## Automated regression (minimal)

`tests/e2e/visual-qa/visual-qa-critical-regression.spec.ts` uses **`toHaveScreenshot`** with `maxDiffPixelRatio: 0.02` and `threshold: 0.25` for:

1. Study home (`/app`)
2. Flashcards hub
3. Practice tests hub

Snapshots live beside the spec under `visual-qa-critical-regression.spec.ts-snapshots/` per Playwright defaults.

## Gitignore decisions

- `playwright/.auth/` — session JSON must not be committed.
- `.visual-acceptance/routes/**/latest/` — ephemeral captures.
- `baseline/` is **not** ignored so teams may commit small reference sets if desired.

## Local web server

`playwright.visual-qa.config.ts` starts **`npx next dev`** on localhost (not `npm run dev` / `server/index.ts`), consistent with `playwright.mobile.config.ts`. It waits on **`/` (HTTP 200)** so `reuseExistingServer` works when you already have `next dev` on 3000 — a mismatched `AUTH_URL` can make **`/api/auth/csrf` return 5xx**, which previously caused Playwright to spawn a **second** dev server and fail with **`EADDRINUSE`**.

For strict auth-route readiness before capture, run `npm run wait:app:ready` (optional `APP_READY_AUTH_CSRF=1`, default) against the same origin.

## CI note

These flows are **credential- and data-dependent**. They are not wired into default CI; keep `qa:release-gate` and existing E2E unchanged. Optional future step: nightly job with secrets + artifact upload for `latest/`.
