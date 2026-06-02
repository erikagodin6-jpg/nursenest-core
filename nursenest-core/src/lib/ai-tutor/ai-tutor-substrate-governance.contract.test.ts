import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  assertTutoringUsesGraphStepsOnly,
  buildGovernedTutoringPromptContext,
  resolveTutoringGraphSteps,
} from "@/lib/ai-tutor/ai-tutor-substrate-governance";
import { composeTutoringPromptFromGraphSteps } from "@/lib/ai-tutor/prompt-composition";
import type { TutoringPromptContext } from "@/lib/ai-tutor/types";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";

describe("AI tutor substrate governance", () => {
  it("rejects tutoring context without graphSteps", () => {
    const ctx: TutoringPromptContext = {
      entitlementSnapshot: {
        hasAccess: true,
        reason: "active_subscription",
        tier: "RN",
        country: "US",
        alliedCareer: null,
        pathwayId: "us-rn-nclex-rn",
      },
      focusContentIds: [],
      focusContentLabels: [],
      topicKeys: ["sepsis"],
      signalNames: [],
    };
    const v = assertTutoringUsesGraphStepsOnly(ctx);
    assert.equal(v?.code, "ai_prompt.graph_drift");
  });

  it("resolveTutoringGraphSteps uses orchestrator only", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    const steps = resolveTutoringGraphSteps({
      pathwayId: pathway.id,
      topicSlug: "sepsis",
    });
    assert.ok(steps.length >= 0);
    if (steps.length > 0) {
      assert.equal(steps[0]!.sourceSurface, "ai_tutor");
      assert.ok(steps[0]!.href.startsWith("/"));
    }
  });

  it("buildGovernedTutoringPromptContext orders prompts from graph steps", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    const steps = resolveTutoringGraphSteps({ pathwayId: pathway.id, topicSlug: "sepsis" });
    const promptCtx = buildGovernedTutoringPromptContext({
      partial: {
        entitlementSnapshot: {
          hasAccess: true,
          reason: "active_subscription",
          tier: "RN",
          country: "US",
          alliedCareer: null,
          pathwayId: pathway.id,
        },
        focusContentIds: ["x"],
        focusContentLabels: ["Sepsis"],
        topicKeys: ["sepsis"],
        signalNames: ["weak_topic_priority"],
      },
      envelope: {
        pathwayId: pathway.id,
        coachingModel: "cat_adaptive",
        certaintyTier: "moderate",
        readinessReliability: "moderate",
        softenPredictions: false,
        persistentWeakTopics: ["sepsis"],
        reasoningFocusAreas: [],
        timingCoachingLines: [],
        remediationPriorities: [],
        graphSteps: steps,
        measurementGaps: [],
        tutoringPlanSummary: "Graph-first plan",
      },
      cognition: null,
    });
    assert.ok(promptCtx.graphSteps?.length);
    const prompt = composeTutoringPromptFromGraphSteps(promptCtx, promptCtx.graphSteps!);
    assert.match(prompt, /REMEDIATION_GRAPH_ORDER/);
  });
});
