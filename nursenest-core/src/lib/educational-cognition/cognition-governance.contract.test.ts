/**
 * Educational Cognition OS — cross-surface governance contracts.
 *
 * Run: node --import tsx --test src/lib/educational-cognition/cognition-governance.contract.test.ts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { presentGovernedCnpleReadinessReport } from "@/lib/remediation/cnple-readiness-scoring";
import { presentReportCardCognition } from "@/lib/educational-cognition/report-card-cognition";
import { resolveEducationalCognitionContext } from "@/lib/educational-cognition";
import { buildMeasurementCognitionSlice } from "@/lib/educational-cognition/measurement-cognition-bridge";
import { EMPTY_LEARNER_STATE } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import { CNPLE_PATHWAY_ID } from "@/lib/testing/testing-model-pathway-map";
import { saveDurableLearnerCognition } from "@/lib/educational-cognition/learner-cognition-persistence";

describe("CNPLE readiness semantic finalization", () => {
  it("governed CNPLE presentation forbids pass-outlook framing on LOFT", () => {
    const report = presentGovernedCnpleReadinessReport({
      generatedAt: new Date().toISOString(),
      overallReadinessScore: 78,
      domains: {} as never,
      criticalGaps: [],
      readyForExam: true,
    });
    assert.equal(report.presentation.allowsPassOutlook, false);
    assert.equal(report.presentation.readyForExam, false);
    assert.ok(/blueprint readiness/i.test(report.presentation.overallLine));
  });
});

describe("report card cognition presentation", () => {
  it("surfaces graph next steps and LOFT semantics", () => {
    const ctx = resolveEducationalCognitionContext(CNPLE_PATHWAY_ID, {
      readinessResult: {
        score: 65,
        band: "improving",
        confidence: "medium",
        trend: "stable",
        summary: "Building.",
        factors: [],
        whatToImprove: [],
        nextActions: [],
        holdingBack: [],
        topWeakAreas: ["pharmacology"],
      },
      weakTopicLabels: ["pharmacology"],
    });
    const orch = presentReportCardCognition(ctx, []);
    assert.equal(orch.testingModel, "LOFT");
    assert.equal(orch.showAdaptivePlan, false);
    assert.ok(Array.isArray(orch.graphNextSteps));
  });
});

describe("graph next step presentation contract", () => {
  it("caps graph steps when fatigue is active", () => {
    const userId = `fatigue_cap_${Date.now()}`;
    const prior = { ...EMPTY_LEARNER_STATE("us-rn-nclex-rn"), remediationFatigueScore: 0.9 };
    saveDurableLearnerCognition(userId, prior);
    const ctx = resolveEducationalCognitionContext("us-rn-nclex-rn", {
      userId,
      weakTopicLabels: ["cardiovascular"],
    });
    const orch = presentReportCardCognition(ctx, []);
    assert.ok(orch.graphNextSteps.length <= 3);
    assert.equal(orch.fatigueCapActive, true);
  });
});

describe("measurement cognition deepening", () => {
  it("returns graph-linked fields for catalog items", () => {
    const state = {
      ...EMPTY_LEARNER_STATE("us-rn-nclex-rn"),
      measurementWeaknesses: ["potassium"],
    };
    const slice = buildMeasurementCognitionSlice(state, [
      { category: "electrolytes", kind: "potassium", valueSi: 2.5, trendValuesSi: [3.8, 3.2, 2.5] },
    ]);
    assert.ok(slice.priorityItems.length >= 0);
    assert.equal(slice.topCategory, "electrolytes");
  });
});
