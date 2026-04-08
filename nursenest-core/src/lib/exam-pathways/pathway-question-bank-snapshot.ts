import type { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import { questionBankWhereForProfile } from "@/lib/entitlements/content-access-scope";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

const SNAPSHOT_TIMEOUT_MS = 10_000;
const REVALIDATE_SECONDS = 3600;

/**
 * Published `exam_questions` rows that match how the subscriber question bank and CAT pool scope items:
 * {@link questionBankWhereForProfile} (tier ladder + region) plus pathway `contentExamKeys` on `exam`
 * when the pathway defines keys (same as {@link questionAccessWhereWithPathway} for entitled users).
 */
export function pathwayExamQuestionMarketingWhere(pathway: ExamPathwayDefinition): Prisma.ExamQuestionWhereInput {
  const profile = questionBankWhereForProfile(pathway.countryCode, pathway.stripeTier);
  if (pathway.contentExamKeys.length === 0) return profile;
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
      const [pathwayScopedCount, adaptiveEligibleCount] = await Promise.all([
        prisma.examQuestion.count({ where: base }),
        prisma.examQuestion.count({
          where: { AND: [base, { isAdaptiveEligible: true }] },
        }),
      ]);
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
  return unstable_cache(
    async (): Promise<PathwayQuestionBankSnapshot> => {
      const pathway = getExamPathwayById(pathwayId);
      if (!pathway) return { status: "unavailable" };
      return computePathwayQuestionBankSnapshot(pathway);
    },
    ["pathway-question-bank-snapshot", pathwayId],
    { revalidate: REVALIDATE_SECONDS, tags: [`pathway-questions:${pathwayId}`] },
  )();
}
