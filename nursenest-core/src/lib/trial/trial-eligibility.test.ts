import assert from "node:assert/strict";
import test from "node:test";
import { assessTrialEligibility } from "./trial-eligibility";
import { disposableEmailDenylist, isDisposableEmailDomain } from "./trial-email-controls";

const base = {
  email: "learner@example.com",
  emailVerified: true,
  deviceAlreadyTrialed: false,
  trialAlreadyUsed: false,
  hasSubscriptionHistory: false,
  stripeEmailHasSubscriptionHistory: false,
  accountCreationCountForIp: 1,
  noPaymentHistory: false,
};

test("trial email controls block common disposable providers", () => {
  assert.equal(isDisposableEmailDomain("student@10minutemail.com"), true);
  assert.equal(isDisposableEmailDomain("temp-mail.org"), true);
  assert.equal(isDisposableEmailDomain("learner@gmail.com"), false);
  assert.ok(disposableEmailDenylist().includes("guerrillamail.com"));
});

test("trial eligibility requires verified email before activation", () => {
  const decision = assessTrialEligibility({ ...base, emailVerified: false });
  assert.equal(decision.eligible, false);
  assert.equal(decision.code, "email_not_verified");
  assert.ok(decision.reasons.includes("email_not_verified"));
});

test("trial eligibility denies repeat device and prior subscription signals", () => {
  assert.equal(assessTrialEligibility({ ...base, deviceAlreadyTrialed: true }).code, "device_already_trialed");
  assert.equal(assessTrialEligibility({ ...base, trialAlreadyUsed: true }).code, "trial_already_used");
  assert.equal(assessTrialEligibility({ ...base, hasSubscriptionHistory: true }).code, "has_subscription_history");
  assert.equal(assessTrialEligibility({ ...base, stripeEmailHasSubscriptionHistory: true }).code, "stripe_email_subscription_history");
});

test("trial eligibility treats clustered network activity as a weighted risk signal", () => {
  const medium = assessTrialEligibility({ ...base, accountCreationCountForIp: 4, noPaymentHistory: true });
  assert.equal(medium.eligible, true);
  assert.equal(medium.riskLevel, "medium");
  assert.ok(medium.reasons.includes("ip_account_cluster_medium"));

  const high = assessTrialEligibility({
    ...base,
    email: "learner@temp-mail.org",
    accountCreationCountForIp: 8,
    noPaymentHistory: true,
  });
  assert.equal(high.eligible, false);
  assert.equal(high.code, "disposable_email_domain");
  assert.equal(high.riskLevel, "high");
});
