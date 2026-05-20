#!/usr/bin/env node
/**
 * Entry point for ops/CI: runs the TypeScript real-scenario seeder via tsx.
 * From repo root: node nursenest-core/scripts/seed-clinical-scenarios-real.mjs
 * From nursenest-core: node scripts/seed-clinical-scenarios-real.mjs
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, "..");
const r = spawnSync("npx", ["tsx", "scripts/seed-clinical-scenarios-real-runner.mts"], {
  cwd: pkgRoot,
  stdio: "inherit",
  shell: process.platform === "win32",
});
process.exit(r.status ?? 1);
