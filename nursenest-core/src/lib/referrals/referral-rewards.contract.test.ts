import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

function read(path: string): string {
  return readFileSync(join(process.cwd(), path), "utf8");
}

test("referral rewards require qualification gates before rewards can be granted", () => {
  const source = read("src/lib/referrals/referral-rewards.ts");
  assert.match(source, /emailVerifiedAt/);
  assert.match(source, /onboardingCompletedAt/);
  assert.match(source, /firstActivityAt/);
  assert.match(source, /grantReferralRewardsForTrigger\(updated\.referrerUserId, "QUALIFIED_REFERRAL_COUNT"/);
  assert.doesNotMatch(source, /grantReferralRewardsForTrigger\([^)]*"ACCOUNT_CREATED"/);
});

test("signup, email verification, onboarding, activity, and subscription flows update referral status", () => {
  assert.match(read("src/app/api/signup/route.ts"), /recordReferralSignup/);
  assert.match(read("src/app/api/auth/verify-email/route.ts"), /markReferralEmailVerified/);
  assert.match(read("src/app/api/onboarding/complete/route.ts"), /markReferralOnboardingCompleted/);
  assert.match(read("src/lib/observability/user-activity-audit-trail.ts"), /markReferralFirstActivity/);
  assert.match(read("src/lib/stripe/apply-stripe-webhook-event.ts"), /markReferralSubscribed/);
});

test("referral management is surfaced to learners and admins", () => {
  assert.match(read("src/app/(app)/app/(learner)/account/social/page.tsx"), /ReferralDashboardCard/);
  assert.match(read("src/app/(admin)/admin/referrals/page.tsx"), /Referral Management/);
  assert.match(read("src/app/(admin)/admin/page.tsx"), /\/admin\/referrals/);
});

test("referral schema tracks attribution, rewards, fraud signals, and event audit", () => {
  const schema = read("prisma/schema.prisma");
  for (const model of ["ReferralCode", "ReferralAttribution", "ReferralRewardRule", "ReferralRewardGrant", "ReferralFraudSignal", "ReferralEvent"]) {
    assert.match(schema, new RegExp(`model ${model}`));
  }
  assert.match(schema, /ReferralQualificationStatus/);
  assert.match(schema, /SELF_REFERRAL/);
  assert.match(schema, /DUPLICATE_NORMALIZED_EMAIL/);
  assert.match(schema, /SHARED_SIGNUP_IP/);
});
