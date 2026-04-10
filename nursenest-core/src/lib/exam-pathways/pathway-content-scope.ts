import type { Prisma } from "@prisma/client";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import { buildGlobalExamContext } from "@/lib/exam-context/exam-registry";
import { examQuestionPoolWhereForContext } from "@/lib/exam-context/query-scope";
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
  if (!pathway) return base;
  const ctx = buildGlobalExamContext(pathway.id, "en");
  if (!ctx) return { id: { in: [] } };
  const scoped = examQuestionPoolWhereForContext(ctx);
  if (scoped.examIn.length === 0 || scoped.tierMatches.length === 0) {
    return { id: { in: [] } };
  }
  return {
    AND: [base, { exam: { in: scoped.examIn } }, { tier: { in: scoped.tierMatches } }],
  };
}
