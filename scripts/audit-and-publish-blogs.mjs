#!/usr/bin/env node
/**
 * Repo-root entry: audit + optional canonical blog recovery (nursenest-core Prisma).
 *
 *   node scripts/audit-and-publish-blogs.mjs --dry-run --limit=20
 *   node scripts/audit-and-publish-blogs.mjs --publish --limit=20
 *   node scripts/audit-and-publish-blogs.mjs --publish --slug=my-slug
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const coreDir = path.join(__dirname, "..", "nursenest-core");
const runner = path.join(coreDir, "scripts", "audit-and-publish-blogs-runner.ts");

const r = spawnSync(process.platform === "win32" ? "npx.cmd" : "npx", ["tsx", runner, ...process.argv.slice(2)], {
  stdio: "inherit",
  cwd: coreDir,
  env: process.env,
});

process.exit(r.status ?? 1);
