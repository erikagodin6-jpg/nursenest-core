import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { appendScoredResult, createInitialAdaptiveState, shouldStopAfterAnswer, type CatStopBounds } from "@/lib/exams/cat-engine";
import type { CatAnswerResult } from "@/lib/exams/cat-types";

describe("shouldStopAfterAnswer", () => {
  const bounds: CatStopBounds = {
    min: 85,
    max: 145,
    passingThreshold: 0.12,
    terminationMode: "adaptive_exam_ci",
  };

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

  it("adaptive_exam_ci uses 95% CI vs threshold (manual state)", () => {
    const b: CatStopBounds = {
      min: 85,
      max: 145,
      passingThreshold: 0,
      terminationMode: "adaptive_exam_ci",
    };
    const hi = { ...createInitialAdaptiveState(), theta: 0.55, se: 0.08, results: Array.from({ length: 90 }, (_, i) => ({
      questionId: `q${i}`,
      correct: true,
      categoryKey: "k",
      difficulty: 3,
      blueprintMappingSource: "fallback" as const,
    })) };
    assert.equal(shouldStopAfterAnswer(hi, 90, b), "confidence_pass");
    const lo = { ...createInitialAdaptiveState(), theta: -0.55, se: 0.08, results: hi.results };
    assert.equal(shouldStopAfterAnswer(lo, 90, b), "confidence_fail");
  });

  it("NP fixed-length stops only at max (no CI early exit)", () => {
    const b: CatStopBounds = {
      min: 150,
      max: 150,
      passingThreshold: 0,
      terminationMode: "fixed_full_length",
    };
    let state = createInitialAdaptiveState();
    for (let i = 0; i < 149; i++) {
      state = appendScoredResult(state, {
        questionId: `q${i}`,
        correct: i % 2 === 0,
        categoryKey: "k",
        difficulty: 3,
        blueprintMappingSource: "fallback",
      });
      assert.equal(shouldStopAfterAnswer(state, state.results.length, b), null, `no early stop at n=${i + 1}`);
    }
    state = appendScoredResult(state, {
      questionId: "q149",
      correct: true,
      categoryKey: "k",
      difficulty: 3,
      blueprintMappingSource: "fallback",
    });
    assert.equal(shouldStopAfterAnswer(state, 150, b), "max_length");
  });
});
