import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  MLT_SIMULATION_STARTER_STATE,
  applyMltRuntimeDecision,
  buildMltMorphologyDrillViewModel,
  buildMltSimulationCockpitViewModel,
  evaluateMltWorkflowDecision,
  evaluateMltWorkflowSession,
  runMltRuntimeSimulation,
} from "@/lib/mlt";

describe("MLS/MLT library barrel exports", () => {
  it("exports the starter simulation state", () => {
    assert.equal(MLT_SIMULATION_STARTER_STATE.simulationId, "mlt-starter-sim");
    assert.ok(MLT_SIMULATION_STARTER_STATE.activeBenchAreas.length >= 3);
  });

  it("exports workflow evaluator utilities", () => {
    const evaluation = evaluateMltWorkflowDecision(MLT_SIMULATION_STARTER_STATE, {
      decisionId: "decision-001",
      action: "hold-and-review",
    });

    assert.equal(evaluation.correct, true);
    assert.equal(typeof evaluateMltWorkflowSession, "function");
  });

  it("exports runtime utilities", () => {
    const step = applyMltRuntimeDecision(MLT_SIMULATION_STARTER_STATE, {
      decisionId: "decision-001",
      action: "hold-and-review",
    });

    assert.equal(step.correct, true);
    assert.equal(typeof runMltRuntimeSimulation, "function");
  });

  it("exports cockpit and morphology view-model builders", () => {
    const cockpit = buildMltSimulationCockpitViewModel(MLT_SIMULATION_STARTER_STATE);
    const morphology = buildMltMorphologyDrillViewModel();

    assert.equal(cockpit.simulationId, "mlt-starter-sim");
    assert.equal(morphology.domain, "rbc-morphology");
    assert.ok(morphology.totalCards >= 5);
  });
});
