import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";
import {
  guardSubscriptionCreateCustomerConsistency,
  isTrustedStripeReconciliationUserId,
} from "./stripe-reconcile-metadata";

describe("isTrustedStripeReconciliationUserId", () => {
  it("accepts typical cuid-like ids", () => {
    assert.equal(isTrustedStripeReconciliationUserId("clhxyz0123456789012345678"), true);
  });

  it("rejects empty, too short, or non-alphanumeric", () => {
    assert.equal(isTrustedStripeReconciliationUserId(null), false);
    assert.equal(isTrustedStripeReconciliationUserId(""), false);
    assert.equal(isTrustedStripeReconciliationUserId("short"), false);
    assert.equal(isTrustedStripeReconciliationUserId("has-dashes-not-ok-123456789012"), false);
    assert.equal(isTrustedStripeReconciliationUserId("space not ok 12345678901"), false);
  });
});

describe("guardSubscriptionCreateCustomerConsistency", () => {
  it("allows when user has no subscription rows", async () => {
    const prisma = {
      subscription: {
        findMany: mock.fn(async () => []),
      },
    };
    const r = await guardSubscriptionCreateCustomerConsistency(
      prisma as never,
      "user1",
      "cus_A",
    );
    assert.equal(r.allow, true);
  });

  it("allows when existing customer matches", async () => {
    const prisma = {
      subscription: {
        findMany: mock.fn(async () => [{ stripeCustomerId: "cus_A" }]),
      },
    };
    const r = await guardSubscriptionCreateCustomerConsistency(
      prisma as never,
      "user1",
      "cus_A",
    );
    assert.equal(r.allow, true);
  });

  it("blocks when user has different Stripe customer", async () => {
    const prisma = {
      subscription: {
        findMany: mock.fn(async () => [{ stripeCustomerId: "cus_A" }]),
      },
    };
    const r = await guardSubscriptionCreateCustomerConsistency(
      prisma as never,
      "user1",
      "cus_B",
    );
    assert.equal(r.allow, false);
    assert.match(String((r as { allow: false }).reason), /different Stripe customer/);
  });

  it("blocks when customer id missing but user has customer-bound rows", async () => {
    const prisma = {
      subscription: {
        findMany: mock.fn(async () => [{ stripeCustomerId: "cus_A" }]),
      },
    };
    const r = await guardSubscriptionCreateCustomerConsistency(prisma as never, "user1", null);
    assert.equal(r.allow, false);
  });

  it("allows when existing rows have no stored customer ids", async () => {
    const prisma = {
      subscription: {
        findMany: mock.fn(async () => [{ stripeCustomerId: null }] as { stripeCustomerId: null }[]),
      },
    };
    const r = await guardSubscriptionCreateCustomerConsistency(
      prisma as never,
      "user1",
      "cus_New",
    );
    assert.equal(r.allow, true);
  });
});
