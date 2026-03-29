#!/usr/bin/env node
/**
 * Removes reproducible build/cache artifacts only. Does not delete source content,
 * data/replit-exports, or committed assets.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const toRemove = [
  path.join(root, "nursenest-core", ".next"),
  path.join(root, ".next"),
  path.join(root, "tmp"),
  path.join(root, "temp"),
  path.join(root, ".turbo"),
  path.join(root, ".cache"),
  path.join(root, "coverage"),
  path.join(root, "dist"),
];

const removed = [];
for (const p of toRemove) {
  try {
    if (fs.existsSync(p)) {
      fs.rmSync(p, { recursive: true, force: true });
      removed.push(path.relative(root, p));
    }
  } catch (e) {
    console.error("[clean-generated-artifacts] failed:", p, e);
    process.exitCode = 1;
  }
}

console.log(
  JSON.stringify(
    {
      type: "clean_generated_artifacts",
      repoRoot: root,
      removedPaths: removed,
      note: "Safe to re-run: Next.js build, caches, coverage. Does not touch data/ or client sources.",
    },
    null,
    2,
  ),
);
