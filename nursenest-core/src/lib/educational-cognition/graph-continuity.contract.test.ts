/**
 * Run: node --import tsx --test src/lib/educational-cognition/graph-continuity.contract.test.ts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildGraphContinuityFromTraversal,
  pruneStaleGraphContinuity,
  validateGraphContinuityReplay,
} from "@/lib/educational-cognition/graph-next-step-continuity";
import { resolveEducationalCognitionContext } from "@/lib/educational-cognition/resolve-educational-cognition-context";
import { orchestrateEducationalGraph } from "@/lib/educational-graph/educational-graph-orchestrator";

describe("graph continuity semantics", () => {
  it("buildGraphContinuityFromTraversal captures momentum and anchors", () => {
    const ctx = resolveEducationalCognitionContext("us-rn-nclex-rn", {
      weakTopicLabels: ["pharmacology"],
    });
    const steps = orchestrateEducationalGraph({
      topicSlug: "pharmacology",
      topicLabel: "pharmacology",
      pathwayId: "us-rn-nclex-rn",
      sourceSurface: "dashboard_feed",
      coachingModel: ctx.coachingModel,
      learnerState: ctx.learnerState,
      persistentWeakTopics: ["pharmacology"],
    }).steps;

    const continuity = buildGraphContinuityFromTraversal({
      topicSlug: "pharmacology",
      steps,
      ctx,
      dashboardPrimaryHref: steps[0]?.href ?? null,
    });

    assert.equal(continuity.currentTopicSlug, "pharmacology");
    assert.ok(continuity.remediationPathwayIds.length >= 0);
    assert.ok(continuity.graphCheckpointAt);
  });

  it("pruneStaleGraphContinuity trims aged checkpoints", () => {
    const stale = pruneStaleGraphContinuity({
      currentTopicSlug: "old",
      remediationPathwayIds: ["/app/a", "/app/b", "/app/c", "/app/d", "/app/e", "/app/f"],
      glossaryContinuityKeys: [],
      interpretationContinuityKeys: [],
      lastGraphStepId: null,
      lastGraphHref: null,
      graphCheckpointAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
    assert.ok(stale.remediationPathwayIds.length <= 4);
  });

  it("validateGraphContinuityReplay warns on version mismatch", () => {
    const v = validateGraphContinuityReplay({
      currentTopicSlug: "x",
      remediationPathwayIds: [],
      glossaryContinuityKeys: [],
      interpretationContinuityKeys: [],
      lastGraphStepId: null,
      lastGraphHref: null,
      graphVersion: "legacy_graph.v0",
    });
    assert.ok(v.warnings.includes("graph_version_mismatch"));
  });
});
