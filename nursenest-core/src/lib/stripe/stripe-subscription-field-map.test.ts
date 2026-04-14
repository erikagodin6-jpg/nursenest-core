import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SubscriptionStatus } from "@prisma/client";
import {
  billingLifecycleFields,
  firstSubscriptionPriceId,
  isDemoStripeSubscriptionId,
  isHighRiskDbActiveStripeEndedOrPaused,
  mapStripeSubscriptionStatus,
  STRIPE_RECONCILE_PERIOD_DRIFT_MS,
} from "./stripe-subscription-field-map";

describe("mapStripeSubscriptionStatus (aligned with webhook + entitlements)", () => {
  it("maps active and trialing to ACTIVE", () => {
    assert.equal(mapStripeSubscriptionStatus("active"), SubscriptionStatus.ACTIVE);
    assert.equal(mapStripeSubscriptionStatus("trialing"), SubscriptionStatus.ACTIVE);
  });

  it("maps past_due and unpaid to PAST_DUE", () => {
    assert.equal(mapStripeSubscriptionStatus("past_due"), SubscriptionStatus.PAST_DUE);
    assert.equal(mapStripeSubscriptionStatus("unpaid"), SubscriptionStatus.PAST_DUE);
  });

  it("maps canceled and incomplete_expired to CANCELLED", () => {
    assert.equal(mapStripeSubscriptionStatus("canceled"), SubscriptionStatus.CANCELLED);
    assert.equal(mapStripeSubscriptionStatus("incomplete_expired"), SubscriptionStatus.CANCELLED);
  });

  it("returns null for incomplete and paused (do not overwrite blindly)", () => {
    assert.equal(mapStripeSubscriptionStatus("incomplete"), null);
    assert.equal(mapStripeSubscriptionStatus("paused"), null);
  });

  it("defaults unknown Stripe statuses to CANCELLED", () => {
    assert.equal(mapStripeSubscriptionStatus("foo" as "active"), SubscriptionStatus.CANCELLED);
  });
});

describe("billingLifecycleFields", () => {
  it("reads period and trial from Stripe-shaped object", () => {
    const sub = {
      cancel_at_period_end: true,
      current_period_end: 1_700_000_000,
      trial_end: 1_700_000_100,
    } as unknown as import("stripe").Subscription;
    const b = billingLifecycleFields(sub);
    assert.equal(b.cancelAtPeriodEnd, true);
    assert.ok(b.currentPeriodEnd instanceof Date);
    assert.ok(b.trialEnd instanceof Date);
  });
});

describe("firstSubscriptionPriceId", () => {
  it("returns expanded price id", () => {
    const sub = {
      items: { data: [{ price: { id: "price_123" } }] },
    } as unknown as import("stripe").Subscription;
    assert.equal(firstSubscriptionPriceId(sub), "price_123");
  });
});

describe("demo skip", () => {
  it("detects demo_sub_ prefix", () => {
    assert.equal(isDemoStripeSubscriptionId("demo_sub_abc"), true);
    assert.equal(isDemoStripeSubscriptionId("sub_live123"), false);
  });
});

describe("high-risk drift heuristics", () => {
  it("flags ACTIVE db with canceled Stripe", () => {
    assert.equal(
      isHighRiskDbActiveStripeEndedOrPaused(SubscriptionStatus.ACTIVE, "canceled"),
      true,
    );
  });

  it("flags GRACE db with paused Stripe", () => {
    assert.equal(isHighRiskDbActiveStripeEndedOrPaused(SubscriptionStatus.GRACE, "paused"), true);
  });

  it("does not flag PAST_DUE db with canceled Stripe (different policy path)", () => {
    assert.equal(
      isHighRiskDbActiveStripeEndedOrPaused(SubscriptionStatus.PAST_DUE, "canceled"),
      false,
    );
  });
});

describe("STRIPE_RECONCILE_PERIOD_DRIFT_MS", () => {
  it("is two minutes", () => {
    assert.equal(STRIPE_RECONCILE_PERIOD_DRIFT_MS, 120_000);
  });
});
