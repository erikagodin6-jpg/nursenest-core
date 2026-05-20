import assert from "node:assert/strict";
import { test } from "node:test";
import type { DbUserRoleRecord } from "@/lib/auth/admin-role-source";
import { UserRole } from "@prisma/client";
import { marketingPathwayLessonStaffFullBodyAccess } from "@/lib/lessons/marketing-pathway-lesson-staff-bypass";

test("marketing pathway lesson: staff roles bypass paywall for canonical body", () => {
  const contentAdmin: DbUserRoleRecord = {
    userId: "u-content",
    role: UserRole.CONTENT_ADMIN,
    isAdmin: true,
    tier: "content",
  };
  assert.equal(marketingPathwayLessonStaffFullBodyAccess(contentAdmin), true);

  const superAdmin: DbUserRoleRecord = {
    userId: "u-super",
    role: UserRole.SUPER_ADMIN,
    isAdmin: true,
    tier: "super",
  };
  assert.equal(marketingPathwayLessonStaffFullBodyAccess(superAdmin), true);
});

test("marketing pathway lesson: learners never bypass via this flag", () => {
  const learner: DbUserRoleRecord = {
    userId: "u-learner",
    role: UserRole.LEARNER,
    isAdmin: false,
    tier: null,
  };
  assert.equal(marketingPathwayLessonStaffFullBodyAccess(learner), false);
  assert.equal(marketingPathwayLessonStaffFullBodyAccess(null), false);
});
