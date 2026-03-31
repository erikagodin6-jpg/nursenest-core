import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { countWords, stripToPlainText } from "./plain-text";
import { classifyRationaleWordCount } from "./classify-rationale";
import { RATIONALE_MIN_WORDS } from "./standards";

describe("plain-text word counts", () => {
  it("counts words and strips tags", () => {
    assert.equal(countWords("  hello   world  "), 2);
    assert.equal(countWords("<p>one two</p>"), 2);
    assert.equal(stripToPlainText("<b>a</b> &amp; b"), "a & b");
  });
});

describe("rationale classification", () => {
  it("marks thin below minimum", () => {
    const words = Array.from({ length: RATIONALE_MIN_WORDS - 1 }, (_, i) => `w${i}`).join(" ");
    const r = classifyRationaleWordCount(countWords(words));
    assert.equal(r.tier, "thin");
    assert.equal(r.showEnrichmentNotice, true);
  });
});
