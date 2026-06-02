import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  balanceCognitiveLoadSequence,
  cognitiveLoadPenaltyMultiplier,
  difficultyBandFromScore,
  estimateAbilityLogistic,
  filterSeenIds,
  pickTopicByWeight,
  reweightTopicsForWeakAreas,
  suggestedDifficultyTarget,
} from "@/lib/questions/adaptive-question-selection";

describe("adaptive-question-selection", () => {
  it("bands difficulty", () => {
    assert.equal(difficultyBandFromScore(1), "low");
    assert.equal(difficultyBandFromScore(3), "mid");
    assert.equal(difficultyBandFromScore(5), "high");
  });

  it("boosts weak topics", () => {
    const w = reweightTopicsForWeakAreas({ a: 10, b: 5 }, ["b"], 2);
    assert.equal(w.find((x) => x.topicKey === "b")?.weight, 10);
    assert.equal(w.find((x) => x.topicKey === "a")?.weight, 10);
  });

  it("filters seen ids", () => {
    const out = filterSeenIds([{ id: "1" }, { id: "2" }], new Set(["1"]));
    assert.equal(out.length, 1);
    assert.equal(out[0]!.id, "2");
  });

  it("suggestedDifficultyTarget is bounded 1–5", () => {
    const d = suggestedDifficultyTarget(estimateAbilityLogistic(8, 2));
    assert.ok(d >= 1 && d <= 5);
  });

  it("pickTopicByWeight returns a key", () => {
    const k = pickTopicByWeight(
      [
        { topicKey: "x", weight: 1 },
        { topicKey: "y", weight: 99 },
      ],
      0,
    );
    assert.ok(k === "x" || k === "y");
  });

  it("penalizes stacked high-acuity and pharmacology questions", () => {
    const recent = [
      { id: "a", difficulty: 4, riskLevel: "high", topic: "sepsis" },
      { id: "b", difficulty: 5, riskLevel: "high", topic: "respiratory distress" },
      { id: "c", difficulty: 4, topic: "insulin pharmacology" },
      { id: "d", difficulty: 4, topic: "heparin pharmacology" },
    ];

    const hardPharm = cognitiveLoadPenaltyMultiplier(
      { id: "next-hard", difficulty: 5, riskLevel: "high", topic: "warfarin pharmacology" },
      recent,
    );
    const recovery = cognitiveLoadPenaltyMultiplier(
      { id: "next-recovery", difficulty: 2, riskLevel: "low", topic: "infection control" },
      recent,
    );

    assert.ok(hardPharm < 0.5);
    assert.ok(recovery > hardPharm);
  });

  it("balances a preselected sequence so high-acuity items are spaced apart", () => {
    const ordered = balanceCognitiveLoadSequence([
      { id: "high-1", difficulty: 5, riskLevel: "high", topic: "sepsis" },
      { id: "high-2", difficulty: 5, riskLevel: "high", topic: "shock" },
      { id: "high-3", difficulty: 4, riskLevel: "high", topic: "respiratory distress" },
      { id: "low-1", difficulty: 2, riskLevel: "low", topic: "falls" },
      { id: "low-2", difficulty: 2, riskLevel: "low", topic: "standard precautions" },
    ]);

    const firstThree = ordered.slice(0, 3).map((row) => row.id);
    assert.ok(firstThree.includes("low-1") || firstThree.includes("low-2"));
  });
});
