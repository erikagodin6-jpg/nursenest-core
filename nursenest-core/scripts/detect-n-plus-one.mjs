#!/usr/bin/env node
/**
 * N+1 query detector — static analysis.
 *
 * Scans TypeScript/JavaScript source for high-confidence N+1 patterns:
 *   1. await db/prisma/pool calls inside for...of or while loops.
 *   2. Array.map() / forEach() returning Promises that each make a DB call.
 *
 * This is a heuristic grep-based tool, not a type-aware linter.
 * False positives are possible; review each finding before suppressing.
 *
 * Run:     node scripts/detect-n-plus-one.mjs
 * Options:
 *   --dir <path>    Directory to scan (default: src + server)
 *   --severity <n>  Minimum severity to report (1=low, 2=medium, 3=high, default 2)
 *   --fail          Exit 1 if any HIGH severity finding
 *
 * Suppress a line: add "// nn-db-ok" comment on the same line.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");

const args = process.argv.slice(2);
const dirArg = args[indexOf("--dir")] ?? null;
const severityFloor = Number(args[indexOf("--severity")] ?? 2);
const FAIL_ON_HIGH = args.includes("--fail");

function indexOf(flag) {
  const i = args.indexOf(flag);
  return i !== -1 ? i + 1 : -1;
}

const SCAN_DIRS = dirArg
  ? [join(ROOT, dirArg)]
  : [join(ROOT, "src"), join(ROOT.replace("/nursenest-core", ""), "server")];

// ── Patterns ─────────────────────────────────────────────────────────────────

const DB_CALL_RE =
  /\bawait\s+(?:prisma\.|pool\.query|withRetry\(|timedQuery\(|db\.|drizzle\.)/;

const FOR_OF_RE = /^\s*for\s*(?:const|let|var)?\s*\(.*\s+of\s+/;
const WHILE_RE = /^\s*while\s*\(/;
const FOREACH_RE = /\.\s*(?:forEach|map)\s*\(/;

const SUPPRESS_RE = /\/\/\s*nn-db-ok/i;

// ── File walking ──────────────────────────────────────────────────────────────

const ALLOWED_EXTS = new Set([".ts", ".tsx", ".js", ".mjs", ".cjs"]);
const SKIP_DIRS = new Set([
  "node_modules",
  ".next",
  "dist",
  "build",
  ".git",
  "coverage",
  "__tests__",
  "__mocks__",
]);

function* walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (entry.isFile() && ALLOWED_EXTS.has(extname(entry.name))) {
      // Skip test files
      if (entry.name.includes(".test.") || entry.name.includes(".spec.")) continue;
      yield full;
    }
  }
}

// ── Analysis ──────────────────────────────────────────────────────────────────

/**
 * Simple bracket-depth tracker to know if we're inside a loop body.
 * Approximation — doesn't handle all edge cases.
 */
function analyzeFile(filePath) {
  let src;
  try {
    src = readFileSync(filePath, "utf8");
  } catch {
    return [];
  }

  const lines = src.split("\n");
  const findings = [];

  // Track loop context using a stack of { type, openBrace }
  const loopStack = [];
  let braceDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNo = i + 1;

    if (SUPPRESS_RE.test(line)) continue;

    // Count brace changes
    const openBraces = (line.match(/{/g) || []).length;
    const closeBraces = (line.match(/}/g) || []).length;

    // Check if this line opens a loop
    if (FOR_OF_RE.test(line)) {
      loopStack.push({ type: "for-of", depth: braceDepth + openBraces });
    } else if (WHILE_RE.test(line)) {
      loopStack.push({ type: "while", depth: braceDepth + openBraces });
    }

    braceDepth += openBraces - closeBraces;

    // Pop loops that have closed
    while (loopStack.length > 0 && braceDepth < loopStack[loopStack.length - 1].depth) {
      loopStack.pop();
    }

    // Check for DB call inside a loop
    if (loopStack.length > 0 && DB_CALL_RE.test(line)) {
      const outerLoop = loopStack[loopStack.length - 1];
      findings.push({
        line: lineNo,
        text: line.trim().slice(0, 120),
        loopType: outerLoop.type,
        severity: 3, // HIGH — definite N+1 risk
        rule: "loop-db-call",
        message: `await DB call inside ${outerLoop.type} loop — potential N+1 query per iteration.`,
      });
    }

    // Check for .map/.forEach returning promises with DB calls (on same or next line)
    if (FOREACH_RE.test(line) && DB_CALL_RE.test(line)) {
      findings.push({
        line: lineNo,
        text: line.trim().slice(0, 120),
        loopType: "map/forEach",
        severity: 2, // MEDIUM — may be Promise.all'd (acceptable) or N+1
        rule: "map-db-call",
        message: `.map()/.forEach() with inline DB call — verify Promise.all wraps all queries (otherwise N+1).`,
      });
    }
  }

  return findings;
}

// ── Main ──────────────────────────────────────────────────────────────────────

const SEVERITY_LABEL = { 1: "LOW", 2: "MEDIUM", 3: "HIGH" };

let totalFindings = 0;
let highFindings = 0;

for (const dir of SCAN_DIRS) {
  for (const filePath of walk(dir)) {
    const findings = analyzeFile(filePath).filter((f) => f.severity >= severityFloor);
    if (findings.length === 0) continue;

    const rel = relative(ROOT, filePath);
    console.log(`\n📁  ${rel}`);

    for (const f of findings) {
      const sev = SEVERITY_LABEL[f.severity] ?? "?";
      console.log(`   ${f.severity === 3 ? "🔴" : "🟡"} Line ${f.line} [${sev}] [${f.rule}]`);
      console.log(`      ${f.message}`);
      console.log(`      → ${f.text}`);
      console.log(`      Suppress: add "// nn-db-ok" to the line if this is intentional.`);
    }

    totalFindings += findings.length;
    highFindings += findings.filter((f) => f.severity >= 3).length;
  }
}

console.log(`\n── Summary ─────────────────────────────────────────────────────`);
console.log(`   Total findings (severity >= ${severityFloor}): ${totalFindings}`);
console.log(`   High severity (definite N+1 risk):          ${highFindings}`);

if (totalFindings === 0) {
  console.log(`✅  No N+1 patterns detected.`);
}

if (FAIL_ON_HIGH && highFindings > 0) {
  console.error(`\n💥  ${highFindings} HIGH severity N+1 pattern(s) detected. Fix or suppress with "// nn-db-ok".`);
  process.exit(1);
}
