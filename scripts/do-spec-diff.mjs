#!/usr/bin/env node
/**
 * Diff the canonical spec env vars against the latest backup.
 *
 * Shows: added keys, removed keys, scope/type changes.
 * Secret VALUES are never compared — backups contain __REDACTED__ placeholders.
 * Exits non-zero if any required key would be removed.
 *
 * Usage:
 *   npm run do:spec:diff
 *   node scripts/do-spec-diff.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { collectRuntimeEnvMap, REQUIRED_RUNTIME_ENV_KEYS, CANONICAL_SPEC_PATH } from "./do-spec-guard.mjs";

const require = createRequire(import.meta.url);
const yaml = require("js-yaml");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LATEST_BACKUP = path.join(ROOT, "ops", "digitalocean", "backups", "app-spec.latest.yaml");

function loadSpec(filePath, label) {
  if (!existsSync(filePath)) {
    console.error(`[do-spec-diff] ERROR: ${label} not found at: ${filePath}`);
    console.error("  Run `npm run do:spec:backup` to create the backup first.");
    process.exit(1);
  }
  try {
    return yaml.load(readFileSync(filePath, "utf8"));
  } catch (error) {
    console.error(
      `[do-spec-diff] ERROR: Failed to parse ${label}: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }
}

const canonical = loadSpec(CANONICAL_SPEC_PATH, "canonical spec");
const backup = loadSpec(LATEST_BACKUP, "latest backup");

const canonicalMap = collectRuntimeEnvMap(canonical);
const backupMap = collectRuntimeEnvMap(backup);

const allKeys = new Set([...canonicalMap.keys(), ...backupMap.keys()]);

const added = [];
const removed = [];
const changed = [];
const unchanged = [];

for (const key of [...allKeys].sort()) {
  const inCanonical = canonicalMap.has(key);
  const inBackup = backupMap.has(key);

  if (inCanonical && !inBackup) {
    added.push(key);
  } else if (!inCanonical && inBackup) {
    removed.push(key);
  } else {
    const c = canonicalMap.get(key);
    const b = backupMap.get(key);
    const scopeChanged = (c.scope ?? "RUN_TIME") !== (b.scope ?? "RUN_TIME");
    const typeChanged = (c.type ?? "GENERAL") !== (b.type ?? "GENERAL");
    if (scopeChanged || typeChanged) {
      changed.push({
        key,
        from: { scope: b.scope ?? "RUN_TIME", type: b.type ?? "GENERAL" },
        to: { scope: c.scope ?? "RUN_TIME", type: c.type ?? "GENERAL" },
      });
    } else {
      unchanged.push(key);
    }
  }
}

console.log(
  `\n[do-spec-diff] Canonical spec (${path.relative(ROOT, CANONICAL_SPEC_PATH)}) vs latest backup:\n`,
);

if (added.length > 0) {
  console.log(`  ADDED (${added.length}) — in canonical, not in backup:`);
  for (const k of added) console.log(`    + ${k}`);
}

if (removed.length > 0) {
  const requiredRemoved = removed.filter((k) => REQUIRED_RUNTIME_ENV_KEYS.includes(k));
  const optionalRemoved = removed.filter((k) => !REQUIRED_RUNTIME_ENV_KEYS.includes(k));

  if (requiredRemoved.length > 0) {
    console.log(`  REMOVED — REQUIRED KEYS (${requiredRemoved.length}) — DEPLOYING CANONICAL WILL DELETE THESE:`);
    for (const k of requiredRemoved) console.log(`    ✗ ${k}  ← REQUIRED`);
  }
  if (optionalRemoved.length > 0) {
    console.log(`  REMOVED — optional keys (${optionalRemoved.length}) — deploying canonical will also delete these:`);
    for (const k of optionalRemoved) console.log(`    - ${k}`);
  }
}

if (changed.length > 0) {
  console.log(`  CHANGED scope/type (${changed.length}):`);
  for (const { key, from, to } of changed) {
    console.log(`    ~ ${key}: scope ${from.scope} → ${to.scope}, type ${from.type} → ${to.type}`);
  }
}

console.log(`  UNCHANGED: ${unchanged.length} keys\n`);

const requiredRemoved = removed.filter((k) => REQUIRED_RUNTIME_ENV_KEYS.includes(k));
if (requiredRemoved.length > 0) {
  console.error(
    "[do-spec-diff] BLOCKED: Deploying the canonical spec would delete required secrets from the live app.",
  );
  console.error("  Add the missing key entries (with type: SECRET) to .do/app-nursenest-core-next.yaml");
  process.exit(1);
}

if (removed.length > 0) {
  console.warn("[do-spec-diff] WARN: Optional keys will be removed on deploy — review before proceeding.");
}

console.log("[do-spec-diff] No required env keys removed. Safe to proceed with deploy.");
process.exit(0);
