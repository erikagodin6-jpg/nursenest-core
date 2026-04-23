import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { classifyNursingContent } from "@/lib/taxonomy/nursing-taxonomy-classifier";

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
  profile: "clinical";
};

const STANDARD_CLINICAL_CATEGORIES: LearningCategory[] = [
  { id: "fundamentals", title: "Fundamentals", description: "Foundational nursing concepts, safety routines, and basic care principles." },
  { id: "cardiovascular", title: "Cardiovascular", description: "Cardiac perfusion, rhythm, hemodynamics, and vascular care." },
  { id: "respiratory", title: "Respiratory", description: "Airway, oxygenation, ventilation, and pulmonary disorders." },
  { id: "neurology", title: "Neurology", description: "Neurologic assessment, stroke/seizure patterns, and neuro safety." },
  { id: "gastrointestinal", title: "Gastrointestinal", description: "GI/hepatic disorders, nutrition, elimination, and digestive emergencies." },
  { id: "renal-genitourinary", title: "Renal / Genitourinary", description: "Kidney function, fluid balance, urinary disorders, and GU care." },
  { id: "endocrine", title: "Endocrine", description: "Metabolic and hormonal disorders including diabetes and thyroid disease." },
  { id: "musculoskeletal", title: "Musculoskeletal", description: "Orthopedic, mobility, injury, and connective tissue conditions." },
  { id: "hematology-oncology", title: "Hematology / Oncology", description: "Blood disorders, malignancy care, and oncologic complications." },
  { id: "immune-infectious", title: "Immune / Infectious", description: "Immune disorders, infection syndromes, and sepsis-focused care." },
  { id: "dermatology", title: "Dermatology", description: "Skin integrity, wound/pressure injury prevention, and dermatologic disorders." },
  { id: "reproductive-ob-gyn", title: "Reproductive / OB-GYN", description: "Reproductive health, pregnancy, postpartum, and gynecologic care." },
  { id: "pediatrics", title: "Pediatrics", description: "Neonatal through adolescent care, development, and family-centered practice." },
  { id: "mental-health", title: "Mental Health", description: "Psychiatric assessment, therapeutic communication, and behavioral health care." },
  { id: "pharmacology", title: "Pharmacology", description: "Medication classes, safety, adverse effects, and dosing judgment." },
  { id: "professional-practice-ethics", title: "Professional Practice / Ethics", description: "Scope, delegation, legal-ethical duties, and team communication." },
  {
    id: "taxonomy-review-required",
    title: "Taxonomy review",
    description: "Items that need a deterministic taxonomy assignment before publishing to a clinical or professional hub.",
  },
];

const LEARNING_PATHWAY_CONFIGS: Record<string, PathwayLearningConfig> = {
  "ca-rpn-rex-pn": { pathwayId: "ca-rpn-rex-pn", label: "REx-PN", categories: STANDARD_CLINICAL_CATEGORIES, profile: "clinical" },
  "us-lpn-nclex-pn": { pathwayId: "us-lpn-nclex-pn", label: "NCLEX-PN", categories: STANDARD_CLINICAL_CATEGORIES, profile: "clinical" },
  "ca-rn-nclex-rn": { pathwayId: "ca-rn-nclex-rn", label: "NCLEX-RN", categories: STANDARD_CLINICAL_CATEGORIES, profile: "clinical" },
  "us-rn-nclex-rn": { pathwayId: "us-rn-nclex-rn", label: "NCLEX-RN", categories: STANDARD_CLINICAL_CATEGORIES, profile: "clinical" },
  "ca-np-cnple": { pathwayId: "ca-np-cnple", label: "CNPLE", categories: STANDARD_CLINICAL_CATEGORIES, profile: "clinical" },
  "us-np-fnp": { pathwayId: "us-np-fnp", label: "FNP", categories: STANDARD_CLINICAL_CATEGORIES, profile: "clinical" },
  "us-np-agpcnp": { pathwayId: "us-np-agpcnp", label: "AGPCNP", categories: STANDARD_CLINICAL_CATEGORIES, profile: "clinical" },
  "us-np-pmhnp": { pathwayId: "us-np-pmhnp", label: "PMHNP", categories: STANDARD_CLINICAL_CATEGORIES, profile: "clinical" },
  "us-np-whnp": { pathwayId: "us-np-whnp", label: "WHNP", categories: STANDARD_CLINICAL_CATEGORIES, profile: "clinical" },
  "us-np-pnp-pc": { pathwayId: "us-np-pnp-pc", label: "PNP-PC", categories: STANDARD_CLINICAL_CATEGORIES, profile: "clinical" },
  "ca-allied-core": { pathwayId: "ca-allied-core", label: "Allied Health", categories: STANDARD_CLINICAL_CATEGORIES, profile: "clinical" },
  "us-allied-core": { pathwayId: "us-allied-core", label: "Allied Health", categories: STANDARD_CLINICAL_CATEGORIES, profile: "clinical" },
};

const DEFAULT_NURSING_CONFIG: PathwayLearningConfig = {
  pathwayId: "default-nursing",
  label: "Nursing",
  categories: STANDARD_CLINICAL_CATEGORIES,
  profile: "clinical",
};

const DEFAULT_ALLIED_CONFIG: PathwayLearningConfig = {
  pathwayId: "default-allied",
  label: "Allied Health",
  categories: STANDARD_CLINICAL_CATEGORIES,
  profile: "clinical",
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

/**
 * Deterministic topic → hub category. Delegates to the locked rule-based taxonomy (no embeddings / LLM).
 * @see classifyNursingContent
 */
export function classifyLearningTopic(
  topicLabel: string,
  pathwayId: string | null | undefined,
): { categoryId: string; subcategoryId?: string } {
  void pathwayId;
  const { categoryId } = classifyNursingContent({ title: topicLabel });
  return { categoryId, subcategoryId: undefined };
}

