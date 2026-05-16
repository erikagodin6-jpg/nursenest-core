#!/usr/bin/env node
/**
 * Normalize lesson titles and de-duplicate same-pathway lesson variants.
 *
 * Goal:
 * - Lesson hub titles should be simple canonical topics: "COPD", not "COPD Management".
 * - Same pathway should not show duplicate topic variants: care, management, review, basics,
 *   discharge teaching, nursing interventions, etc.
 * - Cross-tier variants are allowed, but each tier/pathway gets one canonical hub lesson per topic.
 *
 * Usage:
 *   node scripts/normalize-lesson-titles-and-deduplicate.mjs --dry-run
 *   node scripts/normalize-lesson-titles-and-deduplicate.mjs --write
 *
 * The script is intentionally conservative:
 * - It only deprecates duplicates inside the same pathway.
 * - It keeps the richer lesson by section count/body length, then redirects thinner variants.
 * - It preserves legacy slugs and records canonicalLessonId / redirectedToSlug for loaders/redirectors.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CATALOG_DIR = path.join(ROOT, "src/content/pathway-lessons");
const WRITE = process.argv.includes("--write");

const SKIP_FILES = [
  "master-map",
  "import-state",
  "aliases",
  "checklist",
  "generated-indexes",
];

const SUFFIX_PATTERNS = [
  /\s*[:\-–—]\s*(nclex|rex-pn|cnple|exam)\s*(review|prep|focus)?\s*$/i,
  /\s*\b(nclex|rex-pn|cnple|exam)\s*(review|prep|focus)?\s*$/i,
  /\s*\b(for nurses|for nursing|nursing)\s*$/i,
  /\s*\b(nursing care|nursing management|nursing interventions|care plan|care)\s*$/i,
  /\s*\b(management|treatment|treatments|interventions|assessment|diagnostics)\s*$/i,
  /\s*\b(discharge teaching|patient teaching|client education|education|teaching)\s*$/i,
  /\s*\b(basics|overview|review|fundamentals|introduction|intro|pathophysiology)\s*$/i,
  /\s*\b(medications|pharmacology|therapy|complications)\s*$/i,
];

const PREFIX_PATTERNS = [
  /^\s*(rn|rpn|pn|np|allied)\s*[:\-–—]\s*/i,
  /^\s*(nursing care for|nursing management of|management of|treatment of|care of the|care of|introduction to|overview of)\s+/i,
];

const LEGITIMATE_SPLITS = [
  /\bexacerbation\b/i,
  /\bpediatric|paediatric|neonatal|newborn|pregnancy|prenatal|postpartum\b/i,
  /\bprocedure|osce|delegation|prioritization|scope\b/i,
  /\becg interpretation\b/i,
  /\bprescribing|differential diagnosis|diagnosis\b/i,
  /\bacute coronary syndrome\b/i,
];

const TITLE_OVERRIDES = new Map([
  ["copd", "COPD"],
  ["chronic obstructive pulmonary disease", "COPD"],
  ["chf", "Heart Failure"],
  ["congestive heart failure", "Heart Failure"],
  ["heart failure", "Heart Failure"],
  ["atrial fib", "Atrial Fibrillation"],
  ["atrial fibrillation", "Atrial Fibrillation"],
  ["a fib", "Atrial Fibrillation"],
  ["afib", "Atrial Fibrillation"],
  ["supraventricular tachycardia", "Supraventricular Tachycardia (SVT)"],
  ["svt", "Supraventricular Tachycardia (SVT)"],
  ["diabetes mellitus", "Diabetes"],
  ["dm", "Diabetes"],
  ["myocardial infarction", "Myocardial Infarction"],
  ["mi", "Myocardial Infarction"],
  ["cva", "Stroke"],
  ["cerebrovascular accident", "Stroke"],
  ["hypertension", "Hypertension"],
  ["htn", "Hypertension"],
  ["dka", "DKA"],
  ["diabetic ketoacidosis", "DKA"],
  ["siadh", "SIADH"],
]);

const KEY_ALIASES = new Map([
  ["chronic obstructive pulmonary disease", "copd"],
  ["congestive heart failure", "heart failure"],
  ["chf", "heart failure"],
  ["atrial fib", "atrial fibrillation"],
  ["a fib", "atrial fibrillation"],
  ["afib", "atrial fibrillation"],
  ["svt", "supraventricular tachycardia"],
  ["dm", "diabetes"],
  ["diabetes mellitus", "diabetes"],
  ["cva", "stroke"],
  ["cerebrovascular accident", "stroke"],
  ["htn", "hypertension"],
  ["diabetic ketoacidosis", "dka"],
]);

function titleCase(input) {
  const small = new Set(["and", "or", "of", "the", "for", "in", "to", "with"]);
  return input
    .split(/\s+/)
    .filter(Boolean)
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (TITLE_OVERRIDES.has(lower)) return TITLE_OVERRIDES.get(lower);
      if (index > 0 && small.has(lower)) return lower;
      if (/^[A-Z0-9]{2,}$/.test(word)) return word;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ")
    .replace(/\bDvt\b/g, "DVT")
    .replace(/\bPe\b/g, "PE")
    .replace(/\bCopd\b/g, "COPD")
    .replace(/\bDka\b/g, "DKA")
    .replace(/\bSiadh\b/g, "SIADH")
    .replace(/\bStemi\b/g, "STEMI")
    .replace(/\bNstemi\b/g, "NSTEMI")
    .replace(/\bSvt\b/g, "SVT");
}

function stripNoise(title) {
  let t = String(title || "").trim();
  t = t.replace(/\s*\((rn|rpn|pn|np|allied|nclex|rex-pn|cnple|canada|us|specific|np-specific)\)\s*/gi, " ").trim();
  for (const pattern of PREFIX_PATTERNS) t = t.replace(pattern, "").trim();

  let changed = true;
  while (changed) {
    changed = false;
    for (const pattern of SUFFIX_PATTERNS) {
      const next = t.replace(pattern, "").trim();
      if (next !== t && next.length >= 2) {
        t = next;
        changed = true;
      }
    }
  }

  return t.replace(/[\s:;,.\-–—/&]+$/g, "").replace(/\s+/g, " ").trim();
}

function canonicalTitle(title) {
  const original = String(title || "").trim();
  if (!original) return original;

  // Do not collapse truly distinct clinical/scope lessons by title.
  if (LEGITIMATE_SPLITS.some((pattern) => pattern.test(original))) return original;

  const stripped = stripNoise(original);
  const key = stripped.toLowerCase();
  if (TITLE_OVERRIDES.has(key)) return TITLE_OVERRIDES.get(key);
  return titleCase(stripped);
}

function canonicalKey(title) {
  let key = stripNoise(title).toLowerCase();
  key = key.replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  if (KEY_ALIASES.has(key)) key = KEY_ALIASES.get(key);
  return key;
}

function contentWeight(lesson) {
  const sections = Array.isArray(lesson.sections) ? lesson.sections.length : 0;
  const bodyLength = JSON.stringify(lesson.sections || lesson.body || lesson.content || "").length;
  return sections * 100000 + bodyLength;
}

function visitLessons(raw, visitor) {
  if (raw?.pathways && typeof raw.pathways === "object") {
    for (const [pathwayId, pathway] of Object.entries(raw.pathways)) {
      const lessons = Array.isArray(pathway?.lessons) ? pathway.lessons : Array.isArray(pathway) ? pathway : [];
      lessons.forEach((lesson) => visitor(lesson, pathwayId));
    }
    return;
  }
  if (Array.isArray(raw?.lessons)) raw.lessons.forEach((lesson) => visitor(lesson, raw.pathwayId || "unknown"));
  if (Array.isArray(raw)) raw.forEach((lesson) => visitor(lesson, "unknown"));
}

function loadCatalogFiles() {
  return fs.readdirSync(CATALOG_DIR)
    .filter((file) => file.endsWith(".json"))
    .filter((file) => !SKIP_FILES.some((skip) => file.includes(skip)))
    .map((file) => ({ file, fullPath: path.join(CATALOG_DIR, file) }));
}

const files = loadCatalogFiles();
const all = [];
const parsedFiles = [];

for (const entry of files) {
  const source = fs.readFileSync(entry.fullPath, "utf8");
  if (!source.trim()) continue;
  const raw = JSON.parse(source);
  parsedFiles.push({ ...entry, raw });

  visitLessons(raw, (lesson, pathwayId) => {
    if (!lesson || !lesson.slug || !lesson.title) return;
    if (lesson.deprecatedAt || lesson.canonicalLessonId) return;
    const nextTitle = canonicalTitle(lesson.title);
    const key = canonicalKey(nextTitle);
    all.push({ lesson, pathwayId, file: entry.file, key, nextTitle, weight: contentWeight(lesson) });
  });
}

const titleChanges = [];
for (const item of all) {
  if (item.lesson.title !== item.nextTitle) {
    titleChanges.push({ file: item.file, pathwayId: item.pathwayId, slug: item.lesson.slug, from: item.lesson.title, to: item.nextTitle });
    if (WRITE) item.lesson.title = item.nextTitle;
  }
}

const byPathwayKey = new Map();
for (const item of all) {
  const groupKey = `${item.pathwayId}::${item.key}`;
  if (!byPathwayKey.has(groupKey)) byPathwayKey.set(groupKey, []);
  byPathwayKey.get(groupKey).push(item);
}

const duplicateActions = [];
for (const [groupKey, group] of byPathwayKey.entries()) {
  const uniqueSlugs = new Map();
  for (const item of group) uniqueSlugs.set(item.lesson.slug, item);
  const candidates = [...uniqueSlugs.values()];
  if (candidates.length < 2) continue;

  candidates.sort((a, b) => b.weight - a.weight || String(a.lesson.slug).localeCompare(String(b.lesson.slug)));
  const canonical = candidates[0];
  for (const duplicate of candidates.slice(1)) {
    duplicateActions.push({
      pathwayId: duplicate.pathwayId,
      key: duplicate.key,
      deprecatedSlug: duplicate.lesson.slug,
      deprecatedTitle: duplicate.lesson.title,
      canonicalSlug: canonical.lesson.slug,
      canonicalTitle: canonical.nextTitle,
      file: duplicate.file,
    });

    if (WRITE) {
      duplicate.lesson.title = canonical.nextTitle;
      duplicate.lesson.canonicalLessonId = canonical.lesson.slug;
      duplicate.lesson.redirectedToSlug = canonical.lesson.slug;
      duplicate.lesson.hiddenFromLessonHub = true;
      duplicate.lesson.deprecatedAt = new Date().toISOString();
      duplicate.lesson.deprecationReason = "Merged into canonical lesson topic to prevent duplicate lesson hub entries.";
    }
  }
}

if (WRITE) {
  for (const entry of parsedFiles) {
    fs.writeFileSync(entry.fullPath, `${JSON.stringify(entry.raw, null, 2)}\n`);
  }
}

console.log(`${WRITE ? "WRITE" : "DRY-RUN"}: lesson title normalization and duplicate cleanup`);
console.log(`Catalog files scanned: ${parsedFiles.length}`);
console.log(`Active lessons scanned: ${all.length}`);
console.log(`Title simplifications: ${titleChanges.length}`);
console.log(`Same-pathway duplicate deprecations: ${duplicateActions.length}`);

if (titleChanges.length) {
  console.log("\nTitle simplifications:");
  for (const change of titleChanges.slice(0, 150)) {
    console.log(`- [${change.pathwayId}] ${change.slug}: "${change.from}" → "${change.to}"`);
  }
  if (titleChanges.length > 150) console.log(`... plus ${titleChanges.length - 150} more`);
}

if (duplicateActions.length) {
  console.log("\nDuplicate lessons to deprecate/redirect:");
  for (const action of duplicateActions.slice(0, 150)) {
    console.log(`- [${action.pathwayId}] ${action.deprecatedSlug} → ${action.canonicalSlug} (${action.canonicalTitle})`);
  }
  if (duplicateActions.length > 150) console.log(`... plus ${duplicateActions.length - 150} more`);
}

if (!WRITE) {
  console.log("\nNo files changed. Re-run with --write to apply.");
}
