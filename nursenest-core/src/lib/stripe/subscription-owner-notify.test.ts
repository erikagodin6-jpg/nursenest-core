import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SubscriptionStatus, TierCode } from "@prisma/client";
import type Stripe from "stripe";
import { shouldOwnerNotifyPaidSubscriptionCheckout } from "./subscription-owner-notify-eligibility";

function minimalActiveSubscription(): Stripe.Subscription {
  return { status: "active", items: { data: [] } } as Stripe.Subscription;
}

describe("shouldOwnerNotifyPaidSubscriptionCheckout", () => {
  const livePaidActive = {
    sessionMode: "subscription" as Stripe.Checkout.Session.Mode,
    amountTotal: 1999,
    statusForDb: SubscriptionStatus.ACTIVE,
    stripeSubStatus: "active" as Stripe.Subscription.Status,
    stripeSubscription: minimalActiveSubscription(),
    eventLivemode: true,
    planTier: TierCode.RN,
  };

  it("is true for live paid active subscription checkout", () => {
    assert.equal(shouldOwnerNotifyPaidSubscriptionCheckout(livePaidActive), true);
  });

  it("is false for non-subscription checkout mode", () => {
    assert.equal(
      shouldOwnerNotifyPaidSubscriptionCheckout({ ...livePaidActive, sessionMode: "payment" }),
      false,
    );
  });

  it("is false when amount_total is zero or missing", () => {
    assert.equal(shouldOwnerNotifyPaidSubscriptionCheckout({ ...livePaidActive, amountTotal: 0 }), false);
    assert.equal(shouldOwnerNotifyPaidSubscriptionCheckout({ ...livePaidActive, amountTotal: null }), false);
  });

  it("is false when Stripe subscription is not active (e.g. trialing)", () => {
    assert.equal(
      shouldOwnerNotifyPaidSubscriptionCheckout({
        ...livePaidActive,
        stripeSubStatus: "trialing",
      }),
      false,
    );
  });

  it("is false when DB row would not be ACTIVE", () => {
    assert.equal(
      shouldOwnerNotifyPaidSubscriptionCheckout({
        ...livePaidActive,
        statusForDb: SubscriptionStatus.CANCELLED,
      }),
      false,
    );
  });

  it("is false for test-mode events unless ADMIN_SUBSCRIPTION_NOTIFY_INCLUDE_TEST_MODE is set", () => {
    const prev = process.env.ADMIN_SUBSCRIPTION_NOTIFY_INCLUDE_TEST_MODE;
    delete process.env.ADMIN_SUBSCRIPTION_NOTIFY_INCLUDE_TEST_MODE;
    assert.equal(shouldOwnerNotifyPaidSubscriptionCheckout({ ...livePaidActive, eventLivemode: false }), false);
    process.env.ADMIN_SUBSCRIPTION_NOTIFY_INCLUDE_TEST_MODE = "true";
    assert.equal(shouldOwnerNotifyPaidSubscriptionCheckout({ ...livePaidActive, eventLivemode: false }), true);
    if (prev === undefined) delete process.env.ADMIN_SUBSCRIPTION_NOTIFY_INCLUDE_TEST_MODE;
    else process.env.ADMIN_SUBSCRIPTION_NOTIFY_INCLUDE_TEST_MODE = prev;
  });

  it("is false for free Stripe-billing nursing tiers", () => {
    assert.equal(
      shouldOwnerNotifyPaidSubscriptionCheckout({
        ...livePaidActive,
        planTier: TierCode.PRE_NURSING,
      }),
      false,
    );
  });

  it("is false without a retrieved Stripe subscription object", () => {
    assert.equal(
      shouldOwnerNotifyPaidSubscriptionCheckout({
        ...livePaidActive,
        stripeSubscription: null,
      }),
      false,
    );
  });
});
