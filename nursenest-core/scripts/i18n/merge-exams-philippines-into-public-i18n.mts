#!/usr/bin/env npx tsx
/**
 * Merges Philippines regional nav keys into every Next `public/i18n/{locale}/*.json` shard tree.
 * English base; Tagalog (`tl`) overlay for nav labels where present.
 *
 * Run from `nursenest-core/`: npx tsx scripts/i18n/merge-exams-philippines-into-public-i18n.mts
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { mergeOverlayIntoNextShards } from "./merge-overlay-into-next-shards.mts";

const __dirname = dirname(fileURLToPath(import.meta.url));

const EN = JSON.parse(readFileSync(join(__dirname, "exams-philippines.en.json"), "utf8")) as Record<string, string>;
const TL = JSON.parse(readFileSync(join(__dirname, "exams-philippines.tl.json"), "utf8")) as Record<string, string>;

function overlayForLocale(locale: string): Record<string, string> {
  const base = { ...EN };
  if (locale === "tl") {
    Object.assign(base, TL);
    return base;
  }
  return base;
}

function main() {
  mergeOverlayIntoNextShards("merge-exams-philippines", overlayForLocale);
}

main();
