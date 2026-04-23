import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  catExamAdvancePrimaryIntentFromSessionShape,
  catExamCanChangeAnswer,
  catExamCanLockAnswer,
  catExamCanRequestCatAdvance,
  catExamCatAdvanceResponseIsStale,
  catExamFooterPrimaryBusy,
  catExamOptionsInteractionLocked,
  type CatExamUiPhase,
} from "./cat-exam-ui-state";

function phases(): CatExamUiPhase[] {
  return ["answering", "submitted_locked", "advancing", "completed"];
}

describe("cat-exam-ui-state", () => {
  it("locks options whenever not answering", () => {
    for (const p of phases()) {
      assert.equal(catExamOptionsInteractionLocked(p), p !== "answering");
    }
  });

  it("allows answer changes only in answering", () => {
    assert.equal(catExamCanChangeAnswer("answering"), true);
    assert.equal(catExamCanChangeAnswer("submitted_locked"), false);
    assert.equal(catExamCanChangeAnswer("advancing"), false);
    assert.equal(catExamCanChangeAnswer("completed"), false);
  });

  it("allows lock only from answering with an answer", () => {
    assert.equal(catExamCanLockAnswer("answering", false), false);
    assert.equal(catExamCanLockAnswer("answering", true), true);
    assert.equal(catExamCanLockAnswer("submitted_locked", true), false);
    assert.equal(catExamCanLockAnswer("advancing", true), false);
  });

  it("allows cat_advance request only from submitted_locked", () => {
    assert.equal(catExamCanRequestCatAdvance("answering"), false);
    assert.equal(catExamCanRequestCatAdvance("submitted_locked"), true);
    assert.equal(catExamCanRequestCatAdvance("advancing"), false);
    assert.equal(catExamCanRequestCatAdvance("completed"), false);
  });

  it("marks footer primary busy when controls busy or advancing", () => {
    assert.equal(catExamFooterPrimaryBusy("answering", false), false);
    assert.equal(catExamFooterPrimaryBusy("answering", true), true);
    assert.equal(catExamFooterPrimaryBusy("submitted_locked", true), true);
    assert.equal(catExamFooterPrimaryBusy("advancing", false), true);
    assert.equal(catExamFooterPrimaryBusy("completed", false), true);
  });

  it("advance primary intent: at or past max delivered → finish hint", () => {
    assert.equal(
      catExamAdvancePrimaryIntentFromSessionShape({ deliveredQuestionCount: 10, catMaxQuestions: 150 }),
      "next_item",
    );
    assert.equal(
      catExamAdvancePrimaryIntentFromSessionShape({ deliveredQuestionCount: 150, catMaxQuestions: 150 }),
      "finish_session",
    );
    assert.equal(
      catExamAdvancePrimaryIntentFromSessionShape({ deliveredQuestionCount: 151, catMaxQuestions: 150 }),
      "finish_session",
    );
    assert.equal(
      catExamAdvancePrimaryIntentFromSessionShape({ deliveredQuestionCount: 3, catMaxQuestions: null }),
      "next_item",
    );
  });

  it("cat advance stale guard matches idx + question id", () => {
    assert.equal(
      catExamCatAdvanceResponseIsStale({
        advanceIdx: 0,
        advanceQuestionId: "q1",
        currentIdx: 0,
        currentQuestionId: "q1",
      }),
      false,
    );
    assert.equal(
      catExamCatAdvanceResponseIsStale({
        advanceIdx: 0,
        advanceQuestionId: "q1",
        currentIdx: 1,
        currentQuestionId: "q2",
      }),
      true,
    );
    assert.equal(
      catExamCatAdvanceResponseIsStale({
        advanceIdx: 0,
        advanceQuestionId: "q1",
        currentIdx: 0,
        currentQuestionId: "q2",
      }),
      true,
    );
  });
});
