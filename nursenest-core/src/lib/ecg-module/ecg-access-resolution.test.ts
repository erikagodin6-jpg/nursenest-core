import assert from "node:assert/strict";
import test from "node:test";
import { resolveEcgModuleEntitlements } from "@/lib/ecg-module/ecg-access-resolution";

test("base learner access unlocks only the foundational ECG track", () => {
  const entitlements = resolveEcgModuleEntitlements({
    hasBaseLearnerAccess: true,
    hasAdvancedEcgEntitlement: false,
  });

  assert.equal(entitlements.hasBasicEcgAccess, true);
  assert.equal(entitlements.hasAdvancedEcgAccess, false);
});

test("Advanced ECG entitlement inherits foundational ECG access", () => {
  const entitlements = resolveEcgModuleEntitlements({
    hasBaseLearnerAccess: false,
    hasAdvancedEcgEntitlement: true,
  });

  assert.equal(entitlements.hasBasicEcgAccess, true);
  assert.equal(entitlements.hasAdvancedEcgAccess, true);
});
