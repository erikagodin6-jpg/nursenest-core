#!/usr/bin/env npx tsx
/**
 * Merges Italy exams hub + nav i18n into every Next `public/i18n/{locale}/*.json` shard tree.
 * English base; Italian (it) full overlay; ar/es partial overlays.
 *
 * Run from `nursenest-core/`: npx tsx scripts/i18n/merge-exams-italy-into-public-i18n.mts
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { mergeOverlayIntoNextShards } from "./merge-overlay-into-next-shards.mts";

const __dirname = dirname(fileURLToPath(import.meta.url));

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
  mergeOverlayIntoNextShards("merge-exams-italy", overlayForLocale);
}

main();
