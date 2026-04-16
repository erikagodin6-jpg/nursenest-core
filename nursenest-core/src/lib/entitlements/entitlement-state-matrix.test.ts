import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SubscriptionStatus } from "@prisma/client";
import { mapStripeSubscriptionStatus } from "@/lib/stripe/stripe-subscription-field-map";
import { GET_USER_ACCESS_REASON_PREMIUM, STRIPE_STATUS_DB_MAPPING_NOTES } from "./entitlement-state-matrix";

describe("entitlement-state-matrix vs mapStripeSubscriptionStatus", () => {
  it("matrix rows for concrete Stripe statuses match the mapper", () => {
    const expectations: Record<string, SubscriptionStatus | null> = {
      active: SubscriptionStatus.ACTIVE,
      trialing: SubscriptionStatus.ACTIVE,
      past_due: SubscriptionStatus.PAST_DUE,
      unpaid: SubscriptionStatus.PAST_DUE,
      canceled: SubscriptionStatus.CANCELLED,
      incomplete_expired: SubscriptionStatus.CANCELLED,
      incomplete: null,
      paused: null,
    };
    for (const [stripe, expected] of Object.entries(expectations)) {
      assert.equal(
        mapStripeSubscriptionStatus(stripe as Parameters<typeof mapStripeSubscriptionStatus>[0]),
        expected,
        `stripe=${stripe}`,
      );
    }
  });

  it("documents at least one row per mapper-backed Stripe status in STRIPE_STATUS_DB_MAPPING_NOTES", () => {
    const docStripes = new Set(STRIPE_STATUS_DB_MAPPING_NOTES.map((r) => r.stripe));
    for (const s of ["active", "trialing", "past_due", "unpaid", "canceled", "incomplete_expired", "incomplete", "paused"]) {
      assert.ok(docStripes.has(s), `missing doc row for ${s}`);
    }
  });
});

describe("GET_USER_ACCESS_REASON_PREMIUM", () => {
  it("lists every AccessScope reason from user-access-types", () => {
    const reasons = new Set(GET_USER_ACCESS_REASON_PREMIUM.map((r) => r.reason));
    for (const r of ["active_subscription", "admin_override", "grace_period", "past_due_grace", "active_trial", "no_access"]) {
      assert.ok(reasons.has(r), `missing reason ${r}`);
    }
  });
});
