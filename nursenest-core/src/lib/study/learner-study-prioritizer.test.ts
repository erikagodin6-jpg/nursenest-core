import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { CatPoolRow } from "@/lib/exams/cat-engine";
import { buildPrioritizedLinearPickBand } from "@/lib/study/learner-study-prioritizer";

function row(
  id: string,
  topic: string | null,
  body: string | null = "Cardiac",
): CatPoolRow {
  return {
    id,
    difficulty: 3,
    bodySystem: body,
    topic,
    nclexClientNeedsCategory: "safe-effective",
  };
}

describe("buildPrioritizedLinearPickBand", () => {
  const now = 1_700_000_000_000;
  const salt = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";

  it("two learners (different salts) get different orderings from the same pool in random mode", () => {
    const rows = [row("q1", "A"), row("q2", "B"), row("q3", "C"), row("q4", "D"), row("q5", "E"), row("q6", "F")];
    const a = buildPrioritizedLinearPickBand({
      rows,
      mode: "random",
      questionCount: 4,
      sessionPickSalt: salt,
      weakPriorityByCanonical: new Map(),
      missedSignals: new Map(),
      lastExposureStartedAtMs: new Map(),
      recentSessionQuestionIds: new Set(),
      nowMs: now,
    });
    const b = buildPrioritizedLinearPickBand({
      rows,
      mode: "random",
      questionCount: 4,
      sessionPickSalt: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      weakPriorityByCanonical: new Map(),
      missedSignals: new Map(),
      lastExposureStartedAtMs: new Map(),
      recentSessionQuestionIds: new Set(),
      nowMs: now,
    });
    assert.notDeepEqual(a, b);
    assert.equal(new Set(a).size, a.length);
  });

  it("same learner gets a different band when session salt changes (fresh session)", () => {
    const rows = Array.from({ length: 12 }, (_, i) => row(`id-${i}`, `T${i % 3}`));
    const a = buildPrioritizedLinearPickBand({
      rows,
      mode: "random",
      questionCount: 5,
      sessionPickSalt: "session-11111111-1111-4111-8111-111111111111",
      weakPriorityByCanonical: new Map([["t0", 0.4]]),
      missedSignals: new Map(),
      lastExposureStartedAtMs: new Map([["id-0", now - 86400000]]),
      recentSessionQuestionIds: new Set(["id-1"]),
      nowMs: now,
    });
    const b = buildPrioritizedLinearPickBand({
      rows,
      mode: "random",
      questionCount: 5,
      sessionPickSalt: "session-22222222-2222-4222-8222-222222222222",
      weakPriorityByCanonical: new Map([["t0", 0.4]]),
      missedSignals: new Map(),
      lastExposureStartedAtMs: new Map([["id-0", now - 86400000]]),
      recentSessionQuestionIds: new Set(["id-1"]),
      nowMs: now,
    });
    assert.notDeepEqual(a, b);
  });

  it("weak mode ranks higher weakPriority topics ahead on average", () => {
    const rows = [
      row("low", "ColdTopic"),
      row("high", "HotTopic"),
      row("mid", "MidTopic"),
    ];
    const weak = new Map([
      ["coldtopic", 0.1],
      ["midtopic", 0.5],
      ["hottopic", 0.95],
    ]);
    const band = buildPrioritizedLinearPickBand({
      rows,
      mode: "weak",
      questionCount: 2,
      sessionPickSalt: salt,
      weakPriorityByCanonical: weak,
      missedSignals: new Map(),
      lastExposureStartedAtMs: new Map(),
      recentSessionQuestionIds: new Set(),
      nowMs: now,
    });
    assert.equal(band[0], "high");
    assert.ok(band.indexOf("low") > band.indexOf("high"));
  });

  it("missed mode pulls missed ids to the front of the band", () => {
    const rows = [row("a", "x"), row("b", "y"), row("c", "z"), row("m1", "m"), row("m2", "m2")];
    const missed = new Map([
      ["m1", { missCount: 3, lastMissedAtMs: now - 1000 }],
      ["m2", { missCount: 1, lastMissedAtMs: now - 50_000 }],
    ]);
    const band = buildPrioritizedLinearPickBand({
      rows,
      mode: "missed",
      questionCount: 3,
      sessionPickSalt: salt,
      weakPriorityByCanonical: new Map(),
      missedSignals: missed,
      lastExposureStartedAtMs: new Map(),
      recentSessionQuestionIds: new Set(),
      nowMs: now,
    });
    assert.equal(band[0], "m1");
    assert.ok(band.indexOf("m2") < band.indexOf("a"));
  });

  it("targeted mode still injects salt tie-break so composition varies across sessions", () => {
    const rows = [
      row("t1", "Same"),
      row("t2", "Same"),
      row("t3", "Same"),
      row("t4", "Same"),
    ];
    const a = buildPrioritizedLinearPickBand({
      rows,
      mode: "targeted",
      questionCount: 2,
      sessionPickSalt: salt,
      weakPriorityByCanonical: new Map(),
      missedSignals: new Map(),
      lastExposureStartedAtMs: new Map(),
      recentSessionQuestionIds: new Set(),
      nowMs: now,
    });
    const b = buildPrioritizedLinearPickBand({
      rows,
      mode: "targeted",
      questionCount: 2,
      sessionPickSalt: "zzzzzzzz-zzzz-4zzz-8zzz-zzzzzzzzzzzz",
      weakPriorityByCanonical: new Map(),
      missedSignals: new Map(),
      lastExposureStartedAtMs: new Map(),
      recentSessionQuestionIds: new Set(),
      nowMs: now,
    });
    assert.notDeepEqual(a, b);
  });
});
