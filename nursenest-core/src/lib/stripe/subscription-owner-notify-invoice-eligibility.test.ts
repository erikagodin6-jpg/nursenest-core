import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { invoiceOwnerNotifyAmountEligible } from "./subscription-owner-notify";

describe("invoiceOwnerNotifyAmountEligible", () => {
  it("allows positive amount_paid for any billing_reason", () => {
    assert.equal(invoiceOwnerNotifyAmountEligible(100, "subscription_cycle"), true);
    assert.equal(invoiceOwnerNotifyAmountEligible(50, null), true);
  });

  it("allows zero amount only for subscription_create", () => {
    assert.equal(invoiceOwnerNotifyAmountEligible(0, "subscription_create"), true);
    assert.equal(invoiceOwnerNotifyAmountEligible(0, "subscription_cycle"), false);
    assert.equal(invoiceOwnerNotifyAmountEligible(0, undefined), false);
  });

  it("rejects missing or negative amounts", () => {
    assert.equal(invoiceOwnerNotifyAmountEligible(null, "subscription_create"), false);
    assert.equal(invoiceOwnerNotifyAmountEligible(undefined, "subscription_create"), false);
    assert.equal(invoiceOwnerNotifyAmountEligible(-1, "subscription_create"), false);
  });
});
