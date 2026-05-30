import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CASPER_ANALYTICS_DIMENSIONS,
  CASPER_SCENARIOS,
  getCasperCategoryCoverage,
  reviewCasperWrittenResponse,
} from "@/lib/casper/casper-premium-ecosystem";

describe("CASPer premium ecosystem", () => {
  it("covers the required scenario categories", () => {
    const coverage = getCasperCategoryCoverage();
    assert.equal(coverage.length, 10);
    for (const row of coverage) {
      assert.ok(row.count >= 1, `${row.category} must have at least one scenario`);
    }
  });

  it("treats CASPer as response training, not a question bank", () => {
    for (const scenario of CASPER_SCENARIOS) {
      assert.ok(scenario.prompt.length >= 80);
      assert.ok(scenario.reflectionPrompts.length >= 3);
      assert.ok(scenario.stakeholderCues.length >= 4);
      assert.ok(scenario.communicationFramework.length >= 4);
      assert.ok(scenario.videoCoaching.length >= 3);
      assert.deepEqual(
        scenario.examples.map((example) => example.band),
        ["excellent", "average", "poor"],
      );
      for (const example of scenario.examples) {
        assert.ok(example.whyItPerformsThisWay.length >= 55);
        assert.ok(example.scoringExplanation.length >= 65);
      }
    }
  });

  it("reviews written responses across CASPer analytics dimensions", () => {
    const scenario = CASPER_SCENARIOS[0];
    const review = reviewCasperWrittenResponse(
      "I would acknowledge the classmate's stress, clarify what happened, explain the integrity concern, encourage them to speak privately with the instructor, and follow policy if there is ongoing risk to fairness and trust.",
      scenario,
    );

    assert.ok(review.overallScore > 50);
    assert.ok(["Developing", "Competent", "Strong"].includes(review.level));
    assert.deepEqual(
      review.dimensionScores.map((score) => score.dimension),
      CASPER_ANALYTICS_DIMENSIONS,
    );
    assert.ok(review.nextSteps.length >= 1);
  });
});
