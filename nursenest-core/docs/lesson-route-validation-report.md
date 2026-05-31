# Lesson Route Validation Report

Date: 2026-05-31

## Validated App Route Shape

Canonical app route:

`/app/lessons?topicSlug={systemTopicSlug}&pathwayId=ca-rn-nclex-rn`

## Required Systems

| System | Primary Route Slug | Alias Coverage |
| --- | --- | --- |
| Cardiovascular | `cardiovascular` | `cardiac`, `cv`, `heart` |
| Respiratory | `respiratory` | `pulmonary`, `airway`, `gas-exchange` |
| Neurological | `neurological` | `neurologic`, `neuro` |
| Endocrine | `endocrine` | `diabetes`, `diabetes-mellitus`, `thyroid` |
| Renal | `renal` | `renal-and-urinary`, `renal_urinary`, `renal-genitourinary`, `fluids-electrolytes-and-acid-base` |
| Gastrointestinal | `gastrointestinal` | `gi`, `digestive`, `nutrition` |
| Mental Health | `mental-health` | `mental_health`, `psychiatric`, `psychiatry`, `behavioral-health` |
| Pediatrics | `pediatrics` | `pediatric`, `child-health`, `children` |
| Maternity | `maternity` | `maternal-and-newborn`, `reproductive_maternal_newborn`, `reproductive_obstetrics`, `obstetrics`, `newborn` |

## Route Construction Fixes

- Added `buildAppLessonsSystemHref`.
- Added `primaryLessonSystemTopicSlug`.
- Marketing lesson system card headers now link to topic-scoped lesson hubs instead of acting as inert section labels.
- `topicSlug` filters now route through alias expansion before database and catalog filtering.

## Regression Coverage

- `src/lib/lessons/lesson-system-navigation.test.ts`
- `tests/e2e/lessons/lesson-system-navigation.spec.ts`
