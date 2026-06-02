import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { shouldShowLinearPerItemRationale } from "@/lib/practice-tests/practice-test-linear-inline-rationale";

describe("shouldShowLinearPerItemRationale", () => {
  const base = {
    isLinearEngine: true,
    linearDeliveryMode: "practice" as const,
    linearRationaleVisibility: "after_each" as const,
    currentCommitted: true,
    linearFeedbackForCurrent: { isCorrect: true },
  };

  it("is false in linear exam delivery even if visibility says after_each", () => {
    assert.equal(
      shouldShowLinearPerItemRationale({
        ...base,
        linearDeliveryMode: "exam",
        linearRationaleVisibility: "after_each",
        linearFeedbackForCurrent: { isCorrect: true },
      }),
      false,
    );
  });

  it("is false when not linear engine", () => {
    assert.equal(
      shouldShowLinearPerItemRationale({
        ...base,
        isLinearEngine: false,
      }),
      false,
    );
  });

  it("is false when policy is end_of_exam", () => {
    assert.equal(
      shouldShowLinearPerItemRationale({
        ...base,
        linearRationaleVisibility: "end_of_exam",
      }),
      false,
    );
  });

  it("is false when item not committed (e.g. navigated before feedback)", () => {
    assert.equal(
      shouldShowLinearPerItemRationale({
        ...base,
        currentCommitted: false,
      }),
      false,
    );
  });

  it("is false when feedback missing for current question (stale / resume gap)", () => {
    assert.equal(
      shouldShowLinearPerItemRationale({
        ...base,
        linearFeedbackForCurrent: null,
      }),
      false,
    );
  });

  it("is true for linear practice + after_each + committed + feedback", () => {
    assert.equal(shouldShowLinearPerItemRationale(base), true);
  });
});
