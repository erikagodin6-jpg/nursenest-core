import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type Stripe from "stripe";
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
});
