import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatMarketingMessage, type MarketingMessages } from "@/lib/marketing-i18n-core";
import {
  coerceFlatMessageValue,
  normalizeMarketingMessagesRecord,
  safeMessageKey,
} from "@/lib/marketing-i18n/safe-marketing-messages";

describe("safe-marketing-messages", () => {
  it("coerceFlatMessageValue accepts strings and finite numbers", () => {
    assert.equal(coerceFlatMessageValue(" hi "), " hi ");
    assert.equal(coerceFlatMessageValue(42), "42");
    assert.equal(coerceFlatMessageValue(true), "true");
    assert.equal(coerceFlatMessageValue(undefined), undefined);
    assert.equal(coerceFlatMessageValue({}), undefined);
    assert.equal(coerceFlatMessageValue([]), undefined);
  });

  it("normalizeMarketingMessagesRecord drops nested objects and keeps strings", () => {
    const out = normalizeMarketingMessagesRecord({
      a: "ok",
      b: { nested: 1 },
      c: "",
    });
    assert.deepEqual(out, { a: "ok" });
  });

  it("safeMessageKey truncates huge keys", () => {
    const long = "x".repeat(600);
    assert.equal(safeMessageKey(long).length, 512);
  });
});

describe("formatMarketingMessage hardened", () => {
  it("does not throw when bundle has non-string leaf values", () => {
    const bad = { "x.y": 123 } as MarketingMessages;
    const s = formatMarketingMessage(bad, "x.y", undefined, undefined);
    assert.equal(s, "123");
  });

  it("falls back when value is an object", () => {
    const bad = { k: { o: 1 } } as MarketingMessages;
    const s = formatMarketingMessage(bad, "k", undefined, undefined);
    assert.ok(s.length > 0);
    assert.ok(!s.includes("object"));
  });
});
