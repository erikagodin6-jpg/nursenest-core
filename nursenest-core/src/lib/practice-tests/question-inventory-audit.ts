import "server-only";

import type { Prisma } from "@prisma/client";
import { validatePracticeCatPool, type CatPoolRow } from "@/lib/exams/cat-engine";
import { ECG_QUESTION_FORMAT } from "@/lib/ecg-module/ecg-module-config";
import {
  isCompleteCatQuestionRow,
  NON_ECG_PRACTICE_EXAM_WHERE,
} from "@/lib/practice-tests/cat-question-completeness";
import {
  GENERAL_NURSING_PRACTICE_OPT_IN_TAG,
  MODULE_ONLY_BANK_TAGS,
  generalStudyBankModuleSurfaceWhere,
} from "@/lib/study-question-pool/study-question-pool-gates";

const INVENTORY_AUDIT_BATCH_SIZE = 500;

export type QuestionInventoryExclusionReason =
  | "missing rationale"
  | "missing options"
  | "missing correct answer"
  | "empty stem"
  | "invalid bowtie payload"
  | "unsupported format"
  | "ECG exclusion"
  | "module-only exclusion"
  | "exam mismatch"
  | "country mismatch"
  | "tier mismatch";

export type QuestionInventoryAuditRow = {
  id: string;
  stem: string | null;
  questionType: string | null;
  questionFormat: string | null;
  options: Prisma.JsonValue | null;
  correctAnswer: Prisma.JsonValue | null;
  rationale: string | null;
  difficulty: number | null;
  bodySystem: string | null;
  topic: string | null;
  nclexClientNeedsCategory: string | null;
  nclexClientNeedsSubcategory: string | null;
  tags: string[];
  exam: string;
  tier: string;
  countryCode: string | null;
  regionScope?: string | null;
  isAdaptiveEligible: boolean;
};

export type QuestionInventoryClassification = {
  id: string;
  published: boolean;
  linearPracticeReady: boolean;
  catReady: boolean;
  exclusionReasons: QuestionInventoryExclusionReason[];
  completenessReasons: QuestionInventoryExclusionReason[];
};

export type QuestionInventoryAuditSummary = {
  generatedAt: string;
  pathwayId: string | null;
  policy?: {
    contentExamKeys: string[];
    expandedExamKeys: string[];
    publishedWhere: Prisma.ExamQuestionWhereInput;
    linearPracticeWhere: Prisma.ExamQuestionWhereInput;
    nonEcgWhere: Prisma.ExamQuestionWhereInput;
    moduleSurfaceWhere: Prisma.ExamQuestionWhereInput;
  };
  buckets: {
    publishedInventory: number;
    linearPracticeReadyInventory: number;
    catReadyInventory: number;
  };
  published: {
    totalRows: number;
    ecgRows: number;
    moduleOnlyRows: number;
    incompleteRows: number;
  };
  linearPractice: {
    eligibleRows: number;
    excludedRows: number;
  };
  catReady: {
    completeRows: number;
    ecgExclusions: number;
    moduleExclusions: number;
    failedCompletenessReasons: Partial<Record<QuestionInventoryExclusionReason, number>>;
    categorySpread: Record<string, number>;
    difficultySpread: Record<string, number>;
    validatePracticeCatPoolResult: ReturnType<typeof validatePracticeCatPool>;
  };
  /** Compatibility aliases for build/runtime metrics consumers. */
  exclusions: {
    ecgRows: number;
    moduleOnlyRows: number;
    incompleteRows: number;
    linearPracticeExcludedRows: number;
    catExcludedRows: number;
  };
  failedCompletenessReasons: Partial<Record<QuestionInventoryExclusionReason, number>>;
  categorySpread: Record<string, number>;
  difficultySpread: Record<string, number>;
  validatePracticeCatPool: ReturnType<typeof validatePracticeCatPool>;
  rows: QuestionInventoryClassification[];
};

function hasTag(row: Pick<QuestionInventoryAuditRow, "tags">, tag: string): boolean {
  return row.tags.some((value) => value.trim().toLowerCase() === tag);
}

function isEcgRow(row: Pick<QuestionInventoryAuditRow, "questionFormat" | "tags">): boolean {
  return row.questionFormat === ECG_QUESTION_FORMAT || hasTag(row, "ecg-video");
}

function isModuleOnlyRow(row: Pick<QuestionInventoryAuditRow, "tags">): boolean {
  if (hasTag(row, GENERAL_NURSING_PRACTICE_OPT_IN_TAG)) return false;
  return MODULE_ONLY_BANK_TAGS.some((tag) => hasTag(row, tag));
}

function completenessReasons(row: QuestionInventoryAuditRow): QuestionInventoryExclusionReason[] {
  const reasons: QuestionInventoryExclusionReason[] = [];
  const isBowtie = row.questionType?.toLowerCase().includes("bowtie") ?? false;
  if (!row.stem?.trim()) reasons.push("empty stem");
  if (!row.rationale?.trim()) reasons.push("missing rationale");
  if (isBowtie) {
    if (row.options == null) reasons.push("missing options");
  } else if (!Array.isArray(row.options) || row.options.length < 2) {
    reasons.push("missing options");
  }
  if (row.correctAnswer == null || (typeof row.correctAnswer === "string" && !row.correctAnswer.trim())) {
    reasons.push("missing correct answer");
  }
  if (!isCompleteCatQuestionRow({
    stem: row.stem ?? "",
    questionType: row.questionType,
    options: row.options,
    correctAnswer: row.correctAnswer,
    rationale: row.rationale,
  })) {
    if (isBowtie && !reasons.includes("invalid bowtie payload")) {
      reasons.push("invalid bowtie payload");
    }
  }
  return [...new Set(reasons)];
}

export function classifyQuestionInventoryRow(
  row: QuestionInventoryAuditRow,
  state: { published?: boolean; linearPracticeReady?: boolean } = {},
): QuestionInventoryClassification {
  const published = state.published ?? true;
  const rowCompletenessReasons = completenessReasons(row);
  const exclusionReasons: QuestionInventoryExclusionReason[] = [];
  if (isEcgRow(row)) exclusionReasons.push("ECG exclusion");
  if (isModuleOnlyRow(row)) exclusionReasons.push("module-only exclusion");
  if (!row.exam.trim()) exclusionReasons.push("exam mismatch");
  if (!row.countryCode?.trim()) exclusionReasons.push("country mismatch");
  if (!row.tier.trim()) exclusionReasons.push("tier mismatch");
  exclusionReasons.push(...rowCompletenessReasons);

  const linearPracticeReady =
    state.linearPracticeReady ??
    (!exclusionReasons.includes("ECG exclusion") && !exclusionReasons.includes("module-only exclusion"));
  const catReady =
    published &&
    linearPracticeReady &&
    row.isAdaptiveEligible &&
    isCompleteCatQuestionRow({
      stem: row.stem ?? "",
      questionType: row.questionType,
      options: row.options,
      correctAnswer: row.correctAnswer,
      rationale: row.rationale,
    });

  return {
    id: row.id,
    published,
    linearPracticeReady,
    catReady,
    exclusionReasons: [...new Set(exclusionReasons)],
    completenessReasons: rowCompletenessReasons,
  };
}

function spread(rows: QuestionInventoryAuditRow[], key: "difficulty" | "bodySystem" | "topic"): Record<string, number> {
  const out: Record<string, number> = {};
  for (const row of rows) {
    const raw = row[key];
    const label = raw == null || String(raw).trim() === "" ? "unknown" : String(raw).trim();
    out[label] = (out[label] ?? 0) + 1;
  }
  return out;
}

export function summarizeQuestionInventoryRows(
  rows: QuestionInventoryAuditRow[],
  pathwayId: string | null = null,
): QuestionInventoryAuditSummary {
  return buildQuestionInventorySummary({
    pathwayId,
    rows: rows.map((row) => ({ row })),
  });
}

export function buildQuestionInventorySummary(input: {
  pathwayId: string | null;
  generatedAt?: string;
  rows: Array<{
    row: QuestionInventoryAuditRow;
    published?: boolean;
    linearPracticeReady?: boolean;
  }>;
  policy?: QuestionInventoryAuditSummary["policy"];
}): QuestionInventoryAuditSummary {
  const rows = input.rows.map((entry) => entry.row);
  const classified = input.rows.map((entry) =>
    classifyQuestionInventoryRow(entry.row, {
      published: entry.published,
      linearPracticeReady: entry.linearPracticeReady,
    }),
  );
  const catRows: CatPoolRow[] = rows
    .filter((row, index) => classified[index]?.catReady)
    .map((row) => ({
      id: row.id,
      difficulty: typeof row.difficulty === "number" && Number.isFinite(row.difficulty) ? row.difficulty : 3,
      bodySystem: row.bodySystem,
      topic: row.topic,
      nclexClientNeedsCategory: row.nclexClientNeedsCategory,
      nclexClientNeedsSubcategory: row.nclexClientNeedsSubcategory,
    }));
  const failedCompletenessReasons: Partial<Record<QuestionInventoryExclusionReason, number>> = {};
  for (const row of classified) {
    for (const reason of row.completenessReasons) {
      failedCompletenessReasons[reason] = (failedCompletenessReasons[reason] ?? 0) + 1;
    }
  }
  const catSourceRows = rows.filter((_, index) => classified[index]?.catReady);
  const categorySpread = spread(catSourceRows, "bodySystem");
  const difficultySpread = spread(catSourceRows, "difficulty");
  const validatePracticeCatPoolResult = validatePracticeCatPool(catRows);

  return {
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    pathwayId: input.pathwayId,
    policy: input.policy,
    buckets: {
      publishedInventory: classified.filter((row) => row.published).length,
      linearPracticeReadyInventory: classified.filter((row) => row.linearPracticeReady).length,
      catReadyInventory: classified.filter((row) => row.catReady).length,
    },
    published: {
      totalRows: classified.filter((row) => row.published).length,
      ecgRows: classified.filter((row) => row.exclusionReasons.includes("ECG exclusion")).length,
      moduleOnlyRows: classified.filter((row) => row.exclusionReasons.includes("module-only exclusion")).length,
      incompleteRows: classified.filter((row) => row.completenessReasons.length > 0).length,
    },
    linearPractice: {
      eligibleRows: classified.filter((row) => row.linearPracticeReady).length,
      excludedRows: classified.filter((row) => !row.linearPracticeReady).length,
    },
    catReady: {
      completeRows: classified.filter((row) => row.catReady).length,
      ecgExclusions: classified.filter((row) => row.exclusionReasons.includes("ECG exclusion")).length,
      moduleExclusions: classified.filter((row) => row.exclusionReasons.includes("module-only exclusion")).length,
      failedCompletenessReasons,
      categorySpread,
      difficultySpread,
      validatePracticeCatPoolResult,
    },
    exclusions: {
      ecgRows: classified.filter((row) => row.exclusionReasons.includes("ECG exclusion")).length,
      moduleOnlyRows: classified.filter((row) => row.exclusionReasons.includes("module-only exclusion")).length,
      incompleteRows: classified.filter((row) => row.completenessReasons.length > 0).length,
      linearPracticeExcludedRows: classified.filter((row) => !row.linearPracticeReady).length,
      catExcludedRows: classified.filter((row) => !row.catReady).length,
    },
    failedCompletenessReasons,
    categorySpread,
    difficultySpread,
    validatePracticeCatPool: validatePracticeCatPoolResult,
    rows: classified,
  };
}

export async function auditQuestionInventoryForPathway(pathwayId: string): Promise<QuestionInventoryAuditSummary> {
  const { prisma } = await import("@/lib/db");
  const { expandedExamKeysForPathwayPool } = await import("@/lib/content-quality/exam-question-exam-normalization");
  const { getExamPathwayById } = await import("@/lib/exam-pathways/exam-product-registry");
  const { pathwayExamQuestionMarketingHubInventoryWhere, pathwayExamQuestionMarketingWhere } = await import(
    "@/lib/exam-pathways/pathway-question-bank-snapshot.server"
  );
  const pathway = getExamPathwayById(pathwayId);
  if (!pathway) {
    throw new Error(`Unknown exam pathway: ${pathwayId}`);
  }

  const rows: QuestionInventoryAuditRow[] = [];
  let cursor: string | undefined;
  for (;;) {
    const batch = await prisma.examQuestion.findMany({
      where: pathwayExamQuestionMarketingWhere(pathway),
      select: {
        id: true,
        stem: true,
        questionType: true,
        questionFormat: true,
        options: true,
        correctAnswer: true,
        rationale: true,
        difficulty: true,
        bodySystem: true,
        topic: true,
        nclexClientNeedsCategory: true,
        nclexClientNeedsSubcategory: true,
        tags: true,
        exam: true,
        tier: true,
        countryCode: true,
        regionScope: true,
        isAdaptiveEligible: true,
      },
      orderBy: { id: "asc" },
      take: INVENTORY_AUDIT_BATCH_SIZE,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });
    rows.push(...batch);
    if (batch.length < INVENTORY_AUDIT_BATCH_SIZE) break;
    cursor = batch[batch.length - 1]?.id;
    if (!cursor) break;
  }
  const policy = {
    contentExamKeys: [...pathway.contentExamKeys],
    expandedExamKeys: expandedExamKeysForPathwayPool([...new Set(pathway.contentExamKeys)]),
    publishedWhere: pathwayExamQuestionMarketingWhere(pathway),
    linearPracticeWhere: pathwayExamQuestionMarketingHubInventoryWhere(pathway),
    nonEcgWhere: NON_ECG_PRACTICE_EXAM_WHERE,
    moduleSurfaceWhere: generalStudyBankModuleSurfaceWhere(),
  };

  return buildQuestionInventorySummary({
    pathwayId: pathway.id,
    rows: rows.map((row) => ({
      row,
      published: true,
      linearPracticeReady: !isEcgRow(row) && !isModuleOnlyRow(row),
    })),
    policy,
  });
}
