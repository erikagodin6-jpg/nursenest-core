import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
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
});
