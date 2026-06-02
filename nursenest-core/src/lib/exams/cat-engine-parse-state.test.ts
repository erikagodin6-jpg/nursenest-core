import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseAdaptiveState } from "@/lib/exams/cat-engine";
import { CAT_STATE_VERSION, CAT_STATE_VERSION_LEGACY } from "@/lib/exams/cat-types";

describe("parseAdaptiveState", () => {
  it("accepts legacy v1 and normalizes output to current CAT_STATE_VERSION", () => {
    const parsed = parseAdaptiveState({
      v: CAT_STATE_VERSION_LEGACY,
      theta: 0.1,
      targetDifficulty: 3,
      se: 0.9,
      totalInformation: 0.5,
      results: [
        {
          questionId: "q_legacy_1",
          correct: true,
          categoryKey: "Safety",
          difficulty: 3,
        },
      ],
      difficultyHistory: [3],
      thetaHistory: [0.1],
      incidents: [],
      stoppedReason: null,
      decision: null,
    });
    assert.ok(parsed);
    assert.equal(parsed!.v, CAT_STATE_VERSION);
    assert.equal(parsed!.results.length, 1);
    assert.equal(parsed!.results[0]!.questionId, "q_legacy_1");
  });

  it("rejects unknown state versions", () => {
    assert.equal(
      parseAdaptiveState({
        v: 99 as never,
        theta: 0,
        targetDifficulty: 3,
      }),
      null,
    );
  });
});
