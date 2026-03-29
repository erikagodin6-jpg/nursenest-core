import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  examQuestionTiersForUserTier,
  publicMarketingExamQuestionWhere,
  publicMarketingLessonWhere,
} from "./content-access-scope";

describe("content-access-scope", () => {
  it("examQuestionTiersForUserTier matches freemium ladders (nursing vs allied)", () => {
    assert.deepEqual(examQuestionTiersForUserTier("LVN_LPN"), ["rpn", "lvn"]);
    assert.deepEqual(examQuestionTiersForUserTier("ALLIED"), ["allied"]);
    assert.deepEqual(examQuestionTiersForUserTier("NP"), ["rpn", "lvn", "rn", "np"]);
  });

  it("publicMarketingExamQuestionWhere excludes subscriber-only exam tiers", () => {
    const w = publicMarketingExamQuestionWhere() as { tier: { in: string[] } };
    const tiers = w.tier.in;
    assert.ok(Array.isArray(tiers));
    assert.equal(tiers.includes("rn"), false);
    assert.equal(tiers.includes("np"), false);
    assert.equal(tiers.includes("rpn"), true);
    assert.equal(tiers.includes("allied"), true);
  });

  it("publicMarketingLessonWhere allows freemium lesson tiers only", () => {
    const w = publicMarketingLessonWhere() as {
      AND: [unknown, { OR: Array<{ tier?: { in: string[] } } | { tier: null }> }];
    };
    const ors = w.AND[1].OR;
    const tierIn = ors.find((x) => x && typeof x === "object" && "tier" in x && x.tier && "in" in (x.tier as object));
    assert.ok(tierIn && "tier" in tierIn);
    const list = (tierIn.tier as { in: string[] }).in;
    assert.equal(list.includes("rn"), false);
    assert.equal(list.includes("np"), false);
    assert.equal(list.includes("rpn"), true);
  });
});
