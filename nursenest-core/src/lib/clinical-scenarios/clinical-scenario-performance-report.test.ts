import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { initialBranchingEngineState } from "@/lib/clinical-scenarios/branching-scenario-engine";
import {
  buildClinicalScenarioPerformanceReport,
  flashcardsFromPerformanceReport,
} from "@/lib/clinical-scenarios/clinical-scenario-performance-report";

describe("clinical-scenario-performance-report", () => {
  it("builds report with timeline from decision trail", () => {
    const branchState = {
      ...initialBranchingEngineState(0),
      decisionTrail: [
        {
          stageOrder: 0,
          questionStem: "First action?",
          pickedLabel: "Delay reassessment",
          isCorrect: false,
          trajectory: "deteriorates",
          effect: "delay",
          atMs: 1,
        },
      ],
      incorrectCount: 1,
      incorrectWeight: 2,
      mistakeLabels: ["Delay reassessment"],
    };
    const report = buildClinicalScenarioPerformanceReport({
      scenario: { stages: { length: 5 }, canonicalCategoryId: "cardiovascular", tierFocus: "RN_NCLEX_RN" },
      branchState,
    });
    assert.equal(report.timeline.length, 1);
    assert.ok(report.needsImprovement.items.length > 0);
    assert.ok(flashcardsFromPerformanceReport(report).length > 0);
  });
});
