# Screenshot visual source of truth — UI redesign preview

**Date:** 2026-05-08  
**Scope:** In-repository screenshots and design exports only (no external Figma file keys required).

---

## 1. Inventory — screenshot / design reference files

### `reports/ui-redesign-preview/`

- `2026-05-08-phase-1-2-6-implementation.md`
- `2026-05-08-phase-3-nav-implementation.md`
- `2026-05-08-phase-4-hero-implementation.md`
- `2026-05-08-phase-5-homepage-body.md`
- `HOMEPAGE_PREMIUM_REDESIGN.md`
- `homepage-regression-fixes-2026-05-08.md`
- `phase5-homepage-apex-full.png`
- `phase5-homepage-midnight-full.png`

### `preview-screenshots/`

- `homepage-mockup-canvas.png`
- `homepage-mockup-desktop.png`
- `homepage-mockup-hero.png`
- `homepage-mockup-mobile.png`
- `phase3-nav-canvas-all.png`
- `phase3-nav-desktop-midnight.png`
- `phase3-nav-desktop-ocean-sticky.png`
- `phase3-nav-desktop-ocean-top.png`
- `phase3-nav-mobile-closed.png`
- `phase3-nav-mobile-drawer-open.png`
- `phase4-hero-canvas-all.png`
- `phase4-hero-desktop-apex.png`
- `phase4-hero-desktop-midnight.png`
- `phase4-hero-desktop-ocean.png`
- `phase4-hero-mobile-ocean.png`
- `phase5-final-cta-ocean.png`
- `phase5-homepage-desktop-ocean-full.png`
- `phase5-homepage-mobile-ocean-full.png`
- `phase5-pathway-section-ocean.png`
- `phase5-readiness-section-ocean.png`

### `docs/ui-redesign-preview/`

- **Not present** in this repo. Related: `docs/ui-redesign-preview-homepage-regression-fixes.md`.

### Pattern search (hub, dashboard, lessons, mockup, homepage, etc.) — image highlights

- `docs/qa-reports/rpn-pn-browser-2026-05-07/*.png` (homepage, dashboard, lessons, flashcards, questions, practice, CAT, report card, account, progress, study plan)
- `docs/verification-screenshots/learner-dashboard-desktop.png`, `learner-dashboard-mobile.png`, `practice-tests-*.png`, `allied-global-hub-*.png`
- `docs/qa-reports/rn-learner-journey-20260507-1651/homepage-pre-signup-reference.png`, `signup-form-reference.png`
- `docs/qa-reports/allied-occupation-journey-20260507-1710/*.png` (hubs, lessons, flashcards sample)
- `certification-hub-final.png` (repo root)

---

## 2. Source of truth used for this pass (explicit)

| Reference files | Used for |
|-----------------|----------|
| `preview-screenshots/phase5-homepage-*-full.png`, `homepage-mockup-*.png`, `reports/ui-redesign-preview/phase5-homepage-*-full.png` | Marketing `/` section rhythm and hero bands |
| `docs/qa-reports/rpn-pn-browser-2026-05-07/05-dashboard-desktop.png`, `06-dashboard-desktop.png`, `docs/verification-screenshots/learner-dashboard-*.png` | Learner `/app` vertical rhythm and hub density |
| `docs/qa-reports/rpn-pn-browser-2026-05-07/17-account.png` | Account center shell |
| `docs/qa-reports/rpn-pn-browser-2026-05-07/14-report-card.png` | Report card band |
| `docs/qa-reports/rpn-pn-browser-2026-05-07/06-lessons-hub-desktop.png`, `07-lessons-hub-desktop.png` | Lessons marketing hub |
| `docs/qa-reports/rpn-pn-browser-2026-05-07/13-cat-page.png`, `11-practice-tests-hub.png`, `08-flashcards-hub.png` | Study tools shells |

**Not used:** Figma.com file reads. Wording in CSS updated where it incorrectly implied Figma without file context.

---

## 3. Routes compared (code review + screenshot pairing)

| Route | Key references | Code touchpoints |
|--------|----------------|-------------------|
| `/` | phase5 + mockups | `premium-redesign-2026.css`, marketing home components |
| `/app` | rpn-pn + verification dashboard PNGs | `globals.css` `.nn-dash*`, `learner-dashboard-page-shell.tsx` |
| Account / settings | `17-account.png` | `learner-account-center-overview.tsx`, `nn-card` |
| Report card | `14-report-card.png` | Dashboard report card block |
| RN/PN/RPN hubs | phase5 pathway section + QA hubs | `LessonsPageShell`, `.nn-premium-pathway-hub` |
| Lessons hub/detail shell | `06/07-lessons-hub-*.png` | Pathway lesson shells, `nn-study-card` |
| CAT / practice / flashcards | `13`, `11`, `08/09` PNGs | Hub clients (layout scope only) |

---

## 4. Components / files changed (this session)

- `nursenest-core/src/app/globals.css`
- `nursenest-core/src/app/premium-redesign-2026.css`
- `reports/ui-redesign-preview/SCREENSHOT_VISUAL_SOURCE_OF_TRUTH_REPORT.md`

---

## 5. Before / after screenshots

- **Before:** Existing `preview-screenshots/`, `reports/ui-redesign-preview/*.png`, `docs/qa-reports/**`.
- **After:** No new Playwright captures run (no dev server). Blocked until `npm run dev` + capture script or CI artifact path.

---

## 6. Token-level vs layout / shell updates

| Kind | Changes |
|------|---------|
| Tokens | `--nn-rhythm-shell-y` adjusted for learner vertical breathing room |
| Layout / shells | `.nn-dash--learner-home`, `.nn-dash-section`, `.nn-dash-hub-main` gaps; dashboard section surfaces subtle semantic panel tint |

---

## 7. Remaining gaps

- Fresh after screenshots for regression proof.
- Allied occupation mega-set of QA PNGs not individually diffed this pass.
- No entitlement, routing, paywall, or leaf-logo changes.

---

## 8. Validation

- Run `npm run typecheck:critical` from `nursenest-core/` after substantive edits.

## 9. Amendments (implementation details)

- **Learner surface tones:** The previous `.nn-dash--learner-home .nn-dash-section > .nn-ls-surface` rule forced a flat `background: var(--semantic-surface)` over all section cards, which overrode `[data-nn-ls-tone]` fills from `learner-surface-primitives.css`. That block was reduced to **border-radius only** so success/supportive/primary panels render correctly; a **subtle radial top wash** on `.nn-dash--learner-home` adds depth without flattening card semantics.
- **typecheck:critical:** Passed after edits (`nursenest-core/`).
