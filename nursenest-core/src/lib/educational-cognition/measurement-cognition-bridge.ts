/**
 * Measurement intelligence slice for educational cognition — graph-aware clinical interpretation.
 */
import {
  categoryToMeasurementKind,
  type MeasurementCategory,
} from "@/lib/measurements/measurement-domain";
import {
  prioritizeMeasurementInterpretations,
  type MeasurementPriorityItem,
} from "@/lib/measurements/measurement-learner-prioritization";
import { buildMeasurementGraphNode } from "@/lib/measurements/measurement-graph-integration";
import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";

export type MeasurementCognitionSlice = {
  priorityItems: MeasurementPriorityItem[];
  topCategory: MeasurementCategory | null;
  measurementPriorityScore: number;
  learnerStateReason: string | null;
  graphRemediationPriority: number;
  interpretationGuideIds: string[];
  bedsideEscalationKinds: string[];
};

const CATEGORY_HINTS: Partial<Record<MeasurementCategory, string[]>> = {
  electrolytes: ["hypokalemia", "hyperkalemia", "hyponatremia"],
  abg: ["respiratory_acidosis", "metabolic_alkalosis"],
  hemodynamics: ["hypotension", "tachycardia"],
  glucose: ["hypoglycemia", "hyperglycemia"],
};

export function buildMeasurementCognitionSlice(
  learnerState: RnLearnerStateSnapshot,
  catalogItems: Array<{
    category: MeasurementCategory;
    kind?: string;
    valueSi: number;
    trendValuesSi?: number[];
  }> = [],
): MeasurementCognitionSlice {
  if (catalogItems.length === 0 && learnerState.measurementWeaknesses.length === 0) {
    return {
      priorityItems: [],
      topCategory: null,
      measurementPriorityScore: 0,
      learnerStateReason: null,
      graphRemediationPriority: 0,
      interpretationGuideIds: [],
      bedsideEscalationKinds: [],
    };
  }

  const items =
    catalogItems.length > 0
      ? catalogItems
      : learnerState.measurementWeaknesses.slice(0, 6).map((tag) => ({
          category: "electrolytes" as MeasurementCategory,
          kind: tag,
          valueSi: 0,
        }));

  const priorityItems = prioritizeMeasurementInterpretations({
    items,
    learnerState,
  });

  const top = priorityItems[0] ?? null;
  const topCategory = top?.category ?? null;

  let graphRemediationPriority = 0;
  let interpretationGuideIds: string[] = [];
  let bedsideEscalationKinds: string[] = [];

  if (topCategory && catalogItems.length > 0) {
    const authored = catalogItems.find((c) => c.category === topCategory);
    if (authored) {
      const kind = categoryToMeasurementKind(authored.category) ?? "sodium";
      const node = buildMeasurementGraphNode({
        measurement: {
          category: authored.category,
          kind,
          valueSi: authored.valueSi,
          authoredSystem: "SI",
        },
        pathwayId: learnerState.pathwayId,
        trendValuesSi: authored.trendValuesSi,
      });
      graphRemediationPriority = node.remediationPriority;
      interpretationGuideIds = node.interpretationGuideIds.slice(0, 6);
      bedsideEscalationKinds = node.reasoningChain
        .filter(
          (r) =>
            r === "instability_to_escalation" ||
            r === "assessment_to_intervention" ||
            r === "lab_abnormality_to_prioritization",
        )
        .slice(0, 4);
    }
  } else if (topCategory) {
    bedsideEscalationKinds = CATEGORY_HINTS[topCategory]?.slice(0, 3) ?? [];
  }

  return {
    priorityItems: priorityItems.slice(0, 8),
    topCategory,
    measurementPriorityScore: top?.priorityScore ?? 0,
    learnerStateReason: top?.learnerStateReason ?? null,
    graphRemediationPriority,
    interpretationGuideIds,
    bedsideEscalationKinds,
  };
}
