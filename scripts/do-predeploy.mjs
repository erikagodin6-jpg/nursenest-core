#!/usr/bin/env node
/**
 * DigitalOcean pre-deploy guard + deploy runner.
 *
 * WHAT IT DOES:
 *   1. Runs do-spec-guard to confirm the canonical spec contains every required env key.
 *   2. Compares the spec's env key list against the current live app (via doctl).
 *   3. Prints what will change (added / removed / modified keys).
 *   4. Refuses to run doctl apps update if the guard fails.
 *   5. When --execute is passed (or NN_DO_DEPLOY_EXECUTE=1), runs the update.
 *
 * USAGE (from repo root):
 *   node scripts/do-predeploy.mjs               # dry-run: validate + diff, no deploy
 *   node scripts/do-predeploy.mjs --execute      # validate + deploy
 *   npm run do:deploy:safe                        # alias for dry-run
 *   npm run do:deploy:execute                     # alias for --execute
 *
 * WHY THIS EXISTS:
 *   `doctl apps update APP_ID --spec file.yaml` is destructive — any env var absent
 *   from the spec is permanently deleted from the live app. This script prevents that
 *   by blocking the update when the spec is incomplete.
 *
 * SEE ALSO: docs/ops/digitalocean-env-protection.md
 */

import { execSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateSpecFile, CANONICAL_SPEC_PATH, collectRuntimeEnvMap } from "./do-spec-guard.mjs";

const __dir = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dir, "..");
const APP_ID = "d6a4b825-4d70-4dd4-8d71-04b354d36f43";

const shouldExecute =
  process.argv.includes("--execute") ||
  process.env.NN_DO_DEPLOY_EXECUTE === "1";

const specRelPath = path.relative(process.cwd(), CANONICAL_SPEC_PATH);

// ─────────────────────────────────────────────────────────────────────────────
// Step 1: Guard validation
// ─────────────────────────────────────────────────────────────────────────────

console.log(`\n[do-predeploy] Validating spec: ${specRelPath}`);
const { ok, failures, warnings, spec } = validateSpecFile(CANONICAL_SPEC_PATH);

for (const w of warnings) {
  console.warn(`  WARN  ${w}`);
}

if (!ok) {
  console.error("\n[do-predeploy] BLOCKED — spec guard failed:");
  for (const f of failures) {
    console.error(`  FAIL  ${f}`);
  }
  console.error(`
Fix: add the missing env key(s) to ${specRelPath}, then re-run this script.
The canonical spec must list every required env var NAME before doctl apps update
can run safely. Missing names = permanent deletion from the live app.`);
  process.exit(1);
}

console.log(`  OK    Spec passes all required env protection checks.`);

// ─────────────────────────────────────────────────────────────────────────────
// Step 2: Diff against live app (requires doctl)
// ─────────────────────────────────────────────────────────────────────────────

let liveEnvKeys = new Set();
let diffAvailable = false;

try {
  const liveSpecText = execSync(
    `doctl apps spec get ${APP_ID} --format yaml 2>/dev/null`,
    { encoding: "utf8", timeout: 30_000 }
  );
  const { createRequire } = await import("node:module");
  const require = createRequire(import.meta.url);
  const yaml = require("js-yaml");
  const liveSpec = yaml.load(liveSpecText);
  const liveEnvMap = collectRuntimeEnvMap(liveSpec);
  liveEnvKeys = new Set(liveEnvMap.keys());
  diffAvailable = true;
} catch {
  console.warn("  WARN  Could not fetch live spec via doctl (skipping diff).");
}

if (diffAvailable && spec) {
  const specEnvMap = collectRuntimeEnvMap(spec);
  const specKeys = new Set(specEnvMap.keys());

  const willDelete = [...liveEnvKeys].filter((k) => !specKeys.has(k));
  const willAdd = [...specKeys].filter((k) => !liveEnvKeys.has(k));

  if (willDelete.length > 0) {
    console.error(`\n[do-predeploy] BLOCKED — spec update would DELETE ${willDelete.length} env var(s) from live app:`);
    for (const k of willDelete.sort()) {
      console.error(`  DEL  ${k}`);
    }
    console.error(`
Fix: add each deleted key to ${specRelPath} before deploying.
Even if a key is no longer needed, keep it in the spec as type: SECRET
(with no value) until it has been manually removed from the DO dashboard.`);
    process.exit(1);
  }

  if (willAdd.length > 0) {
    console.log(`\n[do-predeploy] New env vars that will be added to live app (${willAdd.length}):`);
    for (const k of willAdd.sort()) {
      const entry = specEnvMap.get(k);
      const hasValue = Boolean(entry?.value);
      const isSecret = entry?.type === "SECRET";
      console.log(`  ADD  ${k}  (${isSecret ? "secret" : hasValue ? `value="${entry.value}"` : "empty"})`);
    }
  }

  if (willDelete.length === 0 && willAdd.length === 0) {
    console.log(`\n[do-predeploy] Diff: no env var additions or deletions detected.`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 3: Execute or print the command
// ─────────────────────────────────────────────────────────────────────────────

const deployCmd = `doctl apps update ${APP_ID} --spec ${specRelPath}`;

if (!shouldExecute) {
  console.log(`
[do-predeploy] DRY RUN — spec is valid. To deploy, run:

  ${deployCmd}

Or re-run with:

  node scripts/do-predeploy.mjs --execute
  npm run do:deploy:execute
`);
  process.exit(0);
}

console.log(`\n[do-predeploy] Executing: ${deployCmd}`);
const result = spawnSync("doctl", ["apps", "update", APP_ID, "--spec", specRelPath], {
  stdio: "inherit",
  cwd: ROOT,
});

if (result.status !== 0) {
  console.error(`\n[do-predeploy] doctl apps update failed (exit ${result.status}).`);
  process.exit(result.status ?? 1);
}

console.log("\n[do-predeploy] Deploy complete.");
