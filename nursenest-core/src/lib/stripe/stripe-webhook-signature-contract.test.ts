/**
 * Stripe webhook HMAC verification contract (same primitives as production `constructStripeWebhookEvent`).
 * Does not import `stripe-webhook-verify` (server-only marker) — keeps tests runnable under plain Node.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Stripe from "stripe";

describe("Stripe webhook signing contract", () => {
  it("constructEvent accepts generateTestHeaderString payload", () => {
    const stripe = new Stripe("sk_test_security_contract", {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    });
    const payload = JSON.stringify({ id: "evt_contract_test", object: "event", type: "ping" });
    const secret = "whsec_test_contract_secret";
    const header = stripe.webhooks.generateTestHeaderString({ payload, secret });
    const evt = stripe.webhooks.constructEvent(payload, header, secret);
    assert.equal((evt as { id?: string }).id, "evt_contract_test");
  });

  it("rejects tampered body with same header", () => {
    const stripe = new Stripe("sk_test_security_contract", {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    });
    const payload = JSON.stringify({ id: "evt_a", object: "event" });
    const secret = "whsec_test_contract_secret";
    const header = stripe.webhooks.generateTestHeaderString({ payload, secret });
    assert.throws(() => {
      stripe.webhooks.constructEvent(payload.replace("evt_a", "evt_b"), header, secret);
    });
  });

  it("rejects wrong webhook secret", () => {
    const stripe = new Stripe("sk_test_security_contract", {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    });
    const payload = "{}";
    const header = stripe.webhooks.generateTestHeaderString({
      payload,
      secret: "whsec_a",
    });
    assert.throws(() => stripe.webhooks.constructEvent(payload, header, "whsec_b"));
  });
});
