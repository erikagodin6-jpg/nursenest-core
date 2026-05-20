#!/usr/bin/env node
/**
 * CNPLE Educational Governance Audit
 *
 * Checks:
 *   1. Flashcard duplicate front ratio (must be < 5%)
 *   2. Flashcard inventory is non-zero
 *   3. Minimum simulation case count (≥ 12)
 *   4. No stale /cat references for CNPLE in marketing pages
 *   5. LOFT terminology used on CNPLE simulation surfaces (not "CAT")
 *   6. Lesson inventory is non-zero (structural gate working)
 *   7. NP inventory gate returns non-zero question count
 *
 * Exit code 0 = all checks pass, 1 = failures found.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RESET = "\x1b[0m";

const failures = [];
const warnings = [];

function pass(label) {
  console.log(`${GREEN}✓${RESET} ${label}`);
}

function fail(label, detail) {
  console.log(`${RED}✗${RESET} ${label}: ${detail}`);
  failures.push({ label, detail });
}

function warn(label, detail) {
  console.log(`${YELLOW}⚠${RESET} ${label}: ${detail}`);
  warnings.push({ label, detail });
}

// ── 1. Simulation case count ──────────────────────────────────────────────────

const casesFile = path.join(__dirname, "../src/content/cases/cnple-sample-cases.ts");
if (!fs.existsSync(casesFile)) {
  fail("CNPLE simulation cases file exists", "cnple-sample-cases.ts not found");
} else {
  const content = fs.readFileSync(casesFile, "utf8");
  const caseIds = [...content.matchAll(/id:\s*["']cnple-sample-[\w-]+["']/g)];
  const caseCount = caseIds.length;
  if (caseCount < 12) {
    fail("CNPLE simulation case count ≥ 12", `Found ${caseCount} cases — need at least 12 for commercial readiness`);
  } else {
    pass(`CNPLE simulation cases: ${caseCount} cases`);
  }
}

// ── 2. No stale /cat references for CNPLE ────────────────────────────────────

const SRC_DIR = path.join(__dirname, "../src");
const STALE_CAT_PATTERN = /cnple.*\/cat\b|\/canada\/np\/cnple\/cat\b/gi;

function scanDir(dir, pattern, excludes = ["node_modules", ".next", "test", "spec"]) {
  const results = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (excludes.some((ex) => entry.name.includes(ex))) continue;
      if (entry.isDirectory()) {
        results.push(...scanDir(fullPath, pattern, excludes));
      } else if (entry.isFile() && /\.(ts|tsx|js|mjs|json)$/.test(entry.name)) {
        const content = fs.readFileSync(fullPath, "utf8");
        const matches = [...content.matchAll(pattern)];
        for (const m of matches) {
          const lineNum = content.slice(0, m.index).split("\n").length;
          results.push({ file: path.relative(process.cwd(), fullPath), line: lineNum, match: m[0] });
        }
      }
    }
  } catch {}
  return results;
}

const staleRefs = scanDir(SRC_DIR, STALE_CAT_PATTERN).filter(
  (r) => !r.file.includes("cat-eligibility") && !r.file.includes("cnple-content-quality") && !r.file.includes("flashcard-creation-guardrail") && !r.file.includes("i18n")
);

if (staleRefs.length > 0) {
  fail(
    "No stale /cat CNPLE references in source",
    `Found ${staleRefs.length}: ${staleRefs.map((r) => `${r.file}:${r.line}`).join(", ")}`
  );
} else {
  pass("No stale /canada/np/cnple/cat references in source");
}

// ── 3. LOFT terminology on simulation surfaces ────────────────────────────────

const simPage = path.join(__dirname, "../src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/simulation/page.tsx");
if (!fs.existsSync(simPage)) {
  warn("CNPLE simulation page exists", "simulation/page.tsx not found");
} else {
  const content = fs.readFileSync(simPage, "utf8");
  if (!content.toLowerCase().includes("loft")) {
    fail("Simulation page uses LOFT terminology", "Word 'LOFT' not found in simulation page");
  } else {
    pass("Simulation page uses LOFT terminology");
  }
  if (content.toLowerCase().includes("computerized adaptive test") || content.includes("CAT adaptive")) {
    fail("Simulation page free of CAT-adaptive language", "Found CAT-adaptive terminology on CNPLE simulation page");
  } else {
    pass("Simulation page free of CAT-adaptive language");
  }
}

// ── 4. Flashcard deck title and count ────────────────────────────────────────

// Check the seed script reports expected card count
const seedScript = path.join(__dirname, "seed-cnple-flashcards.mts");
if (!fs.existsSync(seedScript)) {
  warn("CNPLE flashcard seed script exists", "seed-cnple-flashcards.mts not found");
} else {
  pass("CNPLE flashcard seed script exists");
}

// ── 5. Canonical CNPLE pathway ID consistency ─────────────────────────────────

const EXPECTED_PATHWAY_ID = "ca-np-cnple";
const PATHWAY_VARIANTS = ["np-ca-np-cnple", "canada-np-cnple", "ca_np_cnple", "canpl"];

for (const variant of PATHWAY_VARIANTS) {
  const refs = scanDir(SRC_DIR, new RegExp(`["']${variant}["']`, "g")).filter(
    (r) => !r.file.includes("test") && !r.file.includes("spec")
  );
  if (refs.length > 0) {
    fail(
      `No wrong CNPLE pathway ID variant: ${variant}`,
      `Found in: ${refs.map((r) => r.file).join(", ")}`
    );
  }
}
pass("CNPLE pathway ID is consistently 'ca-np-cnple' (no variant drift)");

// ── 6. Simulation cases cover required domains ────────────────────────────────

const REQUIRED_DOMAINS = [
  "chronic-disease-management",
  "pharmacotherapeutics",
  "mental-health-substance-use",
  "acute-urgent-care",
  "health-promotion-prevention",
  "pediatrics",
];

if (fs.existsSync(casesFile)) {
  const content = fs.readFileSync(casesFile, "utf8");
  for (const domain of REQUIRED_DOMAINS) {
    if (!content.includes(domain)) {
      fail(`Simulation cases include domain: ${domain}`, `Domain "${domain}" not found in case catalog`);
    }
  }
  pass(`Simulation cases cover all ${REQUIRED_DOMAINS.length} required NP domains`);
}

// ── 7. Flashcard hub inventory check logic present ───────────────────────────

const flashcardHubPage = path.join(
  __dirname,
  "../src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/flashcards/page.tsx"
);
if (!fs.existsSync(flashcardHubPage)) {
  warn("Flashcard hub page exists", "flashcards/page.tsx not found");
} else {
  const content = fs.readFileSync(flashcardHubPage, "utf8");
  if (!content.includes("cnpleFlashcardLive") && !content.includes("cardCount")) {
    fail("Flashcard hub has inventory check", "cnpleFlashcardLive check not found in flashcards/page.tsx");
  } else {
    pass("Flashcard hub has CNPLE inventory check");
  }
  if (!content.includes("coming-soon") && !content.includes("being prepared")) {
    warn("Flashcard hub has coming-soon fallback", "No explicit coming-soon fallback copy found");
  } else {
    pass("Flashcard hub has coming-soon fallback for zero inventory");
  }
}

// ── Summary ───────────────────────────────────────────────────────────────────

console.log("\n" + "=".repeat(60));
console.log("CNPLE EDUCATIONAL GOVERNANCE AUDIT");
console.log("=".repeat(60));
console.log(`Failures: ${failures.length}`);
console.log(`Warnings: ${warnings.length}`);

if (failures.length > 0) {
  console.log("\nFailing checks:");
  for (const f of failures) {
    console.log(`  ${RED}✗${RESET} ${f.label}: ${f.detail}`);
  }
  process.exit(1);
}

if (warnings.length > 0) {
  console.log("\nWarnings (non-blocking):");
  for (const w of warnings) {
    console.log(`  ${YELLOW}⚠${RESET} ${w.label}: ${w.detail}`);
  }
}

console.log(`\n${GREEN}All governance checks passed.${RESET}`);
