#!/usr/bin/env node
/**
 * Repo-root entry: delegates to nursenest-core/scripts/report-allied-health-lessons.mts
 * Run: node scripts/report-allied-health-lessons.mjs [--json]
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.join(__dirname, "..", "nursenest-core");
const args = ["tsx", "scripts/report-allied-health-lessons.mts", ...process.argv.slice(2)];
const r = spawnSync("npx", args, { cwd: appDir, stdio: "inherit" });
process.exit(r.status === null ? 1 : r.status);
