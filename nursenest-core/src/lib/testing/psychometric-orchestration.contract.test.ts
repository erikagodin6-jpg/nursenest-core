/**
 * Psychometric + educational cognition orchestration contracts.
 *
 * Run: node --import tsx --test src/lib/testing/psychometric-orchestration.contract.test.ts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveEducationalCognitionContext } from "@/lib/educational-cognition";
import {
  resolvePsychometricContext,
  governOrchestratedLearnerCopy,
} from "@/lib/testing/testing-model";
import { CNPLE_PATHWAY_ID } from "@/lib/testing/testing-model-pathway-map";

describe("resolvePsychometricContext", () => {
  it("CNPLE resolves to LOFT with competency-first dashboard", () => {
    const ctx = resolvePsychometricContext(CNPLE_PATHWAY_ID);
    assert.equal(ctx.model, "LOFT");
    assert.equal(ctx.dashboard.showAdaptiveProgression, false);
    assert.equal(ctx.readiness.allowsPassOutlook, false);
    assert.equal(ctx.coaching.followUpAdaptiveSessionTitle, null);
  });

  it("NCLEX RN resolves to CAT with adaptive progression", () => {
    const ctx = resolvePsychometricContext("us-rn-nclex-rn");
    assert.equal(ctx.model, "CAT");
    assert.equal(ctx.dashboard.showAdaptiveProgression, true);
    assert.equal(ctx.readiness.allowsPassOutlook, true);
  });
});

describe("resolveEducationalCognitionContext", () => {
  it("composes psychometric + dashboard + remediation under one context", () => {
    const ctx = resolveEducationalCognitionContext(CNPLE_PATHWAY_ID);
    assert.equal(ctx.psychometric.model, "LOFT");
    assert.equal(ctx.coachingModel, "loft_readiness");
    assert.equal(ctx.capabilities.adaptive_recommendations, false);
    assert.equal(ctx.dashboard.showAdaptivePlan, false);
    assert.ok(ctx.ontology.competencyIds.length > 0);
    assert.ok(ctx.remediation.graphAwareSequencing);
    assert.ok(ctx.measurement.priorityCount >= 0);
    assert.ok(ctx.ontology.telemetryNamespaces.includes("cognition"));
  });

  it("sanitizes LOFT-forbidden learner copy via orchestration", () => {
    const governed = governOrchestratedLearnerCopy(
      CNPLE_PATHWAY_ID,
      "CNPLE is a computerized adaptive test that adapted to your ability.",
    );
    assert.equal(governed.ok, false);
    assert.ok(!/computerized adaptive test/i.test(governed.sanitized));
  });
});
