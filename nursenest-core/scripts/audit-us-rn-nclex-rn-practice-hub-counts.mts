import { auditPracticeHubCountsForPathway } from "@/lib/questions/pathway-practice-hub-count-audit";

const pathwayId = process.argv[2]?.trim() || "us-rn-nclex-rn";

const audit = await auditPracticeHubCountsForPathway(pathwayId);
const printable = {
  pathwayId: audit.pathwayId,
  country: audit.country,
  tier: audit.tier,
  contentExamKeys: audit.contentExamKeys,
  expandedExamKeys: audit.expandedExamKeys,
  finalWhereClauseSummary: {
    usesMarketingPathwayWhere: audit.finalWhereClauseSummary.usesMarketingPathwayWhere,
    usesNonEcgPracticeFilter: audit.finalWhereClauseSummary.usesNonEcgPracticeFilter,
    usesGeneralStudyBankModuleSurfaceFilter: audit.finalWhereClauseSummary.usesGeneralStudyBankModuleSurfaceFilter,
    appliesCatCompleteRowFilter: audit.finalWhereClauseSummary.appliesCatCompleteRowFilter,
    where: audit.finalWhereClauseSummary.where,
  },
  totalMatchingRows: audit.totalMatchingRows,
  groupedBodySystemTopicClientNeedsRows: audit.groupedRows.length,
  normalizedHubTotals: audit.normalizedHubTotals.map((row) => ({
    id: row.id,
    label: row.label,
    questionCount: row.questionCount,
  })),
  uncategorizedExamples: audit.uncategorizedExamples,
};

console.log(JSON.stringify(printable, null, 2));
