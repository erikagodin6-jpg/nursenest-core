#!/usr/bin/env node
/**
 * Prints RN NCLEX master map aggregates: counts by primary category and tier.
 * Run: node scripts/rn-nclex-inventory-report.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MAP = path.join(ROOT, "src/content/pathway-lessons/rn-nclex-master-map.json");

function main() {
  const doc = JSON.parse(fs.readFileSync(MAP, "utf8"));
  const byCat = {};
  const byTier = { A: 0, B: 0, C: 0, D: 0 };
  for (const l of doc.lessons) {
    byCat[l.primaryCategoryId] = (byCat[l.primaryCategoryId] ?? 0) + 1;
    byTier[l.tier] = (byTier[l.tier] ?? 0) + 1;
  }
  console.log(`RN NCLEX master map: ${doc.lessons.length} unique lessons\n`);
  console.log("By primary category:");
  for (const k of Object.keys(byCat).sort()) {
    console.log(`  ${k}: ${byCat[k]}`);
  }
  console.log("\nBy tier:");
  for (const t of ["A", "B", "C", "D"]) {
    console.log(`  ${t}: ${byTier[t] ?? 0}`);
  }
  if (doc.aggregates?.visibleInCategory) {
    console.log("\nVisible in category (primary + secondary index):");
    for (const [k, v] of Object.entries(doc.aggregates.visibleInCategory).sort(([a], [b]) => a.localeCompare(b))) {
      console.log(`  ${k}: ${v}`);
    }
  }
}

main();
