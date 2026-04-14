import test from "node:test";
import assert from "node:assert/strict";
import { subscriptionStatusForSession } from "./subscription-session-status";
import type { UserAccess } from "./user-access-types";

function ua(partial: Partial<UserAccess> & Pick<UserAccess, "hasPremium" | "reason">): UserAccess {
  return {
    userId: "test",
    hasPremium: partial.hasPremium,
    reason: partial.reason,
    allowedRegion: { country: null, billingRegionSlug: null },
    allowedProfession: { tier: null, alliedCareer: null },
    allowedExam: { pathwayId: null },
    plan: {
      planCode: null,
      duration: null,
      status: partial.plan?.status ?? "none",
      expiresAt: null,
      cancelAtPeriodEnd: false,
    },
    ...partial,
  };
}

test("subscriptionStatusForSession: strict PAST_DUE without premium is past_due", () => {
  assert.equal(
    subscriptionStatusForSession(
      ua({
        hasPremium: false,
        reason: "no_access",
        plan: { planCode: null, duration: null, status: "past_due", expiresAt: null, cancelAtPeriodEnd: false },
      }),
    ),
    "past_due",
  );
});

test("subscriptionStatusForSession: past_due_grace maps to past_due_grace", () => {
  assert.equal(
    subscriptionStatusForSession(
      ua({
        hasPremium: true,
        reason: "past_due_grace",
        plan: { planCode: null, duration: null, status: "past_due", expiresAt: null, cancelAtPeriodEnd: false },
      }),
    ),
    "past_due_grace",
  );
});

test("subscriptionStatusForSession: Stripe GRACE uses grace, not past_due_grace", () => {
  assert.equal(
    subscriptionStatusForSession(
      ua({
        hasPremium: true,
        reason: "grace_period",
        plan: { planCode: null, duration: null, status: "grace", expiresAt: null, cancelAtPeriodEnd: false },
      }),
    ),
    "grace",
  );
});

test("subscriptionStatusForSession: active subscription is active", () => {
  assert.equal(
    subscriptionStatusForSession(
      ua({
        hasPremium: true,
        reason: "active_subscription",
        plan: { planCode: null, duration: null, status: "active", expiresAt: null, cancelAtPeriodEnd: false },
      }),
    ),
    "active",
  );
});
