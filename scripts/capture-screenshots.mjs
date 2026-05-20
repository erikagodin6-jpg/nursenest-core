#!/usr/bin/env node
/**
 * Thin wrapper — canonical pipeline lives in the Next.js app package:
 *   nursenest-core/scripts/capture-marketing-screenshots.mjs
 *
 * From repo root:
 *   node scripts/capture-screenshots.mjs
 *
 * Or run directly:
 *   cd nursenest-core && node scripts/capture-marketing-screenshots.mjs
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appRoot = join(__dirname, "../nursenest-core");
const script = join(appRoot, "scripts/capture-marketing-screenshots.mjs");

const result = spawnSync(process.execPath, [script, ...process.argv.slice(2)], {
  cwd: appRoot,
  stdio: "inherit",
  env: process.env,
});

process.exit(result.status ?? 1);
