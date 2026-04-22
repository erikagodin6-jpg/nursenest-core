import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getEffectiveMarketingCountry } from "@/lib/marketing/get-effective-country";
import { resolveDefaultLayoutMarketingExamRegion } from "@/lib/marketing/resolve-default-layout-marketing-exam-region";

/**
 * Regression: marketing layout failsafe and static `/` shell must not force `canada` + `CA`
 * when request signals US (same composition as the happy-path layout).
 */
describe("marketing default layout web region presentation", () => {
  it("US IP with no cookies resolves to US region and us chrome country on /", () => {
    const serverRegion = resolveDefaultLayoutMarketingExamRegion({
      marketingRegionCookie: undefined,
      globalRegionSlug: null,
      detectedIpCountry: "US",
    });
    assert.equal(serverRegion, "US");
    const marketingCountry = getEffectiveMarketingCountry("/", serverRegion);
    assert.equal(marketingCountry, "us");
  });

  it("CA IP with no cookies resolves to CA region and canada chrome country", () => {
    const serverRegion = resolveDefaultLayoutMarketingExamRegion({
      marketingRegionCookie: undefined,
      globalRegionSlug: null,
      detectedIpCountry: "CA",
    });
    assert.equal(serverRegion, "CA");
    assert.equal(getEffectiveMarketingCountry("/", serverRegion), "canada");
  });

  it("explicit nn_global_region=us wins over CA IP for exam toggle", () => {
    const serverRegion = resolveDefaultLayoutMarketingExamRegion({
      marketingRegionCookie: undefined,
      globalRegionSlug: "us",
      detectedIpCountry: "CA",
    });
    assert.equal(serverRegion, "US");
  });

  it("explicit marketing region cookie wins over US IP", () => {
    const serverRegion = resolveDefaultLayoutMarketingExamRegion({
      marketingRegionCookie: "CA",
      globalRegionSlug: null,
      detectedIpCountry: "US",
    });
    assert.equal(serverRegion, "CA");
    assert.equal(getEffectiveMarketingCountry("/", "CA"), "canada");
  });
});
