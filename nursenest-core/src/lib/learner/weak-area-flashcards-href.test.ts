import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isSubscriberFlashcardsAppPath } from "./study-product-route-contract";
import { weakAreaFlashcardsHref } from "./weak-area-flashcards-href";

describe("weakAreaFlashcardsHref", () => {
  it("adds pathway query when provided", () => {
    assert.equal(
      weakAreaFlashcardsHref("us-rn-nclex-rn"),
      "/app/flashcards/weak-areas?pathwayId=us-rn-nclex-rn",
    );
  });

  it("falls back to base weak-areas route", () => {
    assert.equal(weakAreaFlashcardsHref(null), "/app/flashcards/weak-areas");
    assert.equal(weakAreaFlashcardsHref("   "), "/app/flashcards/weak-areas");
  });

  it("weak-area flashcards href stays on subscriber flashcards app surface (not exams/questions)", () => {
    for (const h of [weakAreaFlashcardsHref(null), weakAreaFlashcardsHref("us-rn-nclex-rn")]) {
      assert.ok(isSubscriberFlashcardsAppPath(h), h);
      assert.ok(!h.includes("/app/exams"), h);
      assert.ok(!h.includes("/app/questions"), h);
    }
  });
});
