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

function hasAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

export function classifyLearningTopic(
  topicLabel: string,
  pathwayId: string | null | undefined,
): { categoryId: string; subcategoryId?: string } {
  const text = topicLabel.toLowerCase();
  void pathwayId;

  /**
   * Order matters: map **specific organ / system** keywords before broad “fundamentals” or
   * “professional practice” patterns so titles like “Prioritization in acute kidney injury” classify
   * as GU/Renal, not Fundamentals.
   */
  if (hasAny(text, [/cardio|heart|coronary|ecg|arrhythm|hypertension|mi\b|stemi|heart failure|acs\b|angina|a-fib|afib|shock|resusc|hemodynamic/])) return { categoryId: "cardiovascular" };
  if (hasAny(text, [/respir|airway|asthma|copd|oxygen|ventilat|pneumonia|pulmonary|abg|\bpe\b/])) return { categoryId: "respiratory" };
  if (hasAny(text, [/neuro|stroke|seizure|cns|icp|delirium|tbi|gcs|tia\b|mening|parkinson|neuropathy/])) return { categoryId: "neurology" };
  if (hasAny(text, [/\bgi\b|gastro|hepatic|liver|pancrea|bowel|ibd|crohn|colitis|cirrhosis|constipation|diarrhea/])) return { categoryId: "gastrointestinal" };
  if (
    hasAny(text, [
      /renal|kidney|nephro|glomerul|tubular|creatinine|\bbun\b|urinalysis|dialysis|dialysate|\baki\b|\bckd\b|oliguria|anuria|polyuria|nephrotic|nephritic|kidney stone|urolith|urinary|urolog|uti\b|pyelo|cystitis|prostat|\bbph\b|\bgu\b|genitourinary|bladder|incontinence|foley|urinary catheter|catheter-associated|electrolyte|fluid balance|euvolemia|volume overload|hyperkalem|hypokalem|hypernatr|hyponatr|metabolic acidosis|respiratory acidosis|acid-base|phosphat|parathy|polycystic kidney|nephrect/,
    ])
  ) {
    return { categoryId: "renal-genitourinary" };
  }
  if (hasAny(text, [/endocrine|diabet|thyroid|dka|hhs|adrenal|pituitary|hypoglyc|hyperglyc|metabolic syndrome/])) return { categoryId: "endocrine" };
  if (hasAny(text, [/musculo|orthop|fracture|cast|arthritis|sprain|strain|joint|bone|spine|rheumat/])) return { categoryId: "musculoskeletal" };
  if (hasAny(text, [/heme|hemat|oncolog|anemia|leukemia|lymphoma|sickle|thrombocytopen|chemo|neutropenia|coagul/])) return { categoryId: "hematology-oncology" };
  if (
    hasAny(text, [
      /sepsis|septic|\binfection\b|infectious disease|antimicrobial|antibiotic stewardship|\bcauti\b|\bclabsi\b|hiv|tb\b|immune|immunocomprom|autoimmune/,
    ])
  ) {
    return { categoryId: "immune-infectious" };
  }
  if (hasAny(text, [/dermat|skin|rash|eczema|psoriasis|wound|pressure injury|burn|ulcer|cellulitis/])) return { categoryId: "dermatology" };
  if (hasAny(text, [/reproductive|obstetric|ob-gyn|pregnan|antepartum|postpartum|intrapartum|fetal|neonat|labor|delivery|placenta|lactation|contracept|gyne/])) return { categoryId: "reproductive-ob-gyn" };
  if (hasAny(text, [/pediatric|paediatric|child|infant|adolescent|newborn|well-child|immunization schedule/])) return { categoryId: "pediatrics" };
  if (hasAny(text, [/mental|psychi|depress|anxiety|suicid|behavioral|bipolar|schizo|ptsd|substance use/])) return { categoryId: "mental-health" };
  if (hasAny(text, [/pharmac|medication|drug|dosage|contraindication|adverse effect|insulin|anticoagulant|opioid|med.?admin/])) return { categoryId: "pharmacology" };
  /** Narrow fundamentals — skills-lab / infection basics only (not generic “safety” or “prioritization”). */
  if (
    hasAny(text, [
      /infection control|hand hygiene|aseptic technique|sterile technique|standard precautions|isolation precautions|chain of infection|surgical asepsis|clean technique|foundational nursing skills|vital signs assessment basics|bedmaking|transfer techniques|body mechanics for nurses/,
    ])
  ) {
    return { categoryId: "fundamentals" };
  }
  if (hasAny(text, [/ethic|legal|scope of practice|consent|delegat|handoff|documentation standards|sbar|professional boundaries|nurse practice act/])) {
    return { categoryId: "professional-practice-ethics" };
  }
  if (hasAny(text, [/fundamental|foundational nursing|nursing basics|basic care skills|comfort measures|hygiene care|therapeutic communication basics/])) {
    return { categoryId: "fundamentals" };
  }
  return { categoryId: "professional-practice-ethics" };
}

