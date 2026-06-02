import "server-only";

import { prisma } from "@/lib/db";
import { TrialStatus } from "@prisma/client";

export type RiskLevel = "low" | "medium" | "high";

export type FraudSignal = {
  key: string;
  label: string;
  weight: number;
  detail?: string;
};

export type FraudScoredUser = {
  id: string;
  email: string;
  name: string;
  firstName: string | null;
  signupIp: string | null;
  lastLoginIp: string | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  emailVerified: boolean;
  trialStatus: string;
  subscriptionCount: number;
  signals: FraudSignal[];
  score: number;
  riskLevel: RiskLevel;
  relatedAccountCount: number;
};

export type FraudDashboardSummary = {
  suspiciousToday: number;
  highRiskCount: number;
  unreviewedCount: number;
  trialBlocksToday: number;
};

const SIGNAL_WEIGHTS = {
  sharedIpSignup: 15,
  sharedDeviceFingerprint: 25,
  unverifiedEmail: 5,
  trialExhausted: 10,
  noEngagement: 8,
  rapidSignup: 20,
  disposableEmail: 12,
} as const;

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "tempmail.com", "throwaway.email",
  "yopmail.com", "sharklasers.com", "guerrillamailblock.com", "grr.la",
  "dispostable.com", "trashmail.com", "10minutemail.com", "temp-mail.org",
  "fakeinbox.com", "mailnesia.com", "maildrop.cc",
]);

function riskLevelFromScore(score: number): RiskLevel {
  if (score >= 50) return "high";
  if (score >= 25) return "medium";
  return "low";
}

function isDisposableDomain(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return domain ? DISPOSABLE_DOMAINS.has(domain) : false;
}

export async function computeFraudScores(options?: {
  limit?: number;
  minScore?: number;
}): Promise<FraudScoredUser[]> {
  const limit = options?.limit ?? 100;
  const minScore = options?.minScore ?? 10;

  const recentUsers = await prisma.user.findMany({
    where: { role: "LEARNER" },
    orderBy: { createdAt: "desc" },
    take: 500,
    select: {
      id: true,
      email: true,
      name: true,
      firstName: true,
      signupIp: true,
      lastLoginIp: true,
      lastLoginAt: true,
      createdAt: true,
      emailVerified: true,
      trialStatus: true,
      trialUsedAt: true,
      baselineAssessmentCompletedAt: true,
      onboardingCompletedAt: true,
      _count: { select: { subscriptions: true, attempts: true } },
    },
  });

  const ipCounts = new Map<string, number>();
  for (const u of recentUsers) {
    if (u.signupIp) {
      ipCounts.set(u.signupIp, (ipCounts.get(u.signupIp) ?? 0) + 1);
    }
  }

  const deviceBindings = await prisma.trialDeviceBinding.findMany({
    select: { fingerprintHash: true, userId: true },
  });
  const fpToUsers = new Map<string, Set<string>>();
  for (const b of deviceBindings) {
    const set = fpToUsers.get(b.fingerprintHash) ?? new Set();
    set.add(b.userId);
    fpToUsers.set(b.fingerprintHash, set);
  }
  const userFpShared = new Map<string, number>();
  for (const [, users] of fpToUsers) {
    if (users.size > 1) {
      for (const uid of users) {
        userFpShared.set(uid, Math.max(userFpShared.get(uid) ?? 0, users.size));
      }
    }
  }

  const scored: FraudScoredUser[] = [];

  for (const u of recentUsers) {
    const signals: FraudSignal[] = [];
    const ipCount = u.signupIp ? (ipCounts.get(u.signupIp) ?? 1) : 1;

    if (ipCount >= 3) {
      signals.push({
        key: "shared_ip",
        label: "Multiple Signups From Same IP",
        weight: SIGNAL_WEIGHTS.sharedIpSignup,
        detail: `${ipCount} accounts from ${u.signupIp?.slice(0, 20)}...`,
      });
    }

    const fpSharedCount = userFpShared.get(u.id) ?? 0;
    if (fpSharedCount > 1) {
      signals.push({
        key: "shared_device",
        label: "Shared Device Fingerprint",
        weight: SIGNAL_WEIGHTS.sharedDeviceFingerprint,
        detail: `${fpSharedCount} accounts on same device`,
      });
    }

    if (!u.emailVerified) {
      signals.push({
        key: "unverified",
        label: "Email Not Verified",
        weight: SIGNAL_WEIGHTS.unverifiedEmail,
      });
    }

    if (u.trialStatus === TrialStatus.EXHAUSTED || u.trialStatus === TrialStatus.EXPIRED) {
      const accountAge = Date.now() - u.createdAt.getTime();
      const hasEngagement = u._count.attempts > 0 || u.baselineAssessmentCompletedAt != null;
      if (!hasEngagement && accountAge < 7 * 24 * 3600_000) {
        signals.push({
          key: "no_engagement",
          label: "Short-Lived Account, No Engagement",
          weight: SIGNAL_WEIGHTS.noEngagement,
          detail: "Trial used with no study activity",
        });
      }
    }

    if (u.trialUsedAt && u.onboardingCompletedAt) {
      const gap = u.trialUsedAt.getTime() - u.onboardingCompletedAt.getTime();
      if (gap < 30_000 && gap >= 0) {
        signals.push({
          key: "rapid_trial",
          label: "Rapid Signup to Trial",
          weight: SIGNAL_WEIGHTS.rapidSignup,
          detail: `Trial started ${Math.round(gap / 1000)}s after onboarding`,
        });
      }
    }

    if (isDisposableDomain(u.email)) {
      signals.push({
        key: "disposable_email",
        label: "Disposable Email Domain",
        weight: SIGNAL_WEIGHTS.disposableEmail,
        detail: u.email.split("@")[1],
      });
    }

    const score = signals.reduce((sum, s) => sum + s.weight, 0);
    if (score >= minScore) {
      let relatedCount = 0;
      if (ipCount >= 3) relatedCount = Math.max(relatedCount, ipCount - 1);
      if (fpSharedCount > 1) relatedCount = Math.max(relatedCount, fpSharedCount - 1);

      scored.push({
        id: u.id,
        email: u.email,
        name: u.name,
        firstName: u.firstName,
        signupIp: u.signupIp,
        lastLoginIp: u.lastLoginIp,
        lastLoginAt: u.lastLoginAt,
        createdAt: u.createdAt,
        emailVerified: u.emailVerified,
        trialStatus: u.trialStatus,
        subscriptionCount: u._count.subscriptions,
        signals,
        score,
        riskLevel: riskLevelFromScore(score),
        relatedAccountCount: relatedCount,
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

export async function computeFraudSummary(): Promise<FraudDashboardSummary> {
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const [suspiciousToday, unreviewedCount, trialBlocksToday] = await Promise.all([
    prisma.user.count({
      where: {
        role: "LEARNER",
        createdAt: { gte: todayStart },
        emailVerified: false,
      },
    }),
    prisma.protectionAbuseReview.count({
      where: { dismissedAt: null },
    }),
    prisma.user.count({
      where: {
        trialStatus: { in: [TrialStatus.EXHAUSTED, TrialStatus.EXPIRED] },
        trialUsedAt: { gte: todayStart },
      },
    }),
  ]);

  const scored = await computeFraudScores({ minScore: 50 });
  const highRiskCount = scored.length;

  return { suspiciousToday, highRiskCount, unreviewedCount, trialBlocksToday };
}
