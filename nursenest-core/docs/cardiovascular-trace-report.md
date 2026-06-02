# Cardiovascular Trace Report

Date: 2026-05-31

## Cardiovascular Flow

1. Card renders in `LessonSystemCard`.
2. Destination is generated with `primaryLessonSystemTopicSlug("cardiovascular")`.
3. Destination becomes `/canada/rn/nclex-rn/lessons?topicSlug=cardiovascular` on the public pathway hub, or `/app/lessons?topicSlug=cardiovascular&pathwayId=...` inside the learner app.
4. App route uses `pathwayLessonsAppListWhereWithTopicFilter`.
5. Marketing route builds `listOpts.topicSlugsIn`.
6. Query filters published lessons by pathway, locale, entitlement/visibility, safety, and topic slug candidates.
7. Rows render in `PathwayLessonsCurriculumHub` for marketing or `LearnerLessonsResponsiveResults` for the app.

## Cardiovascular Result

- Generated slug: `cardiovascular`
- Catalog matches: 66 in CA RN bundled catalog
- First failure: not route existence; the card-level destination could previously point to the same-page hash.

## Repeated Trace Summary

| System | Generated Slug | Stored Slug Match Strategy | Result |
| --- | --- | --- | --- |
| Cardiovascular | `cardiovascular` | direct | fixed |
| Respiratory | `respiratory` | direct | fixed |
| Neurological | `neurological` | direct | fixed |
| Endocrine | `endocrine` | direct | fixed |
| Renal | `renal` | expands to `renal-and-urinary`, `fluids-electrolytes-and-acid-base`, and related aliases | fixed |
| GI | `gastrointestinal` | expands to `gastrointestinal`, `nutrition`, and `gi` aliases | fixed |

## First Failure Point

The first observable failure point was the card destination layer. The secondary failure was exact `topicSlug` filtering for systems whose display slug differs from stored lesson slugs.
