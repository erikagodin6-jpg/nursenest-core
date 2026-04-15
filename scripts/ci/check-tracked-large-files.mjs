#!/usr/bin/env node
/**
 * Fail if any git-tracked file exceeds MAX_TRACKED_FILE_BYTES (default 15 MiB).
 * Exceptions: nursenest-core/public/i18n/** ; known debt listed in WARN_ALLOW (warn only).
 * Run from repository root: node scripts/ci/check-tracked-large-files.mjs
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const MAX_BYTES = Number(process.env.MAX_TRACKED_FILE_BYTES ?? 15 * 1024 * 1024);

const ALLOW_PREFIXES = ["nursenest-core/public/i18n/"];

/** Tracked large-file debt — remove from history or relocate (see docs/REPO_COMMIT_POLICY.md). */
const WARN_ALLOW = new Set(["scripts/english-content.json"]);

function listTrackedFiles() {
  return execSync("git ls-files", { encoding: "utf8" })
    .split("\n")
    .filter(Boolean);
}

function allowedPath(f) {
  for (const p of ALLOW_PREFIXES) {
    if (f.startsWith(p)) return "i18n";
  }
  if (WARN_ALLOW.has(f)) return "debt";
  return null;
}

let bad = 0;
for (const f of listTrackedFiles()) {
  let st;
  try {
    st = fs.statSync(f);
  } catch {
    continue;
  }
  if (!st.isFile()) continue;
  const size = st.size;
  if (size <= MAX_BYTES) continue;

  const kind = allowedPath(f);
  if (kind === "i18n") continue;
  if (kind === "debt") {
    console.warn(
      `::warning:: Large tracked file (remediation required): ${f} (${size} bytes). See docs/REPO_COMMIT_POLICY.md`,
    );
    continue;
  }
  console.error(
    `check-tracked-large-files: FAIL — ${f} is ${size} bytes (max ${MAX_BYTES}). Use Git LFS only if appropriate, or object storage / DB.`,
  );
  bad = 1;
}

if (bad) process.exit(1);
console.log(`check-tracked-large-files: OK (max ${MAX_BYTES} bytes; i18n + known debt exempt)`);
