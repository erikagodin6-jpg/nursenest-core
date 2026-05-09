# Marketing screenshot capture targets

**Source of truth:** `nursenest-core/scripts/capture-slot-targets.json` (also summarized below).

**Outputs:** `nursenest-core/public/marketing/screenshots/screenshot1.png` … `screenshot15.png`, plus `capture-manifest.json` after each run.

**Upload:** Do **not** upload to DigitalOcean Spaces or overwrite production `screenshot{N}.png` keys until product reviews local PNGs — see `docs/SCREENSHOT_CAPTURE_TO_CDN.md`.

## CDN slots (1–15)

| Target id | Slot | Output file | Route / resolution | Viewport | Auth | Theme | Manual review |
|-----------|------|-------------|---------------------|----------|------|-------|----------------|
| slot-01-practice-rationale | 1 | screenshot1.png | `/app/questions/session` | desktop | demo | ocean | Rationale column visible; start session if empty |
| slot-02-flashcards-study | 2 | screenshot2.png | `/app/flashcards` or `SCREENSHOT_FLASHCARD_STUDY_PATH` | desktop | demo | ocean | Override path for active deck + on-card rationale |
| slot-03-learner-dashboard | 3 | screenshot3.png | `/app` | desktop | demo | ocean | Dashboard shell loaded |
| slot-04-question-bank-advanced | 4 | screenshot4.png | `/app/questions/bank` | desktop | demo | ocean | Advanced / NGN-style item when catalog allows |
| slot-05-progress-report | 5 | screenshot5.png | `/app/account/report` | desktop | demo | ocean | Topic accuracy / readiness visible |
| slot-06-cat-launch-or-session | 6 | screenshot6.png | `SCREENSHOT_CAT_SESSION_PATH` or CAT launch query | desktop | demo | midnight | Override for in-flight adaptive session |
| slot-07-cat-results-insights | 7 | screenshot7.png | `SCREENSHOT_CAT_RESULTS_PATH` or `/app/practice-tests/cat-insights` | desktop | demo | midnight | Override for specific results URL |
| slot-08-study-plan | 8 | screenshot8.png | `/app/study-plan` | desktop | demo | ocean | Plan cards / paywall state acceptable |
| slot-09-smart-review | 9 | screenshot9.png | `/app/review` | desktop | demo | ocean | Richer with answered history |
| slot-10-question-bank-list | 10 | screenshot10.png | `/app/questions` | desktop | demo | ocean | Practice hub / topic tiles |
| slot-11-confidence-analytics | 11 | screenshot11.png | `/app/analytics` | desktop | demo | ocean | Needs graded history for charts |
| slot-12-lesson-detail | 12 | screenshot12.png | `SCREENSHOT_LESSON_DETAIL_PATH` or first hub lesson | desktop | demo | blossom | Prefer explicit lesson id for stability |
| slot-13-lesson-library | 13 | screenshot13.png | `/app/lessons` | desktop | demo | ocean | Virtual list density |
| slot-14-marketing-home-desktop | 14 | screenshot14.png | `/` | desktop | guest | ocean | Marketing hero + previews |
| slot-15-ecg-workstation | 15 | screenshot15.png | `/modules/ecg/basic/lessons` | desktop | demo | midnight | ECG / telemetry hub |

**Auth:** `guest` = no login. `demo` = `SCREENSHOT_DEMO_EMAIL` / `SCREENSHOT_DEMO_PASSWORD` (seed via `scripts/seed-screenshot-demo-user.ts`).

## Supplementary (not CDN slot filenames)

| Target id | File | Route | Viewport | Auth |
|-----------|------|-------|----------|------|
| extra-home-mobile | supplementary/home-mobile.png | `/` | mobile | guest |
| extra-learner-nav-mobile | supplementary/mobile-learner-nav.png | `/app` + nav drawer | mobile | demo |
| extra-labs-hub | supplementary/labs-hub.png | `/app/labs` | desktop | demo |
| extra-med-calc | supplementary/med-calculations-hub.png | `/app/med-calculations` | desktop | demo |
| extra-settings-account | supplementary/settings-account.png | `/app/account/settings` | desktop | demo |
| extra-pricing | supplementary/pricing.png | `/pricing` | desktop | guest |
| extra-practice-tests-hub | supplementary/practice-tests-hub.png | `/app/practice-tests` | desktop | demo |

## CLI helpers

From `nursenest-core/`:

```bash
node scripts/capture-marketing-screenshots.mjs --list-targets
node scripts/capture-marketing-screenshots.mjs --targets=slot-14-marketing-home-desktop
SCREENSHOT_TARGET_IDS=slot-06-cat-launch-or-session,slot-07-cat-results-insights npm run capture:marketing-screenshots
```
