# Lesson Card Destination Audit

Date: 2026-05-31

## Click Target Found

The clickable-looking lesson category cards are rendered by:

- Source file: `src/components/pathway-lessons/lesson-system-card.tsx`
- Parent grid: `src/components/pathway-lessons/pathway-lessons-curriculum-hub.tsx`
- Marketing route source: `src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx`
- App route source: `src/app/(app)/app/(learner)/lessons/page.tsx`

## Original Faulty Destination

The truncated category control used:

`{lessonsBasePath}#pathway-lesson-library`

That URL points back to the same page section, not to a system-filtered lesson list. For a learner, clicking the category card could appear to do nothing because no route, loader, query, or list update was triggered.

## Corrected Destination Rules

| Display Name | Destination URL Shape | Generated Slug | Source File |
| --- | --- | --- | --- |
| Cardiovascular | `/.../lessons?topicSlug=cardiovascular` | `cardiovascular` | `lesson-system-navigation.ts` |
| Respiratory | `/.../lessons?topicSlug=respiratory` | `respiratory` | `lesson-system-navigation.ts` |
| Neurological | `/.../lessons?topicSlug=neurological` | `neurological` | `lesson-system-navigation.ts` |
| Endocrine | `/.../lessons?topicSlug=endocrine` | `endocrine` | `lesson-system-navigation.ts` |
| Renal | `/.../lessons?topicSlug=renal` | `renal` | `lesson-system-navigation.ts` |
| Gastrointestinal / GI | `/.../lessons?topicSlug=gastrointestinal` | `gastrointestinal` | `lesson-system-navigation.ts` |
| Mental Health | `/.../lessons?topicSlug=mental-health` | `mental-health` | `lesson-system-navigation.ts` |
| Pediatrics | `/.../lessons?topicSlug=pediatrics` | `pediatrics` | `lesson-system-navigation.ts` |
| Maternity | `/.../lessons?topicSlug=maternity` | `maternity` | `lesson-system-navigation.ts` |

## Fix Applied

- `LessonSystemCard` header now links to the system route.
- The `+ more` control now links to the system route instead of the same-page hash.
- Cards now emit forensic attributes:
  - `data-lesson-system-card`
  - `data-lesson-system-href`
  - `data-lesson-system-slug`
