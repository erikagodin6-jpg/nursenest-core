#!/usr/bin/env node
/**
 * Safe DigitalOcean deploy wrapper.
 *
 * Steps:
 *   1. Validate canonical spec env contract (all required keys present)
 *   2. Diff canonical vs latest backup (block if required keys would be removed)
 *   3. Print the validated doctl command for confirmation
 *   4. Execute only if DO_AUTO_CONFIRM=1 (CI/automated usage only)
 *
 * Usage (manual, human-reviewed):
 *   DO_APP_ID=<id> npm run do:deploy:safe
 *
 * Usage (CI, auto-confirmed):
 *   DO_APP_ID=<id> DO_AUTO_CONFIRM=1 npm run do:deploy:safe
 *
 * FORBIDDEN: doctl apps update without running this script first.
 * See: docs/ops/digitalocean-env-protection.md
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateSpecFile, CANONICAL_SPEC_PATH } from "./do-spec-guard.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const AUTO_CONFIRM = process.env.DO_AUTO_CONFIRM === "1";

function step(label, cmd, args, cwd = ROOT) {
  console.log(`\n[do-deploy-safe] → ${label}`);
  const r = spawnSync(cmd, args, { cwd, stdio: "inherit", env: process.env });
  const code = r.status ?? 1;
  if (code !== 0) {
    console.error(`\n[do-deploy-safe] FAILED: "${label}" exited with code ${code}`);
    process.exit(code);
  }
}

console.log("[do-deploy-safe] Starting env-protected deploy sequence...\n");

// Step 1: Validate canonical spec
const { ok, failures, warnings } = validateSpecFile(CANONICAL_SPEC_PATH);

for (const w of warnings) {
  console.warn(`[do-deploy-safe] WARN: ${w}`);
}

if (!ok) {
  console.error("\n[do-deploy-safe] BLOCKED: Canonical spec fails required env protection checks:");
  for (const f of failures) console.error(`  ✗ ${f}`);
  console.error("\nFix the spec before deploying.");
  console.error("Docs: docs/ops/digitalocean-env-protection.md");
  process.exit(1);
}

console.log("[do-deploy-safe] ✓ Spec validation passed.");

// Step 2: Diff vs backup (exits non-zero if required keys would be removed)
step("Spec diff vs backup", process.execPath, [path.join(ROOT, "scripts", "do-spec-diff.mjs")]);
console.log("[do-deploy-safe] ✓ Spec diff passed.");

// Step 3: Require APP_ID
const APP_ID =
  process.env.DO_APP_ID?.trim() ||
  process.env.DIGITALOCEAN_APP_ID?.trim() ||
  process.argv[2]?.trim();

if (!APP_ID) {
  console.error("\n[do-deploy-safe] ERROR: Set DO_APP_ID env var to your DigitalOcean app ID.");
  console.error("  Find it: doctl apps list --format ID,Spec.Name");
  process.exit(1);
}

const specRelPath = path.relative(ROOT, CANONICAL_SPEC_PATH);
const updateCmd = `doctl apps update ${APP_ID} --spec ${specRelPath}`;

console.log(`\n[do-deploy-safe] All checks passed.`);
console.log(`[do-deploy-safe] Deploy command:`);
console.log(`\n  ${updateCmd}\n`);

if (!AUTO_CONFIRM) {
  console.log("[do-deploy-safe] Dry-run complete. To execute, set DO_AUTO_CONFIRM=1 (CI only).");
  console.log("[do-deploy-safe] For manual deploys, copy and run the command above after review.");
  process.exit(0);
}

// Step 4: Execute (CI only)
step(
  `doctl apps update ${APP_ID}`,
  "doctl",
  ["apps", "update", APP_ID, "--spec", specRelPath],
);

console.log("\n[do-deploy-safe] Deploy triggered successfully.");
