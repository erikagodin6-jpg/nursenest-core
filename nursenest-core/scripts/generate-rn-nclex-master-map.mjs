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
    ["Airborne Precautions", "C"],
  ],
  neurological: [
    ["Increased Intracranial Pressure", "A"],
    ["Increased ICP in Infants", "A"],
    ["Hydrocephalus in Children", "B"],
    ["Ventriculoperitoneal Shunt", "B"],
    ["Bacterial Meningitis", "A"],
    ["Febrile Seizures", "B"],
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
    ["Diabetic Ketoacidosis", "A"],
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
    ["Eclampsia", "A"],
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
    ["Malignant Dysrhythmia Red Flags", "A"],
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
    ["Grapefruit Juice Drug Interactions", "D"],
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

const BUILD_ORDER = [
  "cardiovascular",
  "respiratory",
  "endocrine_metabolic_fluids",
  "gastrointestinal",
  "neurological",
  "emergency_critical_perioperative",
  "pharmacology_master",
  "maternity_newborn",
  "pediatrics",
  "mental_health",
];

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
      topicSlug: primaryCategoryId.replace(/_/g, "-"),
      bodySystem: humanizeCategory(primaryCategoryId),
    });
  }

  lessons.sort((a, b) => a.canonicalTitle.localeCompare(b.canonicalTitle));

  const byTier = { A: 0, B: 0, C: 0, D: 0 };
  for (const l of lessons) byTier[l.tier]++;

  const doc = {
    version: 1,
    generatedBy: "scripts/generate-rn-nclex-master-map.mjs",
    sourceOfTruth:
      "Align lesson bodies to your uploaded NCLEX outline/PDF. Completeness checklist (audit targets): src/content/pathway-lessons/nclex-rn-source-checklist.json — run node scripts/audit-rn-nclex-map.mjs after map changes.",
    pathways: ["us-rn-nclex-rn", "ca-rn-nclex-rn"],
    buildOrder: BUILD_ORDER,
    contentSpine: "premium_exam_complete",
    contentSpineReference: "src/lib/lessons/exam-complete-lesson-template.ts + pathway-lesson-premium.ts",
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
      pharmacology_master: { minLessons: 20, maxLessons: 28, tierMix: "2–4 A, 10–14 C, 6–10 D" },
    },
    aggregates: {
      uniqueLessonCount: lessons.length,
      byTier,
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
    pediatrics: "Pediatrics",
    maternity_newborn: "Maternity / Newborn",
    mental_health: "Mental Health",
    emergency_critical_perioperative: "Emergency / Critical Care / Perioperative",
    pharmacology_master: "Pharmacology",
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
    "pediatrics",
    "maternity_newborn",
    "mental_health",
    "emergency_critical_perioperative",
    "pharmacology_master",
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
