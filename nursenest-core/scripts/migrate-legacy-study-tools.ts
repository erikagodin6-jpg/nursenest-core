/**
 * Writes draft study-tool bundles from legacy monolith data. Never sets published=true.
 *
 * Usage (from nursenest-core): node scripts/migrate-legacy-study-tools.mjs [--pathway-id <id>] [--out-dir <dir>]
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  HIGH_YIELD_SIDE_EFFECTS,
  ONE_MINUTE_REVIEW_CARDS,
  TMC_PHARM_TRAPS,
} from "@legacy-client/data/rrt-pharm-study-tools";
import { mapLegacyRrtPharmStudyToolsExport } from "@/lib/study-tools/legacy-study-tools-mapper";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

function parseArg(flag: string): string | null {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return null;
  const v = process.argv[idx + 1];
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

const pathwayId = parseArg("--pathway-id");
const outDir = parseArg("--out-dir") ?? join(packageRoot, "data", "legacy-study-tools-draft");

const bundle = mapLegacyRrtPharmStudyToolsExport({
  tmcTraps: TMC_PHARM_TRAPS,
  oneMinuteCards: ONE_MINUTE_REVIEW_CARDS,
  highYieldSideEffects: HIGH_YIELD_SIDE_EFFECTS,
  pathwayId,
});

if (bundle.published !== false) {
  throw new Error("Invariant: migration must never publish study tools");
}

mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, "rrt-pharm-study-tools.draft.json");
writeFileSync(outFile, `${JSON.stringify(bundle, null, 2)}\n`, "utf8");
// eslint-disable-next-line no-console -- CLI
console.log(`Wrote draft bundle (${bundle.activities.length} activities) → ${outFile}`);
