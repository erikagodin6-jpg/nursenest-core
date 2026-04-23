import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SubscriptionStatus, TrialStatus, UserRole } from "@prisma/client";
import { deriveBillingSurface } from "@/lib/learner/derive-billing-page-surface";

const baseUser = {
  tier: "RN" as const,
  country: "US",
  role: UserRole.ADMIN,
  trialStatus: TrialStatus.NONE,
  trialEndsAt: null as Date | null,
  trialStartedAt: null as Date | null,
  learnerPath: null as string | null,
  passwordHash: "x",
};

describe("deriveBillingSurface", () => {
  it("returns admin for staff without QA skip flag", () => {
    const s = deriveBillingSurface({
      user: baseUser,
      subscription: null,
      hasAccess: false,
      entitlementReason: "no_access",
      trialEndsAt: null,
    });
    assert.equal(s, "admin");
  });

  it("skips admin surface when staff runs learner QA simulation", () => {
    const s = deriveBillingSurface({
      user: baseUser,
      subscription: null,
      hasAccess: false,
      entitlementReason: "no_access",
      trialEndsAt: null,
      skipStaffAdminSurface: true,
    });
    assert.equal(s, "inactive");
  });

  it("maps simulated trial access for staff QA", () => {
    const s = deriveBillingSurface({
      user: baseUser,
      subscription: null,
      hasAccess: true,
      entitlementReason: "active_trial",
      trialEndsAt: null,
      skipStaffAdminSurface: true,
    });
    assert.equal(s, "active_paid");
  });

  it("maps simulated paid subscription surface for staff QA", () => {
    const s = deriveBillingSurface({
      user: baseUser,
      subscription: {
        status: SubscriptionStatus.ACTIVE,
        stripeSubscriptionId: "sub_x",
        stripeCustomerId: "cus_x",
        planTier: "RN",
        planCountry: "US",
        alliedCareer: null,
        cancelAtPeriodEnd: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      hasAccess: true,
      entitlementReason: "active_subscription",
      trialEndsAt: null,
      skipStaffAdminSurface: true,
    });
    assert.equal(s, "active_paid");
  });
});
