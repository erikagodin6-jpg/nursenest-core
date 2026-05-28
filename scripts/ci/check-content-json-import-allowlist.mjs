#!/usr/bin/env node
/**
 * Prevent new imports of large @/content/* JSON trees into the app without an explicit allowlist.
 * Keeps Next.js server bundles from accidentally pulling new lesson-bank-sized files.
 *
 * Run from repository root: node scripts/ci/check-content-json-import-allowlist.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const srcRoot = path.join(repoRoot, "nursenest-core", "src");

/** Only these pathway-lesson JSON files may be imported from application code. */
const PATHWAY_LESSONS_ALLOW = new Set([
  "catalog.json",
  "allied-bundled-catalog.json",
  // TypeScript registry/shard files — small manifests, not bundle-bloating JSON
  "registry",
  "respiratory-therapy",
  // Allied dedicated catalog shards intentionally imported by the server-side allied registry.
  "pharmacy-technician",
  "medical-laboratory-technology",
  "medical-imaging",
  "emergency-medical-services",
  "sonography",
  "medical-assistant",
  "dental-hygiene",
  "physiotherapy-rehab",
  "occupational-therapy",
  "mental-health-social-work",
  "dietetic-technician",
  "new-grad-transition-catalog.json",
  "rn-nclex-master-map.json",
  "rn-nclex-cardiovascular-expansion-catalog.json",
  "rn-nclex-neurological-expansion-catalog.json",
  "rn-nclex-hematology-oncology-expansion-catalog.json",
  "rn-nclex-gastrointestinal-expansion-catalog.json",
  "rn-nclex-integumentary-wound-care-expansion-catalog.json",
  "rn-nclex-infection-control-expansion-catalog.json",
  "rn-nclex-leadership-delegation-expansion-catalog.json",
  "rn-nclex-maternal-newborn-expansion-catalog.json",
  "rn-nclex-procedures-skills-expansion-catalog.json",
  "rn-nclex-nutrition-expansion-catalog.json",
  "rn-nclex-exam-strategy-expansion-catalog.json",
  "rn-nclex-respiratory-expansion-catalog.json",
  "rn-nclex-renal-expansion-catalog.json",
  "rn-nclex-endocrine-expansion-catalog.json",
  "rn-nclex-musculoskeletal-expansion-catalog.json",
  "rn-nclex-fluids-electrolytes-expansion-catalog.json",
]);

/** topic-maps/ — keep tiny; expand allowlist deliberately if adding files. */
const TOPIC_MAPS_ALLOW = new Set(["master-topic-map.json"]);

const IMPORT_RE = /@\/content\/pathway-lessons\/([^"'\s]+)/g;
const TOPIC_RE = /@\/content\/topic-maps\/([^"'\s]+)/g;

function walk(dir, acc) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name);
    if (name.isDirectory()) {
      if (name.name === "node_modules" || name.name === ".next") continue;
      walk(full, acc);
    } else if (name.isFile() && /\.(ts|tsx|mts|cts)$/.test(name.name)) acc.push(full);
  }
}

const files = [];
walk(srcRoot, files);

let bad = 0;
for (const fp of files) {
  const text = fs.readFileSync(fp, "utf8");
  let m;
  IMPORT_RE.lastIndex = 0;
  while ((m = IMPORT_RE.exec(text))) {
    const leaf = m[1].split("/").pop();
    if (!PATHWAY_LESSONS_ALLOW.has(leaf)) {
      const rel = path.relative(repoRoot, fp).replace(/\\/g, "/");
      console.error(
        `::error:: check-content-json-import-allowlist: disallowed pathway-lessons import "${m[1]}" in ${rel} — use DB/Spaces or add a deliberate allowlist entry in scripts/ci/check-content-json-import-allowlist.mjs`,
      );
      bad += 1;
    }
  }
  TOPIC_RE.lastIndex = 0;
  while ((m = TOPIC_RE.exec(text))) {
    const leaf = m[1].split("/").pop();
    if (!TOPIC_MAPS_ALLOW.has(leaf)) {
      const rel = path.relative(repoRoot, fp).replace(/\\/g, "/");
      console.error(
        `::error:: check-content-json-import-allowlist: disallowed topic-maps import "${m[1]}" in ${rel}`,
      );
      bad += 1;
    }
  }
}

if (bad) process.exit(1);
console.log("check-content-json-import-allowlist: OK");
