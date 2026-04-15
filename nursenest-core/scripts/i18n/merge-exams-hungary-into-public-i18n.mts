#!/usr/bin/env npx tsx
/**
 * Merges Hungary exams hub + nav i18n into every Next `public/i18n/{locale}/*.json` shard tree.
 * English base; Hungarian (hu) full overlay; de/ro/ar partial overlays.
 *
 * Run from `nursenest-core/`: npx tsx scripts/i18n/merge-exams-hungary-into-public-i18n.mts
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { mergeOverlayIntoNextShards } from "./merge-overlay-into-next-shards.mts";

const __dirname = dirname(fileURLToPath(import.meta.url));

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
  mergeOverlayIntoNextShards("merge-exams-hungary", overlayForLocale);
}

main();
