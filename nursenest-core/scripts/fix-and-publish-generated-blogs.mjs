#!/usr/bin/env node
/**
 * Delegates to the TypeScript runner (canonical publish path).
 *
 * From nursenest-core/ (DATABASE_URL set):
 *   node scripts/fix-and-publish-generated-blogs.mjs --dry-run
 *   node scripts/fix-and-publish-generated-blogs.mjs --publish --limit=20
 *   node scripts/fix-and-publish-generated-blogs.mjs --publish --slug=my-slug
 *
 * Writes only when `--publish` is present and `--dry-run` is not.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const runner = path.join(__dirname, "fix-and-publish-generated-blogs-runner.ts");

const r = spawnSync(process.platform === "win32" ? "npx.cmd" : "npx", ["tsx", runner, ...process.argv.slice(2)], {
  stdio: "inherit",
  cwd: path.join(__dirname, ".."),
  env: process.env,
});

process.exit(r.status ?? 1);
