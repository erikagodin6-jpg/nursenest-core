/**
 * Dashboard cognition convergence contracts.
 *
 * Run: node --import tsx --test src/lib/educational-cognition/dashboard-governance.contract.test.ts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveEducationalCognitionContext } from "@/lib/educational-cognition";
import { buildLearnerDashboardCognitionSurface } from "@/lib/educational-cognition/learner-dashboard-cognition-surface";
import { composeGovernedDashboard } from "@/lib/educational-cognition/dashboard-composition-engine";
import { buildCognitionCapabilityRegistry } from "@/lib/educational-cognition/cognition-capability-registry";
import { resolvePsychometricContext } from "@/lib/testing/psychometric-orchestrator";
import { CNPLE_PATHWAY_ID } from "@/lib/testing/testing-model-pathway-map";
import { applyReadinessPresentationPolicy } from "@/lib/testing/policies/readiness-policy";
import type { ReadinessResult } from "@/lib/learner/readiness-score";
import { resolveDashboardSubstrateOrchestration } from "@/lib/educational-cognition/dashboard-substrate-orchestration";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";

describe("dashboard composition governance", () => {
  it("LOFT dashboard hides adaptive widgets and pass probability", () => {
    const psych = resolvePsychometricContext(CNPLE_PATHWAY_ID);
    const caps = buildCognitionCapabilityRegistry(psych);
    const dash = composeGovernedDashboard(psych, caps);
    assert.equal(dash.showAdaptivePlan, false);
    const passWidget = dash.widgets.find((w) => w.id === "passProbability");
    assert.equal(passWidget?.eligible, false);
    const adaptive = dash.widgets.find((w) => w.id === "adaptiveEngine");
    assert.equal(adaptive?.eligible, false);
  });

  it("dashboard substrate orchestration orders cards from graph actions only", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    const orch = resolveDashboardSubstrateOrchestration({ pathwayId: pathway.id, topicSlugs: ["sepsis"] });
    assert.ok(orch.graphActions.length <= orch.substrate.cognition.remediation.maxRecommendations);
    assert.ok(orch.graphActions.every((a) => a.step.href === a.href));
    assert.ok(orch.cards.some((c) => c.id.startsWith("graph-")));
  });

  it("dashboard cognition surface mirrors resolver output", () => {
    const ctx = resolveEducationalCognitionContext(CNPLE_PATHWAY_ID);
    const surface = buildLearnerDashboardCognitionSurface(ctx);
    assert.equal(surface.testingModel, "LOFT");
    assert.equal(surface.showAdaptivePlan, false);
    assert.equal(surface.allowsPassOutlook, false);
    assert.equal(surface.widgetEligibility.passProbability, false);
  });
});

describe("readiness presentation policy", () => {
  it("strips pass-outlook factors on LOFT pathways", () => {
    const raw: ReadinessResult = {
      score: 72,
      band: "near_ready",
      confidence: "medium",
      trend: "stable",
      summary: "Early estimate.",
      factors: [
        {
          id: "practice_accuracy",
          label: "Pass probability outlook",
          points: 10,
          maxPoints: 25,
          detail: "Should not appear on LOFT.",
        },
        {
          id: "mock_performance",
          label: "Mock exams",
          points: 18,
          maxPoints: 25,
          detail: "Recent mocks.",
        },
      ],
      whatToImprove: [],
      nextActions: [],
      holdingBack: [],
      topWeakAreas: [],
    };
    const governed = applyReadinessPresentationPolicy(CNPLE_PATHWAY_ID, raw);
    assert.ok(!governed.factors.some((f) => /pass|outlook/i.test(f.label)));
  });
});
