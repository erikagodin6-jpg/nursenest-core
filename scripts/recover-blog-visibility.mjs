#!/usr/bin/env node
/**
 * Wrapper: `nursenest-core/scripts/recover-blog-visibility-runner.mts` with correct cwd + server-only stub.
 * Repo root: `node scripts/recover-blog-visibility.mjs`
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(__dirname, "..", "nursenest-core");
const runner = join(pkgRoot, "scripts", "recover-blog-visibility-runner.mts");
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
