import "server-only";

import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { computeLearnerHealthScore } from "./learner-health-score";

// ── Risk levels ──────────────────────────────────────────────────────────────
export type RiskLevel = "critical" | "high" | "medium" | "low";

export type RetentionRiskProfile = {
  userId: string;
  email: string;
  name: string;
  tier: string;
  riskLevel: RiskLevel;
  riskScore: number; // 0–100 (higher = more at-risk)
  healthScore: number; // 0–100 (lower = more at-risk)
  daysSinceLastActivity: number | null;
  signals: RetentionRiskSignal[];
  subscriptionEndsAt: string | null;
  daysUntilExpiry: number | null;
  recommendedAction: string;
};

export type RetentionRiskSignal = {
  code: string;
  label: string;
  severity: "critical" | "high" | "medium" | "low";
  detail: string;
};

// ── Load all at-risk subscribers ─────────────────────────────────────────────

export type RetentionRiskSummary = {
  critical: number;
  high: number;
  medium: number;
  low: number;
  total: number;
  profiles: RetentionRiskProfile[];
  generatedAt: string;
};

export async function loadRetentionRiskDashboard(opts?: {
  minRiskLevel?: RiskLevel;
  limit?: number;
}): Promise<RetentionRiskSummary> {
  if (!isDatabaseUrlConfigured()) {
    return { critical: 0, high: 0, medium: 0, low: 0, total: 0, profiles: [], generatedAt: new Date().toISOString() };
  }

  const now = new Date();
  const limit = opts?.limit ?? 200;

  // Fetch active subscribers with recent context
  const subscribers = await prisma.user.findMany({
    where: {
      subscriptions: {
        some: { status: { in: ["ACTIVE", "GRACE"] } },
      },
    },
    select: {
      id: true,
      email: true,
      name: true,
      tier: true,
      subscriptions: {
        where: { status: { in: ["ACTIVE", "GRACE"] } },
        select: { currentPeriodEnd: true, status: true, cancelAtPeriodEnd: true },
        orderBy: { updatedAt: "desc" },
        take: 1,
      },
      learnerActivityEvents: {
        select: { createdAt: true, activityType: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    take: limit,
  });

  const profiles: RetentionRiskProfile[] = [];

  for (const user of subscribers) {
    const latestEvent = user.learnerActivityEvents[0];
    const latestSub = user.subscriptions[0];

    const daysSinceLastActivity = latestEvent
      ? Math.floor((now.getTime() - latestEvent.createdAt.getTime()) / 86_400_000)
      : null;

    const subscriptionEndsAt = latestSub?.currentPeriodEnd?.toISOString() ?? null;
    const daysUntilExpiry = latestSub?.currentPeriodEnd
      ? Math.ceil((latestSub.currentPeriodEnd.getTime() - now.getTime()) / 86_400_000)
      : null;

    const signals: RetentionRiskSignal[] = [];

    // Signal: inactive 14+ days
    if (daysSinceLastActivity === null) {
      signals.push({
        code: "never_active",
        label: "Never active",
        severity: "critical",
        detail: "No study activity recorded at all.",
      });
    } else if (daysSinceLastActivity >= 14) {
      signals.push({
        code: "inactive_14d",
        label: "14-day inactivity",
        severity: "critical",
        detail: `Last activity ${daysSinceLastActivity} days ago.`,
      });
    } else if (daysSinceLastActivity >= 7) {
      signals.push({
        code: "inactive_7d",
        label: "7-day inactivity",
        severity: "high",
        detail: `Last activity ${daysSinceLastActivity} days ago.`,
      });
    }

    // Signal: expiry within 7 days
    if (daysUntilExpiry !== null && daysUntilExpiry <= 7 && daysUntilExpiry >= 0) {
      signals.push({
        code: "expiry_soon",
        label: "Expiring soon",
        severity: daysUntilExpiry <= 3 ? "critical" : "high",
        detail: `Subscription expires in ${daysUntilExpiry} day${daysUntilExpiry === 1 ? "" : "s"}.`,
      });
    }

    // Signal: cancel_at_period_end
    if (latestSub?.cancelAtPeriodEnd) {
      signals.push({
        code: "cancel_at_period_end",
        label: "Cancellation scheduled",
        severity: "critical",
        detail: "Subscription set to cancel at period end — user has already cancelled.",
      });
    }

    // Signal: grace period
    if (latestSub?.status === "GRACE") {
      signals.push({
        code: "grace_period",
        label: "Grace period",
        severity: "high",
        detail: "Subscription in grace — payment may have failed.",
      });
    }

    // Signal: high friction events
    const frictionCount = await prisma.userFrictionEvent.count({
      where: {
        userId: user.id,
        createdAt: { gte: new Date(now.getTime() - 7 * 86_400_000) },
        weight: { gte: 7 },
      },
    });
    if (frictionCount >= 3) {
      signals.push({
        code: "high_friction",
        label: "High frustration signals",
        severity: "medium",
        detail: `${frictionCount} high-weight friction events in the past 7 days.`,
      });
    }

    // Health score
    const health = await computeLearnerHealthScore(user.id);
    const healthScore = health?.score ?? 0;
    if (healthScore < 40) {
      signals.push({
        code: "low_health_score",
        label: "Low engagement score",
        severity: healthScore < 20 ? "high" : "medium",
        detail: `Learner health score: ${healthScore}/100.`,
      });
    }

    // ── Compute risk score ───────────────────────────────────────────────────
    let riskScore = 0;
    for (const s of signals) {
      riskScore += s.severity === "critical" ? 35 : s.severity === "high" ? 20 : s.severity === "medium" ? 10 : 5;
    }
    // Invert health score contribution (low health → more at-risk)
    riskScore += Math.round(((100 - healthScore) / 100) * 20);
    riskScore = Math.min(100, riskScore);

    const riskLevel: RiskLevel =
      riskScore >= 70 ? "critical" :
      riskScore >= 45 ? "high" :
      riskScore >= 25 ? "medium" : "low";

    const recommendedAction =
      signals.some((s) => s.code === "cancel_at_period_end") ? "Reach out — subscription already cancelled" :
      signals.some((s) => s.code === "never_active") ? "Onboarding check-in — user never started" :
      signals.some((s) => s.code === "inactive_14d") ? "Re-engagement outreach" :
      signals.some((s) => s.code === "expiry_soon") ? "Renewal reminder campaign" :
      signals.some((s) => s.code === "grace_period") ? "Payment recovery — billing support" :
      signals.some((s) => s.code === "high_friction") ? "Support check-in — UX issues detected" :
      "Monitor — low engagement score";

    profiles.push({
      userId: user.id,
      email: user.email ?? "",
      name: user.name ?? "",
      tier: user.tier ?? "",
      riskLevel,
      riskScore,
      healthScore,
      daysSinceLastActivity,
      signals,
      subscriptionEndsAt,
      daysUntilExpiry,
      recommendedAction,
    });
  }

  // Sort by risk score descending
  profiles.sort((a, b) => b.riskScore - a.riskScore);

  const minLevel = opts?.minRiskLevel ?? "low";
  const levelRank: Record<RiskLevel, number> = { critical: 4, high: 3, medium: 2, low: 1 };
  const filtered = profiles.filter((p) => levelRank[p.riskLevel] >= levelRank[minLevel]);

  return {
    critical: profiles.filter((p) => p.riskLevel === "critical").length,
    high: profiles.filter((p) => p.riskLevel === "high").length,
    medium: profiles.filter((p) => p.riskLevel === "medium").length,
    low: profiles.filter((p) => p.riskLevel === "low").length,
    total: profiles.length,
    profiles: filtered,
    generatedAt: now.toISOString(),
  };
}

export function riskLevelColor(level: RiskLevel): string {
  switch (level) {
    case "critical": return "text-red-700 bg-red-50 border-red-200";
    case "high":     return "text-orange-700 bg-orange-50 border-orange-200";
    case "medium":   return "text-amber-700 bg-amber-50 border-amber-200";
    case "low":      return "text-slate-600 bg-slate-50 border-slate-200";
  }
}
