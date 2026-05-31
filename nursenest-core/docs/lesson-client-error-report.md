# Lesson Client Error Report

Date: 2026-05-31

## Client Components Audited

- `LearnerLessonsResponsiveResults`
- `LearnerLessonsVirtualList`
- `LessonCard`
- `LessonSystemCard`

## Findings

1. Client filtering set `loading=true` only after URL/state updates and cache checks. Fast failures could feel like no interaction happened.
2. Fetch failures surfaced only in the small summary line while stale rows could remain visible.
3. A zero-row filtered payload rendered no lesson list and no explicit empty state.
4. System card headers in the curriculum hub were visual labels, not links.

## Fixes

- `loading=true` is now set immediately when a lesson filter begins.
- Empty filtered results show a visible reset state.
- Fetch failures show a visible retry card.
- Client fetch failures send a structured diagnostic to `/api/learner/lesson-loading-errors`.
- System card headers now link to their topic lesson list.

## Validation Targets

- No blank lesson body.
- No silent fetch failure.
- No inert-looking category header.
- Retry path available after a failed load.
