/**
 * Content Inventory Resolver — Single Source of Truth for all learning surfaces.
 *
 * All six learning engines (Flashcards, CAT, Practice Tests, Study Plans,
 * Weak Areas, Readiness Analytics) must measure content eligibility through
 * this resolver so that pool counts, exam-key scoping, tier gates, region gates,
 * non-ECG gates, and study-bank module gates are identical everywhere.
 *
 * The resolver wraps:
 *   - `getCanonicalExamQuestionWhereForPathway` (Prisma WHERE for exam_questions)
 *   - `flashcard` table dedicated count
 *
 * It does NOT execute the session builder; it only counts and diagnoses.
 */

import "server-only";

import { ContentStatus } from "@prisma/client";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { prisma } from "@/lib/db";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { flashcardAccessWhere } from "@/lib/entitlements/content-access-scope";
import { flashcardPathwayAccessOptionsFromPathwayId } from "@/lib/flashcards/flashcard-pathway-scope";
import { normalizePathwayIdForStudySurfaces } from "@/lib/study-question-pool/study-pathway-normalize";
import {
  getCanonicalExamQuestionWhere,
  getCanonicalExamQuestionWhereForPathway,
} from "@/lib/study-question-pool/canonical-exam-question-where";

// ─── Public types ──────────────────────────────────────────────────────────────

/** Which learning surface is requesting inventory. Drives which pool sub-counts matter. */
export type ContentInventorySurface =
  | "flashcards"
  | "cat"
  | "practice"
  | "study_plan"
  | "weak_areas"
  | "readiness";

/** Breakdown of why rows were excluded from the eligible pool. */
export type InventoryExclusionDetail = {
  /** Total rows in the canonical storage table before any eligibility filter. */
  sourceInventory: number;
  /** After published-status + tier + region filters (entitlement gates). */
  effectiveInventory: number;
  /** After all gates including exam-key scope, non-ECG, module gates, quality gates. */
  eligibleInventory: number;
  /** Rows removed between sourceInventory and eligibleInventory. */
  excludedInventory: number;
  /** Human-readable reasons for each exclusion layer. */
  exclusionReasons: string[];
};

/** Per-surface pool sizes derived from a single resolver run. */
export type ContentInventoryBySurface = {
  /** ExamQuestion rows that pass the canonical CAT/Practice WHERE (completeness + all gates). */
  catPool: number;
  /** Same as catPool — Practice shares the CAT pool. */
  practicePool: number;
  /**
   * Flashcard-eligible ExamQuestion rows (canonical Prisma WHERE, no completeness gate —
   * rationale not required for flashcard display).
   */
  flashcardExamPool: number;
  /** Rows in the dedicated `flashcard` table for this pathway (PUBLISHED, access-scoped). */
  flashcardDedicatedPool: number;
  /** Union pool for flashcard sessions: flashcardExamPool + flashcardDedicatedPool. */
  flashcardTotalPool: number;
  /**
   * Study plan / weak area recommendations use flashcardTotalPool + practicePool as
   * the upper-bound "has content" signal; this is that combined effective maximum.
   */
  studyPlanEffectivePool: number;
};

export type ContentInventoryResolverResult = {
  pathwayId: string;
  normalizedPathwayId: string;
  tier: string;
  country: string;
  hasAccess: boolean;
  /** True when the pathway was found in the exam registry. */
  pathwayFound: boolean;
  /** ExamQuestion breakdown for the canonical (CAT-aligned) pool. */
  examQuestion: InventoryExclusionDetail;
  /** Dedicated Flashcard table breakdown. */
  dedicatedFlashcard: InventoryExclusionDetail;
  /** Per-surface pool sizes. */
  bySurface: ContentInventoryBySurface;
  /**
   * Parity verdict: true when flashcardExamPool equals catPool within the
   * expected difference caused by the flashcard-specific quality gate
   * (flashcards do not require rationale; CAT does).
   */
  examPoolParityOk: boolean;
  /** Mismatch magnitude: catPool minus flashcardExamPool. Negative = CAT is stricter. */
  examPoolParityDelta: number;
  /** ISO timestamp of when this snapshot was computed. */
  resolvedAt: string;
};

// ─── Internal helpers ──────────────────────────────────────────────────────────

async function countExamQuestions(
  where: Parameters<typeof prisma.examQuestion.count>[0]["where"],
): Promise<number> {
  return prisma.examQuestion.count({ where });
}

async function countDedicatedFlashcards(
  entitlement: AccessScope,
  normalizedPathwayId: string,
): Promise<number> {
  const pathwayOpts = flashcardPathwayAccessOptionsFromPathwayId(normalizedPathwayId);
  return prisma.flashcard.count({
    where: {
      status: ContentStatus.PUBLISHED,
      AND: [
        flashcardAccessWhere(entitlement, pathwayOpts),
        { deck: { pathwayId: normalizedPathwayId } },
      ],
    },
  });
}

/** Count all exam_questions rows regardless of status (source inventory). */
async function countRawExamQuestions(pathway: ExamPathwayDefinition): Promise<number> {
  return prisma.examQuestion.count({
    where: { exam: { in: [...pathway.contentExamKeys] } },
  });
}

/** Count published exam_questions (effective = published + tier + region, no extra gates). */
async function countEffectiveExamQuestions(
  entitlement: AccessScope,
  pathway: ExamPathwayDefinition,
): Promise<number> {
  const { questionAccessWhereWithPathway } = await import(
    "@/lib/exam-pathways/pathway-content-scope"
  );
  return prisma.examQuestion.count({
    where: questionAccessWhereWithPathway(entitlement, pathway),
  });
}

// ─── Primary export ────────────────────────────────────────────────────────────

/**
 * Resolve the content inventory for a given entitlement + pathway.
 *
 * Counts are derived entirely from Prisma using the canonical WHERE functions
 * so they are identical to what CAT, Practice, and Flashcard session builders
 * would see before applying their own secondary filters (difficulty, topic, etc.).
 *
 * Safe to call from any server-side context; no mutations, no session side-effects.
 */
export async function contentInventoryResolver(args: {
  entitlement: AccessScope;
  pathwayId: string;
  surface?: ContentInventorySurface;
}): Promise<ContentInventoryResolverResult> {
  const { entitlement } = args;
  const resolvedAt = new Date().toISOString();

  const normalizedPathwayId = normalizePathwayIdForStudySurfaces(
    args.pathwayId,
    entitlement.country,
  );
  const pathway = getExamPathwayById(normalizedPathwayId) ?? null;

  const tier = String(entitlement.tier ?? "");
  const country = String(entitlement.country ?? "");
  const hasAccess = Boolean(entitlement.hasAccess);
  const pathwayFound = pathway !== null;

  // ── Zero out everything when access is denied ──────────────────────────────
  if (!hasAccess || !pathway) {
    const zero: InventoryExclusionDetail = {
      sourceInventory: 0,
      effectiveInventory: 0,
      eligibleInventory: 0,
      excludedInventory: 0,
      exclusionReasons: hasAccess
        ? ["pathway_not_found_in_registry"]
        : ["subscription_access_denied"],
    };
    return {
      pathwayId: args.pathwayId,
      normalizedPathwayId,
      tier,
      country,
      hasAccess,
      pathwayFound,
      examQuestion: zero,
      dedicatedFlashcard: zero,
      bySurface: {
        catPool: 0,
        practicePool: 0,
        flashcardExamPool: 0,
        flashcardDedicatedPool: 0,
        flashcardTotalPool: 0,
        studyPlanEffectivePool: 0,
      },
      examPoolParityOk: true,
      examPoolParityDelta: 0,
      resolvedAt,
    };
  }

  // ── Run counts in parallel ─────────────────────────────────────────────────
  const [
    sourceCount,
    effectiveCount,
    canonicalCount,
    dedicatedFlashcardCount,
  ] = await Promise.all([
    countRawExamQuestions(pathway),
    countEffectiveExamQuestions(entitlement, pathway),
    countExamQuestions(getCanonicalExamQuestionWhereForPathway(entitlement, pathway)),
    countDedicatedFlashcards(entitlement, normalizedPathwayId),
  ]);

  // CAT completeness gate adds rationale requirement on top of canonical WHERE.
  // We count it separately to measure the CAT-specific stricter filter.
  const { CAT_DB_COMPLETENESS_WHERE } = await import("@/lib/practice-tests/cat-pool");
  const catEligibleCount = await countExamQuestions({
    AND: [getCanonicalExamQuestionWhereForPathway(entitlement, pathway), CAT_DB_COMPLETENESS_WHERE],
  });

  // ── Exam question exclusion breakdown ─────────────────────────────────────
  const examExclusionReasons: string[] = [];
  if (sourceCount - effectiveCount > 0) {
    examExclusionReasons.push(
      `${sourceCount - effectiveCount} rows excluded: unpublished status, wrong tier, or wrong region`,
    );
  }
  if (effectiveCount - canonicalCount > 0) {
    examExclusionReasons.push(
      `${effectiveCount - canonicalCount} rows excluded: non-ECG gate, study-bank module gate, RT ventilator gate, or NP scope gate`,
    );
  }
  if (canonicalCount - catEligibleCount > 0) {
    examExclusionReasons.push(
      `${canonicalCount - catEligibleCount} rows excluded by CAT completeness gate (missing rationale/options)`,
    );
  }
  if (examExclusionReasons.length === 0) {
    examExclusionReasons.push("none — full source inventory passes all gates");
  }

  // ── Dedicated flashcard exclusion breakdown ───────────────────────────────
  const dedicatedSourceCount = await prisma.flashcard.count({
    where: {
      deck: {
        pathwayId: normalizedPathwayId,
      },
    },
  });
  const dedicatedExclusionReasons: string[] = [];
  if (dedicatedSourceCount - dedicatedFlashcardCount > 0) {
    dedicatedExclusionReasons.push(
      `${dedicatedSourceCount - dedicatedFlashcardCount} rows excluded: unpublished status or tier/access gate`,
    );
  }
  if (dedicatedExclusionReasons.length === 0) {
    dedicatedExclusionReasons.push("none — all dedicated flashcards pass access gates");
  }

  // ── Surface pool sizes ────────────────────────────────────────────────────
  const bySurface: ContentInventoryBySurface = {
    catPool: catEligibleCount,
    practicePool: catEligibleCount,
    flashcardExamPool: canonicalCount,
    flashcardDedicatedPool: dedicatedFlashcardCount,
    flashcardTotalPool: canonicalCount + dedicatedFlashcardCount,
    studyPlanEffectivePool: catEligibleCount + dedicatedFlashcardCount,
  };

  // ── Parity check ──────────────────────────────────────────────────────────
  // CAT pool is a strict subset of flashcard exam pool (CAT requires rationale;
  // flashcards do not). Any delta <= 0 is expected; a POSITIVE delta is a
  // misconfiguration where flashcards see fewer questions than CAT.
  const examPoolParityDelta = catEligibleCount - canonicalCount;
  const examPoolParityOk = examPoolParityDelta <= 0;

  return {
    pathwayId: args.pathwayId,
    normalizedPathwayId,
    tier,
    country,
    hasAccess,
    pathwayFound,
    examQuestion: {
      sourceInventory: sourceCount,
      effectiveInventory: effectiveCount,
      eligibleInventory: canonicalCount,
      excludedInventory: sourceCount - canonicalCount,
      exclusionReasons: examExclusionReasons,
    },
    dedicatedFlashcard: {
      sourceInventory: dedicatedSourceCount,
      effectiveInventory: dedicatedSourceCount,
      eligibleInventory: dedicatedFlashcardCount,
      excludedInventory: dedicatedSourceCount - dedicatedFlashcardCount,
      exclusionReasons: dedicatedExclusionReasons,
    },
    bySurface,
    examPoolParityOk,
    examPoolParityDelta,
    resolvedAt,
  };
}

/**
 * Resolve content inventory without a specific pathway — counts the full
 * entitlement-scoped pool across all exams. Useful for admin diagnostics.
 */
export async function contentInventoryResolverGlobal(args: {
  entitlement: AccessScope;
}): Promise<{ examQuestionTotal: number; dedicatedFlashcardTotal: number; resolvedAt: string }> {
  const { entitlement } = args;
  const resolvedAt = new Date().toISOString();
  if (!entitlement.hasAccess) {
    return { examQuestionTotal: 0, dedicatedFlashcardTotal: 0, resolvedAt };
  }
  const [examQuestionTotal, dedicatedFlashcardTotal] = await Promise.all([
    countExamQuestions(getCanonicalExamQuestionWhere(entitlement)),
    prisma.flashcard.count({
      where: {
        status: ContentStatus.PUBLISHED,
        AND: [flashcardAccessWhere(entitlement, {})],
      },
    }),
  ]);
  return { examQuestionTotal, dedicatedFlashcardTotal, resolvedAt };
}
