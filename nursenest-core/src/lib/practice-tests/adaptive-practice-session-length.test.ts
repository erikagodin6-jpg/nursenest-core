import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ADAPTIVE_PRACTICE_FIXED_LENGTHS,
  estimateAdaptivePracticeDuration,
  resolveAdaptivePracticeLaunchLength,
} from "@/lib/practice-tests/adaptive-practice-session-length";

describe("adaptive-practice-session-length", () => {
  it("exposes required fixed presets and unlimited cap", () => {
    assert.deepEqual(ADAPTIVE_PRACTICE_FIXED_LENGTHS, [10, 20, 30, 50, 75, 100, 150]);
    const unlimited = resolveAdaptivePracticeLaunchLength("unlimited");
    assert.equal(unlimited.unlimited, true);
    assert.equal(unlimited.catAdaptiveSessionType, "cat");
    assert.equal(unlimited.questionCount, 200);
  });

  it("fixed lengths use guided practice session type", () => {
    const fixed = resolveAdaptivePracticeLaunchLength(30);
    assert.equal(fixed.unlimited, false);
    assert.equal(fixed.catAdaptiveSessionType, "practice");
    assert.equal(fixed.questionCount, 30);
  });

  it("estimates duration for fixed and continuous modes", () => {
    assert.equal(estimateAdaptivePracticeDuration(50).label, "~55 min");
    assert.equal(estimateAdaptivePracticeDuration("unlimited").label, "Open-ended");
    assert.match(estimateAdaptivePracticeDuration("unlimited").detail, /until you choose to end/i);
  });
});
