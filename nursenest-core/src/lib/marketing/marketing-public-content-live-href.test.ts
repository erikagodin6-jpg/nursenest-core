import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildMarketingPublicLivePageHref } from "@/lib/marketing/marketing-public-content-live-href";

describe("buildMarketingPublicLivePageHref", () => {
  it("English home has no locale prefix", () => {
    assert.equal(buildMarketingPublicLivePageHref("en", "/"), "/");
  });

  it("English nested route stays unprefixed", () => {
    assert.equal(buildMarketingPublicLivePageHref("en", "/pricing"), "/pricing");
  });

  it("French home uses locale prefix", () => {
    assert.equal(buildMarketingPublicLivePageHref("fr", "/"), "/fr");
  });

  it("French nested route prefixes locale", () => {
    assert.equal(buildMarketingPublicLivePageHref("fr", "/pricing"), "/fr/pricing");
  });
});
