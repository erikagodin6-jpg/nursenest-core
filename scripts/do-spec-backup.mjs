#!/usr/bin/env node
/**
 * Backup the current live DigitalOcean app spec with secrets redacted.
 *
 * Saves to:
 *   ops/digitalocean/backups/app-spec.latest.yaml       ← always overwritten
 *   ops/digitalocean/backups/app-spec.TIMESTAMP.yaml    ← timestamped archive
 *
 * Secret values are replaced with "__REDACTED__" so the file is safe to commit.
 * The backup validates the live spec against the required env contract and warns if keys are missing.
 *
 * Usage:
 *   DO_APP_ID=<your-app-id> npm run do:spec:backup
 *   DO_APP_ID=<id> node scripts/do-spec-backup.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateSpec } from "./do-spec-guard.mjs";

const require = createRequire(import.meta.url);
const yaml = require("js-yaml");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BACKUP_DIR = path.join(ROOT, "ops", "digitalocean", "backups");

const APP_ID =
  process.env.DO_APP_ID?.trim() ||
  process.env.DIGITALOCEAN_APP_ID?.trim() ||
  process.argv[2]?.trim();

if (!APP_ID) {
  console.error("[do-spec-backup] ERROR: App ID not set.");
  console.error("  Set DO_APP_ID env var, or pass the ID as the first argument.");
  console.error("  Find it: doctl apps list --format ID,Spec.Name");
  process.exit(1);
}

console.log(`[do-spec-backup] Fetching live spec for app ID: ${APP_ID}`);

const result = spawnSync("doctl", ["apps", "spec", "get", APP_ID], {
  encoding: "utf8",
  env: process.env,
  maxBuffer: 4 * 1024 * 1024,
});

if (result.status !== 0) {
  const detail = (result.stderr?.trim() || result.stdout?.trim() || "(no output)").slice(0, 500);
  console.error(`[do-spec-backup] ERROR: doctl apps spec get failed (exit ${result.status ?? 1}): ${detail}`);
  process.exit(1);
}

let spec;
try {
  spec = yaml.load(result.stdout);
} catch (error) {
  console.error(
    `[do-spec-backup] ERROR: Failed to parse spec YAML: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exit(1);
}

if (!spec || typeof spec !== "object") {
  console.error("[do-spec-backup] ERROR: doctl returned empty or non-object spec.");
  process.exit(1);
}

/** Replace secret values with a safe placeholder. Never commit real secrets. */
function redactSpec(specObj) {
  const clone = JSON.parse(JSON.stringify(specObj));
  for (const svc of Array.isArray(clone?.services) ? clone.services : []) {
    for (const entry of Array.isArray(svc?.envs) ? svc.envs : []) {
      if (entry.type === "SECRET") {
        if (entry.value) entry.value = "__REDACTED__";
        if (entry.encrypted_value) entry.encrypted_value = "__REDACTED__";
      }
    }
  }
  return clone;
}

const redacted = redactSpec(spec);
const { ok, failures, warnings } = validateSpec(redacted);

if (warnings.length > 0) {
  for (const w of warnings) console.warn(`[do-spec-backup] WARN: ${w}`);
}
if (!ok) {
  console.error("[do-spec-backup] WARNING: Live spec fails env protection contract:");
  for (const f of failures) console.error(`  ✗ ${f}`);
  console.error("[do-spec-backup] Saving backup anyway — these are the missing keys you need to add manually in the DO console.");
}

mkdirSync(BACKUP_DIR, { recursive: true });

const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const yamlContent =
  `# DigitalOcean app spec backup — generated ${new Date().toISOString()}\n` +
  `# App ID: ${APP_ID}\n` +
  `# Secret values replaced with __REDACTED__ — safe to commit.\n` +
  yaml.dump(redacted, { lineWidth: 120 });

const latestPath = path.join(BACKUP_DIR, "app-spec.latest.yaml");
const timestampedPath = path.join(BACKUP_DIR, `app-spec.${timestamp}.yaml`);

writeFileSync(latestPath, yamlContent, "utf8");
writeFileSync(timestampedPath, yamlContent, "utf8");

const envCount = spec?.services?.[0]?.envs?.length ?? 0;
console.log(`[do-spec-backup] Saved (${envCount} env entries):`);
console.log(`  ${path.relative(ROOT, latestPath)}`);
console.log(`  ${path.relative(ROOT, timestampedPath)}`);

if (ok) {
  console.log("[do-spec-backup] Live spec passes all required env protection checks.");
} else {
  console.log("[do-spec-backup] See above warnings — add missing keys in DigitalOcean console.");
}
