#!/usr/bin/env node
/**
 * Fail if docs/ENGINEERING_POLICY.md is missing or stripped of required sections.
 * Run from repository root: node scripts/ci/verify-engineering-policy-doc.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const policyPath = path.join(repoRoot, "docs", "ENGINEERING_POLICY.md");

if (!fs.existsSync(policyPath)) {
  console.error("::error:: verify-engineering-policy-doc: docs/ENGINEERING_POLICY.md is missing");
  process.exit(1);
}

const text = fs.readFileSync(policyPath, "utf8");

/** Required section anchors — keep in sync with ENGINEERING_POLICY.md headings. */
const REQUIRED = [
  "## What may be committed",
  "## What must never be committed",
  "## Git LFS",
  "## Object storage",
  "## Database",
  "## Large lesson",
  "## Exports, backups, logs",
  "## Environment variables",
  "## Imports",
  "## Builds",
  "## Enforcement",
];

let bad = 0;
for (const heading of REQUIRED) {
  if (!text.includes(heading)) {
    console.error(`::error:: verify-engineering-policy-doc: missing section "${heading}"`);
    bad += 1;
  }
}

if (bad) {
  console.error(`verify-engineering-policy-doc: ${bad} missing section(s)`);
  process.exit(1);
}

console.log("verify-engineering-policy-doc: OK");
