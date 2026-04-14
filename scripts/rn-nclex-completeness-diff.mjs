#!/usr/bin/env node
/**
 * Compares premium NCLEX-core manifest (24-topic spine) to RN master map canonical titles.
 * Does not fuzzy-match catalog slugs — inventory-level alignment only.
 *
 * Run: node scripts/rn-nclex-completeness-diff.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MANIFEST = path.join(ROOT, "data/premium-lessons-nclex-core-v1/manifest.json");
const MAP = path.join(ROOT, "src/content/pathway-lessons/rn-nclex-master-map.json");

/** Manifest lesson title → expected master-map style keywords (editorial hints). */
const MANIFEST_TO_MAP_HINTS = {
  "Acute Coronary Syndrome": ["Acute Coronary Syndrome"],
  "Heart Failure": ["Heart Failure"],
  Dysrhythmias: ["Dysrhythmias"],
  Shock: ["Shock"],
  COPD: ["COPD"],
  Asthma: ["Asthma"],
  Pneumonia: ["Community-Acquired Pneumonia"],
  Stroke: ["Stroke"],
  "Increased Intracranial Pressure": ["Increased Intracranial Pressure"],
  Seizures: ["Seizures and Status Epilepticus", "Febrile Seizures"],
  "Diabetes Mellitus": ["Diabetes Mellitus: Type 1 and Type 2 Nursing Management", "Diabetic Ketoacidosis"],
  "DKA vs HHS": ["Diabetic Ketoacidosis"],
  "Thyroid Disorders": ["Thyroid Storm and Myxedema Coma"],
  "Acute Kidney Injury": ["Acute Kidney Injury"],
  "Electrolyte Imbalances": ["Hyperkalemia", "Hypoglycemia", "SIADH", "Diabetes Insipidus"],
  Sepsis: ["Sepsis"],
  "Infection Control and Isolation": ["Isolation Precautions"],
  "Preeclampsia and Eclampsia": ["Preeclampsia and Eclampsia", "HELLP"],
  "Postpartum Hemorrhage": ["Postpartum Hemorrhage"],
  "Pediatric Dehydration": ["Bronchiolitis"],
  "Pediatric Respiratory Distress": ["Asthma", "Bronchiolitis"],
  "Suicide Risk and Mental Health Crisis": ["Suicide Risk Assessment"],
  "High-Alert Medications": ["High-Alert Medications"],
  "Pain Management": ["Multimodal Pain Management", "Pain"],
};

function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  const mapDoc = JSON.parse(fs.readFileSync(MAP, "utf8"));
  const titles = new Set(mapDoc.lessons.map((l) => l.canonicalTitle));

  console.log("Premium manifest vs RN master map (keyword coverage)\n");

  for (const row of manifest.lessons) {
    const title = row.title;
    const hints = MANIFEST_TO_MAP_HINTS[title];
    if (!hints) {
      console.log(`? ${title} — add MANIFEST_TO_MAP_HINTS in script`);
      continue;
    }
    const ok = hints.some((h) => [...titles].some((t) => t.includes(h)));
    console.log(`${ok ? "✓" : "✗"} ${title}`);
    if (!ok) console.log(`    expected keywords: ${hints.join(", ")}`);
  }

  console.log(`\nMaster map unique lessons: ${mapDoc.lessons.length}`);
}

main();
