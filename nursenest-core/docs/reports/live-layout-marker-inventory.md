# Live Layout Marker Inventory

Generated for the production layout drift investigation.

## Scope

The expected premium/new layout cannot be verified from screenshots alone. These markers are the DOM attributes, route classes, and global CSS selectors that should prove whether production is rendering the redesigned surfaces.

Truthpack note: `.vibecheck/truthpack/*.json` is not present in this checkout, so this inventory is derived from source files and deployment configuration.

## Route-Level DOM Markers

| Surface | Expected marker | Type | Source |
| --- | --- | --- | --- |
| Homepage premium hero | `nn-home-marketing-rich-hero` | DOM class | `src/components/marketing/home/premium-homepage-hero.tsx` |
| Homepage premium hero | `nn-premium-hero-grid` | DOM class | `src/components/marketing/home/premium-homepage-hero.tsx` |
| Homepage premium hero | `nn-premium-hero-panel` | DOM class | `src/components/marketing/home/premium-homepage-hero.tsx` |
| Homepage premium hero | `premium-hero-stats-line` | `data-testid` | `src/components/marketing/home/premium-homepage-hero.tsx` |
| Learner dashboard convergence | `data-nn-learner-dashboard-convergence` | DOM attribute | `src/components/student/learner-dashboard-page-shell.tsx` |
| Learner dashboard convergence | `nn-learner-dashboard-convergence` | DOM class | `src/components/student/learner-dashboard-page-shell.tsx` |
| Learner dashboard convergence | `data-nn-premium-platform-module="learner-dashboard"` | DOM attribute | `src/components/student/learner-dashboard-page-shell.tsx` |
| Learner dashboard convergence | `nn-learner-page-hero` | DOM class | `src/components/student/learner-dashboard-page-shell.tsx` |
| Learner dashboard body | `data-nn-dashboard-canonical-launcher` | DOM attribute | `src/components/student/learner-study-home.tsx` |
| Learner dashboard body | `nn-dash-band--study-modes` | DOM class | `src/components/student/learner-study-home.tsx` |
| Learner dashboard body | `nn-learner-cockpit-analytics` | DOM class | `src/components/student/learner-study-home.tsx` |
| Learner report card convergence | `data-nn-learner-report-card-convergence` | DOM attribute | `src/app/(student)/app/(learner)/account/_lib/learner-report-card-route.tsx` |
| Learner report card convergence | `nn-learner-report-card-convergence` | DOM class | `src/app/(student)/app/(learner)/account/_lib/learner-report-card-route.tsx` |
| Learner report card premium body | `nn-report-card-premium` | DOM class | `src/components/student/learner-report-card-premium.tsx` |
| Practice tests premium hub | `data-nn-learner-area="practice-tests"` | DOM attribute | `src/components/student/practice-tests-hub-client.tsx` |
| Practice tests premium hub | `data-nn-premium-platform-module="practice-tests"` | DOM attribute | `src/components/student/practice-tests-hub-client.tsx` |
| Practice tests premium hub | `nn-practice-tests-hub-premium` | DOM class | `src/components/student/practice-tests-hub-client.tsx` |
| Practice tests hero | `data-nn-e2e-practice-exam-first-hero` | DOM attribute | `src/components/student/practice-tests-hub-client.tsx` |
| Practice tests builder | `data-nn-practice-exam-hub-convergence` | DOM attribute | `src/components/student/practice-tests-hub-client.tsx` |
| Practice tests builder | `nn-premium-practice-hub-builder` | DOM class | `src/components/student/practice-tests-hub-client.tsx` |
| Flashcards premium hub | `data-nn-premium-flashcard-convergence` | DOM attribute | `src/components/flashcards/flashcards-hub-client.tsx` |
| Flashcards premium hub | `data-nn-premium-platform-module="flashcards"` | DOM attribute | `src/components/flashcards/flashcards-hub-client.tsx` |
| Flashcards premium hub | `data-nn-e2e-flashcards-hub` | DOM attribute | `src/components/flashcards/flashcards-hub-client.tsx` |
| Flashcards premium hub | `nn-flashcards-hub-premium` | DOM class | `src/components/flashcards/flashcards-hub-client.tsx` |
| Flashcards hero | `data-nn-e2e-flashcards-compact-header` | DOM attribute | `src/components/flashcards/flashcards-hub-client.tsx` |
| Flashcards deck library | `data-nn-e2e-flashcards-canonical-grid` | DOM attribute | `src/components/flashcards/flashcards-hub-client.tsx` |
| CAT/practice session shell | `data-nn-premium-platform-module="exam-session"` | DOM attribute | `src/components/exam/exam-session-shell.tsx` |
| CAT/practice session shell | `data-nn-exam-mode="cat"` | DOM attribute | `src/components/exam/exam-session-shell.tsx` |
| CAT/practice session shell | `nn-exam-session-premium` | DOM class | `src/components/exam/exam-session-shell.tsx` |
| CAT question card | `nn-cat-question-card--exam-stack` | DOM class | `src/components/study/cat-question-card.tsx` |
| CAT answer options | `data-nn-qa-exam-format="mcq"` | DOM attribute | `src/components/study/cat-question-card.tsx` |
| Practice session shell | `data-nn-premium-platform-module="practice-session"` | DOM attribute | `src/components/study/practice-session-layout.tsx` |
| Practice question card | `nn-practice-q-card--premium` | DOM class | `src/components/study/practice-question-card.tsx` |
| Marketing questions hub | `MarketingPracticeQuestionsHubClient` | RSC/client reference in HTML payload | `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/questions/page.tsx` |
| Marketing questions hub | `PathwayHero` | Server component import / expected hero component | `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/questions/page.tsx` |
| Marketing lessons hub | `nn-premium-lessons-system` | DOM class | `src/app/premium-redesign-2026.css` and lessons hub components |
| Marketing lessons hub | `nn-premium-lessons-hub-hero` | DOM class | `src/app/premium-redesign-2026.css` and lessons hub components |
| Marketing header | `data-nn-header-layout="marketing-row4"` | DOM attribute | `src/app/premium-redesign-2026.css`, `src/components/layout/site-header.tsx` |
| Marketing footer | `data-nn-footer-layout="marketing"` | DOM attribute | `src/app/premium-redesign-2026.css` |

## Global Premium CSS Selectors

These selectors prove that the premium stylesheet was bundled, but they do not prove a route rendered the redesigned body by themselves.

- `nn-home-marketing-rich-hero`
- `nn-premium-hero-grid`
- `nn-premium-hero-panel`
- `nn-premium-hero-ecg`
- `nn-premium-hero-mini`
- `nn-premium-home-section`
- `nn-premium-lessons-system`
- `nn-premium-lesson-detail-shell`
- `nn-premium-pathway-lesson-header[data-nn-premium-lessons-reading-hero]`
- `data-nn-premium-lessons-reading-main`
- `data-nn-premium-lessons-section-system`
- `data-nn-premium-lessons-on-this-page`
- `data-nn-premium-lessons-study-rail`
- `data-nn-premium-individual-lesson-actions`
- `data-nn-premium-individual-lesson-progress`
- `nn-premium-auth-system`
- `data-nn-premium-auth-subscription-required`
- `data-nn-learner-ds`
- `data-nn-premium-full-platform-convergence`
- `data-nn-premium-platform-family`
- `data-nn-premium-platform-module`
- `data-nn-premium-platform-sticky-controls`
- `data-nn-hub-premium-tone`
- `nn-premium-flashcard-stack`
- `data-nn-premium-flashcard-active-session`
- `data-nn-premium-flashcard-bookmarks`
- `data-nn-premium-flashcard-confidence`
- `data-nn-footer-layout="marketing"`

## Marker Interpretation

- If a route marker is absent from the repo, classify as **A**.
- If route markers exist in the repo/local build but not live HTML/RSC payload, classify as **B** unless deployment SHA proves current code.
- If route markers exist in live CSS/JS but not live DOM for the route, classify as **C**.
- If emitted live static asset URLs return HTML or wrong content type, classify as **D**.
