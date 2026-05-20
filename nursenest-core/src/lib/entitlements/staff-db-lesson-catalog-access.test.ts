import assert from "node:assert/strict";
import { TierCode, UserRole } from "@prisma/client";
import { describe, it } from "node:test";
import type { StaffSession } from "@/lib/auth/staff-session";
import type { AccessScope } from "@/lib/entitlements/user-access-types";
import {
  accessScopeForLessonCatalogPages,
  effectiveLessonCatalogHasAccess,
  staffDbSessionGrantsFullLessonCatalogAccess,
} from "@/lib/entitlements/staff-db-lesson-catalog-access";

const mockStaff: StaffSession = { tier: "super", userId: "u1", role: UserRole.ADMIN };

const unpaidScope: AccessScope = {
  hasAccess: false,
  reason: "no_access",
  tier: null,
  country: null,
  alliedCareer: null,
};

const paidScope: AccessScope = {
  hasAccess: true,
  reason: "active_subscription",
  tier: TierCode.NCLEX_RN,
  country: "US",
  alliedCareer: null,
};

describe("staff-db-lesson-catalog-access (learner lesson gates)", () => {
  it("treats verified staff session as catalog-unlocked", () => {
    assert.equal(staffDbSessionGrantsFullLessonCatalogAccess(mockStaff), true);
    assert.equal(staffDbSessionGrantsFullLessonCatalogAccess(null), false);
    assert.equal(staffDbSessionGrantsFullLessonCatalogAccess(undefined), false);
  });

  it("grants access for unpaid learner when DB staff session exists", () => {
    assert.equal(effectiveLessonCatalogHasAccess(unpaidScope, mockStaff), true);
  });

  it("grants access for staff even when entitlement resolution failed", () => {
    assert.equal(effectiveLessonCatalogHasAccess("error", mockStaff), true);
  });

  it("denies access for unpaid non-staff", () => {
    assert.equal(effectiveLessonCatalogHasAccess(unpaidScope, null), false);
  });

  it("denies access on entitlement error for signed-in learner without staff", () => {
    assert.equal(effectiveLessonCatalogHasAccess("error", null), false);
  });

  it("allows paid subscriber without staff", () => {
    assert.equal(effectiveLessonCatalogHasAccess(paidScope, null), true);
  });
});

describe("accessScopeForLessonCatalogPages", () => {
  it("maps error + staff to admin_override scope", () => {
    const s = accessScopeForLessonCatalogPages("error", mockStaff);
    assert.notEqual(s, "error");
    assert.ok(s !== "error");
    assert.equal(s.hasAccess, true);
    assert.equal(s.reason, "admin_override");
  });

  it("keeps error for non-staff", () => {
    assert.equal(accessScopeForLessonCatalogPages("error", null), "error");
  });

  it("upgrades unpaid scope for staff", () => {
    const s = accessScopeForLessonCatalogPages(unpaidScope, mockStaff);
    assert.ok(s !== "error");
    assert.equal(s.hasAccess, true);
    assert.equal(s.reason, "admin_override");
  });

  it("passes through paid scope unchanged", () => {
    const s = accessScopeForLessonCatalogPages(paidScope, null);
    assert.deepEqual(s, paidScope);
  });
});
