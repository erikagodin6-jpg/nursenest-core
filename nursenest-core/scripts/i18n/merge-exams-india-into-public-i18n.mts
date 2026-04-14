#!/usr/bin/env npx tsx
/**
 * Merges India exams hub + nav i18n keys into every `public/i18n/{locale}.json` bundle.
 * - Hindi (`hi`) uses `exams-india.hi.json`
 * - All other locales use `exams-india.en.json` (same semantic content in English to avoid missing keys)
 *
 * Run from `nursenest-core/`:
 *   npx tsx scripts/i18n/merge-exams-india-into-public-i18n.mts
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const PUBLIC = join(ROOT, "public", "i18n");
const EN_OVERLAY = JSON.parse(readFileSync(join(__dirname, "exams-india.en.json"), "utf8")) as Record<string, string>;
const HI_OVERLAY = JSON.parse(readFileSync(join(__dirname, "exams-india.hi.json"), "utf8")) as Record<string, string>;

function main() {
  const files = readdirSync(PUBLIC).filter((f) => f.endsWith(".json") && !f.includes("/"));
  let n = 0;
  for (const file of files) {
    const locale = file.replace(/\.json$/, "");
    const fp = join(PUBLIC, file);
    const raw = readFileSync(fp, "utf8");
    const data = JSON.parse(raw) as Record<string, string>;
    const overlay = locale === "hi" ? HI_OVERLAY : EN_OVERLAY;
    for (const [k, v] of Object.entries(overlay)) {
      data[k] = v;
    }
    writeFileSync(fp, JSON.stringify(data));
    n += 1;
  }
  console.log(`[merge-exams-india] merged keys into ${n} locale bundles.`);
}

main();
