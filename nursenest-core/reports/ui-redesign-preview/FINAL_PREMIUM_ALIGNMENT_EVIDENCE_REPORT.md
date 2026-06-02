# Final premium alignment — evidence report

**Date:** 2026-05-08  
**Workspace:** `nursenest-core/` (Next app root)  
**Git:** `main` ahead of `origin/main` by 2 commits; large working tree with prior redesign work (see reconciliation below).

---

## Ground rules compliance

**No route or surface is labeled "premium-aligned" in the marketing sense** (code + screenshot/mockup pairing + fixes or documented alignment). This report records **engineering evidence only**: inventory, contracts, automated checks, and honest status of visual debt vs saved references.

---

## Step 1 — Visual reference inventory (full paths)

### `nursenest-core/reports/ui-redesign-preview/` (43 files)

Listed via `find nursenest-core/reports/ui-redesign-preview -type f | sort` (repo-root relative paths below):

- `nursenest-core/reports/ui-redesign-preview/ALLIED_HEALTH_REDESIGN_PLAN.md`
- `nursenest-core/reports/ui-redesign-preview/ALLIED_HEALTH_REDESIGN_SUMMARY.md`
- `nursenest-core/reports/ui-redesign-preview/BLOG_REDESIGN_SUMMARY.md`
- `nursenest-core/reports/ui-redesign-preview/COLOUR_REFINEMENT_2026.md`
- `nursenest-core/reports/ui-redesign-preview/DASHBOARD_REDESIGN_SUMMARY.md`
- `nursenest-core/reports/ui-redesign-preview/FULL_SITE_SCREENSHOT_AUDIT_REPORT.md`
- `nursenest-core/reports/ui-redesign-preview/HOMEPAGE_PRODUCTION_POLISH.md`
- `nursenest-core/reports/ui-redesign-preview/LEARNER_ECOSYSTEM_REDESIGN_SUMMARY.md`
- `nursenest-core/reports/ui-redesign-preview/LEARNER_REDESIGN_PLAN.md`
- `nursenest-core/reports/ui-redesign-preview/LESSON_HUB_PREMIUM_SLICE.md`
- `nursenest-core/reports/ui-redesign-preview/NP_REDESIGN_PLAN.md`
- `nursenest-core/reports/ui-redesign-preview/NP_REDESIGN_SUMMARY.md`
- `nursenest-core/reports/ui-redesign-preview/PATHWAY_PREMIUM_REDESIGN_SUMMARY.md`
- `nursenest-core/reports/ui-redesign-preview/PHASE_5B_HOMEPAGE_QA.md`
- `nursenest-core/reports/ui-redesign-preview/PRICING_REDESIGN_PLAN.md`
- `nursenest-core/reports/ui-redesign-preview/PRICING_REDESIGN_SUMMARY.md`
- `nursenest-core/reports/ui-redesign-preview/README.md`
- `nursenest-core/reports/ui-redesign-preview/REPORT_CARDS_ANALYTICS_SUMMARY.md`
- `nursenest-core/reports/ui-redesign-preview/RN_RPN_REDESIGN_PLAN.md`
- `nursenest-core/reports/ui-redesign-preview/SETTINGS_REDESIGN_SUMMARY.md`
- `nursenest-core/reports/ui-redesign-preview/TOOLS_FAQ_REDESIGN_PLAN.md`
- `nursenest-core/reports/ui-redesign-preview/TOOLS_FAQ_REDESIGN_SUMMARY.md`
- `nursenest-core/reports/ui-redesign-preview/blog-detail-garden-desktop.png`
- `nursenest-core/reports/ui-redesign-preview/blog-index-ocean-desktop.png`
- `nursenest-core/reports/ui-redesign-preview/cat-exam-interface-dark-desktop.png`
- `nursenest-core/reports/ui-redesign-preview/faq-page-garden-desktop.png`
- `nursenest-core/reports/ui-redesign-preview/flashcard-session-dark-desktop.png`
- `nursenest-core/reports/ui-redesign-preview/flashcards-hub-ocean-desktop.png`
- `nursenest-core/reports/ui-redesign-preview/homepage-ocean-desktop.png`
- `nursenest-core/reports/ui-redesign-preview/homepage-regression-fixes-2026-05-08.md`
- `nursenest-core/reports/ui-redesign-preview/learner-dashboard-garden-desktop.png`
- `nursenest-core/reports/ui-redesign-preview/lesson-page-desktop-ocean-desktop.png`
- `nursenest-core/reports/ui-redesign-preview/lesson-page-mobile-dark-mobile.png`
- `nursenest-core/reports/ui-redesign-preview/np-hub-blossom-desktop.png`
- `nursenest-core/reports/ui-redesign-preview/practice-test-builder-ocean-desktop.png`
- `nursenest-core/reports/ui-redesign-preview/practice-test-runner-garden-desktop.png`
- `nursenest-core/reports/ui-redesign-preview/pricing-desktop.png`
- `nursenest-core/reports/ui-redesign-preview/pricing-mobile.png`
- `nursenest-core/reports/ui-redesign-preview/pricing-page-blossom-desktop.png`
- `nursenest-core/reports/ui-redesign-preview/rn-hub-ocean-desktop.png`
- `nursenest-core/reports/ui-redesign-preview/rn-rpn-playwright-qa/results.json`
- `nursenest-core/reports/ui-redesign-preview/rn-rpn-playwright-qa/results.md`
- `nursenest-core/reports/ui-redesign-preview/rpn-hub-garden-desktop.png`

### `nursenest-core/preview-screenshots/` (100 files)

Regenerate: `find nursenest-core/preview-screenshots -type f | sort`  
Includes `desktop/`, `mobile/`, `homepage-refined/{ocean,midnight,blossom}/`, `qa-rn-rpn/`, `README.md`, `.gitkeep`.

### `nursenest-core/docs/ui-redesign-preview/` (5 files)

- `nursenest-core/docs/ui-redesign-preview/ALLIED_HEALTH_REDESIGN_PLAN.md`
- `nursenest-core/docs/ui-redesign-preview/ALLIED_HEALTH_REDESIGN_SUMMARY.md`
- `nursenest-core/docs/ui-redesign-preview/LESSON_HUB_PREMIUM_SLICE.md`
- `nursenest-core/docs/ui-redesign-preview/PATHWAY_PREMIUM_REDESIGN_SUMMARY.md`
- `nursenest-core/docs/ui-redesign-preview/RN_RPN_REDESIGN_PLAN.md`

Plus `nursenest-core/docs/ui-redesign-preview-homepage-regression-fixes.md`.

### Glob (718 matches under `nursenest-core/`)

`find nursenest-core -type f \( -iname '*homepage*' -o -iname '*hub*' -o -iname '*dashboard*' -o -iname '*pricing*' -o -iname '*lessons*' -o -iname '*figma*' -o -iname '*mockup*' -o -iname '*screenshot*' -o -iname '*preview*' \)`

---

## Step 2 — Route families (status)

| Family | Token vs real layout vs no update | Notes |
|--------|-----------------------------------|--------|
| **Public** | Mixed | `premium-*` and marketing/lesson components in modified tree; no per-route screenshot sign-off this pass. |
| **Learner** | Mixed | Learner shells, paywall, pathway lessons; full smoke needs server + creds. |

**Fully modernized:** not claimed. **Still legacy:** see plan MDs and `qa-rn-rpn/*-fail.png` names.

---

## Step 3 — Quality bar

No new product UI in this pass. Prior work targets placeholders, i18n, dark mode, CTAs, 320–375px; E2E not re-run without `BASE_URL`.

---

## Step 4 — Theme UI

`PUBLIC_MARKETING_THEME_ALLOWLIST` = `[ocean]`; `publicMarketingThemeChoiceCount()` = 1; public header **omits** theme control; full `ThemePicker` unchanged in account/learner. See `theme-registry.ts`, `site-header.tsx`, `theme-registry.public-marketing.contract.test.ts`.

---

## Step 5 — Playwright

**Updated:** `tests/e2e/public/premium-smoke-breadth.spec.ts` — public theme control hidden (0 Theme buttons in `HEADER_CHROME`); homepage main `a[href]` sanity (40 links).  
**Not executed** against a live app in this session.

---

## Step 6 — Validation (from `nursenest-core/`)

| Command | Result |
|---------|--------|
| `npm run typecheck:critical` | **PASS** after `rm -rf .next/dev/types` (corrupt dev `routes.d.ts`) |
| `npm run test:homepage` | **PASS** |
| `npx playwright test -c playwright.release-gate.config.ts --list` | **PASS** (19 tests, 9 files) |

---

## Step 7 — Evidence artifacts

No new PNGs this session. Existing: `reports/ui-redesign-preview/*.png`, `preview-screenshots/**`.

---

## Reconciliation (git)

Branch has extensive unstaged/staged redesign edits; this pass only reconciles Playwright with theme allowlist + adds this report.

---

## Blockers

| Type | Detail |
|------|--------|
| release-blocking | Full `qa:release-gate` not run here |
| visual polish | Pathway/mobile `*-fail.png` artifacts |
| build/memory | Stale `.next/dev/types` can break typecheck |
| missing credentials | Paid E2E |
| still legacy UI | Surfaces without paired screenshot review |

---

## Files changed this pass

- `nursenest-core/tests/e2e/public/premium-smoke-breadth.spec.ts`
- `nursenest-core/reports/ui-redesign-preview/FINAL_PREMIUM_ALIGNMENT_EVIDENCE_REPORT.md`

---

## Routes (tests / release gate)

Premium breadth: `/`, `/pricing`, `/faq`, `/blog`, `/tools`, `/tools/med-math`, `/pre-nursing`, `/question-bank`, `/us/rn/nclex-rn`, `/canada/rn/nclex-rn`, `/allied-health`, `/us/new-grad`; gated `/app`. Release gate lists health, guest marketing, mobile, free/admin smoke, synthetic paid paths.

---

*End of report.*

---

## Addendum (2026-05-08): Playwright continuous QA pass

Detailed Playwright runs, exit codes, and the **proxy.ts auth redirect fix** are captured in:

- `reports/ui-redesign-preview/PLAYWRIGHT_CONTINUOUS_QA_EVIDENCE.md`
- `docs/PLAYWRIGHT_CONTINUOUS_QA_EVIDENCE.md` (duplicate)

Non-contradiction: this pass focuses on **E2E harness + edge auth correctness** (Playwright webServer, IPv4 base URL, RN hub API expectation, phase-1 pricing locator scope, **NextAuth 3xx passthrough in `src/proxy.ts`**). Full `qa:release-gate` with paid credentials remains the deploy checklist when creds are available.


**Follow-up (same day):** RN marketing practice hub (`…/questions`) now keeps `MarketingPracticeQuestionsHubClient` mounted when pathway-scoped question count is zero (with ramping banner), fixing learner-surfaces CAT/linear gating smoke and aligning UX with “modes stay visible while bank ramps.” Evidence: `PLAYWRIGHT_CONTINUOUS_QA_EVIDENCE.md`.
