#!/usr/bin/env node
/**
 * Repo-root entry for the hidden-blog recovery audit (read-only).
 * Delegates to `nursenest-core/scripts/blog/report-hidden-content-audit.mts`.
 *
 * Usage (from repo root `/root/nursenest-core`):
 *   node scripts/audit-hidden-blog-content.mjs
 *   node scripts/audit-hidden-blog-content.mjs --no-db   (forwarded if implemented upstream)
 *
 * Safety: `--apply` throws `Apply disabled until audit approved` (no Prisma run). Audit is read-only.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const appRoot = path.join(repoRoot, "nursenest-core");
const auditMts = path.join(appRoot, "scripts", "blog", "report-hidden-content-audit.mts");

const argv = process.argv.slice(2);
if (argv.includes("--apply")) {
  throw new Error("Apply disabled until audit approved");
}

const r = spawnSync("npx", ["tsx", auditMts, ...argv], {
  cwd: appRoot,
  stdio: "inherit",
  env: { ...process.env },
  shell: false,
});

if (r.error) {
  console.error(r.error);
  process.exit(1);
}
process.exit(r.status === null ? 1 : r.status);
