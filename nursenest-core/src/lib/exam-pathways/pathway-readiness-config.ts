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

export function formatTimeLimitPhrase(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h} h ${m} min`;
  if (h > 0) return `${h} h`;
  return `${minutes} min`;
}

export function readinessConfigForPathway(pathway: { id: string; shortName: string; roleTrack: string }): PathwayReadinessConfig {
  const override = PATHWAY_READINESS_OVERRIDES[pathway.id];
  const questionRangeLabel = (base: Omit<PathwayReadinessConfig, "label" | "questionRange" | "timeEstimate">): string => {
    if (base.engineType === "CAT") {
      if (base.minQuestions === base.maxQuestions) {
        return `${base.minQuestions} items (fixed length)`;
      }
      return `${base.minQuestions}–${base.maxQuestions} items (adaptive length within this band)`;
    }
    if (base.mode === "mini_adaptive") {
      return base.maxQuestions <= 50
        ? `Up to ${base.maxQuestions} adaptive questions`
        : `${base.minQuestions}–${base.maxQuestions} adaptive questions`;
    }
    return `${base.minQuestions}–${base.maxQuestions} questions`;
  };
  const timeEstimateLabel = (base: Omit<PathwayReadinessConfig, "label" | "questionRange" | "timeEstimate">): string => {
    if (base.engineType === "CAT") {
      return formatTimeLimitPhrase(base.timeLimitMinutes);
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

export async function readinessConfigForPathwayId(pathwayId: string | null | undefined): Promise<PathwayReadinessConfig | null> {
  const id = pathwayId?.trim();
  if (!id) return null;
  const { getExamPathwayById } = await import("@/lib/exam-pathways/exam-product-registry");
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
      /** Product-facing name for CAT surfaces — not “readiness exam” (reserved for report-card / readiness analytics). */
      title: `Adaptive exam simulation · ${config.label}`,
      subtitle:
        "One item at a time, timed, with pathway min/max counts and no backtracking. NurseNest practice ability estimates and stopping rules are not official board algorithms or outcomes.",
      strongSimulationClaim: true,
      betaLabel: null,
      experienceLabel: "Full-length adaptive session: timer enforced, no return to prior items after submit.",
    };
  }
  if (effectiveMode === "mini_adaptive" && config.engineType === "CAT") {
    return {
      effectiveMode,
      title: `Short adaptive session · ${config.label}`,
      subtitle:
        "Shorter adaptive run for calibration between full sessions. Same delivery pattern as CAT, with a reduced item budget.",
      strongSimulationClaim: false,
      betaLabel: null,
      experienceLabel: "Reduced item budget; timed; no backtracking unless explicitly enabled for the pathway.",
    };
  }
  if (effectiveMode === "simulation") {
    return {
      effectiveMode,
      title: `Adaptive simulation · ${config.label}`,
      subtitle:
        "Structured scenario-weighted simulation with timed progression. This track uses simulation rules rather than a full board CAT specification.",
      strongSimulationClaim: false,
      betaLabel: null,
      experienceLabel: "Scenario-based adaptive simulation with timed progression.",
    };
  }
  return {
    effectiveMode: "beta",
    title: `Adaptive CAT (beta) · ${config.label}`,
    subtitle:
      "Beta adaptive session: rules and pool coverage may change. Pair with lessons and targeted question practice before high-stakes testing.",
    strongSimulationClaim: false,
    betaLabel: "Beta",
    experienceLabel: "Adaptive practice flow in active beta.",
  };
}
