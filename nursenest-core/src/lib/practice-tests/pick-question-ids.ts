import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import { questionAccessWhereWithPathway } from "@/lib/exam-pathways/pathway-content-scope";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { subscriptionCoversPathwayBase } from "@/lib/exam-pathways/pathway-entitlements";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { getWeakTopicNamesForPractice } from "@/lib/learner/topic-performance";
import type { PracticeTestConfigJson, PracticeTestSelectionMode } from "@/lib/practice-tests/types";

/** Linear pool selection — CAT uses {@link createCatPracticeTestPayload} instead. */
export type LinearPoolSelectionMode = Exclude<PracticeTestSelectionMode, "cat">;

const MAX_POOL = 4000;
export const PRACTICE_TEST_MIN_Q = 5;
export const PRACTICE_TEST_MAX_Q = 75;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export function difficultyWhere(min: number | null, max: number | null): Prisma.ExamQuestionWhereInput | null {
  if (min == null && max == null) return null;
  const lo = min ?? 1;
  const hi = max ?? 5;
  return {
    OR: [{ difficulty: null }, { AND: [{ difficulty: { gte: lo } }, { difficulty: { lte: hi } }] }],
  };
}

export type PickQuestionsInput = {
  questionCount: number;
  topicNames: string[];
  difficultyMin: number | null;
  difficultyMax: number | null;
  selectionMode: LinearPoolSelectionMode;
  pathwayId: string | null;
};

export async function pickPracticeQuestionIds(
  userId: string,
  entitlement: AccessScope,
  input: PickQuestionsInput,
): Promise<{ ok: true; ids: string[] } | { ok: false; message: string }> {
  const n = Math.min(PRACTICE_TEST_MAX_Q, Math.max(PRACTICE_TEST_MIN_Q, Math.floor(input.questionCount)));

  let pathway = input.pathwayId ? getExamPathwayById(input.pathwayId) ?? null : null;
  if (pathway && !subscriptionCoversPathwayBase(entitlement, pathway)) {
    pathway = null;
  }

  const base: Prisma.ExamQuestionWhereInput = pathway
    ? questionAccessWhereWithPathway(entitlement, pathway)
    : questionAccessWhere(entitlement);

  const parts: Prisma.ExamQuestionWhereInput[] = [base];

  const diff = difficultyWhere(input.difficultyMin, input.difficultyMax);
  if (diff) parts.push(diff);

  if (input.selectionMode === "targeted") {
    if (input.topicNames.length === 0) {
      return { ok: false, message: "Targeted mode requires at least one topic." };
    }
    parts.push({ OR: input.topicNames.map((t) => ({ topic: t })) });
  } else if (input.selectionMode === "weak") {
    const names = await getWeakTopicNamesForPractice(userId, entitlement, 16);
    if (names.length === 0) {
      return {
        ok: false,
        message:
          "No weak areas yet. Answer graded questions, finish a mock, or complete a practice test—then try weak mode again.",
      };
    }
    parts.push({ topic: { in: names } });
  } else if (input.topicNames.length > 0) {
    parts.push({ OR: input.topicNames.map((t) => ({ topic: t })) });
  }

  const where: Prisma.ExamQuestionWhereInput = { AND: parts };

  const pool = await prisma.examQuestion.findMany({
    where,
    select: { id: true },
    take: MAX_POOL,
  });

  if (pool.length < n) {
    return {
      ok: false,
      message: `Only ${pool.length} question(s) match your filters. Relax topics or difficulty, or reduce count.`,
    };
  }

  const ids = shuffle(pool.map((p) => p.id)).slice(0, n);
  return { ok: true, ids };
}

export function configFromInput(
  input: PickQuestionsInput,
  timedMode: boolean,
  timeLimitSec: number | null,
): PracticeTestConfigJson {
  return {
    questionCount: input.questionCount,
    topicNames: input.topicNames,
    difficultyMin: input.difficultyMin,
    difficultyMax: input.difficultyMax,
    selectionMode: input.selectionMode,
    pathwayId: input.pathwayId,
    timedMode,
    timeLimitSec,
  };
}
