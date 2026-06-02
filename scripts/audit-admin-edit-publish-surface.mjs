#!/usr/bin/env node
/**
 * Repo-root shim: runs the read-only admin edit → publish surface audit in the app package.
 *
 * Usage:
 *   node scripts/audit-admin-edit-publish-surface.mjs [--verify-files]
 *
 * Equivalent:
 *   cd nursenest-core && npm run audit:admin-edit-publish-surface
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const appDir = join(root, "..", "nursenest-core");
const extra = process.argv.slice(2);
const r = spawnSync("npx", ["tsx", "scripts/audit-admin-edit-publish-surface-runner.ts", ...extra], {
  cwd: appDir,
  stdio: "inherit",
  env: process.env,
});
process.exit(r.status ?? 1);
