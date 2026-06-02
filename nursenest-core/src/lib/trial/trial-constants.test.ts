import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { STRIPE_TRIAL_DAYS } from "@/lib/pricing/display-catalog";
import { TRIAL_DURATION_DAYS, TRIAL_DURATION_MS } from "./trial-constants";

describe("free-trial duration contracts", () => {
  it("keeps in-app trial entitlement aligned with the public 3-day offer", () => {
    assert.equal(TRIAL_DURATION_DAYS, 3);
    assert.equal(TRIAL_DURATION_MS, 3 * 24 * 60 * 60 * 1000);
  });

  it("keeps Stripe checkout trial length aligned with the same public offer", () => {
    assert.equal(STRIPE_TRIAL_DAYS, TRIAL_DURATION_DAYS);
  });
});
