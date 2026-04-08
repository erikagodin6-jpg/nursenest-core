import type { PathwayBlueprintProfile } from "./pathway-blueprint-profiles";
import type { GapItem } from "./gap-prioritization";
import type { CoverageBand } from "./coverage-status";
import type { BlueprintDomainId } from "./blueprint-domain";
import type { ClinicalSystemId } from "./clinical-system-id";

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
  domains: BlueprintDomainCoverageRow[];
  systems: BlueprintSystemCoverageRow[];
  prioritizedGaps: GapItem[];
  recommendedFirstAdditions: string[];
};

export type ExamBlueprintCoverageReport = {
  generatedAt: string;
  databaseConfigured: boolean;
  notes: string[];
  pathways: PathwayBlueprintReport[];
};
