#!/usr/bin/env node
/**
 * Merges `tools/i18n/marketing/locale/overlay-tools-*.json` into `marketing-*.json` for each locale code.
 * Run after editing overlay fragments: `node scripts/merge-tool-overlays.mjs`
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localeDir = path.join(__dirname, "../../../tools/i18n/marketing/locale");

const files = fs.readdirSync(localeDir).filter((f) => /^overlay-tools-[a-z-]+\.json$/i.test(f));

for (const f of files) {
  const code = f.replace(/^overlay-tools-/i, "").replace(/\.json$/i, "");
  const marketingPath = path.join(localeDir, `marketing-${code}.json`);
  const overlay = JSON.parse(fs.readFileSync(path.join(localeDir, f), "utf8"));
  let base = {};
  try {
    base = JSON.parse(fs.readFileSync(marketingPath, "utf8"));
  } catch {
    base = {};
  }
  const merged = { ...base, ...overlay };
  fs.writeFileSync(marketingPath, JSON.stringify(merged, null, 2) + "\n");
  console.log("merged", f, "->", path.basename(marketingPath));
}
