import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { NP_HUB_CATEGORY_DEFS, RN_PN_RPN_HUB_CATEGORY_DEFS } from "@/lib/lessons/lesson-taxonomy";
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
  displayName?: string;
  slug?: string;
  pathwayId?: string;
  tags?: string[];
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
  mental_health: "Mental Health",
  pharmacology: "Pharmacology",
  professional_practice: "Professional Practice",
  exam_strategy: "Exam Strategy",
  pediatrics: "Pediatrics",
  renal_genitourinary: "Renal / Genitourinary",
  hematology_oncology: "Hematology / Oncology",
  immune_infectious: "Immune / Infectious",
  reproductive_obstetrics: "Reproductive / OB",
  neurological: "Neurological",
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
  [REVIEW_REQUIRED]: "Review Required",
};

const CATEGORY_DESCRIPTION: Partial<Record<string, string>> = {
  cardiovascular: "Cardiac perfusion, rhythm, hemodynamics, and vascular care.",
  respiratory: "Airway, oxygenation, ventilation, and pulmonary disorders.",
  neurological: "Neurologic assessment, stroke and seizure patterns, neuro safety, and acute behavioral emergencies when assessment-led.",
  endocrine: "Metabolic and hormonal disorders including diabetes and thyroid disease.",
  mental_health: "Psychiatric, behavioral health, crisis, and therapeutic mental health care.",
  pharmacology: "Medication classes, monitoring, adverse effects, and safe medication administration.",
  professional_practice: "Ethics, legal duties, documentation, communication, delegation, and leadership.",
  exam_strategy: "Exam mechanics, prioritization strategy, and durable study routines.",
  pediatrics: "Neonatal through adolescent care, development, and family-centered practice.",
  renal_genitourinary: "Kidney function, fluid balance, urinary disorders, and GU care.",
  gastrointestinal: "GI and hepatic disorders, nutrition, elimination, and digestive emergencies.",
  hematology_oncology: "Blood disorders, malignancy care, and oncologic complications.",
  musculoskeletal: "Orthopedic, mobility, injury, and connective tissue conditions.",
  integumentary: "Skin integrity, wound and pressure injury prevention, burns, and dermatologic disorders.",
  immune_infectious: "Immune disorders, infection prevention, sepsis, and antimicrobial stewardship.",
  reproductive_obstetrics: "Reproductive health, pregnancy, postpartum, and gynecologic care.",
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

const RN_PN_RPN_HUB_CATEGORIES: LearningCategory[] = RN_PN_RPN_HUB_CATEGORY_DEFS.map((d) => ({
  id: d.id,
  title: d.hubDisplayTitle,
  description: d.description,
}));

const NP_HUB_CATEGORIES: LearningCategory[] = NP_HUB_CATEGORY_DEFS.map((d) => ({
  id: d.id,
  title: d.hubDisplayTitle,
  description: d.description,
}));

type NewGradCategoryTag = "skills" | "patho" | "pharm" | "workflow" | "career";
type AlliedCategoryTag = "skills" | "patho" | "pharm" | "diagnostics" | "workflow";

function newGradLearningCategory(
  slug: string,
  displayName: string,
  description: string,
  tags: NewGradCategoryTag[] = ["skills", "patho", "pharm", "workflow"],
): LearningCategory {
  return {
    id: slug,
    slug,
    title: displayName,
    displayName,
    pathwayId: "new-grad",
    tags,
    description,
  };
}

function alliedLearningCategory(
  slug: string,
  displayName: string,
  description: string,
  tags: AlliedCategoryTag[] = ["skills", "workflow"],
): LearningCategory {
  return {
    id: slug,
    slug,
    title: displayName,
    displayName,
    pathwayId: "allied-health",
    tags,
    description,
  };
}

export const NEW_GRAD_HUB_CATEGORIES: LearningCategory[] = [
  newGradLearningCategory(
    "ltc",
    "Long-Term Care",
    "Resident-centered care, chronic-condition workflows, delegation, documentation, and escalation in LTC settings.",
  ),
  newGradLearningCategory(
    "med-surg",
    "Medical-Surgical",
    "Core adult floor nursing, common pathophysiology, medication routines, and multi-patient med-surg workflow.",
  ),
  newGradLearningCategory(
    "surgery",
    "General Surgery",
    "Surgical floor recovery, drains, pain control, wound care, and post-op prioritization for general surgery patients.",
  ),
  newGradLearningCategory(
    "emergency-trauma",
    "Emergency / Trauma",
    "Triage, trauma stabilization, rapid reassessment, and emergency escalation in ED flow.",
  ),
  newGradLearningCategory(
    "icu",
    "Intensive Care Unit",
    "High-acuity ICU monitoring, vasoactive medication awareness, deterioration cues, and critical-care workflow.",
  ),
  newGradLearningCategory(
    "cardiac-icu",
    "Cardiac ICU",
    "Cardiac critical care, telemetry interpretation, hemodynamics, post-cardiac procedures, and escalation.",
  ),
  newGradLearningCategory(
    "neuro-icu",
    "Neurological ICU",
    "Neuro checks, stroke and seizure deterioration, intracranial pressure cues, and neuro-critical workflow.",
  ),
  newGradLearningCategory(
    "pediatric-icu",
    "Pediatric ICU",
    "Pediatric critical care, family communication, unstable child assessment, and PICU escalation patterns.",
  ),
  newGradLearningCategory(
    "pediatrics",
    "Pediatrics",
    "Pediatric floor care, development-aware assessment, medication safety, and family-centered practice.",
  ),
  newGradLearningCategory(
    "cardiology",
    "Cardiology",
    "Telemetry, chest pain, heart failure, cardiac medications, and bedside cardiac prioritization.",
  ),
  newGradLearningCategory(
    "hem-onc",
    "Hematology/Oncology",
    "Neutropenia, chemo safety, symptom escalation, transfusion awareness, and hem-onc unit workflow.",
  ),
  newGradLearningCategory(
    "renal",
    "Renal / Nephrology",
    "Renal patients, fluid balance, electrolyte issues, nephrology meds, and urgent kidney-related escalation.",
  ),
  newGradLearningCategory(
    "dialysis",
    "Dialysis",
    "Dialysis timing, access awareness, pre/post dialysis assessment, and dialysis-related safety concerns.",
  ),
  newGradLearningCategory(
    "community",
    "Community Health",
    "Community nursing visits, teaching, follow-up, and coordinating safe care outside the hospital.",
  ),
  newGradLearningCategory(
    "public-health",
    "Public Health",
    "Population health, prevention, community resources, outbreak awareness, and public-health workflow.",
  ),
  newGradLearningCategory(
    "clinic",
    "Outpatient Clinic",
    "Ambulatory clinic assessment, scheduling flow, patient teaching, follow-up, and outpatient documentation.",
  ),
  newGradLearningCategory(
    "labour-delivery",
    "Labour and Delivery",
    "Labor assessment, fetal or maternal warning signs, intrapartum communication, and urgent OB escalation.",
  ),
  newGradLearningCategory(
    "postpartum",
    "Postpartum",
    "Postpartum assessment, maternal safety, newborn-family teaching, bleeding concerns, and discharge teaching.",
  ),
  newGradLearningCategory(
    "nicu",
    "Neonatal ICU",
    "Neonatal instability cues, NICU communication, newborn physiology, and family support in neonatal critical care.",
  ),
  newGradLearningCategory(
    "mental-health",
    "Mental Health / Psychiatry",
    "Behavioral safety, psychiatric nursing foundations, de-escalation, and therapeutic communication.",
  ),
  newGradLearningCategory(
    "or",
    "Operating Room",
    "Perioperative flow, sterile workflow, role clarity, and OR communication for new nurses.",
  ),
  newGradLearningCategory(
    "pacu",
    "PACU",
    "Post-anesthesia assessment, airway monitoring, pain control, and early post-op safety in PACU.",
  ),
  newGradLearningCategory(
    "stepdown",
    "Stepdown / Progressive Care",
    "Higher-acuity monitoring, telemetry alarms, handoffs, and escalation on progressive care units.",
  ),
  newGradLearningCategory(
    "home-care",
    "Home Care",
    "Home visits, medication teaching, independent assessment, safety checks, and family support in home care.",
  ),
  newGradLearningCategory(
    "palliative-care",
    "Palliative Care",
    "Symptom relief, goals-of-care communication, comfort-focused workflow, and family support in palliative settings.",
  ),
  newGradLearningCategory(
    "rehab",
    "Rehabilitation",
    "Rehab nursing routines, mobility goals, interdisciplinary workflow, and longer-horizon patient education.",
  ),
  newGradLearningCategory(
    "assessments-documentation",
    "Assessments and Documentation",
    "Focused assessment, charting, handoff records, and safe documentation habits for early-career nurses.",
    ["skills", "workflow"],
  ),
  newGradLearningCategory(
    "prioritization-delegation",
    "Prioritization and Delegation",
    "Acuity sorting, assignment safety, CNA/PCT delegation, and shift-level workflow decisions.",
    ["skills", "workflow"],
  ),
  newGradLearningCategory(
    "communication-escalation",
    "Communication and Escalation",
    "SBAR, provider calls, family updates, speaking up, asking for help, and escalation when concern rises.",
    ["skills", "workflow", "career"],
  ),
  newGradLearningCategory(
    "job-applications",
    "Job Applications",
    "Applications, first-job search strategy, and evaluating early-career nursing opportunities.",
    ["career"],
  ),
  newGradLearningCategory(
    "resumes-cover-letters",
    "Resumes and Cover Letters",
    "Resume drafting, cover letters, tailoring experience, and presenting nursing strengths clearly.",
    ["career"],
  ),
  newGradLearningCategory(
    "interviews",
    "Interviews",
    "Interview preparation, common nurse interview scenarios, and communication during the hiring process.",
    ["career"],
  ),
  newGradLearningCategory(
    "choosing-a-floor",
    "Choosing a Floor",
    "Comparing units, fit, workload, specialty culture, and where to start as a new nurse.",
    ["career", "workflow"],
  ),
  newGradLearningCategory(
    "orientation-preceptorship",
    "Orientation and Preceptorship",
    "Orientation, preceptor relationships, first-year feedback, and building safe independence.",
    ["career", "workflow", "skills"],
  ),
  {
    ...learningCategoryRow(REVIEW_REQUIRED),
    slug: "review-required",
    displayName: "Review Required",
    pathwayId: "new-grad",
  },
];

export const ALLIED_HEALTH_HUB_CATEGORIES: LearningCategory[] = [
  alliedLearningCategory(
    "physiotherapy",
    "Physiotherapist",
    "Movement assessment, rehab planning, functional recovery, and mobility-focused physiotherapy workflow.",
    ["skills", "patho", "workflow"],
  ),
  alliedLearningCategory(
    "occupational-therapy",
    "Occupational Therapist",
    "ADLs, adaptive strategies, discharge planning, and occupation-focused patient function.",
    ["skills", "workflow"],
  ),
  alliedLearningCategory(
    "speech-language-pathology",
    "Speech-Language Pathologist",
    "Communication, swallowing, cognition, and speech-language assessment workflow.",
    ["skills", "workflow"],
  ),
  alliedLearningCategory(
    "respiratory-therapy",
    "Respiratory Therapist",
    "Airway support, gas exchange, ventilation, respiratory devices, and bedside RT workflow.",
    ["skills", "patho", "workflow"],
  ),
  alliedLearningCategory(
    "recreation-therapy",
    "Recreation Therapist",
    "Therapeutic recreation planning, engagement goals, and participation-focused care.",
    ["skills", "workflow"],
  ),
  alliedLearningCategory(
    "radiologic-technology",
    "Radiologic Technologist / X-ray",
    "X-ray positioning, imaging safety, radiation awareness, and radiography workflow.",
    ["skills", "diagnostics", "workflow"],
  ),
  alliedLearningCategory(
    "mri-technologist",
    "MRI Technologist",
    "MRI screening, contrast precautions, protocol workflow, and magnet safety.",
    ["skills", "diagnostics", "workflow"],
  ),
  alliedLearningCategory(
    "ct-technologist",
    "CT Technologist",
    "CT protocol flow, contrast safety, trauma imaging, and scanner workflow.",
    ["skills", "diagnostics", "workflow"],
  ),
  alliedLearningCategory(
    "sonography",
    "Ultrasound / Sonographer",
    "Ultrasound technique, exam prep, image acquisition, and sonography workflow.",
    ["skills", "diagnostics", "workflow"],
  ),
  alliedLearningCategory(
    "nuclear-medicine",
    "Nuclear Medicine Technologist",
    "Radiopharmaceutical safety, scan preparation, and nuclear imaging workflow.",
    ["skills", "diagnostics", "workflow"],
  ),
  alliedLearningCategory(
    "mlt",
    "Medical Laboratory Technologist",
    "Lab interpretation, specimen analysis, quality control, and medical laboratory workflow.",
    ["skills", "diagnostics", "workflow"],
  ),
  alliedLearningCategory(
    "mlt-assistant",
    "Medical Laboratory Technician",
    "Specimen handling, lab support tasks, collection processes, and assistant workflow.",
    ["skills", "diagnostics", "workflow"],
  ),
  alliedLearningCategory(
    "phlebotomy",
    "Phlebotomist",
    "Venipuncture, specimen labeling, collection safety, and blood-draw workflow.",
    ["skills", "diagnostics", "workflow"],
  ),
  alliedLearningCategory(
    "cardiology-tech",
    "Cardiology Technologist",
    "Cardiac diagnostics, rhythm capture, stress-test prep, and cardiology tech workflow.",
    ["skills", "diagnostics", "workflow"],
  ),
  alliedLearningCategory(
    "ecg-tech",
    "ECG Technician",
    "ECG lead placement, tracing quality, rhythm basics, and ECG workflow.",
    ["skills", "diagnostics", "workflow"],
  ),
  alliedLearningCategory(
    "perfusionist",
    "Perfusionist",
    "Cardiopulmonary bypass support, perfusion safety, and operative cardiac workflow.",
    ["skills", "patho", "workflow"],
  ),
  alliedLearningCategory(
    "pharmacist",
    "Pharmacist",
    "Medication safety, pharmacology reasoning, verification workflow, and interprofessional medication support.",
    ["pharm", "workflow"],
  ),
  alliedLearningCategory(
    "pharmacy-tech",
    "Pharmacy Technician",
    "Medication prep, dispensing accuracy, calculations, and pharmacy operations workflow.",
    ["skills", "pharm", "workflow"],
  ),
  alliedLearningCategory(
    "dietitian",
    "Dietitian / Nutritionist",
    "Nutrition assessment, counseling, therapeutic diets, and nutrition-focused workflow.",
    ["skills", "patho", "workflow"],
  ),
  alliedLearningCategory(
    "social-work",
    "Social Worker",
    "Patient advocacy, discharge planning, communication, ethics, and psychosocial workflow.",
    ["skills", "workflow"],
  ),
  alliedLearningCategory(
    "paramedic",
    "Paramedic",
    "Prehospital assessment, emergency response, scene priorities, and paramedic workflow.",
    ["skills", "patho", "workflow"],
  ),
  alliedLearningCategory(
    "anesthesia-assistant",
    "Anesthesia Assistant",
    "Airway support, peri-anesthesia prep, safety checks, and anesthesia workflow.",
    ["skills", "workflow"],
  ),
  alliedLearningCategory(
    "surgical-assistant",
    "Surgical Assistant / OR Tech",
    "OR setup, sterile support, procedural flow, and surgical-assist workflow.",
    ["skills", "workflow"],
  ),
  alliedLearningCategory(
    "orthopedic-tech",
    "Orthopedic Technologist",
    "Casting, splinting, traction support, and orthopedic workflow basics.",
    ["skills", "patho", "workflow"],
  ),
  alliedLearningCategory(
    "dialysis-tech",
    "Dialysis Technician",
    "Dialysis machine workflow, patient prep, treatment monitoring, and renal support tasks.",
    ["skills", "patho", "workflow"],
  ),
  alliedLearningCategory(
    "mental-health-therapist",
    "Mental Health Therapist / Counselor",
    "Therapeutic communication, counseling workflow, crisis awareness, and mental-health support.",
    ["skills", "workflow"],
  ),
  alliedLearningCategory(
    "audiology",
    "Audiologist",
    "Hearing assessment, auditory diagnostics, counseling, and audiology workflow.",
    ["skills", "diagnostics", "workflow"],
  ),
  {
    ...learningCategoryRow(REVIEW_REQUIRED),
    slug: "review-required",
    displayName: "Review Required",
    pathwayId: "allied-health",
  },
];

const LEARNING_PATHWAY_CONFIGS: Record<string, PathwayLearningConfig> = {
  "ca-rpn-rex-pn": { pathwayId: "ca-rpn-rex-pn", label: "REx-PN", categories: RN_PN_RPN_HUB_CATEGORIES, profile: "clinical" },
  "us-lpn-nclex-pn": { pathwayId: "us-lpn-nclex-pn", label: "NCLEX-PN", categories: RN_PN_RPN_HUB_CATEGORIES, profile: "clinical" },
  "ca-rn-nclex-rn": { pathwayId: "ca-rn-nclex-rn", label: "NCLEX-RN", categories: RN_PN_RPN_HUB_CATEGORIES, profile: "clinical" },
  "us-rn-nclex-rn": { pathwayId: "us-rn-nclex-rn", label: "NCLEX-RN", categories: RN_PN_RPN_HUB_CATEGORIES, profile: "clinical" },
  "ca-np-cnple": { pathwayId: "ca-np-cnple", label: "CNPLE", categories: NP_HUB_CATEGORIES, profile: "clinical" },
  "us-np-fnp": { pathwayId: "us-np-fnp", label: "FNP", categories: NP_HUB_CATEGORIES, profile: "clinical" },
  "us-np-agpcnp": { pathwayId: "us-np-agpcnp", label: "AGPCNP", categories: NP_HUB_CATEGORIES, profile: "clinical" },
  "us-np-pmhnp": { pathwayId: "us-np-pmhnp", label: "PMHNP", categories: NP_HUB_CATEGORIES, profile: "clinical" },
  "us-np-whnp": { pathwayId: "us-np-whnp", label: "WHNP", categories: NP_HUB_CATEGORIES, profile: "clinical" },
  "us-np-pnp-pc": { pathwayId: "us-np-pnp-pc", label: "PNP-PC", categories: NP_HUB_CATEGORIES, profile: "clinical" },
  "ca-allied-core": { pathwayId: "ca-allied-core", label: "Allied Health", categories: ALLIED_HEALTH_HUB_CATEGORIES, profile: "clinical" },
  "us-allied-core": { pathwayId: "us-allied-core", label: "Allied Health", categories: ALLIED_HEALTH_HUB_CATEGORIES, profile: "clinical" },
  "us-rn-new-grad-transition": { pathwayId: "us-rn-new-grad-transition", label: "New Grad", categories: NEW_GRAD_HUB_CATEGORIES, profile: "clinical" },
};

const DEFAULT_NURSING_CONFIG: PathwayLearningConfig = {
  pathwayId: "default-nursing",
  label: "Nursing",
  categories: RN_PN_RPN_HUB_CATEGORIES,
  profile: "clinical",
};

const DEFAULT_ALLIED_CONFIG: PathwayLearningConfig = {
  pathwayId: "default-allied",
  label: "Allied Health",
  categories: ALLIED_HEALTH_HUB_CATEGORIES,
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
  if (pathwayId.includes("new-grad")) {
    return { pathwayId: "default-new-grad", label: "New Grad", categories: NEW_GRAD_HUB_CATEGORIES, profile: "clinical" };
  }
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
