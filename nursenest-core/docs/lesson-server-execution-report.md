# Lesson Server Execution Report

Date: 2026-05-31

## Server Execution Chain

App:

1. `/app/lessons`
2. `resolveEntitlementForPage`
3. `visiblePathwayIdsForAppLessons`
4. `pathwayLessonsAppListWhereWithTopicFilter`
5. `paginatePathwayLessonsForAppSubscriberHubMatchingDetailResolver`
6. `LearnerLessonsResponsiveResults`

Marketing:

1. `/{country}/{role}/{exam}/lessons`
2. `normalizeMarketingLessonsHubTopicSlug`
3. `lessonSystemTopicSlugCandidates`
4. `loadPathwayLessonsHubPage`
5. `verifyMarketingHubLessonRowsResolve`
6. `PathwayLessonsCurriculumHub`

## Server Findings

No missing server page, loader, or layout was found. The server-side failure was filter semantics: a single exact `topicSlug` was used where a system/category alias set was required.

## Logging Added

- `lesson_system_server_render_failed`
- `lesson_system_query_failed`
- `lesson_system_api_unhandled_failure`
- `lesson_system_client_load_failed`

## Root Cause File

Primary card destination issue:

`src/components/pathway-lessons/lesson-system-card.tsx`

Primary filter issue:

`src/lib/lessons/app-pathway-lesson-list-scope.ts`

Marketing filter issue:

`src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx`
