import assert from "node:assert/strict";
import test from "node:test";
import {
  hasAdvancedEcgAccess,
  hasBasicEcgAccess,
  resolveEcgModuleEntitlements,
} from "@/lib/ecg-module/ecg-access-resolution";

test("base learner access unlocks only the foundational ECG track", () => {
  const entitlements = resolveEcgModuleEntitlements({
    hasBaseLearnerAccess: true,
    hasAdvancedEcgEntitlement: false,
  });

  assert.equal(entitlements.hasBasicEcgAccess, true);
  assert.equal(entitlements.hasAdvancedEcgAccess, false);
  assert.equal(entitlements.accessState, "basic_only");
});

test("Advanced ECG entitlement inherits foundational ECG access", () => {
  const entitlements = resolveEcgModuleEntitlements({
    hasBaseLearnerAccess: false,
    hasAdvancedEcgEntitlement: true,
  });

  assert.equal(entitlements.hasBasicEcgAccess, true);
  assert.equal(entitlements.hasAdvancedEcgAccess, true);
  assert.equal(entitlements.accessState, "advanced_includes_basic");
});

test("central ECG helper predicates match the requested inheritance semantics", () => {
  assert.equal(
    hasBasicEcgAccess({
      hasBaseLearnerAccess: true,
      hasAdvancedEcgEntitlement: false,
    }),
    true,
  );
  assert.equal(
    hasBasicEcgAccess({
      hasBaseLearnerAccess: false,
      hasAdvancedEcgEntitlement: true,
    }),
    true,
  );
  assert.equal(
    hasAdvancedEcgAccess({
      hasBaseLearnerAccess: true,
      hasAdvancedEcgEntitlement: false,
    }),
    false,
  );
  assert.equal(
    hasAdvancedEcgAccess({
      hasBaseLearnerAccess: false,
      hasAdvancedEcgEntitlement: true,
    }),
    true,
  );
});
