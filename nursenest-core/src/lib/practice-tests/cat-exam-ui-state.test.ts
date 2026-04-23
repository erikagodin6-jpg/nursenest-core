import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  catExamCanChangeAnswer,
  catExamCanLockAnswer,
  catExamCanRequestCatAdvance,
  catExamFooterPrimaryBusy,
  catExamOptionsInteractionLocked,
  type CatExamUiPhase,
} from "./cat-exam-ui-state";

function phases(): CatExamUiPhase[] {
  return ["answering", "submitted_locked", "advancing"];
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
  });

  it("marks footer primary busy when controls busy or advancing", () => {
    assert.equal(catExamFooterPrimaryBusy("answering", false), false);
    assert.equal(catExamFooterPrimaryBusy("answering", true), true);
    assert.equal(catExamFooterPrimaryBusy("submitted_locked", true), true);
    assert.equal(catExamFooterPrimaryBusy("advancing", false), true);
  });
});
