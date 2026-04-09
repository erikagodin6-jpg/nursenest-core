import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import { questionAccessWhereWithPathway } from "@/lib/exam-pathways/pathway-content-scope";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { subscriptionCoversPathwayBase } from "@/lib/exam-pathways/pathway-entitlements";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import type { CatPoolRow } from "@/lib/exams/cat-engine";
import { getWeakTopicNamesForPractice } from "@/lib/learner/topic-performance";
import { difficultyWhere, type PickQuestionsInput } from "@/lib/practice-tests/pick-question-ids";

const MAX_POOL = 4000;

/**
 * Tier-scoped pool for adaptive practice (same gates as linear practice tests).
 * With `pathwayId`, RN / PN / NP isolation uses `questionAccessWhereWithPathway` (`exam` in pathway keys).
 * Narrative spec: `src/lib/exams/cat-adaptive-policy.ts`.
 */
export async function fetchCatPracticePool(
  userId: string,
  entitlement: AccessScope,
  input: PickQuestionsInput,
): Promise<CatPoolRow[]> {
  const pathwayIdTrim = input.pathwayId?.trim() ?? "";
  let pathway: ExamPathwayDefinition | null = pathwayIdTrim ? getExamPathwayById(pathwayIdTrim) ?? null : null;
  if (pathwayIdTrim && !pathway) {
    return [];
  }
  if (pathway && !subscriptionCoversPathwayBase(entitlement, pathway)) {
    // Fail closed when a pathway was requested: never widen to a broader tier pool.
    return [];
  }

  const base: Prisma.ExamQuestionWhereInput = pathway
    ? questionAccessWhereWithPathway(entitlement, pathway)
    : questionAccessWhere(entitlement);

  const parts: Prisma.ExamQuestionWhereInput[] = [base];

  const diff = difficultyWhere(input.difficultyMin, input.difficultyMax);
  if (diff) parts.push(diff);

  if (input.selectionMode === "targeted") {
    if (input.topicNames.length > 0) {
      parts.push({ OR: input.topicNames.map((t) => ({ topic: t })) });
    }
  } else if (input.selectionMode === "weak") {
    const names = await getWeakTopicNamesForPractice(userId, entitlement, 16);
    if (names.length > 0) {
      parts.push({ topic: { in: names } });
    }
  } else if (input.topicNames.length > 0) {
    parts.push({ OR: input.topicNames.map((t) => ({ topic: t })) });
  }

  const where: Prisma.ExamQuestionWhereInput = { AND: parts };

  const rows = await prisma.examQuestion.findMany({
    where,
    select: {
      id: true,
      difficulty: true,
      bodySystem: true,
      topic: true,
      nclexClientNeedsCategory: true,
      nclexClientNeedsSubcategory: true,
    },
    orderBy: { id: "asc" },
    take: MAX_POOL,
  });

  return rows.map((r) => ({
    id: r.id,
    difficulty: typeof r.difficulty === "number" && Number.isFinite(r.difficulty) ? Math.round(r.difficulty) : 3,
    bodySystem: r.bodySystem,
    topic: r.topic,
    nclexClientNeedsCategory: r.nclexClientNeedsCategory,
    nclexClientNeedsSubcategory: r.nclexClientNeedsSubcategory,
  }));
}
