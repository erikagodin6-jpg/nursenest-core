import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildCheckoutSubscriptionIdempotencyKey } from "./checkout-subscription-guard.server";

describe("buildCheckoutSubscriptionIdempotencyKey", () => {
  it("uses checkout-sub-v1:userId:priceId format", () => {
    assert.strictEqual(
      buildCheckoutSubscriptionIdempotencyKey("user_abc", "price_xyz"),
      "checkout-sub-v1:user_abc:price_xyz",
    );
  });

  it("keeps key bounded when inputs are huge", () => {
    const u = "u".repeat(300);
    const p = "p".repeat(300);
    const key = buildCheckoutSubscriptionIdempotencyKey(u, p);
    assert.ok(key.length <= 255);
    assert.ok(key.startsWith("checkout-sub-v1:"));
  });
});
