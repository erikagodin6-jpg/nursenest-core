/**
 * Validates master topic map: unique IDs, counts, catalog collisions.
 * Run: node scripts/validate-master-topic-map.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const mapPath = path.join(import.meta.dirname, "../src/content/topic-maps/master-topic-map.json");
const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));

function normalizeTitle(s) {
  return s
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function tokenSet(s) {
  return new Set(
    normalizeTitle(s)
      .split(" ")
      .filter((w) => w.length > 2),
  );
}

function jaccard(a, b) {
  let inter = 0;
  for (const x of a) {
    if (b.has(x)) inter += 1;
  }
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

let exit = 0;
const examKeys = ["RN", "PN", "NP", "ALLIED"];
let totalTopics = 0;
const globalIds = new Set();

for (const key of examKeys) {
  const exam = map.exams[key];
  if (!exam) {
    console.error("Missing exam", key);
    exit = 1;
    continue;
  }
  const seen = new Set();
  let n = 0;
  for (const cat of exam.categories) {
    for (const t of cat.topics) {
      n += 1;
      const composite = `${key}:${t.id}`;
      if (seen.has(t.id)) {
        console.error(`Duplicate topic id in ${key}:`, t.id);
        exit = 1;
      }
      seen.add(t.id);
      if (globalIds.has(composite)) {
        console.error("Global duplicate", composite);
        exit = 1;
      }
      globalIds.add(composite);
      if (!t.name?.trim()) {
        console.error("Empty topic name", key, t.id);
        exit = 1;
      }
      if (!Array.isArray(t.questionTopicHints) || t.questionTopicHints.length === 0) {
        console.warn("Missing questionTopicHints", key, t.id);
      }
    }
  }
  console.log(`${key}: ${n} topics, ${exam.categories.length} categories`);
  totalTopics += n;
}

console.log("Total topics:", totalTopics);

const catalog = require("../src/content/pathway-lessons/catalog.json");
const catalogTitles = [];
for (const [pathwayId, bundle] of Object.entries(catalog.pathways ?? {})) {
  for (const lesson of bundle.lessons ?? []) {
    if (lesson.title) catalogTitles.push({ pathwayId, title: lesson.title });
  }
}

let collisions = 0;
for (const key of examKeys) {
  for (const cat of map.exams[key].categories) {
    for (const t of cat.topics) {
      const tn = normalizeTitle(t.name);
      const tt = tokenSet(t.name);
      for (const c of catalogTitles) {
        const cn = normalizeTitle(c.title);
        if (tn.length >= 8 && cn.length >= 8 && (tn === cn || tn.includes(cn) || cn.includes(tn))) {
          console.warn(`[collision:match] ${key}/${t.id} ~ ${c.pathwayId}: "${t.name}" vs "${c.title}"`);
          collisions += 1;
          break;
        }
        const jac = jaccard(tt, tokenSet(c.title));
        if (jac >= 0.72 && tt.size >= 3) {
          console.warn(`[collision:overlap] ${key}/${t.id} ~ ${c.pathwayId}: "${t.name}" vs "${c.title}" (${jac.toFixed(2)})`);
          collisions += 1;
          break;
        }
      }
    }
  }
}

console.log("Catalog collision warnings:", collisions);
console.log(exit === 0 ? "OK" : "FAILED");
process.exit(exit);
