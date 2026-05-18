import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { MLT_SIMULATION_STARTER_STATE } from "./mlt-simulation-types";
import { evaluateMltWorkflowDecision, evaluateMltWorkflowSession } from "./mlt-simulation-evaluator";

describe("MLS/MLT workflow simulation evaluator", () => {
  it("rewards holding a critical result when specimen integrity is unsafe", () => {
    const evaluation = evaluateMltWorkflowDecision(MLT_SIMULATION_STARTER_STATE, {
      decisionId: "decision-001",
      action: "hold-and-review",
      rationaleKeywords: ["hemolysis", "critical potassium", "verify before release"],
    });

    assert.equal(evaluation.correct, true);
    assert.equal(evaluation.safetyScore, 100);
    assert.equal(evaluation.missedSafetyConcepts.length, 0);
    assert.match(evaluation.feedback, /Evaluate specimen integrity/i);
  });

  it("penalizes releasing a critical potassium from a hemolyzed specimen", () => {
    const evaluation = evaluateMltWorkflowDecision(MLT_SIMULATION_STARTER_STATE, {
      decisionId: "decision-001",
      action: "release-result",
      rationaleKeywords: ["critical", "fast"],
    });

    assert.equal(evaluation.correct, false);
    assert.equal(evaluation.safetyScore, 20);
    assert.ok(evaluation.missedSafetyConcepts.includes("specimen-integrity-before-release"));
    assert.ok(evaluation.missedSafetyConcepts.includes("qc-status-before-reporting"));
    assert.match(evaluation.feedback, /Unsafe or incomplete/i);
  });

  it("rewards smear review when analyzer flags require morphology correlation", () => {
    const evaluation = evaluateMltWorkflowDecision(MLT_SIMULATION_STARTER_STATE, {
      decisionId: "decision-002",
      action: "perform-smear-review",
      rationaleKeywords: ["blast flag", "morphology", "escalation"],
    });

    assert.equal(evaluation.correct, true);
    assert.equal(evaluation.safetyScore, 100);
    assert.equal(evaluation.missedSafetyConcepts.length, 0);
    assert.match(evaluation.feedback, /blast flag/i);
  });

  it("returns a safe failure for unknown decisions", () => {
    const evaluation = evaluateMltWorkflowDecision(MLT_SIMULATION_STARTER_STATE, {
      decisionId: "missing-decision",
      action: "document-and-monitor",
    });

    assert.equal(evaluation.correct, false);
    assert.equal(evaluation.safetyScore, 0);
    assert.ok(evaluation.missedSafetyConcepts.includes("simulation-state-integrity"));
  });

  it("evaluates a passing workflow session", () => {
    const session = evaluateMltWorkflowSession(MLT_SIMULATION_STARTER_STATE, [
      { decisionId: "decision-001", action: "hold-and-review" },
      { decisionId: "decision-002", action: "perform-smear-review" },
    ]);

    assert.equal(session.passed, true);
    assert.equal(session.averageSafetyScore, 100);
    assert.equal(session.evaluations.length, 2);
  });

  it("fails a workflow session with unsafe release behavior", () => {
    const session = evaluateMltWorkflowSession(MLT_SIMULATION_STARTER_STATE, [
      { decisionId: "decision-001", action: "release-result" },
      { decisionId: "decision-002", action: "document-and-monitor" },
    ]);

    assert.equal(session.passed, false);
    assert.ok(session.averageSafetyScore < 85);
    assert.ok(session.evaluations.some((evaluation) => !evaluation.correct));
  });
});
