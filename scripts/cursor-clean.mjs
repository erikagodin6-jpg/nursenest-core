#!/usr/bin/env node
/**
 * Safe local artifact cleanup for Cursor/IDE stability.
 * Does not delete source, prisma, migrations, public assets, media, or tracked report snapshots.
 */
import { existsSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

/** @type {string[]} */
const relativeDirs = [
  ".next",
  "coverage",
  "test-results",
  "playwright-report",
  "blob-report",
  ".turbo",
  "nursenest-core/.next",
  "nursenest-core/coverage",
  "nursenest-core/test-results",
  "nursenest-core/playwright-report",
  "nursenest-core/blob-report",
  "nursenest-core/.turbo",
];

for (const rel of relativeDirs) {
  const abs = join(repoRoot, rel);
  if (!existsSync(abs)) continue;
  rmSync(abs, { recursive: true, force: true });
  console.log("removed", rel);
}

console.log("cursor:clean done");
