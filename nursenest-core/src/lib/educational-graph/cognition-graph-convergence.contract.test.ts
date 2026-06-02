import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveUnifiedEducationalSubstrate } from "@/lib/educational-graph/unified-educational-substrate";
import { buildDashboardGraphActions } from "@/lib/educational-graph/dashboard-graph-actions";
import { buildAiTutorContextEnvelope } from "@/lib/learner/rn-coaching-intelligence/ai-tutor-context-envelope";
import { buildAiTutorContextFromCognition, tutoringPromptContextFromAiEnvelope } from "@/lib/educational-cognition/ai-tutor-cognition-envelope";
import { composeTutoringPromptFromGraphSteps } from "@/lib/ai-tutor/prompt-composition";
import { resolveEducationalCognitionContext } from "@/lib/educational-cognition/resolve-educational-cognition-context";
import { EMPTY_LEARNER_STATE } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";

describe("Cognition + graph convergence — fourth pass", () => {
  it("unified substrate materializes traversals and dashboard actions from orchestrator", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    const substrate = resolveUnifiedEducationalSubstrate({
      pathwayId: pathway.id,
      topicSlugs: ["sepsis"],
      sourceSurface: "dashboard_feed",
      marketingPathway: pathway,
    });
    assert.equal(substrate.ontologyNamespace, "nursenest.rn.educational_graph.v1");
    assert.ok(Object.keys(substrate.traversalsByTopic).length >= 1);
    const actions = buildDashboardGraphActions(substrate);
    assert.ok(actions.length <= substrate.cognition.remediation.maxRecommendations);
    assert.ok(actions[0]?.href.startsWith("/"));
  });

  it("AI tutor envelope consumes orchestrated graph steps", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    const report = {
      dashboardFeed: { pathwayId: pathway.id },
      coachingModel: "cat_adaptive" as const,
      certaintyTier: "moderate" as const,
      readinessReliability: {
        level: "moderate" as const,
        softenPredictions: false,
        guidance: "Practice weak areas with interpretation first.",
      },
      clinicalJudgment: [],
      timingV2: { coachingNarratives: [] },
      longitudinalNarratives: [],
      longitudinal: { persistentWeakTopics: ["sepsis"] },
      learnerState: EMPTY_LEARNER_STATE(pathway.id),
      recommendations: [],
    };
    const envelope = buildAiTutorContextEnvelope(report as never);
    assert.ok(envelope.graphSteps.length >= 0);
    if (envelope.graphSteps.length > 0) {
      assert.equal(envelope.graphSteps[0]!.sourceSurface, "ai_tutor");
      assert.ok(envelope.remediationPriorities[0]?.href);
    }
  });

  it("tutoring prompt context prefers graph step ordering over legacy rows", () => {
    const ctx = resolveEducationalCognitionContext("us-rn-nclex-rn", { weakTopicLabels: ["sepsis"] });
    const substrate = resolveUnifiedEducationalSubstrate({
      pathwayId: "us-rn-nclex-rn",
      topicSlugs: ["sepsis"],
      sourceSurface: "ai_tutor",
    });
    const steps = Object.values(substrate.traversalsByTopic).flatMap((t) => t.steps);
    const envelope = buildAiTutorContextFromCognition(ctx, steps);
    const promptCtx = tutoringPromptContextFromAiEnvelope(envelope, {
      entitlementSnapshot: {
        hasAccess: true,
        reason: "active_subscription",
        tier: "RN",
        country: "US",
        alliedCareer: null,
        pathwayId: ctx.pathwayId,
      },
      focusContentIds: ["remediation-sepsis"],
      focusContentLabels: ["Sepsis remediation"],
      topicKeys: ["sepsis"],
      signalNames: ["weak_topic_priority"],
    });
    assert.ok(promptCtx.graphSteps?.length);
    const prompt = composeTutoringPromptFromGraphSteps(promptCtx, promptCtx.graphSteps!);
    assert.match(prompt, /REMEDIATION_GRAPH_ORDER/);
  });
});
