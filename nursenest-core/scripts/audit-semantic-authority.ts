#!/usr/bin/env npx tsx
/**
 * Semantic authority enforcement — blocks parallel readiness/recommendation orchestration.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const SRC = join(process.cwd(), "src");
let failures = 0;

function fail(msg: string): void {
  console.error(`[semantic-authority] ${msg}`);
  failures += 1;
}

function ok(msg: string): void {
  console.log(`[semantic-authority] ok: ${msg}`);
}

function requirePattern(rel: string, pattern: RegExp, label: string): void {
  const path = join(SRC, rel);
  if (!existsSync(path)) {
    fail(`missing ${rel}`);
    return;
  }
  if (!pattern.test(readFileSync(path, "utf8"))) {
    fail(`pattern (${label}) missing in ${rel}`);
    return;
  }
  ok(label);
}

function forbidPattern(rel: string, pattern: RegExp, label: string): void {
  const path = join(SRC, rel);
  if (!existsSync(path)) return;
  const content = readFileSync(path, "utf8");
  if (pattern.test(content)) {
    fail(`${label} — forbidden pattern in ${rel}`);
  }
}

console.log("Semantic authority audit\n");

requirePattern("lib/learner/load-report-card-data.ts", /resolveReportCardCognitionOrchestration/, "report card cognition");
requirePattern("lib/educational-cognition/adaptive-recommendation-cognition.ts", /resolveLearnerCognitionSubstrate/, "adaptive cognition substrate");
requirePattern("lib/testing/policies/readiness-policy.ts", /applyReadinessPresentationPolicy/, "readiness presentation policy");
requirePattern("lib/remediation/cnple-readiness-scoring.ts", /presentCnpleReadinessForPathway/, "CNPLE readiness policy bridge");
requirePattern("lib/educational-cognition/cognition-telemetry-v5.ts", /recordCognitionContextResolvedWithEntitlement/, "entitlement telemetry");

if (failures > 0) {
  console.error(`\n[semantic-authority] FAILED (${failures})`);
  process.exit(1);
}
console.log("\n[semantic-authority] PASSED");
