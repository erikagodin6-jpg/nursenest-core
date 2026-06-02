#!/usr/bin/env node
/**
 * CLI entry: loads legacy study-tool exports and writes draft JSON (never published).
 * @see scripts/migrate-legacy-study-tools.ts
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const child = spawnSync(
  process.execPath,
  ["--require", "./scripts/stub-server-only.cjs", "--import", "tsx", "./scripts/migrate-legacy-study-tools.ts", ...args],
  {
    cwd: packageRoot,
    stdio: "inherit",
    env: process.env,
  },
);

process.exit(typeof child.status === "number" ? child.status : 1);
