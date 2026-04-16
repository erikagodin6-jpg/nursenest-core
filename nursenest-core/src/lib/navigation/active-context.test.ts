import test from "node:test";
import assert from "node:assert/strict";
import {
  buildActiveContext,
  resolveEntitlementFromSubscriptionStatus,
  resolveNavMode,
  resolvePrimaryPathwayNav,
} from "./active-context";

test("resolveEntitlementFromSubscriptionStatus: active is entitled", () => {
  assert.equal(resolveEntitlementFromSubscriptionStatus("active"), "entitled");
});

test("resolveEntitlementFromSubscriptionStatus: none is unpaid when user exists", () => {
  assert.equal(resolveEntitlementFromSubscriptionStatus("none"), "unpaid");
});

test("resolveNavMode: marketing chrome is always public (signed-in learners keep marketing IA)", () => {
  assert.equal(resolveNavMode({ entitlement: "entitled", role: "LEARNER" }), "public");
  assert.equal(resolveNavMode({ entitlement: "entitled", role: "ADMIN" }), "public");
  assert.equal(resolveNavMode({ entitlement: "unpaid", role: "LEARNER" }), "public");
  assert.equal(resolveNavMode({ entitlement: "none", role: undefined }), "public");
});

test("buildActiveContext: entitled learner never gets learner navMode (marketing shell contract)", () => {
  const ctx = buildActiveContext({
    locale: "en",
    examRegion: "US",
    globalRegion: null,
    session: {
      expires: "2099-01-01",
      user: {
        id: "u1",
        email: "paid@example.com",
        name: "Paid",
        role: "LEARNER",
        country: "US",
        tier: "RN",
        subscriptionStatus: "active",
      },
    },
  });
  assert.equal(ctx.navMode, "public");
  assert.equal(ctx.entitlement, "entitled");
});

test("resolvePrimaryPathwayNav: NP > RN > PN", () => {
  assert.equal(resolvePrimaryPathwayNav("NP"), "NP");
  assert.equal(resolvePrimaryPathwayNav("RN"), "RN");
  assert.equal(resolvePrimaryPathwayNav("RPN"), "PN");
  assert.equal(resolvePrimaryPathwayNav("LVN_LPN"), "PN");
  assert.equal(resolvePrimaryPathwayNav("ALLIED"), "ALLIED");
  assert.equal(resolvePrimaryPathwayNav(null), null);
});
