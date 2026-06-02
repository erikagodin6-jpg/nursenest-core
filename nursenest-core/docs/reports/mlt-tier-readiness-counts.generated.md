# MLT tier — readiness counts (generated)
_Generated: 2026-05-11T04:06:34Z. Run: `npx tsx scripts/mlt-tier-readiness-inventory.mts`._
## Scope
- **Lessons**: `pathway_lessons` with `pathway_id ∈ {us-allied-core, ca-allied-core}` and `allied_profession_key = 'mlt'` when the column exists.
- **Lesson scope note**: `allied_profession_key` is absent in this database — lesson totals are **allied-core pathway only** (not MLT-filtered).
- **Flashcard decks**: `flashcard_decks.pathway_id` in allied core + `tier = ALLIED` (shared allied decks; rows are not keyed by allied profession).
- **Practice pool**: `medicalLaboratoryTechnologyExamQuestionPoolWhere()` + published.
- **Premium modules**: same pool AND each `module:mlt-*` bank tag (published).
- **Legacy careerType slice** (diagnostic): questions with `career_type = 'mlt'` within allied core marketing + study-bank gates + published (subset of profession OR-tag logic).
## Totals
| Asset | Count |
| --- | ---: |
| Lessons (total, MLT-filtered when column exists) | 46 |
| Flashcard decks (allied core / ALLIED tier) | 0 |
| Flashcards (published, those decks) | 0 |
| Practice questions (published, MLT pool) | 0 |
| CAT-eligible (published, MLT pool, `isAdaptiveEligible`) | 0 |
| Diagnostic: published `career_type = mlt` (allied core gates) | 0 |
### Premium specialty tagged pools (published)
| Module | Count |
| --- | ---: |
| Hematology (`module:mlt-hematology`) | 0 |
| Blood bank / transfusion medicine (`module:mlt-blood-bank`) | 0 |
| Clinical chemistry (`module:mlt-clinical-chemistry`) | 0 |
| Microbiology (`module:mlt-microbiology`) | 0 |
| Urinalysis (`module:mlt-urinalysis`) | 0 |
| Histology / pathology (`module:mlt-histology-pathology`) | 0 |
| Molecular diagnostics (`module:mlt-molecular-diagnostics`) | 0 |
| Quality control / instrumentation (`module:mlt-qc-instrumentation`) | 0 |
### Lessons by status
- **PUBLISHED**: 46
### Exam questions by status (MLT pool, all statuses)
### Question types (`question_type`, published MLT pool)
_No rows._
### Question formats (`question_format`, top 40, published MLT pool)
_No rows._
### Body system / category (top 40, published MLT pool)
_No rows._
