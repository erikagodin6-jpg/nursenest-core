import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { TierCode, CountryCode } from "@prisma/client";
import { effectiveTierCountryForAccess } from "./subscription-plan";

describe("effectiveTierCountryForAccess", () => {
  const user = { tier: TierCode.RN, country: CountryCode.US };

  it("uses user profile when subscription has no plan snapshot", () => {
    const r = effectiveTierCountryForAccess(user, null);
    assert.equal(r.tier, TierCode.RN);
    assert.equal(r.country, CountryCode.US);
  });

  it("prefers subscription plan tier and country when set", () => {
    const r = effectiveTierCountryForAccess(user, {
      planTier: TierCode.RPN,
      planCountry: CountryCode.CA,
    });
    assert.equal(r.tier, TierCode.RPN);
    assert.equal(r.country, CountryCode.CA);
  });
});
