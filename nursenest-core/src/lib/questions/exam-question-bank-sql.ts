import { Prisma } from "@prisma/client";

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
