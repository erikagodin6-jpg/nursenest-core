import assert from "node:assert/strict";
import test from "node:test";
import {
  buildChargebackEvidencePackage,
  buildChargebackEvidenceTextPackage,
  type RevenueProtectionSubscriberSnapshot,
} from "@/lib/business-protection/revenue-protection-center";
import { CHECKOUT_POLICY_ACCEPTANCE_WORDING } from "@/lib/business-protection/policy-wording";

const baseSnapshot: RevenueProtectionSubscriberSnapshot = {
  userId: "user_123",
  email: "learner@example.com",
  name: "Learner Example",
  country: "US",
  planCode: "us_rn_monthly",
  stripeCustomerId: "cus_test",
  stripeSubscriptionId: "sub_test",
  subscriptionStatus: "ACTIVE",
  createdAt: "2026-05-01T00:00:00.000Z",
  renewalDate: "2026-06-01T00:00:00.000Z",
  totalPaidCents: null,
  evidence: [
    { id: "terms", kind: "terms_acceptance", occurredAt: "2026-05-01T00:00:00.000Z", summary: "Terms accepted." },
    { id: "refund", kind: "refund_acknowledgement", occurredAt: "2026-05-01T00:00:00.000Z", summary: "Refund acknowledged." },
    { id: "checkout", kind: "checkout", occurredAt: "2026-05-01T00:00:00.000Z", summary: "Checkout created." },
    { id: "sub", kind: "subscription_lifecycle", occurredAt: "2026-05-01T00:00:00.000Z", summary: "Subscription active." },
    { id: "login", kind: "login_history", occurredAt: "2026-05-02T00:00:00.000Z", summary: "Login recorded." },
    { id: "session", kind: "session_duration", occurredAt: "2026-05-02T00:30:00.000Z", summary: "Study session recorded." },
    { id: "activity", kind: "learning_activity", occurredAt: "2026-05-02T00:35:00.000Z", summary: "Questions completed." },
    { id: "content", kind: "content_consumption", occurredAt: "2026-05-02T00:40:00.000Z", summary: "Lesson opened." },
  ],
};

test("checkout acknowledgement wording includes exact digital educational service acknowledgement", () => {
  assert.equal(
    CHECKOUT_POLICY_ACCEPTANCE_WORDING.includes("I understand this is a digital educational service."),
    true,
  );
});

test("chargeback evidence package scores complete evidence as healthy", () => {
  const pkg = buildChargebackEvidencePackage(baseSnapshot, "2026-05-30T00:00:00.000Z");

  assert.equal(pkg.protectionScore, 100);
  assert.equal(pkg.riskLevel, "healthy");
  assert.equal(pkg.missingEvidence.length, 0);
  assert.equal(pkg.evidenceByKind.refund_acknowledgement, 1);
  assert.equal(pkg.evidenceByKind.learning_activity, 1);
});

test("chargeback evidence package identifies missing refund and learning proof", () => {
  const pkg = buildChargebackEvidencePackage(
    {
      ...baseSnapshot,
      evidence: baseSnapshot.evidence.filter(
        (row) => row.kind !== "refund_acknowledgement" && row.kind !== "learning_activity",
      ),
    },
    "2026-05-30T00:00:00.000Z",
  );

  assert.equal(pkg.protectionScore < 100, true);
  assert.equal(pkg.missingEvidence.some((item) => item.key === "refund_acknowledgement"), true);
  assert.equal(pkg.missingEvidence.some((item) => item.key === "learning_activity"), true);
});

test("text package is export-ready and includes evidence counts", () => {
  const pkg = buildChargebackEvidencePackage(baseSnapshot, "2026-05-30T00:00:00.000Z");
  const text = buildChargebackEvidenceTextPackage(pkg);

  assert.match(text, /NurseNest Revenue Protection Evidence Package/);
  assert.match(text, /Protection score: 100\/100/);
  assert.match(text, /refund_acknowledgement: 1/);
  assert.match(text, /I understand this is a digital educational service\./);
});
