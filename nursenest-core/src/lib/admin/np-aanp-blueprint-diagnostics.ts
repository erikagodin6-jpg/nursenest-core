import { ContentStatus, type Prisma, type PrismaClient } from "@prisma/client";
import {
  AANP_NP_BLUEPRINT_CATEGORY_IDS,
  AANP_NP_US_EXAM_CONFIG,
} from "@/lib/exams/exam-config";
import { npPoolExamColumnValues } from "@/lib/exam-pathways/exam-product-registry";
import { contentStatusToDb } from "@/lib/prisma/content-status";

const AANP_IDS = [...AANP_NP_BLUEPRINT_CATEGORY_IDS];

export function npPublishedExamWhere(publishedStatus: string): Prisma.ExamQuestionWhereInput {
  return {
    status: publishedStatus,
    exam: { in: npPoolExamColumnValues() },
  };
}

/** NP published rows whose `nclex_client_needs_category` is a valid AANP blueprint id. */
export function npTaggedValidAanpWhere(publishedStatus: string): Prisma.ExamQuestionWhereInput {
  return {
    AND: [
      npPublishedExamWhere(publishedStatus),
      { nclexClientNeedsCategory: { in: AANP_IDS } },
    ],
  };
}

/** NP published rows missing a valid AANP blueprint tag (null, empty, or non-AANP value). */
export function npMissingAanpBlueprintWhere(publishedStatus: string): Prisma.ExamQuestionWhereInput {
  return {
    AND: [
      npPublishedExamWhere(publishedStatus),
      {
        OR: [
          { nclexClientNeedsCategory: null },
          { nclexClientNeedsCategory: "" },
          { NOT: { nclexClientNeedsCategory: { in: AANP_IDS } } },
        ],
      },
    ],
  };
}

export type NpAanpBlueprintDiagnostics = {
  examColumnValues: string[];
  aanpBlueprintIds: string[];
  npPublishedTotal: number;
  npTaggedValidAanp: number;
  npMissingOrNonAanpBlueprint: number;
  mappedFraction: number;
  countsByAanpDomain: Record<string, number>;
};

export async function computeNpAanpBlueprintDiagnostics(db: PrismaClient): Promise<NpAanpBlueprintDiagnostics> {
  const published = contentStatusToDb(ContentStatus.PUBLISHED);
  const base = npPublishedExamWhere(published);
  const [npPublishedTotal, npTaggedValidAanp, npMissingOrNonAanpBlueprint, domainGroups] = await Promise.all([
    db.examQuestion.count({ where: base }),
    db.examQuestion.count({ where: npTaggedValidAanpWhere(published) }),
    db.examQuestion.count({ where: npMissingAanpBlueprintWhere(published) }),
    db.examQuestion.groupBy({
      by: ["nclexClientNeedsCategory"],
      where: npTaggedValidAanpWhere(published),
      _count: { _all: true },
    }),
  ]);

  const countsByAanpDomain: Record<string, number> = {};
  for (const c of AANP_NP_US_EXAM_CONFIG.categories) {
    countsByAanpDomain[c.id] = 0;
  }
  for (const row of domainGroups) {
    const k = row.nclexClientNeedsCategory;
    if (k && AANP_NP_BLUEPRINT_CATEGORY_IDS.has(k)) {
      countsByAanpDomain[k] = (countsByAanpDomain[k] ?? 0) + row._count._all;
    }
  }

  const mappedFraction = npPublishedTotal > 0 ? npTaggedValidAanp / npPublishedTotal : 0;

  return {
    examColumnValues: npPoolExamColumnValues(),
    aanpBlueprintIds: AANP_IDS,
    npPublishedTotal,
    npTaggedValidAanp,
    npMissingOrNonAanpBlueprint,
    mappedFraction,
    countsByAanpDomain,
  };
}
