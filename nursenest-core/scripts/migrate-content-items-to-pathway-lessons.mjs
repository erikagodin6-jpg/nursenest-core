#!/usr/bin/env node
/**
 * CLI wrapper: runs the TypeScript migrator with the repo tsx bootstrap.
 * @see scripts/migrate-content-items-to-pathway-lessons.ts
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const child = spawnSync(
  process.execPath,
  [
    "--require",
    "./scripts/stub-server-only.cjs",
    "--import",
    "tsx",
    "./scripts/migrate-content-items-to-pathway-lessons.ts",
    ...args,
  ],
  {
    cwd: packageRoot,
    stdio: "inherit",
    env: process.env,
  },
);

process.exit(typeof child.status === "number" ? child.status : 1);
