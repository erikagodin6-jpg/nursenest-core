import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { UserRole } from "@prisma/client";
import { isLearnerAccountForEngagementEmails, shouldSkipEngagementEmailForUserRow } from "@/lib/retention/learner-engagement-email-eligibility";

describe("learner engagement eligibility", () => {
  it("blocks demo and non-learner roles", () => {
    assert.equal(isLearnerAccountForEngagementEmails({ role: UserRole.LEARNER, isDemoUser: true }), false);
    assert.equal(isLearnerAccountForEngagementEmails({ role: UserRole.SUPPORT_ADMIN, isDemoUser: false }), false);
    assert.equal(isLearnerAccountForEngagementEmails({ role: UserRole.LEARNER, isDemoUser: false }), true);
  });

  it("respects opt-out and verified-email gate", () => {
    const base = {
      role: UserRole.LEARNER,
      isDemoUser: false,
      emailEngagementOptOut: false,
      emailVerified: true,
      email: "a@b.com",
    };
    assert.equal(shouldSkipEngagementEmailForUserRow(base), null);
    assert.equal(shouldSkipEngagementEmailForUserRow({ ...base, emailEngagementOptOut: true }), "opt_out");
    assert.equal(
      shouldSkipEngagementEmailForUserRow({ ...base, emailVerified: false }, { requireVerifiedEmail: true }),
      "email_unverified",
    );
  });
});
