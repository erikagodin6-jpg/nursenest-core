import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_SAFE_PRACTICE_TEST_CONFIG,
  parsePracticeTestConfigAtBoundary,
} from "@/lib/practice-tests/practice-test-config-boundary";
import type { PracticeTestConfigJson } from "@/lib/practice-tests/types";

describe("parsePracticeTestConfigAtBoundary", () => {
  it("parses a complete valid config", () => {
    const raw: PracticeTestConfigJson = {
      questionCount: 40,
      topicNames: ["a"],
      difficultyMin: 0,
      difficultyMax: 1,
      selectionMode: "cat",
      pathwayId: "us-rn-nclex-rn",
      timedMode: true,
      timeLimitSec: 3600,
      catExamFeedbackMode: "study",
      catPresentationMode: "practice",
    };
    const c = parsePracticeTestConfigAtBoundary(raw, { surface: "test" });
    assert.equal(c.selectionMode, "cat");
    assert.equal(c.pathwayId, "us-rn-nclex-rn");
    assert.equal(c.catExamFeedbackMode, "study");
  });

  it("preserves catAdaptiveSessionType when valid", () => {
    const c = parsePracticeTestConfigAtBoundary(
      { selectionMode: "cat", questionCount: 20, catAdaptiveSessionType: "practice" },
      { surface: "test" },
    );
    assert.equal(c.catAdaptiveSessionType, "practice");
  });

  it("preserves disableOptionShuffle when true", () => {
    const c = parsePracticeTestConfigAtBoundary(
      { selectionMode: "cat", questionCount: 10, disableOptionShuffle: true },
      { surface: "test" },
    );
    assert.equal(c.disableOptionShuffle, true);
  });

  it("coerces empty pathwayId and fills defaults for garbage input", () => {
    const c = parsePracticeTestConfigAtBoundary(
      { pathwayId: "", selectionMode: "cat", questionCount: 12 },
      { surface: "test" },
    );
    assert.equal(c.pathwayId, null);
    assert.equal(c.selectionMode, "cat");
    assert.equal(c.questionCount, 12);
  });

  it("returns safe defaults when input is not an object", () => {
    const c = parsePracticeTestConfigAtBoundary(null, { surface: "test" });
    assert.deepEqual(c.selectionMode, DEFAULT_SAFE_PRACTICE_TEST_CONFIG.selectionMode);
  });
});
