import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatTopicLabelForDisplay, normalizeTopicKey } from "@/lib/learner/topic-normalize";

describe("normalizeTopicKey", () => {
  it("folds case and whitespace", () => {
    assert.equal(normalizeTopicKey("  cardiac "), normalizeTopicKey("CARDIAC"));
    assert.equal(normalizeTopicKey("Cardiac"), normalizeTopicKey("cardiac"));
  });

  it("normalizes slash variants to one identity", () => {
    assert.equal(normalizeTopicKey("Cardiac / CVS"), normalizeTopicKey("Cardiac/CVS"));
    assert.equal(normalizeTopicKey("Cardiac  /  CVS"), normalizeTopicKey("cardiac / cvs"));
  });

  it("maps visually different but equivalent separators to same canonical key", () => {
    assert.equal(normalizeTopicKey("Acid\u00A0Base"), normalizeTopicKey("acid base"));
    assert.equal(normalizeTopicKey("Acid\\Base"), normalizeTopicKey("acid / base"));
  });

  it("does not collapse materially different topics", () => {
    assert.notEqual(normalizeTopicKey("Heart failure"), normalizeTopicKey("Heart block"));
    assert.notEqual(normalizeTopicKey("Pediatrics"), normalizeTopicKey("Geriatrics"));
  });

  it("uses general for empty", () => {
    assert.equal(normalizeTopicKey(""), "general");
    assert.equal(normalizeTopicKey("   "), "general");
  });

  it("truncates deterministically with hash suffix when over max length", () => {
    const long = "a".repeat(100);
    const k = normalizeTopicKey(long);
    assert.ok(k.length <= 80);
    assert.ok(k.includes("~"));
    assert.equal(normalizeTopicKey(long), normalizeTopicKey(long));
  });
});

describe("formatTopicLabelForDisplay", () => {
  it("title-cases canonical segments", () => {
    assert.equal(formatTopicLabelForDisplay("cardiac / cvs"), "Cardiac / Cvs");
  });
});
