import { createHash } from "node:crypto";
import { CHECKOUT_POLICY_ACCEPTANCE_WORDING } from "@/lib/business-protection/policy-wording";

export type RevenueProtectionRiskLevel = "healthy" | "watch" | "at_risk" | "critical";

export type RevenueProtectionEvidenceKind =
  | "terms_acceptance"
  | "refund_acknowledgement"
  | "checkout"
  | "subscription_lifecycle"
  | "login_history"
  | "session_duration"
  | "learning_activity"
  | "content_consumption";

export type RevenueProtectionEvidenceRecord = {
  id: string;
  kind: RevenueProtectionEvidenceKind;
  occurredAt: string;
  summary: string;
  immutableHash?: string | null;
  source?: string | null;
  metadata?: Record<string, unknown>;
};

export type RevenueProtectionSubscriberSnapshot = {
  userId: string;
  email?: string | null;
  name?: string | null;
  country?: string | null;
  planCode?: string | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  subscriptionStatus?: string | null;
  createdAt?: string | null;
  renewalDate?: string | null;
  totalPaidCents?: number | null;
  evidence: RevenueProtectionEvidenceRecord[];
};

export type RevenueProtectionChecklistItem = {
  key: RevenueProtectionEvidenceKind;
  label: string;
  present: boolean;
  weight: number;
};

export type ChargebackEvidencePackage = {
  generatedAt: string;
  userId: string;
  subscriber: Omit<RevenueProtectionSubscriberSnapshot, "evidence">;
  acceptedWording: readonly string[];
  acceptedWordingSha256: string;
  evidenceCount: number;
  evidenceByKind: Record<RevenueProtectionEvidenceKind, number>;
  strongestEvidence: RevenueProtectionEvidenceRecord[];
  missingEvidence: RevenueProtectionChecklistItem[];
  protectionScore: number;
  riskLevel: RevenueProtectionRiskLevel;
};

const CHECKLIST: Array<{ key: RevenueProtectionEvidenceKind; label: string; weight: number }> = [
  { key: "terms_acceptance", label: "Terms accepted with timestamp and policy version", weight: 18 },
  { key: "refund_acknowledgement", label: "Refund / digital access acknowledgement recorded", weight: 16 },
  { key: "checkout", label: "Checkout and Stripe identifiers captured", weight: 14 },
  { key: "subscription_lifecycle", label: "Subscription lifecycle history captured", weight: 12 },
  { key: "login_history", label: "Login history available", weight: 10 },
  { key: "session_duration", label: "Session duration history available", weight: 8 },
  { key: "learning_activity", label: "Learning activity evidence available", weight: 14 },
  { key: "content_consumption", label: "Content consumption evidence available", weight: 8 },
];

function sha256(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function countByKind(evidence: RevenueProtectionEvidenceRecord[]): Record<RevenueProtectionEvidenceKind, number> {
  const counts = Object.fromEntries(CHECKLIST.map((item) => [item.key, 0])) as Record<RevenueProtectionEvidenceKind, number>;
  for (const record of evidence) counts[record.kind] += 1;
  return counts;
}

export function buildRevenueProtectionChecklist(
  evidence: RevenueProtectionEvidenceRecord[],
): RevenueProtectionChecklistItem[] {
  const counts = countByKind(evidence);
  return CHECKLIST.map((item) => ({
    ...item,
    present: counts[item.key] > 0,
  }));
}

export function scoreRevenueProtectionReadiness(evidence: RevenueProtectionEvidenceRecord[]): {
  score: number;
  riskLevel: RevenueProtectionRiskLevel;
  checklist: RevenueProtectionChecklistItem[];
} {
  const checklist = buildRevenueProtectionChecklist(evidence);
  const possible = checklist.reduce((sum, item) => sum + item.weight, 0);
  const earned = checklist.reduce((sum, item) => sum + (item.present ? item.weight : 0), 0);
  const score = possible > 0 ? Math.round((earned / possible) * 100) : 0;
  const riskLevel: RevenueProtectionRiskLevel =
    score >= 85 ? "healthy" : score >= 70 ? "watch" : score >= 50 ? "at_risk" : "critical";

  return { score, riskLevel, checklist };
}

export function buildChargebackEvidencePackage(
  snapshot: RevenueProtectionSubscriberSnapshot,
  generatedAt = new Date().toISOString(),
): ChargebackEvidencePackage {
  const readiness = scoreRevenueProtectionReadiness(snapshot.evidence);
  const evidenceByKind = countByKind(snapshot.evidence);
  const strongestEvidence = [...snapshot.evidence]
    .sort((a, b) => {
      const aWeight = CHECKLIST.find((item) => item.key === a.kind)?.weight ?? 0;
      const bWeight = CHECKLIST.find((item) => item.key === b.kind)?.weight ?? 0;
      if (aWeight !== bWeight) return bWeight - aWeight;
      return b.occurredAt.localeCompare(a.occurredAt);
    })
    .slice(0, 20);
  const { evidence: _evidence, ...subscriber } = snapshot;

  return {
    generatedAt,
    userId: snapshot.userId,
    subscriber,
    acceptedWording: CHECKOUT_POLICY_ACCEPTANCE_WORDING,
    acceptedWordingSha256: sha256(CHECKOUT_POLICY_ACCEPTANCE_WORDING),
    evidenceCount: snapshot.evidence.length,
    evidenceByKind,
    strongestEvidence,
    missingEvidence: readiness.checklist.filter((item) => !item.present),
    protectionScore: readiness.score,
    riskLevel: readiness.riskLevel,
  };
}

export function buildChargebackEvidenceTextPackage(pkg: ChargebackEvidencePackage): string {
  const lines = [
    "NurseNest Revenue Protection Evidence Package",
    `Generated: ${pkg.generatedAt}`,
    `User: ${pkg.userId}`,
    `Protection score: ${pkg.protectionScore}/100 (${pkg.riskLevel})`,
    "",
    "Subscriber",
    `- Name: ${pkg.subscriber.name ?? "not recorded"}`,
    `- Email: ${pkg.subscriber.email ?? "not recorded"}`,
    `- Country: ${pkg.subscriber.country ?? "not recorded"}`,
    `- Plan: ${pkg.subscriber.planCode ?? "not recorded"}`,
    `- Subscription status: ${pkg.subscriber.subscriptionStatus ?? "not recorded"}`,
    `- Renewal date: ${pkg.subscriber.renewalDate ?? "not recorded"}`,
    "",
    "Accepted Checkout Wording",
    ...pkg.acceptedWording.map((line) => `- ${line}`),
    `- Wording SHA-256: ${pkg.acceptedWordingSha256}`,
    "",
    "Evidence Counts",
    ...Object.entries(pkg.evidenceByKind).map(([kind, count]) => `- ${kind}: ${count}`),
    "",
    "Strongest Evidence",
    ...pkg.strongestEvidence.map(
      (item) =>
        `- ${item.occurredAt} [${item.kind}] ${item.summary}${item.immutableHash ? ` · hash ${item.immutableHash}` : ""}`,
    ),
    "",
    "Missing Evidence",
    ...(pkg.missingEvidence.length > 0
      ? pkg.missingEvidence.map((item) => `- ${item.label}`)
      : ["- None"]),
  ];
  return `${lines.join("\n")}\n`;
}
