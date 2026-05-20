import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizedAdaptiveCatRunBounds } from "@/lib/practice-tests/cat-practice-config";
import type { PracticeTestConfigJson } from "@/lib/practice-tests/types";

function catCfg(partial: Partial<PracticeTestConfigJson>): PracticeTestConfigJson {
  return {
    questionCount: 30,
    topicNames: [],
    difficultyMin: null,
    difficultyMax: null,
    selectionMode: "cat",
    pathwayId: "us-rn-nclex-rn",
    timedMode: false,
    timeLimitSec: null,
    ...partial,
  };
}

describe("normalizedAdaptiveCatRunBounds", () => {
  it("raises corrupt catMaxQuestions of 1 so max_length cannot fire after one item", () => {
    const b = normalizedAdaptiveCatRunBounds(
      catCfg({
        catMinQuestions: 85,
        catMaxQuestions: 1,
      }),
    );
    assert.ok(b.max >= 2);
    assert.ok(b.max >= b.min);
    assert.equal(b.min, 85);
    assert.equal(b.max, 85);
  });

  it("keeps coherent pathway-style bounds untouched", () => {
    const b = normalizedAdaptiveCatRunBounds(
      catCfg({
        catMinQuestions: 85,
        catMaxQuestions: 145,
      }),
    );
    assert.equal(b.min, 85);
    assert.equal(b.max, 145);
  });
});
