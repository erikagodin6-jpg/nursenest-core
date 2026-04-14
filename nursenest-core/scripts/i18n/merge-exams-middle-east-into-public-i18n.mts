#!/usr/bin/env npx tsx
/**
 * Merges Middle East exams hub + nav i18n keys into every `public/i18n/{locale}.json` bundle.
 * - Arabic (`ar`): full Arabic overlay
 * - Hindi (`hi`), Tagalog (`tl`), Urdu (`ur`): partial overlays merged on top of English for those keys
 * - All other locales: English overlay (all keys present; no runtime missing keys)
 *
 * Run from `nursenest-core/`:
 *   npx tsx scripts/i18n/merge-exams-middle-east-into-public-i18n.mts
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const PUBLIC = join(ROOT, "public", "i18n");

const EN = JSON.parse(readFileSync(join(__dirname, "exams-middle-east.en.json"), "utf8")) as Record<string, string>;
const AR = JSON.parse(readFileSync(join(__dirname, "exams-middle-east.ar.json"), "utf8")) as Record<string, string>;
const HI = JSON.parse(readFileSync(join(__dirname, "exams-middle-east.hi.json"), "utf8")) as Record<string, string>;
const TL = JSON.parse(readFileSync(join(__dirname, "exams-middle-east.tl.json"), "utf8")) as Record<string, string>;
const UR = JSON.parse(readFileSync(join(__dirname, "exams-middle-east.ur.json"), "utf8")) as Record<string, string>;

function overlayForLocale(locale: string): Record<string, string> {
  const base = { ...EN };
  if (locale === "ar") {
    Object.assign(base, AR);
    return base;
  }
  if (locale === "hi") {
    Object.assign(base, HI);
    return base;
  }
  if (locale === "tl") {
    Object.assign(base, TL);
    return base;
  }
  if (locale === "ur") {
    Object.assign(base, UR);
    return base;
  }
  return base;
}

function main() {
  const files = readdirSync(PUBLIC).filter((f) => f.endsWith(".json") && !f.includes("/"));
  let n = 0;
  for (const file of files) {
    const locale = file.replace(/\.json$/, "");
    const fp = join(PUBLIC, file);
    const raw = readFileSync(fp, "utf8");
    const data = JSON.parse(raw) as Record<string, string>;
    const overlay = overlayForLocale(locale);
    for (const [k, v] of Object.entries(overlay)) {
      data[k] = v;
    }
    writeFileSync(fp, JSON.stringify(data));
    n += 1;
  }
  console.log(`[merge-exams-middle-east] merged keys into ${n} locale bundles.`);
}

main();
