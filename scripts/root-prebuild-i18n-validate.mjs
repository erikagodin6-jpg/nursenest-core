#!/usr/bin/env node
/**
 * Root `prebuild` gate after `i18n:compile`. Honors SKIP_I18N_PREBUILD=1 so monorepo builds
 * do not run strict multi-locale validation (same contract as nursenest-core `run-build-prechecks.mjs`).
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const skip = /^(1|true|yes)$/i.test(process.env.SKIP_I18N_PREBUILD ?? "");
if (skip) {
  console.log("[root-prebuild] SKIP_I18N_PREBUILD=1 — skipping npm run i18n:validate:production");
  process.exit(0);
}

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const r = spawnSync(npm, ["run", "i18n:validate:production"], { cwd: root, stdio: "inherit" });
process.exit(r.status === 0 ? 0 : r.status ?? 1);
