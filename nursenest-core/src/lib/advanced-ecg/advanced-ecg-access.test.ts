import assert from "node:assert/strict";
import test from "node:test";
import { SubscriptionStatus } from "@prisma/client";
import {
  hasActiveAdvancedEcgEntitlementFromRows,
  resolveAdvancedEcgAccessDecision,
} from "@/lib/advanced-ecg/advanced-ecg-access";

test("Advanced ECG route blocks base subscribers until add-on entitlement is active", () => {
  const baseOnly = resolveAdvancedEcgAccessDecision({
    moduleEnabled: true,
    moduleStatus: "published",
    adminPreview: false,
    userId: "user_123",
    tier: "RN",
    hasBaseAccess: true,
    hasAdvancedEcgEntitlement: false,
  });
  assert.equal(baseOnly.ok, false);
  if (!baseOnly.ok) {
    assert.equal(baseOnly.reason, "advanced_ecg_upgrade_required");
    assert.equal(baseOnly.hasBaseAccess, true);
    assert.equal(baseOnly.hasAdvancedEcgEntitlement, false);
  }

  const entitled = resolveAdvancedEcgAccessDecision({
    moduleEnabled: true,
    moduleStatus: "published",
    adminPreview: false,
    userId: "user_123",
    tier: "RN",
    hasBaseAccess: true,
    hasAdvancedEcgEntitlement: true,
  });
  assert.equal(entitled.ok, true);
});

test("Advanced ECG route stays blocked for RPN/PN by default", () => {
  const decision = resolveAdvancedEcgAccessDecision({
    moduleEnabled: true,
    moduleStatus: "published",
    adminPreview: false,
    userId: "user_123",
    tier: "RPN",
    hasBaseAccess: true,
    hasAdvancedEcgEntitlement: true,
  });
  assert.equal(decision.ok, false);
  if (!decision.ok) {
    assert.equal(decision.reason, "tier_not_eligible");
  }
});

test("Advanced ECG entitlement remains sufficient even without an active base learner subscription", () => {
  const decision = resolveAdvancedEcgAccessDecision({
    moduleEnabled: true,
    moduleStatus: "published",
    adminPreview: false,
    userId: "user_123",
    tier: "RN",
    hasBaseAccess: false,
    hasAdvancedEcgEntitlement: true,
  });
  assert.equal(decision.ok, true);
});

test("Advanced ECG entitlement rows require module plan codes", () => {
  const now = new Date("2026-05-11T00:00:00.000Z").getTime();
  assert.equal(
    hasActiveAdvancedEcgEntitlementFromRows([
      {
        status: SubscriptionStatus.ACTIVE,
        planCode: "us_rn_monthly",
        currentPeriodEnd: new Date("2026-06-11T00:00:00.000Z"),
        trialEnd: null,
        updatedAt: new Date("2026-05-11T00:00:00.000Z"),
      },
    ], now),
    false,
  );
  assert.equal(
    hasActiveAdvancedEcgEntitlementFromRows([
      {
        status: SubscriptionStatus.ACTIVE,
        planCode: "module_advanced_ecg_lifetime",
        currentPeriodEnd: new Date("2026-06-11T00:00:00.000Z"),
        trialEnd: null,
        updatedAt: new Date("2026-05-11T00:00:00.000Z"),
      },
    ], now),
    true,
  );
});
