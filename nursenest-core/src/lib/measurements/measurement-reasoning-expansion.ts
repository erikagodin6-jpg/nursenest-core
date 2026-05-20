/**
 * Expands measurement interpretation into full bedside cognition pathways.
 */
import type { ClinicalReasoningRelation } from "@/lib/educational-graph/rn-competency-ontology";
import type { AuthoredMeasurement, MeasurementCategory } from "@/lib/measurements/measurement-domain";
import {
  buildMeasurementClinicalReasoning,
  type ClinicalReasoningFrame,
} from "@/lib/measurements/measurement-clinical-reasoning";
import { convertClinicalMeasurement } from "@/lib/measurements/convert-clinical-measurement";
import type { InterpretationDomain } from "@/lib/measurements/measurement-interpretation-engine";
import { resolveInterpretationDomain } from "@/lib/measurements/measurement-interpretation-engine";
import {
  RN_REASONING_ONTOLOGY,
  type ExtendedClinicalJudgmentPattern,
} from "@/lib/learner/rn-coaching-intelligence/rn-reasoning-ontology";
import { analyzeTrendSeriesV3 } from "@/lib/measurements/measurement-trend-intelligence";

export type BedsideCognitionPathway = {
  domain: InterpretationDomain;
  frames: ClinicalReasoningFrame[];
  reasoningRelations: ClinicalReasoningRelation[];
  summary: string;
  escalationSequence: string[];
  interventionSequence: string[];
  monitoringSequence: string[];
  delegationNotes: string[];
  sataCue: string | null;
  relatedPatterns: ExtendedClinicalJudgmentPattern[];
};

const DOMAIN_RELATIONS: Record<InterpretationDomain, ClinicalReasoningRelation[]> = {
  electrolyte: [
    "lab_abnormality_to_prioritization",
    "assessment_to_intervention",
    "intervention_to_monitoring",
    "instability_to_escalation",
  ],
  acid_base: [
    "symptom_to_mechanism",
    "mechanism_to_assessment",
    "assessment_to_intervention",
    "intervention_to_monitoring",
  ],
  renal: ["lab_abnormality_to_prioritization", "intervention_to_monitoring", "instability_to_escalation"],
  sepsis: ["instability_to_escalation", "lab_abnormality_to_prioritization", "intervention_to_monitoring"],
  glucose: [
    "lab_abnormality_to_prioritization",
    "medication_to_safety_risk",
    "intervention_to_monitoring",
  ],
  hemodynamic: ["instability_to_escalation", "assessment_to_intervention", "intervention_to_monitoring"],
  oxygenation: ["symptom_to_mechanism", "assessment_to_intervention", "intervention_to_monitoring"],
  pharmacology_monitoring: ["medication_to_safety_risk", "intervention_to_monitoring", "disease_to_delegation_risk"],
  general: ["lab_abnormality_to_prioritization", "intervention_to_monitoring"],
};

export function expandBedsideCognitionPathway(args: {
  measurement: AuthoredMeasurement;
  renderedSystem: import("@/lib/measurements/measurement-domain").ClinicalMeasurementSystem;
  pathwayId?: string | null;
  countryCode?: string | null;
  trendValuesSi?: number[];
}): BedsideCognitionPathway {
  const render = convertClinicalMeasurement({
    valueSi: args.measurement.valueSi,
    category: args.measurement.category,
    kind: args.measurement.kind,
    authoredSystem: args.measurement.authoredSystem,
    renderedSystem: args.renderedSystem,
    options: { showEducationalEquivalent: false },
  });
  const reasoning = buildMeasurementClinicalReasoning({
    measurement: args.measurement,
    render,
    pathwayId: args.pathwayId,
    countryCode: args.countryCode,
  });
  const domain = resolveInterpretationDomain(args.measurement.category, args.measurement.kind);
  const trend =
    args.trendValuesSi && args.trendValuesSi.length >= 2
      ? analyzeTrendSeriesV3({
          category: args.measurement.category,
          valuesSi: args.trendValuesSi,
          kind: args.measurement.kind,
        })
      : null;

  const escalationSequence: string[] = [];
  if (reasoning.escalationCue) escalationSequence.push(reasoning.escalationCue);
  if (trend?.escalationCue) escalationSequence.push(trend.escalationCue);

  const interventionSequence: string[] = [];
  if (reasoning.semantics.prioritizationHint) interventionSequence.push(reasoning.semantics.prioritizationHint);
  if (trend?.interventionResponseCue) interventionSequence.push(trend.interventionResponseCue);

  const monitoringSequence: string[] = [];
  if (reasoning.monitoringCue) monitoringSequence.push(reasoning.monitoringCue);
  if (trend?.monitoringCue) monitoringSequence.push(trend.monitoringCue);
  if (trend?.reassessmentIntervalMinutes != null) {
    monitoringSequence.push(
      `Educational reassessment window: recheck within ${trend.reassessmentIntervalMinutes} minutes per protocol.`,
    );
  }

  const delegationNotes: string[] = [];
  if (reasoning.semantics.delegationImplication) {
    delegationNotes.push("RN retains assessment and escalation for unstable trends.");
  }

  const relatedPatterns = RN_REASONING_ONTOLOGY.filter((d) =>
    d.measurementTags?.some((t) => tagMatchesCategory(t, args.measurement.category, args.measurement.kind)),
  ).map((d) => d.pattern);

  const sataCue =
    reasoning.frames.includes("prioritization") || reasoning.frames.includes("instability")
      ? "Evaluate each nursing action independently — stabilization and monitoring before lower-priority tasks."
      : null;

  return {
    domain,
    frames: reasoning.frames,
    reasoningRelations: DOMAIN_RELATIONS[domain],
    summary: trend?.summary ?? reasoning.summary,
    escalationSequence,
    interventionSequence,
    monitoringSequence,
    delegationNotes,
    sataCue,
    relatedPatterns,
  };
}

function tagMatchesCategory(tag: string, category: MeasurementCategory, kind?: string): boolean {
  const t = tag.toLowerCase();
  if (category === "glucose" && t.includes("glucose")) return true;
  if (category === "abg" && t.includes("abg")) return true;
  if (category === "electrolytes" && (t.includes("potassium") || t.includes("electrolyte"))) {
    return !kind || t.includes(kind);
  }
  if (category === "hemodynamics" && t.includes("perfusion")) return true;
  if (category === "drug_dosage" && t.includes("medication")) return true;
  return false;
}
