import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
export type PathwayReadinessType = "CAT" | "SIMULATION";
export type PathwayReadinessMode = "production_ready" | "beta" | "mini_adaptive" | "simulation";

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

export type PathwayReadinessPublicCopy = {
  effectiveMode: PathwayReadinessMode;
  title: string;
  subtitle: string;
  strongSimulationClaim: boolean;
  betaLabel: string | null;
  experienceLabel: string;
};

const PATHWAY_READINESS_OVERRIDES: Record<string, Omit<PathwayReadinessConfig, "label" | "questionRange" | "timeEstimate">> = {
  "ca-rpn-rex-pn": {
    engineType: "CAT",
    mode: "production_ready",
    minQuestions: 90,
    maxQuestions: 145,
    timeLimitMinutes: 240,
    passingThreshold: 0.15,
    allowBackNavigation: false,
  },
  "us-lpn-nclex-pn": {
    engineType: "CAT",
    mode: "production_ready",
    minQuestions: 85,
    maxQuestions: 145,
    timeLimitMinutes: 300,
    passingThreshold: 0.12,
    allowBackNavigation: false,
  },
  "ca-rn-nclex-rn": {
    engineType: "CAT",
    mode: "production_ready",
    minQuestions: 85,
    maxQuestions: 145,
    timeLimitMinutes: 300,
    passingThreshold: 0.12,
    allowBackNavigation: false,
  },
  "us-rn-nclex-rn": {
    engineType: "CAT",
    mode: "production_ready",
    minQuestions: 85,
    maxQuestions: 145,
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
    mode: "mini_adaptive",
    minQuestions: 60,
    maxQuestions: 120,
    timeLimitMinutes: 180,
    passingThreshold: 0.1,
    allowBackNavigation: false,
  },
  "us-np-agpcnp": {
    engineType: "CAT",
    mode: "mini_adaptive",
    minQuestions: 60,
    maxQuestions: 120,
    timeLimitMinutes: 180,
    passingThreshold: 0.1,
    allowBackNavigation: false,
  },
  "us-np-pmhnp": {
    engineType: "CAT",
    mode: "mini_adaptive",
    minQuestions: 60,
    maxQuestions: 120,
    timeLimitMinutes: 180,
    passingThreshold: 0.1,
    allowBackNavigation: false,
  },
  "us-np-whnp": {
    engineType: "CAT",
    mode: "mini_adaptive",
    minQuestions: 60,
    maxQuestions: 120,
    timeLimitMinutes: 180,
    passingThreshold: 0.1,
    allowBackNavigation: false,
  },
  "us-np-pnp-pc": {
    engineType: "CAT",
    mode: "mini_adaptive",
    minQuestions: 60,
    maxQuestions: 120,
    timeLimitMinutes: 180,
    passingThreshold: 0.1,
    allowBackNavigation: false,
  },
  "ca-allied-core": {
    engineType: "SIMULATION",
    mode: "simulation",
    minQuestions: 60,
    maxQuestions: 120,
    timeLimitMinutes: 180,
    passingThreshold: 0.08,
    allowBackNavigation: false,
  },
  "us-allied-core": {
    engineType: "SIMULATION",
    mode: "simulation",
    minQuestions: 60,
    maxQuestions: 120,
    timeLimitMinutes: 180,
    passingThreshold: 0.08,
    allowBackNavigation: false,
  },
};

export function readinessConfigForPathway(pathway: Pick<ExamPathwayDefinition, "id" | "shortName" | "roleTrack">): PathwayReadinessConfig {
  const override = PATHWAY_READINESS_OVERRIDES[pathway.id];
  const questionRangeLabel = (base: Omit<PathwayReadinessConfig, "label" | "questionRange" | "timeEstimate">): string => {
    if (base.engineType === "CAT") {
      return "Up to 15 adaptive questions";
    }
    if (base.mode === "mini_adaptive") {
      return base.maxQuestions <= 50
        ? `Up to ${base.maxQuestions} adaptive questions`
        : `${base.minQuestions}-${base.maxQuestions} adaptive questions`;
    }
    return `${base.minQuestions}-${base.maxQuestions} questions`;
  };
  const timeEstimateLabel = (base: Omit<PathwayReadinessConfig, "label" | "questionRange" | "timeEstimate">): string => {
    if (base.engineType === "CAT") {
      return "~15-25m";
    }
    const h = Math.floor(base.timeLimitMinutes / 60);
    const m = base.timeLimitMinutes % 60;
    if (base.mode === "mini_adaptive") {
      return h > 0 ? `~${h}h ${m > 0 ? `${m}m` : ""}`.trim() : `~${base.timeLimitMinutes}m`;
    }
    return h > 0 ? `Up to ${h}h${m > 0 ? ` ${m}m` : ""}` : `Up to ${base.timeLimitMinutes}m`;
  };
  const withDisplay = (base: Omit<PathwayReadinessConfig, "label" | "questionRange" | "timeEstimate">): PathwayReadinessConfig => ({
    label: pathway.shortName,
    ...base,
    questionRange: questionRangeLabel(base),
    timeEstimate: timeEstimateLabel(base),
  });
  if (override) {
    return withDisplay(override);
  }
  return withDisplay({
    engineType: pathway.roleTrack === "allied" ? "SIMULATION" : "CAT",
    mode: pathway.roleTrack === "allied" ? "simulation" : "mini_adaptive",
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

export function publicCopyForReadinessConfig(config: PathwayReadinessConfig): PathwayReadinessPublicCopy {
  const effectiveMode: PathwayReadinessMode =
    config.engineType === "CAT" && config.mode === "production_ready" && config.maxQuestions < 85
      ? "mini_adaptive"
      : config.mode;

  if (effectiveMode === "production_ready" && config.engineType === "CAT") {
    return {
      effectiveMode,
      title: `${config.label} Readiness Exam`,
      subtitle: "Exam-style CAT simulation aligned to pathway rules and passing threshold.",
      strongSimulationClaim: true,
      betaLabel: null,
      experienceLabel: "Full exam-style adaptive flow with no backtracking.",
    };
  }
  if (effectiveMode === "mini_adaptive" && config.engineType === "CAT") {
    return {
      effectiveMode,
      title: `${config.label} Mini Adaptive Assessment`,
      subtitle: "Short adaptive assessment for progress checks. This is not a full exam simulation.",
      strongSimulationClaim: false,
      betaLabel: null,
      experienceLabel: "Short adaptive practice flow calibrated to pathway topics.",
    };
  }
  if (effectiveMode === "simulation") {
    return {
      effectiveMode,
      title: `${config.label} Readiness Simulation`,
      subtitle: "Structured readiness simulation focused on exam-relevant scenarios.",
      strongSimulationClaim: false,
      betaLabel: null,
      experienceLabel: "Scenario-based readiness simulation with timed progression.",
    };
  }
  return {
    effectiveMode: "beta",
    title: `${config.label} Adaptive Practice Assessment`,
    subtitle: "Beta adaptive readiness check. Use with lessons and question practice before high-stakes testing.",
    strongSimulationClaim: false,
    betaLabel: "Beta",
    experienceLabel: "Adaptive practice flow in active beta.",
  };
}
