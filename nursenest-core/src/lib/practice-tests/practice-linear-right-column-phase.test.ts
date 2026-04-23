import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolvePracticeLinearRightColumnPhase } from "@/lib/practice-tests/practice-linear-right-column-phase";

describe("resolvePracticeLinearRightColumnPhase", () => {
  it("returns null in practice exam shell (no rationale column)", () => {
    assert.equal(
      resolvePracticeLinearRightColumnPhase({
        linearIsExamShell: true,
        hasRationalePayload: false,
        currentCommitted: false,
        rationaleAfterEach: true,
      }),
      null,
    );
  });

  it("tutor: pre-submit before commit", () => {
    assert.equal(
      resolvePracticeLinearRightColumnPhase({
        linearIsExamShell: false,
        hasRationalePayload: false,
        currentCommitted: false,
        rationaleAfterEach: true,
      }),
      "pre_submit",
    );
  });

  it("tutor: pre-submit after commit until rationale payload arrives", () => {
    assert.equal(
      resolvePracticeLinearRightColumnPhase({
        linearIsExamShell: false,
        hasRationalePayload: false,
        currentCommitted: true,
        rationaleAfterEach: true,
      }),
      "pre_submit",
    );
  });

  it("tutor: post-submit only with after_each + feedback", () => {
    assert.equal(
      resolvePracticeLinearRightColumnPhase({
        linearIsExamShell: false,
        hasRationalePayload: true,
        currentCommitted: true,
        rationaleAfterEach: true,
      }),
      "post_submit",
    );
  });

  it("does not reveal rationale body when policy is end-of-exam (even if committed)", () => {
    assert.equal(
      resolvePracticeLinearRightColumnPhase({
        linearIsExamShell: false,
        hasRationalePayload: true,
        currentCommitted: true,
        rationaleAfterEach: false,
      }),
      "pre_submit",
    );
  });
});
