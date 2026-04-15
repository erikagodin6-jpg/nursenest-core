#!/usr/bin/env npx tsx
/**
 * Merges Middle East exams hub + nav i18n keys into every Next `public/i18n/{locale}/*.json` shard tree.
 * - Arabic (`ar`): full Arabic overlay
 * - Hindi (`hi`), Tagalog (`tl`), Urdu (`ur`): partial overlays merged on top of English for those keys
 * - All other locales: English overlay (all keys present; no runtime missing keys)
 *
 * Run from `nursenest-core/`:
 *   npx tsx scripts/i18n/merge-exams-middle-east-into-public-i18n.mts
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { mergeOverlayIntoNextShards } from "./merge-overlay-into-next-shards.mts";

const __dirname = dirname(fileURLToPath(import.meta.url));

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
  mergeOverlayIntoNextShards("merge-exams-middle-east", overlayForLocale);
}

main();
