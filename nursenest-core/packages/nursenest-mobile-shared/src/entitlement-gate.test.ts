import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { entitlementStopMessage, isHardEntitlementStop } from "./entitlement-gate";
import { MobileApiError } from "./mobile-api-client";

describe("entitlement gate", () => {
  it("flags 401/403", () => {
    assert.equal(isHardEntitlementStop(new MobileApiError("x", 401, {})), true);
    assert.equal(isHardEntitlementStop(new MobileApiError("x", 403, {})), true);
    assert.equal(isHardEntitlementStop(new MobileApiError("x", 503, {})), false);
    assert.equal(isHardEntitlementStop(new Error("nope")), false);
  });

  it("messages", () => {
    assert.match(entitlementStopMessage(new MobileApiError("x", 401, {})), /Sign in/);
    assert.match(entitlementStopMessage(new MobileApiError("x", 403, {})), /subscription/);
  });
});
