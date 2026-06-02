# RC theme × pathway × surface matrix (2026)

Canonical capture root: **`docs/screenshots/`** (this tree). Use **`PLAYWRIGHT_SKIP_WEB_SERVER=1`** with a single healthy Next instance (`npm run dev:next` from `nursenest-core/`) and **`npm run wait:app:ready`** before batch capture.

## Themes

| Theme token (`[data-theme]`) | Notes |
|------------------------------|--------|
| Ocean | Default calm learner mode |
| Blossom | Supportive / optimistic palette |
| Midnight | Dense / CAT-friendly |

## Pathways (examples)

| Cohort | Example `pathwayId` / hub | Seeded account |
|--------|---------------------------|----------------|
| RN | `us-rn-nclex-rn` (default paid QA) | `qa-paid-test-account-reset` + `npm run seed:auth-qa` |
| RPN / PN | Tier + pathway from reset script | Same email, re-run reset with tier env |
| NP | NP tier + pathway | Same pattern — **no script change** bypasses entitlements |
| New Grad | Pathway from onboarding | |
| Allied | `QA_PAID_TEST_TIER=ALLIED` + allied career env | |

## Surfaces × viewport checklist

Mark **done** when PNG exists under `docs/screenshots/rc-theme-matrix-2026/captured/` with filename  
`{pathway}-{surface}-{theme}-{desktop|mobile}.png`.

Repeat each row for **Ocean**, **Blossom**, and **Midnight** (`[data-theme]` on `<html>` / learner theme preference).

| Surface | Desktop | Mobile | Stable selector / route |
|---------|---------|--------|-------------------------|
| Hub hero (RN) | ☐ | ☐ | `/` → RN hub per `publicExamPrepHubDestinations` |
| Hub hero (RPN) | ☐ | ☐ | PN / RPN marketing hub |
| Hub hero (NP) | ☐ | ☐ | NP hub |
| Hub hero (New Grad) | ☐ | ☐ | New Grad study hub |
| Hub hero (Allied) | ☐ | ☐ | Allied hub (`QA_PAID_TEST_TIER=ALLIED` reset when capturing allied-specific chrome) |
| Dashboard `/app` | ☐ | ☐ | `#nn-learner-main` |
| Readiness / report panels | ☐ | ☐ | `/app` + `/app/readiness` if present — seed includes `readiness_history` + `exam_planner_settings` |
| Practice hub | ☐ | ☐ | `[data-route='practice-tests']` or `/app/practice-tests` |
| CAT entry | ☐ | ☐ | `[data-nn-e2e-practice-hub-cat-exam]` |
| Flashcards hub | ☐ | ☐ | `[data-nn-e2e-flashcards-hub]` |
| Marketing header | ☐ | ☐ | Homepage or hub with `SiteHeader` |
| Footer (marketing) | ☐ | ☐ | `[data-nn-footer-layout="marketing"]` |
| Nav (learner shell) | ☐ | ☐ | `/app` sticky learner chrome |
| OSCE `/app/osce` | ☐ | ☐ | `OsceStation` slug `nn-auth-qa-osce-seed` via `npm run seed:auth-qa` |
| ECG | ☐ | ☐ | No single `/app/ecg` — capture the **entitled** ECG module URL used in product nav (varies by pathway); seed adds a tagged `EcgVideoQuestionPracticeAnswerAttempt` when video questions exist |

## Commands

```bash
cd nursenest-core
# One terminal: healthy Next (secrets + DB aligned with Playwright)
npm run dev:next
# Other terminal: strict readiness (guest); paid capture uses storageState from setup-paid-auth
PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npm run wait:app:ready
# Optional: authenticated probe after setup-paid-auth
# APP_READY_MODE=authenticated APP_READY_STORAGE_STATE=tests/e2e/.auth/paid-user.json \\
#   PLAYWRIGHT_SKIP_WEB_SERVER=1 PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 node scripts/qa/wait-for-app-ready.mjs
```

Manual capture: switch theme in UI, set viewport (desktop 1440×900, mobile Pixel-ish 390×844), save PNGs under `captured/` using the filename pattern above.

## Blockers (fill during capture)

- **No healthy server** — document port, last `wait-for-app-ready` line, and whether `PLAYWRIGHT_SKIP_WEB_SERVER=1` was set (avoid duplicate `next dev` → `EADDRINUSE`).
- **Runtime / compile** — HTML markers in `scripts/qa/wait-for-app-ready.mjs` (`Next.js is compiling`, etc.).
- **Missing inventory** — run `npm run seed:auth-qa` after `qa-paid-test-account-reset.mts` for the same email Playwright uses.
- **Paywall on paid routes** — `subscription` row / tier mismatch; re-run reset, not the QA seed script, for entitlements.
- **Auth / redirect loop** — `APP_READY_CHECK_REDIRECT_LOOPS=1` on guest paths; compare Playwright `redirect-loop-guard` output.
