# Learner Exam/Flashcard Live Routing Fix

Date: 2026-05-13

## Root Cause

The redesigned learner surfaces were already present under the canonical premium routes:

- Practice exams / mock exams: `/app/practice-tests?startMode=practice_exam`
- CAT setup and launch: `/app/practice-tests/start`, `/app/practice-tests/cat-launch`, `/app/practice-tests/[id]`
- Flashcards: `/app/flashcards`

However, multiple dashboard, lesson, progress, report-card, and quick-link CTAs still pointed to the legacy `/app/exams` entry. That made live navigation feel like the old exams interface was still the product surface, even though `/app/exams` redirected internally.

## Fix Applied

- Kept `/app/exams` as a backward-compatible alias, but made it preserve query params and redirect into `/app/practice-tests?startMode=practice_exam`.
- Updated learner-facing practice exam / mock exam CTAs to link directly to `/app/practice-tests?startMode=practice_exam`.
- Updated the learner primary nav helper so the legacy "Exams" label still opens the premium practice-tests surface.
- Updated planner, recommendation, retention, email, and button-audit seed links that generate learner-facing practice-exam CTAs.
- Preserved old attempt detail routes under `/app/exams/attempts/[id]` for historical reports, but all back links now return to the premium practice-tests hub.

## Regression Guards

- `src/lib/practice-tests/practice-alias-redirect.contract.test.ts`
  - Confirms `/app/practice` and `/app/exams` remain redirect aliases to `/app/practice-tests`.
  - Confirms `/app/exams` preserves query params and practice-exam intent.
- `src/lib/navigation/learner-primary-nav.test.ts`
  - Confirms the legacy `Exams` label no longer routes to `/app/exams`.

## Verification

- `npx tsx --conditions=react-server src/lib/practice-tests/practice-alias-redirect.contract.test.ts`
  - 2/2 passed.
- `npx tsx --conditions=react-server src/lib/navigation/learner-primary-nav.test.ts`
  - 9/9 passed.
- Static scan:
  - No remaining direct `/app/exams` links in learner/student/study/recommendation/retention CTA surfaces.
  - Remaining `/app/exams` references are historical attempt detail routes (`/app/exams/attempts/:id`), legacy alias tests, docs/comments, or route-contract compatibility.

## Deploy Safety

This is a routing-only convergence patch. It does not change auth, entitlements, Stripe, exam session APIs, flashcard engines, CAT scoring, or historical attempt report routes.
