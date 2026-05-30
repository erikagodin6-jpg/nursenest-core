# HESI A2, ATI TEAS, and CASPer Readiness Recovery Audit

Date: 2026-05-30

## Executive Summary

HESI A2 and ATI TEAS are not production-ready products in the current codebase. CASPer is present only as an admissions-readiness slice and is not a fully integrated learner product.

This pass corrected the most urgent user-facing risk: public navigation no longer implies HESI or TEAS availability by sending learners silently to the generic Pre-Nursing hub. Each incomplete admissions product now has a dedicated, noindex status page that explains its current state and launch gaps.

## Evidence Reviewed

- `src/components/layout/site-header.tsx`
- `src/components/layout/site-header-server.tsx`
- `src/app/(marketing)/(default)/pre-nursing/**`
- `src/app/(marketing)/[locale]/pre-nursing/**`
- `src/components/pre-nursing/**`
- `src/lib/admissions/admissions-slice-readiness.ts`
- `src/lib/admissions-academy/admissions-academy-programs.ts`
- `src/lib/exam-pathways/admissions-prep-internal-pathways.ts`
- `src/lib/exam-pathways/exam-pathways-data-segment-f-internal-admissions.ts`
- `src/lib/seo/sitemap-static-xml.ts`
- `docs/prenursing-modules-lessons-quizzes-audit.md`
- `docs/prenursing-figma-redesign-summary.md`

## Current Product Status

| Product | Public status | Product readiness | Public route | Indexing |
| --- | --- | ---: | --- | --- |
| HESI A2 | Coming soon | 39% | `/pre-nursing/hesi-a2` | noindex, follow |
| ATI TEAS | Coming soon | 39% | `/pre-nursing/ati-teas` | noindex, follow |
| CASPer | Beta in development | 11% | `/pre-nursing/casper` | noindex, follow |

Readiness percentages are calculated from `src/lib/admissions/admissions-slice-readiness.ts`, not marketing estimates.

## Navigation Corrections

Before:

- Header HESI link routed to `/pre-nursing`.
- Header TEAS link routed to `/pre-nursing`.
- Learners clicking HESI or TEAS could reasonably infer a dedicated product existed, but landed on a generic Pre-Nursing hub.

After:

- HESI A2 routes to `/pre-nursing/hesi-a2`.
- ATI TEAS routes to `/pre-nursing/ati-teas`.
- CASPer is surfaced inside the Pre-Nursing admissions product status grid.
- The Pre-Nursing hub now clearly identifies these as admissions products under completion review.

## Sitemap And SEO Status

No new HESI A2, ATI TEAS, or CASPer status page was added to sitemap output.

Status pages intentionally emit:

- `robots: { index: false, follow: true }`
- canonical URLs for the exact readiness status route

This preserves crawl safety while preventing incomplete product pages from being indexed as launch-ready marketing pages.

## Remaining Launch Gaps

HESI A2:

- Dedicated HESI A2 hub
- HESI A2 blueprint registry
- HESI-style question bank
- Section diagnostic
- Section-based study plan
- Timed practice tests
- Section analytics
- Public SEO landing pages

ATI TEAS:

- Dedicated TEAS hub
- TEAS blueprint registry
- TEAS-style question bank
- TEAS diagnostic
- Timed TEAS practice tests
- Adaptive remediation
- TEAS section analytics
- Public SEO landing pages

CASPer:

- Dedicated CASPer hub
- Situational judgment scenario bank
- Response rubric
- Timed response practice
- Structured feedback engine
- Model response library
- Competency analytics
- Public SEO landing pages

## Guardrails Added

- `src/lib/pre-nursing/admissions-product-readiness.contract.test.ts`
  - Verifies HESI A2, ATI TEAS, and CASPer are not marked launch-complete.
  - Verifies readiness routes do not collapse into `/pre-nursing`.
  - Verifies non-localized status routes are not locale-prefixed.
  - Verifies header links do not silently route HESI or TEAS to generic Pre-Nursing.
  - Verifies readiness pages remain noindex status pages.

## Recommended Next Steps

P0:

- Create dedicated entitlement records and checkout wiring only when content and learner surfaces are ready.
- Add explicit launch gate tests for entitlement, checkout, diagnostics, lessons, flashcards, questions, analytics, screenshots, and QA.
- Keep status pages noindex until each product passes launch criteria.

P1:

- Build HESI A2 and ATI TEAS diagnostics and section analytics.
- Build CASPer rubrics, timed response trainer, and structured feedback.
- Add product-specific screenshot coverage once real surfaces exist.

P2:

- Add indexable landing pages after trademark/compliance copy review and product QA.
- Expand authority/blog clusters only after canonical product routes are launch-approved.
