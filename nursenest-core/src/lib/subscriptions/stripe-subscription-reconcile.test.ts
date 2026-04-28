import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SubscriptionStatus } from "@prisma/client";
import type Stripe from "stripe";
import type { BillingSubscriptionRow } from "@/lib/learner/billing-page-payload-types";
import {
  billingSubscriptionRowFromStripeSubscription,
  mergeBillingSubscriptionRowWithStripe,
} from "./stripe-subscription-reconcile";
import { canUserCancelStripeSubscription, pickControllingStripeSubscription } from "./stripe-subscription-eligibility";

function sub(status: Stripe.Subscription.Status, cancelAtEnd = false, id = "sub_x"): Stripe.Subscription {
  return {
    id,
    status,
    cancel_at_period_end: cancelAtEnd,
    items: { data: [], object: "list", has_more: false, url: "" },
  } as Stripe.Subscription;
}

describe("stripe-subscription-reconcile", () => {
  it("pickControllingStripeSubscription prefers active over trialing", () => {
    const picked = pickControllingStripeSubscription([sub("trialing", false, "sub_t"), sub("active", false, "sub_a")]);
    assert.equal(picked?.id, "sub_a");
  });

  it("pickControllingStripeSubscription returns past_due when no active/trialing", () => {
    const picked = pickControllingStripeSubscription([sub("canceled", false, "sub_c"), sub("past_due", false, "sub_p")]);
    assert.equal(picked?.id, "sub_p");
  });

  it("pickControllingStripeSubscription returns unpaid after past_due", () => {
    const picked = pickControllingStripeSubscription([sub("unpaid", false, "sub_u"), sub("canceled", false, "sub_c")]);
    assert.equal(picked?.id, "sub_u");
  });

  it("canUserCancelStripeSubscription is false when cancel_at_period_end", () => {
    assert.equal(canUserCancelStripeSubscription(sub("active", true)), false);
  });

  it("canUserCancelStripeSubscription is true for active/trialing/past_due/unpaid when not scheduling cancel", () => {
    assert.equal(canUserCancelStripeSubscription(sub("active", false)), true);
    assert.equal(canUserCancelStripeSubscription(sub("trialing", false)), true);
    assert.equal(canUserCancelStripeSubscription(sub("past_due", false)), true);
    assert.equal(canUserCancelStripeSubscription(sub("unpaid", false)), true);
    assert.equal(canUserCancelStripeSubscription(sub("canceled", false)), false);
    assert.equal(canUserCancelStripeSubscription(sub("incomplete_expired", false)), false);
  });

  it("mergeBillingSubscriptionRowWithStripe overrides stale DB status and cancel flag from Stripe", () => {
    const base: BillingSubscriptionRow = {
      status: SubscriptionStatus.CANCELLED,
      stripeSubscriptionId: "sub_db",
      stripeCustomerId: "cus_old",
      planTier: null,
      planCountry: null,
      alliedCareer: null,
      cancelAtPeriodEnd: false,
      createdAt: new Date("2020-01-01"),
      updatedAt: new Date("2020-01-02"),
    };
    const stripeSub = {
      ...sub("active", false, "sub_stripe"),
      customer: "cus_from_stripe",
    } as Stripe.Subscription;
    const merged = mergeBillingSubscriptionRowWithStripe(base, stripeSub);
    assert.equal(merged.status, SubscriptionStatus.ACTIVE);
    assert.equal(merged.stripeSubscriptionId, "sub_stripe");
    assert.equal(merged.stripeCustomerId, "cus_from_stripe");
    assert.equal(merged.cancelAtPeriodEnd, false);
  });

  it("mergeBillingSubscriptionRowWithStripe reflects scheduled cancellation from Stripe", () => {
    const base: BillingSubscriptionRow = {
      status: SubscriptionStatus.ACTIVE,
      stripeSubscriptionId: "sub_1",
      stripeCustomerId: "cus_1",
      planTier: null,
      planCountry: null,
      alliedCareer: null,
      cancelAtPeriodEnd: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const merged = mergeBillingSubscriptionRowWithStripe(base, sub("active", true, "sub_1"));
    assert.equal(merged.cancelAtPeriodEnd, true);
    assert.equal(canUserCancelStripeSubscription(sub("active", true)), false);
  });

  it("billingSubscriptionRowFromStripeSubscription builds display row for active Stripe-only state", () => {
    const stripeSub = {
      ...sub("active", false, "sub_only"),
      customer: "cus_only",
      created: Math.floor(Date.now() / 1000),
    } as Stripe.Subscription;
    const row = billingSubscriptionRowFromStripeSubscription(stripeSub);
    assert.ok(row);
    assert.equal(row!.status, SubscriptionStatus.ACTIVE);
    assert.equal(row!.stripeSubscriptionId, "sub_only");
    assert.equal(row!.stripeCustomerId, "cus_only");
  });

  it("billingSubscriptionRowFromStripeSubscription returns null for terminal Stripe status", () => {
    assert.equal(billingSubscriptionRowFromStripeSubscription(sub("canceled", false)), null);
  });
});
