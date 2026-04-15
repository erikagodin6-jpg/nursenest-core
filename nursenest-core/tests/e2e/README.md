# NurseNest Playwright E2E

Production-oriented browser tests under `tests/e2e/`. The Playwright config lives at `playwright.config.ts` (package root).

## Prerequisites

- Install browsers once: `npx playwright install` (from `nursenest-core/`).
- For local runs, start the app: `npm run dev` (default `BASE_URL=http://127.0.0.1:3000`).
- For production or staging, set `BASE_URL` (e.g. `https://www.nursenest.ca`) and `PLAYWRIGHT_SKIP_WEB_SERVER=1` so Playwright does not start `next dev`.
- Optional: put `E2E_PAID_EMAIL` / `E2E_PAID_PASSWORD` in **`.env.playwright.local`** (gitignored) or set `PLAYWRIGHT_DOTENV_PATH` to another file — also loaded before `playwright.config.ts` (`playwright.env.ts`) and by `scripts/check-paid-e2e-credentials.cjs`.

### Local development (no manual exports)

Create a file:

`.env.playwright.local`

With:

```bash
E2E_PAID_EMAIL=your-email@example.com
E2E_PAID_PASSWORD=your-password
BASE_URL=https://www.nursenest.ca
```

Then run (from the `nursenest-core` package root, no `export` needed):

```bash
npx playwright test --project=chromium-paid
```

`paid-test-credentials.ts` loads this file when it exists and does **not** override variables already set (CI injected secrets win). **Do not commit real credentials** — the file is listed in `.gitignore`.

## Layout

| Folder | Purpose |
|--------|---------|
| `setup/` | Auth setup (`auth.setup.ts` = paid seeded account, `auth-free.setup.ts` = free tier) — writes `tests/e2e/.auth/*.json` |
| `helpers/` | Login, console/network observers, country selector, mobile drawer, env helpers |
| `fixtures/` | Optional extended `test` (e.g. `observers.fixture.ts`) |
| `public/` | Marketing / unauthenticated smoke |
| `auth/` | Freemium / free-tier signed-in paywall tests |
| `paid-user/` | Paid subscription smoke + credential copy checks |
| `navigation/` | Header, country selector, cross-route nav |
| `lessons/` | Lesson marketing flows + typography |
| `flashcards/` | Light marketing / discovery checks |
| `cat/` | CAT marketing entrypoints and pathway clarity |
| `pricing/` | Pricing route smoke |
| `regression/` | Cross-cutting happy paths (e.g. RN smoke) |

## Projects (desktop / mobile / auth)

- **`chromium`** — Default desktop Chrome; runs all `*.spec.ts` except files ignored per project (see config).
- **`mobile`** — iPhone 12 viewport; runs `lesson-flows.mobile.spec.ts` only.
- **`setup-paid-auth` + `chromium-paid`** — Registered when paid credentials exist: `E2E_PAID_EMAIL` + `E2E_PAID_PASSWORD`, or `PLAYWRIGHT_TEST_EMAIL` + `PLAYWRIGHT_TEST_PASSWORD` (see `helpers/paid-test-credentials.ts`). `auth.setup.ts` logs in once, asserts premium on `/app/lessons`, then saves `tests/e2e/.auth/paid-user.json` (override path with `PLAYWRIGHT_PAID_AUTH_STATE`).
- **`setup-free-auth` + `chromium-free`** — Same pattern for free tier with `E2E_FREE_EMAIL` / `E2E_FREE_PASSWORD` and `tests/e2e/.auth/free-user.json` (`PLAYWRIGHT_FREE_AUTH_STATE`).

Screenshots on failure and traces on first retry are enabled globally in config.

## Commands

```bash
# All default specs (chromium project), local dev
npx playwright test

# Public smoke only (fast core routes + observer attachments: `tests/e2e/public/smoke.spec.ts`)
npx playwright test tests/e2e/public/smoke.spec.ts
# or: npx playwright test tests/e2e/public

# Paid user journey (seeded premium account; needs env creds)
E2E_PAID_EMAIL=... E2E_PAID_PASSWORD=... npx playwright test --project=chromium-paid
# or: PLAYWRIGHT_TEST_EMAIL=... PLAYWRIGHT_TEST_PASSWORD=... npx playwright test --project=chromium-paid

# Freemium / free tier (needs env creds)
E2E_FREE_EMAIL=... E2E_FREE_PASSWORD=... npx playwright test --project=chromium-free

# Mobile lesson flow
npx playwright test --project=mobile

# npm scripts (from package.json)
npm run qa:lesson-flows:browser
npm run qa:cat-entrypoints:browser
npm run qa:paid-smoke:browser
# Paid smoke vs production (uses BASE_URL https://www.nursenest.ca; requires paid creds in env or .env.playwright.local)
npm run qa:paid-smoke:production
npm run qa:freemium:browser
```

## Helpers

- **`helpers/attach-observers.ts`** — Console errors + failed requests (`profile: 'public' | 'app'`).
- **`helpers/learner-login.ts`** — Email/password login used by auth setup.
- **`helpers/country-selector.ts`** — Desktop listbox helpers + `HEADER_CHROME`.
- **`helpers/mobile-drawer.ts`** — Region & language drawer on small viewports.

Session JSON files under `tests/e2e/.auth/` are gitignored; do not commit real sessions.
