import test from "node:test";
import assert from "node:assert/strict";
import type { UserAccess } from "@/lib/entitlements/user-access-types";
import { toCanonicalLearnerAccess } from "@/lib/entitlements/canonical-learner-access.server";

function baseUa(over: Partial<UserAccess>): UserAccess {
  return {
    userId: "test-user",
    hasPremium: false,
    reason: "no_access",
    allowedRegion: { country: null, billingRegionSlug: null },
    allowedProfession: { tier: null, alliedCareer: null },
    allowedExam: { pathwayId: null },
    plan: {
      planCode: null,
      duration: null,
      status: "none",
      expiresAt: null,
      cancelAtPeriodEnd: false,
    },
    ...over,
  };
}

test("toCanonicalLearnerAccess maps tier, pathway, hasAccess, and reasonCode without inventing new codes", () => {
  const ua = baseUa({
    hasPremium: true,
    reason: "active_subscription",
    allowedProfession: { tier: "NP", alliedCareer: null },
    allowedExam: { pathwayId: "us-np-fnp" },
  });
  const c = toCanonicalLearnerAccess(ua, "get_user_access");
  assert.equal(c.hasAccess, true);
  assert.equal(c.reasonCode, "active_subscription");
  assert.equal(c.tier, "NP");
  assert.equal(c.pathwayId, "us-np-fnp");
  assert.equal(c.resolutionSource, "get_user_access");
});

test("toCanonicalLearnerAccess carries admin learner QA simulation flag when present on UserAccess", () => {
  const ua = baseUa({
    hasPremium: true,
    reason: "active_trial",
    adminLearnerQaSimulation: true,
    allowedProfession: { tier: "RN", alliedCareer: null },
  });
  const c = toCanonicalLearnerAccess(ua, "subscriber_session_ok");
  assert.equal(c.adminLearnerQaSimulation, true);
});
