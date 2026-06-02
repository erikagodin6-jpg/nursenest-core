#!/usr/bin/env node
/**
 * Migration safety linter.
 *
 * Enforces two rules across migration files:
 *   1. CREATE INDEX must use CONCURRENTLY — prevents AccessExclusiveLock.
 *   2. No DROP TABLE, TRUNCATE, DROP COLUMN without a safety comment.
 *
 * Default: checks only migration files modified/added in the current git diff
 *   (vs HEAD). This avoids failing on historical migrations that cannot be
 *   changed without breaking Prisma checksum validation.
 *
 * Flags:
 *   --all          Check every migration file (for full auditing, not CI enforcement).
 *   --base <ref>   Diff against <ref> instead of HEAD (e.g. --base origin/main).
 *
 * Run:  node scripts/check-migration-safety.mjs
 * CI:   exits 1 if any violation found in new/changed migrations.
 */
import { readFileSync, existsSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = resolve(__dirname, "..");
const REPO_ROOT = resolve(__dirname, "../..");

// ── CLI args ─────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const ALL_MODE = args.includes("--all");
const baseIdx = args.indexOf("--base");
const BASE_REF = baseIdx !== -1 ? args[baseIdx + 1] : "HEAD";

// ── Patterns ─────────────────────────────────────────────────────────────────
const BLOCKING_INDEX_RE = /\bCREATE\s+(?:UNIQUE\s+)?INDEX\s+(?!CONCURRENTLY\b)/i;
const CONCURRENT_INDEX_RE = /\bCREATE\s+(?:UNIQUE\s+)?INDEX\s+CONCURRENTLY\b/i;
const DESTRUCTIVE_DDL_RE = /\b(DROP\s+TABLE|TRUNCATE|DROP\s+COLUMN)\b/i;
const SAFETY_COMMENT_RE = /--\s*(SAFE|safe-to-run|migration-safe|reviewed|intentional)/i;

// ── File discovery ────────────────────────────────────────────────────────────

function sh(cmd, cwd = REPO_ROOT) {
  try {
    return execSync(cmd, { cwd, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim();
  } catch {
    return "";
  }
}

function getGitChangedSqlFiles() {
  const changed = new Set();

  // Files changed vs BASE_REF (committed or staged)
  const diffOut = sh(`git diff --name-only --diff-filter=ACM ${BASE_REF} -- "*.sql"`);
  for (const line of diffOut.split("\n").filter(Boolean)) {
    changed.add(resolve(REPO_ROOT, line.trim()));
  }

  // Unstaged/untracked new SQL files
  const statusOut = sh(`git status --porcelain -- "*.sql"`);
  for (const line of statusOut.split("\n").filter(Boolean)) {
    const file = line.slice(3).trim();
    if (file.endsWith(".sql")) changed.add(resolve(REPO_ROOT, file));
  }

  // Filter to migration paths only
  return [...changed].filter(
    (f) => (f.includes("/migrations/") || f.includes("/migration.sql")) && existsSync(f),
  );
}

function getAllSqlMigrationFiles() {
  const dirs = [join(ROOT, "prisma/migrations"), join(REPO_ROOT, "migrations")];
  const results = [];
  for (const dir of dirs) {
    const out = sh(`find "${dir}" -name "*.sql" -type f 2>/dev/null`);
    for (const line of out.split("\n").filter(Boolean)) results.push(line.trim());
  }
  return results;
}

// ── Lint ──────────────────────────────────────────────────────────────────────

function lintFile(filePath) {
  let src;
  try {
    src = readFileSync(filePath, "utf8");
  } catch {
    return [];
  }
  const lines = src.split("\n");
  const violations = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNo = i + 1;

    // Rule 1: blocking index creation
    if (BLOCKING_INDEX_RE.test(line) && !CONCURRENT_INDEX_RE.test(line)) {
      violations.push({
        line: lineNo,
        rule: "blocking-index",
        message:
          "CREATE INDEX without CONCURRENTLY acquires AccessExclusiveLock — blocks all reads/writes.",
        text: line.trim(),
        hint: [
          "Use: CREATE INDEX CONCURRENTLY IF NOT EXISTS ...",
          'Add at top of file: "-- This migration cannot run in a transaction."',
        ],
      });
    }

    // Rule 2: destructive DDL without safety comment
    if (DESTRUCTIVE_DDL_RE.test(line)) {
      const prevLine = i > 0 ? lines[i - 1] : "";
      if (!SAFETY_COMMENT_RE.test(prevLine)) {
        violations.push({
          line: lineNo,
          rule: "destructive-ddl",
          message: "Destructive DDL without a safety comment on the preceding line.",
          text: line.trim(),
          hint: ['Add "-- SAFE: <reason>" on the line immediately before this statement.'],
        });
      }
    }
  }

  return violations;
}

// ── Main ──────────────────────────────────────────────────────────────────────

const filesToCheck = ALL_MODE ? getAllSqlMigrationFiles() : getGitChangedSqlFiles();

if (filesToCheck.length === 0) {
  console.log(ALL_MODE ? "No migration SQL files found." : "✅  No changed migration files to lint.");
  process.exit(0);
}

const mode = ALL_MODE ? "ALL migrations" : `migrations changed since ${BASE_REF}`;
console.log(`Checking ${filesToCheck.length} file(s) [${mode}]...\n`);

let totalViolations = 0;

for (const filePath of filesToCheck) {
  const violations = lintFile(filePath);
  if (violations.length === 0) continue;

  const rel = relative(REPO_ROOT, filePath);
  console.error(`❌  ${rel}`);
  for (const v of violations) {
    console.error(`   Line ${v.line} [${v.rule}] ${v.message}`);
    console.error(`   → ${v.text}`);
    for (const h of v.hint) console.error(`   Hint: ${h}`);
    console.error("");
  }
  totalViolations += violations.length;
}

if (totalViolations === 0) {
  console.log(`✅  Migration safety check passed (${filesToCheck.length} file(s) scanned).`);
  process.exit(0);
} else {
  console.error(`💥  ${totalViolations} violation(s) found in ${mode}. Fix before deploying.`);
  process.exit(1);
}
