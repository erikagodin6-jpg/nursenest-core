#!/usr/bin/env node
/**
 * Fail if git tracks paths that should never be committed (dumps, export trees, local DB files).
 * Run from repository root: node scripts/ci/check-forbidden-tracked-paths.mjs
 */
import { execSync } from "node:child_process";
import path from "node:path";

function listTrackedFiles() {
  return execSync("git ls-files", { encoding: "utf8" })
    .split("\n")
    .filter(Boolean);
}

/** Path prefixes (normalized with /) — match if tracked file equals or starts with prefix + "/". */
const FORBIDDEN_PREFIXES = [
  "data/replit-exports/",
  "nursenest-core/data/replit-exports/",
  "replit-export/",
  "export-output/",
  "exports/",
  "backups/",
  "attached_assets/",
  ".legacy-extract/",
  "external/",
  "artifacts/",
  "local-backup/",
  "tmp/",
  "temp/",
  ".push-tmp/",
  "nursenest-core/admin-export/",
  "nursenest-core/downloads/",
  "nursenest-core/local-export/",
  "nursenest-core/.replit-export-staging/",
];

const FORBIDDEN_SUFFIXES = [".dump", ".sqlite", ".sqlite3", ".backup"];

function isForbidden(file) {
  const n = file.replace(/\\/g, "/");
  if (n === "nursenest-core/nursing-import-quarantine.jsonl") return "import_quarantine_file";
  for (const p of FORBIDDEN_PREFIXES) {
    if (n === p.slice(0, -1) || n.startsWith(p)) return `prefix:${p}`;
  }
  const base = path.basename(n);
  for (const s of FORBIDDEN_SUFFIXES) {
    if (n.endsWith(s)) return `suffix:${s}`;
  }
  if (/^pg_dump.*\.sql$/i.test(base)) return "pg_dump_sql";
  if (/^\.?env$/i.test(base) && !n.endsWith(".example")) return "dotenv";
  return null;
}

let bad = 0;
for (const f of listTrackedFiles()) {
  const why = isForbidden(f);
  if (!why) continue;
  console.error(`::error:: check-forbidden-tracked-paths: ${f} (${why}) — remove from index; see docs/ENGINEERING_POLICY.md`);
  bad += 1;
}

if (bad) {
  console.error(
    `\ncheck-forbidden-tracked-paths: ${bad} forbidden path(s). See docs/ENGINEERING_POLICY.md`,
  );
  process.exit(1);
}
console.log("check-forbidden-tracked-paths: OK");
