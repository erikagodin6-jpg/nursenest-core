import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CountryCode, TierCode } from "@prisma/client";
import { planFromCheckoutMetadata } from "./checkout-plan-metadata";

describe("planFromCheckoutMetadata (server-written Stripe session metadata)", () => {
  it("parses legacy CA/US + tier", () => {
    const p = planFromCheckoutMetadata({
      userId: "u1",
      country: "CA",
      tier: "RN",
      duration: "monthly",
      planCode: "x",
    });
    assert.ok(p);
    assert.equal(p!.tier, TierCode.RN);
    assert.equal(p!.country, CountryCode.CA);
  });

  it("parses global regional slug without falsely assigning CA/US (tier + region only)", () => {
    const p = planFromCheckoutMetadata({
      userId: "u1",
      tier: "RN",
      region: "philippines",
      duration: "monthly",
      planCode: "philippines_nursing_monthly",
    });
    assert.ok(p);
    assert.equal(p!.tier, TierCode.RN);
    assert.equal(p!.country, null);
  });

  it("prefers global region over misleading legacy country field", () => {
    const p = planFromCheckoutMetadata({
      tier: "RN",
      country: "CA",
      region: "philippines",
      duration: "monthly",
      planCode: "philippines_nursing_monthly",
    });
    assert.ok(p);
    assert.equal(p!.country, null);
  });

  it("maps region canada/us to CA/US pools", () => {
    assert.equal(
      planFromCheckoutMetadata({ tier: "RN", region: "canada", duration: "monthly", planCode: "c" })!.country,
      CountryCode.CA,
    );
    assert.equal(
      planFromCheckoutMetadata({ tier: "RN", region: "us", duration: "monthly", planCode: "u" })!.country,
      CountryCode.US,
    );
  });
});
