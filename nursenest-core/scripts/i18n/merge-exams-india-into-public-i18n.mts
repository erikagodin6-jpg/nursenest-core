#!/usr/bin/env npx tsx
/**
 * Merges India exams hub + nav i18n keys into every Next `public/i18n/{locale}/*.json` shard tree.
 * - Hindi (`hi`) uses `exams-india.hi.json`
 * - All other locales use `exams-india.en.json` (same semantic content in English to avoid missing keys)
 *
 * Run from `nursenest-core/`:
 *   npx tsx scripts/i18n/merge-exams-india-into-public-i18n.mts
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { mergeOverlayIntoNextShards } from "./merge-overlay-into-next-shards.mts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const EN_OVERLAY = JSON.parse(readFileSync(join(__dirname, "exams-india.en.json"), "utf8")) as Record<string, string>;
const HI_OVERLAY = JSON.parse(readFileSync(join(__dirname, "exams-india.hi.json"), "utf8")) as Record<string, string>;

function main() {
  mergeOverlayIntoNextShards("merge-exams-india", (locale) => (locale === "hi" ? HI_OVERLAY : EN_OVERLAY));
}

main();
