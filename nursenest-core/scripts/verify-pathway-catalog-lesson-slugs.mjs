#!/usr/bin/env node
/**
 * Sanity-check static catalog: every pathway lesson must have a non-empty slug.
 * Run: node scripts/verify-pathway-catalog-lesson-slugs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const catalogPath = path.join(root, "src/content/pathway-lessons/catalog.json");

const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const bad = [];
for (const [pathwayId, data] of Object.entries(catalog.pathways ?? {})) {
  for (const l of data.lessons ?? []) {
    if (typeof l.slug !== "string" || l.slug.trim() === "") {
      bad.push({ pathwayId, title: l.title ?? "(no title)" });
    }
  }
}

if (bad.length) {
  console.error(`Found ${bad.length} catalog lesson(s) with missing slug:`);
  console.error(bad.slice(0, 50));
  if (bad.length > 50) console.error(`… and ${bad.length - 50} more`);
  process.exit(1);
}

console.log("OK: all catalog pathway lessons have non-empty slugs.");
