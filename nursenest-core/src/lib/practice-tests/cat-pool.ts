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
import { difficultyWhere } from "@/lib/practice-tests/practice-pool-shared";
import type { PickQuestionsInput } from "@/lib/practice-tests/pick-question-ids";

const MAX_POOL = 4000;
export const CAT_MIN_COMPLETE_POOL = 30;

function hasValidStem(stem: string | null | undefined): boolean {
  return typeof stem === "string" && stem.trim().length > 0;
}

function hasValidRationale(rationale: string | null | undefined): boolean {
  return typeof rationale === "string" && rationale.trim().length > 0;
}

function hasValidOptions(options: Prisma.JsonValue | null | undefined): boolean {
  if (!Array.isArray(options)) return false;
  if (options.length < 2) return false;
  return options.every((opt) => {
    if (typeof opt === "string") return opt.trim().length > 0;
    if (typeof opt === "number") return Number.isFinite(opt);
    return false;
  });
}

function hasValidCorrectAnswer(correctAnswer: Prisma.JsonValue | null | undefined): boolean {
  if (correctAnswer == null) return false;
  if (typeof correctAnswer === "string") return correctAnswer.trim().length > 0;
  if (typeof correctAnswer === "number") return Number.isFinite(correctAnswer);
  if (Array.isArray(correctAnswer)) {
    return correctAnswer.length > 0 && correctAnswer.every((entry) => {
      if (typeof entry === "string") return entry.trim().length > 0;
      if (typeof entry === "number") return Number.isFinite(entry);
      return false;
    });
  }
  return typeof correctAnswer === "object";
}

export type CompleteCatQuestionRow = {
  stem: string;
  options: Prisma.JsonValue | null;
  correctAnswer: Prisma.JsonValue | null;
  rationale: string | null;
};

export function isCompleteCatQuestionRow(row: CompleteCatQuestionRow): boolean {
  return (
    hasValidStem(row.stem) &&
    hasValidOptions(row.options) &&
    hasValidCorrectAnswer(row.correctAnswer) &&
    hasValidRationale(row.rationale)
  );
}

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
      stem: true,
      options: true,
      correctAnswer: true,
      rationale: true,
      nclexClientNeedsCategory: true,
      nclexClientNeedsSubcategory: true,
    },
    orderBy: { id: "asc" },
    take: MAX_POOL,
  });

  const completeRows = rows.filter((r) => isCompleteCatQuestionRow(r));

  return completeRows.map((r) => ({
    id: r.id,
    difficulty: typeof r.difficulty === "number" && Number.isFinite(r.difficulty) ? Math.round(r.difficulty) : 3,
    bodySystem: r.bodySystem,
    topic: r.topic,
    nclexClientNeedsCategory: r.nclexClientNeedsCategory,
    nclexClientNeedsSubcategory: r.nclexClientNeedsSubcategory,
  }));
}

export async function countCompleteCatPracticePool(
  userId: string,
  entitlement: AccessScope,
  input: PickQuestionsInput,
): Promise<number> {
  const pool = await fetchCatPracticePool(userId, entitlement, input);
  return pool.length;
}
