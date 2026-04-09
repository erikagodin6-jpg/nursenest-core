#!/usr/bin/env node
/**
 * Launcher: RN NCLEX lesson ↔ question bank + rationale registry coverage audit.
 *
 * Run from nursenest-core:
 *   node scripts/rn-nclex-linking-coverage-audit.mjs
 *   node scripts/rn-nclex-linking-coverage-audit.mjs --json
 *   node scripts/rn-nclex-linking-coverage-audit.mjs --pathway=ca-rn-nclex-rn --json-out=./tmp/rn-nclex-link-audit.json
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const ts = path.join(root, "scripts/rn-nclex-linking-coverage-audit.ts");

const r = spawnSync("npx", ["tsx", ts, ...process.argv.slice(2)], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: process.env,
});

process.exit(r.status ?? 1);
