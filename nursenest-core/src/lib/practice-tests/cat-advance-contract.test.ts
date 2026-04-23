import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  assertCatAdvanceRequestPayload,
  assertCatAdvanceResponseShape,
  buildCatAdvancePatchBody,
} from "./cat-advance-contract";

describe("cat-advance-contract", () => {
  it("buildCatAdvancePatchBody includes session, question, and selected answer echo", () => {
    const body = buildCatAdvancePatchBody({
      testId: "clxxxxxxxxxxxxxxxx",
      answers: { q1: "A" },
      cursorIndex: 0,
      examQuestionId: "q1",
    });
    assert.equal(body.action, "cat_advance");
    assert.equal(body.sessionId, "clxxxxxxxxxxxxxxxx");
    assert.equal(body.examQuestionId, "q1");
    assert.equal(body.selectedAnswer, "A");
    assert.equal(body.cursorIndex, 0);
  });

  it("assertCatAdvanceRequestPayload rejects empty answer", () => {
    assert.throws(() =>
      assertCatAdvanceRequestPayload({
        testId: "clxxxxxxxxxxxxxxxx",
        answers: { q1: "" },
        cursorIndex: 0,
        examQuestionId: "q1",
      }),
    );
  });

  it("assertCatAdvanceResponseShape requires exactly one branch flag", () => {
    assert.throws(() => assertCatAdvanceResponseShape({ ok: true }));
    assert.throws(() =>
      assertCatAdvanceResponseShape({ ok: true, catAdvanced: true, catCompleted: true, results: {} }),
    );
    assert.doesNotThrow(() => assertCatAdvanceResponseShape({ ok: true, catAdvanced: true }));
    assert.throws(() => assertCatAdvanceResponseShape({ ok: true, catCompleted: true }));
    assert.doesNotThrow(() => assertCatAdvanceResponseShape({ ok: true, catCompleted: true, results: { x: 1 } }));
    assert.doesNotThrow(() => assertCatAdvanceResponseShape({ ok: true, catStudyReveal: true }));
  });
});
