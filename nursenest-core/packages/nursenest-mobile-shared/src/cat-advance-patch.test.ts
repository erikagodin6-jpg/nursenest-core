import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assertCatAdvanceRequestPayload, buildCatAdvancePatchBody } from "./cat-advance-patch";

describe("cat advance patch body", () => {
  it("builds payload", () => {
    const b = buildCatAdvancePatchBody({
      testId: "1234567890ab",
      cursorIndex: 0,
      examQuestionId: "abcdef123456",
      answers: { abcdef123456: "A" },
    });
    assert.equal(b.action, "cat_advance");
    assert.equal(b.sessionId, "1234567890ab");
    assert.equal(b.selectedAnswer, "A");
  });

  it("rejects missing answer", () => {
    assert.throws(() =>
      assertCatAdvanceRequestPayload({
        testId: "1234567890ab",
        cursorIndex: 0,
        examQuestionId: "abcdef123456",
        answers: {},
      }),
    );
  });
});
