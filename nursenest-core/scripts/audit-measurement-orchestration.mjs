#!/usr/bin/env node
/**
 * Fourth-pass orchestration audit — canonical entry, graph wiring, learner prioritization.
 */
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("../", import.meta.url).pathname;
const MEASUREMENTS = join(ROOT, "src/lib/measurements");

let exitCode = 0;

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  exitCode = 1;
}

function ok(msg) {
  console.log(`OK: ${msg}`);
}

const required = [
  "clinical-measurement-orchestrator.ts",
  "measurement-graph-integration.ts",
  "measurement-learner-prioritization.ts",
  "measurement-reasoning-expansion.ts",
  "measurement-ai-boundary.ts",
  "measurement-structured-data.ts",
  "measurement-surface-convergence.ts",
];

for (const mod of required) {
  try {
    statSync(join(MEASUREMENTS, mod));
    ok(mod);
  } catch {
    fail(`missing orchestration module ${mod}`);
  }
}

const orchestrator = readFileSync(join(MEASUREMENTS, "clinical-measurement-orchestrator.ts"), "utf8");
if (!orchestrator.includes("orchestrateClinicalMeasurement")) {
  fail("orchestrator missing orchestrateClinicalMeasurement");
} else {
  ok("orchestrateClinicalMeasurement exported");
}

const trend = readFileSync(join(MEASUREMENTS, "measurement-trend-intelligence.ts"), "utf8");
if (!trend.includes("analyzeTrendSeriesV3")) {
  fail("trend intelligence missing analyzeTrendSeriesV3");
} else {
  ok("trend V3 present");
}

const registry = readFileSync(join(MEASUREMENTS, "measurement-governance-registry.ts"), "utf8");
if (!registry.includes("clinical_measurement_orchestrator")) {
  fail("registry missing orchestrator consumer");
} else {
  ok("orchestrator registered");
}
if (!registry.includes("usesOrchestrator")) {
  fail("registry missing usesOrchestrator dimension");
} else {
  ok("orchestration coverage fields");
}

const labsHub = readFileSync(join(ROOT, "src/components/labs/labs-hub-page.tsx"), "utf8");
if (!labsHub.includes("MeasurementInterpretationPanel")) {
  console.warn("WARN: labs hub not wired to MeasurementInterpretationPanel");
} else {
  ok("labs hub interpretation panel");
}

const prompt = readFileSync(join(ROOT, "src/lib/ai-tutor/prompt-composition.ts"), "utf8");
if (!prompt.includes("aiPromptWithMeasurementGuardrails")) {
  fail("AI tutor prompt missing measurement guardrails");
} else {
  ok("AI tutor prompt guardrails");
}

const loftShell = readFileSync(join(ROOT, "src/components/cases/cnple-longitudinal-case-shell.tsx"), "utf8");
if (!loftShell.includes("governLoftCaseCopy")) {
  fail("LOFT case shell missing governLoftCaseCopy");
} else {
  ok("LOFT case shell orchestrator convergence");
}

const ecgClient = readFileSync(join(ROOT, "src/components/ecg-module/ecg-module-client.tsx"), "utf8");
if (!ecgClient.includes("governEcgDrillCopy")) {
  fail("ECG drill client missing governEcgDrillCopy");
} else {
  ok("ECG drill governed copy");
}

const studyPlan = readFileSync(join(ROOT, "src/lib/learner/rn-coaching-intelligence/study-plan-orchestration.ts"), "utf8");
if (!studyPlan.includes("governStudyPlanCopy")) {
  fail("study plan missing governStudyPlanCopy");
} else {
  ok("study plan governed copy");
}

const pdfResults = readFileSync(join(ROOT, "src/components/exam/nclex-cat-results-dashboard.tsx"), "utf8");
if (!pdfResults.includes("governPdfExportCopy")) {
  fail("CAT results PDF path missing governPdfExportCopy");
} else {
  ok("PDF export governed interpretation");
}

process.exit(exitCode);
