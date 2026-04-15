#!/usr/bin/env node
/**
 * Supplement Gitleaks: fail on high-confidence secret patterns in git-tracked files.
 * Run from repo root: node scripts/ci/scan-tracked-secret-patterns.mjs
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function listTrackedFiles() {
  return execSync("git ls-files", { encoding: "utf8" })
    .split("\n")
    .filter(Boolean);
}

/** Paths that may contain fake secret-shaped strings for tests or redaction demos. */
const PATH_ALLOW = [
  /^nursenest-core\/src\/lib\/env\/redact-secrets\.test\.ts$/,
  /^nursenest-core\/src\/lib\/stripe\/stripe-webhook-signature-contract\.test\.ts$/,
  /^nursenest-core\/src\/lib\/admin\/system-status-derive\.test\.ts$/,
  /^nursenest-core\/src\/lib\/db\/database-policy\.test\.ts$/,
];

function isAllowedPath(file) {
  return PATH_ALLOW.some((re) => re.test(file));
}

const TEXT_EXT = new Set([
  ".ts",
  ".tsx",
  ".mts",
  ".cts",
  ".js",
  ".mjs",
  ".cjs",
  ".md",
  ".json",
  ".yml",
  ".yaml",
  ".sh",
  ".toml",
  ".env.example",
]);

function isProbablyText(file) {
  const ext = path.extname(file);
  if (TEXT_EXT.has(ext)) return true;
  if (file.endsWith(".env.example") || file.endsWith(".env.playwright.example")) return true;
  return false;
}

/** High-confidence patterns (not common in placeholders). */
const PATTERNS = [
  { name: "pem_private_key_block", re: /-----BEGIN [A-Z0-9 ]*PRIVATE KEY-----/ },
  { name: "aws_access_key", re: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: "stripe_live_secret", re: /\bsk_live_[0-9a-zA-Z]{24,}\b/ },
];

let failures = 0;

for (const file of listTrackedFiles()) {
  if (isAllowedPath(file)) continue;
  if (!isProbablyText(file)) continue;
  let body;
  try {
    body = fs.readFileSync(file, "utf8");
  } catch {
    continue;
  }
  for (const { name, re } of PATTERNS) {
    if (re.test(body)) {
      console.error(`::error:: scan-tracked-secret-patterns: ${name} matched in ${file}`);
      failures += 1;
    }
  }
}

if (failures > 0) {
  console.error(
    `\nscan-tracked-secret-patterns: ${failures} finding(s). Remove secrets from history if they reached main — see docs/SECRETS_AND_ENV.md`,
  );
  process.exit(1);
}

console.log("scan-tracked-secret-patterns: ok");
