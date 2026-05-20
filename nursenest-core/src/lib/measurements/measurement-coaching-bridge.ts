/**
 * Bridges measurement semantics → RN coaching / remediation orchestration.
 */
import type { MeasurementCategory } from "@/lib/measurements/measurement-domain";
import { linkMeasurementToCompetencyGraph } from "@/lib/measurements/measurement-semantic-layer";
import {
  cognitiveComplexityForSemantics,
  resolveEducationalSemantics,
  scoreRemediationPriority,
  type CognitiveComplexity,
} from "@/lib/measurements/measurement-educational-semantics";
import { analyzeTrendSeriesV3 } from "@/lib/measurements/measurement-trend-intelligence";
import { getPathwayMeasurementPolicy } from "@/lib/measurements/pathway-measurement-policy";
import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";

export type MeasurementCoachingSignal = {
  topicKeys: string[];
  remediationPriority: number;
  cognitiveComplexity: CognitiveComplexity;
  weaknessPattern:
    | "interpretation_failure"
    | "critical_lab_hesitation"
    | "trend_recognition"
    | "unsafe_prioritization"
    | "monitoring_omission"
    | null;
  coachingNarrative: string;
  competencyStabilizationScore: number;
  interventionConfidence: number;
};

export type MeasurementRemediationBundle = {
  signal: MeasurementCoachingSignal;
  effectivePriority: number;
  topicSlug: string;
  suppressDuplicateCta: boolean;
  fatigueSuppressed: boolean;
  reassessmentRecommended: boolean;
  graphTopicKeys: string[];
};

const EXPOSURE_DEDUPE_WINDOW_HOURS = 36;

export function deriveMeasurementCoachingSignals(args: {
  category: MeasurementCategory;
  kind?: string;
  valueSi: number;
  trendValuesSi?: number[];
  pathwayId?: string | null;
  countryCode?: string | null;
  learnerFlags?: {
    repeatedInterpretationFailures?: boolean;
    criticalLabHesitationMs?: number;
    missedTrendQuestions?: number;
  };
}): MeasurementCoachingSignal {
  const policy = getPathwayMeasurementPolicy(args.pathwayId, args.countryCode);
  const semantics = resolveEducationalSemantics({
    category: args.category,
    kind: args.kind,
    valueSi: args.valueSi,
    measurementContext: policy.measurementContext,
    instructionalSystem: policy.instructionalSystem,
  });
  const entity = linkMeasurementToCompetencyGraph({
    category: args.category,
    kind: args.kind,
    severity: semantics.severity,
  });
  const trend =
    args.trendValuesSi && args.trendValuesSi.length >= 2
      ? analyzeTrendSeriesV3({
          category: args.category,
          valuesSi: args.trendValuesSi,
          kind: args.kind,
        })
      : null;

  let weaknessPattern: MeasurementCoachingSignal["weaknessPattern"] = null;
  if (args.learnerFlags?.repeatedInterpretationFailures) {
    weaknessPattern = "interpretation_failure";
  } else if ((args.learnerFlags?.criticalLabHesitationMs ?? 0) > 45_000) {
    weaknessPattern = "critical_lab_hesitation";
  } else if ((args.learnerFlags?.missedTrendQuestions ?? 0) >= 2) {
    weaknessPattern = "trend_recognition";
  } else if (semantics.severity === "critical" && !semantics.prioritizationHint) {
    weaknessPattern = "unsafe_prioritization";
  } else if (trend?.trajectory === "worsening" && !trend.monitoringCue) {
    weaknessPattern = "monitoring_omission";
  }

  const remediationPriority = Math.max(
    entity.remediationPriority,
    scoreRemediationPriority(semantics),
    trend?.monitoringUrgencyScore ?? trend?.priorityScore ?? 0,
  );

  const competencyStabilizationScore = Math.min(
    100,
    remediationPriority * 0.6 + (semantics.criticalValueSignificance ? 20 : 0),
  );
  const interventionConfidence = Math.min(
    1,
    0.45 + (trend?.trajectoryConfidence ?? 0.5) * 0.4 + (semantics.bedsideUrgency ? 0.1 : 0),
  );

  return {
    topicKeys: entity.competencyTopicKeys,
    remediationPriority,
    cognitiveComplexity: cognitiveComplexityForSemantics(semantics),
    weaknessPattern,
    coachingNarrative: buildCoachingNarrative({
      semantics,
      trend,
      weaknessPattern,
      entityTopicKeys: entity.competencyTopicKeys,
    }),
    competencyStabilizationScore,
    interventionConfidence,
  };
}

export function deriveMeasurementRemediationBundle(args: {
  category: MeasurementCategory;
  kind?: string;
  valueSi: number;
  trendValuesSi?: number[];
  pathwayId?: string | null;
  countryCode?: string | null;
  learnerState?: RnLearnerStateSnapshot | null;
  fatigueScore?: number;
  recentExposureKeys?: ReadonlySet<string>;
}): MeasurementRemediationBundle {
  const signal = deriveMeasurementCoachingSignals({
    category: args.category,
    kind: args.kind,
    valueSi: args.valueSi,
    trendValuesSi: args.trendValuesSi,
    pathwayId: args.pathwayId,
    countryCode: args.countryCode,
    learnerFlags: args.learnerState
      ? {
          repeatedInterpretationFailures: args.learnerState.reasoningPatterns.includes(
            "lab_trend_reasoning_gap" as never,
          ),
          criticalLabHesitationMs:
            args.learnerState.hesitationProfile === "high" ? 50_000 : undefined,
          missedTrendQuestions: args.learnerState.measurementWeaknesses.length >= 2 ? 2 : 0,
        }
      : undefined,
  });

  const topicSlug = signal.topicKeys[0]?.replace(/_/g, "-") ?? "electrolytes";
  const exposureKey = `${topicSlug}::measurement::${args.category}`;
  const fatigue = args.fatigueScore ?? args.learnerState?.remediationFatigueScore ?? 0;
  const fatigueSuppressed = fatigue >= 0.75;
  const suppressDuplicateCta = args.recentExposureKeys?.has(exposureKey) ?? false;

  let effectivePriority = signal.remediationPriority;
  if (fatigueSuppressed) effectivePriority = Math.round(effectivePriority * 0.7);
  if (suppressDuplicateCta) effectivePriority = Math.round(effectivePriority * 0.5);

  const reassessmentRecommended =
    signal.weaknessPattern === "trend_recognition" ||
    (args.trendValuesSi?.length ?? 0) >= 3;

  return {
    signal,
    effectivePriority,
    topicSlug,
    suppressDuplicateCta,
    fatigueSuppressed,
    reassessmentRecommended,
    graphTopicKeys: signal.topicKeys,
  };
}

export function shouldEmitMeasurementRemediation(args: {
  bundle: MeasurementRemediationBundle;
  minPriority?: number;
}): boolean {
  const min = args.minPriority ?? 55;
  if (args.bundle.fatigueSuppressed && args.bundle.effectivePriority < 80) return false;
  if (args.bundle.suppressDuplicateCta) return false;
  return args.bundle.effectivePriority >= min;
}

function buildCoachingNarrative(args: {
  semantics: ReturnType<typeof resolveEducationalSemantics>;
  trend: ReturnType<typeof analyzeTrendSeriesV3> | null;
  weaknessPattern: MeasurementCoachingSignal["weaknessPattern"];
  entityTopicKeys: string[];
}): string {
  const parts: string[] = [];
  if (args.weaknessPattern === "trend_recognition" && args.trend?.coachingCue) {
    parts.push(args.trend.coachingCue);
  } else if (args.semantics.interpretationHint) {
    parts.push(args.semantics.interpretationHint);
  }
  if (args.weaknessPattern === "critical_lab_hesitation") {
    parts.push("Practice rapid critical-value frameworks before numeric conversion drills.");
  }
  if (args.entityTopicKeys.length > 0) {
    parts.push(`Linked competency focus: ${args.entityTopicKeys.slice(0, 3).join(", ")}.`);
  }
  return parts.join(" ") || "Review measurement in clinical context with serial trends.";
}

export { EXPOSURE_DEDUPE_WINDOW_HOURS };
