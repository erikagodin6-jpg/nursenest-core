import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveLinearEngineRunnerUiKind } from "@/lib/practice-tests/linear-runner-session-mode";

describe("resolveLinearEngineRunnerUiKind", () => {
  it("returns inactive for CAT", () => {
    assert.equal(
      resolveLinearEngineRunnerUiKind({
        catMode: true,
        linearDeliveryMode: "exam",
        linearAllowReviewNavigation: true,
      }),
      "inactive",
    );
  });

  it("returns legacy_linear when linearDeliveryMode is absent", () => {
    assert.equal(
      resolveLinearEngineRunnerUiKind({
        catMode: false,
        linearDeliveryMode: undefined,
        linearAllowReviewNavigation: false,
      }),
      "legacy_linear",
    );
  });

  it("returns linear_exam for exam delivery", () => {
    assert.equal(
      resolveLinearEngineRunnerUiKind({
        catMode: false,
        linearDeliveryMode: "exam",
        linearAllowReviewNavigation: true,
      }),
      "linear_exam",
    );
  });

  it("prefers linear_exam over review flag when delivery is exam", () => {
    assert.equal(
      resolveLinearEngineRunnerUiKind({
        catMode: false,
        linearDeliveryMode: "exam",
        linearAllowReviewNavigation: true,
      }),
      "linear_exam",
    );
  });

  it("returns linear_tutor_review_nav only for practice + flag", () => {
    assert.equal(
      resolveLinearEngineRunnerUiKind({
        catMode: false,
        linearDeliveryMode: "practice",
        linearAllowReviewNavigation: true,
      }),
      "linear_tutor_review_nav",
    );
  });

  it("returns linear_tutor for practice without review nav", () => {
    assert.equal(
      resolveLinearEngineRunnerUiKind({
        catMode: false,
        linearDeliveryMode: "practice",
        linearAllowReviewNavigation: false,
      }),
      "linear_tutor",
    );
  });
});
