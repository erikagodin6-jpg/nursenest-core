#!/usr/bin/env node
/**
 * Summarizes marketing locale inputs (audit helper).
 * Canonical marketing JSON lives under repo-root tools/i18n/marketing/; merged runtime
 * is client/public/i18n/{lang}.json and nursenest-core/public/i18n/{lang}.json.
 */
import { readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const nursenestCore = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = join(nursenestCore, "..");
const marketingDir = join(repoRoot, "tools/i18n/marketing");
const localeDir = join(marketingDir, "locale");
const overlays = readdirSync(localeDir).filter((f) => f.startsWith("marketing-") && f.endsWith(".json"));

console.log("=== Marketing locale inputs (canonical under tools/i18n/marketing) ===\n");
console.log("English base:");
console.log(`  - ${join("tools", "i18n", "marketing", "marketing-en.json")}\n`);
console.log("Per-locale overlays (merged at compile time with monolith i18n):");
for (const f of overlays.sort()) {
  console.log(`  - tools/i18n/marketing/locale/${f}`);
}
console.log("\nRuntime: loadMarketingMessages reads merged JSON from nursenest-core/public/i18n/{lang}.json.\n");
