import {
  formatTimeLimitPhrase,
  type PathwayReadinessConfig,
  type PathwayReadinessPublicCopy,
} from "@/lib/exam-pathways/pathway-readiness-config";

/**
 * Single source for “what we show on CAT setup” rows. Keeps RN/PN/NP/allied wording pathway-driven
 * from {@link readinessConfigForPathway} instead of RN-only hardcoding.
 *
 * ENGINE VS BOARD (must stay honest in UI):
 * - Min/max counts and timers follow `PathwayReadinessConfig` for the learner’s pathway.
 * - Stopping uses NurseNest’s theta/SE + heuristics in `shouldStopAfterAnswer` — not proprietary NCLEX/NP board CAT decision code.
 */
export type CatExamConditionRow = {
  id: string;
  label: string;
  value: string;
  meta?: string;
};

export function catAdaptiveModelLabel(config: PathwayReadinessConfig): string {
  if (config.engineType === "SIMULATION") {
    return "Structured adaptive simulation";
  }
  if (config.mode === "production_ready") {
    return "Computerized adaptive testing (CAT)";
  }
  if (config.mode === "mini_adaptive") {
    return "Short adaptive CAT (reduced budget)";
  }
  if (config.mode === "beta") {
    return "Adaptive CAT (beta)";
  }
  return "Adaptive session";
}

export function catBacktrackingLabel(config: PathwayReadinessConfig): string {
  return config.allowBackNavigation
    ? "Allowed — you may return to change answers before final submit where the runner supports it."
    : "Not allowed — after you submit an item, you cannot return to change it.";
}

export function catDeliveryModeLabel(): string {
  return "One item at a time; submit to advance.";
}

export function catStoppingRulesSummary(config: PathwayReadinessConfig): string {
  if (config.engineType === "SIMULATION") {
    return `Session ends at the simulation maximum (${config.maxQuestions} items), if the timer expires, or if the pool is exhausted — whichever applies first.`;
  }
  return `After at least ${config.minQuestions} scored items, the session may end when practice confidence thresholds are met, when ${config.maxQuestions} items are reached, or when the timer expires — whichever comes first. This uses NurseNest’s practice engine, not a published board stopping function.`;
}

export function catResultSummaryLabel(): string {
  return "End-of-session report with category breakdown and practice pass/fail band (not an official board result).";
}

export function catExamConditionRows(
  config: PathwayReadinessConfig,
  regionalExamLine: string,
): CatExamConditionRow[] {
  const rows: CatExamConditionRow[] = [
    { id: "track", label: "Exam track", value: regionalExamLine },
    {
      id: "model",
      label: "Assessment model",
      value: catAdaptiveModelLabel(config),
    },
    { id: "delivery", label: "Delivery mode", value: catDeliveryModeLabel() },
    {
      id: "min",
      label: "Minimum items",
      value: String(config.minQuestions),
      meta: "Adaptive or streak-based early stop does not apply below this count (timer/max still apply).",
    },
    {
      id: "max",
      label: "Maximum items",
      value: String(config.maxQuestions),
      meta: "Hard cap for this pathway’s session configuration.",
    },
    {
      id: "time",
      label: "Time limit",
      value: formatTimeLimitPhrase(config.timeLimitMinutes),
      meta: `Enforced for this start flow (${config.timeLimitMinutes} min).`,
    },
    { id: "back", label: "Backtracking", value: catBacktrackingLabel(config) },
    {
      id: "stop",
      label: "Stopping / decision logic",
      value: catStoppingRulesSummary(config),
    },
    {
      id: "result",
      label: "Result summary",
      value: catResultSummaryLabel(),
    },
  ];
  return rows;
}

export function catHeroSummaryChips(
  config: PathwayReadinessConfig,
  _publicCopy: PathwayReadinessPublicCopy,
): { id: string; label: string; value: string }[] {
  return [
    { id: "adaptive", label: "Mode", value: catAdaptiveModelLabel(config) },
    { id: "timed", label: "Timer", value: `Yes · ${formatTimeLimitPhrase(config.timeLimitMinutes)}` },
    {
      id: "back",
      label: "Backtracking",
      value: config.allowBackNavigation ? "Allowed" : "Not allowed",
    },
    {
      id: "range",
      label: "Item range",
      value:
        config.minQuestions === config.maxQuestions
          ? `${config.minQuestions}`
          : `${config.minQuestions}–${config.maxQuestions}`,
    },
  ];
}

export function catAfterSessionPoints(): string[] {
  return [
    "Immediate session summary with ability estimate and practice pass/fail band.",
    "Blueprint-style category breakdown so you see where performance concentrated.",
    "Actionable links back to lessons, flashcards, and the question bank on this pathway.",
  ];
}

export function catHowItWorksIntro(publicCopy: PathwayReadinessPublicCopy): string {
  if (publicCopy.strongSimulationClaim) {
    return "Briefing: this is the closest timed, linear adaptive delivery we offer for your track — treat it like a sitting.";
  }
  if (publicCopy.effectiveMode === "mini_adaptive") {
    return "Briefing: a reduced-length adaptive run to stress-test pacing and topic mix before a full session.";
  }
  if (publicCopy.effectiveMode === "simulation") {
    return "Briefing: scenario-weighted adaptive simulation for this pathway’s practice specification.";
  }
  return "Briefing: beta adaptive session — validate readiness against lessons and bank practice first.";
}
