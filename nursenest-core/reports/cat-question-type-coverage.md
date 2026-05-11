# CAT / practice pool — question_type inventory

**Generated:** 2026-05-11T02:06:40.937Z

## Scope notes

- **Practice/CAT pool** (app): `questionAccessWhereWithPathway` / `questionAccessWhere` + `NON_ECG_PRACTICE_EXAM_WHERE` + `generalStudyBankModuleSurfaceWhere()` + completeness (`isCompleteCatQuestionRow` — requires non-empty rationale).
- **NP CAT API** (`/api/cat/np/session`): additionally filters `isAdaptiveEligible: true` — RN/PN practice CAT pool in `fetchCatPracticePool` does **not** apply that flag (documented gap vs NP-only endpoint).
- **Renderer**: MCQ, SATA, Bowtie/Trend; structured/matrix/cloze rows surface `runnerUnsupportedQuestionFallback` until dedicated UI ships.

> **Inventory vs learner CAT pool:** SQL counts are **all** published, non-ECG `exam_questions` rows. At runtime, `questionAccessWhere` / `questionAccessWhereWithPathway` (tier, exam keys, country, draft/publish), `generalStudyBankModuleSurfaceWhere()`, secondary session filters, and `isCompleteCatQuestionRow` can **exclude** additional rows per session.

### Schema note

- `ExamQuestion.question_type` is a **string** (many legacy/import variants — see counts below). The Prisma `QuestionType` enum (MCQ, SATA, NGN_CASE, …) applies elsewhere (e.g. flashcard items), not to this column.

## Counts by question_type (published, non-ECG)

| question_type | count |
|---|---:|
| multiple_choice | 62532 |
| MCQ | 3572 |
| SATA | 1442 |
| multiple-choice | 1365 |
| Bowtie | 719 |
| Priority | 716 |
| Exhibit | 557 |
| mcq_single | 374 |
| Matrix | 197 |
| select_all_that_apply | 195 |
| mcq | 160 |
| standard | 128 |
| Drag-drop | 119 |
| Hot-spot | 110 |
| sata | 110 |
| priority | 103 |
| calculation | 93 |
| clinical-case | 83 |
| Fill-in | 77 |
| Trend | 51 |
| hot-spot | 40 |
| ordered | 34 |
| ordered_response | 24 |
| image-interpretation | 16 |
| next best action | 4 |
| Next Best Action | 4 |
| delegation | 2 |
| prioritization | 1 |

## Top combinations (question_type × tier × exam)

| question_type | tier | exam | count |
|---|---|---|---:|
| multiple_choice | allied | ALLIED | 43462 |
| multiple_choice | rn | NCLEX-RN | 6759 |
| multiple_choice | lvn | NCLEX-PN | 3513 |
| multiple_choice | np | NP | 3249 |
| multiple_choice | rpn | REx-PN | 2039 |
| MCQ | RN | NCLEX-RN | 1584 |
| SATA | RN | NCLEX-RN | 1442 |
| multiple_choice | rpn | NCLEX-PN | 1344 |
| multiple_choice | np | FNP | 1342 |
| multiple-choice | imaging | RDCS-AE | 1198 |
| MCQ | np | NP | 711 |
| Priority | RN | NCLEX-RN | 706 |
| MCQ | rpn | REx-PN | 669 |
| MCQ | rn | NCLEX-RN | 608 |
| Exhibit | RN | NCLEX-RN | 557 |
| multiple_choice | rrt | RRT Mixed | 549 |
| Bowtie | RN | NCLEX-RN | 392 |
| mcq_single | allied | ALLIED | 374 |
| Matrix | RN | NCLEX-RN | 197 |
| multiple_choice | rrt | TMC | 193 |
| select_all_that_apply | rn | NCLEX-RN | 193 |
| mcq | premium | NP-FNP | 160 |
| multiple-choice | imaging | CSCT-CARDIAC | 158 |
| Drag-drop | RN | NCLEX-RN | 119 |
| Hot-spot | RN | NCLEX-RN | 110 |
| calculation | imaging | RDCS-AE | 93 |
| multiple_choice | np | CNPLE | 82 |
| clinical-case | imaging | RDCS-AE | 80 |
| Fill-in | RN | NCLEX-RN | 77 |
| Bowtie | np | NP | 75 |
| Bowtie | lvn | NCLEX-PN | 75 |
| Bowtie | rpn | REx-PN | 75 |
| priority | rn | NCLEX-RN | 66 |
| standard | lvn | NCLEX-PN | 64 |
| sata | rpn | REx-PN | 55 |
| sata | lvn | NCLEX-PN | 55 |
| Trend | RN | NCLEX-RN | 51 |
| Bowtie | new_grad | New Grad Transition | 50 |
| standard | rpn | NCLEX-PN | 38 |
| ordered | rpn | REx-PN | 34 |
| Bowtie | allied | ALLIED | 32 |
| standard | rpn | REx-PN | 26 |
| ordered_response | rn | NCLEX-RN | 24 |
| hot-spot | lvn | NCLEX-PN | 20 |
| Bowtie | pre_nursing | Pre-Nursing Foundations | 20 |
| hot-spot | rpn | REx-PN | 20 |
| priority | lvn | NCLEX-PN | 19 |
| image-interpretation | imaging | RDCS-AE | 16 |
| priority | rpn | NCLEX-PN | 12 |
| Priority | rn | NCLEX-RN | 9 |
| multiple-choice | imaging | CCI-RCS | 9 |
| priority | rpn | REx-PN | 6 |
| next best action | rn | NCLEX-RN | 4 |
| Next Best Action | rn | NCLEX-RN | 4 |
| clinical-case | imaging | CSCT-CARDIAC | 3 |
| prioritization | allied | ALLIED | 1 |
| delegation | rpn | NCLEX-PN | 1 |
| select_all_that_apply | lvn | NCLEX-PN | 1 |
| Priority | rpn | REx-PN | 1 |
| delegation | lvn | NCLEX-PN | 1 |
| select_all_that_apply | rpn | REx-PN | 1 |

## Approximate CAT completeness exclusions — missing rationale

| question_type | count |
|---|---:|
| multiple_choice | 469 |
| select_all_that_apply | 126 |
| priority | 30 |
| ordered_response | 16 |

## is_adaptive_eligible = false (informational; not applied in fetchCatPracticePool)

| question_type | count |
|---|---:|

## Country / region code (top slices)

| question_type | country_code | count |
|---|---|---:|
| multiple_choice | (unset) | 52850 |
| multiple_choice | US | 9682 |
| MCQ | (unset) | 3572 |
| SATA | (unset) | 1442 |
| multiple-choice | (unset) | 1365 |
| Priority | (unset) | 716 |
| Exhibit | (unset) | 557 |
| Bowtie | (unset) | 392 |
| mcq_single | (unset) | 374 |
| Bowtie | US | 252 |
| Matrix | (unset) | 197 |
| mcq | (unset) | 160 |
| select_all_that_apply | (unset) | 129 |
| Drag-drop | (unset) | 119 |
| Hot-spot | (unset) | 110 |
| calculation | (unset) | 93 |
| clinical-case | (unset) | 83 |
| Fill-in | (unset) | 77 |
| Bowtie | CA | 75 |
| select_all_that_apply | US | 66 |
| standard | US | 64 |
| standard | (unset) | 64 |
| priority | (unset) | 56 |
| sata | US | 55 |
| sata | (unset) | 55 |
| Trend | (unset) | 51 |
| priority | US | 47 |
| ordered | (unset) | 34 |
| hot-spot | (unset) | 20 |
| hot-spot | US | 20 |
| ordered_response | (unset) | 16 |
| image-interpretation | (unset) | 16 |
| ordered_response | US | 8 |
| next best action | US | 4 |
| Next Best Action | (unset) | 4 |
| delegation | US | 1 |
| prioritization | (unset) | 1 |
| delegation | (unset) | 1 |

## CAT completeness scan

Set `CAT_REPORT_FULL_SCAN=1` to batch-scan rows and count `isCompleteCatQuestionRow` passes per `question_type`.
