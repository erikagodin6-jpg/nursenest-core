#!/usr/bin/env npx tsx
/**
 * Merges Korea exams hub + nav i18n keys into every `public/i18n/{locale}.json` bundle.
 * English base for all locales; Korean (ko) full overlay; zh/hi/tl partial overlays.
 *
 * Run from `nursenest-core/`:
 *   npx tsx scripts/i18n/merge-exams-korea-into-public-i18n.mts
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const PUBLIC = join(ROOT, "public", "i18n");

const EN = JSON.parse(readFileSync(join(__dirname, "exams-korea.en.json"), "utf8")) as Record<string, string>;
const KO = JSON.parse(readFileSync(join(__dirname, "exams-korea.ko.json"), "utf8")) as Record<string, string>;
const ZH = JSON.parse(readFileSync(join(__dirname, "exams-korea.zh.json"), "utf8")) as Record<string, string>;
const HI = JSON.parse(readFileSync(join(__dirname, "exams-korea.hi.json"), "utf8")) as Record<string, string>;
const TL = JSON.parse(readFileSync(join(__dirname, "exams-korea.tl.json"), "utf8")) as Record<string, string>;

function overlayForLocale(locale: string): Record<string, string> {
  const base = { ...EN };
  if (locale === "ko") {
    Object.assign(base, KO);
    return base;
  }
  if (locale === "zh") {
    Object.assign(base, ZH);
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
  console.log(`[merge-exams-korea] merged keys into ${n} locale bundles.`);
}

main();
