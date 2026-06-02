import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildQaPersonaPlaywrightPlan,
  buildQaPersonaReplayTimeline,
  buildQaPersonaStateInjection,
  listQaPersonaTemplatesForTier,
  QA_PERSONA_TEMPLATES,
} from "@/lib/qa-personas/qa-persona-system";

describe("QA persona system", () => {
  it("defines persistent persona templates across RN, RPN/LPN, and NP", () => {
    assert.ok(listQaPersonaTemplatesForTier("RN").length >= 4);
    assert.ok(listQaPersonaTemplatesForTier("RPN_LPN").length >= 3);
    assert.ok(listQaPersonaTemplatesForTier("NP").length >= 3);
    for (const template of QA_PERSONA_TEMPLATES) {
      assert.ok(template.pathwayId.length > 3, template.id);
      assert.ok(template.weaknessPattern.length > 0, template.id);
      assert.ok(template.dashboardExpectation.length > 20, template.id);
    }
  });

  it("injects realistic learner state with remediation triggers", () => {
    const state = buildQaPersonaStateInjection("rn-telemetry-weak");
    assert.ok(state.readiness.telemetry < state.readiness.medicationSafety);
    assert.ok(state.remediationTriggers.some((trigger) => trigger.expectedSurface === "/app/ecg-video-quiz"));
    assert.equal(state.confidence.calibration, "overconfident");
  });

  it("builds Playwright-ready plans for onboarding, dashboard, and remediation validation", () => {
    const plan = buildQaPersonaPlaywrightPlan("rpn-escalation-hesitation");
    assert.equal(plan.personaId, "rpn-escalation-hesitation");
    assert.ok(plan.setupTags.includes("RPN_LPN"));
    assert.deepEqual(plan.flows.map((flow) => flow.id), ["onboarding", "dashboard", "remediation"]);
    assert.ok(plan.flows.every((flow) => flow.expected.length > 0));
  });

  it("creates deterministic replay timelines for adaptive ecosystem debugging", () => {
    const timeline = buildQaPersonaReplayTimeline("np-diagnostics-weak");
    assert.equal(timeline[0]?.surface, "onboarding");
    assert.equal(timeline.at(-1)?.surface, "report_card");
    assert.ok(timeline.some((event) => /diagnostics|readiness|remediation/i.test(event.expectedStateChange)));
  });
});
