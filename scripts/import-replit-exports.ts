#!/usr/bin/env npx tsx
/**
 * Safe validation-only pipeline for staged Replit JSON (default: dry run, no DB).
 * - Per-file and per-record validation for nursing questions (ai_cache.json) via field-maps.
 * - Duplicate detection: stem hash across all nursing candidates in ai_cache.
 * - Users/ops domains skipped by default (see validate-import.ts).
 *
 * Does NOT write to the database. Use scripts/replit-export-import/cli.ts with --apply after review.
 *
 * Nursing line-item preview (ai_cache arrays, no writes):
 *   npm run nursing:preview -- --dir data/replit-exports
 *   npm run nursing:preview -- --dir data/replit-exports --max-exam-inserts 75
 *   npm run nursing:preview:db -- --dir data/replit-exports --limit 500
 *   npm run nursing:audit -- --dir data/replit-exports --max-exam-inserts 100
 * (DB mode is read-only stem_hash lookup; requires DATABASE_URL or PROD_DATABASE_URL.)
 */
import * as path from "path";
import { fileURLToPath } from "url";
import { validateStagedExports } from "./replit-import/validate-import";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

function main() {
  const args = process.argv.slice(2);
  const dirIdx = args.indexOf("--dir");
  const sourceRel = dirIdx >= 0 && args[dirIdx + 1] ? args[dirIdx + 1] : "data/replit-exports";

  if (args.includes("--help")) {
    console.log(`
Usage: npx tsx scripts/import-replit-exports.ts [--dir data/replit-exports]

Validates staged JSON only (no database writes).
For SQL upserts use: npm run import:replit-exports -- import --dir data/replit-exports
`);
    process.exit(0);
  }

  const report = validateStagedExports(repoRoot, sourceRel);
  console.log(JSON.stringify({ type: "replit_import_validation", ...report }, null, 2));
}

main();
