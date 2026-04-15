import test from "node:test";
import assert from "node:assert/strict";
import { UserRole } from "@prisma/client";
import {
  isLearnerEntitlementAdminOverrideRole,
  isLearnerEntitlementStaffBypassRole,
  isStaffRole,
} from "./staff-roles";

test("isStaffRole: learners are not staff", () => {
  assert.equal(isStaffRole(UserRole.LEARNER), false);
});

test("isStaffRole: all operational staff roles", () => {
  assert.equal(isStaffRole(UserRole.ADMIN), true);
  assert.equal(isStaffRole(UserRole.SUPER_ADMIN), true);
  assert.equal(isStaffRole(UserRole.CONTENT_ADMIN), true);
  assert.equal(isStaffRole(UserRole.SUPPORT_ADMIN), true);
});

test("learner entitlement staff bypass matches isStaffRole (incl. support)", () => {
  assert.equal(isLearnerEntitlementStaffBypassRole(UserRole.SUPPORT_ADMIN), true);
  assert.equal(isLearnerEntitlementAdminOverrideRole(UserRole.SUPPORT_ADMIN), true);
  assert.equal(isLearnerEntitlementStaffBypassRole(UserRole.LEARNER), false);
});
