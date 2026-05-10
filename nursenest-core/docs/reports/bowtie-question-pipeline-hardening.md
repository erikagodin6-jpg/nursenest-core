# Bowtie Question Pipeline Hardening

## Files Changed

- `src/lib/questions/bowtie-question-schema.ts`
- `src/lib/questions/exam-question-bank-sql.ts`
- `src/lib/questions/exam-question-draft-publish.test.ts`
- `src/lib/questions/bowtie-question-schema.test.ts`
- `src/lib/questions/bowtie-adapter.test.ts`
- `src/lib/content/question-schema.ts`
- `src/lib/content/question-schema.bowtie.test.ts`
- `src/lib/admin/question-bank-bulk-import.ts`
- `src/lib/admin/question-bank-bulk-import.bowtie.test.ts`
- `src/lib/content-pipeline/schemas/exam-question-import-record.ts`
- `src/lib/content-pipeline/schemas/exam-question-import-record.bowtie.test.ts`
- `src/lib/practice-tests/cat-pool.ts`
- `src/lib/practice-tests/cat-pool.bowtie-safety.test.ts`
- `src/lib/replit-import/replit-question-normalize.ts`
- `src/lib/replit-import/replit-question-import.test.ts`
- `src/lib/prisma/exam-question-maps.ts`
- `src/app/api/admin/questions/route.ts`

## Validation Rules Added

- Bowtie-compatible question types are recognized through the existing `isBowtieQuestionType` logic.
- Bowtie payloads must include `options.format === "bowtie"` or an explicit bowtie bank.
- Bowtie banks must normalize through `tryNormalizeBowtiePayload`.
- `correct_answer.correctMapping` must include non-empty `condition`, `intervention`, and `monitoring` keys.
- Each mapped answer id must exist in the normalized bowtie bank.
- Publish-mode bowtie validation requires rationale, topic or body system, publish-allowlisted exams, and non-ECG routing.
- Non-bowtie MCQ/SATA/FIB/ordering validation remains array/scalar based and does not accept arbitrary object answers.

## Publish Behavior

Before: minimal publish SQL rejected every object-shaped `correct_answer`, so valid bowtie drafts could remain drafts even when renderer/grader support existed.

After: `EXAM_QUESTION_CORRECT_ANSWER_PRESENT_SQL` accepts object-shaped answers only when `question_type` is bowtie/trend compatible and `correct_answer.correctMapping` has complete slot keys. Random objects for non-bowtie question types remain invalid. Strict publish now uses the same answer-shape predicate instead of only checking `correct_answer IS NOT NULL`.

## Supported Import Paths

- Admin bulk import accepts the existing rich bowtie seed shape and the canonical object-shaped bowtie row with `options` plus `answerKey.correctMapping`.
- Content pipeline import records accept canonical bowtie `options` objects and `correctAnswer.correctMapping` objects while preserving array validation for conventional rows.
- Replit/monolith-style `exam_questions.json` normalization preserves bowtie `question_type`, `options`, and `correct_answer` objects and validates mappings before creating `ExamQuestion` inputs.
- Admin question creation accepts bowtie/trend question types with object-shaped `options` and `answerKey`.

## Unsupported Or Deferred

- No public routing or learner route exposure changed.
- No schema or migration changes were made; `ExamQuestion.questionType` remains string-backed.
- ECG bowtie questions remain excluded from regular practice/CAT pools unless routed through explicit ECG surfaces.
- The report does not add a separate ECG bowtie route or entitlement product.

## Commands Run

- `node --import tsx --test src/lib/questions/exam-question-draft-publish.test.ts src/lib/questions/bowtie-question-schema.test.ts src/lib/content/question-schema.bowtie.test.ts src/lib/admin/question-bank-bulk-import.bowtie.test.ts src/lib/content-pipeline/schemas/exam-question-import-record.bowtie.test.ts src/lib/practice-tests/cat-pool.bowtie-safety.test.ts src/lib/questions/bowtie-adapter.test.ts`
- `node --import tsx --test src/lib/replit-import/replit-question-import.test.ts src/lib/questions/exam-question-draft-publish.test.ts src/lib/questions/bowtie-question-schema.test.ts src/lib/content/question-schema.bowtie.test.ts src/lib/admin/question-bank-bulk-import.bowtie.test.ts src/lib/content-pipeline/schemas/exam-question-import-record.bowtie.test.ts src/lib/practice-tests/cat-pool.bowtie-safety.test.ts src/lib/questions/bowtie-adapter.test.ts src/lib/questions/grade-answer-match.bowtie.test.ts`
- `node --import tsx --test src/lib/questions/bowtie-adapter.test.ts`
- `node --import tsx --test src/lib/questions/exam-question-draft-publish.test.ts`
- `npm run typecheck:critical`
- `npm run audit:exam-bank`
- `npm run content:ensure:exam-bank -- --dry-run`

## Remaining Risks

- Production data may contain historical bowtie-like rows with nonstandard bank ids or alternate mapping keys; those remain intentionally rejected until normalized.
- `QuestionType` from Prisma does not include bowtie enum values, so bowtie-capable paths use string casts at boundaries where legacy enum typing remains.
- Database-backed audit passed against the connected DigitalOcean database; `content:ensure:exam-bank` was run in `--dry-run` mode only because the default command performs seed, publish UPDATE, and pathway upsert writes.
