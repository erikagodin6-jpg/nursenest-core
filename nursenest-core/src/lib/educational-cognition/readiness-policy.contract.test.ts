/**
 * Readiness policy — single semantic authority contracts.
 *
 * Run: node --import tsx --test src/lib/educational-cognition/readiness-policy.contract.test.ts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyReadinessPresentationPolicy,
  getTestingModelReadinessSemantics,
  presentCnpleReadinessForPathway,
} from "@/lib/testing/policies/readiness-policy";
import { CNPLE_PATHWAY_ID } from "@/lib/testing/testing-model-pathway-map";

describe("readiness-policy authority", () => {
  it("LOFT semantics disallow pass outlook and precision band", () => {
    const s = getTestingModelReadinessSemantics(CNPLE_PATHWAY_ID);
    assert.equal(s.model, "LOFT");
    assert.equal(s.allowsPassOutlook, false);
    assert.equal(s.allowsPrecisionBand, false);
  });

  it("CNPLE presentation uses blueprint readiness label", () => {
    const p = presentCnpleReadinessForPathway(CNPLE_PATHWAY_ID, {
      overallReadinessScore: 80,
      readyForExam: true,
      criticalGaps: [],
    });
    assert.equal(p.allowsPassOutlook, false);
    assert.equal(p.readyForExam, false);
    assert.ok(/blueprint readiness/i.test(p.overallLine));
  });

  it("applyReadinessPresentationPolicy strips outlook factors", () => {
    const out = applyReadinessPresentationPolicy(CNPLE_PATHWAY_ID, {
      score: 70,
      band: "near_ready",
      confidence: "medium",
      trend: "stable",
      summary: "Estimate.",
      factors: [{ id: "mock_performance", label: "Pass outlook", points: 5, maxPoints: 20, detail: "x" }],
      whatToImprove: [],
      nextActions: [],
      holdingBack: [],
      topWeakAreas: [],
    });
    assert.equal(out.factors.length, 0);
  });
});
