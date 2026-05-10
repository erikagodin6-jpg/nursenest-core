# Premium Allied Health + New Grad Convergence

## Summary

This pass performs a Figma-first premium convergence audit and scoped redesign normalization for Allied Health and New Grad experiences. The goal is to make these pathways feel equal in quality to RN, RPN/REx-PN, LPN/NCLEX-PN, NP, Pre-Nursing, Lessons, Flashcards, Practice Exams, CAT Exams, Dashboards, Report Cards, FAQ, and Auth redesign systems.

The implementation is additive and shared-system aligned:

- Figma-style PNG mockups were generated first under `docs/screenshots/premium-allied-newgrad-convergence/`.
- `src/app/premium-allied-newgrad-convergence.css` adds scoped parity styling for Allied/New Grad roots.
- Shared hub roots now expose explicit convergence hooks.
- High-confidence Allied visible labels were normalized to Title Case.

Truthpack constraint: `.vibecheck/truthpack/` is not present in this checkout, so truthpack JSON could not be consulted. Routes, tiers, prices, API contracts, entitlements, and env vars were not invented or changed.

## Professions Audited

The Allied registry was audited through `ALLIED_PROFESSIONS` in `src/lib/allied/allied-professions-registry.ts`.

Representative supported keys verified by contract:

- `mlt`
- `paramedic`
- `occupational-therapy`
- `social-work`
- `psychotherapy`
- `psw-hca`
- `respiratory`
- `physiotherapy`

The registry also includes additional allied tracks such as PTA, OTA, imaging, pharmacy tech, community health worker, mental health/addictions, medical assistant, dental assistant, dental hygiene, dietetic technician, EMT, sonography, radiography, and lab assistant. This pass does not remove or remap any profession keys.

## Layouts Normalized

Allied Health:

- Root hub now carries `nn-allied-health-hub` and `data-nn-allied-newgrad-convergence="allied"` hooks.
- Allied hub cards, lesson grids, study cards, module cards, CAT card, and live inventory surfaces receive the same premium radius, elevation, mobile gap, and themed depth vocabulary as the rest of NurseNest.
- Profession-scoped views keep `withAlliedProfessionMarketingQuery` and `alliedProfessionKey` flow intact.

New Grad:

- `NursingTierHubPage` now adds `nn-new-grad-hub` and `data-nn-new-grad-convergence="1"` only when `isNewGradHub` is true.
- New Grad surfaces receive the same hub hero, study band, card, mobile, motion, and atmospheric parity treatment without changing the New Grad route model.
- The New Grad visual system emphasizes transition-to-practice, clinical prioritization, delegation, communication, documentation, orientation support, safety, and workplace readiness through the existing shared hub components and premium module cards.

## Theme Coverage

The convergence layer explicitly supports:

- Ocean
- Blossom
- Midnight
- Sunset
- Aurora

Theme behavior is token-driven. Structure, layout, and spacing do not fork by theme. Sunset and Aurora are included in CSS selectors, screenshot evidence, and the static contract.

## Capitalization Fixes

High-confidence Allied visible labels were normalized to Title Case:

- `Practice Questions`
- `Live Pathway Snapshot`
- `Live Inventory`
- `Practice Exam Ready`
- `Choose Your Allied Health Track`
- `Open Study Hub`
- `Study Modes`
- `Lessons by Category`

No broad i18n architecture rewrite was performed, and profession labels remain sourced from registry helpers.

## Route Validation

The pass preserves route and scoping behavior:

- `alliedProfessionKey` still flows into premium module generation.
- `withAlliedProfessionMarketingQuery` remains in use for profession-scoped links.
- Allied Health route helpers are not replaced or redirected to RN routes.
- New Grad still uses `isNewGradTransitionPathway` and the shared `NursingTierHubPage` logic.
- Public/private separation, sitemap behavior, SEO helpers, entitlements, and learner route URLs were not changed.

## Screenshot Exports

PNG mockups are saved in `docs/screenshots/premium-allied-newgrad-convergence/`.

Frame groups:

- `allied-health-hub`
- `allied-learner-dashboard`
- `allied-lessons`
- `allied-flashcards`
- `allied-practice-exams`
- `new-grad-hub`
- `new-grad-dashboard`
- `new-grad-readiness-analytics`

Each frame group includes desktop and mobile variants across Ocean, Blossom, Midnight, Sunset, and Aurora, for 80 expected PNG exports.

## Tests Run

Added `tests/contracts/premium-allied-newgrad-convergence.contract.test.ts`.

The contract verifies:

- CSS import wiring.
- Ocean, Blossom, Midnight, Sunset, and Aurora coverage.
- Requested Allied profession keys exist in `ALLIED_PROFESSIONS`.
- Allied and New Grad convergence hooks exist.
- `alliedProfessionKey` and profession query scoping remain intact.
- High-confidence Allied labels are Title Case.
- Premium parity CSS primitives exist for layout, card rhythm, mobile safety, and reduced motion.
- All expected PNG evidence exists.
- This report includes required audit sections.

## Unresolved Issues

- This pass generates local PNG evidence rather than externally approved Figma file URLs. Human design approval should still compare the app against the premium homepage and RN/RPN/NP/Pre-Nursing systems.
- Full Playwright route rendering was not run in this turn; static guards do not prove every live page has no overflow or no clipped CTAs.
- Some Allied content rows still contain sentence-level copy from the registry; this pass only normalized high-confidence hub labels, not long-form educational prose.
- Learner dashboard variants for Allied and New Grad are normalized through shared shell/study surfaces, but real paid-account screenshots should still validate profession-specific runtime data.

## App Store Readiness Observations

Allied Health and New Grad now have stronger parity foundations:

- Shared premium hub rhythm and atmospheric card depth.
- Explicit hooks for platform-wide visual governance.
- Mobile-aware spacing and reduced-motion support inherited from the broader convergence layers.
- Profession-specific Allied context preserved.
- New Grad transition-to-practice meaning preserved.
- Sunset and Aurora parity included rather than omitted.

The design direction remains colorful, premium, clinically polished, and cohesive, without flattening these pathways into generic SaaS pages or secondary product experiences.

## Recommendations

1. Run live Playwright screenshots for `/allied-health`, `/allied/[career]`, `/allied/allied-health/lessons`, `/us/new-grad`, `/canada/new-grad`, and `/us/rn/new-grad-transition` across all five themes.
2. Validate authenticated Allied and New Grad learner dashboards with real seeded users to confirm dashboard/report-card data stays scoped correctly.
3. Add a browser-level overflow and sticky CTA test for Allied occupation hubs and New Grad transition hubs.
4. Continue capitalization cleanup in small copy-only batches, avoiding long-form clinical content rewrites unless reviewed by content owners.
