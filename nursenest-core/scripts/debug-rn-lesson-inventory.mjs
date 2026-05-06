#!/usr/bin/env node
/**
 * RN lesson inventory — entrypoint.
 * Runs the TypeScript implementation with tsx (uses @/ path aliases from nursenest-core/).
 *
 * Usage (from nursenest-core):
 *   node scripts/debug-rn-lesson-inventory.mjs
 *   node scripts/debug-rn-lesson-inventory.mjs --json-summary   # stderr only summary; stdout TSV
 *
 * Optional DB rows (Prisma) when DATABASE_URL is configured:
 *   DATABASE_URL=... node scripts/debug-rn-lesson-inventory.mjs
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const coreRoot = path.resolve(__dirname, "..");
const impl = path.join(__dirname, "debug-rn-lesson-inventory-impl.ts");

const extraArgs = process.argv.slice(2);
const r = spawnSync(process.execPath, ["--import", "tsx", impl, ...extraArgs], {
  cwd: coreRoot,
  stdio: "inherit",
  env: { ...process.env },
});
process.exit(r.status === null ? 1 : r.status);
