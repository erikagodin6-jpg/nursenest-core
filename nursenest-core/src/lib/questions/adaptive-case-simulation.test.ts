import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildAdaptiveCaseSimulation } from "@/lib/questions/adaptive-case-simulation";

describe("buildAdaptiveCaseSimulation", () => {
  it("creates an evolving sepsis case for case-study items", () => {
    const sim = buildAdaptiveCaseSimulation({
      id: "q1",
      questionType: "case-study",
      topic: "Sepsis recognition",
      stem: "An older client develops new confusion, tachycardia, and lower blood pressure across the morning.",
      rationale: "New confusion with tachycardia and lower blood pressure suggests possible sepsis and requires escalation.",
    });

    assert.ok(sim);
    assert.equal(sim.title, "Evolving infection case");
    assert.ok(sim.stages.length >= 2);
    assert.ok(sim.decisions.some((decision) => decision.priorityLevel === "optimal"));
    assert.match(sim.teachingPoint, /possible sepsis/i);
  });

  it("does not attach a simulator to straightforward static recall", () => {
    const sim = buildAdaptiveCaseSimulation({
      id: "q2",
      questionType: "single",
      topic: "Infection control",
      stem: "Which PPE is required for contact precautions?",
    });

    assert.equal(sim, null);
  });
});
