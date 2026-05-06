import "server-only";

import type { Prisma } from "@prisma/client";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import { NON_ECG_PRACTICE_EXAM_WHERE } from "@/lib/practice-tests/cat-pool";
import { generalStudyBankModuleSurfaceWhere } from "@/lib/study-question-pool/study-question-pool-gates";

/**
 * Lightweight shape for inventory / category counting from ExamQuestion.
 * Select only what is needed — never pull heavy fields (stem, options, rationale)
 * for inventory purposes.
 */
export type ExamQuestionLite = {
  id: string;
  bodySystem: string | null;
  topic: string | null;
};

/**
 * THE canonical WHERE clause for all question-based features:
 * CAT exams, Practice exams, Flashcard inventory, Flashcard sessions.
 *
 * Do NOT deviate from this for any ExamQuestion access.
 * - questionAccessWhere: enforces entitlement tier / country scoping
 * - NON_ECG_PRACTICE_EXAM_WHERE: excludes ECG / video question formats
 * - generalStudyBankModuleSurfaceWhere: excludes lab-drills / med-calc only rows
 */
export function getCanonicalExamQuestionWhere(
  entitlement: AccessScope,
): Prisma.ExamQuestionWhereInput {
  return {
    AND: [
      questionAccessWhere(entitlement),
      NON_ECG_PRACTICE_EXAM_WHERE,
      generalStudyBankModuleSurfaceWhere(),
    ],
  };
}
