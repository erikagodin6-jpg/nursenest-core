import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { MLT_SIMULATION_STARTER_STATE } from "./mlt-simulation-types";
import { applyMltRuntimeDecision, runMltRuntimeSimulation } from "./mlt-simulation-runtime";

describe("MLS/MLT simulation runtime", () => {
  it("clears a completed workflow decision after a safe hold-and-review action", () => {
    const result = applyMltRuntimeDecision(MLT_SIMULATION_STARTER_STATE, {
      decisionId: "decision-001",
      action: "hold-and-review",
    });

    assert.equal(result.correct, true);
    assert.equal(result.safetyScore, 100);
    assert.ok(result.stateChanges.some((change) => /held for review/i.test(change)));
    assert.equal(
      result.nextState.pendingDecisions.some((decision) => decision.decisionId === "decision-001"),
      false,
    );
    assert.ok(
      result.nextState.activeSpecimens.every((specimen) => specimen.analyzerFlags.includes("held-for-review")),
    );
  });

  it("marks recollection workflow after a safe recollection action", () => {
    const result = applyMltRuntimeDecision(MLT_SIMULATION_STARTER_STATE, {
      decisionId: "decision-001",
      action: "request-recollection",
    });

    assert.equal(result.correct, true);
    assert.ok(result.stateChanges.some((change) => /recollection/i.test(change)));
    assert.ok(
      result.nextState.activeSpecimens.every((specimen) => specimen.analyzerFlags.includes("recollection-requested")),
    );
  });

  it("marks smear review after a safe morphology workflow action", () => {
    const result = applyMltRuntimeDecision(MLT_SIMULATION_STARTER_STATE, {
      decisionId: "decision-002",
      action: "perform-smear-review",
    });

    assert.equal(result.correct, true);
    assert.ok(result.stateChanges.some((change) => /smear review/i.test(change)));
    assert.ok(
      result.nextState.activeSpecimens.every((specimen) => specimen.analyzerFlags.includes("smear-review-performed")),
    );
  });

  it("increases operational pressure after an unsafe action", () => {
    const result = applyMltRuntimeDecision(MLT_SIMULATION_STARTER_STATE, {
      decisionId: "decision-001",
      action: "release-result",
    });

    assert.equal(result.correct, false);
    assert.equal(result.nextState.staffingPressure, "critical-shortage");
    assert.equal(result.nextState.turnaroundPressure, "critical-delay");
    assert.equal(
      result.nextState.pendingDecisions.some((decision) => decision.decisionId === "decision-001"),
      true,
      "unsafe action should leave the decision unresolved",
    );
  });

  it("runs a passing multi-step runtime simulation", () => {
    const result = runMltRuntimeSimulation(MLT_SIMULATION_STARTER_STATE, [
      { decisionId: "decision-001", action: "hold-and-review" },
      { decisionId: "decision-002", action: "perform-smear-review" },
    ]);

    assert.equal(result.passed, true);
    assert.equal(result.averageSafetyScore, 100);
    assert.equal(result.finalState.pendingDecisions.length, 0);
    assert.equal(result.steps.length, 2);
  });

  it("runs a failing multi-step runtime simulation when unsafe decisions persist", () => {
    const result = runMltRuntimeSimulation(MLT_SIMULATION_STARTER_STATE, [
      { decisionId: "decision-001", action: "release-result" },
      { decisionId: "decision-002", action: "document-and-monitor" },
    ]);

    assert.equal(result.passed, false);
    assert.ok(result.averageSafetyScore < 85);
    assert.ok(result.finalState.pendingDecisions.length >= 1);
    assert.equal(result.finalState.staffingPressure, "critical-shortage");
    assert.equal(result.finalState.turnaroundPressure, "critical-delay");
  });
});
