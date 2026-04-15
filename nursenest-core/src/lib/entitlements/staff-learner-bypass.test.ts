import test from "node:test";
import assert from "node:assert/strict";
import { accessScopeIsStaffLearnerEntitlementBypass, STAFF_LEARNER_ENTITLEMENT_REASON } from "./staff-learner-bypass";

test("accessScopeIsStaffLearnerEntitlementBypass: admin_override + hasAccess", () => {
  assert.equal(
    accessScopeIsStaffLearnerEntitlementBypass({
      hasAccess: true,
      reason: STAFF_LEARNER_ENTITLEMENT_REASON,
    }),
    true,
  );
  assert.equal(accessScopeIsStaffLearnerEntitlementBypass({ hasAccess: false, reason: "admin_override" }), false);
  assert.equal(accessScopeIsStaffLearnerEntitlementBypass({ hasAccess: true, reason: "active_subscription" }), false);
});
