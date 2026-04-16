import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CountryCode, SubscriptionStatus, TierCode, TrialStatus, UserRole } from "@prisma/client";
import type { BillingSubscriptionRow, BillingUserRow } from "@/lib/learner/billing-page-payload-types";
import { deriveBillingSurface } from "./derive-billing-page-surface";

function user(over: Partial<BillingUserRow> = {}): BillingUserRow {
  return {
    tier: TierCode.RN,
    country: "US",
    role: UserRole.LEARNER,
    trialStatus: TrialStatus.NONE,
    trialEndsAt: null,
    trialStartedAt: null,
    learnerPath: null,
    passwordHash: null,
    ...over,
  };
}

function sub(status: SubscriptionStatus): BillingSubscriptionRow {
  return {
    status,
    stripeSubscriptionId: "sub_test",
    stripeCustomerId: "cus_test",
    planTier: TierCode.RN,
    planCountry: CountryCode.US,
    alliedCareer: null,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  };
}

describe("deriveBillingSurface", () => {
  it("maps PAST_DUE + past_due_grace entitlement to past_due_grace surface", () => {
    assert.equal(
      deriveBillingSurface({
        user: user(),
        subscription: sub(SubscriptionStatus.PAST_DUE),
        hasAccess: true,
        entitlementReason: "past_due_grace",
        trialEndsAt: null,
      }),
      "past_due_grace",
    );
  });

  it("maps PAST_DUE without premium to past_due (strict or grace expired)", () => {
    assert.equal(
      deriveBillingSurface({
        user: user(),
        subscription: sub(SubscriptionStatus.PAST_DUE),
        hasAccess: false,
        entitlementReason: "no_access",
        trialEndsAt: null,
      }),
      "past_due",
    );
  });

  it("when subscription is PAST_DUE but access comes from trial, shows trial messaging (not a false payment lockout)", () => {
    const trialEnd = new Date("2026-06-01T00:00:00.000Z");
    assert.equal(
      deriveBillingSurface({
        user: user({ trialStatus: TrialStatus.ACTIVE, trialEndsAt: trialEnd }),
        subscription: sub(SubscriptionStatus.PAST_DUE),
        hasAccess: true,
        entitlementReason: "active_trial",
        trialEndsAt: trialEnd,
      }),
      "trial",
    );
  });

  it("maps ACTIVE + access to active_paid", () => {
    assert.equal(
      deriveBillingSurface({
        user: user(),
        subscription: sub(SubscriptionStatus.ACTIVE),
        hasAccess: true,
        entitlementReason: "active_subscription",
        trialEndsAt: null,
      }),
      "active_paid",
    );
  });
});
