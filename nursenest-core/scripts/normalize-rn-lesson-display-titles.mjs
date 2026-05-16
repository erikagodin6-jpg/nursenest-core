#!/usr/bin/env node
/**
 * Normalize visible RN NCLEX lesson card titles in catalog.json.
 *
 * This keeps SEO metadata exam/region-specific while making the learner-facing
 * lesson list simple and readable: "COPD", "Deep Vein Thrombosis", etc.
 *
 * Usage from nursenest-core/:
 *   node scripts/normalize-rn-lesson-display-titles.mjs
 *   node scripts/normalize-rn-lesson-display-titles.mjs --apply
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CATALOG_PATH = path.join(ROOT, "src/content/pathway-lessons/catalog.json");
const RN_PATHWAYS = new Set(["us-rn-nclex-rn", "ca-rn-nclex-rn"]);

const EXACT_TITLE_OVERRIDES = new Map([
  ["Deep Vein Thrombosis (DVT): Prevention and Nursing Management", "Deep Vein Thrombosis"],
  ["Diabetes Mellitus: Type 1 and Type 2 Nursing Management", "Diabetes Mellitus"],
  ["Acute Kidney Injury: Prerenal, Intrarenal, and Postrenal Patterns", "Acute Kidney Injury"],
  ["Hyperkalemia: Recognition and Correction", "Hyperkalemia"],
  ["Seizures and Status Epilepticus: Acute Nursing Management", "Seizures and Status Epilepticus"],
  ["Shock: Recognition, Classification, and Nursing Priorities", "Shock"],
  ["Nursing Prioritization: ABCs and Urgent vs Important", "Nursing Prioritization"],
  ["Defibrillation vs Synchronized Cardioversion", "Defibrillation and Cardioversion"],
  ["Bowel Obstruction (Mechanical and Functional)", "Bowel Obstruction"],
  ["Inflammatory Bowel Disease (Crohn Disease and Ulcerative Colitis)", "Inflammatory Bowel Disease"],
  ["Upper and Lower Gastrointestinal Bleeding", "Gastrointestinal Bleeding"],
  ["HIV/AIDS: Nursing Care and Post-Exposure Prophylaxis", "HIV/AIDS"],
  ["Tuberculosis (Latent and Active)", "Tuberculosis"],
  ["Blood Product Administration and Transfusion Reactions", "Blood Transfusion Reactions"],
  ["Physical Restraints: Indications, Monitoring, and Alternatives", "Physical Restraints"],
  ["High-Alert Medications: Systems Safety and Independent Double Checks", "High-Alert Medications"],
  ["Multimodal Pain Management: Assessment and Escalation", "Multimodal Pain Management"],
  ["Insulin: Types, Administration, and Hypoglycemia Response", "Insulin"],
  ["Nitrates and Nitroglycerin: Routes and Monitoring", "Nitrates and Nitroglycerin"],
  ["Morphine: ACS, PE, and Respiratory Depression Monitoring", "Morphine"],
  ["SSRIs and SNRIs: Initiation, Monitoring, and Serotonin Syndrome", "SSRIs and SNRIs"],
  ["Albuterol and Beta-Agonists in Bronchospasm and Adjunct Hyperkalemia Therapy", "Albuterol and Beta-Agonists"],
  ["Dextrose: Hypoglycemia Rescue and DKA Adjunct Therapy", "Dextrose"],
  ["Thrombolytic Therapy: tPA, Indications, and Bleeding Monitoring", "Thrombolytic Therapy"],
]);

function stripRegionSuffix(title) {
  return title.replace(/\s*\(NCLEX-RN,\s*(?:US|Canada)\)\s*$/i, "").trim();
}

function normalizeVisibleTitle(rawTitle) {
  const noRegion = stripRegionSuffix(String(rawTitle ?? ""));
  const exact = EXACT_TITLE_OVERRIDES.get(noRegion);
  if (exact) return exact;

  // Keep short explanatory parentheses when they are clinically part of the name, but remove
  // generic subtitle tails that make lesson cards look like article headlines.
  const colonIndex = noRegion.indexOf(":");
  if (colonIndex > 0) return noRegion.slice(0, colonIndex).trim();

  return noRegion
    .replace(/\s+Nursing Management$/i, "")
    .replace(/\s+Patient Teaching$/i, "")
    .replace(/\s+Nursing Care$/i, "")
    .replace(/\s+and Nursing Management$/i, "")
    .trim();
}

function main() {
  const apply = process.argv.includes("--apply");
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  const changes = [];
  const duplicateBuckets = new Map();

  for (const pathwayId of RN_PATHWAYS) {
    const lessons = catalog.pathways?.[pathwayId]?.lessons ?? [];
    for (const lesson of lessons) {
      const before = lesson.title;
      const normalized = normalizeVisibleTitle(before || lesson.topic || lesson.slug);
      if (normalized && before !== normalized) {
        changes.push({ pathwayId, slug: lesson.slug, before, after: normalized });
        if (apply) lesson.title = normalized;
      }

      const key = `${pathwayId}:${normalized.toLowerCase()}`;
      const bucket = duplicateBuckets.get(key) ?? [];
      bucket.push(lesson.slug);
      duplicateBuckets.set(key, bucket);
    }
  }

  const duplicates = [...duplicateBuckets.entries()]
    .filter(([, slugs]) => slugs.length > 1)
    .map(([key, slugs]) => ({ pathwayId: key.split(":")[0], title: key.split(":").slice(1).join(":"), slugs }));

  if (apply) {
    fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2) + "\n", "utf8");
  }

  console.log(
    JSON.stringify(
      {
        apply,
        changedVisibleTitles: changes.length,
        duplicateVisibleTitleBuckets: duplicates.length,
        changes: changes.slice(0, 80),
        duplicates,
      },
      null,
      2,
    ),
  );

  if (duplicates.length > 0) {
    process.exitCode = 1;
  }
}

main();
