# Lesson Route Existence Report

Date: 2026-05-31

## Verified Routes

| Route | Status | File |
| --- | --- | --- |
| `/app/lessons` | Exists | `src/app/(app)/app/(learner)/lessons/page.tsx` |
| `/app/lessons` loading UI | Exists | `src/app/(app)/app/(learner)/lessons/loading.tsx` |
| `/app/lessons` layout | Exists | `src/app/(app)/app/(learner)/lessons/layout.tsx` |
| `/api/learner/pathway-lessons` | Exists | `src/app/api/learner/pathway-lessons/route.ts` |
| `/canada/rn/nclex-rn/lessons` and equivalent pathway lesson hubs | Exists | `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx` |
| legacy topic path redirect | Exists | `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/topics/[topicSlug]/page.tsx` |

## Finding

No App Router route was missing. The failure was not a 404 or deleted route.

## First Broken Layer

The first broken layer was destination generation in the card component:

- `LessonSystemCard` sent the category-level “more” link to the same page hash.
- The marketing and app loaders then exact-matched topic slugs, which failed for aliases such as `renal` and `maternity`.

## Regression Protection

`src/lib/lessons/lesson-system-navigation.test.ts` now verifies these route files exist.
