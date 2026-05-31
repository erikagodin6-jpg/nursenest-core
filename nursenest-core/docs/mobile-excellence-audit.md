# Mobile Excellence Audit

Date: 2026-05-31  
Objective: move NurseNest toward best-in-class mobile usability across marketing, learner, clinical, and specialty surfaces.

## Executive Summary

Current mobile maturity is approximately **78/100**. NurseNest has a strong foundation: shared mobile CSS primitives, overflow health assertions, mobile Playwright suites, safe-area-aware learner chrome, focused CAT viewport tests, and route coverage for the most important paid learner paths. The platform is not yet at **95% mobile usability** because mobile governance is uneven across newer clinical ecosystems, pricing/checkout conversion flows, and specialty pathways.

The biggest gap is not one obvious broken layout. It is inconsistent enforcement: Homepage, RN lessons, flashcards, questions, CAT, labs, and ECG have partial automated mobile coverage, while Clinical Skills, Simulations, New Graduate, Allied occupation routes, checkout, cancellation, and full paywall flows are not yet held to the same mobile standard.

## Evidence Reviewed

- `src/app/mobile-ux-standards.css` defines reusable 44px touch targets, mobile gutters, readable max width, and safe overflow handling for lesson tables/code/images.
- `tests/e2e/helpers/mobile-layout-health.ts` enforces document and main horizontal overflow limits.
- `tests/e2e/helpers/mobile-layout-overflow-gate-routes.ts` lists mobile overflow-gated routes.
- `tests/e2e/mobile/mobile-marketing-routes.spec.ts` covers signup, RN/CA RN hubs, lessons hubs, and hamburger width.
- `tests/e2e/mobile/mobile-learner-authenticated-layout.spec.ts` covers dashboard, lessons, practice, CAT hub, flashcards, billing, questions, labs, and ECG.
- `tests/e2e/mobile/mobile-learner-study-interactions.spec.ts` covers bottom nav, flashcard reveal/rating, linear practice, CAT item flow, and questions.
- `tests/e2e/mobile/premium-mobile-performance-audit.spec.ts` captures public and paid surfaces across launch themes and checks CLS/overflow/sticky header/drawer.
- `src/app/labs-workstation.css` and `src/app/clinical-skills-workstation.css` include responsive sidebar-to-mobile-strip patterns.
- `src/app/learner-advanced-questions.css` enforces 44px minimum controls for advanced question interactions on small screens.

## Surface Scores

| Surface | Mobile Score | Status | Main Reason |
| --- | ---: | --- | --- |
| Homepage | 84 | Good | Covered by public mobile/performance audit, but visual/content density and theme-specific contrast need regular screenshot gating. |
| Pricing | 76 | Needs work | Public performance audit includes `/pricing`; checkout continuation, plan comparison, and mobile paywall handoff need stronger coverage. |
| Dashboard | 82 | Good | Authenticated mobile layout coverage exists; dense cards and bottom nav label compression remain risks. |
| Lessons | 80 | Good baseline | Lesson hub/detail coverage exists; long content, tables, sticky metadata, and unit controls need device-level regression checks. |
| Flashcards | 83 | Good | Hub/session mobile interaction coverage exists; resume dialogs, mixed-system selection, and failure states need broader device matrix. |
| Practice | 82 | Good | Linear practice mobile flow is covered; rationale panel and optional next paths need expanded assertions. |
| CAT | 86 | Strong | Compact viewport and mobile item flow tests exist; small-screen exam footer/safe-area coverage should include iPhone SE. |
| ECG | 74 | Needs work | ECG is in authenticated mobile layout/performance targets; clinical strip tools and workstation interactions need dedicated touch tests. |
| Labs | 75 | Needs work | Responsive CSS exists; mobile interpretation workflows, tables, and unit toggles need stronger automated checks. |
| Clinical Skills | 70 | At risk | Responsive mobile strip exists, but route is not in the core mobile E2E gate list. |
| Simulations | 68 | At risk | LOFT/CNPLE specs exist, but mobile usability and safe-area assertions are not yet first-class. |
| New Graduate | 66 | At risk | Included in product scope, but not represented in current mobile route gate matrix. |
| Allied | 72 | Needs work | Allied has route smoke and pricing ack tests, but mobile occupation routes and global allied learner flows need direct coverage. |

## Findings Preventing 95% Mobile Usability

| ID | Severity | Area | Finding | Evidence | Impact |
| --- | --- | --- | --- | --- | --- |
| M95-001 | Critical | Governance | The mobile gate matrix does not cover every target surface in this program. | `MOBILE_OVERFLOW_GATE_REPORT` omits Clinical Skills, Simulations, New Graduate, Allied occupation routes, signup verification, checkout success, cancellation, and renewal. | A surface can regress on mobile without CI noticing. |
| M95-002 | High | Checkout/Pricing | Pricing is checked as a public page, but end-to-end mobile checkout and post-checkout entitlement sync are not part of the mobile suite. | `premium-mobile-performance-audit.spec.ts` captures `/pricing`; pricing E2E exists separately, but mobile conversion-specific assertions are not visible in the mobile gate. | Revenue path can pass desktop QA while failing on small phones. |
| M95-003 | High | Paywalls | Mobile paywall usability is not a named mobile contract across lessons, flashcards, CAT, ECG, labs, and clinical skills. | Existing mobile authenticated tests assert no subscriber paywall for paid users; free/mobile paywall CTA behavior is only partially covered. | Free-to-paid conversion can break through hidden CTAs, cramped cards, or modal overflow. |
| M95-004 | High | Clinical Skills | Clinical Skills responsive CSS exists, but the surface is not in the core mobile route gate list. | `clinical-skills-workstation.css` has mobile strip/sidebar behavior; `MOBILE_OVERFLOW_GATE_REPORT` does not list `/app/clinical-skills`. | Competency pathways may be hard to navigate on phone even if desktop is polished. |
| M95-005 | High | Simulations | Simulations do not have a mobile usability gate equivalent to CAT/linear practice. | CNPLE simulation E2E exists; mobile report lists CAT/linear but not simulation session chrome. | Active simulation sessions may overlap controls, exhibits, handoffs, or footer actions on small screens. |
| M95-006 | High | New Graduate | New Graduate is missing from the mobile route and performance target lists. | `config/global-nav-config.ts` includes New Graduate marketing links; mobile audit route lists do not include those destinations. | A strategic lifecycle surface can feel lower quality than exam prep. |
| M95-007 | Medium | Allied | Allied global and occupation routes are under-covered on mobile. | Allied route smoke exists, but mobile suites focus RN hub/lessons and paid default pathway. | Allied users may encounter untested card density, profession selectors, or paywall layout. |
| M95-008 | Medium | Navigation | Bottom nav meets minimum height but can compress labels. | `docs/mobile-ui-audit.md` notes `text-[11px]`, narrow max widths, and label truncation risk. | Users may miss destinations or lose confidence in app polish. |
| M95-009 | Medium | Touch targets | Shared touch target tokens exist, but not all custom clinical controls are governed. | `mobile-ux-standards.css` and `learner-advanced-questions.css` cover many controls; labs/clinical/ECG custom controls need explicit tests. | Missed taps increase fatigue in study sessions. |
| M95-010 | Medium | Scroll behavior | Several surfaces rely on horizontal strips for mobile navigation. | Labs and Clinical Skills use `overflow-x: auto` mobile strips. | Usable, but discoverability can be weak without clear affordances and scroll snapping. |
| M95-011 | Medium | Performance | Mobile performance audit exists but public/paid captures are theme/route limited and opt-in for slower pages. | `/blog` is opt-in; paid captures require credentials and project selection. | Slow or cold-start routes can escape routine validation. |
| M95-012 | Medium | Accessibility | Reduced motion and overflow are checked, but screen-reader and keyboard semantics are not broadly audited on mobile clinical workflows. | Performance audit checks reduced motion; no broad mobile aria/touch target report for all learner surfaces. | Accessibility quality remains uneven. |
| M95-013 | Medium | Lessons | Lesson content has overflow safeguards, but long clinical tables, images, and unit selectors need recurring real-device checks. | `mobile-ux-standards.css` handles tables/pre/img; prior lesson-space changes increase need for visual regression. | Reading can become scroll-heavy or utility chrome can push content below the fold. |
| M95-014 | Low | Homepage | Homepage is covered but depends heavily on theme-aware visuals. | Theme parity and mobile performance specs exist; Ocean/Blossom refinements were recent. | Theme-specific muddiness or contrast regressions can hurt first impression. |
| M95-015 | Low | Reports | Existing audit docs are fragmented. | `docs/mobile-ux-audit.md`, `docs/mobile-ui-audit.md`, `docs/mobile-layout-regression-checklist.md`, and this audit overlap. | Teams may not know which mobile standard is canonical. |

## Route Coverage Gap

| Required Area | Current Evidence | Gap To 95% |
| --- | --- | --- |
| Homepage | Public mobile/performance targets include `/`. | Add screenshot comparison at 390px for active themes every release. |
| Pricing | Public performance target includes `/pricing`; pricing E2E exists separately. | Add mobile checkout, success, and entitlement handoff to mobile suite. |
| Dashboard | Authenticated layout and performance targets include `/app`. | Add bottom-nav label visibility and above-the-fold CTA assertions. |
| Lessons | Mobile lesson flow and paid lesson detail coverage exist. | Add iPhone SE visual/readability checks for lesson header, unit selector, tables, and continue-learning cards. |
| Flashcards | Hub and session reveal/rating flow covered. | Add mixed-system/session-type mobile tests and error/empty states. |
| Practice | Linear practice flow covered. | Add rationale access and return-to-hub assertions at 390px and iPhone SE. |
| CAT | Strong compact viewport and mobile session coverage. | Add iPhone SE safe-area footer and long-option stem cases. |
| ECG | Route included in paid layout/performance targets. | Add dedicated strip measurement/workstation touch tests. |
| Labs | Route included in paid layout target; responsive CSS exists. | Add lab table/unit/trend interaction tests. |
| Clinical Skills | Responsive CSS exists. | Add `/app/clinical-skills` to mobile route and interaction gates. |
| Simulations | CNPLE specs exist. | Add mobile simulation session chrome, exhibits, handoff, and debrief gates. |
| New Graduate | Product/nav presence exists. | Add New Grad marketing and learner routes to mobile audit. |
| Allied | Allied route smoke and pricing ack exist. | Add global Allied and occupation-specific mobile route matrix. |

## 95% Usability Definition

A surface should count as mobile-excellent only when it passes all of the following at **iPhone SE**, **iPhone 13 Mini**, **Galaxy S22**, and **390px width**:

- No document-level horizontal overflow beyond 2px.
- Primary touch targets are at least 44px high/wide.
- Main CTA is visible without hunting and never hidden behind sticky chrome.
- Bottom/sticky controls respect safe areas.
- Long content remains readable with 16px-equivalent body text and bounded line length.
- Modals, drawers, paywalls, and checkout frames fit within the viewport.
- Loading, empty, and error states use honest messaging and preserve next action.
- Reduced motion is respected.
- No severe layout shift after first render.
- Route works in Blossom, Ocean, Aurora, and dark themes.

## Prioritized Remediation Plan

### P0 — Revenue And Access Mobile Gate

1. Add a `mobile-revenue-critical.spec.ts` covering pricing → signup/login → checkout → success → entitlement → cancel/reactivate on 390px and iPhone SE.
2. Add mobile paywall assertions for lessons, flashcards, questions, CAT, ECG, labs, clinical skills, and simulations.
3. Require visible primary CTA, no clipped modal content, no offscreen checkout button, and no stale entitlement state.

### P1 — Expand Mobile Route Matrix

1. Extend `MOBILE_OVERFLOW_GATE_REPORT` and the mobile specs to include:
   - `/app/clinical-skills`
   - `/app/simulations` or active simulation entry route
   - New Graduate marketing and learner routes
   - Allied global route plus at least two occupation routes
   - `/app/profile` and subscription management
2. Add public mobile routes for `/pricing`, `/allied/allied-health`, `/new-graduate-support`, and major pathway hubs.
3. Add a CI summary that fails when a required mobile route is absent from the matrix.

### P2 — Clinical Ecosystem Interaction Tests

1. ECG: verify strip tools, quiz controls, measurement inputs, and next actions are 44px and not occluded.
2. Labs: verify trend tables, unit controls, interpretation cards, and action buttons on small screens.
3. Clinical Skills: verify mobile strip discoverability, lesson/procedure navigation, competency controls, and sequencing activities.
4. Simulations: verify exhibits, documentation fields, handoff/debrief panels, and anchored action bars.

### P3 — Navigation And Study Chrome Polish

1. Rework bottom learner navigation so labels do not truncate at 390px and below.
2. Add scroll-snap/fade affordance to horizontal mobile strips in Labs and Clinical Skills.
3. Standardize mobile headers across learner pages: compact title, status/progress row, one primary action.
4. Add a mobile “return to study home” escape hatch on deep clinical/session routes.

### P4 — Performance And Accessibility Hardening

1. Run `premium-mobile-performance-audit.spec.ts` in CI for public mobile; run paid mobile nightly with credentials.
2. Add Lighthouse mobile budgets for homepage, pricing, dashboard, lessons, flashcards, questions, and CAT.
3. Add axe checks for mobile drawers, paywalls, and study sessions.
4. Add screen-reader labels to custom clinical controls where missing.

### P5 — Documentation Consolidation

1. Make this file the executive audit, and keep `docs/mobile-ux-audit.md` as the operational testing guide.
2. Link `docs/mobile-layout-regression-checklist.md` from PR templates for UI work.
3. Update mobile route matrix whenever a new learner/clinical surface launches.

## Recommended CI Gates

| Gate | Command/Target | Required For 95% |
| --- | --- | --- |
| Public mobile layout | `npm run test:e2e:mobile` public projects | Every PR touching marketing/navigation/theme. |
| Paid learner mobile | `npm run test:e2e:mobile` paid projects with storage state | Every PR touching learner shells, paywalls, study surfaces. |
| Revenue mobile | New `mobile-revenue-critical.spec.ts` | Every pricing/auth/subscription PR. |
| Clinical mobile | New ECG/Labs/Clinical Skills/Simulations specs | Every clinical ecosystem PR. |
| Visual mobile | `premium-mobile-performance-audit.spec.ts` screenshots | Release candidates. |
| Accessibility mobile | Axe + touch target report | Release candidates and clinical UI launches. |

## Target State

NurseNest reaches **95% mobile usability** when every revenue path, study path, and clinical ecosystem path is covered by automated mobile gates, passes on small phones, keeps CTAs visible, avoids horizontal overflow, respects accessibility, and feels intentionally designed rather than merely responsive.

