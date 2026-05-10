# Bowtie / Trend NGN — Question Data & Renderer Audit

**Date:** 2026-05-09  
**Scope:** Production app under `nursenest-core/` (`ExamQuestion` bank, practice/CAT runners, grading APIs).  
**Truthpack:** `.vibecheck/truthpack/` not present in this workspace clone — contracts inferred from code.

## 1. Data model (no schema migration performed)

- **`exam_questions`** (`prisma/schema.prisma`): `question_type` (string), `stem` (text), `options` (JSON array historically — **nullable Json**), `correct_answer` (JSON), `rationale`, `scenario` (optional text column), `exhibit_data`, etc.
- Bowtie items can use **`options` as a structured JSON object** (same column type — **no migration**) holding `bank`, `slotLabels`, `format`, optional nested scenario copy.
- **`correct_answer`** for bowtie: recommended shape `{ "correctMapping": { "condition": "<id>", "intervention": "<id>", "monitoring": "<id>" } }` where values are **canonical option ids** from `bank`, aligned with learner submission `{ "type": "bowtie", "mapping": { ... } }`.

## 2. Load path

- Practice/CAT single-item fetch: `GET /api/practice-tests/[id]/question` selects `stem`, `questionType`, `options`, … — **does not select `scenario`** today; bowtie may rely on **stem** as the clinical vignette or embed auxiliary copy under `options.scenario`.

## 3. Question type representation

- Free-form string (`ExamQuestion.questionType`). Pipeline / blueprint types include `"Bowtie"` and `"Trend"` (`exam-blueprint-schema.ts`).
- Runners today branch **MCQ vs SATA** via uppercase compare (`SATA`, `SELECT_ALL_THAT_APPLY`) in `practice-test-runner-client.tsx` and `question-bank-practice-client.tsx`.

## 4. Renderer pipeline (before change)

- **`practice-test-runner-client.tsx`**: Parses `options` with local `parseOptions` → **string array only**; MCQ = radiogroup (`AnswerOptionRow`), SATA = checkboxes.
- **`question-bank-practice-client.tsx`**: Same MCQ/SATA split with strike/highlight tools.
- CAT scoring path: `scoreOne` → `answerMatches` (`score-session-answers.ts`). API grading: `gradeMatches` + `normalizeCorrect` (`grade-answer-match.ts`).

## 5. Answer storage & persistence

- Session answers: `Record<questionId, unknown>` JSON on `practice_tests` save — objects supported by JSON.
- Peer analytics / attempts may stringify selection — bowtie answers stored as **JSON-serializable objects** consistent with existing unknown-shaped answers.

## 6. Correctness & contracts

- **`answerMatches`**: Previously treated non-SATA answers as **string-like**; bowtie payloads now compare `correctMapping` vs learner `mapping` (all-or-nothing).
- **`gradeMatches` / `normalizeCorrect`**: Extended so missing-key checks and grading respect `correctMapping` objects.

## 7. Rationale

- CAT **test** mode: rationale deferred / locked — unchanged by renderer choice.
- CAT **study** / linear practice: existing `buildCatStudyFeedback` / `buildLinearCommitFeedback` use `answerMatches` — bowtie correctness flows through the same path.
- Question bank: `/api/questions/grade` uses `gradeMatches` — accepts bowtie answers.

## 8. JSON / metadata for structured NGN payloads

- Preferred learner answer:  
  `{"type":"bowtie","mapping":{"condition":"<id>","intervention":"<id>","monitoring":"<id>"}}`
- Preferred bank payload (in `options`): documented in `bowtie-adapter.ts` (supports `format: "bowtie"`, `bank`, `slotLabels`).

## 9. Schema conclusion

- **No Prisma schema change required** for MVP: reuse Json columns for structured `options` and `correct_answer`.
- Optional follow-up: add `scenario` to practice-test question `select` if editorial wants column-backed scenario without duplicating into `options`.
