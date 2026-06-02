#!/usr/bin/env node
/**
 * Idempotent RN NCLEX catalog rows from `rn-nclex-master-map.json` — one primary category at a time.
 * Does not load full lesson bodies: metadata + empty `sections` (detail pages expand via pathway-lesson-loader).
 *
 * Usage:
 *   node scripts/rn-nclex-catalog-import-category.mjs --category cardiovascular [--dry-run]
 *   node scripts/rn-nclex-catalog-import-category.mjs --category endocrine_metabolic_fluids --pathways us-rn-nclex-rn
 *
 * Aliases: endocrine, fluids, emergency, pharmacology, maternity, mental-health → canonical primaryCategoryId keys.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MAP_PATH = path.join(ROOT, "src/content/pathway-lessons/rn-nclex-master-map.json");
const CATALOG_PATH = path.join(ROOT, "src/content/pathway-lessons/catalog.json");
const STATE_PATH = path.join(ROOT, "src/content/pathway-lessons/rn-nclex-catalog-import-state.json");

const DEFAULT_PATHWAYS = ["us-rn-nclex-rn", "ca-rn-nclex-rn"];

/** User-facing order → primaryCategoryId in map */
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
  "emergency-critical": "emergency_critical_perioperative",
  emergency_critical_perioperative: "emergency_critical_perioperative",
  pharmacology: "pharmacology_master",
  pharmacology_master: "pharmacology_master",
  maternity: "maternity_newborn",
  "maternity-newborn": "maternity_newborn",
  maternity_newborn: "maternity_newborn",
  pediatrics: "pediatrics",
  "mental-health": "mental_health",
  mental_health: "mental_health",
  musculoskeletal: "musculoskeletal",
  "integumentary-immune": "integumentary_immune_autoimmune",
  integumentary_immune_autoimmune: "integumentary_immune_autoimmune",
  "infectious-disease": "infectious_disease",
  infectious_disease: "infectious_disease",
  "nclex-priorities": "nclex_nursing_priorities_safety",
  "nclex-safety": "nclex_nursing_priorities_safety",
  nclex_nursing_priorities_safety: "nclex_nursing_priorities_safety",
  renal: "renal_genitourinary",
  "renal-genitourinary": "renal_genitourinary",
  renal_genitourinary: "renal_genitourinary",
  hematology: "hematology_oncology_immunology",
  "hematology-oncology": "hematology_oncology_immunology",
  hematology_oncology_immunology: "hematology_oncology_immunology",
};

function tierToExamRelevance(tier) {
  if (tier === "A") return "high_yield";
  if (tier === "B") return "core";
  return "specialty";
}

function regionLabel(pathwayId) {
  return pathwayId.startsWith("ca-") ? "Canada" : "US";
}

function titleForPathway(canonicalTitle, pathwayId) {
  const suffix = pathwayId.startsWith("ca-") ? "(NCLEX-RN, Canada)" : "(NCLEX-RN, US)";
  return `${canonicalTitle} ${suffix}`;
}

function seoCopy(lesson, pathwayId) {
  const region = regionLabel(pathwayId);
  const sys = lesson.bodySystem ?? "this domain";
  const seoTitle = `${lesson.canonicalTitle} | NCLEX-RN ${region} lesson`;
  const seoDescription = `${lesson.canonicalTitle}: NCLEX-RN ${region} study focus for ${sys} — assessment, prioritization, interventions, and exam-style judgment. Tier ${lesson.tier} lesson target ${lesson.wordTargetMin}–${lesson.wordTargetMax} words when expanded.`;
  return { seoTitle, seoDescription };
}

function parseArgs(argv) {
  let category = "";
  let dryRun = false;
  let pathways = [...DEFAULT_PATHWAYS];
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") dryRun = true;
    else if (a.startsWith("--category=")) category = a.slice("--category=".length).trim();
    else if (a === "--category") category = (argv[++i] ?? "").trim();
    else if (a.startsWith("--pathways=")) pathways = a.slice("--pathways=".length).split(",").map((s) => s.trim()).filter(Boolean);
    else if (a === "--pathways") pathways = (argv[++i] ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  }
  return { category, dryRun, pathways };
}

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_PATH, "utf8"));
  } catch {
    return { version: 1, runs: [] };
  }
}

function saveState(state) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + "\n", "utf8");
}

/**
 * Stable related refs: up to 4 other slugs in same category batch (map order), excluding self.
 */
function relatedRefsFor(orderedSlugs, slug, titleBySlug) {
  const others = orderedSlugs.filter((s) => s !== slug);
  const out = [];
  for (const s of others) {
    if (out.length >= 4) break;
    out.push({ slug: s, titleHint: (titleBySlug.get(s) ?? s).slice(0, 80) });
  }
  return out;
}

function buildRow(lesson, pathwayId, orderedSlugs, titleBySlug) {
  const { seoTitle, seoDescription } = seoCopy(lesson, pathwayId);
  const refs = relatedRefsFor(orderedSlugs, lesson.slug, titleBySlug);
  return {
    slug: lesson.slug,
    title: titleForPathway(lesson.canonicalTitle, pathwayId),
    topic: lesson.bodySystem,
    topicSlug: lesson.topicSlug,
    bodySystem: lesson.bodySystem,
    previewSectionCount: 1,
    seoTitle,
    seoDescription,
    sections: [],
    audienceTiers: ["rn"],
    countryScope: pathwayId.startsWith("ca-") ? "ca" : "us",
    examRelevance: tierToExamRelevance(lesson.tier),
    ...(refs.length ? { relatedLessonRefs: refs } : {}),
  };
}

function resolveCategoryId(raw) {
  const k = raw.trim().toLowerCase().replace(/\s+/g, "-");
  return CATEGORY_ALIASES[k] ?? CATEGORY_ALIASES[raw] ?? raw;
}

function main() {
  const { category: rawCat, dryRun, pathways } = parseArgs(process.argv);
  if (!rawCat) {
    console.error("Usage: node scripts/rn-nclex-catalog-import-category.mjs --category <id|alias> [--dry-run] [--pathways a,b]");
    process.exit(1);
  }

  const categoryId = resolveCategoryId(rawCat);
  const map = JSON.parse(fs.readFileSync(MAP_PATH, "utf8"));
  const batch = map.lessons.filter((l) => l.primaryCategoryId === categoryId);
  if (!batch.length) {
    console.error(`No lessons with primaryCategoryId="${categoryId}" (from "${rawCat}").`);
    process.exit(1);
  }

  batch.sort((a, b) => a.canonicalTitle.localeCompare(b.canonicalTitle));
  const orderedSlugs = batch.map((l) => l.slug);
  const titleBySlug = new Map(batch.map((l) => [l.slug, l.canonicalTitle]));

  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  const state = loadState();

  for (const pathwayId of pathways) {
    if (!catalog.pathways[pathwayId]) {
      console.error(`Unknown pathway: ${pathwayId}`);
      process.exit(1);
    }
    const lessons = catalog.pathways[pathwayId].lessons;
    const existing = new Set(lessons.map((l) => l.slug));
    const toAdd = [];
    for (const lesson of batch) {
      if (existing.has(lesson.slug)) continue;
      toAdd.push(buildRow(lesson, pathwayId, orderedSlugs, titleBySlug));
    }

    console.log(`[${pathwayId}] category=${categoryId} map=${batch.length} existing=${batch.length - toAdd.length} toAdd=${toAdd.length}`);

    if (dryRun) {
      for (const row of toAdd) console.log("  +", row.slug);
      continue;
    }

    if (toAdd.length === 0) {
      console.log(`  (no new rows)`);
      continue;
    }

    lessons.push(...toAdd);
    state.runs = state.runs ?? [];
    state.runs.push({
      ts: new Date().toISOString(),
      categoryId,
      pathwayId,
      added: toAdd.length,
      slugs: toAdd.map((r) => r.slug),
    });
  }

  if (dryRun) return;

  const tmp = `${CATALOG_PATH}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(catalog, null, 2) + "\n", "utf8");
  fs.renameSync(tmp, CATALOG_PATH);
  saveState(state);
  console.log(`Wrote ${path.relative(ROOT, CATALOG_PATH)}`);
  console.log(`State log ${path.relative(ROOT, STATE_PATH)}`);
}

main();
