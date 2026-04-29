import { randomInt, randomUUID } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import { questionAccessWhereWithPathway } from "@/lib/exam-pathways/pathway-content-scope";
import { subscriptionCoversPathwayBase } from "@/lib/exam-pathways/pathway-entitlements";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import type { CatPoolRow } from "@/lib/exams/cat-engine";
import type { CatPracticePoolBuildMeta } from "@/lib/practice-tests/types";
import {
  loadMissedQuestionIdsForPoolFilter,
  loadSavedRationaleQuestionIdsForPoolFilter,
} from "@/lib/learner/study-question-signals";
import { getWeakTopicNamesForPractice } from "@/lib/learner/topic-performance";
import { difficultyWhere } from "@/lib/practice-tests/practice-pool-shared";
import type { PickQuestionsInput } from "@/lib/practice-tests/pick-question-ids";
import { seededIndexInRange, shuffleSeeded } from "@/lib/practice-tests/session-seeded-random";

const MAX_POOL = 4000;
export const CAT_MIN_COMPLETE_POOL = 30;

/** Soft practice widens filters when the strict slice is too thin for {@link validatePracticeCatPool}. */
const CAT_SOFT_MIN_COMPLETE_ROWS = 8;

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

/** Fields required for {@link isCompleteCatQuestionRow} (subset of Prisma `ExamQuestion` selects). */
export type CatQuestionCompletenessFields = {
  /** Matches required `ExamQuestion.stem` from Prisma selects. */
  stem: string;
  options: Prisma.JsonValue | null;
  correctAnswer: Prisma.JsonValue | null;
  rationale: string | null;
};

/** Row shape from {@link queryShuffledCompletePool} `select` after completeness filter. */
export type CompleteCatQuestionRow = CatQuestionCompletenessFields & {
  id: string;
  difficulty: number | null;
  bodySystem: string | null;
  topic: string | null;
  nclexClientNeedsCategory: string | null;
  nclexClientNeedsSubcategory: string | null;
};

export function isCompleteCatQuestionRow(row: CatQuestionCompletenessFields): boolean {
  return (
    hasValidStem(row.stem) &&
    hasValidOptions(row.options) &&
    hasValidCorrectAnswer(row.correctAnswer) &&
    hasValidRationale(row.rationale)
  );
}

async function buildSecondaryFilterParts(
  userId: string,
  entitlement: AccessScope,
  input: PickQuestionsInput,
  relaxed: boolean,
): Promise<Prisma.ExamQuestionWhereInput[]> {
  const parts: Prisma.ExamQuestionWhereInput[] = [];
  const diff = difficultyWhere(input.difficultyMin, input.difficultyMax);
  if (diff) parts.push(diff);
  if (relaxed) return parts;

  if (input.selectionMode === "targeted") {
    if (input.topicNames.length > 0) {
      parts.push({ OR: input.topicNames.map((t) => ({ topic: t })) });
    }
    return parts;
  }

  if (input.selectionMode === "weak") {
    const names = await getWeakTopicNamesForPractice(userId, entitlement, 16);
    let narrowed = names;
    if (input.topicNames.length > 0) {
      const want = new Set(input.topicNames);
      const inter = names.filter((n) => want.has(n));
      if (inter.length > 0) narrowed = inter;
    }
    if (narrowed.length > 0) {
      parts.push({ topic: { in: narrowed } });
    }
    return parts;
  }

  if (input.selectionMode === "missed") {
    let missedIds = await loadMissedQuestionIdsForPoolFilter(userId, 200);
    if (missedIds.length === 0) {
      return parts;
    }
    if (input.topicNames.length > 0) {
      const rows = await prisma.examQuestion.findMany({
        where: {
          AND: [{ id: { in: missedIds } }, { OR: input.topicNames.map((t) => ({ topic: t })) }],
        },
        select: { id: true },
        take: 220,
      });
      const filtered = rows.map((r) => r.id);
      if (filtered.length > 0) {
        missedIds = filtered;
      }
    }
    parts.push({ id: { in: missedIds } });
    return parts;
  }

  if (input.selectionMode === "starred") {
    const starredIds = await loadSavedRationaleQuestionIdsForPoolFilter(userId, 200);
    if (starredIds.length > 0) {
      parts.push({ id: { in: starredIds } });
    }
    return parts;
  }

  if (input.topicNames.length > 0) {
    parts.push({ OR: input.topicNames.map((t) => ({ topic: t })) });
  }
  return parts;
}

async function queryShuffledCompletePool(
  where: Prisma.ExamQuestionWhereInput,
  input: PickQuestionsInput,
): Promise<CompleteCatQuestionRow[]> {
  const total = await prisma.examQuestion.count({ where });
  const takeN = Math.min(MAX_POOL, Math.max(1, total));
  let skip = 0;
  if (total > takeN) {
    const span = total - takeN + 1;
    const salt = input.sessionPickSalt?.trim();
    skip =
      salt && salt.length >= 8
        ? seededIndexInRange(`${salt}:pool-window-v1`, span)
        : randomInt(0, span);
  }

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
    skip,
    take: takeN,
  });

  const completeRows = rows.filter((r): r is CompleteCatQuestionRow => isCompleteCatQuestionRow(r));
  const salt = input.sessionPickSalt?.trim();
  return salt && salt.length >= 8
    ? shuffleSeeded(completeRows, `${salt}:cat-pool-row-order-v1`)
    : shuffleSeeded(completeRows, `ephemeral-cat-pool:${randomUUID()}`);
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
): Promise<{ pool: CatPoolRow[]; buildMeta: CatPracticePoolBuildMeta }> {
  const { getExamPathwayById } = await import("@/lib/exam-pathways/exam-product-registry");
  const pathwayIdTrim = input.pathwayId?.trim() ?? "";
  let pathway: ExamPathwayDefinition | null = pathwayIdTrim ? getExamPathwayById(pathwayIdTrim) ?? null : null;
  const emptyMeta = (strict = 0): CatPracticePoolBuildMeta => ({
    strictCompleteRowCount: strict,
    usedRelaxedFilters: false,
    finalCompleteRowCount: 0,
  });

  if (pathwayIdTrim && !pathway) {
    return { pool: [], buildMeta: emptyMeta() };
  }
  if (pathway && !subscriptionCoversPathwayBase(entitlement, pathway)) {
    // Fail closed when a pathway was requested: never widen to a broader tier pool.
    return { pool: [], buildMeta: emptyMeta() };
  }

  const base: Prisma.ExamQuestionWhereInput = pathway
    ? questionAccessWhereWithPathway(entitlement, pathway)
    : questionAccessWhere(entitlement);

  const strictness = input.selectionStrictness ?? "strict";

  if (strictness !== "soft") {
    if (input.selectionMode === "missed") {
      const missedIds = await loadMissedQuestionIdsForPoolFilter(userId, 200);
      if (missedIds.length === 0) {
        return { pool: [], buildMeta: emptyMeta() };
      }
    }
    if (input.selectionMode === "starred") {
      const starredIds = await loadSavedRationaleQuestionIdsForPoolFilter(userId, 200);
      if (starredIds.length === 0) {
        return { pool: [], buildMeta: emptyMeta() };
      }
    }
  }

  const secondaryStrict = await buildSecondaryFilterParts(userId, entitlement, input, false);
  const whereStrict: Prisma.ExamQuestionWhereInput = { AND: [base, ...secondaryStrict] };
  let completeRows = await queryShuffledCompletePool(whereStrict, input);
  const strictCount = completeRows.length;
  let usedRelaxedFilters = false;

  if (strictness === "soft" && completeRows.length < CAT_SOFT_MIN_COMPLETE_ROWS) {
    const secondaryRelaxed = await buildSecondaryFilterParts(userId, entitlement, input, true);
    const whereRelaxed: Prisma.ExamQuestionWhereInput = { AND: [base, ...secondaryRelaxed] };
    completeRows = await queryShuffledCompletePool(whereRelaxed, input);
    usedRelaxedFilters = true;
  }

  const buildMeta: CatPracticePoolBuildMeta = {
    strictCompleteRowCount: strictCount,
    usedRelaxedFilters,
    finalCompleteRowCount: completeRows.length,
  };

  return {
    pool: completeRows.map((r) => ({
      id: r.id,
      difficulty: typeof r.difficulty === "number" && Number.isFinite(r.difficulty) ? Math.round(r.difficulty) : 3,
      bodySystem: r.bodySystem,
      topic: r.topic,
      nclexClientNeedsCategory: r.nclexClientNeedsCategory,
      nclexClientNeedsSubcategory: r.nclexClientNeedsSubcategory,
    })),
    buildMeta,
  };
}

export async function countCompleteCatPracticePool(
  userId: string,
  entitlement: AccessScope,
  input: PickQuestionsInput,
): Promise<number> {
  const { pool } = await fetchCatPracticePool(userId, entitlement, input);
  return pool.length;
}
