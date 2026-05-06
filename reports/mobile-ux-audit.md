# Mobile UX audit (NurseNest)

**Canonical edit path:** change this file at **`nursenest-core/docs/mobile-ux-audit.md`** only.  
Copies under `nursenest-core/reports/` or repo root `reports/` are **mirrors** — refresh them after edits (e.g. `cp docs/mobile-ux-audit.md reports/` from package root) or wire CI to sync.

Living document for **premium mobile** goals: no horizontal scroll, readable lesson prose, touch-safe chrome, stable sticky regions, and fast perceived load.

## Automated coverage

| Suite | Command | What it checks |
| --- | --- | --- |
| Mobile Playwright | `npm run test:e2e:mobile` (from `nursenest-core/`) | Viewports **Pixel 7** + **iPhone 14**; document/main horizontal overflow; marketing routes; optional paid learner journey with `storageState` after `setup-paid-auth`. |
| Public usability audit | `npx playwright test tests/e2e/public/mobile-usability-audit.spec.ts` | Touch-target heuristics, drawers; JSON/MD under `test-results/`. |

Paid learner specs run **only** when `E2E_PAID_EMAIL` + `E2E_PAID_PASSWORD` (or `QA_PAID_*` / `PLAYWRIGHT_TEST_*`) are set.

## Manual spot-check (320–430px)

1. **Marketing:** `/`, `/pricing`, `/signup`, RN hub + lessons hub, `/blog` — hamburger, region drawer, no clipped CTAs.  
2. **Learner:** `/app`, lessons hub → lesson body, flashcards, questions, practice-tests (+ CAT entry), `/app/labs`, `/app/ecg-video-quiz`, billing.  
3. **Safe areas:** notched iPhone — bottom nav + exam footers respect `env(safe-area-inset-*)`.  
4. **Keyboard:** iOS focus on inputs does not hide primary actions irrecoverably.

## CSS guardrails

- Global `html, body { overflow-x: hidden; max-width: 100vw; }` (`globals.css`).  
- Lesson `.nn-lesson-prose pre, table { max-width: 100%; overflow-x: auto; }`.

## Report copies

Canonical markdown also lives next to other audits under **`nursenest-core/reports/`** (and may be mirrored at repo root **`reports/`** in CI). Source edits: `docs/mobile-ux-audit.md`, `docs/mobile-layout-regression-checklist.md`, `docs/mobile-navigation-risk-areas.md`.
