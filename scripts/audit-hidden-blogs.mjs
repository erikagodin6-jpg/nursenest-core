#!/usr/bin/env node
/**
 * Wrapper: runs `nursenest-core/nursenest-core/scripts/audit-hidden-blogs-runner.mts` with correct cwd.
 * From repo root: `node scripts/audit-hidden-blogs.mjs --dry-run`
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
/** App package: `nursenest-core/nursenest-core/` (Next + Prisma), sibling of this `scripts/` folder. */
const pkgRoot = join(__dirname, "..", "nursenest-core");
const runner = join(pkgRoot, "scripts", "audit-hidden-blogs-runner.mts");
const stubServerOnly = join(pkgRoot, "scripts", "stub-server-only.cjs");

const r = spawnSync(
  process.execPath,
  ["--require", stubServerOnly, "--import", "tsx", runner, ...process.argv.slice(2)],
  {
    cwd: pkgRoot,
    stdio: "inherit",
    env: process.env,
    shell: false,
  },
);
process.exit(r.status === null ? 1 : r.status);
