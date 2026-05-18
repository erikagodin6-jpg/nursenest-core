# Premium lesson production proof

This report records the live-route proof points for the premium lesson reading architecture.

## Protected surfaces

- Public marketing lesson detail route
- Authenticated learner lesson detail route
- Lesson section navigation component
- Sticky review dock component

## Required production markers

Both live lesson detail routes should expose stable DOM markers for browser QA and screenshot validation:

- `data-nn-premium-lessons-reading-layout`
- `data-nn-premium-lessons-reading-main`
- `data-nn-premium-lessons-section-system`
- `data-nn-premium-retention-review-zone`
- `data-nn-premium-lessons-linked-learning`
- `pathway-lesson-main-column`

## Must not return

The old rail-based lesson shell should stay absent from both surfaces:

- `PathwayLessonStudyRail`
- `PathwayLessonDeferredRelatedRail`
- `nn-lesson-layout--triple`
- `nn-lesson-study-rail`
- `nn-lesson-related-rail`

## SEO and conversion anchors

The public lesson route must keep these anchors present:

- medical education JSON-LD
- breadcrumb schema
- EEAT attribution
- study cross-links
- quiz embed conversion block
- pathway exam hub link

## Manual production check

Open one public lesson and one signed-in learner lesson. Confirm that the title/header remains at the top, the section menu is horizontal, the clinical pearls/traps/review material sits near the bottom, and no left or right side rail appears.
