#!/usr/bin/env node
/**
 * Ensures remediation planners/navigation delegate to orchestrateEducationalGraph.
 * Run: node nursenest-core/scripts/audit-remediation-traversal.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcRoot = path.join(appRoot, "src");

const REQUIRED_ORCHESTRATOR = "orchestrateEducationalGraph";
const GOVERNED_FILES = [
  "src/lib/learner/rn-coaching-intelligence/remediation-planner-v3.ts",
  "src/lib/breadcrumbs/remediation-navigation.ts",
];

const FORBIDDEN_PARALLEL = [
  { pattern: /buildRemediationNavigationLadder[\s\S]*buildRnRemediationGraphSteps/, file: "remediation-traversal.ts" },
];

function read(rel) {
  return fs.readFileSync(path.join(appRoot, rel), "utf8");
}

const failures = [];

for (const rel of GOVERNED_FILES) {
  const text = read(rel);
  if (!text.includes(REQUIRED_ORCHESTRATOR)) {
    failures.push(`${rel}: missing ${REQUIRED_ORCHESTRATOR}`);
  }
  if (text.includes("buildRnRemediationGraphSteps(") && rel.includes("remediation-planner-v3")) {
    failures.push(`${rel}: must not call buildRnRemediationGraphSteps — use orchestrator directly`);
  }
}

const traversal = read("src/lib/learner/rn-coaching-intelligence/remediation-traversal.ts");
if (traversal.includes("buildRemediationNavigationLadder(")) {
  failures.push("remediation-traversal.ts: must not fall back to navigation ladder (single authority)");
}
if (traversal.includes("navigation_ladder")) {
  failures.push("remediation-traversal.ts: legacy navigation_ladder source label");
}

if (failures.length > 0) {
  console.error("[audit-remediation-traversal] FAILED:\n", failures.map((f) => `  - ${f}`).join("\n"));
  process.exit(1);
}

console.log("[audit-remediation-traversal] OK — planner and navigation use orchestrateEducationalGraph");
