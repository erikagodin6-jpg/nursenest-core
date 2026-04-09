export type { BlueprintDomainId } from "./blueprint-domain";
export { BLUEPRINT_DOMAIN_LABELS, blueprintDomainFromCanonicalTopic } from "./blueprint-domain";
export type { ClinicalSystemId } from "./clinical-system-id";
export { CLINICAL_SYSTEM_LABELS } from "./clinical-system-id";
export {
  inferBlueprintDomainForRow,
  inferClinicalSystemForRow,
  inferMedicationBuckets,
  type QuestionRowForBlueprint,
} from "./infer-blueprint-from-question-row";
export {
  BLUEPRINT_REPORT_PATHWAY_IDS,
  buildPathwayBlueprintProfile,
  type PathwayBlueprintProfile,
} from "./pathway-blueprint-profiles";
export { classifyCoverage, type CoverageBand } from "./coverage-status";
export {
  buildGapBacklog,
  recommendedFirstAdditions,
  recommendedLessonTopicsFromSystems,
  recommendedQuestionBankTargets,
  type GapItem,
  type GapKind,
} from "./gap-prioritization";
export type {
  BlueprintDomainCoverageRow,
  BlueprintSystemCoverageRow,
  ExamBlueprintCoverageReport,
  PathwayBlueprintReport,
  RecommendedLessonTopicRow,
  RationaleTierBreakdown,
} from "./blueprint-report-types";
export type { CatalogLessonInventory } from "./pathway-catalog-lesson-stats";
export { loadPathwayCatalogLessonStats } from "./pathway-catalog-lesson-stats";
export {
  buildExamBlueprintCoverageReport,
} from "./build-blueprint-coverage-report";
export {
  buildLessonBlueprintCoverageDashboard,
  inferLessonBlueprintDomain,
  inferBlueprintDomainFromLessonHaystack,
  inferLessonCatalogType,
  LESSON_LIBRARY_MIN,
  LESSON_LIBRARY_STRETCH,
  type LessonBlueprintCoverageDashboard,
  type PathwayLessonBlueprintCoverage,
} from "./lesson-blueprint-coverage-dashboard";
