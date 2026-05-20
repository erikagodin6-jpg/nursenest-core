/**
 * Run: `node --import tsx --test src/lib/ai-tutor/prompt-composition.test.ts`
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  composeTutoringPromptEnvelope,
  composeTutoringPromptFromGraphSteps,
  escapePlainTextForPromptFragment,
} from "@/lib/ai-tutor/prompt-composition";
import type { EduGraphStep } from "@/lib/educational-graph/graph-step-contract";
import type { TutoringPromptContext } from "@/lib/ai-tutor/types";

const baseCtx = (): TutoringPromptContext => ({
  entitlementSnapshot: {
    hasAccess: true,
    reason: "active_subscription",
    tier: "RN",
    country: "US",
    alliedCareer: null,
    pathwayId: "nclex-rn",
  },
  focusContentIds: ["q1"],
  focusContentLabels: ['Safe <script>alert("x")</script> title'],
  topicKeys: ["fluid_balance"],
  signalNames: ["weak_topic_priority"],
});

describe("prompt-composition", () => {
  it("strips angle brackets from labels", () => {
    const out = escapePlainTextForPromptFragment('<img src="x">');
    assert.match(out, /^[^<>]+$/);
  });

  it("compose uses structured envelope only", () => {
    const env = composeTutoringPromptEnvelope(baseCtx());
    assert.ok(env.includes("PATHWAY_ID: nclex-rn"));
    assert.ok(!env.includes("<script>"));
  });

  it("graph-ordered prompt uses EduGraphStep sequence", () => {
    const steps: EduGraphStep[] = [
      {
        stepId: "interpretation:/clinical/x",
        stepKind: "interpretation",
        competencyId: "fluid_electrolyte_balance",
        topicSlug: "fluid-balance",
        title: "Interpret sodium trends",
        description: "Link labs to perfusion and diuretic response before reassessment.",
        href: "/clinical-interpretation/sodium",
        pathwayId: "us-rn-nclex-rn",
        educationalIntent: "interpretation",
        learnerStateReason: null,
        estimatedMinutes: 12,
        difficulty: "intermediate",
        remediationPriority: 9,
        graphDepth: 1,
        sourceSurface: "ai_tutor",
        telemetryMetadata: { reasoningRelation: "lab_abnormality_to_prioritization" },
      },
    ];
    const env = composeTutoringPromptFromGraphSteps(baseCtx(), steps);
    assert.match(env, /REMEDIATION_GRAPH_ORDER/);
    assert.match(env, /STEP_1_KIND: interpretation/);
    assert.match(env, /fluid_electrolyte_balance/);
  });
});
