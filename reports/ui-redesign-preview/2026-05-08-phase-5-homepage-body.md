# Phase 5 Live Homepage Body

Date: 2026-05-08
Scope: live public homepage body sections below the Phase 4 hero only.

## Files Changed

- `nursenest-core/src/components/marketing/home-restored-client.tsx`
- `nursenest-core/src/components/marketing/home/premium-homepage-routes.ts`
- `nursenest-core/src/components/marketing/home/premium-pathway-showcase.tsx`
- `nursenest-core/src/components/marketing/home/premium-clinical-depth.tsx`
- `nursenest-core/src/components/marketing/home/premium-study-ecosystem.tsx`
- `nursenest-core/src/components/marketing/home/premium-readiness-preview.tsx`
- `nursenest-core/src/components/marketing/home/premium-homepage-trust.tsx`
- `nursenest-core/src/components/marketing/home/premium-homepage-cta.tsx`
- `nursenest-core/src/app/premium-redesign-2026.css`
- `nursenest-core/src/lib/marketing/marketing-default-layout-home-streaming.contract.test.ts`
- `nursenest-core/tests/e2e/public/homepage-production-smoke.spec.ts`
- `nursenest-core/tests/e2e/public/homepage-tier-nav-lessons-routing.spec.ts`
- `nursenest-core/tests/e2e/public/homepage-premium-body.spec.ts`

## Existing Body Sources Identified

- `HomeHeroScreenshotSection`: product carousel below hero; question-bank fallback CTA; `PH.marketingHomeHeroPrimaryCta`; carousel impression tracking through `PH.marketingHomeHeroCarouselTierImpression`; i18n keys under `pages.home.carouselHandoff.*` and `components.homeConversionSections.platformCarouselHeading`; carousel error boundary fallback.
- Inline `HomeStableMarketingPlaceholder` blocks in `home-restored-client.tsx`: pricing/question-bank CTAs; i18n fallback keys under `pages.home.stablePlaceholder.*`.
- `HomeTrustStripSection`: live stat trust strip; no CTA links; i18n keys under `pages.home.trustStrip.*`; count fallback logic preserved elsewhere by keeping homepage stat normalization.
- Inline audience/pathway cards in `home-restored-client.tsx`: RN/PN/NP/Allied links via `marketingExamHubPath`, `publicExamPrepHubDestinations`, and `withMarketingLocale`; `PH.marketingHomeExploreHubClick`; i18n keys under `pages.home.audience.*`.
- Server `children` slot: `GlobalMarketingHomeIntro`, still passed through `HomeRestoredWithDeferredStats` and protected by route-level try/catch.
- `HomeFinalStudyCta`: `HUB.questionBank`, `HUB.examLessons`, `HUB.pricing`; `PH.marketingHomeFinalCta`; i18n keys under `pages.home.finalCta.*` and hero CTA labels.

## Replaced / Added Sections

- Pathway Showcase: RN, PN/RPN, NP, International RN, Allied Health.
- Adaptive Lessons / Clinical Depth: pathophysiology, labs/diagnostics, red flags, interventions, medications, clinical pearls.
- Study Ecosystem Flow: Read -> Recall -> Practice -> Assess with Lessons, Flashcards, Question Bank, CAT readiness links.
- Readiness Dashboard Preview: sample readiness gauge, domain mastery bars, next-priority suggestion, streak/progress indicators.
- Testimonials / Trust: safe representative learner sentiment cards plus existing brand trust inline signals.
- Premium Conversion CTA: signup, pricing, lessons, schools, and question-bank links.

## CTA Destinations Preserved

- Primary hero remains `HUB.questionBank`; secondary hero remains `HUB.examLessons`.
- Pathway cards continue to resolve through canonical marketing helpers for RN/PN/NP/Allied.
- International RN uses existing launched global exam route `/exams/australia`.
- Study ecosystem uses existing `HUB.examLessons`, `HUB.flashcards`, `HUB.questionBank`, and `HUB.practiceExams`.
- Readiness dashboard preview links to existing login/dashboard entry and CAT practice surface.
- Final CTA uses `HUB.signup`, `HUB.pricing`, `/for-institutions`, `HUB.examLessons`, and `HUB.questionBank`.

## Validation Results

- Passed: `npm run typecheck:critical`
- Passed: `npm run test:homepage`
- Passed: `BASE_URL=http://127.0.0.1:3105 npx playwright test tests/e2e/public/homepage-premium-body.spec.ts tests/e2e/public/homepage-production-smoke.spec.ts --project=chromium`
- Passed: `BASE_URL=http://127.0.0.1:3105 npx playwright test tests/e2e/public/homepage-tier-nav-lessons-routing.spec.ts --project=chromium --workers=1`
- Browser checks covered homepage render, mobile viewport, no emergency fallback UI, console/pageerror fatal filters, no horizontal mobile scroll, and non-404 checks for new key section CTAs.

## Full Typecheck Blocker

`npm run typecheck` was attempted and failed on unrelated pre-existing errors outside the homepage body slice:

- `src/components/student/learner-study-modes-band.tsx(104,9): Type '"dashboard_study_modes_grid"' is not assignable to type 'StudyLoopCatSurface'.`
- `src/lib/ai/blog-ai-provider.ts(113,19): 'resp.choices' is possibly 'undefined'.`
- `src/lib/blog/blog-generation-jobs.ts(304,27): serializer callback parameter type mismatch with `SerializeJobOpts`.

## Screenshots

- `preview-screenshots/phase5-homepage-desktop-ocean-full.png`
- `preview-screenshots/phase5-homepage-mobile-ocean-full.png`
- `preview-screenshots/phase5-pathway-section-ocean.png`
- `preview-screenshots/phase5-readiness-section-ocean.png`
- `preview-screenshots/phase5-final-cta-ocean.png`
- `reports/ui-redesign-preview/phase5-homepage-midnight-full.png`
- `reports/ui-redesign-preview/phase5-homepage-apex-full.png`

## Known Limitations

- The Phase 4 hero was intentionally not changed. In this local dev run, the existing hero still logs missing i18n keys and displays its Phase 4 fallback copy; this is outside Phase 5 body scope.
- Full `npm run typecheck` remains blocked by unrelated TypeScript errors listed above.
- Apex screenshot was captured by forcing `data-theme="apex"` during Playwright capture; the theme exists in CSS but is not part of the main theme registry in this checkout.
- The pathway route smoke passed, but the local dev server logged an existing downstream lessons-page error for `/canada/pn/rex-pn/lessons`: `[pathway-lesson] expandToStandardFiveSections: blocked — incoming sections are authoritative; use the premium normalization path (PathwayLesson.sections only).` This is outside the homepage body change and did not produce a 404.

## Deployment Gate Readiness

The Phase 5 homepage body is ready for a focused Playwright deployment gate for the public homepage. The broader deployment gate should still account for the unrelated full-typecheck blockers and the existing Phase 4 hero copy fallback issue.
