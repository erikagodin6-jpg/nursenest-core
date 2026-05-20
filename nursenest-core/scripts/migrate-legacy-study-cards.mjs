#!/usr/bin/env node
/**
 * Imports legacy Quizlet-style exports into `VerifiedStudyDeck` as **private** drafts (never auto-published).
 * @see scripts/migrate-legacy-study-cards.ts
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const child = spawnSync(
  process.execPath,
  ["--require", "./scripts/stub-server-only.cjs", "--import", "tsx", "./scripts/migrate-legacy-study-cards.ts", ...args],
  {
    cwd: packageRoot,
    stdio: "inherit",
    env: process.env,
  },
);

process.exit(typeof child.status === "number" ? child.status : 1);
