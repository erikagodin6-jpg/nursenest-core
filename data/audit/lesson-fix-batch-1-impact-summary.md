# Lesson fix batch 1 — impact summary

Generated: 2026-04-14T22:39:06.777Z

## Baseline vs after
- **Baseline audit**: `git show HEAD~1:data/audit/lesson-completeness-audit.json` (generated 2026-04-14T22:09:20.173Z)
- **After audit**: `data/audit/lesson-completeness-audit.json` (generated 2026-04-14T22:38:54.184Z)
- **Batch 1 lessons compared**: 101
- **Batch-1 report note**: Batch-1 report row count / unique IDs differ from lessonsFixed; comparisons use all unique lessonIds in results.
- **Report rows / lessonsFixed field**: 101 rows · lessonsFixed=100 · unique IDs=101

## Score movement (overall)
- Improved: **101**
- Regressed: **0**
- Unchanged: **0**
- Average overall score lift: **63.71** points

## Status
- Status class changed: **100** lessons
- Now `production_ready`: **0**
- Still thin/incomplete (usable_but_thin, structurally_incomplete, content_incomplete, localization_incomplete): **100**
- Non–production-ready (any status except `production_ready`): **101**

## Status breakdown after audit (batch-1 set)
- `localization_incomplete`: **99**
- `usable_but_thin`: **1**
- `duplicate_or_unclear_source`: **1**

> production_ready requires overall≥84, publicComplete, educational≥72, links≥55, words≥500 (see deriveStatus). Overlay absence caps localization and often blocks production_ready.

## Top reasons remaining after batch 1 (among the batch-1 lesson set)
- no_educational_overlay_in_scanned_locales: **101**
- missing_educational:core_concept_depth: **94**
- thin_total_word_count: **93**
- missing_educational:overview_intro: **8**
- links:internal_links_high_count(9): **7**
- missing_educational:clinical_application: **2**
- Legacy section "clinical_meaning" is below the minimum depth (37 < 50 words).: **1**
- Legacy section "exam_relevance" is below the minimum depth (9 < 30 words).: **1**
- Legacy section "clinical_scenario" is below the minimum depth (18 < 40 words).: **1**
- Legacy section "takeaways" is below the minimum depth (31 < 35 words).: **1**
- Clinical scenario section must include a structured patient vignette (patient/client frame plus clinical context).: **1**
- low_total_word_count: **1**
- missing_educational:summary_takeaways: **1**
- missing_educational:exam_or_reasoning_cues: **1**
- links:no_internal_study_links: **1**

## Threshold recommendation
- **Suggestion**: Keep thresholds as-is for now: batch-1 raised scores, but systemic gaps remain (especially no_educational_overlay_in_scanned_locales and missing_educational:core_concept_depth on legacy five-block lessons). Tackle batch-2 + overlay keys before relaxing gates.
- **Rationale**: Lowering bars would hide thin word counts and missing educational buckets; production_ready should stay a high bar until overlays and spine depth are addressed pathway-wide.

## Batch 2 candidates
- Next **100** lessons: `data/audit/lesson-fix-batch-2-candidates.json` (excludes batch-1 IDs and `production_ready` rows).

## Full per-lesson table
See `data/audit/lesson-fix-batch-1-impact.json` → `comparisons`.