/**
 * Controlled **catalog display** categories for pathway lessons (RN / PN / NP) plus shared hub layout:
 * RN/PN/RPN and NP hub section defs, topic-cluster group titles, and taxonomy-leaf → hub id mapping
 * used by `pathway-lesson-body-system-groups` / `pathway-learning-structure`.
 * Normalizes the human-facing `topic` string in `catalog.json` and powers validation tests.
 */

import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { REVIEW_REQUIRED, TAXONOMY } from "@/lib/taxonomy/taxonomy";

export const LESSON_CATEGORIES = [
  "Cardiovascular",
  "Respiratory",
  "Neurological",
  "Renal & Urinary",
  "Gastrointestinal",
  "Endocrine",
  "Hematology & Oncology",
  "Musculoskeletal",
  "Integumentary & Wound Care",
  "Fluids, Electrolytes & Acid-Base",
  "Pharmacology",
  "Infection Control",
  "Safety & Prioritization",
  "Leadership & Delegation",
  "Maternal & Newborn",
  "Pediatrics",
  "Mental Health",
  "Fundamentals",
  "Nutrition",
  "Procedures & Skills",
  "Exam Strategy",
] as const;

export type LessonCategory = (typeof LESSON_CATEGORIES)[number];

const CATEGORY_SET = new Set<string>(LESSON_CATEGORIES);

/** Exact legacy `topic` strings observed in bundled `catalog.json` → controlled category. */
const LEGACY_TOPIC_TO_CATEGORY: Record<string, LessonCategory> = {
  "ABG & acid–base": "Fluids, Electrolytes & Acid-Base",
  "ABG interpretation": "Fluids, Electrolytes & Acid-Base",
  "Acid–base disorders (advanced)": "Fluids, Electrolytes & Acid-Base",
  "Adolescent health": "Pediatrics",
  Angina: "Cardiovascular",
  Antibiotics: "Pharmacology",
  Anticoagulants: "Pharmacology",
  Anticoagulation: "Pharmacology",
  Asthma: "Respiratory",
  COPD: "Respiratory",
  "COPD & respiratory basics": "Respiratory",
  "COPD, asthma, ARDS, pneumonia, PE": "Respiratory",
  Cardiovascular: "Cardiovascular",
  "Cardiovascular (PN)": "Cardiovascular",
  "Care coordination": "Leadership & Delegation",
  "Clinical judgment": "Safety & Prioritization",
  "Clinical reasoning": "Safety & Prioritization",
  "Community health": "Safety & Prioritization",
  "Coordinated care": "Leadership & Delegation",
  Delegation: "Leadership & Delegation",
  "Delegation & assignment": "Leadership & Delegation",
  "Diabetes & metabolic": "Endocrine",
  "Diabetes medications": "Pharmacology",
  "Differential, prescribing & chronic care": "Pharmacology",
  Dysrhythmias: "Cardiovascular",
  "Electrolytes & volume": "Fluids, Electrolytes & Acid-Base",
  "Emergency care": "Safety & Prioritization",
  Endocrine: "Endocrine",
  "Endocrine (PN)": "Endocrine",
  "Fluid deficit vs excess": "Fluids, Electrolytes & Acid-Base",
  "Fluids & Electrolytes (PN)": "Fluids, Electrolytes & Acid-Base",
  "Fluids & electrolytes": "Fluids, Electrolytes & Acid-Base",
  "Fluids, Electrolytes & Acid-Base": "Fluids, Electrolytes & Acid-Base",
  GI: "Gastrointestinal",
  "GI (PN)": "Gastrointestinal",
  Gastrointestinal: "Gastrointestinal",
  "General nursing clinical judgment": "Safety & Prioritization",
  Geriatrics: "Safety & Prioritization",
  "Health promotion": "Nutrition",
  "Heart failure": "Cardiovascular",
  "Hematology & Oncology": "Hematology & Oncology",
  Hypertension: "Cardiovascular",
  Infection: "Infection Control",
  "Infection & Sepsis": "Infection Control",
  "Infection Control (PN)": "Infection Control",
  "Infection control": "Infection Control",
  "Insulin & hypoglycemia": "Pharmacology",
  "Integumentary & Wound Care": "Integumentary & Wound Care",
  "Leadership & Delegation": "Leadership & Delegation",
  Maternity: "Maternal & Newborn",
  "Maternity (PN)": "Maternal & Newborn",
  "Medication safety": "Pharmacology",
  "Mental Health": "Mental Health",
  "Mental Health (PN)": "Mental Health",
  "Mental health": "Mental Health",
  Musculoskeletal: "Musculoskeletal",
  "Myocardial infarction": "Cardiovascular",
  Neurological: "Neurological",
  "Neurological (PN)": "Neurological",
  Nutrition: "Nutrition",
  "Pain management": "Pharmacology",
  "Palliative basics": "Safety & Prioritization",
  "Patient safety": "Safety & Prioritization",
  Pediatrics: "Pediatrics",
  "Pediatrics (PN)": "Pediatrics",
  Pharmacology: "Pharmacology",
  "Pharmacology (PN)": "Pharmacology",
  Pneumonia: "Respiratory",
  "Potassium imbalance": "Fluids, Electrolytes & Acid-Base",
  Prioritization: "Safety & Prioritization",
  "Prioritization, ABCs & safety": "Safety & Prioritization",
  Procedures: "Procedures & Skills",
  "Professional ethics": "Leadership & Delegation",
  "Pulmonary embolism": "Respiratory",
  Renal: "Renal & Urinary",
  "Renal & GU": "Renal & Urinary",
  "Renal & GU (PN)": "Renal & Urinary",
  "Renal & Urinary": "Renal & Urinary",
  Respiratory: "Respiratory",
  "Respiratory (PN)": "Respiratory",
  Safety: "Safety & Prioritization",
  "Safety & Prioritization": "Safety & Prioritization",
  "Safety & scope": "Safety & Prioritization",
  "Safety (PN)": "Safety & Prioritization",
  "Scope & Foundations": "Leadership & Delegation",
  Sepsis: "Infection Control",
  "Sepsis & infection control": "Infection Control",
  Shock: "Safety & Prioritization",
  "Skin integrity": "Integumentary & Wound Care",
  "Sodium imbalance": "Fluids, Electrolytes & Acid-Base",
  Surgical: "Procedures & Skills",
  "Women’s health": "Maternal & Newborn",
  "Wound care": "Integumentary & Wound Care",
  ARDS: "Respiratory",
  "MI / ACS": "Cardiovascular",
};

function collapseDiacritics(s: string): string {
  return s.normalize("NFKD").replace(/\p{M}/gu, "");
}

function normalizeKey(s: string): string {
  return collapseDiacritics(s.trim().toLowerCase()).replace(/\s+/g, " ");
}

/**
 * Map a catalog `topic` (or free text) to exactly one {@link LESSON_CATEGORIES} value.
 * When `title` is provided, keywords in the title can override a miscoded `topic` (e.g. pharmacology
 * lessons incorrectly tagged as Safety & Prioritization).
 */
export function normalizeLessonCategory(
  input: string | null | undefined,
  title?: string | null,
): LessonCategory {
  const raw = typeof input === "string" ? input.trim() : "";
  const titlePart = typeof title === "string" ? title.trim() : "";
  const corpus = `${titlePart} ${raw}`.trim();

  if (!corpus) return inferLessonCategoryFromTitle("");

  if (raw && CATEGORY_SET.has(raw)) {
    const inferredFromCorpus = inferLessonCategoryFromTitle(corpus);
    if (
      raw === "Safety & Prioritization" &&
      (inferredFromCorpus === "Pharmacology" ||
        inferredFromCorpus === "Infection Control" ||
        inferredFromCorpus === "Leadership & Delegation")
    ) {
      return inferredFromCorpus;
    }
    return raw as LessonCategory;
  }

  const legacy = raw ? LEGACY_TOPIC_TO_CATEGORY[raw] : undefined;
  const inferred = inferLessonCategoryFromTitle(corpus);
  if (
    legacy === "Safety & Prioritization" &&
    (inferred === "Pharmacology" || inferred === "Infection Control" || inferred === "Leadership & Delegation")
  ) {
    return inferred;
  }
  if (legacy) return legacy;
  return inferred;
}

/**
 * Stable kebab slug for marketing **category hub** URLs (`…/lessons/{slug}`) and breadcrumbs.
 * Existing catalog rows may keep legacy `topicSlug` to avoid breaking `/lessons/topics/[topicSlug]`.
 *
 * `Fundamentals` uses `nursing-fundamentals` (not `fundamentals`) so the hub segment never collides
 * with a pathway lesson slug `fundamentals` (marketing hub dynamic segment resolution gives the lesson route precedence when both match).
 */
export function lessonCategoryToSlug(category: LessonCategory): string {
  if (category === "Fundamentals") return "nursing-fundamentals";
  return category
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Keyword priority: pharmacology → infection control → leadership/delegation → safety/prioritization
 * → body systems → exam strategy. First match wins.
 */
const TITLE_HINT_RULES: ReadonlyArray<{ re: RegExp; category: LessonCategory }> = [
  {
    re: /\b(antibiot|vancomycin|aminoglycos|anticoag|warfarin|heparin|doac|dabigatran|rivaroxaban|apixaban|enoxaparin|insulin|opioid|analges|diuretic|digoxin|lithium|pharmac|medication|meds\b|drug\b|trough|nephrotoxic|adverse effect|contraindicat|nursing implication|stewardship|high.?alert)\b/i,
    category: "Pharmacology",
  },
  {
    re: /\bmeningitis\b.*\b(isolation|precaution|transmission|ppe|infection control)\b|\b(isolation|transmission|precautions?)\b.*\bmeningitis\b/i,
    category: "Infection Control",
  },
  {
    re: /\bmeningitis\b.*\b(emergency|recognition|triage|red flag)\b|\b(emergency|recognition)\b.*\bmeningitis\b/i,
    category: "Safety & Prioritization",
  },
  {
    re: /\b(sepsis prevention|hand hygiene|infection control|standard precautions?|isolation|transmission|ppe\b|hai\b|clabsi|nosocomial|contact precautions?|droplet|airborne)\b/i,
    category: "Infection Control",
  },
  {
    re: /\b(delegat|assignment|scope of practice|lpn\b|rpn\b|uap\b|unlicensed assist|supervision|nurse practice act|interprofessional)\b/i,
    category: "Leadership & Delegation",
  },
  {
    re: /\b(fall|injury prevention|triage|abc\b|maslow|near miss|fire safety|barcode|rapid response|restraint|patient safety|clinical judgment|prioritiz|sbar\b)\b/i,
    category: "Safety & Prioritization",
  },
  { re: /\b(cabg|stemi|nSTEMI|myocardial|angina|dysrhythm|afib|atrial fibr|hypertens|heart failure|cardiac|pericardi|tamponade|endocarditis|dvt|pe\b|pacemaker|phlebostatic|cardioversion|defibrillat|vascular|chest pain)\b/i, category: "Cardiovascular" },
  { re: /\b(copd|asthma|ards|pneumonia|respiratory|airway|oxygen|abg\b|ventilat|pleural|chest tube|pneumothorax|croup|epiglottitis|tuberculosis|tb\b)\b/i, category: "Respiratory" },
  { re: /\b(stroke|seizure|neuro|ich\b|icp\b|meningitis|spinal cord|parkinson|delirium|dementia|migraine|tpa\b)\b/i, category: "Neurological" },
  { re: /\b(aki\b|ckd\b|dialysis|renal|urinary|uti\b|pyeloneph|creatinine|catheter.?associated|urine output|kidney)\b/i, category: "Renal & Urinary" },
  { re: /\b(gi\b|gastro|liver|cirrhosis|pancreatit|bowel|ileus|gerd|pud\b|gi bleed|c\.?\s*diff|ostomy|aspiration|hepatic)\b/i, category: "Gastrointestinal" },
  { re: /\b(dka\b|hhs\b|diabetes|thyroid|addison|cushing|siadh\b|di\b|endocrine|hyperglycem|hypoglycem)\b/i, category: "Endocrine" },
  { re: /\b(anemia|transfusion|oncology|chemo|neutropen|sickle)\b/i, category: "Hematology & Oncology" },
  { re: /\b(hip fracture|arthritis|musculoskeletal|traction|cast care|immobil)\b/i, category: "Musculoskeletal" },
  { re: /\b(burn|pressure injury|wound|skin integrity|dermatitis|integument)\b/i, category: "Integumentary & Wound Care" },
  { re: /\b(sodium|potassium|magnesium|calcium|phosphate|fluid deficit|fluid overload|electrolyte|acid.?base|hyponatr|hypernatr)\b/i, category: "Fluids, Electrolytes & Acid-Base" },
  { re: /\b(sepsis|hiv\b|pep\b|culture)\b/i, category: "Infection Control" },
  { re: /\b(ethics|advocacy|qi\b|incident)\b/i, category: "Leadership & Delegation" },
  { re: /\b(unstable)\b/i, category: "Safety & Prioritization" },
  { re: /\b(preeclamps|eclamps|postpartum|labor|fhr\b|fetal|newborn|breastfeed|rh\b|maternity|obstetr|pregnancy)\b/i, category: "Maternal & Newborn" },
  { re: /\b(pediatr|rsv\b|immuniz|growth chart|febrile infant|toddler|child)\b/i, category: "Pediatrics" },
  { re: /\b(mental health|psychiat|suicide|withdrawal|ciwa|anxiety|substance|trauma.?informed)\b/i, category: "Mental Health" },
  { re: /\b(nutrition|enteral|tpn\b|feeding tube)\b/i, category: "Nutrition" },
  { re: /\b(procedure|ng tube|central line dressing|line care|skill)\b/i, category: "Procedures & Skills" },
  { re: /\b(integrated review|exam readiness|test.?taking|certification prep|case study review)\b/i, category: "Exam Strategy" },
];

/**
 * Best-effort category when `topic` is missing or unknown — keyword scan only (no LLM).
 * No "Unknown" bucket: uncategorized strings fall back to {@link Fundamentals} for display;
 * inventory scripts should still flag low-signal rows for manual review.
 */
export function inferLessonCategoryFromTitle(title: string): LessonCategory {
  const t = collapseDiacritics((title ?? "").trim());
  if (!t) return "Fundamentals";
  for (const { re, category } of TITLE_HINT_RULES) {
    if (re.test(t)) return category;
  }
  return "Fundamentals";
}

/** Topic-cluster navigation group labels (single source for `lesson-topic-cluster-registry`). */
export const TOPIC_CLUSTER_GROUP_TITLES: Record<
  | "cardiovascular"
  | "respiratory"
  | "endocrine"
  | "neuro"
  | "pharmacology"
  | "safety_prioritization"
  | "fluids_renal_gi"
  | "maternity_pediatrics"
  | "mental_health"
  | "infection_immunology"
  | "gastrointestinal"
  | "hematology_oncology"
  | "musculoskeletal_integumentary"
  | "emergency_triage"
  | "other",
  string
> = {
  cardiovascular: "Cardiovascular",
  respiratory: "Respiratory",
  endocrine: "Endocrine & diabetes",
  neuro: "Neurological",
  pharmacology: "Pharmacology",
  safety_prioritization: "Safety, prioritization & delegation",
  fluids_renal_gi: "Fluids, electrolytes & renal",
  maternity_pediatrics: "Maternity & pediatrics",
  mental_health: "Mental health",
  infection_immunology: "Infection control, immune & sepsis",
  gastrointestinal: "Gastrointestinal",
  hematology_oncology: "Hematology & oncology",
  musculoskeletal_integumentary: "Musculoskeletal & integumentary",
  emergency_triage: "Emergency, shock & critical care",
  other: "More topics",
};

export type RnPnRpnHubCategoryDef = {
  readonly id: string;
  readonly hubDisplayTitle: string;
  readonly description: string;
};

/**
 * RN / RPN / PN hub section ids (stable URLs + `classifyLessonForHub`) with display titles aligned to
 * {@link LESSON_CATEGORIES} where applicable.
 */
export const RN_PN_RPN_HUB_CATEGORY_DEFS: readonly RnPnRpnHubCategoryDef[] = [
  { id: "cardiovascular", hubDisplayTitle: "Cardiovascular", description: "Cardiac perfusion, rhythm, hemodynamics, and vascular care." },
  { id: "respiratory", hubDisplayTitle: "Respiratory", description: "Airway, oxygenation, ventilation, and pulmonary disorders." },
  { id: "neurological", hubDisplayTitle: "Neurological", description: "Neurologic assessment, stroke and seizure patterns, neuro safety, and acute behavioral emergencies when assessment-led." },
  { id: "gastrointestinal", hubDisplayTitle: "Gastrointestinal", description: "GI and hepatic disorders, nutrition, elimination, and digestive emergencies." },
  { id: "renal_urinary", hubDisplayTitle: "Renal & Urinary", description: "Kidney function, fluid balance, urinary disorders, and urinary care." },
  { id: "endocrine", hubDisplayTitle: "Endocrine", description: "Metabolic and hormonal disorders including diabetes and thyroid disease." },
  {
    id: "reproductive_maternal_newborn",
    hubDisplayTitle: "Maternal & Newborn",
    description: "Reproductive health, pregnancy, labor, postpartum, and newborn transition.",
  },
  { id: "pediatrics", hubDisplayTitle: "Pediatrics", description: "Neonatal through adolescent care, development, and family-centered practice." },
  { id: "mental_health", hubDisplayTitle: "Mental Health", description: "Psychiatric, behavioral health, crisis, and therapeutic mental health care." },
  { id: "pharmacology", hubDisplayTitle: "Pharmacology", description: "Medication classes, monitoring, adverse effects, and safe medication administration." },
  {
    id: "infection_control",
    hubDisplayTitle: "Infection Control",
    description: "Isolation and transmission precautions, HAI prevention, sepsis and infectious-disease nursing practice, and antimicrobial stewardship signals.",
  },
  {
    id: "fundamentals_safety",
    hubDisplayTitle: "Safety & Prioritization",
    description: "Triage, falls and injury prevention, rapid response, restraints, barcoding, fire safety, and other non-infection safety priorities.",
  },
  {
    id: "professional_practice",
    hubDisplayTitle: "Leadership & Delegation",
    description: "Ethics, legal duties, documentation, communication, delegation, and leadership.",
  },
  { id: "exam_strategy", hubDisplayTitle: "Exam Strategy", description: "Exam mechanics, prioritization strategy, and durable study routines." },
  {
    id: REVIEW_REQUIRED,
    hubDisplayTitle: "Review Required",
    description:
      "Deterministic keywords could not place this item in a clinical, professional, pharmacology, or exam-meta bucket.",
  },
];

export type NpHubCategoryDef = {
  readonly id: string;
  readonly hubDisplayTitle: string;
  readonly description: string;
};

/** NP pathway hub sections — ids unchanged for routing; copy lives here (not duplicated in pathway config). */
export const NP_HUB_CATEGORY_DEFS: readonly NpHubCategoryDef[] = [
  { id: "primary_care", hubDisplayTitle: "Primary Care", description: "Ambulatory primary care, prevention, screening, and longitudinal first-contact care." },
  { id: "health_assessment", hubDisplayTitle: "Health Assessment", description: "History, physical exam, risk assessment, and patient presentation synthesis." },
  {
    id: "diagnostics_clinical_reasoning",
    hubDisplayTitle: "Diagnostics / Clinical Reasoning",
    description: "Differential diagnosis, diagnostic test interpretation, and clinical reasoning.",
  },
  {
    id: "pharmacology_prescribing",
    hubDisplayTitle: "Pharmacology / Prescribing",
    description: "Prescribing, medication selection, monitoring, interactions, and medication safety.",
  },
  {
    id: "chronic_disease_management",
    hubDisplayTitle: "Chronic Disease Management",
    description: "Longitudinal management of stable chronic and multisystem conditions.",
  },
  {
    id: "acute_episodic_care",
    hubDisplayTitle: "Acute Episodic Care",
    description: "New, urgent, unstable, or short-episode presentations requiring timely triage and treatment.",
  },
  { id: "pediatrics", hubDisplayTitle: "Pediatrics", description: "Neonatal through adolescent care, development, and family-centered practice." },
  { id: "womens_health", hubDisplayTitle: "Women’s Health", description: "Gynecologic, reproductive, pregnancy-related, and preventive women’s health care." },
  { id: "older_adults", hubDisplayTitle: "Older Adults", description: "Geriatric assessment, frailty, polypharmacy, function, and age-related risks." },
  { id: "mental_health", hubDisplayTitle: "Mental Health", description: "Psychiatric, behavioral health, crisis, and therapeutic mental health care." },
  {
    id: "professional_practice",
    hubDisplayTitle: "Leadership & Delegation",
    description: "Ethics, legal duties, documentation, communication, delegation, and leadership.",
  },
  { id: "exam_strategy", hubDisplayTitle: "Exam Strategy", description: "Exam mechanics, prioritization strategy, and durable study routines." },
  {
    id: REVIEW_REQUIRED,
    hubDisplayTitle: "Review Required",
    description:
      "Deterministic keywords could not place this item in a clinical, professional, pharmacology, or exam-meta bucket.",
  },
];

const PHARMACOLOGY_LEAVES = new Set<string>(TAXONOMY.PHARMACOLOGY);
const PROFESSIONAL_LEAVES = new Set<string>(TAXONOMY.PROFESSIONAL_PRACTICE);
const EXAM_META_LEAVES = new Set<string>(TAXONOMY.EXAM_META);

const MENTAL_HEALTH_PATTERNS = [
  /\bpsychiat/,
  /\bmental health\b/,
  /\bdepression\b/,
  /\banxiety\b/,
  /\bsuicid/,
  /\bbipolar\b/,
  /\bschizo/,
  /\bptsd\b/,
  /\bbehavioral health\b/,
] as const;

const NP_ASSESSMENT_PATTERNS = [/\bassessment\b/, /\bphysical exam\b/, /\bhistory\b/, /\brisk assessment\b/] as const;
const NP_DIAGNOSTIC_PATTERNS = [
  /\bdifferential\b/,
  /\bdiagnos/,
  /\bdiagnostic/,
  /\bclinical reasoning\b/,
  /\babg\b/,
  /\bacid[- ]base\b/,
  /\binterpretation\b/,
] as const;
const NP_PRESCRIBING_PATTERNS = [/\bprescrib/, /\bmedication\b/, /\bmedications\b/, /\bpharmac/, /\bdrug\b/] as const;
const NP_CHRONIC_PATTERNS = [
  /\bchronic\b/,
  /\bdiabetes\b/,
  /\bhypertension\b/,
  /\bheart failure\b/,
  /\bckd\b/,
  /\bcopd\b/,
  /\blongitudinal\b/,
] as const;
const NP_ACUTE_PATTERNS = [
  /\bacute\b/,
  /\burgent\b/,
  /\bepisodic\b/,
  /\bunstable\b/,
  /\bshock\b/,
  /\brapid response\b/,
  /\bfirst-day admissions\b/,
  /\boverflow unit\b/,
] as const;
const NP_OLDER_ADULT_PATTERNS = [/\bolder adult/, /\bgeriatric/, /\bfrailty\b/, /\bpolypharmacy\b/] as const;

function textHasAny(text: string, patterns: readonly RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

export function isNpPathwayId(pathwayId?: string | null): boolean {
  return Boolean(pathwayId && (pathwayId.includes("-np-") || pathwayId === "ca-np-cnple"));
}

export function hubClassificationCorpus(lesson: PathwayLessonRecord): string {
  return `${lesson.title ?? ""} ${lesson.topic ?? ""} ${lesson.topicSlug ?? ""} ${lesson.bodySystem ?? ""} ${
    lesson.system ?? ""
  } ${lesson.seoDescription ?? ""}`.toLowerCase();
}

export function mapTaxonomyLeafToRnPnHubCategory(leaf: string, corpus: string): string {
  if (leaf === REVIEW_REQUIRED) return REVIEW_REQUIRED;
  if (leaf === "renal_genitourinary") return "renal_urinary";
  if (leaf === "reproductive_obstetrics") return "reproductive_maternal_newborn";
  if (leaf === "neurological" && textHasAny(corpus, MENTAL_HEALTH_PATTERNS)) return "mental_health";
  if (leaf === "patient_safety_quality") return "fundamentals_safety";
  if (PHARMACOLOGY_LEAVES.has(leaf)) return "pharmacology";
  if (PROFESSIONAL_LEAVES.has(leaf)) return "professional_practice";
  if (EXAM_META_LEAVES.has(leaf)) return "exam_strategy";
  switch (leaf) {
    case "cardiovascular":
    case "respiratory":
    case "neurological":
    case "gastrointestinal":
    case "endocrine":
    case "pediatrics":
      return leaf;
    case "immune_infectious":
      return "infection_control";
    case "hematology_oncology":
    case "musculoskeletal":
    case "integumentary":
      return "fundamentals_safety";
    default:
      return REVIEW_REQUIRED;
  }
}

export function mapTaxonomyLeafToNpHubCategory(leaf: string, corpus: string): string {
  if (leaf === REVIEW_REQUIRED) return REVIEW_REQUIRED;
  if (textHasAny(corpus, MENTAL_HEALTH_PATTERNS)) return "mental_health";
  if (textHasAny(corpus, NP_OLDER_ADULT_PATTERNS)) return "older_adults";
  if (leaf === "pediatrics") return "pediatrics";
  if (leaf === "reproductive_obstetrics") return "womens_health";
  if (PHARMACOLOGY_LEAVES.has(leaf) || textHasAny(corpus, NP_PRESCRIBING_PATTERNS)) return "pharmacology_prescribing";
  if (PROFESSIONAL_LEAVES.has(leaf)) return "professional_practice";
  if (EXAM_META_LEAVES.has(leaf)) return "exam_strategy";
  if (textHasAny(corpus, NP_ASSESSMENT_PATTERNS)) return "health_assessment";
  if (textHasAny(corpus, NP_DIAGNOSTIC_PATTERNS)) return "diagnostics_clinical_reasoning";
  if (textHasAny(corpus, NP_ACUTE_PATTERNS)) return "acute_episodic_care";
  if (textHasAny(corpus, NP_CHRONIC_PATTERNS)) return "chronic_disease_management";
  if (TAXONOMY.CLINICAL.includes(leaf as (typeof TAXONOMY.CLINICAL)[number])) return "primary_care";
  return REVIEW_REQUIRED;
}

export function mapTaxonomyLeafToNursingHubCategory(
  leaf: string,
  lesson: PathwayLessonRecord,
  pathwayId?: string | null,
): string {
  const corpus = hubClassificationCorpus(lesson);
  return isNpPathwayId(pathwayId) ? mapTaxonomyLeafToNpHubCategory(leaf, corpus) : mapTaxonomyLeafToRnPnHubCategory(leaf, corpus);
}

/** Clamp display titles to a short editorial budget (after colon-friendly split). */
export function clampDisplayTitleToWordBudget(title: string, maxWords = 6): string {
  const t = (title ?? "").trim();
  if (!t) return t;
  const words = t.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return t;
  const colon = t.indexOf(":");
  if (colon > 0) {
    const left = t.slice(0, colon).trim();
    const right = t.slice(colon + 1).trim();
    const lw = left.split(/\s+/).filter(Boolean);
    const rw = right.split(/\s+/).filter(Boolean);
    const maxLeft = Math.min(4, Math.max(1, maxWords - Math.min(rw.length, 3)));
    const leftClamped = lw.slice(0, maxLeft).join(" ");
    const rightBudget = maxWords - leftClamped.split(/\s+/).filter(Boolean).length;
    const rightClamped = rw.slice(0, Math.max(1, rightBudget)).join(" ");
    return `${leftClamped}: ${rightClamped}`;
  }
  return words.slice(0, maxWords).join(" ");
}

/** Editorial: exact prior display title → premium short title (lesson `slug` unchanged). */
export const CANONICAL_TITLE_BY_EXACT_PRIOR: Record<string, string> = {
  "Heart Failure Nursing Priorities": "Heart Failure: Priorities",
  "Acute Myocardial Infarction & Troponin": "MI: Recognition & Troponin",
  "Shock Recognition & Fluids": "Shock: Recognition & Fluids",
  "Hypertensive Crisis vs Urgency": "Hypertensive Crisis vs Urgency",
  "Atrial Fibrillation & Rate Control": "Atrial Fibrillation: Rate Control",
  "Endocarditis & Blood Cultures": "Endocarditis: Blood Cultures",
  "Pericarditis & ECG Clues": "Pericarditis: ECG Clues",
  "DVT & PE Nursing Priorities": "DVT & PE: Priorities",
  "CABG and Postoperative CABG Complications": "CABG",
  "Deep Vein Thrombosis (DVT): Prevention and Nursing Management": "DVT: Prevention",
  "Defibrillation vs Synchronized Cardioversion": "Cardioversion vs Defibrillation",
  "Phlebostatic Axis": "Hemodynamic Monitoring: Phlebostatic Axis",
  "DKA vs HHS Priorities": "DKA vs HHS",
  "Thyroid Storm & Myxedema Clues": "Thyroid Storm & Myxedema",
  "SIADH vs DI Basics": "SIADH vs DI",
  "Hyponatremia vs Hypernatremia": "Sodium Imbalances",
  "Hypo- vs Hyperkalemia": "Potassium Imbalances",
  "Fluid Volume Deficit": "Fluid Deficit",
  "Fluid Volume Excess": "Fluid Overload",
  "Magnesium & Arrhythmia Risk": "Magnesium Imbalances",
  "Calcium & Tetany": "Calcium Imbalances",
  "Phosphate Shifts in Renal": "Phosphate Shifts",
  "Acute Pancreatitis Nursing Care": "Acute Pancreatitis",
  "Bowel Obstruction vs Paralytic Ileus": "Bowel Obstruction vs Ileus",
  "GERD & PUD Bleeding Clues": "GERD & PUD",
  "GI Bleed Assessment": "GI Bleed",
  "C. diff Infection Control": "C. difficile",
  "Ostomy & Skin Protection": "Ostomy Care",
  "Anemia Types & Transfusion Thresholds": "Anemia & Transfusion Thresholds",
  "Transfusion Reaction Recognition": "Transfusion Reactions",
  "Sickle Cell Pain & ACS": "Sickle Cell Crisis",
  "HIV Confidentiality & PEP Basics": "HIV Confidentiality & PEP",
  "Isolation Precautions in Practice": "Isolation Precautions",
  "Wound Infection vs Colonization": "Wound Infection vs Colonization",
  "Burn Depth & Fluid Resuscitation Basics": "Burns: Fluid Resuscitation",
  "Pressure Injury Staging": "Pressure Injuries",
  "Severe Dermatitis Skin Care": "Severe Dermatitis",
  "Assignment vs Delegation": "Assignment vs Delegation",
  "Legal: Nurse Practice Act": "Nurse Practice Act",
  "QI & Incident Reporting": "QI & Incident Reporting",
  "Late Decelerations & FHR": "FHR: Late Decelerations",
  "Newborn Thermoregulation & Feeding": "Newborn Thermoregulation & Feeding",
  "Rh Incompatibility Basics": "Rh Incompatibility",
  "Alcohol Withdrawal CIWA": "Alcohol Withdrawal: CIWA",
  "Psychotropic Side Effects": "Psychotropic Side Effects",
  "Hip Fracture & Fall Risk": "Hip Fracture",
  "RA Flare & Immune Modulators": "Rheumatoid Arthritis",
  "Immobility & DVT Prophylaxis": "Immobility & DVT Prevention",
  "Stroke Assessment & tPA Window": "Stroke: tPA & Assessment",
  "Seizure Precautions & Rescue Meds": "Seizures: Precautions & Rescue Meds",
  "Increased ICP & Positioning": "Increased ICP",
  "Spinal Cord Injury Autonomic Dysreflexia": "Autonomic Dysreflexia",
  "Meningitis Isolation & Assessment": "Meningitis",
  "Migraine vs Red-Flag Headache": "Headache Red Flags",
  "Parkinson Disease Med Timing": "Parkinson Disease: Medication Timing",
  "Enteral Feeding Tube Safety": "Enteral Feeding Safety",
  "TPN Line Care Basics": "TPN Line Care",
  "Insulin & Hypoglycemia": "Insulin & Hypoglycemia",
  "Anticoagulants & Bleeding Risk": "Anticoagulants: Bleeding Risk",
  "Antibiotic Classes & Allergies": "Antibiotics: Classes & Allergies",
  "Opioids & Respiratory Depression": "Opioids: Respiratory Depression",
  "Cardiac Glycosides & Toxicity": "Cardiac Glycosides: Toxicity",
  "Diuretics & Electrolyte Shifts": "Diuretics: Electrolyte Shifts",
  "Antihypertensive Combos": "Antihypertensives: Combos",
  "Chemo Safe Handling & Extravasation": "Chemotherapy Safety",
  "ABG Interpretation Basics": "ABG Interpretation",
  "COPD Exacerbation & Oxygen": "COPD: Oxygen Management",
  "Asthma & Status Asthmaticus": "Asthma & Status Asthmaticus",
  "ARDS & Ventilation Basics": "ARDS",
  "Pneumonia & Oxygenation": "Pneumonia",
  "Pulmonary Embolism Clues": "Pulmonary Embolism",
  "TB Isolation & Compliance": "TB Isolation",
  "Pleural Effusion & Chest Tubes": "Pleural Effusion & Chest Tubes",
  "Falls & Hourly Rounding": "Falls & Rounding",
  "Restraint Alternatives & Policy": "Restraint Alternatives",
  "Sharp Safety & Exposure": "Sharps & Exposure Safety",
  "Wound care": "Wound Care",
};

const EXAM_TITLE_SUFFIX_RE = /\s*\((?:NCLEX[^)]*)\)\s*$/i;
const EXAM_TITLE_SUFFIX_RE2 = /\s*—\s*REx-PN[^\n]*$/i;
const EXAM_TITLE_SUFFIX_RE3 = /\s*—\s*FNP[^\n]*$/i;
const EXAM_TITLE_SUFFIX_RE4 = /\s*\(NCLEX[^)]*\)\s*$/gi;
const US_STATE_SUFFIX_RE = /\s*\(United States\)\s*$/i;
const CANADA_SUFFIX_RE = /\s*\(Canada\)\s*$/i;

/**
 * Strip exam / region branding from a **display** title while keeping clinical words.
 */
export function stripLessonTitleExamBranding(title: string): string {
  let t = (title ?? "").trim();
  t = t.replace(EXAM_TITLE_SUFFIX_RE4, "").trim();
  t = t.replace(EXAM_TITLE_SUFFIX_RE, "").trim();
  t = t.replace(EXAM_TITLE_SUFFIX_RE2, "").trim();
  t = t.replace(EXAM_TITLE_SUFFIX_RE3, "").trim();
  t = t.replace(US_STATE_SUFFIX_RE, "").trim();
  t = t.replace(CANADA_SUFFIX_RE, "").trim();
  return t.trim();
}

const NP_INTEGRATED_TITLE_RE =
  /^Integrated review:\s*(.+?)\s*\(([^)]+)\)\s*#(\d+)\s*[—–-]\s*FNP certification preparation.*$/i;

/**
 * Strip SEO pipe suffixes and normalize separators before premium title passes (exam branding still removed later).
 */
export function normalizeVisibleLessonTitle(title: string): string {
  let t = (title ?? "").trim();
  /** Strip product branding pipes anywhere (not only trailing) — keeps display lines short for UI density. */
  t = t.replace(/\s*\|\s*NurseNest\b/gi, "").trim();
  t = t.replace(/\s*\|\s*Nurse\s+Nest\b/gi, "").trim();
  for (let i = 0; i < 8; i++) {
    const next = t
      .replace(/\s*\|\s*NurseNest\s*$/i, "")
      .replace(/\s*\|\s*US\s*$/i, "")
      .replace(/\s*\|\s*Canada\s*$/i, "")
      .trim();
    if (next === t) break;
    t = next;
  }
  t = t.replace(/\s*\|\s*$/g, "").trim();
  if (!t.includes(":")) {
    const pipe = t.indexOf("|");
    if (pipe > 0) {
      const left = t.slice(0, pipe).trim();
      const right = t.slice(pipe + 1).trim();
      if (right && !/^(nursenest|nclex|exam prep)\b/i.test(right)) t = `${left}: ${right}`;
      else t = left || t;
    }
  }
  t = t.replace(/\s*\|\s*/g, ": ");
  t = t.replace(/\s*:\s*/g, ": ");
  return t.replace(/[—–]/g, " – ").trim();
}

/**
 * Replace NP “Integrated review … FNP certification preparation” hub titles with clinical review lines.
 */
export function rewriteNpIntegratedReviewDisplayTitle(title: string): string {
  const m = title.trim().match(NP_INTEGRATED_TITLE_RE);
  if (!m) return title;
  const area = m[1].trim();
  const detail = (m[2] ?? "").trim();
  const focus = detail.length > 0 ? detail : "Integrated cases";
  return `${area}: ${focus}`;
}

/** Slug-level display overrides when distinct lessons would otherwise premiumize to the same title. */
export const PREMIUM_DISPLAY_TITLE_OVERRIDES_BY_SLUG: Record<string, string> = {
  "antihypertensive-combos": "Antihypertensives: Combos",
};

/**
 * Strip inline / trailing NCLEX-style exam branding from a human title (catalog or display).
 * Uses regex passes (not chained one-off replaces) so variants like "Canadian NCLEX-RN" and
 * "for … NCLEX" are removed consistently.
 */
function stripNclexExamInlineFromDisplayTitle(title: string): string {
  let t = (title ?? "").trim();
  if (!t) return t;
  t = t.replace(/\s*\([^)]*NCLEX[^)]*\)/gi, "");
  t = t.replace(/\s*-\s*NCLEX.*$/gi, "");
  t = t.replace(/\bfor\s+the\s+(Canadian\s+|US\s+)?NCLEX(-RN)?\b/gi, "");
  t = t.replace(/\bfor\s+(Canadian\s+|US\s+)?NCLEX(-RN)?\b/gi, "");
  t = t.replace(/\b(Canadian\s+|US\s+)?NCLEX(-RN)?\b/gi, "");
  t = t.replace(/\s{2,}/g, " ").trim();
  t = t.replace(/\s+for\s*$/i, "").trim();
  t = t.replace(/\s*[,;:]\s*$/g, "").trim();
  return t;
}

/**
 * Apply slug override → exact-map → NP integrated rewrite → generic exam suffix strip.
 * Pass `slug` when known (e.g. catalog rows) so slug-specific overrides apply.
 */
export function premiumizeLessonDisplayTitle(priorTitle: string, slug?: string | null): string {
  const trimmed = stripNclexExamInlineFromDisplayTitle(normalizeVisibleLessonTitle((priorTitle ?? "").trim()));
  const s = typeof slug === "string" ? slug.trim() : "";
  if (s && PREMIUM_DISPLAY_TITLE_OVERRIDES_BY_SLUG[s]) {
    return clampDisplayTitleToWordBudget(PREMIUM_DISPLAY_TITLE_OVERRIDES_BY_SLUG[s]);
  }
  const exact = CANONICAL_TITLE_BY_EXACT_PRIOR[trimmed];
  if (exact) return clampDisplayTitleToWordBudget(exact);
  const np = rewriteNpIntegratedReviewDisplayTitle(trimmed);
  if (np !== trimmed) return clampDisplayTitleToWordBudget(np);
  return clampDisplayTitleToWordBudget(stripLessonTitleExamBranding(trimmed));
}
