import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { appendScoredResult, createInitialAdaptiveState, shouldStopAfterAnswer, type CatStopBounds } from "@/lib/exams/cat-engine";
import type { CatAnswerResult } from "@/lib/exams/cat-types";

describe("shouldStopAfterAnswer", () => {
  const bounds: CatStopBounds = { min: 85, max: 145, passingThreshold: 0.12 };

  it("does not cap max questions at 15 when pathway bounds are larger", () => {
    let state = createInitialAdaptiveState();
    for (let i = 0; i < 16; i++) {
      const r: CatAnswerResult = {
        questionId: `q${i}`,
        correct: i % 3 !== 0,
        categoryKey: "k",
        difficulty: 3,
        blueprintMappingSource: "fallback",
      };
      state = appendScoredResult(state, r);
      const stop = shouldStopAfterAnswer(state, state.results.length, bounds);
      if (i + 1 < 85) {
        assert.equal(stop, null, `expected no stop before min at n=${i + 1}`);
      }
    }
    assert.ok(state.results.length === 16);
  });

  it("does not streak-stop before pathway minimum", () => {
    let state = createInitialAdaptiveState();
    for (let i = 0; i < 8; i++) {
      const r: CatAnswerResult = {
        questionId: `q${i}`,
        correct: true,
        categoryKey: "k",
        difficulty: 3,
        blueprintMappingSource: "fallback",
      };
      state = appendScoredResult(state, r);
    }
    const stop = shouldStopAfterAnswer(state, state.results.length, bounds);
    assert.equal(stop, null);
  });

  it("stops at pathway max (not an artificial 15 cap)", () => {
    let state = createInitialAdaptiveState();
    for (let i = 0; i < 145; i++) {
      const r: CatAnswerResult = {
        questionId: `q${i}`,
        correct: i % 2 === 0,
        categoryKey: "k",
        difficulty: 3,
        blueprintMappingSource: "fallback",
      };
      state = appendScoredResult(state, r);
    }
    assert.equal(shouldStopAfterAnswer(state, 145, bounds), "max_length");
  });
});
