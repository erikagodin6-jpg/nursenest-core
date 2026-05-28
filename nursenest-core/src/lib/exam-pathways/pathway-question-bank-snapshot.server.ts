import "server-only";

import type { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import { questionBankWhereForProfile } from "@/lib/entitlements/content-access-scope";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { expandedExamKeysForPathwayPool } from "@/lib/content-quality/exam-question-exam-normalization";
import { npPathwaySpecialtyWhere } from "@/lib/exam-pathways/np-question-specialty-scope";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { PathwayQuestionBankSnapshot } from "@/lib/exam-pathways/pathway-question-bank-snapshot.types";
import { recordRouteRenderFallback } from "@/lib/observability/route-fallback-tracker";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { catReadinessMinCompletePoolRows } from "@/lib/practice-tests/cat-readiness-floor";
import { isCompleteCatQuestionRow, NON_ECG_PRACTICE_EXAM_WHERE } from "@/lib/practice-tests/cat-pool";
import { validatePracticeCatPool, type CatPoolRow } from "@/lib/exams/cat-engine";
import { generalStudyBankModuleSurfaceWhere } from "@/lib/study-question-pool/study-question-pool-gates";
import { RT_VENTILATOR_BANK_TAG } from "@/lib/rt-ventilator/rt-ventilator-content-taxonomy";
import {
  npProviderQuestionScopeWhere,
  standardExamPrepQuestionScopeWhere,
} from "@/lib/questions/difficulty-scope-filter";

const SNAPSHOT_TIMEOUT_MS = 1000;
const REVALIDATE_SECONDS = 3600;
const SNAPSHOT_ADAPTIVE_BATCH = 280;
const SNAPSHOT_ADAPTIVE_SCAN_CAP = 8000;

/**
 * Route-scoped marketing/question-bank aggregate.
 * Do not pull this into root/shared layouts, homepage shell modules, or header/nav chrome.
 *
 * Published `exam_questions` rows that match how the subscriber question bank and CAT pool scope items:
 * {@link questionBankWhereForProfile} (tier ladder + region) plus pathway `contentExamKeys` on `exam`
 * when the pathway defines keys (same as {@link questionAccessWhereWithPathway} for entitled users).
 */
export function pathwayExamQuestionMarketingWhere(pathway: ExamPathwayDefinition): Prisma.ExamQuestionWhereInput {
  const profile = questionBankWhereForProfile(pathway.countryCode, pathway.stripeTier);
  const npSpecialtyScope = npPathwaySpecialtyWhere(pathway);
  if (pathway.contentExamKeys.length === 0) {
    return npSpecialtyScope ? { AND: [profile, npSpecialtyScope] } : profile;
  }
  const examPool = expandedExamKeysForPathwayPool([...new Set(pathway.contentExamKeys)]);
  if (npSpecialtyScope) {
    return {
      AND: [profile, { exam: { in: examPool } }, npSpecialtyScope],
    };
  }
  return {
    AND: [profile, { exam: { in: examPool } }],
  };
}

/**
 * Published items counted on marketing hubs, CAT snapshot, and body-system aggregates —
 * tier/region + pathway exam scope + non-ECG general-bank surface (matches subscriber pools).
 */
export function pathwayExamQuestionMarketingHubInventoryWhere(
  pathway: ExamPathwayDefinition,
): Prisma.ExamQuestionWhereInput {
  const base = pathwayExamQuestionMarketingWhere(pathway);
  const scopeGate = pathway.roleTrack === "np" ? npProviderQuestionScopeWhere() : standardExamPrepQuestionScopeWhere();
  return {
    AND: [
      base,
      NON_ECG_PRACTICE_EXAM_WHERE,
      generalStudyBankModuleSurfaceWhere(),
      { NOT: { tags: { has: RT_VENTILATOR_BANK_TAG } } },
      scopeGate,
    ],
  };
}

async function computePathwayQuestionBankSnapshot(pathway: ExamPathwayDefinition): Promise<PathwayQuestionBankSnapshot> {
  return withDatabaseFallbackTimeout<PathwayQuestionBankSnapshot>(
    async (): Promise<PathwayQuestionBankSnapshot> => {
      const inventoryWhere = pathwayExamQuestionMarketingHubInventoryWhere(pathway);
      const minCatReady = catReadinessMinCompletePoolRows(pathway.id);
      const counts = await Promise.allSettled([
        withDatabaseFallbackTimeout(
          () => prisma.examQuestion.count({ where: inventoryWhere }),
          0,
          SNAPSHOT_TIMEOUT_MS,
          { scope: "exam_pathway_hub", label: `question_snapshot_count:${pathway.id}` },
        ),
        withDatabaseFallbackTimeout(async () => {
          const adaptiveWhere: Prisma.ExamQuestionWhereInput = {
            AND: [inventoryWhere, { isAdaptiveEligible: true }],
          };
          const pool: CatPoolRow[] = [];
          const maxHeld = Math.min(512, Math.max(minCatReady + 120, 200));
          let skip = 0;
          while (skip < SNAPSHOT_ADAPTIVE_SCAN_CAP) {
            const batch = await prisma.examQuestion.findMany({
              where: adaptiveWhere,
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
              take: SNAPSHOT_ADAPTIVE_BATCH,
            });
            if (batch.length === 0) break;
            for (const r of batch) {
              if (!isCompleteCatQuestionRow(r)) continue;
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
            if (pool.length >= minCatReady && validatePracticeCatPool(pool).ok) break;
            if (batch.length < SNAPSHOT_ADAPTIVE_BATCH) break;
          }
          return pool.length;
        }, 0, SNAPSHOT_TIMEOUT_MS, { scope: "exam_pathway_hub", label: `question_snapshot_adaptive:${pathway.id}` }),
      ]);
      const pathwayScopedCount =
        counts[0]?.status === "fulfilled" && typeof counts[0].value === "number" ? counts[0].value : 0;
      const adaptiveEligibleCount =
        counts[1]?.status === "fulfilled" && typeof counts[1].value === "number" ? counts[1].value : 0;
      if (counts[0]?.status === "rejected" || counts[1]?.status === "rejected") {
        safeServerLog("exam_pathway_hub", "hub_data_load_failed", {
          event: "hub_data_load_failed",
          dependency_name: "question_snapshot_prisma_count",
          pathway_id: pathway.id,
          error_message: String(
            counts[0]?.status === "rejected"
              ? counts[0].reason
              : counts[1]?.status === "rejected"
                ? counts[1].reason
                : "",
          ).slice(0, 500),
        });
        recordRouteRenderFallback({
          fallbackType: "hub_data_load_failed",
          pathwayId: pathway.id,
          dependencyName: "question_snapshot_prisma_count",
        });
      }
      return {
        status: "ok",
        pathwayScopedCount,
        adaptiveEligibleCount,
        examKeys: [...new Set(pathway.contentExamKeys)],
      };
    },
    { status: "unavailable" },
    SNAPSHOT_TIMEOUT_MS,
  );
}

/**
 * Cached aggregate for marketing surfaces — mirrors in-app pool scoping for the pathway’s default subscription tier.
 */
export async function loadPathwayQuestionBankSnapshot(pathwayId: string): Promise<PathwayQuestionBankSnapshot> {
  try {
    return await unstable_cache(
      async (): Promise<PathwayQuestionBankSnapshot> => {
        const pathway = getExamPathwayById(pathwayId);
        if (!pathway) return { status: "unavailable" };
        return computePathwayQuestionBankSnapshot(pathway);
      },
      ["pathway-question-bank-snapshot", pathwayId],
      { revalidate: REVALIDATE_SECONDS, tags: [`pathway-questions:${pathwayId}`] },
    )();
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    safeServerLog("exam_pathway_hub", "hub_data_load_failed", {
      event: "hub_data_load_failed",
      dependency_name: "pathway_question_bank_snapshot_cache",
      pathway_id: pathwayId,
      error_message: message.slice(0, 500),
    });
    recordRouteRenderFallback({
      fallbackType: "hub_data_load_failed",
      pathwayId,
      dependencyName: "pathway_question_bank_snapshot_cache",
    });
    return { status: "unavailable" };
  }
}
