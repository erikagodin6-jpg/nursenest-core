import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

export type LearningSubcategory = {
  id: string;
  title: string;
  description?: string;
};

export type LearningCategory = {
  id: string;
  title: string;
  description?: string;
  subcategories?: LearningSubcategory[];
};

export type PathwayLearningConfig = {
  pathwayId: string;
  label: string;
  categories: LearningCategory[];
  profile: "nursing" | "allied";
};

const NURSING_CATEGORIES: LearningCategory[] = [
  { id: "fundamentals", title: "Fundamentals", description: "Core nursing concepts and foundational care routines." },
  {
    id: "medical-surgical",
    title: "Medical-Surgical",
    description: "System-based adult care concepts and high-frequency exam conditions.",
    subcategories: [
      { id: "cardiovascular", title: "Cardiovascular" },
      { id: "respiratory", title: "Respiratory" },
      { id: "neurological", title: "Neurological" },
      { id: "endocrine", title: "Endocrine" },
      { id: "gi", title: "GI" },
      { id: "renal", title: "Renal" },
    ],
  },
  { id: "maternal-newborn", title: "Maternal / Newborn", description: "Pregnancy, labor, postpartum, and newborn care." },
  { id: "pediatrics", title: "Pediatrics", description: "Growth and development, pediatric safety, and family-centered care." },
  { id: "mental-health", title: "Mental Health", description: "Therapeutic communication and psychiatric care priorities." },
  { id: "pharmacology", title: "Pharmacology", description: "Medication mechanisms, administration, and safety." },
  { id: "prioritization-safety", title: "Prioritization & Safety", description: "Delegation, first actions, escalation, and safety." },
];

const ALLIED_CATEGORIES: LearningCategory[] = [
  { id: "foundations", title: "Foundations", description: "Core principles, terminology, and baseline clinical workflows." },
  { id: "assessment-triage", title: "Assessment & Triage", description: "Recognition, initial assessment, and escalation cues." },
  { id: "diagnostics-monitoring", title: "Diagnostics & Monitoring", description: "Interpreting common diagnostics and trend monitoring." },
  { id: "interventions-procedures", title: "Interventions & Procedures", description: "Intervention selection and procedure readiness." },
  { id: "pharmacology-medication-safety", title: "Pharmacology & Medication Safety", description: "Medication use, safety checks, and contraindications." },
  { id: "communication-teamwork", title: "Communication & Teamwork", description: "Handoffs, documentation, and interdisciplinary coordination." },
  { id: "professional-safety", title: "Professional Safety & Ethics", description: "Scope, legal/ethical practice, and patient safety." },
];

const LEARNING_PATHWAY_CONFIGS: Record<string, PathwayLearningConfig> = {
  "ca-rpn-rex-pn": { pathwayId: "ca-rpn-rex-pn", label: "REx-PN", categories: NURSING_CATEGORIES, profile: "nursing" },
  "us-lpn-nclex-pn": { pathwayId: "us-lpn-nclex-pn", label: "NCLEX-PN", categories: NURSING_CATEGORIES, profile: "nursing" },
  "ca-rn-nclex-rn": { pathwayId: "ca-rn-nclex-rn", label: "NCLEX-RN", categories: NURSING_CATEGORIES, profile: "nursing" },
  "us-rn-nclex-rn": { pathwayId: "us-rn-nclex-rn", label: "NCLEX-RN", categories: NURSING_CATEGORIES, profile: "nursing" },
  "ca-np-cnple": { pathwayId: "ca-np-cnple", label: "CNPLE", categories: NURSING_CATEGORIES, profile: "nursing" },
  "us-np-fnp": { pathwayId: "us-np-fnp", label: "FNP", categories: NURSING_CATEGORIES, profile: "nursing" },
  "us-np-agpcnp": { pathwayId: "us-np-agpcnp", label: "AGPCNP", categories: NURSING_CATEGORIES, profile: "nursing" },
  "us-np-pmhnp": { pathwayId: "us-np-pmhnp", label: "PMHNP", categories: NURSING_CATEGORIES, profile: "nursing" },
  "us-np-whnp": { pathwayId: "us-np-whnp", label: "WHNP", categories: NURSING_CATEGORIES, profile: "nursing" },
  "us-np-pnp-pc": { pathwayId: "us-np-pnp-pc", label: "PNP-PC", categories: NURSING_CATEGORIES, profile: "nursing" },
  "ca-allied-core": { pathwayId: "ca-allied-core", label: "Allied Health", categories: ALLIED_CATEGORIES, profile: "allied" },
  "us-allied-core": { pathwayId: "us-allied-core", label: "Allied Health", categories: ALLIED_CATEGORIES, profile: "allied" },
};

const DEFAULT_NURSING_CONFIG: PathwayLearningConfig = {
  pathwayId: "default-nursing",
  label: "Nursing",
  categories: NURSING_CATEGORIES,
  profile: "nursing",
};

const DEFAULT_ALLIED_CONFIG: PathwayLearningConfig = {
  pathwayId: "default-allied",
  label: "Allied Health",
  categories: ALLIED_CATEGORIES,
  profile: "allied",
};

export function learningConfigForPathway(pathway: Pick<ExamPathwayDefinition, "id" | "roleTrack" | "shortName">): PathwayLearningConfig {
  const direct = LEARNING_PATHWAY_CONFIGS[pathway.id];
  if (direct) return direct;
  if (pathway.roleTrack === "allied") return { ...DEFAULT_ALLIED_CONFIG, label: pathway.shortName || DEFAULT_ALLIED_CONFIG.label };
  return { ...DEFAULT_NURSING_CONFIG, label: pathway.shortName || DEFAULT_NURSING_CONFIG.label };
}

export function learningConfigForPathwayId(pathwayId: string | null | undefined): PathwayLearningConfig {
  if (!pathwayId) return DEFAULT_NURSING_CONFIG;
  const direct = LEARNING_PATHWAY_CONFIGS[pathwayId];
  if (direct) return direct;
  if (pathwayId.includes("allied")) return DEFAULT_ALLIED_CONFIG;
  return DEFAULT_NURSING_CONFIG;
}

function hasAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

export function classifyLearningTopic(
  topicLabel: string,
  pathwayId: string | null | undefined,
): { categoryId: string; subcategoryId?: string } {
  const text = topicLabel.toLowerCase();
  const config = learningConfigForPathwayId(pathwayId);

  if (config.profile === "allied") {
    if (hasAny(text, [/triage|assessment|intake|chief complaint|initial assessment/])) return { categoryId: "assessment-triage" };
    if (hasAny(text, [/diagnostic|monitoring|ekg|ecg|labs|imaging|vital/])) return { categoryId: "diagnostics-monitoring" };
    if (hasAny(text, [/procedure|intervention|airway|iv|wound|device|protocol/])) return { categoryId: "interventions-procedures" };
    if (hasAny(text, [/pharmac|medication|drug|dosage|contraindication/])) return { categoryId: "pharmacology-medication-safety" };
    if (hasAny(text, [/communication|handoff|documentation|team|collaboration/])) return { categoryId: "communication-teamwork" };
    if (hasAny(text, [/ethic|legal|scope|consent|safety|infection/])) return { categoryId: "professional-safety" };
    return { categoryId: "foundations" };
  }

  if (hasAny(text, [/maternal|newborn|postpartum|labor|delivery|obstetric|pregnan/])) return { categoryId: "maternal-newborn" };
  if (hasAny(text, [/pediatric|paediatric|child|infant|adolescent/])) return { categoryId: "pediatrics" };
  if (hasAny(text, [/mental|psychi|depress|anxiety|suicid|behavioral/])) return { categoryId: "mental-health" };
  if (hasAny(text, [/pharmac|medication|drug|insulin|dosage/])) return { categoryId: "pharmacology" };
  if (hasAny(text, [/prioritiz|delegat|safety|triage|abcs|escalat/])) return { categoryId: "prioritization-safety" };
  if (hasAny(text, [/cardio|heart|coronary|ecg|arrhythm|hypertension/])) return { categoryId: "medical-surgical", subcategoryId: "cardiovascular" };
  if (hasAny(text, [/respir|airway|asthma|copd|oxygen|ventilat/])) return { categoryId: "medical-surgical", subcategoryId: "respiratory" };
  if (hasAny(text, [/neuro|stroke|seizure|cns|icp|delirium/])) return { categoryId: "medical-surgical", subcategoryId: "neurological" };
  if (hasAny(text, [/endocrine|diabet|thyroid|dka|hhs/])) return { categoryId: "medical-surgical", subcategoryId: "endocrine" };
  if (hasAny(text, [/\bgi\b|gastro|hepatic|liver|pancrea|bowel/])) return { categoryId: "medical-surgical", subcategoryId: "gi" };
  if (hasAny(text, [/renal|kidney|aki|ckd|dialysis|electrolyte/])) return { categoryId: "medical-surgical", subcategoryId: "renal" };
  return { categoryId: "fundamentals" };
}

