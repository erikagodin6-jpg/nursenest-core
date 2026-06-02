#!/usr/bin/env npx tsx
/**
 * Writes `reports/allied-health-hub-program.md` at the **repository root** (sibling of `nursenest-core/`).
 *
 * Usage (from `nursenest-core/`):
 *   npm run report:allied-hub
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { buildAlliedHubProgramMarkdown } from "../src/lib/allied/allied-hub-report-markdown";
import { listAlliedOccupationsFromRegistry } from "../src/lib/allied/allied-hub-program-model";
import {
  formatAlliedHubInventoryMarkdown,
  loadAlliedOccupationInventoryRows,
} from "../src/lib/allied/allied-hub-inventory-counts.server";

const HERE = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = resolve(HERE, "..");
const REPO_ROOT = resolve(PKG_ROOT, "..");
const OUT = join(REPO_ROOT, "reports", "allied-health-hub-program.md");

const baseMd = buildAlliedHubProgramMarkdown({
  generatedAtIso: new Date().toISOString(),
  clinicalScenariosPublic: false,
  oscePublic: true,
});
const professions = listAlliedOccupationsFromRegistry();
const inventoryRows = await loadAlliedOccupationInventoryRows(professions);
const md = `${baseMd}\n${formatAlliedHubInventoryMarkdown(inventoryRows)}`;
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, md, "utf8");
// eslint-disable-next-line no-console
console.log(`Wrote ${OUT}`);
