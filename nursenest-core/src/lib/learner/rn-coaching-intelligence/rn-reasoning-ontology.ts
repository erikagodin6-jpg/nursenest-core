/**
 * RN clinical reasoning ontology — NCLEX Clinical Judgment Model + NCSBN-aligned patterns.
 */

import type { CatCoachErrorPattern } from "@/lib/practice-tests/cat-results-coach";
import type { ClinicalJudgmentPattern, StructuredClinicalInsight } from "@/lib/learner/rn-coaching-intelligence/coaching-types";
import type { RnCompetencyId } from "@/lib/educational-graph/rn-competency-ontology";

export type NclexCjLayer =
  | "recognize_cues"
  | "analyze_cues"
  | "prioritize_hypotheses"
  | "generate_solutions"
  | "evaluate_outcomes";

/** Extended patterns beyond base coaching types (stored as string union extension via type assertion at boundaries). */
export type ExtendedClinicalJudgmentPattern =
  | ClinicalJudgmentPattern
  | "abc_prioritization_failure"
  | "unstable_patient_miss"
  | "expected_unexpected_confusion"
  | "intervention_sequencing_error"
  | "trend_recognition_failure"
  | "escalation_hesitation"
  | "lab_trend_reasoning_gap";

export type RnReasoningPatternDef = {
  pattern: ExtendedClinicalJudgmentPattern;
  label: string;
  nclexLayer: NclexCjLayer;
  educatorFrame: string;
  relatedCompetencies: readonly RnCompetencyId[];
  measurementTags?: readonly string[];
};

export const RN_REASONING_ONTOLOGY: readonly RnReasoningPatternDef[] = [
  {
    pattern: "unsafe_prioritization",
    label: "Unsafe prioritization",
    nclexLayer: "prioritize_hypotheses",
    educatorFrame: "Stabilization and escalation cues must lead before task-focused or comfort interventions.",
    relatedCompetencies: ["clinical_judgment", "perfusion_hemodynamics", "infection_sepsis"],
  },
  {
    pattern: "abc_prioritization_failure",
    label: "ABC prioritization failure",
    nclexLayer: "prioritize_hypotheses",
    educatorFrame: "Airway, breathing, and circulation threats outrank lower-priority tasks when status is unstable.",
    relatedCompetencies: ["respiratory_instability", "perfusion_hemodynamics"],
  },
  {
    pattern: "unstable_patient_miss",
    label: "Unstable patient recognition gap",
    nclexLayer: "recognize_cues",
    educatorFrame: "Trending vitals, perfusion, and mental status changes signal instability before a single abnormal value.",
    relatedCompetencies: ["perfusion_hemodynamics", "infection_sepsis", "respiratory_instability"],
  },
  {
    pattern: "delayed_escalation",
    label: "Delayed escalation",
    nclexLayer: "generate_solutions",
    educatorFrame: "When the patient deteriorates, escalation timing is as critical as the final intervention.",
    relatedCompetencies: ["clinical_judgment", "infection_sepsis"],
  },
  {
    pattern: "escalation_hesitation",
    label: "Escalation hesitation",
    nclexLayer: "generate_solutions",
    educatorFrame: "Correct choices with slow timing on escalation stems often mean fragile confidence under pressure.",
    relatedCompetencies: ["clinical_judgment"],
  },
  {
    pattern: "task_before_assessment",
    label: "Task before assessment",
    nclexLayer: "analyze_cues",
    educatorFrame: "Complete assessment and monitoring gaps before procedural or comfort interventions.",
    relatedCompetencies: ["clinical_judgment", "pharmacology_safety"],
  },
  {
    pattern: "monitoring_gap",
    label: "Monitoring gap",
    nclexLayer: "evaluate_outcomes",
    educatorFrame: "Pair abnormal findings with what you will reassess next and how often.",
    relatedCompetencies: ["clinical_judgment", "pharmacology_safety"],
  },
  {
    pattern: "delegation_risk",
    label: "Delegation risk",
    nclexLayer: "generate_solutions",
    educatorFrame: "Unstable or assessment-heavy situations usually remain with the licensed nurse.",
    relatedCompetencies: ["delegation_supervision"],
  },
  {
    pattern: "intervention_sequencing_error",
    label: "Intervention sequencing error",
    nclexLayer: "generate_solutions",
    educatorFrame: "Order interventions by physiologic priority — stabilize before educate or document-only actions.",
    relatedCompetencies: ["clinical_judgment", "perfusion_hemodynamics"],
  },
  {
    pattern: "premature_closure",
    label: "Premature closure",
    nclexLayer: "analyze_cues",
    educatorFrame: "Do not lock an answer before weighting the full clinical picture and contraindications.",
    relatedCompetencies: ["clinical_judgment"],
  },
  {
    pattern: "expected_unexpected_confusion",
    label: "Expected vs unexpected finding confusion",
    nclexLayer: "recognize_cues",
    educatorFrame: "Compare findings to what is expected for age, setting, and baseline — then flag urgent deviation.",
    relatedCompetencies: ["maternity_reproductive", "mental_health_psychosocial"],
  },
  {
    pattern: "trend_recognition_failure",
    label: "Trend recognition failure",
    nclexLayer: "analyze_cues",
    educatorFrame: "A single lab value matters less than direction, rate of change, and clinical context.",
    relatedCompetencies: ["fluid_electrolyte_balance", "acid_base_gas_exchange", "endocrine_metabolic"],
    measurementTags: ["electrolyte_trend", "abg_interpretation", "lactate_trend"],
  },
  {
    pattern: "lab_trend_reasoning_gap",
    label: "Lab trend reasoning gap",
    nclexLayer: "analyze_cues",
    educatorFrame: "Interpret trends (K+, glucose, lactate, ABG) before choosing the first nursing action.",
    relatedCompetencies: ["acid_base_gas_exchange", "fluid_electrolyte_balance", "endocrine_metabolic"],
    measurementTags: ["potassium_trend", "abg_interpretation"],
  },
  {
    pattern: "medication_safety_gap",
    label: "Medication safety gap",
    nclexLayer: "generate_solutions",
    educatorFrame: "Re-check contraindications, monitoring, and hold parameters on pharmacology stems.",
    relatedCompetencies: ["pharmacology_safety"],
    measurementTags: ["medication_monitoring"],
  },
  {
    pattern: "hesitant_intervention",
    label: "Hesitant intervention",
    nclexLayer: "generate_solutions",
    educatorFrame: "Knowledge that only appears with unlimited time will not hold on exam day — rehearse under pacing.",
    relatedCompetencies: ["clinical_judgment"],
  },
  {
    pattern: "sata_partial_reasoning",
    label: "SATA partial reasoning",
    nclexLayer: "evaluate_outcomes",
    educatorFrame: "Evaluate each option independently; partial SATA credit rewards every safe step you include.",
    relatedCompetencies: ["clinical_judgment"],
  },
  {
    pattern: "lifespan_context_gap",
    label: "Lifespan context gap",
    nclexLayer: "recognize_cues",
    educatorFrame: "Age and setting change expected findings — compare normal vs urgent for that population.",
    relatedCompetencies: ["maternity_reproductive", "mental_health_psychosocial"],
  },
] as const;

const ONTOLOGY_BY_PATTERN = new Map(
  RN_REASONING_ONTOLOGY.map((d) => [d.pattern, d]),
);

const CODE_MAP: Record<string, ExtendedClinicalJudgmentPattern> = {
  sata: "sata_partial_reasoning",
  prioritization: "unsafe_prioritization",
  infection_control: "monitoring_gap",
  delegation: "delegation_risk",
  labs: "lab_trend_reasoning_gap",
  medication_safety: "medication_safety_gap",
  lifespan: "lifespan_context_gap",
  communication: "premature_closure",
  abg: "lab_trend_reasoning_gap",
  electrolyte: "trend_recognition_failure",
};

export function mapCoachPatternToRnOntology(pattern: CatCoachErrorPattern): RnReasoningPatternDef {
  const key = CODE_MAP[pattern.code] ?? "unsafe_prioritization";
  return ONTOLOGY_BY_PATTERN.get(key) ?? ONTOLOGY_BY_PATTERN.get("unsafe_prioritization")!;
}

export function buildRnStructuredClinicalInsights(
  coachPatterns: CatCoachErrorPattern[],
  extraFocusDomains: string[],
  measurementWeaknesses: string[] = [],
): StructuredClinicalInsight[] {
  const out: StructuredClinicalInsight[] = [];

  for (const p of coachPatterns) {
    const def = mapCoachPatternToRnOntology(p);
    out.push({
      pattern: def.pattern as ClinicalJudgmentPattern,
      patternLabel: def.label,
      domain: "Clinical judgment",
      guidance: `${def.educatorFrame} ${p.detail}`,
      emphasis: "focus",
    });
  }

  for (const tag of measurementWeaknesses.slice(0, 2)) {
    const def = RN_REASONING_ONTOLOGY.find((d) => d.measurementTags?.includes(tag));
    if (!def || out.some((i) => i.patternLabel === def.label)) continue;
    out.push({
      pattern: def.pattern as ClinicalJudgmentPattern,
      patternLabel: def.label,
      domain: "Measurement interpretation",
      guidance: def.educatorFrame,
      emphasis: "focus",
    });
  }

  for (const d of extraFocusDomains.slice(0, 2)) {
    if (out.some((i) => i.domain === d)) continue;
    out.push({
      pattern: "unsafe_prioritization",
      patternLabel: "Domain gap",
      domain: d,
      guidance: `Repeated misses in ${d} suggest revisiting unstable-patient decision frameworks, not isolated facts.`,
      emphasis: "focus",
    });
  }

  return out.slice(0, 6);
}
