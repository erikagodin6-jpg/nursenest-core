import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { computeReadiness } from "@/lib/learner/readiness-score";

describe("computeReadiness calibration", () => {
  it("flags calibrated preview for NP scope and keeps confidence conservative", () => {
    const result = computeReadiness({
      practiceCorrect: 18,
      practiceTotal: 30,
      recentMocks: [{ score: 7, total: 10 }],
      weakTopics: [],
      lessonsCompleted: 4,
      lessonsAvailable: 10,
      scope: { tier: "NP", country: "CA" },
    });

    assert.equal(result.calibratedPreview, true);
    assert.equal(result.confidence, "medium");
    assert.ok(result.summary.includes("intentionally stricter"));
  });

  it("flags calibrated preview for Allied CA with thin data thresholds", () => {
    const result = computeReadiness({
      practiceCorrect: 12,
      practiceTotal: 20,
      recentMocks: [{ score: 8, total: 10 }],
      weakTopics: [],
      lessonsCompleted: 2,
      lessonsAvailable: 8,
      scope: { tier: "ALLIED", country: "CA" },
    });

    assert.equal(result.calibratedPreview, true);
    assert.equal(result.band, "insufficient_data");
    assert.equal(result.score, null);
  });
});

