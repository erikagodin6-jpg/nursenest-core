#!/usr/bin/env node
/**
 * Inventory: all nursing pathway lessons (raw vs hub-effective).
 * Run from nursenest-core: node scripts/debug-all-nursing-lesson-inventory.mjs
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const r = spawnSync(process.execPath, ["--import", "tsx", join(__dirname, "debug-all-nursing-lesson-inventory.impl.mts")], {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env },
});
process.exit(r.status ?? 1);
