#!/usr/bin/env node
/**
 * Reads `src/content/tools-overlays-all.json` as { "fr": { key: val }, ... }
 * and merges each locale object into `tools/i18n/marketing/locale/marketing-{locale}.json`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentRoot = path.join(__dirname, "../src/content");
const allPath = path.join(contentRoot, "tools-overlays-all.json");
const data = JSON.parse(fs.readFileSync(allPath, "utf8"));
const localeDir = path.join(__dirname, "../../../tools/i18n/marketing/locale");

for (const [locale, overlay] of Object.entries(data)) {
  const marketingPath = path.join(localeDir, `marketing-${locale}.json`);
  let base = {};
  try {
    base = JSON.parse(fs.readFileSync(marketingPath, "utf8"));
  } catch {
    base = {};
  }
  const merged = { ...base, ...overlay };
  fs.writeFileSync(marketingPath, JSON.stringify(merged, null, 2) + "\n");
  console.log("updated", locale, Object.keys(overlay).length, "keys");
}
