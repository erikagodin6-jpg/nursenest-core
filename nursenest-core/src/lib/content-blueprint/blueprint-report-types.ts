import type { PathwayBlueprintProfile } from "./pathway-blueprint-profiles";
import type { GapItem } from "./gap-prioritization";
import type { CoverageBand } from "./coverage-status";
import type { BlueprintDomainId } from "./blueprint-domain";
import type { ClinicalSystemId } from "./clinical-system-id";
import type { CatalogLessonInventory } from "./pathway-catalog-lesson-stats";

export type BlueprintDomainCoverageRow = {
  domain: BlueprintDomainId;
  label: string;
  questionCount: number;
  pctOfPathway: number;
  minQuestions: number;
  stretchQuestions: number;
  band: CoverageBand;
};

export type BlueprintSystemCoverageRow = {
  system: ClinicalSystemId;
  label: string;
  questionCount: number;
  minQuestions: number;
  stretchQuestions: number;
  band: CoverageBand;
};

export type RationaleTierBreakdown = {
  publishedInScope: number;
  missing: number;
  thin: number;
  acceptable: number;
  strong: number;
  pctMissing: number;
  pctThin: number;
  pctAcceptable: number;
  pctStrong: number;
};

export type RecommendedLessonTopicRow = {
  system: ClinicalSystemId;
  label: string;
  band: CoverageBand;
  questionCount: number;
  minQuestions: number;
};

export type PathwayBlueprintReport = {
  pathwayId: string;
  displayName: string;
  countryCode: string;
  stripeTier: string;
  contentExamKeys: string[];
  profile: PathwayBlueprintProfile;
  totals: {
    publishedQuestionsInScope: number;
    belowMinTotal: boolean;
    pctThinRationale: number;
    pctMissingRationale: number;
    distinctMedicationBuckets: number;
    clinicalJudgmentProxyCount: number;
    lessonTopicSlugsWithAtLeastOneLesson: number;
  };
  /** Word-count + explanation heuristic; audit-only (no grading impact). */
  rationaleTiers: RationaleTierBreakdown;
  /** Static catalog.json inventory for this pathway (null if unavailable). */
  catalogLessons: CatalogLessonInventory | null;
  domains: BlueprintDomainCoverageRow[];
  systems: BlueprintSystemCoverageRow[];
  prioritizedGaps: GapItem[];
  recommendedFirstAdditions: string[];
  recommendedLessonTopics: RecommendedLessonTopicRow[];
  recommendedQuestionBankTargets: string[];
};

export type ExamBlueprintCoverageReport = {
  generatedAt: string;
  databaseConfigured: boolean;
  notes: string[];
  pathways: PathwayBlueprintReport[];
};
