import { Prisma } from "@prisma/client";

/** Tags that mark rows as owned by standalone lab / med-calc modules (exclude from general pools). */
export const MODULE_ONLY_BANK_TAGS = ["lab-drills-only", "med-calculations-only"] as const;

/** When present, a module-tagged row may appear in general NCLEX-style study surfaces. */
export const GENERAL_NURSING_PRACTICE_OPT_IN_TAG = "general-nursing-practice";

/**
 * Prisma filter: exclude lab-drills / med-calc–scoped bank rows unless explicitly opted into
 * general nursing practice.
 */
export function generalStudyBankModuleSurfaceWhere(): Prisma.ExamQuestionWhereInput {
  return {
    OR: [
      { tags: { has: GENERAL_NURSING_PRACTICE_OPT_IN_TAG } },
      {
        NOT: {
          tags: { hasSome: [...MODULE_ONLY_BANK_TAGS] },
        },
      },
    ],
  };
}

/** Raw SQL twin of {@link generalStudyBankModuleSurfaceWhere} for discovery / flashcard aggregates. */
export const GENERAL_STUDY_BANK_MODULE_SCOPE_SQL = Prisma.sql`
  AND (
    'general-nursing-practice' = ANY(tags)
    OR NOT (
      'lab-drills-only' = ANY(tags)
      OR 'med-calculations-only' = ANY(tags)
    )
  )
`;

/**
 * Non-ECG general bank surfaces (flashcards, practice topic discovery, linear pools).
 * Keeps ECG mastery `ecg_video` items out of general hubs; CAT pool uses the Prisma twin.
 */
export const NON_ECG_GENERAL_BANK_SQL = Prisma.sql`
  AND NOT (lower(trim(coalesce(question_format, ''))) = 'ecg_video')
  AND NOT ('ecg-video' = ANY(tags))
`;
