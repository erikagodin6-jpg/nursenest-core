# Full-site screenshot / redesign audit report

**Date:** 2026-05-08  
**Scope:** Saved screenshots and markdown design notes under `reports/ui-redesign-preview/`, `preview-screenshots/`, `docs/ui-redesign-preview/`, plus repo-wide globs for homepage/hub/dashboard/pricing/lessons/preview/mockup references.

**Alignment note:** This pass did **not** read Figma MCP or external design files. Visual alignment is against **listed screenshot paths and markdown notes** in-repo only—not "Figma-aligned."

---

## 1. Design reference files (inventory)

### `nursenest-core/reports/ui-redesign-preview/` (markdown + PNGs)

- Phase / implementation: `2026-05-08-phase-1-2-6-implementation.md`, `2026-05-08-phase-3-nav-implementation.md`, `2026-05-08-phase-4-hero-implementation.md`, `2026-05-08-phase-5-homepage-body.md`
- Homepage: `HOMEPAGE_PREMIUM_REDESIGN.md`, `HOMEPAGE_PRODUCTION_POLISH.md`, `PHASE_5B_HOMEPAGE_QA.md`, `homepage-regression-fixes-2026-05-08.md`, `phase5-homepage-apex-full.png`, `phase5-homepage-midnight-full.png`
- Pathway / hubs / learner: `PATHWAY_PREMIUM_REDESIGN_SUMMARY.md`, `RN_RPN_REDESIGN_PLAN.md`, `NP_REDESIGN_PLAN.md`, `NP_REDESIGN_SUMMARY.md`, `ALLIED_HEALTH_REDESIGN_PLAN.md`, `ALLIED_HEALTH_REDESIGN_SUMMARY.md`, `DASHBOARD_REDESIGN_SUMMARY.md`, `LEARNER_REDESIGN_PLAN.md`, `LEARNER_ECOSYSTEM_REDESIGN_SUMMARY.md`, `SETTINGS_REDESIGN_SUMMARY.md`, `LESSON_HUB_PREMIUM_SLICE.md`, `REPORT_CARDS_ANALYTICS_SUMMARY.md`
- Pricing / tools / blog: `PRICING_REDESIGN_PLAN.md`, `PRICING_REDESIGN_SUMMARY.md`, `TOOLS_FAQ_REDESIGN_PLAN.md`, `TOOLS_FAQ_REDESIGN_SUMMARY.md`, `BLOG_REDESIGN_SUMMARY.md`
- Colour: `COLOUR_REFINEMENT_2026.md`
- PNG examples: `homepage-ocean-desktop.png`, `rn-hub-ocean-desktop.png`, `rpn-hub-garden-desktop.png`, `np-hub-blossom-desktop.png`, `pricing-desktop.png`, `pricing-mobile.png`, `faq-page-garden-desktop.png`, `blog-index-ocean-desktop.png`, `blog-detail-garden-desktop.png`, `learner-dashboard-garden-desktop.png`, `flashcards-hub-ocean-desktop.png`, `flashcard-session-dark-desktop.png`, `cat-exam-interface-dark-desktop.png`, `practice-test-runner-garden-desktop.png`, `practice-test-builder-ocean-desktop.png`, `lesson-page-desktop-ocean-desktop.png`, `lesson-page-mobile-dark-mobile.png`
- `README.md`, `rn-rpn-playwright-qa/results.json`, `rn-rpn-playwright-qa/results.md`

### `nursenest-core/preview-screenshots/`

- `README.md`, `desktop/`, `tablet/`, `mobile/` PNG sets (homepage, hubs, dashboard, lesson, pricing, etc.)
- `homepage-refined/` — ocean / midnight / blossom × breakpoints
- `qa-rn-rpn/` — pathway QA captures (including *-fail.png artifacts)
- Phase captures: `phase3-nav-*.png`, `phase4-hero-*.png`, `phase5-*.png`, `homepage-mockup-*.png`

### `nursenest-core/docs/ui-redesign-preview/`

- `PATHWAY_PREMIUM_REDESIGN_SUMMARY.md`, `RN_RPN_REDESIGN_PLAN.md`, `ALLIED_HEALTH_REDESIGN_PLAN.md`, `ALLIED_HEALTH_REDESIGN_SUMMARY.md`, `LESSON_HUB_PREMIUM_SLICE.md`
- `docs/ui-redesign-preview-homepage-regression-fixes.md`

### Glob highlights

- Homepage: `premium-homepage-*.tsx`, `homepage-premium-preview.tsx`
- Hubs: `nursing-tier-hub-page.tsx`, `pathway-lessons-*-hub.tsx`, `learner-dashboard-hub-*.tsx`
- No `*figma*` filenames under `src/`.

---

## 2. Route families → entry components

| Family | Typical shell |
|--------|----------------|
| Marketing | `(marketing)` layouts, `SiteHeader`, `SiteFooter`, `MarketingMainI18nShards` |
| Pathway hubs | `nursing-tier-hub-page.tsx`, `exam-pathway-hub.tsx` |
| Lessons | `marketing-lessons-hub-*`, `lessons-page-shell.tsx` |
| Learner `/app/*` | `learner-dashboard-page-shell.tsx`, `premium-learner-hub.tsx` |
| Pricing / blog / tools / FAQ | `marketing-pricing-page.tsx`, blog routes, `tools-hub-client.tsx` |
| ECG (preview) | `ecg-module-page.tsx` |
| Failsafe | `marketing-default-layout-chrome-failsafe.tsx` |

---

## 3. This pass — changes

### Theme UI (public only)

- `PUBLIC_MARKETING_THEME_ALLOWLIST` = **`[ocean]`** (`NURSENEST_DEFAULT_THEME`).
- `publicMarketingThemeChoiceCount()`; marketing chrome hides theme control when count ≤ 1.
- `ThemePicker` `publicMarketing` returns `null` if ≤1 option.
- Learner full `ThemePicker` unchanged.

### ECG module

- Preview banner: raw amber Tailwind → **`--semantic-warning*`** token-based classes (`ecg-module-page.tsx`).

### Tests

- `theme-registry.public-marketing.contract.test.ts`; wired into `npm run test:homepage`.
- `marketing-qa.ts`: `applyMidnightThemeFromPicker` falls back to `localStorage` + `data-theme` when the public picker is hidden.
- `marketing-visual-qa-guard.spec.ts`: assert no "Theme" button on homepage when single public palette.

---

## 4. Validation results

| Command | Result |
|---------|--------|
| `npm run typecheck:critical` | **Failed** — `.next/dev/types/routes.d.ts` parse errors (pre-existing generated file; not from this diff). |
| `npm run test:homepage` | **Passed** |
| `npx playwright test -c playwright.release-gate.config.ts --list` | **Passed** (19 tests listed) |

---

## 5. Screenshots

- Not recaptured this session. Use `npm run build && npm run start` + Playwright visual QA specs with `BASE_URL`.

---

## 6. Blockers / backlog

| Type | Notes |
|------|--------|
| Release-blocking | Fix `typecheck:critical` vs `.next/dev` types |
| Visual polish | Full hub/dashboard sweep vs PNG library remains backlog |
| Paid/admin creds | Release-gate paid projects not executed |

---

## 7. Files touched

- `src/lib/theme/theme-registry.ts`
- `src/components/theme/theme-picker.tsx`
- `src/components/layout/marketing-header-utility-strip.tsx`
- `src/components/layout/mobile-context-drawer.tsx`
- `src/components/layout/site-header.tsx`
- `src/components/marketing/marketing-default-layout-chrome-failsafe.tsx`
- `src/components/ecg-module/ecg-module-page.tsx`
- `src/lib/theme/theme-registry.public-marketing.contract.test.ts`
- `tests/e2e/helpers/marketing-qa.ts`
- `tests/e2e/public/marketing-visual-qa-guard.spec.ts`
- `package.json`

