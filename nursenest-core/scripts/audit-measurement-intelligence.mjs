#!/usr/bin/env node
/**
 * Third-pass measurement intelligence CI audit.
 * - Forbidden raw conversion patterns in learner copy
 * - Ungoverned consumer surfaces
 * - Missing AI governance at coaching boundaries
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("../", import.meta.url).pathname;
const SRC = join(ROOT, "src");
const MEASUREMENTS = join(SRC, "lib/measurements");

let exitCode = 0;

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  exitCode = 1;
}

function ok(msg) {
  console.log(`OK: ${msg}`);
}

// 1) Registry module exists and lists surfaces
try {
  const registryPath = join(MEASUREMENTS, "measurement-governance-registry.ts");
  const registry = readFileSync(registryPath, "utf8");
  if (!registry.includes("MEASUREMENT_CONSUMER_REGISTRY")) {
    fail("measurement-governance-registry.ts missing MEASUREMENT_CONSUMER_REGISTRY");
  } else {
    ok("consumer registry present");
  }
  const ungoverned = (registry.match(/status: "ungoverned"/g) ?? []).length;
  const partial = (registry.match(/status: "partial"/g) ?? []).length;
  console.log(`INFO: registry ungoverned=${ungoverned} partial=${partial}`);
} catch (e) {
  fail(`Cannot read governance registry: ${e.message}`);
}

// 2) Core modules on disk
const requiredModules = [
  "measurement-token-v2.ts",
  "render-measurement-token-v2.ts",
  "measurement-interpretation-engine.ts",
  "measurement-trend-intelligence.ts",
  "measurement-ai-governance.ts",
  "measurement-semantic-layer.ts",
  "measurement-coaching-bridge.ts",
  "clinical-measurement-orchestrator.ts",
  "measurement-graph-integration.ts",
  "measurement-ai-boundary.ts",
];
for (const mod of requiredModules) {
  try {
    statSync(join(MEASUREMENTS, mod));
    ok(`module ${mod}`);
  } catch {
    fail(`missing required module ${mod}`);
  }
}

// 3) Scan learner components for forbidden free-text conversion shortcuts
const FORBIDDEN = [
  /\b\d+\s*mg\/dL\s*=\s*\d+\s*mmol\/L\b/i,
  /\bconvert\s+insulin\b/i,
];
const SCAN_DIRS = [
  join(SRC, "components/student"),
  join(SRC, "components/exam"),
  join(SRC, "lib/learner/post-exam-coaching"),
];

function walk(dir, files = []) {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) walk(p, files);
    else if (/\.(tsx?|mdx)$/.test(ent.name)) files.push(p);
  }
  return files;
}

let forbiddenHits = 0;
for (const dir of SCAN_DIRS) {
  try {
    for (const file of walk(dir)) {
      const text = readFileSync(file, "utf8");
      for (const re of FORBIDDEN) {
        if (re.test(text)) {
          forbiddenHits += 1;
          console.warn(`WARN: forbidden pattern in ${relative(ROOT, file)}`);
        }
      }
    }
  } catch {
    /* dir may not exist */
  }
}
if (forbiddenHits === 0) ok("no forbidden conversion shortcuts in scanned learner surfaces");
else console.log(`INFO: ${forbiddenHits} files flagged for manual review`);

// 4) Coaching should reference AI governance (partial wiring check)
const coachingPath = join(SRC, "lib/learner/post-exam-coaching/coaching-semantics.ts");
try {
  const coaching = readFileSync(coachingPath, "utf8");
  if (
    !coaching.includes("validateAiMeasurementCopy") &&
    !coaching.includes("enforceGovernedAiMeasurementCopy")
  ) {
    fail("post-exam coaching missing AI measurement governance boundary");
  } else {
    ok("post-exam coaching references AI measurement governance");
  }
} catch {
  console.warn("WARN: post-exam coaching path not found");
}

process.exit(exitCode);
