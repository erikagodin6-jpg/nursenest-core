# NurseNest SEO, Pricing, FAQ, And Tier Value Expansion Report

Date: 2026-05-28

## Scope Completed In This Pass

This pass created a non-visual source-of-truth layer for the pricing, FAQ, tier comparison, structured-data, screenshot-proof, and content-accuracy work requested.

No pricing-page layout, tier landing page layout, screenshots, or visible marketing hierarchy was changed in this pass because repository guardrails require Figma frames for meaningful marketing layout and hierarchy changes before implementation.

## Files Added

| File                                                                | Purpose                                                                                                                                                        |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nursenest-core/src/lib/marketing/seo-tier-value-expansion.ts`      | Central tier value inventory, comparison matrix contract, FAQ bank, JSON-LD builders, internal-link requirements, screenshot proof targets.                    |
| `nursenest-core/src/lib/marketing/seo-tier-value-expansion.test.ts` | Contract tests for tier coverage, non-generic comparison values, inventory-backed quantity claims, FAQ breadth, JSON-LD shape, and screenshot target coverage. |
| `docs/seo-pricing-tier-value-expansion-report.md`                   | Program report and implementation handoff.                                                                                                                     |

## Feature Matrix Foundation

The new comparison matrix covers the requested pricing rows:

- Questions
- Lessons
- Flashcards
- Clinical Skills
- Pharmacology
- ECG
- Advanced ECG
- Case Studies
- CAT Exams
- LOFT Exams
- NGN Questions
- Adaptive Learning
- Readiness Tracking
- Analytics
- Daily Questions

Rows cover:

- RN
- RPN / PN
- NP
- Allied Health
- New Grad

Pre-Nursing is represented in the tier profile inventory but intentionally excluded from the paid plan comparison matrix because existing pricing catalog comments describe Pre-Nursing as a free, non-Stripe-billed tier.

## Content Accuracy Policy

The matrix intentionally avoids static numeric counts for questions, lessons, flashcards, case studies, and NGN item types.

Those cells are marked as `databaseInventory` and include evidence paths such as:

- `prisma.examQuestion.count where tier=RN`
- `prisma.pathwayLesson.count for RN pathways`
- `flashcard_bank scope RN`
- `exam question inventory by case-study type`
- `exam question inventory by NGN type`

This prevents stale hardcoded public claims. The next UI pass should resolve those cells from live inventory metrics or generated build-time metrics before rendering public counts.

## FAQ Expansion

The new FAQ bank contains 50+ structured FAQ entries across all requested categories:

- Subscriptions
- Billing
- Refunds
- Exam Prep
- NCLEX
- REx-PN
- CNPLE
- NP Exams
- Clinical Skills
- Pharmacology
- ECG
- Adaptive Learning
- Flashcards
- CAT Exams
- Simulations
- Mobile Access
- Study Plans
- Question Types
- Readiness Scores
- Progress Tracking

The FAQ answers are deliberately policy-safe:

- no pass guarantees
- no unsupported count claims
- no unsupported simulation claims
- Advanced ECG remains separate unless entitlement policy changes
- Allied Health remains career-scoped
- CAT and LOFT language remain separated

## Structured Data

The new module includes builders for:

- `FAQPage`
- `BreadcrumbList`
- `SoftwareApplication`
- `Course`

Existing repository helpers already include marketing WebPage JSON-LD support. The next visual/route integration pass should compose these builders with the existing route-level helpers rather than introducing a parallel schema system.

## Internal Linking

Each tier profile requires internal links to:

- Pricing
- Questions
- Lessons
- Flashcards
- Clinical Skills
- Pharmacology
- ECG
- Blog / authority content

Contract tests enforce the required link intents for every tier profile.

## Screenshot Proof Targets

The inventory defines Playwright proof targets for:

- Questions: `/app/practice-tests`
- Flashcards: `/app/flashcards`
- Lessons: `/app/lessons`
- CAT: `/app/cat`
- Clinical Skills: `/app/clinical-skills`
- Pharmacology: `/app/pharmacology`
- ECG: `/modules/ecg`
- Analytics: `/app/account/analytics`

Screenshots were not regenerated in this pass because no visible UI was changed. Screenshot generation should run after Figma-approved page integration.

## Existing SEO/Pricing Surfaces Found

Relevant existing implementation points:

- `nursenest-core/src/components/marketing/pricing-page-client.tsx`
- `nursenest-core/src/lib/marketing/pricing-faq-jsonld.ts`
- `nursenest-core/src/lib/seo/marketing-webpage-jsonld.ts`
- `nursenest-core/src/lib/seo/internal-links.ts`
- `nursenest-core/src/lib/pricing/display-catalog.ts`
- `nursenest-core/src/lib/conversion/pricing-catalog.ts`
- `docs/SCREENSHOT_CAPTURE_TO_CDN.md`
- `docs/screenshot-capture-targets.md`

## Before / After

Before:

- Pricing and FAQ copy existed in several marketing components and i18n keys.
- Public count claims had no new centralized SEO-tier contract for safe rendering.
- Large FAQ expansion, schema builders, tier link requirements, and screenshot proof targets were not represented in one audited source.

After:

- Tier value positioning is centralized.
- Quantity-sensitive claims are inventory-backed by contract.
- FAQ expansion has a structured bank ready for route integration.
- JSON-LD builders are available for schema-enabled pages.
- Internal linking expectations are explicit and test-covered.
- Screenshot proof targets are documented for Playwright capture.

## Remaining Work Before Release

Required before declaring the full SEO/pricing program complete:

1. Create Figma frames for pricing and tier page visual/hierarchy changes: desktop and mobile, light and dark.
2. Build inventory metric resolvers for real question, lesson, flashcard, simulation, clinical skill, ECG, and pharmacology counts.
3. Integrate the comparison matrix into `/pricing` using existing pricing components and semantic tokens.
4. Integrate FAQ bank into `/faq`, `/pricing`, and tier pages with existing i18n and JSON-LD patterns.
5. Add long-form SEO sections to RN, RPN/PN, NP, Allied, New Grad, and Pre-Nursing pages after content review.
6. Generate Playwright screenshots for all proof targets.
7. Run route-level mobile, accessibility, schema, typecheck, build, and Playwright validation.

## Verification

Implemented contract tests cover:

- all public tier profiles
- comparison rows across paid tiers
- no generic checkmark-only table cells
- inventory-backed quantity claims
- 50+ FAQ entries across all required categories
- JSON-LD output shape
- screenshot proof target coverage
