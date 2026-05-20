#!/usr/bin/env node
/**
 * RN coaching intelligence governance audit (fourth-pass CI).
 *
 * - Reasoning ontology integrity
 * - Timing inference suppression (low signal)
 * - Psychometric-unsafe copy patterns in coaching modules
 * - Invalid CoachingModel literals
 * - Remediation navigation default model
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const COACHING_DIR = path.join(ROOT, "src/lib/learner/rn-coaching-intelligence");

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const RESET = "\x1b[0m";
const failures = [];

function pass(label) {
  console.log(`${GREEN}✓${RESET} ${label}`);
}
function fail(label, detail) {
  console.log(`${RED}✗${RESET} ${label}: ${detail}`);
  failures.push({ label, detail });
}

function readAllTs(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...readAllTs(p));
    else if (ent.name.endsWith(".ts") && !ent.name.endsWith(".test.ts")) out.push(p);
  }
  return out;
}

// ── Ontology patterns must match ClinicalJudgmentPattern union usage ─────────
const ontologyFile = path.join(COACHING_DIR, "rn-reasoning-ontology.ts");
const ontologySrc = fs.readFileSync(ontologyFile, "utf8");
const patternIds = [...ontologySrc.matchAll(/pattern:\s*"([^"]+)"/g)].map((m) => m[1]);
if (patternIds.length < 6) {
  fail("RN reasoning ontology size", `Expected ≥6 patterns, found ${patternIds.length}`);
} else {
  pass(`RN reasoning ontology: ${patternIds.length} patterns`);
}

// ── No invalid coaching model "standard" in remediation-navigation ───────────
const remNav = fs.readFileSync(path.join(ROOT, "src/lib/breadcrumbs/remediation-navigation.ts"), "utf8");
if (/coachingModel:\s*args\.coachingModel\s*\?\?\s*"standard"/.test(remNav)) {
  fail("remediation-navigation default model", 'Must not use invalid "standard" — use linear_practice');
} else {
  pass("remediation-navigation uses valid default coaching model");
}

// ── Psychometric unsafe phrases in learner-facing coaching UI builders ───────
const UNSAFE = [
  { re: /\bguaranteed\s+pass\b/i, label: "guaranteed pass" },
  { re: /\b100%\s+ready\b/i, label: "100% ready" },
  { re: /\bstandard error on theta\b/i, label: "CAT theta copy in generic module" },
];
const uiFiles = [
  path.join(COACHING_DIR, "timing-insights-ui.ts"),
  path.join(COACHING_DIR, "dashboard-orchestration-v3.ts"),
  path.join(COACHING_DIR, "ai-tutor-context-envelope.ts"),
  path.join(ROOT, "src/components/student/post-exam-coaching-intelligence-panels.tsx"),
];
for (const f of uiFiles) {
  const src = fs.readFileSync(f, "utf8");
  for (const rule of UNSAFE) {
    if (rule.re.test(src)) fail(`Unsafe copy in ${path.basename(f)}`, rule.label);
  }
}
pass("Psychometric-safe copy scan on coaching UI builders");

// ── Timing suppression: timing-insights-ui must gate on minSignals ───────────
const timingUi = fs.readFileSync(path.join(COACHING_DIR, "timing-insights-ui.ts"), "utf8");
if (!/minSignals/.test(timingUi) || !/reliability === "low"/.test(timingUi)) {
  fail("timing-insights-ui suppression", "Missing minSignals or low-reliability gate");
} else {
  pass("timing-insights-ui includes inference suppression");
}

// ── Orchestration delegates to buildRnCoachingIntelligenceReport ───────────
const buildCoaching = fs.readFileSync(
  path.join(ROOT, "src/lib/learner/post-exam-coaching/build-coaching-report.ts"),
  "utf8",
);
if (!/buildRnCoachingIntelligenceReport/.test(buildCoaching)) {
  fail("post-exam build-coaching-report", "Must delegate to rn-coaching-intelligence engine");
} else {
  pass("post-exam coaching builder delegates to intelligence engine");
}

// ── Learner state schema version ─────────────────────────────────────────────
const stateTypes = fs.readFileSync(path.join(COACHING_DIR, "learner-state-types.ts"), "utf8");
if (!/version:\s*1/.test(stateTypes)) {
  fail("learner-state schema", "Expected version: 1 on snapshot");
} else {
  pass("learner-state schema version present");
}

// ── Fifth-pass: study-plan uses cognition integration ─────────────────────────
const studyPlanPage = fs.readFileSync(
  path.join(ROOT, "src/app/(student)/app/(learner)/study-plan/page.tsx"),
  "utf8",
);
if (!/buildCognitionIntegratedStudyPlan/.test(studyPlanPage)) {
  fail("study-plan page", "Must use buildCognitionIntegratedStudyPlan");
} else {
  pass("study-plan page uses cognition substrate");
}

const substrateFile = path.join(ROOT, "src/lib/educational-cognition/cognition-substrate.ts");
if (!fs.existsSync(substrateFile)) {
  fail("cognition-substrate.ts", "Missing fifth-pass substrate module");
} else {
  pass("cognition-substrate module present");
}

const prismaPersist = path.join(ROOT, "src/lib/educational-cognition/learner-cognition-persistence-prisma.ts");
if (!fs.existsSync(prismaPersist)) {
  fail("learner-cognition-persistence-prisma.ts", "Missing sixth-pass Prisma persistence module");
} else {
  pass("Prisma cognition persistence module present");
}

const migrations = fs.readFileSync(
  path.join(ROOT, "src/lib/educational-cognition/cognition-snapshot-migrations.ts"),
  "utf8",
);
if (!/COGNITION_SNAPSHOT_VERSION/.test(migrations) || !/migrateCognitionEnvelopeFromStorage/.test(migrations)) {
  fail("cognition-snapshot-migrations", "Missing versioned migration registry");
} else {
  pass("cognition snapshot migrations present");
}

const adaptiveCog = fs.readFileSync(
  path.join(ROOT, "src/lib/educational-cognition/adaptive-recommendation-cognition.ts"),
  "utf8",
);
if (
  !/resolveLearnerCognitionSubstrate/.test(adaptiveCog) ||
  !/substrate\.dashboard/.test(adaptiveCog) ||
  !/substrate\.graphSteps/.test(adaptiveCog)
) {
  fail("adaptive-recommendation-cognition", "Must derive from cognition substrate + dashboard + graph");
} else {
  pass("adaptive recommendations converge on cognition substrate");
}

const durabilityModules = [
  "cognition-persistence-observability.ts",
  "cognition-version-governance.ts",
  "cognition-envelope-integrity.ts",
  "repair-durable-learner-cognition-envelope.ts",
  "prepare-durable-cognition-envelope.ts",
  "resolve-measurement-cognition-input.ts",
  "educator-cognition-aggregation.ts",
];
for (const mod of durabilityModules) {
  const p = path.join(ROOT, "src/lib/educational-cognition", mod);
  if (!fs.existsSync(p)) fail(mod, "Missing durability hardening module");
  else pass(`${mod} present`);
}

const versionGov = fs.readFileSync(
  path.join(ROOT, "src/lib/educational-cognition/cognition-version-governance.ts"),
  "utf8",
);
if (!/cognitionSchemaVersion/.test(versionGov) || !/cognitionVersionTelemetryProps/.test(versionGov)) {
  fail("cognition-version-governance", "Missing version metadata helpers");
} else {
  pass("cognition version metadata propagation");
}

const telemetryV5 = fs.readFileSync(
  path.join(ROOT, "src/lib/educational-cognition/cognition-telemetry-v5.ts"),
  "utf8",
);
if (!/cognitionVersionTelemetryProps/.test(telemetryV5)) {
  fail("cognition-telemetry-v5", "Must merge version metadata into telemetry");
} else {
  pass("telemetry V5 includes cognition version metadata");
}

const repairContract = path.join(ROOT, "src/lib/educational-cognition/cognition-repair.contract.test.ts");
if (!fs.existsSync(repairContract)) {
  fail("cognition-repair.contract.test.ts", "Missing repair contract suite");
} else {
  pass("repair contract tests present");
}

// ── Educational Graph OS: substrate + lineage + coverage ───────────────────
const substrateGate = path.join(ROOT, "src/lib/breadcrumbs/governance/graph-substrate-integrity.ts");
if (!fs.existsSync(substrateGate)) {
  fail("graph-substrate-integrity", "Missing graph substrate integrity module");
} else {
  pass("graph-substrate-integrity module present");
}

const lineageGate = path.join(ROOT, "src/lib/breadcrumbs/governance/telemetry-lineage-governance.ts");
if (!fs.existsSync(lineageGate)) {
  fail("telemetry-lineage-governance", "Missing telemetry lineage module");
} else {
  const lineageSrc = fs.readFileSync(lineageGate, "utf8");
  if (!/graphVersion/.test(lineageSrc) || !/ontologyRevision/.test(lineageSrc)) {
    fail("telemetry-lineage-governance", "Missing graphVersion or ontologyRevision stamps");
  } else {
    pass("telemetry lineage includes graph version + ontology revision");
  }
}

const navAnalytics = fs.readFileSync(path.join(ROOT, "src/lib/breadcrumbs/navigation-analytics.ts"), "utf8");
if (!/enrichNavigationTelemetryLineage/.test(navAnalytics)) {
  fail("navigation-analytics", "Must enrich telemetry via lineage governance");
} else {
  pass("navigation-analytics uses telemetry lineage enrichment");
}

const releaseGate = path.join(ROOT, "src/lib/breadcrumbs/governance/semantic-navigation-release-gate.ts");
if (!fs.existsSync(releaseGate)) {
  fail("semantic-navigation-release-gate", "Missing release gate module");
} else {
  pass("semantic-navigation-release-gate present");
}

const pwSpec = path.join(ROOT, "tests/e2e/seo/playwright-breadcrumb-governance.spec.ts");
if (!fs.existsSync(pwSpec)) {
  fail("playwright-breadcrumb-governance", "Missing runtime governance spec");
} else {
  pass("playwright-breadcrumb-governance.spec.ts present");
}

if (failures.length > 0) {
  console.error(`\n${failures.length} governance check(s) failed.`);
  process.exit(1);
}

console.log("\nAll RN coaching governance checks passed.");
process.exit(0);
