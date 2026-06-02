import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { composeTutoringPromptFromGraphSteps, composeTutoringPromptEnvelope } from "@/lib/ai-tutor/prompt-composition";
import { StubTutoringProvider } from "@/lib/ai-tutor/tutoring-provider";
import type { EduGraphStep } from "@/lib/educational-graph/graph-step-contract";

const ROOT = process.cwd();
const AI_TUTOR_DIR = join(ROOT, "src/lib/ai-tutor");
const FORBIDDEN_SYNTHESIS = [
  /buildRnRemediationGraphSteps\s*\(/,
  /orchestrateEducationalGraph\s*\(/,
  /new\s+RemediationLadder/,
];

function readTsFiles(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...readTsFiles(p));
    else if (name.endsWith(".ts") && !name.endsWith(".test.ts") && !name.endsWith(".contract.test.ts")) {
      out.push(readFileSync(p, "utf8"));
    }
  }
  return out;
}

test("tutoring provider uses graph steps when present", async () => {
  const provider = new StubTutoringProvider();
  const steps: EduGraphStep[] = [
    {
      stepId: "step-1",
      stepKind: "lesson",
      topicSlug: "sepsis",
      title: "Review",
      description: "Review weak area",
      href: "/app/review",
      competencyId: "cardiovascular",
      educationalIntent: "remediation_review",
      telemetryMetadata: { reasoningRelation: "reinforce" },
    },
  ];
  const ctx = {
    entitlementSnapshot: {
      hasAccess: true,
      reason: "active_subscription" as const,
      tier: "RN" as const,
      country: "US" as const,
      alliedCareer: null,
      pathwayId: "us-rn-nclex-rn",
    },
    topicKeys: ["sepsis"],
    signalNames: [],
    focusContentIds: [],
    focusContentLabels: [],
    graphSteps: steps,
  };
  const rec = await provider.generateRecommendation(ctx);
  assert.ok(rec);
  const prompt = composeTutoringPromptFromGraphSteps(ctx, steps);
  assert.match(prompt, /REMEDIATION_GRAPH_ORDER/);
  assert.match(prompt, /STEP_1_KIND/);
});

test("envelope-only prompt does not require graph steps", () => {
  const base = composeTutoringPromptEnvelope({
    entitlementSnapshot: {
      hasAccess: true,
      reason: "active_subscription",
      tier: "RN",
      country: "US",
      alliedCareer: null,
      pathwayId: "us-rn-nclex-rn",
    },
    topicKeys: [],
    signalNames: [],
    focusContentIds: [],
    focusContentLabels: [],
  });
  assert.match(base, /TESTING_MODEL/);
  assert.doesNotMatch(base, /REMEDIATION_GRAPH_ORDER/);
});

test("ai-tutor modules do not synthesize graph context independently", () => {
  const allowedOrchestration = [
    "tutoring-provider.ts",
    "deterministic-fallback.ts",
    "ai-tutor-substrate-governance.ts",
  ];
  for (const name of readdirSync(AI_TUTOR_DIR)) {
    const p = join(AI_TUTOR_DIR, name);
    if (!name.endsWith(".ts") || name.endsWith(".test.ts") || name.endsWith(".contract.test.ts")) continue;
    if (statSync(p).isDirectory()) continue;
    if (allowedOrchestration.includes(name)) continue;
    const src = readFileSync(p, "utf8");
    for (const forbidden of FORBIDDEN_SYNTHESIS) {
      assert.ok(!forbidden.test(src), `Forbidden graph synthesis in ${name}`);
    }
  }
  const promptComposition = readFileSync(join(AI_TUTOR_DIR, "prompt-composition.ts"), "utf8");
  assert.match(promptComposition, /composeTutoringPromptFromGraphSteps/);
});

test("tutoring-provider references composeTutoringPromptFromGraphSteps", () => {
  const src = readFileSync(join(AI_TUTOR_DIR, "tutoring-provider.ts"), "utf8");
  assert.match(src, /composeTutoringPromptFromGraphSteps/);
  assert.match(src, /composeTutoringPromptEnvelope/);
});

test("coaching envelope routes through orchestrateEducationalGraph", () => {
  const src = readFileSync(
    join(ROOT, "src/lib/learner/rn-coaching-intelligence/ai-tutor-context-envelope.ts"),
    "utf8",
  );
  assert.match(src, /orchestrateEducationalGraph/);
  assert.match(src, /graphSteps/);
  assert.match(src, /orchestrateEducationalGraph/);
});
