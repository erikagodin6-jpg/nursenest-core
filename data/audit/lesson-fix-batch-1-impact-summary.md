# Lesson fix batch 1 — impact summary

Generated: 2026-04-14T22:34:30.842Z

## Baseline vs after
- **Baseline audit**: `git show HEAD:data/audit/lesson-completeness-audit.json` (generated 2026-04-14T22:09:20.173Z)
- **After audit**: `data/audit/lesson-completeness-audit.json` (generated 2026-04-14T22:32:55.928Z)
- **Batch 1 lessons compared**: 101

## Score movement (overall)
- Improved: **100**
- Regressed: **0**
- Unchanged: **1**
- Average overall score lift: **62.56** points

## Status
- Status class changed: **100** lessons
- Now `production_ready`: **0**
- Still thin/incomplete (usable_but_thin, structurally_incomplete, content_incomplete, localization_incomplete): **100**

> production_ready threshold may be strict in current scoring; see lesson-completeness-summary.json methodology.

## Top reasons remaining after batch 1 (among the 100 fixed lessons)
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
- **Suggestion**: Keep thresholds as-is until batch-2 completes and overlay/localization work is scoped; batch-1 lifted educational/structural/link signals but duplicate_or_unclear_source and no_educational_overlay often remain systemic.
- **Rationale**: Adjusting thresholds now would mask remaining content and i18n gaps; prefer targeted batch fixes + overlay keys before relaxing gates.

## Batch 2 candidates
- Next **100** lessons: `data/audit/lesson-fix-batch-2-candidates.json` (excludes batch-1 IDs and `production_ready` rows).

## Full per-lesson table
See `data/audit/lesson-fix-batch-1-impact.json` → `comparisons`.