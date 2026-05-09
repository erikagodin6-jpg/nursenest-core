# Screenshot capture → CDN mapping

Maps [`scripts/capture-screenshots.mjs`](../../scripts/capture-screenshots.mjs) targets to **DigitalOcean Spaces** object keys. Public URLs use the existing CDN host from `SCREENSHOT_CDN_BASE` / `HOME_HERO_CDN_BASE_URL`; **only** root keys `screenshot1.png` … `screenshot15.png` are valid marketing/registry slots (no invented paths).

| capture target id | route | local output file (repo-relative) | suggested screenshotN slot | product surface | required manual review notes | CDN overwrite key |
| --- | --- | --- | --- | --- | --- | --- |
| home-desktop | `/` | `screenshots/home/home-desktop.png` | — | Marketing homepage (reference only; not a registry slot) | Full-page marketing capture — crop/editorial use only; do not overwrite learner product PNGs without intent. | *(none — not mapped to screenshotN)* |
| pricing-desktop | `/pricing` | `screenshots/pricing/pricing-desktop.png` | — | Marketing pricing | Verify pricing copy + tier cards match current plans. | *(none)* |
| faq-desktop | `/faq` | `screenshots/faq/faq-desktop.png` | — | Marketing FAQ | Check accordion states and locale. | *(none)* |
| about-desktop | `/about` | `screenshots/about/about-desktop.png` | — | Marketing about | Team/copy freshness. | *(none)* |
| home-mobile | `/` | `screenshots/home/home-mobile.png` | — | Marketing homepage mobile | Safe-area + hero + below-fold crop review. | *(none)* |
| dashboard-desktop | `/app` | `screenshots/dashboard/dashboard-desktop.png` | screenshot3.png | Learner dashboard / study hub | Match streak widgets + pathway context; hide PII. | `screenshot3.png` |
| dashboard-mobile | `/app` | `screenshots/dashboard/dashboard-mobile.png` | *(optional)* | Dashboard mobile | Pick an available slot after static hero/carousel slots are finalized; avoid conflicting overwrites. | *(TBD)* |
| question-bank-desktop | `/app/questions` | `screenshots/practice/question-bank-desktop.png` | screenshot10.png | Question bank list | Filters populated; list not empty. | `screenshot10.png` |
| practice-tests-hub-desktop | `/app/practice-tests` | `screenshots/practice-tests/practice-tests-hub-desktop.png` | screenshot14.png | Practice/CAT hub overview | Should read as full study-system overview per registry id 14. | `screenshot14.png` |
| practice-q-desktop | `/app/questions` | `screenshots/practice/practice-question-runner-desktop.png` | screenshot1.png | Practice runner + rationale | Ensure rationale panel fully visible for registry copy. | `screenshot1.png` |
| cat-exam-desktop | `/app/cat` | `screenshots/cat/cat-exam-session-desktop.png` | screenshot6.png | CAT session | Single-column question + minimal chrome. | `screenshot6.png` |
| cat-exam-mobile | `/app/cat` | `screenshots/cat/cat-exam-session-mobile.png` | — | CAT mobile | Optional variant — map to spare slot only after editorial decision. | *(optional)* |
| cat-results-desktop | `/app/cat/results` | `screenshots/cat/cat-results-readiness-desktop.png` | screenshot7.png | CAT results / readiness | Readiness score + weak areas visible. | `screenshot7.png` |
| smart-review-desktop | `/app/review` | `screenshots/review/smart-review-desktop.png` | screenshot9.png | Smart review buckets | Four confidence groups visible. | `screenshot9.png` |
| study-plan-desktop | `/app/study-plan` | `screenshots/study-plan/study-plan-overview-desktop.png` | screenshot8.png | Adaptive study plan | Day cards + blocks readable. | `screenshot8.png` |
| analytics-desktop | `/app/analytics` | `screenshots/analytics/analytics-overview-desktop.png` | screenshot11.png | Confidence analytics | Cards + charts legible. | `screenshot11.png` |
| report-card-desktop | `/app/account/report` | `screenshots/reports/report-card-desktop.png` | screenshot5.png | Topic report / accuracy | Bars + topic rows match “reports” registry story. | `screenshot5.png` |
| flashcards-desktop | `/app/flashcards` | `screenshots/flashcards/flashcards-hub-desktop.png` | screenshot2.png | Flashcard hub/session | Active-recall framing per registry alt text. | `screenshot2.png` |
| flashcards-mobile | `/app/flashcards` | `screenshots/flashcards/flashcards-hub-mobile.png` | — | Flashcards mobile | Optional; spare slot TBD. | *(optional)* |
| lessons-hub-desktop | `/app/lessons` | `screenshots/lessons/lesson-library-desktop.png` | screenshot13.png | Lesson library grid | Pathway filters visible — coordinate with dashboard mobile if both target `screenshot13.png`. | `screenshot13.png` |
| labs-hub-desktop | `/app/labs` | `screenshots/labs/labs-hub-desktop.png` | screenshot15.png | Labs hub | Entitlements/paywall states acceptable if labelled in review; pairs with registry “Study interface” only if copy matches. | `screenshot15.png` |
| med-calculations-hub-desktop | `/app/med-calculations` | `screenshots/med-calculations/med-calculations-hub-desktop.png` | — | Med calculations | Map only when registry reserves a slot for this surface. | *(TBD)* |
| osce-desktop | `/app/osce` | `screenshots/osce/osce-hub-desktop.png` | — | OSCE hub | Empty vs populated states — editorial choice before CDN overwrite. | *(TBD)* |

**Note:** When two rows suggest the same `screenshotN` slot (e.g. lessons hub vs dashboard mobile both pointing at `screenshot13.png`), resolve in manual review: upload the winner to Spaces under that key and update [`screenshot-registry.ts`](../src/lib/marketing/screenshot-registry.ts) labels/descriptions to match the shipped PNG.

After upload, purge CDN/cache if your workflow requires it; URLs remain `https://nursenest-images.tor1.cdn.digitaloceanspaces.com/screenshot{N}.png`.
