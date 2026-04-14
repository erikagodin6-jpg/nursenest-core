#!/usr/bin/env npx tsx
/**
 * Merges shared regional hub truth / language-note keys into every public/i18n bundle.
 * Uses English semantic strings for all locales to avoid missing-key UI leakage.
 *
 * Run from nursenest-core/: npx tsx scripts/i18n/merge-regional-hub-standard-into-public-i18n.mts
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const PUBLIC = join(ROOT, "public", "i18n");
const OVERLAY = JSON.parse(readFileSync(join(__dirname, "regional-hub-standard.en.json"), "utf8")) as Record<string, string>;

function main() {
  const files = readdirSync(PUBLIC).filter((f) => f.endsWith(".json") && !f.includes("/"));
  let n = 0;
  for (const file of files) {
    const fp = join(PUBLIC, file);
    const raw = readFileSync(fp, "utf8");
    const data = JSON.parse(raw) as Record<string, string>;
    for (const [k, v] of Object.entries(OVERLAY)) {
      data[k] = v;
    }
    writeFileSync(fp, JSON.stringify(data));
    n += 1;
  }
  console.log(`[merge-regional-hub-standard] merged keys into ${n} locale bundles.`);
}

main();
