#!/usr/bin/env npx tsx
/**
 * Merges Japan exams hub + nav i18n keys into every Next `public/i18n/{locale}/*.json` shard tree.
 * English base for all locales; Japanese (ja) full overlay; zh/tl/vi partial overlays.
 *
 * Run from `nursenest-core/`:
 *   npx tsx scripts/i18n/merge-exams-japan-into-public-i18n.mts
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { mergeOverlayIntoNextShards } from "./merge-overlay-into-next-shards.mts";

const __dirname = dirname(fileURLToPath(import.meta.url));

const EN = JSON.parse(readFileSync(join(__dirname, "exams-japan.en.json"), "utf8")) as Record<string, string>;
const JA = JSON.parse(readFileSync(join(__dirname, "exams-japan.ja.json"), "utf8")) as Record<string, string>;
const ZH = JSON.parse(readFileSync(join(__dirname, "exams-japan.zh.json"), "utf8")) as Record<string, string>;
const TL = JSON.parse(readFileSync(join(__dirname, "exams-japan.tl.json"), "utf8")) as Record<string, string>;
const VI = JSON.parse(readFileSync(join(__dirname, "exams-japan.vi.json"), "utf8")) as Record<string, string>;

function overlayForLocale(locale: string): Record<string, string> {
  const base = { ...EN };
  if (locale === "ja") {
    Object.assign(base, JA);
    return base;
  }
  if (locale === "zh") {
    Object.assign(base, ZH);
    return base;
  }
  if (locale === "tl") {
    Object.assign(base, TL);
    return base;
  }
  if (locale === "vi") {
    Object.assign(base, VI);
    return base;
  }
  return base;
}

function main() {
  mergeOverlayIntoNextShards("merge-exams-japan", overlayForLocale);
}

main();
