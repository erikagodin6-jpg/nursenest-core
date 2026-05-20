#!/usr/bin/env npx tsx
/**
 * Merges Portugal exams hub + nav i18n into every Next `public/i18n/{locale}/*.json` shard tree.
 * English base; Portuguese (pt) full overlay; es/fr/ar partial overlays.
 *
 * Run from `nursenest-core/`: npx tsx scripts/i18n/merge-exams-portugal-into-public-i18n.mts
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { mergeOverlayIntoNextShards } from "./merge-overlay-into-next-shards.mts";

const __dirname = dirname(fileURLToPath(import.meta.url));

const EN = JSON.parse(readFileSync(join(__dirname, "exams-portugal.en.json"), "utf8")) as Record<string, string>;
const PT = JSON.parse(readFileSync(join(__dirname, "exams-portugal.pt.json"), "utf8")) as Record<string, string>;
const ES = JSON.parse(readFileSync(join(__dirname, "exams-portugal.es.json"), "utf8")) as Record<string, string>;
const FR = JSON.parse(readFileSync(join(__dirname, "exams-portugal.fr.json"), "utf8")) as Record<string, string>;
const AR = JSON.parse(readFileSync(join(__dirname, "exams-portugal.ar.json"), "utf8")) as Record<string, string>;

function overlayForLocale(locale: string): Record<string, string> {
  const base = { ...EN };
  if (locale === "pt") {
    Object.assign(base, PT);
    return base;
  }
  if (locale === "es") {
    Object.assign(base, ES);
    return base;
  }
  if (locale === "fr") {
    Object.assign(base, FR);
    return base;
  }
  if (locale === "ar") {
    Object.assign(base, AR);
    return base;
  }
  return base;
}

function main() {
  mergeOverlayIntoNextShards("merge-exams-portugal", overlayForLocale);
}

main();
