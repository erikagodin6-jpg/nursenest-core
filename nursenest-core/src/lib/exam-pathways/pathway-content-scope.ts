import type { Prisma } from "@prisma/client";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

/**
 * Interim: ANDs pathway exam keys onto existing tier/country gates.
 * When `exam_questions` gains explicit pathway ids, replace `contentExamKeys` filter with FK or tags.
 */
export function questionAccessWhereWithPathway(
  entitlement: AccessScope,
  pathway: ExamPathwayDefinition | null,
): Prisma.ExamQuestionWhereInput {
  const base = questionAccessWhere(entitlement);
  if (!pathway || pathway.contentExamKeys.length === 0) return base;
  return {
    AND: [base, { exam: { in: pathway.contentExamKeys } }],
  };
}
