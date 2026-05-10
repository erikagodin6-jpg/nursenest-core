import { Prisma } from "@prisma/client";

import { examQuestionExamPublishAllowlist } from "@/lib/content-quality/exam-question-exam-normalization";

/**
 * Matches published rows regardless of legacy casing (`published` vs `PUBLISHED`).
 * Use in `$queryRaw` fragments: `WHERE ${EXAM_QUESTION_STATUS_PUBLISHED_SQL}`.
 */
export const EXAM_QUESTION_STATUS_PUBLISHED_SQL = Prisma.sql`lower(trim(coalesce(status, ''))) = 'published'`;

/**
 * Question formats excluded from flashcard-style / linear practice pools (matches hub + CAT non-ECG gate).
 */
export const EXAM_QUESTION_FLASHCARD_ELIGIBLE_FORMAT_SQL = Prisma.sql`(question_format IS NULL OR lower(trim(question_format)) NOT IN (
  'ecg','ekg','ecg_video','video','video_case','media','image_only'
))`;

/** Draft-only status match for bulk publish scripts. */
export const EXAM_QUESTION_DRAFT_STATUS_SQL = Prisma.sql`lower(trim(coalesce(status, ''))) = 'draft'`;

/**
 * `correct_answer` JSON is non-null and non-empty.
 * Object-shaped answers are allowed only for bowtie-compatible question types with a complete correctMapping.
 */
export const EXAM_QUESTION_CORRECT_ANSWER_PRESENT_SQL = Prisma.sql`
  correct_answer IS NOT NULL
  AND (
    CASE jsonb_typeof(correct_answer::jsonb)
      WHEN 'array' THEN jsonb_array_length(correct_answer::jsonb) > 0
      WHEN 'string' THEN length(trim(correct_answer#>>'{}')) > 0
      WHEN 'number' THEN true
      WHEN 'boolean' THEN true
      WHEN 'object' THEN (
        (
          upper(trim(coalesce(question_type, ''))) LIKE '%BOWTIE%'
          OR upper(trim(coalesce(question_type, ''))) = 'TREND'
          OR upper(trim(coalesce(question_type, ''))) LIKE '%TREND%'
        )
        AND jsonb_typeof(correct_answer::jsonb -> 'correctMapping') = 'object'
        AND length(trim(coalesce(correct_answer::jsonb #>> '{correctMapping,condition}', ''))) > 0
        AND length(trim(coalesce(correct_answer::jsonb #>> '{correctMapping,intervention}', ''))) > 0
        AND length(trim(coalesce(correct_answer::jsonb #>> '{correctMapping,monitoring}', ''))) > 0
      )
      ELSE false
    END
  )
`;

/**
 * Rationale is optional; when provided (non-whitespace), require a minimal length so placeholders do not publish.
 */
export const EXAM_QUESTION_RATIONALE_IF_PRESENT_SQL = Prisma.sql`(
  length(trim(coalesce(rationale, ''))) = 0
  OR length(trim(rationale)) >= 5
)`;

/** Exclude rows tagged for ECG video bank (leave tags and row unchanged for linear publish scripts). */
export const EXAM_QUESTION_NON_ECG_TAG_SQL = Prisma.sql`NOT EXISTS (
  SELECT 1 FROM unnest(coalesce(tags, '{}'::text[])) AS t(tag)
  WHERE lower(trim(tag)) = 'ecg-video'
)`;

/** `topic` or `body_system` must be present for learner hubs / audits (non-placeholder grouping). */
export const EXAM_QUESTION_TOPIC_OR_BODY_SQL = Prisma.sql`(
  coalesce(trim(topic), '') <> ''
  OR coalesce(trim(body_system), '') <> ''
)`;

/** Non-empty stem (CAT uses any non-whitespace; audits often use ≥10 elsewhere). */
export const EXAM_QUESTION_STEM_NON_EMPTY_SQL = Prisma.sql`length(trim(coalesce(stem, ''))) > 0`;

/** MCQ-style `options` JSON array with at least two entries (matches CAT completeness). */
export const EXAM_QUESTION_OPTIONS_MIN_TWO_SQL = Prisma.sql`
  options IS NOT NULL
  AND CASE jsonb_typeof(options::jsonb)
    WHEN 'array' THEN jsonb_array_length(options::jsonb) >= 2
    ELSE false
  END
`;

export const EXAM_QUESTION_RATIONALE_REQUIRED_SQL = Prisma.sql`length(trim(coalesce(rationale, ''))) > 0`;

/**
 * Published row shape aligned with strict CAT `isCompleteCatQuestionRow` (subset via SQL).
 * Compose with pathway `exam` / `tier` / `region_scope` filters in audits — do not use alone as full WHERE.
 */
export const EXAM_QUESTION_CAT_PIPELINE_ROW_SQL = Prisma.sql`
  ${EXAM_QUESTION_STATUS_PUBLISHED_SQL}
  AND ${EXAM_QUESTION_FLASHCARD_ELIGIBLE_FORMAT_SQL}
  AND ${EXAM_QUESTION_NON_ECG_TAG_SQL}
  AND ${EXAM_QUESTION_STEM_NON_EMPTY_SQL}
  AND ${EXAM_QUESTION_OPTIONS_MIN_TWO_SQL}
  AND ${EXAM_QUESTION_CORRECT_ANSWER_PRESENT_SQL}
  AND ${EXAM_QUESTION_RATIONALE_REQUIRED_SQL}
`;

/**
 * Minimal draft → published gates: stem length, answer JSON, optional rationale, non-ECG format + tag, exam allowlist.
 * Requires topic or body_system so published rows are usable on learner surfaces.
 */
export function examQuestionDraftPublishableMinimalSql(): Prisma.Sql {
  return Prisma.sql`
  ${EXAM_QUESTION_DRAFT_STATUS_SQL}
  AND length(trim(stem)) >= 10
  AND ${EXAM_QUESTION_CORRECT_ANSWER_PRESENT_SQL}
  AND ${EXAM_QUESTION_RATIONALE_IF_PRESENT_SQL}
  AND ${EXAM_QUESTION_FLASHCARD_ELIGIBLE_FORMAT_SQL}
  AND ${EXAM_QUESTION_NON_ECG_TAG_SQL}
  AND ${EXAM_QUESTION_TOPIC_OR_BODY_SQL}
  AND exam IN (${Prisma.join([...examQuestionExamPublishAllowlist()])})
`;
}

/**
 * Same as {@link examQuestionDraftPublishableMinimalSql} but requires a non-empty rationale
 * (still enforces ≥5 chars when rationale is present — redundant with non-empty, but keeps one codepath).
 */
export function examQuestionDraftPublishableMinimalRequireRationaleSql(): Prisma.Sql {
  return Prisma.sql`
  ${EXAM_QUESTION_DRAFT_STATUS_SQL}
  AND length(trim(stem)) >= 10
  AND ${EXAM_QUESTION_CORRECT_ANSWER_PRESENT_SQL}
  AND ${EXAM_QUESTION_RATIONALE_REQUIRED_SQL}
  AND ${EXAM_QUESTION_RATIONALE_IF_PRESENT_SQL}
  AND ${EXAM_QUESTION_FLASHCARD_ELIGIBLE_FORMAT_SQL}
  AND ${EXAM_QUESTION_NON_ECG_TAG_SQL}
  AND ${EXAM_QUESTION_TOPIC_OR_BODY_SQL}
  AND exam IN (${Prisma.join([...examQuestionExamPublishAllowlist()])})
`;
}

/**
 * Stricter draft → published gates (legacy script): rationale + taxonomy signal + same ECG/format/exam rules.
 */
export function examQuestionDraftPublishableStrictSql(): Prisma.Sql {
  return Prisma.sql`
  ${EXAM_QUESTION_DRAFT_STATUS_SQL}
  AND coalesce(trim(stem), '') <> ''
  AND ${EXAM_QUESTION_CORRECT_ANSWER_PRESENT_SQL}
  AND coalesce(trim(rationale), '') <> ''
  AND ${EXAM_QUESTION_FLASHCARD_ELIGIBLE_FORMAT_SQL}
  AND ${EXAM_QUESTION_NON_ECG_TAG_SQL}
  AND (
    coalesce(trim(topic), '') <> ''
    OR coalesce(trim(body_system), '') <> ''
    OR coalesce(trim(nclex_client_needs_category), '') <> ''
  )
  AND exam IN (${Prisma.join([...examQuestionExamPublishAllowlist()])})
`;
}
