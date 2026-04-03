#!/usr/bin/env node
/**
 * Merge hand-tuned nav/footer/breadcrumb/shell UI strings from
 * `scripts/data/nav-ui-quality-overrides.json` into `public/i18n/<locale>.json`.
 *
 * Usage (from nursenest-core/): node scripts/apply-nav-ui-quality-overrides.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DATA = path.join(__dirname, "data", "nav-ui-quality-overrides.json");
const I18N = path.join(ROOT, "public", "i18n");

const overrides = JSON.parse(fs.readFileSync(DATA, "utf8"));

let total = 0;
for (const [locale, patch] of Object.entries(overrides)) {
  const p = path.join(I18N, `${locale}.json`);
  if (!fs.existsSync(p)) {
    console.warn(`skip missing ${p}`);
    continue;
  }
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  let n = 0;
  for (const [k, v] of Object.entries(patch)) {
    if (typeof v !== "string") continue;
    j[k] = v;
    n += 1;
  }
  fs.writeFileSync(p, JSON.stringify(j));
  total += n;
  console.log(`[${locale}] wrote ${n} keys → ${p}`);
}
console.log(`\nDone. ${total} total keys updated.`);
