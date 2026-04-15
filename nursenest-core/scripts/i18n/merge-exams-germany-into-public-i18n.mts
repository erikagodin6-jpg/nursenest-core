#!/usr/bin/env npx tsx
/**
 * Merges Germany exams hub + nav i18n into every Next `public/i18n/{locale}/*.json` shard tree.
 * English base; German (de) full overlay; ar/tr/hi/ro partial overlays.
 *
 * Run from `nursenest-core/`: npx tsx scripts/i18n/merge-exams-germany-into-public-i18n.mts
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { mergeOverlayIntoNextShards } from "./merge-overlay-into-next-shards.mts";

const __dirname = dirname(fileURLToPath(import.meta.url));

const EN = JSON.parse(readFileSync(join(__dirname, "exams-germany.en.json"), "utf8")) as Record<string, string>;
const DE = JSON.parse(readFileSync(join(__dirname, "exams-germany.de.json"), "utf8")) as Record<string, string>;
const AR = JSON.parse(readFileSync(join(__dirname, "exams-germany.ar.json"), "utf8")) as Record<string, string>;
const TR = JSON.parse(readFileSync(join(__dirname, "exams-germany.tr.json"), "utf8")) as Record<string, string>;
const HI = JSON.parse(readFileSync(join(__dirname, "exams-germany.hi.json"), "utf8")) as Record<string, string>;
const RO = JSON.parse(readFileSync(join(__dirname, "exams-germany.ro.json"), "utf8")) as Record<string, string>;

function overlayForLocale(locale: string): Record<string, string> {
  const base = { ...EN };
  if (locale === "de") {
    Object.assign(base, DE);
    return base;
  }
  if (locale === "ar") {
    Object.assign(base, AR);
    return base;
  }
  if (locale === "tr") {
    Object.assign(base, TR);
    return base;
  }
  if (locale === "hi") {
    Object.assign(base, HI);
    return base;
  }
  if (locale === "ro") {
    Object.assign(base, RO);
    return base;
  }
  return base;
}

function main() {
  mergeOverlayIntoNextShards("merge-exams-germany", overlayForLocale);
}

main();
