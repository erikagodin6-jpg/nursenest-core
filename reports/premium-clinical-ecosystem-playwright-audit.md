# Playwright audit — premium clinical ecosystem

**Date:** 2026-05-09  
**Status:** **Not executed** in this audit session (requires running Next app + auth/fixtures + optional `DATABASE_URL`).

## Available configs

| npm script | Config |
|------------|--------|
| `test:e2e:learner-surfaces-smoke` | `playwright.learner-surfaces-smoke.config.ts` (6 tests) |
| `test:e2e:mobile` | `playwright.mobile.config.ts` |
| `qa:release-gate` | `playwright.release-gate.config.ts` |
| `visual-qa:capture` | Screenshots — requires `visual-qa` env |

## Routes to hit

`/`, `/app`, `/app/account/progress`, `/app/labs`, `/app/med-calculations`, `/app/osce`, `/app/ecg-video-quiz`, `/app/practice-tests/start`, `/app/flashcards`, `/app/lessons`

## Checklist

- Broken links, horizontal overflow (mobile), Midnight readability, empty images, hot pink (visual).

## Screenshots

Capture when `visual-qa:capture` or manual run completes; attach to `docs/qa-reports/` or CI artifacts.

**Blocker for Part 4 completion:** staffed run with staging/local server.
