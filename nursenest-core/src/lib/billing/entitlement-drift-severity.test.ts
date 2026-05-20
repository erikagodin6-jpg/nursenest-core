import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { computeDriftSeverity, driftHints } from "./entitlement-drift-severity";

describe("entitlement-drift-severity", () => {
  it("returns ok when both counters are zero", () => {
    assert.equal(computeDriftSeverity({ activeLikeMissingStripeCustomer: 0, activeLikeTierMismatchUser: 0 }), "ok");
  });

  it("returns warn for small non-zero drift", () => {
    assert.equal(computeDriftSeverity({ activeLikeMissingStripeCustomer: 1, activeLikeTierMismatchUser: 0 }), "warn");
    assert.equal(computeDriftSeverity({ activeLikeMissingStripeCustomer: 0, activeLikeTierMismatchUser: 5 }), "warn");
  });

  it("returns critical at high thresholds", () => {
    assert.equal(computeDriftSeverity({ activeLikeMissingStripeCustomer: 100, activeLikeTierMismatchUser: 0 }), "critical");
    assert.equal(computeDriftSeverity({ activeLikeMissingStripeCustomer: 0, activeLikeTierMismatchUser: 300 }), "critical");
  });

  it("driftHints mentions missing customer and tier mismatch when applicable", () => {
    assert.ok(driftHints({ activeLikeMissingStripeCustomer: 1, activeLikeTierMismatchUser: 0 })[0].includes("stripeCustomerId"));
    assert.ok(driftHints({ activeLikeMissingStripeCustomer: 0, activeLikeTierMismatchUser: 1 })[0].includes("planTier"));
  });
});
