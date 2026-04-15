#!/usr/bin/env npx tsx
/**
 * Merges Australia exams hub + nav i18n keys into every Next `public/i18n/{locale}/*.json` shard tree.
 * English base for all locales; Arabic and migrant-language overlays merged on top where present.
 *
 * Run from `nursenest-core/`:
 *   npx tsx scripts/i18n/merge-exams-australia-into-public-i18n.mts
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { mergeOverlayIntoNextShards } from "./merge-overlay-into-next-shards.mts";

const __dirname = dirname(fileURLToPath(import.meta.url));

const EN = JSON.parse(readFileSync(join(__dirname, "exams-australia.en.json"), "utf8")) as Record<string, string>;
const AR = JSON.parse(readFileSync(join(__dirname, "exams-australia.ar.json"), "utf8")) as Record<string, string>;
const HI = JSON.parse(readFileSync(join(__dirname, "exams-australia.hi.json"), "utf8")) as Record<string, string>;
const TL = JSON.parse(readFileSync(join(__dirname, "exams-australia.tl.json"), "utf8")) as Record<string, string>;
const PA = JSON.parse(readFileSync(join(__dirname, "exams-australia.pa.json"), "utf8")) as Record<string, string>;
const ZH = JSON.parse(readFileSync(join(__dirname, "exams-australia.zh.json"), "utf8")) as Record<string, string>;

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
  if (locale === "pa") {
    Object.assign(base, PA);
    return base;
  }
  if (locale === "zh") {
    Object.assign(base, ZH);
    return base;
  }
  return base;
}

function main() {
  mergeOverlayIntoNextShards("merge-exams-australia", overlayForLocale);
}

main();
