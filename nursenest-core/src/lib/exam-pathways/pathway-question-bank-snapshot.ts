import type { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import { questionBankWhereForProfile } from "@/lib/entitlements/content-access-scope";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { npPathwaySpecialtyWhere } from "@/lib/exam-pathways/np-question-specialty-scope";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { recordRouteRenderFallback } from "@/lib/observability/route-fallback-tracker";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { isCompleteCatQuestionRow } from "@/lib/practice-tests/cat-pool";

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
  if (npSpecialtyScope) {
    return {
      AND: [profile, { exam: { in: [...new Set(pathway.contentExamKeys)] } }, npSpecialtyScope],
    };
  }
  return {
    AND: [profile, { exam: { in: [...new Set(pathway.contentExamKeys)] } }],
  };
}

export type PathwayQuestionBankSnapshot =
  | {
      status: "ok";
      pathwayScopedCount: number;
      adaptiveEligibleCount: number;
      examKeys: string[];
    }
  | { status: "unavailable" };

async function computePathwayQuestionBankSnapshot(pathway: ExamPathwayDefinition): Promise<PathwayQuestionBankSnapshot> {
  return withDatabaseFallbackTimeout<PathwayQuestionBankSnapshot>(
    async (): Promise<PathwayQuestionBankSnapshot> => {
      const base = pathwayExamQuestionMarketingWhere(pathway);
      const counts = await Promise.allSettled([
        withDatabaseFallbackTimeout(
          () => prisma.examQuestion.count({ where: base }),
          0,
          SNAPSHOT_TIMEOUT_MS,
          { scope: "exam_pathway_hub", label: `question_snapshot_count:${pathway.id}` },
        ),
        withDatabaseFallbackTimeout(
          () =>
            prisma.examQuestion.findMany({
              where: { AND: [base, { isAdaptiveEligible: true }] },
              select: {
                stem: true,
                options: true,
                correctAnswer: true,
                rationale: true,
              },
            }),
          [],
          SNAPSHOT_TIMEOUT_MS,
          { scope: "exam_pathway_hub", label: `question_snapshot_adaptive:${pathway.id}` },
        ),
      ]);
      const pathwayScopedCount =
        counts[0]?.status === "fulfilled" && typeof counts[0].value === "number" ? counts[0].value : 0;
      const adaptiveEligibleCount =
        counts[1]?.status === "fulfilled" && Array.isArray(counts[1].value)
          ? counts[1].value.filter((q) => isCompleteCatQuestionRow(q)).length
          : 0;
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
