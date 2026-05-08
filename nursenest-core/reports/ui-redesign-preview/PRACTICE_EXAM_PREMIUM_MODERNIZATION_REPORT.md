# Practice exam — premium modernization (UI shell)

**Date:** 2026-05-08  
**Scope:** Linear practice session with split rationale (`nn-practice-exam-runner` on `/app/practice-tests/[id]`) — **visual, copy, and accessibility only.** No changes to question sourcing, scoring, rationale generation logic, persistence, selection, entitlements, or analytics payloads.

## Routes

| Surface | Path |
|--------|------|
| Hub / setup | `/app/practice-tests`, `/app/practice-tests/start` |
| Runner | `/app/practice-tests/[id]` |
| Results | `/app/practice-tests/[id]/results` |

Premium split layout activates when **linear engine + practice delivery + rationale visibility `after_each`** (`linearPracticeSplitReview` in `practice-test-runner-client.tsx`).

## Visual refs (repo paths)

- `reports/ui-redesign-preview/` — this report; existing runner screenshots include `practice-test-runner-garden-desktop.png`, `practice-test-builder-ocean-desktop.png`
- `reports/ui-redesign-preview/preview-screenshots/` — optional curated previews (none added this slice; no dev server in agent session)
- `docs/qa-reports/`, `docs/verification-screenshots/` — use for future QA captures

## Files touched (layout vs token-only)

| Area | Change |
|------|--------|
| `src/components/study/practice-rationale-full-panel.tsx` | Optional `copy` prop; section labels / waiting / locked / related-lessons heading; `RationaleReviewBoardHeader` title prop |
| `src/components/study/practice-rationale-full-panel.types.ts` | **New** — `PracticeRationaleFullPanelCopy` defaults |
| `src/components/study/practice-test-per-item-rationale.tsx` | Forward `copy` to full panel |
| `src/components/student/practice-exam/practice-exam-progress-header.tsx` | `progressLead`, `sessionProgressAriaLabel` (localized progress row) |
| `src/components/student/practice-exam/practice-exam-rationale-panel.tsx` | `ariaLabel`; `data-nn-qa-practice-rationale-column` |
| `src/components/student/practice-test-runner-client.tsx` | `linearRationalePanelCopy` + wiring |
| `src/app/premium-redesign-2026.css` | Split column `min-height:0`; mobile rationale `max-height` for scroll |
| `public/i18n/en/learner.json` | 15 new `learner.practiceTests.run.*` strings |
| `tests/e2e/helpers/linear-practice-exam-flow.ts` | Rationale assert includes `.nn-practice-rsection__body` |
| `tests/e2e/practice-exam/linear-premium-shell.spec.ts` | **New** — desktop + mobile + key-leak guard |

**Logic unchanged:** scoring, API feedback, commit flows, engine — not modified (UI labels and layout only).

## Playwright

- New: `tests/e2e/practice-exam/linear-premium-shell.spec.ts` (paid auth + app; not in `playwright.release-gate.config.ts` by default).
- `npx playwright test tests/e2e/practice-exam/linear-premium-shell.spec.ts --list` — 4 tests.

## Validation (2026-05-08)

- `npm run typecheck:critical` — pass  
- `npm run test:homepage` — pass  
- `npx playwright test -c playwright.release-gate.config.ts --list` — pass  

## Blockers

- Full E2E run needs `next dev`, DB, and paid E2E credentials. Screenshots not attached (no local server in session).

## Legacy

- `practiceTests-i18n-run.contract.test.ts` still reports many missing historical run keys; new keys for this slice were added to `en/learner.json`.
