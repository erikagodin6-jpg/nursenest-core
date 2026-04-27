/**
 * Editorial taxonomy for US/Canada RN NCLEX-RN bundled `catalog.json` rows.
 * Keeps lesson `slug` stable; normalizes `topic` + premium `title` strings.
 *
 * @see scripts/apply-rn-nclex-catalog-taxonomy.mts
 * @see src/lib/lessons/rn-nclex-catalog-taxonomy.test.ts
 */
export const RN_NCLEX_CONTROLLED_TOPICS = [
  "Cardiovascular",
  "Respiratory",
  "Fluids, Electrolytes & Acid-Base",
  "Endocrine",
  "Renal & GU",
  "Gastrointestinal",
  "Neurological",
  "Infection & Sepsis",
  "Pharmacology",
  "Safety & Prioritization",
  "Leadership & Delegation",
  "Maternity",
  "Pediatrics",
  "Mental Health",
  "Hematology & Oncology",
  "Integumentary & Wound Care",
  "Musculoskeletal",
  "Nutrition",
] as const;

export type RnNclexControlledTopic = (typeof RN_NCLEX_CONTROLLED_TOPICS)[number];

const CONTROLLED_SET = new Set<string>(RN_NCLEX_CONTROLLED_TOPICS);

/** Shallow duplicate rows removed in favor of fuller `us-rn-*` / `ca-rn-*` lessons (see catalog audit). */
export const RN_NCLEX_DUPLICATE_SLUGS_TO_REMOVE = [
  "pulmonary-embolism-nclex-rn",
  "heart-failure-nclex-rn",
  "myocardial-infarction-nclex-rn",
  "insulin-hypoglycemia-hy",
] as const;

/**
 * Editorial backlog (not bundled yet): stable slug suggestions for future full-spine lessons.
 * Intentionally **not** auto-inserted into `catalog.json` — add with complete sections per content policy.
 */
export const RN_NCLEX_GAP_SLUG_SUGGESTIONS = [
  "chest-pain-triage",
  "pacemaker-care",
  "ventricular-tachycardia",
  "stroke-hemorrhagic-vs-ischemic",
  "dka-management",
  "hyperthyroidism-hypothyroidism",
  "chronic-kidney-disease",
  "dialysis-disequilibrium",
  "cirrhosis-ascites",
  "gi-tube-placement-aspiration",
  "postoperative-complications",
  "pain-assessment",
  "delirium-vs-dementia",
  "lithium-toxicity",
  "serotonin-syndrome-nms",
  "pediatric-croup-epiglottitis",
  "congenital-heart-defects",
  "labor-stages",
  "magnesium-sulfate-toxicity",
  "newborn-hypoglycemia",
  "blood-product-administration",
  "central-line-infection-prevention",
  "pressure-injury-prevention",
  "burns-parkland-formula",
  "traction-cast-care",
] as const;

export type CatalogLessonLike = {
  slug?: string;
  title?: string;
  topic?: string;
  topicSlug?: string;
};

function stripRegionalLessonTitleSuffix(title: string, pathwayId: string): string {
  let t = title.trim();
  if (pathwayId === "us-rn-nclex-rn") {
    t = t.replace(/\s*\(NCLEX-RN,\s*US\)\s*$/i, "");
  } else if (pathwayId === "ca-rn-nclex-rn") {
    t = t.replace(/\s*\(NCLEX-RN,\s*Canada\)\s*$/i, "");
  }
  t = t.replace(/\s+Nursing Care\s*$/i, "");
  t = t.replace(/\s+Basics\s*$/i, "");
  t = t.replace(/\s+Essentials\s*$/i, "");
  return t.trim();
}

/** Optional premium titles keyed by slug (canonical RN editorial names). */
export const RN_NCLEX_SLUG_PREMIUM_TITLES: Partial<Record<string, string>> = {
  "us-rn-abg-interpretation": "ABG Interpretation",
  "abg-interpretation-basics-hy": "ABG Interpretation: Clinical Integration",
  "us-rn-copd-respiratory": "COPD",
  "copd-exacerbation-oxygen": "COPD: Exacerbation & Oxygen",
  "respiratory-assessment-ngn": "Respiratory Assessment & Oxygenation",
  "cabg-and-postoperative-cabg-complications-nclex-rn": "CABG",
  "defibrillation-vs-synchronized-cardioversion-nclex-rn": "Cardioversion vs Defibrillation",
  "us-rn-pulmonary-embolism": "Pulmonary Embolism: Acute Care",
  "pulmonary-embolism-clues": "Pulmonary Embolism: Recognition Clues",
  "heart-failure-nursing-priorities-hy": "Heart Failure: Prioritization & Safety",
  "pneumonia-oxygenation": "Pneumonia: Oxygenation & Monitoring",
  "hyponatremia-vs-hypernatremia-hy": "Sodium Disorders: Hyponatremia vs Hypernatremia",
  "hypo-vs-hyperkalemia-hy": "Potassium Emergencies: Hypo- vs Hyperkalemia",
  "isolation-precautions-in-practice": "Isolation Precautions: Practice & Compliance",
  "deep-vein-thrombosis-dvt-prevention-and-nursing-management-nclex-rn": "DVT: Prevention & Management",
  "dvt-pe-nursing-priorities": "DVT & Pulmonary Embolism: Priorities",
  "us-rn-heart-failure": "Heart Failure: Assessment & Management",
  "us-rn-myocardial-infarction": "Myocardial Infarction: Recognition",
  "acute-coronary-syndrome-nclex-rn": "Acute Coronary Syndrome",
  "us-rn-angina": "Angina",
  "atrial-fibrillation-nclex-rn": "Atrial Fibrillation",
  "atrial-fibrillation-rate-control": "Atrial Fibrillation: Rate Control",
  "us-rn-dysrhythmias": "Dysrhythmias",
  "cardiac-tamponade-nclex-rn": "Cardiac Tamponade",
  "pericarditis-myocarditis-red-flags": "Pericarditis",
  "endocarditis-blood-cultures": "Endocarditis",
  "abdominal-aortic-aneurysm-nclex-rn": "Abdominal Aortic Aneurysm",
  "hypertensive-emergency-nclex-rn": "Hypertensive Crisis",
  "hypertensive-encephalopathy-basics": "Hypertensive Encephalopathy",
  "peripheral-artery-disease-claudication": "Peripheral Artery Disease",
  "hemodynamic-monitoring-phlebostatic-axis": "Hemodynamic Monitoring: Phlebostatic Axis",
  "us-rn-ards": "ARDS",
  "ards-ventilation-basics": "ARDS: Mechanical Ventilation",
  "pneumonia-oxygenation-basics": "Pneumonia",
  "us-rn-pneumonia": "Pneumonia: Recognition & Care",
  "us-rn-asthma": "Asthma",
  "asthma-status-asthmaticus": "Asthma: Status Asthmaticus",
  "tb-isolation-compliance": "TB Isolation",
  "pleural-effusion-chest-tube-basics": "Pleural Effusion & Chest Tubes",
  "fluid-volume-deficit": "Fluid Deficit",
  "fluid-volume-excess": "Fluid Overload",
  "us-rn-fluid-balance": "Fluid Deficit vs Overload",
  "us-rn-sodium-imbalance": "Sodium Imbalances",
  "us-rn-potassium-imbalance": "Potassium Imbalances",
  "magnesium-imbalance-torsades": "Magnesium Imbalances",
  "calcium-tetany": "Calcium Imbalances",
  "phosphate-shift-clues": "Phosphate Shifts",
  "us-rn-acid-base-advanced": "Acid-Base Disorders",
  "mixed-acid-base-nclex-rn": "Mixed Acid-Base Patterns",
  "dka-vs-hhs-priorities-hy": "DKA vs HHS",
  "us-rn-insulin-hypoglycemia": "Insulin & Hypoglycemia",
  "diabetes-self-management-teaching": "Diabetes Self-Management",
  "thyroid-storm-myxedema-clues": "Thyroid Storm & Myxedema",
  "addisonian-crisis": "Addisonian Crisis",
  "cushing-syndrome-assessment": "Cushing Syndrome",
  "siadh-vs-di-basics": "SIADH vs DI",
  "aki-prerenal-vs-intrarenal": "Acute Kidney Injury",
  "hemodialysis-access-infection-prevention": "Hemodialysis Access",
  "peritoneal-dialysis-basics": "Peritoneal Dialysis",
  "kidney-stones-renal-colic": "Kidney Stones",
  "uti-vs-pyelonephritis": "UTI vs Pyelonephritis",
  "foley-cauti-prevention": "Catheter-Associated Risks",
  "liver-failure-hepatic-encephalopathy": "Liver Failure & Hepatic Encephalopathy",
  "acute-pancreatitis-nursing-care": "Acute Pancreatitis",
  "bowel-obstruction-vs-paralytic-ileus": "Bowel Obstruction vs Ileus",
  "gerd-pud-bleeding-clues": "GERD & Peptic Ulcer Disease",
  "upper-gi-bleed-stabilization": "GI Bleed",
  "c-diff-infection-control": "C. difficile",
  "ostomy-care-basics": "Ostomy Care",
  "stroke-assessment-tpa-window": "Stroke",
  "seizure-precautions-rescue-meds": "Seizures",
  "increased-icp-basics": "Increased ICP",
  "spinal-cord-injury-autonomic-dysreflexia": "Spinal Cord Injury",
  "meningitis-isolation-basics": "Meningitis",
  "migraine-red-flags-basics": "Migraine Red Flags",
  "parkinson-meds-on-off": "Parkinson Disease",
  "us-rn-sepsis": "Sepsis",
  "sepsis-early-recognition-hy": "Sepsis: Early Recognition",
  "isolation-precautions-hy": "Isolation Precautions",
  "hiv-confidentiality-pep-basics": "HIV Confidentiality & PEP",
  "wound-infection-vs-colonization": "Wound Infection",
  "sharp-safety-exposure": "Exposure & Sharps Safety",
  "us-rn-antibiotics": "Antibiotics",
  "antibiotic-classes-allergies-hy": "Antibiotics: Classes & Allergies",
  "us-rn-anticoagulants": "Anticoagulants",
  "anticoagulants-bleeding-risk": "Anticoagulants: Bleeding Risk",
  "cardiac-glycosides-toxicity": "Cardiac Glycosides",
  "diuretics-electrolyte-shifts": "Diuretics",
  "antihypertensive-combos": "Antihypertensives",
  "chemo-safe-handling-extravasation": "Chemotherapy Safety",
  "psychotropic-side-effects": "Psychotropic Side Effects",
  "us-rn-prioritization-abcs": "Prioritization, ABCs & Safety",
  "falls-hourly-rounding": "Falls & Rounding",
  "restraint-alternatives-policy": "Restraints",
  "med-error-disclosure": "Medication Error Disclosure",
  "us-rn-general-nursing-clinical": "Clinical Judgment",
  "assignment-vs-delegation": "Assignment vs Delegation",
  "us-rn-delegation": "Delegation & Assignment",
  "ethical-distress-advocacy": "Ethical Distress & Advocacy",
  "nurse-practice-act-basics": "Nurse Practice Act",
  "qi-incident-reporting-basics": "QI & Incident Reporting",
  "preeclampsia-severe-features": "Preeclampsia & Eclampsia",
  "postpartum-hemorrhage-recognition": "Postpartum Hemorrhage",
  "fetal-heart-rate-decelerations": "Fetal Heart Rate Decelerations",
  "newborn-thermoregulation-feeding": "Newborn Thermoregulation & Feeding",
  "rh-incompatibility-basics": "Rh Incompatibility",
  "pediatric-fever-dehydration": "Pediatric Fever & Dehydration",
  "rsv-pediatric-resp-distress": "RSV & Respiratory Distress",
  "immunization-consent-documentation": "Immunizations",
  "failure-to-thrive-basics": "Growth Failure",
  "non-accidental-trauma-red-flags": "Non-Accidental Trauma",
  "suicide-risk-assessment-hy": "Suicide Risk Assessment",
  "alcohol-withdrawal-ciwa": "Alcohol Withdrawal",
  "anemia-types-transfusion-thresholds": "Anemia & Transfusion Thresholds",
  "transfusion-reaction-recognition": "Transfusion Reactions",
  "neutropenic-precautions-basics": "Neutropenic Precautions",
  "sickle-cell-pain-acs": "Sickle Cell Crisis",
  "burn-depth-fluid-resuscitation-basics": "Burns",
  "pressure-injury-staging": "Pressure Injuries",
  "severe-dermatitis-skin-care": "Severe Dermatitis",
  "us-rn-wound-care": "Wound Care",
  "hip-fracture-complications": "Hip Fracture",
  "ra-flare-immune-modulators": "Rheumatoid Arthritis",
  "immobility-dvt-prevention": "Immobility & DVT Prevention",
  "enteral-feeding-tube-safety": "Enteral Feeding Safety",
  "tpn-line-care-basics": "TPN Line Care",
  "us-rn-infection-control": "Isolation Precautions: Standards & Transmission",
  "shock-recognition-fluids": "Shock: Recognition & Fluids",
  "us-rn-shock": "Shock",
};

const LEGACY_TOPIC_TO_CONTROLLED: Record<string, RnNclexControlledTopic> = {
  "Fluids & Electrolytes": "Fluids, Electrolytes & Acid-Base",
  "Fluids & electrolytes": "Fluids, Electrolytes & Acid-Base",
  "Infectious Disease": "Infection & Sepsis",
  "Leadership & Management": "Leadership & Delegation",
  "Safety & Infection Control": "Safety & Prioritization",
  "Nutrition & Elimination": "Nutrition",
  "General nursing clinical judgment": "Safety & Prioritization",
  "ABG interpretation": "Fluids, Electrolytes & Acid-Base",
  "Acid–base disorders (advanced)": "Fluids, Electrolytes & Acid-Base",
  Angina: "Cardiovascular",
  Antibiotics: "Pharmacology",
  Anticoagulants: "Pharmacology",
  ARDS: "Respiratory",
  Asthma: "Respiratory",
  "COPD & respiratory basics": "Respiratory",
  Dysrhythmias: "Cardiovascular",
  "Fluid deficit vs excess": "Fluids, Electrolytes & Acid-Base",
  "Heart failure": "Cardiovascular",
  Hypertension: "Cardiovascular",
  "Infection control": "Infection & Sepsis",
  "Insulin & hypoglycemia": "Endocrine",
  "Myocardial infarction": "Cardiovascular",
  "Pain management": "Pharmacology",
  Pneumonia: "Respiratory",
  "Potassium imbalance": "Fluids, Electrolytes & Acid-Base",
  "Prioritization, ABCs & safety": "Safety & Prioritization",
  "Pulmonary embolism": "Cardiovascular",
  Sepsis: "Infection & Sepsis",
  Shock: "Cardiovascular",
  "Sodium imbalance": "Fluids, Electrolytes & Acid-Base",
  "Delegation & assignment": "Leadership & Delegation",
  "Wound care": "Integumentary & Wound Care",
  Integumentary: "Integumentary & Wound Care",
};

/**
 * Resolve controlled `topic` label for RN NCLEX-RN / CA RN NCLEX-RN catalog rows.
 */
export function resolveRnNclexControlledTopic(lesson: CatalogLessonLike, _pathwayId: string): RnNclexControlledTopic {
  const raw = (lesson.topic ?? "").trim();
  if (CONTROLLED_SET.has(raw)) return raw as RnNclexControlledTopic;

  const legacy = LEGACY_TOPIC_TO_CONTROLLED[raw];
  if (legacy) return legacy;

  throw new Error(`Unmapped RN NCLEX catalog topic ${JSON.stringify(raw)} for slug ${JSON.stringify(lesson.slug ?? "")}`);
}

function premiumTitleOverrideForSlug(slug: string, pathwayId: string): string | undefined {
  const direct = RN_NCLEX_SLUG_PREMIUM_TITLES[slug];
  if (direct) return direct;
  if (pathwayId === "ca-rn-nclex-rn" && slug.startsWith("ca-rn-")) {
    const mirror = `us-rn-${slug.slice("ca-rn-".length)}`;
    return RN_NCLEX_SLUG_PREMIUM_TITLES[mirror];
  }
  return undefined;
}

export function premiumTitleForRnNclexLesson(
  lesson: CatalogLessonLike,
  pathwayId: string,
): { title: string; topic: RnNclexControlledTopic } {
  const slug = typeof lesson.slug === "string" ? lesson.slug : "";
  const topic = resolveRnNclexControlledTopic(lesson, pathwayId);
  const mapped = slug ? premiumTitleOverrideForSlug(slug, pathwayId) : undefined;
  const stripped = stripRegionalLessonTitleSuffix(typeof lesson.title === "string" ? lesson.title : "", pathwayId);
  const title = mapped ?? stripped;
  return { title, topic };
}
