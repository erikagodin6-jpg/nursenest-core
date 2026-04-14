#!/usr/bin/env npx tsx
/**
 * Merges Italy exams hub + nav i18n into every `public/i18n/{locale}.json` bundle.
 * English base; Italian (it) full overlay; ar/es partial overlays.
 *
 * Run from `nursenest-core/`: npx tsx scripts/i18n/merge-exams-italy-into-public-i18n.mts
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const PUBLIC = join(ROOT, "public", "i18n");

const EN = JSON.parse(readFileSync(join(__dirname, "exams-italy.en.json"), "utf8")) as Record<string, string>;
const IT = JSON.parse(readFileSync(join(__dirname, "exams-italy.it.json"), "utf8")) as Record<string, string>;
const AR = JSON.parse(readFileSync(join(__dirname, "exams-italy.ar.json"), "utf8")) as Record<string, string>;
const ES = JSON.parse(readFileSync(join(__dirname, "exams-italy.es.json"), "utf8")) as Record<string, string>;

function overlayForLocale(locale: string): Record<string, string> {
  const base = { ...EN };
  if (locale === "it") {
    Object.assign(base, IT);
    return base;
  }
  if (locale === "ar") {
    Object.assign(base, AR);
    return base;
  }
  if (locale === "es") {
    Object.assign(base, ES);
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
  console.log(`[merge-exams-italy] merged keys into ${n} locale bundles.`);
}

main();
