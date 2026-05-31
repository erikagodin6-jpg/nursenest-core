# Lesson Query Audit

Date: 2026-05-31

## Query Chain

Primary app page:

- `pathwayLessonsAppListWhereWithTopicFilter`
- `pathwayLessonAppHubSafetyPrismaWhere`
- `paginatePathwayLessonsForAppSubscriberHubMatchingDetailResolver`
- `loadPathwayLessonProgressMap` after first content work

API refresh:

- `/api/learner/pathway-lessons`
- Same entitlement, pathway, topic, safety, and renderability chain
- Catalog fallback through `buildAppLessonsCatalogFallbackBlock`

## Filters Audited

- `pathwayId`
- `topicSlug`
- `topic`
- country/region entitlement
- tier entitlement
- allied profession scope
- `ContentStatus.PUBLISHED`
- `locale=en`
- structural/renderability safety

## Catalog Evidence

Bundled CA RN catalog counts after alias expansion:

| System | Available Catalog Lessons | Published Evidence |
| --- | ---: | --- |
| Cardiovascular | 66 | `cardiovascular` |
| Respiratory | 50 | `respiratory` |
| Neurological | 51 | `neurological` |
| Endocrine | 36 | `endocrine` |
| Renal | 97 | `renal-and-urinary`, `fluids-electrolytes-and-acid-base` |
| Gastrointestinal | 74 | `gastrointestinal`, `nutrition` |
| Mental Health | 9 | `mental-health` |
| Pediatrics | 18 | `pediatrics` |
| Maternity | 56 | `maternal-and-newborn` |

## Finding

Lessons existed, but the filter chain could miss them when a UI/system label produced a topic slug that differed from stored catalog/DB slugs.

## Fix

`pathwayLessonsAppListWhereWithTopicFilter` now expands topic slugs through `lessonSystemTopicSlugCandidates`. Catalog fallback uses the same candidates, so live and degraded modes behave consistently.
