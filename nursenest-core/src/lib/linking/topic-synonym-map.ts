/**
 * Clinical Topic Synonym Map — deterministic, case-insensitive normalization.
 *
 * Maps any recognized clinical abbreviation, acronym, or alternate phrasing to
 * a canonical hyphenated topic key used throughout the linking engine.
 *
 * Design rules:
 * - All keys and canonical values are lowercase and hyphenated.
 * - Acronyms map to their full canonical key.
 * - Alternate spellings map to the dominant form.
 * - The canonical key itself is in the map (identity mapping) for fast lookups.
 */

/** Map of synonym/abbreviation → canonical topic key. */
const SYNONYM_MAP: Record<string, string> = {
  // Cardiovascular
  "mi": "myocardial-infarction",
  "myocardial infarction": "myocardial-infarction",
  "myocardial-infarction": "myocardial-infarction",
  "heart attack": "myocardial-infarction",
  "acs": "acute-coronary-syndrome",
  "acute coronary syndrome": "acute-coronary-syndrome",
  "acute-coronary-syndrome": "acute-coronary-syndrome",
  "stemi": "myocardial-infarction",
  "nstemi": "myocardial-infarction",
  "hf": "heart-failure",
  "heart failure": "heart-failure",
  "heart-failure": "heart-failure",
  "chf": "heart-failure",
  "congestive heart failure": "heart-failure",
  "cardiac tamponade": "cardiac-tamponade",
  "arrhythmia": "cardiac-arrhythmia",
  "cardiac arrhythmia": "cardiac-arrhythmia",
  "dysrhythmia": "cardiac-arrhythmia",
  "afib": "atrial-fibrillation",
  "a-fib": "atrial-fibrillation",
  "atrial fibrillation": "atrial-fibrillation",
  "atrial-fibrillation": "atrial-fibrillation",
  "hypertensive crisis": "hypertensive-crisis",
  "hypertension": "hypertension",
  "htn": "hypertension",
  "peripheral arterial disease": "peripheral-vascular-disease",
  "pad": "peripheral-vascular-disease",
  "pvd": "peripheral-vascular-disease",
  "dvt": "deep-vein-thrombosis",
  "deep vein thrombosis": "deep-vein-thrombosis",
  "pe": "pulmonary-embolism",
  "pulmonary embolism": "pulmonary-embolism",
  "pulmonary-embolism": "pulmonary-embolism",
  "aaa": "abdominal-aortic-aneurysm",
  "abdominal aortic aneurysm": "abdominal-aortic-aneurysm",
  "abdominal-aortic-aneurysm": "abdominal-aortic-aneurysm",

  // Respiratory
  "copd": "copd",
  "chronic obstructive pulmonary disease": "copd",
  "emphysema": "copd",
  "chronic bronchitis": "copd",
  "asthma": "asthma",
  "pneumonia": "pneumonia",
  "pneumothorax": "pneumothorax",
  "ards": "ards",
  "acute respiratory distress syndrome": "ards",
  "respiratory failure": "respiratory-failure",
  "pulmonary hypertension": "pulmonary-hypertension",
  "tb": "tuberculosis",
  "tuberculosis": "tuberculosis",
  "oxygen therapy": "oxygen-therapy",
  "mechanical ventilation": "mechanical-ventilation",
  "vent": "mechanical-ventilation",

  // Neurological
  "stroke": "stroke",
  "cva": "stroke",
  "cerebrovascular accident": "stroke",
  "tia": "stroke",
  "transient ischemic attack": "stroke",
  "icp": "increased-icp",
  "increased icp": "increased-icp",
  "increased intracranial pressure": "increased-icp",
  "increased-icp": "increased-icp",
  "seizure": "seizure",
  "epilepsy": "seizure",
  "meningitis": "meningitis",
  "delirium": "delirium",
  "dementia": "dementia",
  "alzheimer": "dementia",
  "alzheimers": "dementia",
  "guillain-barre": "guillain-barre-syndrome",
  "gbs": "guillain-barre-syndrome",
  "ms": "multiple-sclerosis",
  "multiple sclerosis": "multiple-sclerosis",
  "spinal cord injury": "spinal-cord-injury",
  "sci": "spinal-cord-injury",
  "parkinson": "parkinsons-disease",
  "parkinsons": "parkinsons-disease",
  "myasthenia gravis": "myasthenia-gravis",
  "mg": "myasthenia-gravis",

  // Renal
  "aki": "acute-kidney-injury",
  "acute kidney injury": "acute-kidney-injury",
  "acute renal failure": "acute-kidney-injury",
  "arf": "acute-kidney-injury",
  "ckd": "chronic-kidney-disease",
  "chronic kidney disease": "chronic-kidney-disease",
  "esrd": "chronic-kidney-disease",
  "end stage renal disease": "chronic-kidney-disease",
  "dialysis": "dialysis",
  "hemodialysis": "dialysis",
  "peritoneal dialysis": "dialysis",
  "renal": "renal-failure",
  "renal failure": "renal-failure",

  // Endocrine
  "dm": "diabetes-mellitus",
  "diabetes": "diabetes-mellitus",
  "diabetes mellitus": "diabetes-mellitus",
  "diabetes-mellitus": "diabetes-mellitus",
  "t1dm": "diabetes-mellitus",
  "t2dm": "diabetes-mellitus",
  "type 1 diabetes": "diabetes-mellitus",
  "type 2 diabetes": "diabetes-mellitus",
  "dka": "diabetic-ketoacidosis",
  "diabetic ketoacidosis": "diabetic-ketoacidosis",
  "diabetic-ketoacidosis": "diabetic-ketoacidosis",
  "hhns": "hyperosmolar-hyperglycemic-state",
  "hhs": "hyperosmolar-hyperglycemic-state",
  "hypoglycemia": "hypoglycemia",
  "hyperglycemia": "hyperglycemia",
  "thyroid storm": "thyroid-storm",
  "hyperthyroidism": "hyperthyroidism",
  "hypothyroidism": "hypothyroidism",
  "addison": "addisons-disease",
  "addisons disease": "addisons-disease",
  "cushing": "cushings-syndrome",
  "cushings syndrome": "cushings-syndrome",
  "siadh": "siadh",
  "diabetes insipidus": "diabetes-insipidus",
  "di": "diabetes-insipidus",

  // Gastrointestinal
  "gi bleed": "gi-bleeding",
  "gi bleeding": "gi-bleeding",
  "gastrointestinal bleeding": "gi-bleeding",
  "ugib": "gi-bleeding",
  "crohns": "inflammatory-bowel-disease",
  "crohn": "inflammatory-bowel-disease",
  "ulcerative colitis": "inflammatory-bowel-disease",
  "ibd": "inflammatory-bowel-disease",
  "appendicitis": "appendicitis",
  "bowel obstruction": "bowel-obstruction",
  "ileus": "bowel-obstruction",
  "cirrhosis": "cirrhosis",
  "liver failure": "liver-failure",
  "pancreatitis": "pancreatitis",
  "cholecystitis": "cholecystitis",

  // Fluids and Electrolytes
  "fluid electrolyte": "fluids-electrolytes",
  "fluids and electrolytes": "fluids-electrolytes",
  "fluids electrolytes": "fluids-electrolytes",
  "fluids-electrolytes": "fluids-electrolytes",
  "electrolyte imbalance": "fluids-electrolytes",
  "hyponatremia": "hyponatremia",
  "hypernatremia": "hypernatremia",
  "hypokalemia": "hypokalemia",
  "hyperkalemia": "hyperkalemia",
  "hypocalcemia": "hypocalcemia",
  "hypercalcemia": "hypercalcemia",
  "hypomagnesemia": "hypomagnesemia",
  "metabolic acidosis": "acid-base-balance",
  "metabolic alkalosis": "acid-base-balance",
  "respiratory acidosis": "acid-base-balance",
  "respiratory alkalosis": "acid-base-balance",
  "acid base": "acid-base-balance",
  "abg": "acid-base-balance",
  "arterial blood gas": "acid-base-balance",

  // Hematology
  "sickle cell": "sickle-cell-disease",
  "sickle cell disease": "sickle-cell-disease",
  "scd": "sickle-cell-disease",
  "anemia": "anemia",
  "dic": "disseminated-intravascular-coagulation",
  "disseminated intravascular coagulation": "disseminated-intravascular-coagulation",
  "thrombocytopenia": "thrombocytopenia",
  "leukemia": "leukemia",
  "lymphoma": "lymphoma",
  "hiv": "hiv-aids",
  "aids": "hiv-aids",
  "hiv aids": "hiv-aids",

  // Sepsis and Shock
  "sepsis": "sepsis",
  "septic shock": "sepsis",
  "shock": "shock",
  "anaphylaxis": "anaphylactic-shock",
  "anaphylactic shock": "anaphylactic-shock",
  "hypovolemic shock": "shock",
  "cardiogenic shock": "shock",
  "distributive shock": "shock",

  // Obstetrics / Maternal
  "ob": "ob-emergencies",
  "obstetrics": "ob-emergencies",
  "preeclampsia": "preeclampsia",
  "eclampsia": "preeclampsia",
  "hellp": "preeclampsia",
  "placenta previa": "placenta-previa",
  "placental abruption": "placental-abruption",
  "pph": "postpartum-hemorrhage",
  "postpartum hemorrhage": "postpartum-hemorrhage",
  "aub": "abnormal-uterine-bleeding",
  "abnormal uterine bleeding": "abnormal-uterine-bleeding",
  "abnormal-uterine-bleeding": "abnormal-uterine-bleeding",

  // Pediatrics
  "peds": "pediatrics",
  "pediatric": "pediatrics",
  "pediatrics": "pediatrics",
  "pediatric triage": "pediatric-triage",
  "respiratory syncytial virus": "rsv",
  "rsv": "rsv",

  // Psychiatric / Mental Health
  "psych": "mental-health",
  "mental health": "mental-health",
  "schizophrenia": "schizophrenia",
  "bipolar": "bipolar-disorder",
  "depression": "depression",
  "suicide": "suicide-risk",
  "suicidal ideation": "suicide-risk",
  "anxiety": "anxiety",
  "ptsd": "ptsd",
  "post traumatic stress": "ptsd",
  "substance abuse": "substance-abuse",
  "alcohol withdrawal": "alcohol-withdrawal",

  // Pharmacology
  "pharmacology": "pharmacology",
  "high alert medications": "high-alert-medications",
  "high-alert medications": "high-alert-medications",
  "high alert meds": "high-alert-medications",
  "anticoagulants": "anticoagulants",
  "warfarin": "anticoagulants",
  "heparin": "anticoagulants",
  "insulin": "insulin",
  "opioids": "pain-management",
  "pain management": "pain-management",
  "antibiotics": "antibiotics",

  // Infection Control
  "infection control": "infection-control",
  "standard precautions": "infection-control",
  "isolation precautions": "infection-control",
  "mrsa": "infection-control",
  "c-diff": "infection-control",
  "c diff": "infection-control",

  // Clinical Judgment
  "clinical judgment": "clinical-judgment",
  "clinical-judgment": "clinical-judgment",
  "clinical reasoning": "clinical-judgment",
  "ncjmm": "clinical-judgment",
  "prioritization": "clinical-judgment",
  "delegation": "delegation",
  "triage": "triage",

  // Safety
  "patient safety": "patient-safety",
  "fall prevention": "fall-prevention",
  "pressure injury": "pressure-injury",
  "pressure ulcer": "pressure-injury",
  "wound care": "wound-care",

  // Exam / Allied Health specific
  "rex-pn": "rex-pn",
  "rexpn": "rex-pn",
  "nclex": "nclex",
  "nclex-rn": "nclex-rn",
  "nclex-pn": "nclex-pn",
  "rpn": "rpn",
  "lpn": "lpn",
  "lvn": "lpn",
  "mlt": "medical-laboratory-technology",
  "medical laboratory": "medical-laboratory-technology",
  "respiratory therapy": "respiratory-therapy",
  "rt": "respiratory-therapy",
  "pta": "physical-therapy-assistant",
  "ota": "occupational-therapy-assistant",
  "paramedic": "paramedic",
  "ems": "paramedic",
  "pharmacy tech": "pharmacy-technician",
  "pharmacy technician": "pharmacy-technician",
} as const;

/**
 * Normalize any clinical term to its canonical topic key.
 * Returns null if the input is not recognized.
 *
 * @example
 *   synonymNormalize("MI")          // → "myocardial-infarction"
 *   synonymNormalize("heart attack") // → "myocardial-infarction"
 *   synonymNormalize("HF")           // → "heart-failure"
 *   synonymNormalize("unknown term") // → null
 */
export function synonymNormalize(term: string): string | null {
  if (!term) return null;
  const normalized = term.trim().toLowerCase().replace(/['']/g, "");
  return SYNONYM_MAP[normalized] ?? null;
}

/**
 * Try to normalize a term; return the slugified original if not found in the
 * map (allows partial matching on unknown terms).
 */
export function synonymNormalizeOrSlugify(term: string): string {
  const canonical = synonymNormalize(term);
  if (canonical) return canonical;
  return term.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

/**
 * Return all synonyms for a canonical topic key (reverse lookup).
 * Useful for the admin inspector to show what terms map to a key.
 */
export function synonymsForTopicKey(canonicalKey: string): string[] {
  return Object.entries(SYNONYM_MAP)
    .filter(([, v]) => v === canonicalKey)
    .map(([k]) => k);
}

/** All canonical keys in the synonym map (unique, sorted). */
export const CANONICAL_TOPIC_KEYS: readonly string[] = [
  ...new Set(Object.values(SYNONYM_MAP)),
].sort();
