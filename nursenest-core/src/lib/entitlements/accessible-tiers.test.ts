import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  contentItemTierStringsForProfileTier,
  examQuestionTierStringsForProfileTier,
  getAccessibleTiers,
  prismaTierCodesForProfileTier,
} from "./accessible-tiers";

describe("getAccessibleTiers / ladder", () => {
  it("NP includes full nursing exam tier strings and prisma ladder", () => {
    const b = getAccessibleTiers({ tier: "NP" })!;
    assert.deepEqual(b.examQuestionTierStrings, ["rpn", "lvn", "rn", "np"]);
    assert.deepEqual(b.prismaTierCodes, ["RPN", "LVN_LPN", "RN", "NP"]);
    assert.ok(b.contentItemTierStrings.includes("rpn"));
    assert.ok(b.contentItemTierStrings.includes("rn"));
    assert.ok(b.contentItemTierStrings.includes("np"));
  });

  it("RN includes PN rungs (rpn+lvn) for questions and prisma", () => {
    assert.deepEqual(examQuestionTierStringsForProfileTier("RN"), ["rpn", "lvn", "rn"]);
    assert.deepEqual(prismaTierCodesForProfileTier("RN"), ["RPN", "LVN_LPN", "RN"]);
  });

  it("LVN_LPN includes RPN rung (PN ladder)", () => {
    assert.deepEqual(examQuestionTierStringsForProfileTier("LVN_LPN"), ["rpn", "lvn"]);
    assert.deepEqual(prismaTierCodesForProfileTier("LVN_LPN"), ["RPN", "LVN_LPN"]);
    const content = contentItemTierStringsForProfileTier("LVN_LPN");
    assert.ok(content.includes("rpn"));
    assert.ok(content.includes("lvn"));
  });

  it("RPN is PN-only", () => {
    assert.deepEqual(examQuestionTierStringsForProfileTier("RPN"), ["rpn"]);
    assert.deepEqual(prismaTierCodesForProfileTier("RPN"), ["RPN"]);
  });

  it("ALLIED is isolated", () => {
    assert.deepEqual(examQuestionTierStringsForProfileTier("ALLIED"), ["allied"]);
    assert.deepEqual(prismaTierCodesForProfileTier("ALLIED"), ["ALLIED"]);
    const content = contentItemTierStringsForProfileTier("ALLIED");
    assert.ok(content.includes("allied"));
    assert.equal(content.includes("rn"), false);
  });

  it("returns null when tier missing", () => {
    assert.equal(getAccessibleTiers({ tier: null }), null);
    assert.equal(getAccessibleTiers({ tier: undefined }), null);
  });
});
