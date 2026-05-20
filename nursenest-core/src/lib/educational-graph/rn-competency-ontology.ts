/**
 * RN / NCLEX clinical competency ontology — stable IDs for graph edges, remediation, and longitudinal tracking.
 * Conservative mapping: topic slugs align with {@link TOPIC_CLUSTER_DEFINITIONS} and catalog metadata.
 */

import { normalizeTopicKey } from "@/lib/linking/link-resolver";

/** High-level RN competency bands (clinical judgment + NCSBN-style domains, simplified). */
export type RnCompetencyId =
  | "clinical_judgment"
  | "respiratory_instability"
  | "perfusion_hemodynamics"
  | "fluid_electrolyte_balance"
  | "endocrine_metabolic"
  | "pharmacology_safety"
  | "delegation_supervision"
  | "infection_sepsis"
  | "acid_base_gas_exchange"
  | "neurologic_acute"
  | "maternity_reproductive"
  | "mental_health_psychosocial";

export type RnCognitiveOperation =
  | "recognize_cue"
  | "interpret_mechanism"
  | "prioritize_action"
  | "delegate_safely"
  | "monitor_reassess"
  | "escalate_care"
  | "teach_prevent";

export type ClinicalReasoningRelation =
  | "symptom_to_mechanism"
  | "mechanism_to_assessment"
  | "assessment_to_intervention"
  | "intervention_to_monitoring"
  | "medication_to_safety_risk"
  | "lab_abnormality_to_prioritization"
  | "disease_to_delegation_risk"
  | "instability_to_escalation"
  | "prerequisite_to_advanced"
  | "remediation_reinforces";

export type RnCompetencyNode = {
  id: RnCompetencyId;
  label: string;
  description: string;
  cognitiveOperations: readonly RnCognitiveOperation[];
  /** Topic slugs that primarily evidence this competency on public hubs. */
  topicSlugs: readonly string[];
};

export const RN_COMPETENCY_NODES: readonly RnCompetencyNode[] = [
  {
    id: "clinical_judgment",
    label: "Clinical judgment & prioritization",
    description: "Safe sequencing under uncertainty — ABCs, unstable-before-stable, and exam-style SATA reasoning.",
    cognitiveOperations: ["recognize_cue", "prioritize_action", "escalate_care"],
    topicSlugs: ["prioritization", "delegation", "safety", "nclex-strategy"],
  },
  {
    id: "respiratory_instability",
    label: "Respiratory instability",
    description: "Gas exchange, work of breathing, oxygen titration, and ventilator-related assessment cues.",
    cognitiveOperations: ["recognize_cue", "interpret_mechanism", "monitor_reassess"],
    topicSlugs: ["copd", "respiratory-failure", "asthma", "pneumonia", "abg-interpretation"],
  },
  {
    id: "perfusion_hemodynamics",
    label: "Perfusion & hemodynamics",
    description: "Preload, afterload, cardiac output, shock patterns, and perfusion-first nursing actions.",
    cognitiveOperations: ["interpret_mechanism", "prioritize_action", "monitor_reassess"],
    topicSlugs: ["heart-failure", "shock", "cardiovascular", "myocardial-infarction"],
  },
  {
    id: "fluid_electrolyte_balance",
    label: "Fluid & electrolyte balance",
    description: "Volume status, sodium/potassium risk, diuretic response, and renal perfusion context.",
    cognitiveOperations: ["interpret_mechanism", "prioritize_action", "teach_prevent"],
    topicSlugs: ["fluid-balance", "electrolytes", "acute-kidney-injury", "siadh"],
  },
  {
    id: "endocrine_metabolic",
    label: "Endocrine & metabolic emergencies",
    description: "DKA/HHS framing, glucose-insulin-potassium timing, and compensation physiology.",
    cognitiveOperations: ["recognize_cue", "interpret_mechanism", "monitor_reassess"],
    topicSlugs: ["diabetic-ketoacidosis", "diabetes-mellitus", "dka", "thyroid"],
  },
  {
    id: "pharmacology_safety",
    label: "Pharmacology & medication safety",
    description: "High-alert meds, anticoagulation, insulin, and contraindication-aware administration.",
    cognitiveOperations: ["prioritize_action", "teach_prevent", "delegate_safely"],
    topicSlugs: ["pharmacology", "anticoagulation", "medication-safety"],
  },
  {
    id: "delegation_supervision",
    label: "Delegation & supervision",
    description: "Scope, competency, and five rights of delegation under changing acuity.",
    cognitiveOperations: ["delegate_safely", "prioritize_action", "escalate_care"],
    topicSlugs: ["delegation", "leadership", "scope-of-practice"],
  },
  {
    id: "infection_sepsis",
    label: "Infection & sepsis recognition",
    description: "Early sepsis cues, source control mindset, lactate trends, and escalation thresholds.",
    cognitiveOperations: ["recognize_cue", "escalate_care", "monitor_reassess"],
    topicSlugs: ["sepsis", "infection", "immunology"],
  },
  {
    id: "acid_base_gas_exchange",
    label: "Acid-base & gas exchange",
    description: "ABG interpretation, compensation rules, and ventilatory implications for nursing priorities.",
    cognitiveOperations: ["interpret_mechanism", "prioritize_action"],
    topicSlugs: ["abg-interpretation", "acid-base", "metabolic-acidosis"],
  },
  {
    id: "neurologic_acute",
    label: "Acute neurologic compromise",
    description: "Stroke, ICP, seizure, and neuro check cadence with rapid escalation triggers.",
    cognitiveOperations: ["recognize_cue", "monitor_reassess", "escalate_care"],
    topicSlugs: ["stroke", "neurologic", "seizure"],
  },
  {
    id: "maternity_reproductive",
    label: "Maternity & reproductive",
    description: "Antepartum/intrapartum/postpartum priorities and newborn transition cues.",
    cognitiveOperations: ["recognize_cue", "prioritize_action", "teach_prevent"],
    topicSlugs: ["maternity", "labor-delivery", "newborn"],
  },
  {
    id: "mental_health_psychosocial",
    label: "Mental health & psychosocial",
    description: "Safety risk, therapeutic communication, and psychotropic monitoring basics.",
    cognitiveOperations: ["recognize_cue", "teach_prevent", "escalate_care"],
    topicSlugs: ["mental-health", "psychiatric", "suicide-risk"],
  },
] as const;

const TOPIC_TO_COMPETENCY = new Map<string, RnCompetencyId>();

function buildTopicIndex(): void {
  if (TOPIC_TO_COMPETENCY.size > 0) return;
  for (const node of RN_COMPETENCY_NODES) {
    for (const slug of node.topicSlugs) {
      const key = normalizeTopicKey(slug) ?? slug;
      if (!TOPIC_TO_COMPETENCY.has(key)) TOPIC_TO_COMPETENCY.set(key, node.id);
    }
  }
}

/** Resolve primary RN competency for a topic slug (catalog / hub / lesson). */
export function resolveRnCompetencyForTopic(topicSlug: string): RnCompetencyNode | null {
  buildTopicIndex();
  const key = normalizeTopicKey(topicSlug) ?? topicSlug.trim().toLowerCase();
  const id = TOPIC_TO_COMPETENCY.get(key);
  if (!id) return null;
  return RN_COMPETENCY_NODES.find((n) => n.id === id) ?? null;
}

export function listCompetenciesForTopic(topicSlug: string): RnCompetencyNode[] {
  const primary = resolveRnCompetencyForTopic(topicSlug);
  return primary ? [primary] : [];
}

/** Default reasoning chain template for remediation ladder copy. */
export function defaultReasoningChainForCompetency(competencyId: RnCompetencyId): ClinicalReasoningRelation[] {
  switch (competencyId) {
    case "perfusion_hemodynamics":
    case "infection_sepsis":
      return [
        "symptom_to_mechanism",
        "mechanism_to_assessment",
        "assessment_to_intervention",
        "intervention_to_monitoring",
        "instability_to_escalation",
      ];
    case "pharmacology_safety":
      return ["medication_to_safety_risk", "assessment_to_intervention", "intervention_to_monitoring"];
    case "delegation_supervision":
      return ["disease_to_delegation_risk", "assessment_to_intervention", "intervention_to_monitoring"];
    case "acid_base_gas_exchange":
    case "respiratory_instability":
      return ["symptom_to_mechanism", "lab_abnormality_to_prioritization", "intervention_to_monitoring"];
    default:
      return ["symptom_to_mechanism", "assessment_to_intervention", "intervention_to_monitoring"];
  }
}
