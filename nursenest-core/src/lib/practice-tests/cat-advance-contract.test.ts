import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  assertCatAdvanceRequestPayload,
  assertCatAdvanceResponseShape,
  buildCatAdvancePatchBody,
} from "./cat-advance-contract";

describe("cat-advance-contract", () => {
  it("buildCatAdvancePatchBody includes session, question, and selected answer echo", () => {
    const qid = "clqtestquestionid00";
    const body = buildCatAdvancePatchBody({
      testId: "clxxxxxxxxxxxxxxxx",
      answers: { [qid]: "A" },
      cursorIndex: 0,
      examQuestionId: qid,
    });
    assert.equal(body.action, "cat_advance");
    assert.equal(body.sessionId, "clxxxxxxxxxxxxxxxx");
    assert.equal(body.examQuestionId, qid);
    assert.equal(body.selectedAnswer, "A");
    assert.equal(body.cursorIndex, 0);
  });

  it("assertCatAdvanceRequestPayload rejects empty answer", () => {
    const qid = "clqtestquestionid01";
    assert.throws(() =>
      assertCatAdvanceRequestPayload({
        testId: "clxxxxxxxxxxxxxxxx",
        answers: { [qid]: "" },
        cursorIndex: 0,
        examQuestionId: qid,
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
