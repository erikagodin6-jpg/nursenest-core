import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
export type PathwayReadinessType = "CAT" | "SIMULATION";
export type PathwayReadinessMode = "production_ready" | "beta" | "unavailable";

export type PathwayReadinessConfig = {
  label: string;
  engineType: PathwayReadinessType;
  mode: PathwayReadinessMode;
  minQuestions: number;
  maxQuestions: number;
  timeLimitMinutes: number;
  passingThreshold: number;
  allowBackNavigation: boolean;
  questionRange: string;
  timeEstimate: string;
};

const PATHWAY_READINESS_OVERRIDES: Record<string, Omit<PathwayReadinessConfig, "label" | "questionRange" | "timeEstimate">> = {
  "ca-rpn-rex-pn": {
    engineType: "CAT",
    mode: "production_ready",
    minQuestions: 90,
    maxQuestions: 150,
    timeLimitMinutes: 240,
    passingThreshold: 0.15,
    allowBackNavigation: false,
  },
  "us-lpn-nclex-pn": {
    engineType: "CAT",
    mode: "production_ready",
    minQuestions: 85,
    maxQuestions: 150,
    timeLimitMinutes: 300,
    passingThreshold: 0.12,
    allowBackNavigation: false,
  },
  "ca-rn-nclex-rn": {
    engineType: "CAT",
    mode: "production_ready",
    minQuestions: 85,
    maxQuestions: 150,
    timeLimitMinutes: 300,
    passingThreshold: 0.12,
    allowBackNavigation: false,
  },
  "us-rn-nclex-rn": {
    engineType: "CAT",
    mode: "production_ready",
    minQuestions: 85,
    maxQuestions: 150,
    timeLimitMinutes: 300,
    passingThreshold: 0.12,
    allowBackNavigation: false,
  },
  "ca-np-cnple": {
    engineType: "CAT",
    mode: "beta",
    minQuestions: 75,
    maxQuestions: 150,
    timeLimitMinutes: 240,
    passingThreshold: 0.1,
    allowBackNavigation: false,
  },
  "us-np-fnp": {
    engineType: "CAT",
    mode: "beta",
    minQuestions: 75,
    maxQuestions: 150,
    timeLimitMinutes: 180,
    passingThreshold: 0.1,
    allowBackNavigation: false,
  },
  "us-np-agpcnp": {
    engineType: "CAT",
    mode: "beta",
    minQuestions: 75,
    maxQuestions: 150,
    timeLimitMinutes: 180,
    passingThreshold: 0.1,
    allowBackNavigation: false,
  },
  "us-np-pmhnp": {
    engineType: "CAT",
    mode: "beta",
    minQuestions: 75,
    maxQuestions: 150,
    timeLimitMinutes: 180,
    passingThreshold: 0.1,
    allowBackNavigation: false,
  },
  "us-np-whnp": {
    engineType: "CAT",
    mode: "beta",
    minQuestions: 75,
    maxQuestions: 150,
    timeLimitMinutes: 180,
    passingThreshold: 0.1,
    allowBackNavigation: false,
  },
  "us-np-pnp-pc": {
    engineType: "CAT",
    mode: "beta",
    minQuestions: 75,
    maxQuestions: 150,
    timeLimitMinutes: 180,
    passingThreshold: 0.1,
    allowBackNavigation: false,
  },
  "ca-allied-core": {
    engineType: "SIMULATION",
    mode: "beta",
    minQuestions: 60,
    maxQuestions: 120,
    timeLimitMinutes: 180,
    passingThreshold: 0.08,
    allowBackNavigation: false,
  },
  "us-allied-core": {
    engineType: "SIMULATION",
    mode: "beta",
    minQuestions: 60,
    maxQuestions: 120,
    timeLimitMinutes: 180,
    passingThreshold: 0.08,
    allowBackNavigation: false,
  },
};

export function readinessConfigForPathway(pathway: Pick<ExamPathwayDefinition, "id" | "shortName" | "roleTrack">): PathwayReadinessConfig {
  const override = PATHWAY_READINESS_OVERRIDES[pathway.id];
  const withDisplay = (base: Omit<PathwayReadinessConfig, "label" | "questionRange" | "timeEstimate">): PathwayReadinessConfig => ({
    label: pathway.shortName,
    ...base,
    questionRange: `${base.minQuestions}-${base.maxQuestions} questions`,
    timeEstimate: `${Math.floor(base.timeLimitMinutes / 60)}h`,
  });
  if (override) {
    return withDisplay(override);
  }
  return withDisplay({
    engineType: pathway.roleTrack === "allied" ? "SIMULATION" : "CAT",
    mode: pathway.roleTrack === "allied" ? "beta" : "production_ready",
    minQuestions: pathway.roleTrack === "allied" ? 60 : 85,
    maxQuestions: pathway.roleTrack === "allied" ? 120 : 150,
    timeLimitMinutes: pathway.roleTrack === "allied" ? 180 : 300,
    passingThreshold: 0.1,
    allowBackNavigation: false,
  });
}

export function readinessConfigForPathwayId(pathwayId: string | null | undefined): PathwayReadinessConfig | null {
  const id = pathwayId?.trim();
  if (!id) return null;
  const pathway = getExamPathwayById(id);
  if (!pathway) return null;
  return readinessConfigForPathway(pathway);
}
