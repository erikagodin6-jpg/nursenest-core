import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  classifyTopicStrength,
  computeWeakPriorityScore,
  fallbackWeakPriorityFromSessionRow,
  type TopicStatLike,
} from "@/lib/learner/weak-topic-priority";

function stat(partial: Partial<TopicStatLike> & Pick<TopicStatLike, "correctCount" | "wrongCount">): TopicStatLike {
  return {
    wrongStreak: 0,
    lastWrongAt: null,
    lastAttemptAt: null,
    ...partial,
  };
}

describe("computeWeakPriorityScore", () => {
  it("stays in 0..1", () => {
    const cases: TopicStatLike[] = [
      stat({ correctCount: 0, wrongCount: 1, wrongStreak: 1, lastWrongAt: new Date(), lastAttemptAt: new Date() }),
      stat({ correctCount: 50, wrongCount: 50, wrongStreak: 0, lastWrongAt: new Date(0), lastAttemptAt: new Date() }),
      stat({ correctCount: 100, wrongCount: 0, wrongStreak: 0, lastWrongAt: null, lastAttemptAt: new Date() }),
    ];
    for (const c of cases) {
      const p = computeWeakPriorityScore(c);
      assert.ok(p >= 0 && p <= 1);
    }
  });

  it("does not let a single low-volume miss outrank sustained recent weakness", () => {
    const oneMiss = stat({
      correctCount: 0,
      wrongCount: 1,
      wrongStreak: 1,
      lastWrongAt: new Date(),
      lastAttemptAt: new Date(),
    });
    const sustained = stat({
      correctCount: 3,
      wrongCount: 12,
      wrongStreak: 3,
      lastWrongAt: new Date(),
      lastAttemptAt: new Date(),
    });
    assert.ok(computeWeakPriorityScore(sustained) > computeWeakPriorityScore(oneMiss));
  });

  it("raises priority on repeated recent misses (streak)", () => {
    const a = stat({
      correctCount: 5,
      wrongCount: 5,
      wrongStreak: 1,
      lastWrongAt: new Date(),
      lastAttemptAt: new Date(),
    });
    const b = stat({
      correctCount: 5,
      wrongCount: 5,
      wrongStreak: 4,
      lastWrongAt: new Date(),
      lastAttemptAt: new Date(),
    });
    assert.ok(computeWeakPriorityScore(b) > computeWeakPriorityScore(a));
  });

  it("lowers priority after recovery (correct streak, recent attempt)", () => {
    const weak = stat({
      correctCount: 4,
      wrongCount: 6,
      wrongStreak: 0,
      lastWrongAt: new Date(Date.now() - 3 * 86400000),
      lastAttemptAt: new Date(),
    });
    const worse = stat({
      correctCount: 4,
      wrongCount: 6,
      wrongStreak: 2,
      lastWrongAt: new Date(),
      lastAttemptAt: new Date(),
    });
    assert.ok(computeWeakPriorityScore(weak) < computeWeakPriorityScore(worse));
  });

  it("orders consistently with classifyTopicStrength labels for typical cases", () => {
    const strong = stat({
      correctCount: 20,
      wrongCount: 2,
      wrongStreak: 0,
      lastWrongAt: new Date(Date.now() - 20 * 86400000),
      lastAttemptAt: new Date(),
    });
    assert.equal(classifyTopicStrength(strong), "strong");
    assert.ok(computeWeakPriorityScore(strong) < 0.45);
  });
});

describe("fallbackWeakPriorityFromSessionRow", () => {
  it("is bounded", () => {
    const p = fallbackWeakPriorityFromSessionRow(80, 20, 16);
    assert.ok(p >= 0 && p <= 1);
  });
});
