#!/usr/bin/env npx tsx
/**
 * Merges Korea exams hub + nav i18n keys into every Next `public/i18n/{locale}/*.json` shard tree.
 * English base for all locales; Korean (ko) full overlay; zh/hi/tl partial overlays.
 *
 * Run from `nursenest-core/`:
 *   npx tsx scripts/i18n/merge-exams-korea-into-public-i18n.mts
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { mergeOverlayIntoNextShards } from "./merge-overlay-into-next-shards.mts";

const __dirname = dirname(fileURLToPath(import.meta.url));

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
  mergeOverlayIntoNextShards("merge-exams-korea", overlayForLocale);
}

main();
