#!/usr/bin/env node
/**
 * Fourth-pass AI governance audit — every generation boundary must reference guardrails.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("../", import.meta.url).pathname;
const SRC = join(ROOT, "src");

let exitCode = 0;

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  exitCode = 1;
}

function ok(msg) {
  console.log(`OK: ${msg}`);
}

const boundaries = [
  {
    label: "post-exam coaching",
    path: join(SRC, "lib/learner/post-exam-coaching/coaching-semantics.ts"),
    needles: ["enforceGovernedAiMeasurementCopy", "validateAiMeasurementCopy"],
  },
  {
    label: "rn coaching governance",
    path: join(SRC, "lib/learner/rn-coaching-intelligence/ai-coaching-governance.ts"),
    needles: ["enforceGovernedAiMeasurementCopy", "sanitizeCoachingNarrative"],
  },
  {
    label: "AI tutor prompt",
    path: join(SRC, "lib/ai-tutor/prompt-composition.ts"),
    needles: ["aiPromptWithMeasurementGuardrails"],
  },
  {
    label: "measurement AI boundary",
    path: join(SRC, "lib/measurements/measurement-ai-boundary.ts"),
    needles: ["enforceGovernedAiMeasurementCopy", "measurementAiPromptGuardrail"],
  },
];

for (const b of boundaries) {
  try {
    const text = readFileSync(b.path, "utf8");
    const missing = b.needles.filter((n) => !text.includes(n));
    if (missing.length) {
      fail(`${b.label} missing: ${missing.join(", ")}`);
    } else {
      ok(`${b.label} guarded`);
    }
  } catch (e) {
    fail(`cannot read ${b.label}: ${e.message}`);
  }
}

const registry = readFileSync(join(SRC, "lib/measurements/measurement-governance-registry.ts"), "utf8");
const aiPartial = (registry.match(/domain: "ai"[\s\S]*?status: "partial"/g) ?? []).length;
if (aiPartial > 0) {
  console.warn(`WARN: ${aiPartial} AI registry entries still partial — tighten when all routes wired`);
}

process.exit(exitCode);
