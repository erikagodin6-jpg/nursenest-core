import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  displayNameForGlobalCountryCode,
  globalContentScopeForPathway,
  globalPathwayPreferenceFromPathwayId,
  listGlobalCountryMarkets,
  listGlobalCountrySelectorOptions,
  listPathwaysForGlobalCountry,
  validateGlobalMarketRegistry,
} from "./global-expansion-market-registry";

describe("global expansion market registry", () => {
  it("keeps launch-priority countries in one scalable selector model", () => {
    const options = listGlobalCountrySelectorOptions();
    const codes = new Set(options.map((option) => option.countryCode));

    for (const code of ["CA", "US", "GB", "AU", "NZ", "IE", "PH", "IN", "NG", "ZA", "SA", "AE", "QA", "KW", "SG"]) {
      assert.ok(codes.has(code), `expected ${code} in global selector options`);
    }
  });

  it("maps launch tiers to the requested market strategy", () => {
    const byCode = new Map(listGlobalCountryMarkets().map((market) => [market.countryCode, market]));

    assert.equal(byCode.get("CA")?.launchTier, 1);
    assert.equal(byCode.get("US")?.launchTier, 1);
    assert.equal(byCode.get("GB")?.launchTier, 2);
    assert.equal(byCode.get("AU")?.launchTier, 2);
    assert.equal(byCode.get("PH")?.launchTier, 3);
    assert.equal(byCode.get("IN")?.launchTier, 3);
    assert.equal(byCode.get("SA")?.launchTier, 4);
    assert.equal(byCode.get("AE")?.launchTier, 4);
  });

  it("connects core and upcoming markets to existing pathway catalog entries", () => {
    const canadaIds = new Set(listPathwaysForGlobalCountry("CA").map((pathway) => pathway.id));
    assert.ok(canadaIds.has("ca-rn-nclex-rn"));
    assert.ok(canadaIds.has("pre-nursing-ca"));
    assert.ok(listPathwaysForGlobalCountry("US").some((pathway) => pathway.id === "us-rn-nclex-rn"));
    assert.ok(listPathwaysForGlobalCountry("uk").some((pathway) => pathway.id === "uk-rn-nmc-test-of-competence"));
    assert.ok(listPathwaysForGlobalCountry("australia").some((pathway) => pathway.id === "au-rn-iqnm-pathway"));
  });

  it("derives country, profession, exam, and URL from a pathway id", () => {
    assert.deepEqual(globalPathwayPreferenceFromPathwayId("uk-rn-nmc-test-of-competence"), {
      country: "United Kingdom",
      profession: "rn",
      exam: "NMC CBT + OSCE",
      pathwayId: "uk-rn-nmc-test-of-competence",
      href: "/uk/rn/nmc-test-of-competence",
    });
  });

  it("names global countries without hardcoding Canada and United States only", () => {
    assert.equal(displayNameForGlobalCountryCode("GB"), "United Kingdom");
    assert.equal(displayNameForGlobalCountryCode("AU"), "Australia");
    assert.equal(displayNameForGlobalCountryCode("AE"), "UAE");
  });

  it("classifies content reuse intent for pathway-scoped content", () => {
    assert.equal(globalContentScopeForPathway(null), "global");
    assert.equal(globalContentScopeForPathway("ca-rn-nclex-rn"), "exam_specific");
    assert.equal(globalContentScopeForPathway("uk-rn-nmc-test-of-competence"), "country_specific");
  });

  it("has no duplicate countries, duplicate slugs, or unknown supported pathways", () => {
    assert.deepEqual(validateGlobalMarketRegistry(), []);
  });
});
