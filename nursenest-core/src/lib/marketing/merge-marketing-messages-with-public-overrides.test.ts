import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import { mergeMarketingMessagesWithPublicOverrides } from "@/lib/marketing/merge-marketing-messages-with-public-overrides";

describe("mergeMarketingMessagesWithPublicOverrides", () => {
  it("merges published override keys into the message map", () => {
    const base: MarketingMessages = { a: "1", b: "2" };
    const merged = mergeMarketingMessagesWithPublicOverrides(base, { b: "override" });
    assert.equal(merged.a, "1");
    assert.equal(merged.b, "override");
  });

  it("returns base messages when overrides are undefined or empty", () => {
    const base: MarketingMessages = { x: "y" };
    assert.equal(mergeMarketingMessagesWithPublicOverrides(base, undefined), base);
    assert.deepEqual(mergeMarketingMessagesWithPublicOverrides(base, {}), base);
  });
});
