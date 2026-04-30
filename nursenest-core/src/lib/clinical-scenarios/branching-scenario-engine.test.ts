import assert from "node:assert/strict";
import { test } from "node:test";
import {
  aggregateTrajectoryLabel,
  applyChoiceToBranchingState,
  initialBranchingEngineState,
  optionsJsonUsesBranchingEngine,
  parseBranchingOptions,
  visibleOptionsForStage,
} from "@/lib/clinical-scenarios/branching-scenario-engine";
import { branchingCatalogCounts, allBranchingClinicalSeedSpecs } from "@/lib/clinical-scenarios/branching-clinical-scenarios-catalog";
import type { BranchingStageView } from "@/lib/clinical-scenarios/branching-scenario-engine";

test("optionsJsonUsesBranchingEngine detects rich options", () => {
  assert.equal(
    optionsJsonUsesBranchingEngine([
      { id: "a", text: "x", isCorrect: true, rationale: "r", consequence: { trajectory: "improves", effect: "unlock" } },
    ]),
    true,
  );
  assert.equal(optionsJsonUsesBranchingEngine([{ id: "a", label: "legacy only" }]), false);
});

test("applyChoiceToBranchingState applies limit by hiding next stage correct option", () => {
  const stages: BranchingStageView[] = [
    {
      id: "s0",
      orderIndex: 0,
      scenarioText: "t0",
      vitals: {},
      assessmentFindings: "",
      labUpdates: null,
      questionStem: "q0",
      optionsJson: [
        {
          id: "ok",
          text: "good",
          isCorrect: true,
          rationale: "r",
          consequence: { trajectory: "improves", effect: "unlock" },
        },
        {
          id: "bad",
          text: "bad",
          isCorrect: false,
          rationale: "wrong",
          consequence: { trajectory: "deteriorates", effect: "limit" },
        },
      ],
      correctOptionId: "ok",
      rationale: "",
      whyWrongByOptionId: {},
      clinicalJudgmentFocus: "",
      consequencesByOptionId: {},
      nextStageOrder: null,
    },
    {
      id: "s1",
      orderIndex: 1,
      scenarioText: "t1",
      vitals: {},
      assessmentFindings: "",
      labUpdates: null,
      questionStem: "q1",
      optionsJson: [
        {
          id: "next_ok",
          text: "next good",
          isCorrect: true,
          rationale: "r2",
          consequence: { trajectory: "improves", effect: "unlock" },
        },
        { id: "next_alt", text: "alt", isCorrect: false, rationale: "w", consequence: { trajectory: "unchanged", effect: "delay" } },
      ],
      correctOptionId: "next_ok",
      rationale: "",
      whyWrongByOptionId: {},
      clinicalJudgmentFocus: "",
      consequencesByOptionId: {},
      nextStageOrder: null,
    },
  ];

  const picked = parseBranchingOptions(stages[0]!.optionsJson).find((o) => o.id === "bad")!;
  const next = applyChoiceToBranchingState({
    state: initialBranchingEngineState(0),
    stages,
    picked,
  });
  assert.equal(next.currentOrderIndex, 1);
  const hidden = next.hiddenOptionIdsByStageOrder[1];
  assert.ok(hidden?.has("next_ok"));
  const vis = visibleOptionsForStage(stages[1], hidden);
  assert.equal(vis.some((o) => o.id === "next_ok"), false);
});

test("aggregateTrajectoryLabel prioritizes deterioration", () => {
  assert.equal(aggregateTrajectoryLabel(["stable", "deteriorating", "improving"]), "deteriorating");
});

test("branching clinical catalog has 60 scenarios", () => {
  const { total, perTier } = branchingCatalogCounts();
  assert.equal(total, 60);
  assert.equal(perTier, 15);
  const specs = allBranchingClinicalSeedSpecs();
  assert.equal(specs.length, 60);
  const byTier = new Map<string, number>();
  for (const s of specs) {
    byTier.set(s.tierFocus, (byTier.get(s.tierFocus) ?? 0) + 1);
  }
  assert.equal(byTier.get("RN_NCLEX_RN"), 15);
  assert.equal(byTier.get("RPN_PN"), 15);
  assert.equal(byTier.get("NP"), 15);
  assert.equal(byTier.get("NEW_GRAD"), 15);
});
