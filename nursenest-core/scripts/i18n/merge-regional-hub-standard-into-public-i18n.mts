#!/usr/bin/env npx tsx
/**
 * Merges shared regional hub truth / language-note keys into every Next `public/i18n/{locale}/*.json` shard tree.
 * Uses English semantic strings for all locales to avoid missing-key UI leakage.
 *
 * Run from nursenest-core/: npx tsx scripts/i18n/merge-regional-hub-standard-into-public-i18n.mts
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { mergeOverlayIntoNextShards } from "./merge-overlay-into-next-shards.mts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OVERLAY = JSON.parse(readFileSync(join(__dirname, "regional-hub-standard.en.json"), "utf8")) as Record<string, string>;

function main() {
  mergeOverlayIntoNextShards("merge-regional-hub-standard", () => OVERLAY);
}

main();
