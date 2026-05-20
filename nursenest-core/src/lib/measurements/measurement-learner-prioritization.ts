/**
 * Learner-state-aware measurement interpretation prioritization.
 */
import type { MeasurementCategory } from "@/lib/measurements/measurement-domain";
import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import type { ExtendedClinicalJudgmentPattern } from "@/lib/learner/rn-coaching-intelligence/rn-reasoning-ontology";
import { deriveMeasurementCoachingSignals } from "@/lib/measurements/measurement-coaching-bridge";

export type MeasurementPriorityItem = {
  category: MeasurementCategory;
  kind?: string;
  valueSi: number;
  trendValuesSi?: number[];
  priorityScore: number;
  learnerStateReason: string;
  weaknessPattern: string | null;
  measurementTags: string[];
};

const PATTERN_BOOST: Partial<Record<ExtendedClinicalJudgmentPattern, number>> = {
  trend_recognition_failure: 22,
  lab_trend_reasoning_gap: 20,
  unstable_patient_miss: 18,
  monitoring_gap: 16,
  escalation_hesitation: 14,
  intervention_sequencing_error: 12,
};

export function scoreMeasurementWeaknessFromLearnerState(
  state: RnLearnerStateSnapshot | null | undefined,
): number {
  if (!state) return 0;
  let score = 0;
  if (state.measurementWeaknesses.length > 0) score += 25;
  if (state.hesitationProfile === "high") score += 15;
  if (state.remediationFatigueScore >= 0.7) score -= 10;
  for (const p of state.reasoningPatterns) {
    score += PATTERN_BOOST[p as ExtendedClinicalJudgmentPattern] ?? 0;
  }
  for (const c of state.competencyStates) {
    if (!c.persistentWeak) continue;
    if (
      c.competencyId === "fluid_electrolyte_balance" ||
      c.competencyId === "acid_base_gas_exchange" ||
      c.competencyId === "endocrine_metabolic" ||
      c.competencyId === "perfusion_hemodynamics"
    ) {
      score += Math.max(0, 80 - c.masteryScore) * 0.2;
    }
  }
  return Math.min(100, Math.max(0, score));
}

export function prioritizeMeasurementInterpretations(args: {
  items: Array<{
    category: MeasurementCategory;
    kind?: string;
    valueSi: number;
    trendValuesSi?: number[];
  }>;
  learnerState?: RnLearnerStateSnapshot | null;
  pathwayId?: string | null;
  countryCode?: string | null;
  authenticated?: boolean;
}): MeasurementPriorityItem[] {
  const authenticated = args.authenticated ?? false;
  const baseStateBoost = scoreMeasurementWeaknessFromLearnerState(args.learnerState);

  const scored = args.items.map((item) => {
    const signal = deriveMeasurementCoachingSignals({
      category: item.category,
      kind: item.kind,
      valueSi: item.valueSi,
      trendValuesSi: item.trendValuesSi,
      pathwayId: args.pathwayId,
      countryCode: args.countryCode,
      learnerFlags: authenticated
        ? {
            repeatedInterpretationFailures: args.learnerState?.reasoningPatterns.includes(
              "lab_trend_reasoning_gap" as never,
            ),
            criticalLabHesitationMs:
              args.learnerState?.hesitationProfile === "high" ? 50_000 : undefined,
            missedTrendQuestions: args.learnerState?.measurementWeaknesses.some((t) =>
              t.includes("trend"),
            )
              ? 2
              : 0,
          }
        : undefined,
    });

    let priorityScore = signal.remediationPriority;
    if (authenticated) priorityScore += baseStateBoost * 0.35;
    else priorityScore = Math.min(priorityScore, 65);

    const learnerStateReason = signal.weaknessPattern
      ? `Learner pattern: ${signal.weaknessPattern}`
      : authenticated && baseStateBoost > 40
        ? "Elevated measurement interpretation focus from recent sessions"
        : "Editorial interpretation depth";

    return {
      ...item,
      priorityScore: Math.min(100, Math.round(priorityScore)),
      learnerStateReason,
      weaknessPattern: signal.weaknessPattern,
      measurementTags: signal.topicKeys,
    };
  });

  return scored.sort((a, b) => b.priorityScore - a.priorityScore);
}

/** Public/marketing ordering — competency-first, bounded depth. */
export function orderMeasurementsEditorial(
  items: MeasurementPriorityItem[],
  maxItems = 5,
): MeasurementPriorityItem[] {
  return [...items]
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, maxItems);
}
