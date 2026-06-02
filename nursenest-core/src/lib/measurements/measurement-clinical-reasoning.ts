/**
 * RN clinical reasoning overlays for governed measurements (educational, not diagnostic).
 */
import type { AuthoredMeasurement, MeasurementCategory } from "@/lib/measurements/measurement-domain";
import {
  resolveEducationalSemantics,
  type MeasurementEducationalSemantics,
} from "@/lib/measurements/measurement-educational-semantics";
import { getPathwayMeasurementPolicy } from "@/lib/measurements/pathway-measurement-policy";
import type { ClinicalMeasurementRenderResult } from "@/lib/measurements/measurement-domain";

export type ClinicalReasoningFrame =
  | "bedside_interpretation"
  | "prioritization"
  | "trend_recognition"
  | "instability"
  | "intervention"
  | "rn_judgment";

export type MeasurementClinicalReasoning = {
  frames: ClinicalReasoningFrame[];
  summary: string;
  escalationCue: string | null;
  monitoringCue: string | null;
  nclexCue: string | null;
  semantics: MeasurementEducationalSemantics;
};

export function buildMeasurementClinicalReasoning(args: {
  measurement: AuthoredMeasurement;
  render: ClinicalMeasurementRenderResult;
  pathwayId?: string | null;
  countryCode?: string | null;
}): MeasurementClinicalReasoning {
  const policy = getPathwayMeasurementPolicy(args.pathwayId, args.countryCode);
  const semantics = resolveEducationalSemantics({
    category: args.measurement.category,
    kind: args.measurement.kind,
    valueSi: args.measurement.valueSi,
    lowSi: args.measurement.lowSi,
    highSi: args.measurement.highSi,
    measurementContext: policy.measurementContext,
    instructionalSystem: policy.instructionalSystem,
  });

  const frames: ClinicalReasoningFrame[] = ["bedside_interpretation"];
  if (semantics.bedsideUrgency) frames.push("prioritization", "instability");
  if (semantics.trendImportant) frames.push("trend_recognition");
  if (semantics.medicationMonitoringRelevance) frames.push("intervention");
  frames.push("rn_judgment");

  const display = args.render.displayPrimary;
  const summary = buildSummary(args.measurement.category, display, semantics);
  const escalationCue =
    semantics.severity === "critical" || semantics.severity === "urgent"
      ? semantics.safetyAlert ?? semantics.prioritizationHint
      : null;
  const monitoringCue = semantics.medicationMonitoringRelevance
    ? "Reassess after intervention per protocol; document trend not only isolated value."
    : semantics.trendImportant
      ? "Trend direction often matters more than a single isolated value."
      : null;
  const nclexCue = semantics.nclexRelevance
    ? policy.measurementContext === "us"
      ? "NCLEX items may frame this value with conventional units — separate recognition from conversion shortcuts."
      : "Licensure scenarios expect SI lab framing; compare safely when reviewing US-source rationales."
    : null;

  return {
    frames,
    summary,
    escalationCue,
    monitoringCue,
    nclexCue,
    semantics,
  };
}

function buildSummary(
  category: MeasurementCategory,
  display: string,
  semantics: MeasurementEducationalSemantics,
): string {
  if (category === "electrolytes" && semantics.severity === "urgent") {
    return `${display} suggests electrolyte imbalance requiring focused assessment and ECG review when indicated.`;
  }
  if (category === "glucose" && semantics.severity === "urgent") {
    return `${display} warrants immediate neurologic and perfusion assessment with protocol-driven treatment.`;
  }
  if (category === "abg") {
    return `${display} should be interpreted as an acid-base pattern, not as an isolated number.`;
  }
  if (semantics.interpretationHint) return `${display} — ${semantics.interpretationHint}`;
  return `${display} — interpret within clinical context and trend.`;
}

/** Trend pair reasoning (educational). */
export function buildTrendClinicalReasoning(args: {
  category: MeasurementCategory;
  priorValueSi: number;
  currentValueSi: number;
  pathwayId?: string | null;
}): string {
  const delta = args.currentValueSi - args.priorValueSi;
  const direction = delta > 0 ? "rising" : delta < 0 ? "falling" : "stable";
  if (args.category === "electrolytes" && args.currentValueSi >= 5.5 && direction === "rising") {
    return "Rising potassium trend increases cardiac risk even before critical thresholds.";
  }
  if (args.category === "glucose" && direction === "falling") {
    return "Falling glucose trend may precede symptomatic hypoglycemia — verify intake, insulin, and sepsis context.";
  }
  return `Measurement is ${direction} — prioritize trend interpretation over a single data point.`;
}
