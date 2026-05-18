import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { MLT_SIMULATION_STARTER_STATE } from "./mlt-simulation-types";
import { buildMltSimulationCockpitViewModel } from "./mlt-simulation-view-model";
import { applyMltRuntimeDecision } from "./mlt-simulation-runtime";

describe("MLS/MLT simulation cockpit view model", () => {
  it("builds dashboard-ready cards from the starter simulation state", () => {
    const viewModel = buildMltSimulationCockpitViewModel(MLT_SIMULATION_STARTER_STATE);

    assert.equal(viewModel.simulationId, "mlt-starter-sim");
    assert.ok(viewModel.summaryCards.length >= 3);
    assert.equal(viewModel.analyzerCards.length, MLT_SIMULATION_STARTER_STATE.analyzers.length);
    assert.equal(viewModel.specimenCards.length, MLT_SIMULATION_STARTER_STATE.activeSpecimens.length);
    assert.equal(viewModel.criticalEventCards.length, MLT_SIMULATION_STARTER_STATE.criticalEvents.length);
    assert.equal(viewModel.pendingDecisionCards.length, MLT_SIMULATION_STARTER_STATE.pendingDecisions.length);
  });

  it("marks the starter state as critical because it has critical lab events and high-impact decisions", () => {
    const viewModel = buildMltSimulationCockpitViewModel(MLT_SIMULATION_STARTER_STATE);

    assert.equal(viewModel.overallSeverity, "critical");
    assert.ok(viewModel.criticalEventCards.some((card) => card.severity === "critical"));
    assert.ok(viewModel.pendingDecisionCards.some((card) => card.severity === "critical"));
  });

  it("creates analyzer cards that expose QC and affected assay details", () => {
    const viewModel = buildMltSimulationCockpitViewModel(MLT_SIMULATION_STARTER_STATE);
    const chemistryAnalyzer = viewModel.analyzerCards.find((card) => card.id === "chem-1");

    assert.ok(chemistryAnalyzer, "chemistry analyzer card should exist");
    assert.equal(chemistryAnalyzer?.severity, "watch");
    assert.match(chemistryAnalyzer?.detail ?? "", /trend-high/i);
    assert.match(chemistryAnalyzer?.detail ?? "", /potassium/i);
  });

  it("creates specimen cards that expose integrity and analyzer flags", () => {
    const viewModel = buildMltSimulationCockpitViewModel(MLT_SIMULATION_STARTER_STATE);
    const hemolyzedSpecimen = viewModel.specimenCards.find((card) => card.id === "spec-001");
    const blastFlagSpecimen = viewModel.specimenCards.find((card) => card.id === "spec-002");

    assert.ok(hemolyzedSpecimen, "hemolyzed specimen card should exist");
    assert.ok(blastFlagSpecimen, "blast-flag specimen card should exist");
    assert.equal(hemolyzedSpecimen?.severity, "critical");
    assert.equal(blastFlagSpecimen?.severity, "critical");
    assert.match(hemolyzedSpecimen?.detail ?? "", /hemolysis-index-high/i);
    assert.match(blastFlagSpecimen?.detail ?? "", /blast-flag/i);
  });

  it("updates pending-decision cards after a safe runtime action clears a decision", () => {
    const runtime = applyMltRuntimeDecision(MLT_SIMULATION_STARTER_STATE, {
      decisionId: "decision-001",
      action: "hold-and-review",
    });

    const viewModel = buildMltSimulationCockpitViewModel(runtime.nextState);

    assert.equal(
      viewModel.pendingDecisionCards.some((card) => card.id === "decision-001"),
      false,
    );
    assert.equal(viewModel.pendingDecisionCards.some((card) => card.id === "decision-002"), true);
  });
});
