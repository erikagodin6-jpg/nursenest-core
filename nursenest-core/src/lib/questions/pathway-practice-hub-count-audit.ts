import "server-only";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import {
  pathwayExamQuestionMarketingHubInventoryWhere,
  pathwayExamQuestionMarketingWhere,
} from "@/lib/exam-pathways/pathway-question-bank-snapshot.server";
import { expandedExamKeysForPathwayPool } from "@/lib/content-quality/exam-question-exam-normalization";
import { NON_ECG_PRACTICE_EXAM_WHERE } from "@/lib/practice-tests/cat-pool";
import { generalStudyBankModuleSurfaceWhere } from "@/lib/study-question-pool/study-question-pool-gates";
import {
  hydratePracticeHubAggregatesFromGroupByRows,
  type PracticeBodySystemHubAggregate,
  type PracticeHubGroupByRow,
} from "@/lib/questions/pathway-practice-hub-inventory";
import { normalizeQuestionBodySystem } from "@/lib/questions/normalize-question-body-system";

export type PracticeHubWhereClauseSummary = {
  usesMarketingPathwayWhere: boolean;
  usesNonEcgPracticeFilter: boolean;
  usesGeneralStudyBankModuleSurfaceFilter: boolean;
  appliesCatCompleteRowFilter: false;
  where: Prisma.ExamQuestionWhereInput;
};

export type PracticeHubCountAudit = {
  pathwayId: string;
  country: string;
  tier: string;
  contentExamKeys: string[];
  expandedExamKeys: string[];
  finalWhereClauseSummary: PracticeHubWhereClauseSummary;
  totalMatchingRows: number;
  groupedRows: PracticeHubGroupByRow[];
  normalizedHubTotals: PracticeBodySystemHubAggregate[];
  uncategorizedExamples: Array<{
    bodySystem: string | null;
    topic: string | null;
    nclexClientNeedsCategory: string | null;
    count: number;
  }>;
};

export function practiceHubWhereClauseSummary(pathwayId = "us-rn-nclex-rn"): PracticeHubWhereClauseSummary {
  const pathway = getExamPathwayById(pathwayId);
  if (!pathway) {
    throw new Error(`Unknown exam pathway: ${pathwayId}`);
  }

  return {
    usesMarketingPathwayWhere: true,
    usesNonEcgPracticeFilter: true,
    usesGeneralStudyBankModuleSurfaceFilter: true,
    appliesCatCompleteRowFilter: false,
    where: pathwayExamQuestionMarketingHubInventoryWhere(pathway),
  };
}

export function practiceHubAuditStaticSummary(pathwayId = "us-rn-nclex-rn") {
  const pathway = getExamPathwayById(pathwayId);
  if (!pathway) {
    throw new Error(`Unknown exam pathway: ${pathwayId}`);
  }

  return {
    pathwayId: pathway.id,
    country: pathway.countryCode,
    tier: pathway.stripeTier,
    contentExamKeys: [...pathway.contentExamKeys],
    expandedExamKeys: expandedExamKeysForPathwayPool([...new Set(pathway.contentExamKeys)]),
    pathwayWhere: pathwayExamQuestionMarketingWhere(pathway),
    nonEcgWhere: NON_ECG_PRACTICE_EXAM_WHERE,
    moduleSurfaceWhere: generalStudyBankModuleSurfaceWhere(),
    finalWhereClauseSummary: practiceHubWhereClauseSummary(pathway.id),
  };
}

export async function auditPracticeHubCountsForPathway(pathwayId = "us-rn-nclex-rn"): Promise<PracticeHubCountAudit> {
  const staticSummary = practiceHubAuditStaticSummary(pathwayId);
  const rows = await prisma.examQuestion.groupBy({
    by: ["bodySystem", "topic", "nclexClientNeedsCategory"],
    where: staticSummary.finalWhereClauseSummary.where,
    _count: { _all: true },
  });
  const groupedRows: PracticeHubGroupByRow[] = rows.map((row) => ({
    bodySystem: row.bodySystem,
    topic: row.topic,
    nclexClientNeedsCategory: row.nclexClientNeedsCategory,
    _count: { _all: row._count._all },
  }));
  const normalizedHubTotals = hydratePracticeHubAggregatesFromGroupByRows(groupedRows);

  return {
    pathwayId: staticSummary.pathwayId,
    country: String(staticSummary.country),
    tier: String(staticSummary.tier),
    contentExamKeys: staticSummary.contentExamKeys,
    expandedExamKeys: staticSummary.expandedExamKeys,
    finalWhereClauseSummary: staticSummary.finalWhereClauseSummary,
    totalMatchingRows: groupedRows.reduce((sum, row) => sum + row._count._all, 0),
    groupedRows,
    normalizedHubTotals,
    uncategorizedExamples: groupedRows
      .filter(
        (row) =>
          normalizeQuestionBodySystem({
            bodySystem: row.bodySystem,
            topic: row.topic,
            nclexClientNeedsCategory: row.nclexClientNeedsCategory,
          }) === "uncategorized",
      )
      .slice(0, 20)
      .map((row) => ({
        bodySystem: row.bodySystem,
        topic: row.topic,
        nclexClientNeedsCategory: row.nclexClientNeedsCategory,
        count: row._count._all,
      })),
  };
}
