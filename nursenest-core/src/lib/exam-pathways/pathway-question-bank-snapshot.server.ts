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
import { NON_ECG_PRACTICE_EXAM_WHERE } from "@/lib/practice-tests/cat-pool";
import { generalStudyBankModuleSurfaceWhere } from "@/lib/study-question-pool/study-question-pool-gates";
import { RT_VENTILATOR_BANK_TAG } from "@/lib/rt-ventilator/rt-ventilator-content-taxonomy";
import {
  npProviderQuestionScopeWhere,
  standardExamPrepQuestionScopeWhere,
} from "@/lib/questions/difficulty-scope-filter";

const SNAPSHOT_TIMEOUT_MS = 1000;
const REVALIDATE_SECONDS = 3600;

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
      const publishedWhere = pathwayExamQuestionMarketingWhere(pathway);
      const inventoryWhere = pathwayExamQuestionMarketingHubInventoryWhere(pathway);
      const counts = await Promise.allSettled([
        withDatabaseFallbackTimeout(
          () => prisma.examQuestion.count({ where: publishedWhere }),
          null as number | null,
          SNAPSHOT_TIMEOUT_MS,
          { scope: "exam_pathway_hub", label: `question_snapshot_published_count:${pathway.id}` },
        ),
        withDatabaseFallbackTimeout(
          () => prisma.examQuestion.count({ where: inventoryWhere }),
          null as number | null,
          SNAPSHOT_TIMEOUT_MS,
          { scope: "exam_pathway_hub", label: `question_snapshot_count:${pathway.id}` },
        ),
        // O(1) count query replaces the O(n) row-scan loop.
        // The old loop fetched up to 8,000 rows in batches of 280 to run quality validation;
        // for marketing surfaces the count alone is sufficient to gate the CAT CTA.
        withDatabaseFallbackTimeout(
          () => prisma.examQuestion.count({
            where: { AND: [inventoryWhere, { isAdaptiveEligible: true }] },
          }),
          0 as number,
          SNAPSHOT_TIMEOUT_MS,
          { scope: "exam_pathway_hub", label: `question_snapshot_adaptive:${pathway.id}` },
        ),
      ]);
      const publishedQuestionCount =
        counts[0]?.status === "fulfilled" && typeof counts[0].value === "number" ? counts[0].value : null;
      const visibleQuestionCount =
        counts[1]?.status === "fulfilled" && typeof counts[1].value === "number" ? counts[1].value : null;
      const adaptiveEligibleCount =
        counts[2]?.status === "fulfilled" && typeof counts[2].value === "number" ? counts[2].value : 0;
      if (publishedQuestionCount === null || visibleQuestionCount === null) {
        const reason = publishedQuestionCount === null ? "published_count_unavailable" : "visible_count_unavailable";
        safeServerLog("exam_pathway_hub", "question_snapshot_count_unavailable", {
          event: "question_snapshot_count_unavailable",
          dependency_name: "question_snapshot_prisma_count",
          pathway_id: pathway.id,
          reason,
        });
        recordRouteRenderFallback({
          fallbackType: "hub_data_load_failed",
          pathwayId: pathway.id,
          dependencyName: "question_snapshot_prisma_count",
        });
        return { status: "unavailable", reason };
      }
      if (counts.some((count) => count.status === "rejected")) {
        safeServerLog("exam_pathway_hub", "hub_data_load_failed", {
          event: "hub_data_load_failed",
          dependency_name: "question_snapshot_prisma_count",
          pathway_id: pathway.id,
          error_message: String(
            counts[0]?.status === "rejected"
              ? counts[0].reason
              : counts[1]?.status === "rejected"
                ? counts[1].reason
                : counts[2]?.status === "rejected"
                  ? counts[2].reason
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
        publishedQuestionCount,
        visibleQuestionCount,
        activeQuestionCount: visibleQuestionCount,
        pathwayScopedCount: visibleQuestionCount,
        adaptiveEligibleCount,
        examKeys: [...new Set(pathway.contentExamKeys)],
      };
    },
    { status: "unavailable", reason: "snapshot_unavailable" },
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
        if (!pathway) return { status: "unavailable", reason: "missing_pathway" };
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
    return { status: "unavailable", reason: "snapshot_unavailable" };
  }
}
