import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { classifyNursingContent } from "@/lib/taxonomy/classifier";
import { REVIEW_REQUIRED, TAXONOMY } from "@/lib/taxonomy/taxonomy";

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

const CATEGORY_TITLE: Partial<Record<string, string>> = {
  renal_genitourinary: "Renal / Genitourinary",
  hematology_oncology: "Hematology / Oncology",
  immune_infectious: "Immune / Infectious",
  reproductive_obstetrics: "Reproductive / OB",
  neurological: "Neurology",
  integumentary: "Integumentary",
  cardiovascular_drugs: "Pharmacology — Cardiovascular",
  cns_drugs: "Pharmacology — CNS",
  endocrine_drugs: "Pharmacology — Endocrine",
  anti_infectives: "Pharmacology — Anti-infectives",
  pain_sedation: "Pharmacology — Pain & sedation",
  legal_regulation: "Legal & regulation",
  scope_of_practice: "Scope of practice",
  delegation_supervision: "Delegation & supervision",
  leadership_management: "Leadership & management",
  patient_safety_quality: "Patient safety & quality",
  test_taking: "Test-taking strategy",
  study_strategy: "Study strategy",
  [REVIEW_REQUIRED]: "Review required",
};

const CATEGORY_DESCRIPTION: Partial<Record<string, string>> = {
  cardiovascular: "Cardiac perfusion, rhythm, hemodynamics, and vascular care.",
  respiratory: "Airway, oxygenation, ventilation, and pulmonary disorders.",
  neurological: "Neurologic assessment, stroke and seizure patterns, neuro safety, and acute behavioral emergencies when assessment-led.",
  endocrine: "Metabolic and hormonal disorders including diabetes and thyroid disease.",
  renal_genitourinary: "Kidney function, fluid balance, urinary disorders, and GU care.",
  gastrointestinal: "GI and hepatic disorders, nutrition, elimination, and digestive emergencies.",
  hematology_oncology: "Blood disorders, malignancy care, and oncologic complications.",
  musculoskeletal: "Orthopedic, mobility, injury, and connective tissue conditions.",
  integumentary: "Skin integrity, wound and pressure injury prevention, burns, and dermatologic disorders.",
  immune_infectious: "Immune disorders, infection prevention, sepsis, and antimicrobial stewardship.",
  reproductive_obstetrics: "Reproductive health, pregnancy, postpartum, and gynecologic care.",
  pediatrics: "Neonatal through adolescent care, development, and family-centered practice.",
  ethics: "Ethical reasoning, moral distress, and professional values.",
  legal_regulation: "Regulation, consent, liability, and privacy obligations.",
  documentation: "Charting, records, and safe information practices.",
  communication: "Therapeutic communication, teamwork, and structured handoffs.",
  scope_of_practice: "Role boundaries and standards of practice.",
  delegation_supervision: "Delegation, assignment, and supervision expectations.",
  leadership_management: "Leadership, management, and improvement cycles.",
  patient_safety_quality: "Safety culture, risk reduction, and quality systems.",
  cardiovascular_drugs: "Cardiovascular medication classes, monitoring, and adverse effects.",
  cns_drugs: "CNS-acting medications, sedation, and behavioral pharmacology.",
  endocrine_drugs: "Diabetes and endocrine medication management.",
  anti_infectives: "Antibiotic classes, stewardship, and anti-infective safety.",
  pain_sedation: "Analgesia, sedation, and multimodal pain strategies.",
  test_taking: "Exam mechanics, elimination, and item-style strategy.",
  study_strategy: "Study planning, retention, and learning routines.",
  [REVIEW_REQUIRED]:
    "Deterministic keywords could not place this item in a clinical, professional, pharmacology, or exam-meta bucket.",
};

function humanizeTaxonomyId(id: string): string {
  return id
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function learningCategoryRow(id: string): LearningCategory {
  return {
    id,
    title: CATEGORY_TITLE[id] ?? humanizeTaxonomyId(id),
    description: CATEGORY_DESCRIPTION[id] ?? "",
  };
}

function buildStandardPathwayCategories(): LearningCategory[] {
  return [
    ...TAXONOMY.CLINICAL.map((id) => learningCategoryRow(id)),
    ...TAXONOMY.PHARMACOLOGY.map((id) => learningCategoryRow(id)),
    ...TAXONOMY.PROFESSIONAL_PRACTICE.map((id) => learningCategoryRow(id)),
    ...TAXONOMY.EXAM_META.map((id) => learningCategoryRow(id)),
    learningCategoryRow(REVIEW_REQUIRED),
  ];
}

const STANDARD_PATHWAY_CATEGORIES = buildStandardPathwayCategories();

const LEARNING_PATHWAY_CONFIGS: Record<string, PathwayLearningConfig> = {
  "ca-rpn-rex-pn": { pathwayId: "ca-rpn-rex-pn", label: "REx-PN", categories: STANDARD_PATHWAY_CATEGORIES, profile: "clinical" },
  "us-lpn-nclex-pn": { pathwayId: "us-lpn-nclex-pn", label: "NCLEX-PN", categories: STANDARD_PATHWAY_CATEGORIES, profile: "clinical" },
  "ca-rn-nclex-rn": { pathwayId: "ca-rn-nclex-rn", label: "NCLEX-RN", categories: STANDARD_PATHWAY_CATEGORIES, profile: "clinical" },
  "us-rn-nclex-rn": { pathwayId: "us-rn-nclex-rn", label: "NCLEX-RN", categories: STANDARD_PATHWAY_CATEGORIES, profile: "clinical" },
  "ca-np-cnple": { pathwayId: "ca-np-cnple", label: "CNPLE", categories: STANDARD_PATHWAY_CATEGORIES, profile: "clinical" },
  "us-np-fnp": { pathwayId: "us-np-fnp", label: "FNP", categories: STANDARD_PATHWAY_CATEGORIES, profile: "clinical" },
  "us-np-agpcnp": { pathwayId: "us-np-agpcnp", label: "AGPCNP", categories: STANDARD_PATHWAY_CATEGORIES, profile: "clinical" },
  "us-np-pmhnp": { pathwayId: "us-np-pmhnp", label: "PMHNP", categories: STANDARD_PATHWAY_CATEGORIES, profile: "clinical" },
  "us-np-whnp": { pathwayId: "us-np-whnp", label: "WHNP", categories: STANDARD_PATHWAY_CATEGORIES, profile: "clinical" },
  "us-np-pnp-pc": { pathwayId: "us-np-pnp-pc", label: "PNP-PC", categories: STANDARD_PATHWAY_CATEGORIES, profile: "clinical" },
  "ca-allied-core": { pathwayId: "ca-allied-core", label: "Allied Health", categories: STANDARD_PATHWAY_CATEGORIES, profile: "clinical" },
  "us-allied-core": { pathwayId: "us-allied-core", label: "Allied Health", categories: STANDARD_PATHWAY_CATEGORIES, profile: "clinical" },
};

const DEFAULT_NURSING_CONFIG: PathwayLearningConfig = {
  pathwayId: "default-nursing",
  label: "Nursing",
  categories: STANDARD_PATHWAY_CATEGORIES,
  profile: "clinical",
};

const DEFAULT_ALLIED_CONFIG: PathwayLearningConfig = {
  pathwayId: "default-allied",
  label: "Allied Health",
  categories: STANDARD_PATHWAY_CATEGORIES,
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
 * Deterministic topic → hub category. Delegates to the locked keyword taxonomy (no embeddings / LLM).
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
