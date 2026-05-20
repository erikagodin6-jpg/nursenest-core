#!/usr/bin/env node
/**
 * Verify catalog.json contains every RN master-map slug for a primary category
 * and that topicSlug matches the map row when the lesson exists.
 *
 *   node scripts/rn-nclex-catalog-verify-category.mjs cardiovascular
 *   node scripts/rn-nclex-catalog-verify-category.mjs --all
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MAP_PATH = path.join(ROOT, "src/content/pathway-lessons/rn-nclex-master-map.json");
const CATALOG_PATH = path.join(ROOT, "src/content/pathway-lessons/catalog.json");

const PATHWAYS = ["us-rn-nclex-rn", "ca-rn-nclex-rn"];

const CATEGORY_ALIASES = {
  cardiovascular: "cardiovascular",
  respiratory: "respiratory",
  endocrine: "endocrine_metabolic_fluids",
  "endocrine-metabolic-fluids": "endocrine_metabolic_fluids",
  endocrine_metabolic_fluids: "endocrine_metabolic_fluids",
  "fluids-electrolytes": "endocrine_metabolic_fluids",
  gastrointestinal: "gastrointestinal",
  neurological: "neurological",
  emergency: "emergency_critical_perioperative",
  emergency_critical_perioperative: "emergency_critical_perioperative",
  pharmacology: "pharmacology_master",
  pharmacology_master: "pharmacology_master",
  maternity: "maternity_newborn",
  maternity_newborn: "maternity_newborn",
  pediatrics: "pediatrics",
  "mental-health": "mental_health",
  mental_health: "mental_health",
};

function resolveCategoryId(raw) {
  const k = raw.trim().toLowerCase().replace(/\s+/g, "-");
  return CATEGORY_ALIASES[k] ?? CATEGORY_ALIASES[raw] ?? raw;
}

function verifyOne(map, catalog, categoryId) {
  const mapLessons = map.lessons.filter((l) => l.primaryCategoryId === categoryId);
  const mapSlugs = new Set(mapLessons.map((l) => l.slug));
  const mapBySlug = new Map(mapLessons.map((l) => [l.slug, l]));
  let failed = false;

  for (const pathwayId of PATHWAYS) {
    const rows = catalog.pathways[pathwayId]?.lessons ?? [];
    const bySlug = new Map(rows.map((l) => [l.slug, l]));
    const missing = [...mapSlugs].filter((s) => !bySlug.has(s));
    const wrongTopic = [];
    for (const s of mapSlugs) {
      const row = bySlug.get(s);
      const m = mapBySlug.get(s);
      if (row && m && row.topicSlug !== m.topicSlug) wrongTopic.push(s);
    }

    const ok = missing.length === 0 && wrongTopic.length === 0;
    if (!ok) failed = true;
    console.log(
      `${categoryId} / ${pathwayId}: map=${mapSlugs.size} missing=${missing.length} topicSlugMismatch=${wrongTopic.length} ${ok ? "OK" : "FAIL"}`,
    );
    if (missing.length) console.log("  missing:", missing.join(", "));
    if (wrongTopic.length) console.log("  topicSlug mismatch:", wrongTopic.join(", "));
  }
  return !failed;
}

function main() {
  const map = JSON.parse(fs.readFileSync(MAP_PATH, "utf8"));
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  const arg = process.argv[2];
  if (!arg) {
    console.error("Usage: node scripts/rn-nclex-catalog-verify-category.mjs <category|alias> | --all");
    process.exit(1);
  }

  const ids = arg === "--all" ? map.buildOrder ?? [] : [resolveCategoryId(arg)];

  let allOk = true;
  for (const id of ids) {
    allOk = verifyOne(map, catalog, id) && allOk;
  }
  process.exit(allOk ? 0 : 1);
}

main();
