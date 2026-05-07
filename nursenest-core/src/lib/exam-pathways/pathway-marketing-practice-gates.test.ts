/**
 * Marketing hub must not advertise CAT / linear practice when snapshot says the bank is unusable.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { PathwayQuestionBankSnapshot } from "@/lib/exam-pathways/pathway-question-bank-snapshot";
import { CAT_MIN_COMPLETE_POOL } from "@/lib/practice-tests/cat-pool";
import {
  marketingCatCompletePoolUsable,
  marketingLinearPracticeBankUsable,
} from "@/lib/exam-pathways/pathway-marketing-practice-gates";

function snapOk(partial: Partial<Extract<PathwayQuestionBankSnapshot, { status: "ok" }>>): PathwayQuestionBankSnapshot {
  return {
    status: "ok",
    pathwayScopedCount: 0,
    adaptiveEligibleCount: 0,
    examKeys: [],
    ...partial,
  };
}

describe("pathway-marketing-practice-gates", () => {
  it("hides linear practice when pathway bank is empty", () => {
    assert.equal(marketingLinearPracticeBankUsable(snapOk({ pathwayScopedCount: 0 })), false);
    assert.equal(marketingLinearPracticeBankUsable(snapOk({ pathwayScopedCount: 1 })), true);
  });

  it("hides CAT marketing when adaptive-eligible complete pool is below CAT_MIN_COMPLETE_POOL", () => {
    assert.equal(
      marketingCatCompletePoolUsable(snapOk({ adaptiveEligibleCount: CAT_MIN_COMPLETE_POOL - 1 })),
      false,
    );
    assert.equal(
      marketingCatCompletePoolUsable(snapOk({ adaptiveEligibleCount: CAT_MIN_COMPLETE_POOL })),
      true,
    );
  });

  it("treats unavailable snapshots as unusable", () => {
    assert.equal(marketingLinearPracticeBankUsable({ status: "unavailable" }), false);
    assert.equal(marketingCatCompletePoolUsable({ status: "unavailable" }), false);
  });

  it("uses the smaller Pre-Nursing CAT floor when pathwayId is passed", () => {
    assert.equal(marketingCatCompletePoolUsable(snapOk({ adaptiveEligibleCount: 10 }), "pre-nursing"), true);
    assert.equal(marketingCatCompletePoolUsable(snapOk({ adaptiveEligibleCount: 7 }), "pre-nursing"), false);
  });
});
