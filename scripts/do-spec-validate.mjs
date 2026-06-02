#!/usr/bin/env node
/**
 * Validate the canonical DigitalOcean app spec against all required runtime env contracts.
 *
 * Checks:
 *   1. All required env key NAMES are present in the canonical spec
 *   2. run_command and source_dir are unchanged
 *   3. No required key was removed compared to the latest backup
 *
 * Usage:
 *   npm run do:spec:validate
 *   node scripts/do-spec-validate.mjs [path/to/spec.yaml]
 */
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  validateSpecFile,
  collectRuntimeEnvMap,
  REQUIRED_RUNTIME_ENV_KEYS,
  CANONICAL_SPEC_PATH,
} from "./do-spec-guard.mjs";

const require = createRequire(import.meta.url);
const yaml = require("js-yaml");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LATEST_BACKUP = path.join(ROOT, "ops", "digitalocean", "backups", "app-spec.latest.yaml");

const specPath = process.argv[2] ?? CANONICAL_SPEC_PATH;
const failures = [];
const warnings = [];

// 1. Validate the spec itself
const { ok: specOk, failures: specFailures, warnings: specWarnings, spec } = validateSpecFile(specPath);
failures.push(...specFailures);
warnings.push(...specWarnings);

// 2. Compare with latest backup to detect removed keys
if (existsSync(LATEST_BACKUP)) {
  let backup = null;
  try {
    backup = yaml.load(readFileSync(LATEST_BACKUP, "utf8"));
  } catch (error) {
    warnings.push(
      `Could not parse latest backup (${path.relative(ROOT, LATEST_BACKUP)}): ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  if (backup && spec) {
    const backupKeys = new Set(collectRuntimeEnvMap(backup).keys());
    const specKeys = new Set(collectRuntimeEnvMap(spec).keys());

    const removed = [...backupKeys].filter((k) => !specKeys.has(k));
    for (const k of removed) {
      if (REQUIRED_RUNTIME_ENV_KEYS.includes(k)) {
        failures.push(
          `REMOVED required key "${k}" compared to latest backup — deploying this spec will delete it from the live app.`,
        );
      } else {
        warnings.push(
          `Key "${k}" is in the latest backup but not in the canonical spec — deploying will remove it from DO.`,
        );
      }
    }
  }
} else {
  warnings.push(
    `No backup found at ${path.relative(ROOT, LATEST_BACKUP)} — run "npm run do:spec:backup" to create one first.`,
  );
}

// Output
for (const w of warnings) {
  console.warn(`[do-spec-validate] WARN: ${w}`);
}

if (failures.length > 0) {
  for (const f of failures) {
    console.error(`[do-spec-validate] FAIL: ${f}`);
  }
  console.error(
    `\n[do-spec-validate] ${failures.length} check(s) failed. Fix the spec before deploying.`,
  );
  console.error("  See: docs/ops/digitalocean-env-protection.md");
  process.exit(1);
}

console.log(`[do-spec-validate] OK: ${path.relative(ROOT, specPath)} passes all required env protection checks.`);
process.exit(0);
