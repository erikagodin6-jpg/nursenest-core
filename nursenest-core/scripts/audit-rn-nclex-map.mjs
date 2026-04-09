#!/usr/bin/env node
/**
 * Completeness audit: RN master map vs nclex-rn-source-checklist.json.
 * Run: node scripts/audit-rn-nclex-map.mjs
 * Exit 1 if any checklist title is missing from the map (exact canonicalTitle match).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MAP = path.join(ROOT, "src/content/pathway-lessons/rn-nclex-master-map.json");
const CHECK = path.join(ROOT, "src/content/pathway-lessons/nclex-rn-source-checklist.json");

function resolveItem(aliases, raw) {
  const t = raw.trim();
  if (aliases[t]) return aliases[t];
  return t;
}

function main() {
  const map = JSON.parse(fs.readFileSync(MAP, "utf8"));
  const check = JSON.parse(fs.readFileSync(CHECK, "utf8"));
  const titles = new Set(map.lessons.map((l) => l.canonicalTitle));
  const aliases = check.aliases ?? {};

  /** @type {string[]} */
  const expected = [];
  for (const g of check.requiredTopics ?? []) {
    for (const item of g.items ?? []) {
      expected.push(resolveItem(aliases, item));
    }
  }

  const missing = expected.filter((e) => !titles.has(e));
  const extraAliasesSatisfied = Object.entries(aliases).filter(([, full]) => titles.has(full));

  console.log(`Map unique lessons: ${map.lessons.length}`);
  console.log(`Checklist resolved requirements: ${expected.length}`);
  console.log(`Alias rows pointing at a present lesson: ${extraAliasesSatisfied.length}/${Object.keys(aliases).length}`);

  if (missing.length) {
    console.error("\nMissing canonical titles (add to generate-rn-nclex-master-map.mjs CATEGORIES):");
    for (const m of missing) console.error(" -", m);
    process.exit(1);
  }
  console.log("\nAudit OK — every checklist item matches a canonicalTitle.");
}

main();
