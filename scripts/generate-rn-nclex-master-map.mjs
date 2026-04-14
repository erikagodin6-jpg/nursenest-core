#!/usr/bin/env node
/**
 * Builds `src/content/pathway-lessons/rn-nclex-master-map.json` from per-category title lists.
 * Run: node scripts/generate-rn-nclex-master-map.mjs
 *
 * Deduplication: same canonical title appears once; `secondaryCategoryIds` preserve hub navigation.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "src/content/pathway-lessons/rn-nclex-master-map.json");

/**
 * Keep in sync with `src/lib/content-blueprint/rn-nclex-content-depth-rules.ts` (canonical prose + gates).
 * Embedded here so the JSON artifact is self-describing for content ops.
 */
const CONTENT_DEPTH_RULES = {
  version: 1,
  canonicalModule: "src/lib/content-blueprint/rn-nclex-content-depth-rules.ts",
  tierWordBands: {
    A: [1800, 2600],
    B: [1200, 1800],
    C: [900, 1400],
    D: [600, 900],
  },
  tierAMustInclude: [
    "Full pathophysiology",
    "Assessment (monitoring, trending, focused cues)",
    "Interventions (independent nursing, escalation, teaching)",
    "Complications",
    "NCLEX red flags / unsafe options / first actions",
  ],
  tierSummary: {
    A: "High-yield med-surg, emergency, ICU concepts, maternity emergencies, major pediatric disorders.",
    B: "Standard condition lessons — still detailed and exam useful.",
    C: "Medication/class, procedure/device, safety and monitoring.",
    D: "Narrow support or quick-reference teaching — still a complete idea, not a stub.",
  },
  principles: [
    "No shallow notes; no unstructured bloat — follow the exam-complete premium spine (section kinds + headings).",
    "Scan-friendly: clear headings, short paragraphs, bold key terms sparingly.",
    "Clinically useful: every block ties to assessment, action, or an exam trap.",
    "Written for RN exam prep: prioritization, safety, scope, communication.",
  ],
  antiPatterns: [
    "Notes below the tier word band or below premium section minimums",
    "Giant essays without the structured spine",
    "Filler repetition to inflate word count",
    "Generic intros that could apply to any topic",
  ],
};

/** @type {Record<string, { tier: 'A'|'B'|'C'|'D', words: [number, number] }>} */
const TIER = {
  A: { tier: "A", words: [1800, 2600] },
  B: { tier: "B", words: [1200, 1800] },
  C: { tier: "C", words: [900, 1400] },
  D: { tier: "D", words: [600, 900] },
};

/** categoryId -> list of { title, tier } in build order within category */
const CATEGORIES = {
  cardiovascular: [
    ["Myocardial Infarction", "A"],
    ["Acute Coronary Syndrome", "A"],
    ["Heart Failure", "A"],
    ["Abdominal Aortic Aneurysm", "A"],
    ["Atrial Fibrillation", "A"],
    ["CABG and Postoperative CABG Complications", "A"],
    ["Cardiac Tamponade", "A"],
    ["Peripheral Artery Disease", "B"],
    ["Hypertensive Encephalopathy", "A"],
    ["Infective Endocarditis", "A"],
    ["Pulmonary Embolism", "A"],
    ["Deep Vein Thrombosis (DVT): Prevention and Nursing Management", "A"],
    ["Dopamine", "C"],
    ["Digoxin", "C"],
    ["Milrinone", "C"],
    ["ACE Inhibitors", "C"],
    ["Heparin and aPTT Monitoring", "C"],
    ["Factor Xa Inhibitors", "C"],
    ["Statins", "C"],
    ["Defibrillation vs Synchronized Cardioversion", "C"],
    ["Phlebostatic Axis", "C"],
  ],
  respiratory: [
    ["COPD", "A"],
    ["ARDS", "A"],
    ["Epiglottitis", "A"],
    ["Pleurisy", "B"],
    ["Positive Pressure Ventilation", "A"],
    ["Bronchiolitis and RSV", "B"],
    ["Pertussis", "B"],
    ["Cystic Fibrosis", "A"],
    ["Asthma", "A"],
    ["Community-Acquired Pneumonia", "A"],
    ["Chest Tubes", "B"],
    ["Inhaled Spacers", "C"],
    ["Isolation Precautions: Contact, Droplet, and Airborne", "B"],
  ],
  neurological: [
    ["Increased Intracranial Pressure", "A"],
    ["Increased ICP in Infants", "A"],
    ["Hydrocephalus in Children", "B"],
    ["Ventriculoperitoneal Shunt", "B"],
    ["Bacterial Meningitis", "A"],
    ["Febrile Seizures", "B"],
    ["Seizures and Status Epilepticus: Acute Nursing Management", "A"],
    ["Cauda Equina Syndrome", "A"],
    ["Cerebral Palsy", "B"],
    ["Parkinson Disease", "A"],
    ["Stroke and Transient Ischemic Attack", "A"],
    ["Delirium in Hospitalized Adults", "B"],
    ["Phenytoin", "C"],
    ["ECT", "C"],
    ["Abnormal Neurological Assessment Findings", "B"],
  ],
  gastrointestinal: [
    ["Cholecystitis", "A"],
    ["Appendicitis", "A"],
    ["Bowel Obstruction (Mechanical and Functional)", "A"],
    ["Peptic Ulcer Disease", "A"],
    ["Cirrhosis", "A"],
    ["Diverticulosis vs Diverticulitis", "B"],
    ["Hiatal Hernia", "B"],
    ["Inguinal Hernia", "B"],
    ["ERCP and Post-Procedure Pancreatitis", "B"],
    ["Inflammatory Bowel Disease (Crohn Disease and Ulcerative Colitis)", "B"],
    ["Upper and Lower Gastrointestinal Bleeding", "A"],
    ["Pyrosis in Pregnancy", "C"],
    ["Guaiac Fecal Occult Blood Testing", "C"],
  ],
  renal_genitourinary: [
    ["Nephrolithiasis", "A"],
    ["Acute Kidney Injury: Prerenal, Intrarenal, and Postrenal Patterns", "A"],
    ["Diabetic Nephropathy", "A"],
    ["Nephrotic Syndrome", "A"],
    ["Hematuria and Kidney-Related Red Flags", "B"],
    ["Wilms Tumor", "B"],
    ["Urinary Tract Infection and Catheter-Associated UTI", "B"],
    ["Pyelonephritis", "B"],
    ["Vasectomy Teaching", "C"],
    ["Prostate Cancer", "B"],
    ["IUD Patient Teaching", "C"],
  ],
  endocrine_metabolic_fluids: [
    ["Diabetes Mellitus: Type 1 and Type 2 Nursing Management", "B"],
    ["Diabetic Ketoacidosis", "A"],
    ["Thyroid Storm and Myxedema Coma", "A"],
    ["Refeeding Syndrome", "A"],
    ["Hypoparathyroidism", "B"],
    ["Addison Disease / Primary Adrenal Insufficiency", "A"],
    ["Hyperkalemia: Recognition and Correction", "A"],
    ["Hypoglycemia", "A"],
    ["SIADH (Syndrome of Inappropriate Antidiuretic Hormone Secretion)", "A"],
    ["Diabetes Insipidus", "B"],
    ["Newborn Hypoglycemia", "A"],
    ["Metformin", "C"],
    ["Glyburide", "C"],
    ["Thiazide Diuretics", "C"],
    ["Albumin and Oncotic Pressure", "B"],
    ["TPN Nursing Management", "B"],
  ],
  hematology_oncology_immunology: [
    ["Acute Lymphoblastic Leukemia", "A"],
    ["Acute Myelogenous Leukemia", "A"],
    ["Sickle Cell Disease", "A"],
    ["Thalassemia", "B"],
    ["Iron Deficiency Anemia", "B"],
    ["Hemophilia", "A"],
    ["Mononucleosis and Splenic Rupture", "B"],
    ["Blood Product Administration and Transfusion Reactions", "A"],
    ["Sepsis", "A"],
    ["Linezolid", "C"],
    ["Allopurinol", "C"],
  ],
  pediatrics: [
    ["Kawasaki Disease", "A"],
    ["Cerebral Palsy", "B"],
    ["Acute Lymphoblastic Leukemia", "A"],
    ["Acute Myelogenous Leukemia", "A"],
    ["Sickle Cell Disease", "A"],
    ["Thalassemia", "B"],
    ["Febrile Seizures", "B"],
    ["Bronchiolitis and RSV", "B"],
    ["Tetralogy of Fallot", "A"],
    ["Encopresis", "B"],
    ["Tracheoesophageal Fistula and Esophageal Atresia", "A"],
    ["Hypertrophic Pyloric Stenosis", "A"],
    ["Wilms Tumor", "B"],
    ["Acute Rheumatic Fever", "B"],
    ["Hirschsprung Disease", "A"],
    ["Intussusception", "A"],
    ["Septic Arthritis", "B"],
    ["Duchenne Muscular Dystrophy", "B"],
    ["Cleft Palate", "B"],
    ["Botulism", "A"],
    ["Epiglottitis", "A"],
    ["Iron Deficiency Anemia", "B"],
    ["Newborns of Mothers with Diabetes", "B"],
    ["Administering Medication to Infants", "C"],
  ],
  maternity_newborn: [
    ["Newborn Hypoglycemia", "A"],
    ["Preeclampsia and Eclampsia", "A"],
    ["Postpartum Hemorrhage", "A"],
    ["HELLP Syndrome", "A"],
    ["Placenta Previa", "A"],
    ["Placental Abruption", "A"],
    ["Uterine Rupture", "A"],
    ["Morning Sickness", "B"],
    ["Breast Engorgement", "B"],
    ["Oxytocin", "C"],
    ["Misoprostol", "C"],
    ["Epidural Block Complications", "B"],
    ["Bishop Score", "C"],
    ["Naegele’s Rule", "C"],
    ["Herpes Simplex Virus in Pregnancy and Neonate", "A"],
    ["Fetal Metabolic Acidemia", "A"],
    ["Large for Gestational Age Newborn", "B"],
    ["Neonatal Abstinence Syndrome", "A"],
    ["Vacuum-Assisted Vaginal Birth Complications", "B"],
    ["Ruptured Ectopic Pregnancy", "A"],
  ],
  mental_health: [
    ["Panic Disorder", "B"],
    ["PTSD", "B"],
    ["Major Depressive Disorder", "A"],
    ["Opioid Withdrawal", "A"],
    ["Neuroleptic Malignant Syndrome", "A"],
    ["Conversion Disorder", "B"],
    ["Antisocial Personality Disorder", "B"],
    ["Elder Mistreatment", "A"],
    ["Schizophrenia Spectrum Disorders", "A"],
    ["Bipolar Disorders", "A"],
    ["Suicide Risk Assessment and Safety Planning", "A"],
    ["Lithium Toxicity", "C"],
    ["Phenelzine and Tyramine Crisis", "C"],
    ["Ziprasidone and QT Prolongation", "C"],
    ["Memantine", "C"],
  ],
  emergency_critical_perioperative: [
    ["Sepsis", "A"],
    ["ARDS", "A"],
    ["Malignant Hyperthermia", "A"],
    ["Neuroleptic Malignant Syndrome", "A"],
    ["Pulmonary Embolism", "A"],
    ["Autonomic Dysreflexia", "A"],
    ["Extravasation", "B"],
    ["Chest Tubes", "B"],
    ["Femoral Cardiac Catheterization", "B"],
    ["Carotid Endarterectomy", "B"],
    ["Postmortem Care", "B"],
    ["Submersion Injury", "A"],
    ["Dysrhythmias: Stable vs Unstable Management", "A"],
    ["Cardiac Tamponade", "A"],
    ["Positive Pressure Ventilation", "A"],
    ["Shock: Recognition, Classification, and Nursing Priorities", "A"],
    ["Anaphylaxis", "A"],
    ["Cellulitis and Skin and Soft-Tissue Infection", "B"],
    ["Pressure Injury: Staging, Prevention, and Wound Care", "B"],
    ["Falls and Injury Prevention in Acute Care", "B"],
    ["Physical Restraints: Indications, Monitoring, and Alternatives", "C"],
  ],
  pharmacology_master: [
    ["Dopamine", "C"],
    ["Digoxin", "C"],
    ["Phenytoin", "C"],
    ["Magnesium Sulfate", "C"],
    ["Heparin and aPTT Monitoring", "C"],
    ["ACE Inhibitors", "C"],
    ["ARBs", "C"],
    ["NSAIDs", "B"],
    ["Statins", "C"],
    ["Metformin", "C"],
    ["Glyburide", "C"],
    ["Milrinone", "C"],
    ["Allopurinol", "C"],
    ["Linezolid", "C"],
    ["Factor Xa Inhibitors", "C"],
    ["Thiazide Diuretics", "C"],
    ["Macrolide Antibiotics", "C"],
    ["Phenelzine and Tyramine Crisis", "C"],
    ["Ziprasidone and QT Prolongation", "C"],
    ["Memantine", "C"],
    ["Oxytocin", "C"],
    ["Misoprostol", "C"],
    ["Cisplatin", "B"],
    ["Insulin: Types, Administration, and Hypoglycemia Response", "B"],
    ["Warfarin and INR Monitoring", "C"],
    ["Beta-Blockers: Indications and Nursing Monitoring", "C"],
    ["Opioid Analgesics: Respiratory Depression and Naloxone Reversal", "B"],
    ["Grapefruit Juice Drug Interactions", "D"],
    /** Explicit inventory v1 — additional monographs requested for RN bank alignment (deduped by title). */
    ["Loop Diuretics", "C"],
    ["Potassium-Sparing Diuretics", "C"],
    ["Nitrates and Nitroglycerin: Routes and Monitoring", "C"],
    ["Proton Pump Inhibitors", "C"],
    ["Sucralfate", "D"],
    ["Cholestyramine", "D"],
    ["Sodium Polystyrene Sulfonate (Kayexalate)", "C"],
    ["Loperamide", "D"],
    ["Promethazine", "C"],
    ["Buprenorphine", "C"],
    ["Lorazepam", "C"],
    ["Alprazolam", "C"],
    ["Methadone", "C"],
    ["Morphine: ACS, PE, and Respiratory Depression Monitoring", "B"],
    ["SSRIs and SNRIs: Initiation, Monitoring, and Serotonin Syndrome", "B"],
    ["Benzodiazepines in Alcohol Withdrawal", "C"],
    ["Albuterol and Beta-Agonists in Bronchospasm and Adjunct Hyperkalemia Therapy", "C"],
    ["Dextrose: Hypoglycemia Rescue and DKA Adjunct Therapy", "C"],
    ["Pancreatic Enzyme Replacement (Cystic Fibrosis)", "C"],
    ["Penicillin for Rheumatic Fever Prophylaxis", "D"],
    ["Botulism Immune Globulin", "D"],
    ["Thrombolytic Therapy: tPA, Indications, and Bleeding Monitoring", "C"],
  ],
  /** Musculoskeletal + trauma patterns frequently tested as prioritization + complications. */
  musculoskeletal: [
    ["Osteoarthritis", "B"],
    ["Rheumatoid Arthritis", "B"],
    ["Gout", "B"],
    ["Hip Fracture and Surgical Repair", "A"],
    ["Osteoporosis and Fracture Prevention", "B"],
    ["Compartment Syndrome", "A"],
    ["Septic Arthritis", "B"],
  ],
  /** Integumentary + immune-mediated conditions (distinct from generic infection control lessons). */
  integumentary_immune_autoimmune: [
    ["Systemic Lupus Erythematosus", "A"],
    ["Psoriasis and Biologic Therapy", "B"],
    ["Stevens-Johnson Syndrome and Toxic Epidermal Necrolysis", "A"],
    ["Scleroderma (Systemic Sclerosis)", "B"],
  ],
  /** Systemic infectious disease nursing (isolation, monitoring, public-health tie-ins where exam-relevant). */
  infectious_disease: [
    ["Tuberculosis (Latent and Active)", "A"],
    ["HIV/AIDS: Nursing Care and Post-Exposure Prophylaxis", "A"],
    ["Influenza and Antiviral Therapy", "B"],
    ["Clostridioides difficile Infection", "A"],
    ["Osteomyelitis", "B"],
  ],
  /** Cross-cutting NCLEX Client Needs: prioritization, delegation, ethics, safety systems. */
  nclex_nursing_priorities_safety: [
    ["Nursing Prioritization: ABCs and Urgent vs Important", "A"],
    ["Delegation and Scope of Practice", "A"],
    ["Error Prevention and Incident Reporting", "B"],
    ["Informed Consent and Surrogate Decision Making", "B"],
    ["Professional Boundaries and Ethical Communication", "B"],
    ["High-Alert Medications: Systems Safety and Independent Double Checks", "B"],
    ["Multimodal Pain Management: Assessment and Escalation", "B"],
  ],
};

/**
 * Titles that first appeared in an earlier build-order category — later rows merge here.
 * Value: { primaryCategoryId, note }
 */
const PRIMARY_OWNER = {
  // Pharm master owns pure drug/class monographs also listed under CV
  Dopamine: { primaryCategoryId: "pharmacology_master", note: "Cross-listed from cardiovascular; single monograph." },
  Digoxin: { primaryCategoryId: "pharmacology_master", note: "Cross-listed from cardiovascular." },
  Milrinone: { primaryCategoryId: "pharmacology_master", note: "Cross-listed from cardiovascular." },
  "ACE Inhibitors": { primaryCategoryId: "pharmacology_master", note: "Cross-listed from cardiovascular." },
  "Heparin and aPTT Monitoring": { primaryCategoryId: "pharmacology_master", note: "Merge with Heparin monograph + monitoring subsection; CV list references same slug." },
  Heparin: { primaryCategoryId: "pharmacology_master", note: "Canonical heparin lesson; includes aPTT monitoring." },
  "Factor Xa Inhibitors": { primaryCategoryId: "pharmacology_master", note: "Cross-listed from cardiovascular." },
  Statins: { primaryCategoryId: "pharmacology_master", note: "Cross-listed from cardiovascular." },
  Phenytoin: { primaryCategoryId: "pharmacology_master", note: "Cross-listed from neurological." },
  Metformin: { primaryCategoryId: "pharmacology_master", note: "Cross-listed from endocrine." },
  Glyburide: { primaryCategoryId: "pharmacology_master", note: "Cross-listed from endocrine." },
  "Thiazide Diuretics": { primaryCategoryId: "pharmacology_master", note: "Cross-listed from endocrine." },
  Allopurinol: { primaryCategoryId: "pharmacology_master", note: "Cross-listed from hematology_oncology_immunology." },
  Linezolid: { primaryCategoryId: "pharmacology_master", note: "Cross-listed from hematology_oncology_immunology." },
  Oxytocin: { primaryCategoryId: "pharmacology_master", note: "Cross-listed from maternity_newborn." },
  Misoprostol: { primaryCategoryId: "pharmacology_master", note: "Cross-listed from maternity_newborn." },
  "Phenelzine and Tyramine Crisis": {
    primaryCategoryId: "pharmacology_master",
    note: "Mental health category lists same title; single monograph with tyramine dietary counseling.",
  },
  "Ziprasidone and QT Prolongation": {
    primaryCategoryId: "pharmacology_master",
    note: "Mental health cross-list; QT/ECG monitoring emphasized.",
  },
  Memantine: { primaryCategoryId: "pharmacology_master", note: "Cross-listed from mental_health." },
  // Conditions
  "Pulmonary Embolism": { primaryCategoryId: "cardiovascular", note: "Also emergency/critical; one RN lesson, PE pathophys + nursing + anticoag." },
  Sepsis: { primaryCategoryId: "emergency_critical_perioperative", note: "Canonical critical-care spine; hematology list references." },
  ARDS: { primaryCategoryId: "respiratory", note: "Also emergency; single lesson with ventilator content." },
  "Neuroleptic Malignant Syndrome": { primaryCategoryId: "mental_health", note: "Also emergency; psychiatric meds + crisis stabilization." },
  "Chest Tubes": { primaryCategoryId: "respiratory", note: "Also emergency; one procedural nursing lesson." },
  "Positive Pressure Ventilation": { primaryCategoryId: "respiratory", note: "Also emergency critical; vent modes + nursing monitoring." },
  "Cardiac Tamponade": { primaryCategoryId: "cardiovascular", note: "Also emergency list; single high-yield lesson." },
  "Cerebral Palsy": { primaryCategoryId: "neurological", note: "Pediatrics hub links; developmental + family (see secondary)." },
  "Acute Lymphoblastic Leukemia": { primaryCategoryId: "hematology_oncology_immunology", note: "Pediatrics cross-index for age-specific nursing." },
  "Acute Myelogenous Leukemia": { primaryCategoryId: "hematology_oncology_immunology", note: "Pediatrics cross-index." },
  "Sickle Cell Disease": { primaryCategoryId: "hematology_oncology_immunology", note: "Pediatrics cross-index." },
  Thalassemia: { primaryCategoryId: "hematology_oncology_immunology", note: "Pediatrics cross-index." },
  "Febrile Seizures": { primaryCategoryId: "neurological", note: "Pediatrics cross-index." },
  "Bronchiolitis and RSV": { primaryCategoryId: "respiratory", note: "Pediatrics cross-index." },
  Epiglottitis: { primaryCategoryId: "respiratory", note: "Pediatrics cross-index." },
  "Wilms Tumor": { primaryCategoryId: "renal_genitourinary", note: "Pediatrics oncology nursing cross-index." },
  "Iron Deficiency Anemia": { primaryCategoryId: "hematology_oncology_immunology", note: "Pediatrics cross-index." },
  "Newborn Hypoglycemia": {
    primaryCategoryId: "maternity_newborn",
    note: "Cross-listed from endocrine_metabolic_fluids; canonical lesson emphasizes newborn assessment, feeds, and protocols.",
  },
  "Bowel Obstruction (Mechanical and Functional)": {
    primaryCategoryId: "gastrointestinal",
    note: "Replaces separate 'Bowel Obstruction' + 'Mechanical Bowel Obstruction' rows — one lesson covering mechanical ileus, obstruction patterns, and priority nursing actions.",
  },
};

/**
 * Staged rollout — **do not** bulk-author all lessons at once. Each phase is a stable import batch.
 * Order: adult high-yield systems → emergency → pharmacology → maternity → pediatrics → mental health → NCLEX priorities/safety.
 */
const STAGED_BUILD_PHASES = [
  {
    phase: 1,
    label: "Adult health (high-yield RN systems)",
    description:
      "Core med-surg and systems nursing: cardiovascular through infectious disease. Highest exam volume per lesson hour.",
    categoryIds: [
      "cardiovascular",
      "respiratory",
      "endocrine_metabolic_fluids",
      "gastrointestinal",
      "neurological",
      "renal_genitourinary",
      "hematology_oncology_immunology",
      "musculoskeletal",
      "integumentary_immune_autoimmune",
      "infectious_disease",
    ],
  },
  {
    phase: 2,
    label: "Emergency / critical care",
    description: "Resuscitation, shock, airway, procedural emergencies, unstable presentations — after core systems are in catalog.",
    categoryIds: ["emergency_critical_perioperative"],
  },
  {
    phase: 3,
    label: "Pharmacology",
    description: "Drug/class monographs and high-alert systems (canonical rows often owned here even when cross-listed under systems).",
    categoryIds: ["pharmacology_master"],
  },
  {
    phase: 4,
    label: "Maternity / newborn",
    description: "OB and neonatal high-yield topics.",
    categoryIds: ["maternity_newborn"],
  },
  {
    phase: 5,
    label: "Pediatrics",
    description: "Age-specific and pediatric-predominant conditions (cross-refs from adult map deduplicated to one primary slug).",
    categoryIds: ["pediatrics"],
  },
  {
    phase: 6,
    label: "Mental health",
    description: "Psychiatric conditions, crises, and related medication safety.",
    categoryIds: ["mental_health"],
  },
  {
    phase: 7,
    label: "Remaining supportive / NCLEX priorities",
    description: "Prioritization, delegation, safety systems, consent, pain multimodal — capstone supportive lessons.",
    categoryIds: ["nclex_nursing_priorities_safety"],
  },
];

const BUILD_ORDER = STAGED_BUILD_PHASES.flatMap((p) => p.categoryIds);

/** Lesson archetype for planning filters — derived from primary category (single source of truth per title). */
function archetypeFor(primaryCategoryId) {
  if (primaryCategoryId === "pharmacology_master") return "medication_monograph";
  if (primaryCategoryId === "emergency_critical_perioperative") return "emergency_critical_care";
  if (primaryCategoryId === "nclex_nursing_priorities_safety") return "nursing_priorities_safety";
  return "condition_disease";
}

function slugify(title) {
  return (
    title
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80) + "-nclex-rn"
  );
}

function main() {
  /** @type {Map<string, { title: string, tier: string, words: [number,number], categories: Set<string> }>} */
  const byTitle = new Map();

  for (const [catId, rows] of Object.entries(CATEGORIES)) {
    for (const [title, tierKey] of rows) {
      const tw = TIER[tierKey];
      if (!byTitle.has(title)) {
        byTitle.set(title, {
          title,
          tier: tw.tier,
          words: tw.words,
          categories: new Set(),
        });
      }
      byTitle.get(title).categories.add(catId);
      // Upgrade tier if we see a higher yield (A > B > C > D)
      const rank = { A: 4, B: 3, C: 2, D: 1 };
      const cur = byTitle.get(title);
      if (rank[tw.tier] > rank[cur.tier]) {
        cur.tier = tw.tier;
        cur.words = tw.words;
      }
    }
  }

  const lessons = [];
  let id = 0;
  for (const [title, rec] of byTitle) {
    const owner = PRIMARY_OWNER[title];
    const primaryCategoryId = owner?.primaryCategoryId ?? [...rec.categories][0];
    const secondaryCategoryIds = [...rec.categories].filter((c) => c !== primaryCategoryId).sort();

    lessons.push({
      id: `rn-map-${String(++id).padStart(4, "0")}`,
      canonicalTitle: title,
      slug: slugify(title),
      tier: rec.tier,
      wordTargetMin: rec.words[0],
      wordTargetMax: rec.words[1],
      primaryCategoryId,
      secondaryCategoryIds,
      mergeNote: owner?.note ?? null,
      archetype: archetypeFor(primaryCategoryId),
      topicSlug: primaryCategoryId.replace(/_/g, "-"),
      bodySystem: humanizeCategory(primaryCategoryId),
    });
  }

  lessons.sort((a, b) => a.canonicalTitle.localeCompare(b.canonicalTitle));

  const byTier = { A: 0, B: 0, C: 0, D: 0 };
  for (const l of lessons) byTier[l.tier]++;

  const byArchetype = {
    condition_disease: 0,
    medication_monograph: 0,
    emergency_critical_care: 0,
    nursing_priorities_safety: 0,
  };
  for (const l of lessons) {
    const a = l.archetype;
    if (byArchetype[a] !== undefined) byArchetype[a]++;
  }

  const crossListed = lessons
    .filter((l) => l.secondaryCategoryIds.length > 0)
    .map((l) => ({
      canonicalTitle: l.canonicalTitle,
      slug: l.slug,
      primaryCategoryId: l.primaryCategoryId,
      secondaryCategoryIds: l.secondaryCategoryIds,
      mergeNote: l.mergeNote,
    }))
    .sort((a, b) => a.canonicalTitle.localeCompare(b.canonicalTitle));

  const doc = {
    version: 1,
    generatedBy: "scripts/generate-rn-nclex-master-map.mjs",
    sourceOfTruth:
      "Inventory + pipeline: docs/rn-nclex-rn-lesson-library.md. Authoring alignment: data/premium-lessons-nclex-core-v1/ + src/content/pathway-lessons/nclex-rn-source-checklist.json — run node scripts/audit-rn-nclex-map.mjs after map changes.",
    pathways: ["us-rn-nclex-rn", "ca-rn-nclex-rn"],
    /** Same categories as `STAGED_BUILD_PHASES` — order preserved for staged rollout. */
    buildOrder: BUILD_ORDER,
    stagedBuildPhases: STAGED_BUILD_PHASES,
    sourceMap: {
      derivedFrom: [
        "NCLEX-aligned curriculum markdown: data/premium-lessons-nclex-core-v1/PREMIUM_CURRICULUM_LESSONS_V1_PART_*.md",
        "Completeness checklist: src/content/pathway-lessons/nclex-rn-source-checklist.json",
        "Per-category title inventory: CATEGORIES in this script (single source before JSON export)",
      ],
      archetypeDefinitions: {
        condition_disease: "Disease, syndrome, or system-specific clinical lesson (primary owner not pharm / emergency / NCLEX-priorities).",
        medication_monograph: "Drug or drug-class lesson (primary category pharmacology_master).",
        emergency_critical_care: "Emergency, critical care, perioperative crisis, or unstable-presentation lesson (primary category emergency_critical_perioperative).",
        nursing_priorities_safety: "Prioritization, delegation, ethics, safety systems (primary category nclex_nursing_priorities_safety).",
      },
      duplicateHandling:
        "Titles appearing in multiple CATEGORIES are merged to one canonical row; PRIMARY_OWNER + mergeNote set primary hub; secondaryCategoryIds preserve hub navigation without second catalog slugs.",
    },
    overlapsAndCrossLists: {
      crossListedLessonCount: crossListed.length,
      crossListedLessons: crossListed,
    },
    contentSpine: "premium_exam_complete",
    contentSpineReference: "src/lib/lessons/exam-complete-lesson-template.ts + pathway-lesson-premium.ts",
    contentDepthRules: CONTENT_DEPTH_RULES,
    categoryTargets: {
      cardiovascular: { minLessons: 18, maxLessons: 24, tierMix: "8–10 A, 6–8 B, 4–6 C" },
      respiratory: { minLessons: 10, maxLessons: 14, tierMix: "4–6 A, 4–6 B, 2–4 C" },
      neurological: { minLessons: 12, maxLessons: 16, tierMix: "5–7 A, 4–6 B, 2–4 C" },
      gastrointestinal: { minLessons: 12, maxLessons: 16, tierMix: "5–7 A, 4–6 B, 2–4 C" },
      renal_genitourinary: { minLessons: 8, maxLessons: 12, tierMix: "3–5 A, 3–4 B, 2–3 C" },
      endocrine_metabolic_fluids: { minLessons: 12, maxLessons: 16, tierMix: "5–7 A, 4–6 B, 3–4 C" },
      hematology_oncology_immunology: { minLessons: 10, maxLessons: 14, tierMix: "4–6 A, 4–5 B, 2–3 C" },
      pediatrics: { minLessons: 18, maxLessons: 24, tierMix: "7–9 A, 7–9 B, 4–6 C/D" },
      maternity_newborn: { minLessons: 18, maxLessons: 24, tierMix: "7–9 A, 7–9 B, 4–6 C" },
      mental_health: { minLessons: 10, maxLessons: 14, tierMix: "3–5 A, 4–5 B, 3–4 C" },
      emergency_critical_perioperative: { minLessons: 14, maxLessons: 18, tierMix: "5–7 A, 5–7 B, 3–4 C" },
      pharmacology_master: { minLessons: 28, maxLessons: 52, tierMix: "2–4 A, 14–22 C, 8–16 D" },
      musculoskeletal: { minLessons: 6, maxLessons: 10, tierMix: "2–4 A, 3–5 B, 1–2 C" },
      integumentary_immune_autoimmune: { minLessons: 4, maxLessons: 8, tierMix: "2–3 A, 2–4 B" },
      infectious_disease: { minLessons: 5, maxLessons: 8, tierMix: "3–4 A, 2–3 B" },
      nclex_nursing_priorities_safety: { minLessons: 5, maxLessons: 8, tierMix: "2–3 A, 2–4 B" },
    },
    aggregates: {
      uniqueLessonCount: lessons.length,
      byTier,
      byArchetype,
      byPrimaryCategory: countPrimary(lessons),
      /** Includes secondaryCategoryIds so hub “coverage” matches cross-listed titles. */
      visibleInCategory: visibleCounts(lessons),
    },
    lessons,
  };

  fs.writeFileSync(OUT, JSON.stringify(doc, null, 2) + "\n", "utf8");
  console.log(`Wrote ${lessons.length} unique lessons to ${path.relative(ROOT, OUT)}`);
}

function humanizeCategory(id) {
  const m = {
    cardiovascular: "Cardiovascular",
    respiratory: "Respiratory",
    neurological: "Neurological",
    gastrointestinal: "Gastrointestinal",
    renal_genitourinary: "Renal / Genitourinary",
    endocrine_metabolic_fluids: "Endocrine / Metabolic / Fluids",
    hematology_oncology_immunology: "Hematology / Oncology / Immunology",
    musculoskeletal: "Musculoskeletal",
    integumentary_immune_autoimmune: "Integumentary / Immune / Autoimmune",
    infectious_disease: "Infectious Disease",
    pediatrics: "Pediatrics",
    maternity_newborn: "Maternity / Newborn",
    mental_health: "Mental Health",
    emergency_critical_perioperative: "Emergency / Critical Care / Perioperative",
    pharmacology_master: "Pharmacology",
    nclex_nursing_priorities_safety: "NCLEX Nursing Priorities / Safety / Delegation",
  };
  return m[id] ?? id;
}

function countPrimary(lessons) {
  const o = {};
  for (const l of lessons) {
    o[l.primaryCategoryId] = (o[l.primaryCategoryId] ?? 0) + 1;
  }
  return o;
}

function visibleCounts(lessons) {
  const ids = [
    "cardiovascular",
    "respiratory",
    "neurological",
    "gastrointestinal",
    "renal_genitourinary",
    "endocrine_metabolic_fluids",
    "hematology_oncology_immunology",
    "musculoskeletal",
    "integumentary_immune_autoimmune",
    "infectious_disease",
    "pediatrics",
    "maternity_newborn",
    "mental_health",
    "emergency_critical_perioperative",
    "pharmacology_master",
    "nclex_nursing_priorities_safety",
  ];
  const o = {};
  for (const cid of ids) {
    o[cid] = lessons.filter(
      (l) => l.primaryCategoryId === cid || (l.secondaryCategoryIds && l.secondaryCategoryIds.includes(cid)),
    ).length;
  }
  return o;
}

main();
