import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { practiceQuestionTeachingExposure, shouldRequestQuestionRationaleQuery } from "./rationale-visibility";

describe("rationale visibility from mode", () => {
  it("strips for CAT test mode", () => {
    assert.equal(
      practiceQuestionTeachingExposure({
        selectionMode: "cat",
        catPresentationMode: "practice",
        catExamFeedbackMode: "test",
      }),
      "none",
    );
    assert.equal(shouldRequestQuestionRationaleQuery({ selectionMode: "cat", catExamFeedbackMode: "test" }), false);
  });

  it("allows for CAT study mode", () => {
    assert.equal(
      practiceQuestionTeachingExposure({
        selectionMode: "cat",
        catExamFeedbackMode: "study",
      }),
      "full",
    );
    assert.equal(shouldRequestQuestionRationaleQuery({ selectionMode: "cat", catExamFeedbackMode: "study" }), true);
  });

  it("strips for linear exam end_of_exam", () => {
    assert.equal(
      practiceQuestionTeachingExposure({
        selectionMode: "random",
        linearDeliveryMode: "exam",
        linearRationaleVisibility: "end_of_exam",
      }),
      "none",
    );
  });
});
