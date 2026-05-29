import assert from "node:assert/strict";
import test from "node:test";
import {
  buildChargebackEvidencePackage,
  scoreRevenueProtectionReadiness,
  type RevenueProtectionEvidenceRecord,
} from "@/lib/business-protection/revenue-protection-center";

const evidence: RevenueProtectionEvidenceRecord[] = [
  { id: "terms", kind: "terms_acceptance", occurredAt: "2026-05-01T00:00:00.000Z", summary: "Accepted checkout terms", immutableHash: "abc" },
  { id: "refund", kind: "refund_acknowledgement", occurredAt: "2026-05-01T00:00:01.000Z", summary: "Acknowledged digital refund policy", immutableHash: "def" },
  { id: "checkout", kind: "checkout", occurredAt: "2026-05-01T00:00:02.000Z", summary: "Stripe checkout completed" },
  { id: "sub", kind: "subscription_lifecycle", occurredAt: "2026-05-01T00:00:03.000Z", summary: "Subscription activated" },
  { id: "login", kind: "login_history", occurredAt: "2026-05-02T00:00:00.000Z", summary: "Learner logged in" },
  { id: "duration", kind: "session_duration", occurredAt: "2026-05-02T00:30:00.000Z", summary: "30 minute study session" },
  { id: "activity", kind: "learning_activity", occurredAt: "2026-05-02T00:35:00.000Z", summary: "Completed flashcards" },
  { id: "content", kind: "content_consumption", occurredAt: "2026-05-02T00:40:00.000Z", summary: "Viewed rationales" },
];

test("revenue protection readiness scores evidence completeness", () => {
  const readiness = scoreRevenueProtectionReadiness(evidence);

  assert.equal(readiness.score, 100);
  assert.equal(readiness.riskLevel, "healthy");
  assert.equal(readiness.checklist.every((item) => item.present), true);
});

test("chargeback evidence package includes digital service acknowledgement and missing evidence", () => {
  const pkg = buildChargebackEvidencePackage(
    {
      userId: "user-1",
      email: "learner@example.com",
      planCode: "rn-premium-monthly",
      stripeCustomerId: "cus_123",
      stripeSubscriptionId: "sub_123",
      evidence: evidence.slice(0, 3),
    },
    "2026-05-29T00:00:00.000Z",
  );

  assert.equal(pkg.acceptedWording.includes("I understand this is a digital educational subscription service."), true);
  assert.equal(pkg.evidenceByKind.checkout, 1);
  assert.equal(pkg.protectionScore < 70, true);
  assert.equal(pkg.riskLevel, "critical");
  assert.equal(pkg.missingEvidence.some((item) => item.key === "learning_activity"), true);
});
