#!/usr/bin/env node
/**
 * Merges bundles/parts/{locale}-*.json into wave1-{locale}.manifest.json
 * Each part file must be a single-key object: { "pathwayId:slug": { ...payload } }
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const partsDir = path.join(__dirname, "bundles", "parts");

function mergeLocale(locale) {
  const files = fs
    .readdirSync(partsDir)
    .filter((f) => f.startsWith(`${locale}-`) && f.endsWith(".json"))
    .sort();
  if (files.length === 0) {
    console.error(`No parts for locale ${locale} in ${partsDir}`);
    process.exit(1);
  }
  const lessons = {};
  for (const f of files) {
    const raw = JSON.parse(fs.readFileSync(path.join(partsDir, f), "utf8"));
    for (const [k, v] of Object.entries(raw)) {
      if (lessons[k]) {
        console.warn(`duplicate key ${k} in ${f} — later file wins`);
      }
      lessons[k] = v;
    }
  }
  const items = Object.entries(lessons).map(([sourceId, payload]) => ({
    sourceKind: "PATHWAY_LESSON",
    sourceId,
    status: "PUBLISHED",
    payload,
  }));
  const out = { version: 1, locale, items };
  const outPath = path.join(__dirname, `wave1-${locale}.manifest.json`);
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + "\n");
  console.log(`wrote ${outPath} (${items.length} items)`);
}

const locales = process.argv.slice(2);
const run = locales.length ? locales : ["fr", "es", "tl"];
for (const loc of run) mergeLocale(loc);
