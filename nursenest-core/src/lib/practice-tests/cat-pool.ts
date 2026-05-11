import { randomInt, randomUUID } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import { questionAccessWhereWithPathway } from "@/lib/exam-pathways/pathway-content-scope";
import { subscriptionCoversPathwayBase } from "@/lib/exam-pathways/pathway-entitlements";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { validatePracticeCatPool, type CatPoolRow } from "@/lib/exams/cat-engine";
import type { CatPracticePoolBuildMeta } from "@/lib/practice-tests/types";
import {
  loadMissedQuestionIdsForPoolFilter,
  loadSavedRationaleQuestionIdsForPoolFilter,
} from "@/lib/learner/study-question-signals";
import { getWeakTopicNamesForPractice } from "@/lib/learner/topic-performance";
import { difficultyWhere } from "@/lib/practice-tests/practice-pool-shared";
import type { PickQuestionsInput } from "@/lib/practice-tests/pick-question-ids";
import { seededIndexInRange, shuffleSeeded } from "@/lib/practice-tests/session-seeded-random";
import { logCoreApiStudyDiagnostic } from "@/lib/observability/core-api-diagnostics";
import { generalStudyBankModuleSurfaceWhere } from "@/lib/study-question-pool/study-question-pool-gates";
import {
  isCompleteCatQuestionRow,
  NON_ECG_PRACTICE_EXAM_WHERE,
  type CatQuestionCompletenessFields,
} from "./cat-question-completeness";

import { catReadinessMinCompletePoolRows } from "./cat-readiness-floor";

export { CAT_MIN_COMPLETE_POOL, catReadinessMinCompletePoolRows } from "./cat-readiness-floor";
export { isCompleteCatQuestionRow, NON_ECG_PRACTICE_EXAM_WHERE, type CatQuestionCompletenessFields };

const MAX_POOL = 4000;
/** Batched CAT readiness scans — avoids loading thousands of stems/rationales when only a minimum pool proof is needed. */
const READINESS_SCAN_BATCH = 280;
const READINESS_SCAN_CAP = 8000;

/** Soft practice widens filters when the strict slice is too thin for {@link validatePracticeCatPool}. */
const CAT_SOFT_MIN_COMPLETE_ROWS = 8;

/** Row shape from {@link queryShuffledCompletePool} `select` after completeness filter. */
export type CompleteCatQuestionRow = CatQuestionCompletenessFields & {
  id: string;
  difficulty: number | null;
  /** Present on pool selects; required so filtered rows match Prisma row typing. */
  questionType: string;
  bodySystem: string | null;
  topic: string | null;
  nclexClientNeedsCategory: string | null;
  nclexClientNeedsSubcategory: string | null;
};

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
      questionType: true,
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

async function accumulateCompleteCatPoolForReadiness(
  where: Prisma.ExamQuestionWhereInput,
  minCompleteRequired: number,
): Promise<{ pool: CatPoolRow[]; scannedDbRows: number; completeRowCount: number }> {
  const pool: CatPoolRow[] = [];
  let scannedDbRows = 0;
  let completeRowCount = 0;
  let skip = 0;
  const maxHeld = Math.min(512, Math.max(minCompleteRequired + 120, 200));
  while (skip < READINESS_SCAN_CAP) {
    const batch = await prisma.examQuestion.findMany({
      where,
      select: {
        id: true,
        difficulty: true,
        questionType: true,
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
      take: READINESS_SCAN_BATCH,
    });
    if (batch.length === 0) break;
    scannedDbRows += batch.length;
    for (const r of batch) {
      if (!isCompleteCatQuestionRow(r)) continue;
      completeRowCount += 1;
      if (pool.length >= maxHeld) pool.shift();
      pool.push({
        id: r.id,
        difficulty: typeof r.difficulty === "number" && Number.isFinite(r.difficulty) ? Math.round(r.difficulty) : 3,
        bodySystem: r.bodySystem,
        topic: r.topic,
        nclexClientNeedsCategory: r.nclexClientNeedsCategory,
        nclexClientNeedsSubcategory: r.nclexClientNeedsSubcategory,
      });
    }
    skip += batch.length;
    if (pool.length >= minCompleteRequired && validatePracticeCatPool(pool).ok) break;
    if (batch.length < READINESS_SCAN_BATCH) break;
  }
  return { pool, scannedDbRows, completeRowCount };
}

function catCalibratedPool(rows: CatPoolRow[]): CatPoolRow[] {
  return rows.filter((row) => {
    const hasDifficulty = Number.isFinite(row.difficulty) && row.difficulty >= 1 && row.difficulty <= 5;
    const hasCategory = Boolean(
      row.nclexClientNeedsCategory?.trim() ||
        row.bodySystem?.trim() ||
        row.topic?.trim(),
    );
    return hasDifficulty && hasCategory;
  });
}

async function countRawRows(where: Prisma.ExamQuestionWhereInput): Promise<number> {
  return prisma.examQuestion.count({ where });
}

/**
 * Pathway-scanned pool proof for CAT **readiness** (fast): same WHERE gates as {@link fetchCatPracticePool}
 * but stops once the pathway minimum + {@link validatePracticeCatPool} succeed, or the scan budget is exhausted.
 * Full {@link fetchCatPracticePool} still loads the shuffled session window for active play / session create.
 */
export async function fetchCatPracticePoolReadiness(
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
    completePracticeQuestions: strict,
    eligibleCatQuestions: 0,
    excludedBecauseMissingCatMetadata: strict,
    excludedBecauseIncomplete: 0,
    excludedBecauseWrongPathwayOrExam: 0,
  });

  if (pathwayIdTrim && !pathway) {
    return { pool: [], buildMeta: emptyMeta() };
  }
  if (pathway && !subscriptionCoversPathwayBase(entitlement, pathway)) {
    return { pool: [], buildMeta: emptyMeta() };
  }

  const base: Prisma.ExamQuestionWhereInput = pathway
    ? questionAccessWhereWithPathway(entitlement, pathway)
    : questionAccessWhere(entitlement);
  const broadBase = questionAccessWhere(entitlement);

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

  const minNeed = catReadinessMinCompletePoolRows(pathwayIdTrim);
  const secondaryStrict = await buildSecondaryFilterParts(userId, entitlement, input, false);
  const whereStrict: Prisma.ExamQuestionWhereInput = {
    AND: [base, NON_ECG_PRACTICE_EXAM_WHERE, generalStudyBankModuleSurfaceWhere(), ...secondaryStrict],
  };
  const rawStrictCount = await countRawRows(whereStrict);
  let strictAccumulated = await accumulateCompleteCatPoolForReadiness(whereStrict, minNeed);
  let { pool } = strictAccumulated;
  const strictCompleteRowCount = strictAccumulated.completeRowCount;
  let completePracticeQuestions = strictCompleteRowCount;
  let eligiblePool = catCalibratedPool(pool);
  let usedRelaxedFilters = false;
  let rawFinalCount = rawStrictCount;

  if (strictness === "soft" && pool.length < CAT_SOFT_MIN_COMPLETE_ROWS) {
    const secondaryRelaxed = await buildSecondaryFilterParts(userId, entitlement, input, true);
    const whereRelaxed: Prisma.ExamQuestionWhereInput = {
      AND: [base, NON_ECG_PRACTICE_EXAM_WHERE, generalStudyBankModuleSurfaceWhere(), ...secondaryRelaxed],
    };
    rawFinalCount = await countRawRows(whereRelaxed);
    const relaxed = await accumulateCompleteCatPoolForReadiness(whereRelaxed, minNeed);
    pool = relaxed.pool;
    completePracticeQuestions = relaxed.completeRowCount;
    eligiblePool = catCalibratedPool(pool);
    usedRelaxedFilters = true;
  }

  const wrongPathwayOrExamCount =
    pathway
      ? Math.max(
          0,
          (await countRawRows({
            AND: [broadBase, NON_ECG_PRACTICE_EXAM_WHERE, generalStudyBankModuleSurfaceWhere(), ...secondaryStrict],
          })) - rawStrictCount,
        )
      : 0;

  const buildMeta: CatPracticePoolBuildMeta = {
    strictCompleteRowCount: strictCompleteRowCount,
    usedRelaxedFilters,
    finalCompleteRowCount: eligiblePool.length,
    completePracticeQuestions,
    eligibleCatQuestions: eligiblePool.length,
    excludedBecauseMissingCatMetadata: Math.max(0, completePracticeQuestions - eligiblePool.length),
    excludedBecauseIncomplete: Math.max(0, rawFinalCount - completePracticeQuestions),
    excludedBecauseWrongPathwayOrExam: wrongPathwayOrExamCount,
  };

  logCoreApiStudyDiagnostic({
    endpoint: "fetchCatPracticePoolReadiness",
    pathwayId: pathwayIdTrim || null,
    tier: String(entitlement.tier ?? ""),
    country: String(entitlement.country ?? ""),
    hasAccess: entitlement.hasAccess,
    examKeys: pathway ? [...pathway.contentExamKeys].join(",") : "",
    selectionMode: input.selectionMode,
    selectionStrictness: strictness,
    rowsFoundStrict: strictCompleteRowCount,
    rowsReturned: eligiblePool.length,
    completePracticeQuestions,
    eligibleCatQuestions: eligiblePool.length,
    excludedBecauseMissingCatMetadata: buildMeta.excludedBecauseMissingCatMetadata,
    excludedBecauseIncomplete: buildMeta.excludedBecauseIncomplete,
    excludedBecauseWrongPathwayOrExam: buildMeta.excludedBecauseWrongPathwayOrExam,
    usedRelaxedFilters,
    reasonIfZero:
      eligiblePool.length === 0
        ? pathwayIdTrim && !pathway
          ? "unknown_pathway_id"
          : pathway && !subscriptionCoversPathwayBase(entitlement, pathway)
            ? "pathway_not_covered_by_entitlement"
            : strictness !== "soft" &&
                (input.selectionMode === "missed" || input.selectionMode === "starred")
              ? "empty_missed_or_starred_ids"
              : "readiness_scan_no_complete_rows"
        : undefined,
  });

  return { pool: eligiblePool, buildMeta };
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
  const whereStrict: Prisma.ExamQuestionWhereInput = {
    AND: [base, NON_ECG_PRACTICE_EXAM_WHERE, generalStudyBankModuleSurfaceWhere(), ...secondaryStrict],
  };
  let completeRows = await queryShuffledCompletePool(whereStrict, input);
  const strictCount = completeRows.length;
  let usedRelaxedFilters = false;

  if (strictness === "soft" && completeRows.length < CAT_SOFT_MIN_COMPLETE_ROWS) {
    const secondaryRelaxed = await buildSecondaryFilterParts(userId, entitlement, input, true);
    const whereRelaxed: Prisma.ExamQuestionWhereInput = {
      AND: [base, NON_ECG_PRACTICE_EXAM_WHERE, generalStudyBankModuleSurfaceWhere(), ...secondaryRelaxed],
    };
    completeRows = await queryShuffledCompletePool(whereRelaxed, input);
    usedRelaxedFilters = true;
  }

  const buildMeta: CatPracticePoolBuildMeta = {
    strictCompleteRowCount: strictCount,
    usedRelaxedFilters,
    finalCompleteRowCount: completeRows.length,
  };

  logCoreApiStudyDiagnostic({
    endpoint: "fetchCatPracticePool",
    pathwayId: pathwayIdTrim || null,
    tier: String(entitlement.tier ?? ""),
    country: String(entitlement.country ?? ""),
    hasAccess: entitlement.hasAccess,
    examKeys: pathway ? [...pathway.contentExamKeys].join(",") : "",
    selectionMode: input.selectionMode,
    selectionStrictness: strictness,
    rowsFoundStrict: strictCount,
    rowsReturned: completeRows.length,
    usedRelaxedFilters,
    reasonIfZero:
      completeRows.length === 0
        ? pathwayIdTrim && !pathway
          ? "unknown_pathway_id"
          : pathway && !subscriptionCoversPathwayBase(entitlement, pathway)
            ? "pathway_not_covered_by_entitlement"
            : strictness !== "soft" &&
                (input.selectionMode === "missed" || input.selectionMode === "starred")
              ? "empty_missed_or_starred_ids"
              : "no_complete_non_ecg_rows_for_filters"
        : undefined,
  });

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
