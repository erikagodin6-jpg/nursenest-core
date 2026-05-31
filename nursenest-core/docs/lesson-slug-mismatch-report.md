# Lesson Slug Mismatch Report

Date: 2026-05-31

## Mismatches Found

| UI/System Slug | Stored Lesson Slug(s) | Impact Before Fix |
| --- | --- | --- |
| `renal` | `renal-and-urinary`, `fluids-electrolytes-and-acid-base` | zero results or same-page no-op |
| `maternity` | `maternal-and-newborn` | zero results or same-page no-op |
| `mental_health` | `mental-health` | inconsistent filtering depending on source |
| `gastrointestinal` | `gastrointestinal`, `nutrition` | incomplete system coverage |
| `renal_urinary` | `renal-and-urinary` | exact-match miss |
| `reproductive_maternal_newborn` | `maternal-and-newborn` | exact-match miss |

## Root Cause

Different layers used different naming schemes:

- UI and taxonomy categories use semantic system labels.
- Lesson inventory uses topic slugs produced by catalog generation.
- Route filtering exact-matched a single `topicSlug`.

## Fix

`src/lib/lessons/lesson-system-navigation.ts` now maps display names, taxonomy IDs, and stored topic slugs into a shared candidate list used by:

- App lesson query filters.
- App bundled catalog fallback.
- Marketing pathway lesson hub filters.
- Lesson system card href generation.
