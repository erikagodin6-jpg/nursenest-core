#!/usr/bin/env npx tsx
/**
 * CI governance audit — educational cognition orchestration wiring.
 * Exits 1 when critical orchestration modules or contracts are missing.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(process.cwd(), "src");
let failures = 0;

function requireFile(rel: string): void {
  const path = join(ROOT, rel);
  if (!existsSync(path)) {
    console.error(`[audit] missing: ${rel}`);
    failures += 1;
    return;
  }
  console.log(`[audit] ok: ${rel}`);
}

function requirePattern(rel: string, pattern: RegExp, label: string): void {
  const path = join(ROOT, rel);
  if (!existsSync(path)) {
    console.error(`[audit] missing file for pattern ${label}: ${rel}`);
    failures += 1;
    return;
  }
  const content = readFileSync(path, "utf8");
  if (!pattern.test(content)) {
    console.error(`[audit] pattern fail (${label}): ${rel}`);
    failures += 1;
    return;
  }
  console.log(`[audit] pattern ok: ${label}`);
}

console.log("Educational cognition governance audit\n");

requireFile("lib/testing/psychometric-orchestrator.ts");
requireFile("lib/testing/policies/readiness-policy.ts");
requireFile("lib/testing/policies/telemetry-policy.ts");
requireFile("lib/educational-cognition/resolve-educational-cognition-context.ts");
requireFile("lib/educational-cognition/dashboard-composition-engine.ts");
requireFile("lib/educational-cognition/learner-dashboard-cognition-surface.ts");
requireFile("lib/educational-cognition/client-telemetry-governance.ts");
requireFile("lib/educational-cognition/measurement-cognition-bridge.ts");
requireFile("lib/educational-cognition/report-card-cognition.ts");
requireFile("lib/educational-cognition/adaptive-recommendation-cognition.ts");
requireFile("lib/educational-cognition/cognition-substrate.ts");
requireFile("lib/observability/governed-learner-analytics.ts");

requirePattern(
  "lib/educational-cognition/resolve-educational-cognition-context.ts",
  /resolveEducationalCognitionContext/,
  "cognition resolver",
);
requirePattern(
  "lib/testing/psychometric-orchestrator.ts",
  /resolvePsychometricContext/,
  "psychometric resolver",
);
requirePattern(
  "lib/observability/governed-learner-analytics.ts",
  /captureGovernedLearnerProductEvent/,
  "governed analytics",
);
requirePattern(
  "lib/learner/load-learner-dashboard.ts",
  /resolveDashboardEducationalCognition/,
  "dashboard cognition wiring",
);
requirePattern(
  "lib/educational-cognition/cognition-telemetry-governance.ts",
  /cognition_context_resolved/,
  "telemetry V5 events",
);
requirePattern(
  "lib/testing/policies/readiness-policy.ts",
  /applyReadinessPresentationPolicy/,
  "readiness presentation policy",
);
requirePattern(
  "lib/educational-cognition/report-card-cognition.ts",
  /orchestrateEducationalGraph/,
  "report card graph orchestration",
);
requirePattern(
  "lib/remediation/cnple-readiness-scoring.ts",
  /presentGovernedCnpleReadinessReport/,
  "CNPLE governed presentation",
);

if (failures > 0) {
  console.error(`\n[audit] FAILED (${failures} issues)`);
  process.exit(1);
}
console.log("\n[audit] PASSED");
