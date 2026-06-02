# Loading State Upgrade

Date: 2026-06-01

## Objective

Replace blank or spinner-first learner loading states with page-shaped skeleton loaders for the highest-traffic learning activities:

- Lessons
- Flashcards
- Practice Tests
- CAT
- Dashboard
- Study Plan

The implementation focuses only on perceived latency and loading clarity. It does not change learner behavior, scoring, CAT logic, route structure, entitlements, or data contracts.

## Audit Findings

| Area | Existing state | Risk | Fix |
| --- | --- | --- | --- |
| Lessons | Existing hub and lesson-detail skeletons were already present. | Low | Preserved existing page-shaped lesson loaders. |
| Flashcards | Route loading and Suspense fallback wrapped the skeleton inside `BrandedPageLoader`. | Medium | Removed loader wrapper so the flashcard hub structure renders immediately. |
| Practice Tests | Practice Tests route reused the Flashcards hub skeleton. | Medium | Replaced with a practice/CAT launcher skeleton that mirrors modes, filters, and readiness rail. |
| CAT | `/app/cat` and `/app/practice-tests/cat-launch` had no dedicated loading surface. | Medium | Added CAT loading files using the practice/CAT launcher skeleton. |
| Dashboard | Learner route root used a generic branded loader and simple bars. | Medium | Replaced with a dashboard-shaped skeleton: hero, stat cards, chart area, recommendation rail. |
| Study Plan | No route-level loading file existed. | Medium | Added a study-plan skeleton with path steps and adaptive recommendation rail. |

## Files Changed / Reused

- `src/components/skeletons/hub-page-skeleton.tsx` (reused shared skeleton primitives)
- `src/app/(app)/app/(learner)/loading.tsx`
- `src/app/(app)/app/(learner)/flashcards/loading.tsx`
- `src/app/(app)/app/(learner)/flashcards/page.tsx`
- `src/app/(app)/app/(learner)/practice-tests/loading.tsx`
- `src/app/(app)/app/(learner)/cat/loading.tsx`
- `src/app/(app)/app/(learner)/practice-tests/cat-launch/loading.tsx`
- `src/app/(app)/app/(learner)/study-plan/loading.tsx`

## Loader Coverage

| Route family | Loader now shown |
| --- | --- |
| `/app` | `LearnerDashboardPageSkeleton` |
| `/app/lessons` | `LessonsHubSkeleton` |
| `/app/lessons/[id]` | `LearnerLessonDetailSkeleton` |
| `/app/flashcards` | `FlashcardsHubSkeleton` |
| `/app/flashcards/[deckRef]` | `FlashcardStudySessionSkeleton` |
| `/app/practice-tests` | `PracticeTestsHubSkeleton` |
| `/app/practice-tests/[id]` | `PracticeTestRunPageSkeleton` |
| `/app/cat` | `PracticeTestsHubSkeleton` with CAT label |
| `/app/practice-tests/cat-launch` | `PracticeTestsHubSkeleton` with CAT label |
| `/app/study-plan` | `StudyPlanPageSkeleton` |

## Streaming Behavior

Route-level `loading.tsx` files now provide immediate page structure while server components, protected-route context, entitlement checks, and activity data resolve. The Flashcards hub Suspense fallback now renders the same hub skeleton directly, instead of showing a secondary branded loader shell.

This gives learners stable structure first:

- Hero/header area
- Primary content cards
- Secondary rail
- Filters or path controls where appropriate
- Session card shapes for practice/CAT flows

## Screenshots

Screenshot previews were generated from a loading-state harness in `reports/loading-state-upgrade/` to document the intended skeleton structures without depending on protected-route auth timing.

| Surface | Screenshot |
| --- | --- |
| Lessons | `reports/loading-state-upgrade/lessons-loading-skeleton.png` |
| Flashcards | `reports/loading-state-upgrade/flashcards-loading-skeleton.png` |
| Practice Tests | `reports/loading-state-upgrade/practice-loading-skeleton.png` |
| CAT | `reports/loading-state-upgrade/cat-loading-skeleton.png` |
| Dashboard | `reports/loading-state-upgrade/dashboard-loading-skeleton.png` |
| Study Plan | `reports/loading-state-upgrade/study-plan-loading-skeleton.png` |

## Validation

- Targeted ESLint passed for the changed loader and skeleton files.
- Screenshot capture completed successfully after running Chromium outside the default sandbox.

## Result

Status: PASS

The learner application now shows professional page-shaped skeleton loaders for the requested surfaces. The most visible spinner-first and mismatched loading states were removed, and missing route-level loading states were added for CAT and Study Plan.
