#!/usr/bin/env npx tsx
/**
 * Merges Hungary exams hub + nav i18n into every `public/i18n/{locale}.json` bundle.
 * English base; Hungarian (hu) full overlay; de/ro/ar partial overlays.
 *
 * Run from `nursenest-core/`: npx tsx scripts/i18n/merge-exams-hungary-into-public-i18n.mts
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const PUBLIC = join(ROOT, "public", "i18n");

const EN = JSON.parse(readFileSync(join(__dirname, "exams-hungary.en.json"), "utf8")) as Record<string, string>;
const HU = JSON.parse(readFileSync(join(__dirname, "exams-hungary.hu.json"), "utf8")) as Record<string, string>;
const DE = JSON.parse(readFileSync(join(__dirname, "exams-hungary.de.json"), "utf8")) as Record<string, string>;
const RO = JSON.parse(readFileSync(join(__dirname, "exams-hungary.ro.json"), "utf8")) as Record<string, string>;
const AR = JSON.parse(readFileSync(join(__dirname, "exams-hungary.ar.json"), "utf8")) as Record<string, string>;

function overlayForLocale(locale: string): Record<string, string> {
  const base = { ...EN };
  if (locale === "hu") {
    Object.assign(base, HU);
    return base;
  }
  if (locale === "de") {
    Object.assign(base, DE);
    return base;
  }
  if (locale === "ro") {
    Object.assign(base, RO);
    return base;
  }
  if (locale === "ar") {
    Object.assign(base, AR);
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
  console.log(`[merge-exams-hungary] merged keys into ${n} locale bundles.`);
}

main();
