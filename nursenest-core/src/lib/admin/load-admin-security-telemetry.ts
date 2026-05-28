import "server-only";

import { TrialStatus, UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { posthogProjectConfigured } from "@/lib/observability/posthog-hogql-query";
import { isRuntimeSafeMode } from "@/lib/runtime/safe-mode";
import {
  accountSharingMaxActiveDevices,
  accountSharingMaxIps24h,
  isAccountSharingEnforceEnabled,
  isAccountSharingMonitorEnabled,
  isAccountSharingSoftLimitOnly,
} from "@/lib/security/account-sharing-env";

export type AdminSecurityTelemetry = {
  configured: {
    database: boolean;
    safeMode: boolean;
    posthogQueryApi: boolean;
    posthogClientKey: boolean;
    accountSharingMonitor: boolean;
    accountSharingSoftOnly: boolean;
    accountSharingEnforce: boolean;
    maxIps24h: number;
    maxActiveDevices: number;
  };
  sessionActivity: {
    rows24h: number;
    rows7d: number;
    uniqueUsers24h: number;
    uniqueUsers7d: number;
    activeDeviceSlots7d: number;
    ipObservations24h: number;
    usersWithIpObservations24h: number;
    suspiciousRowsOpen: number;
    latestSeenAt: string | null;
  };
  verification: {
    learnerUsers: number;
    verifiedLearners: number;
    unverifiedLearners: number;
    newUnverified24h: number;
    activeTrials: number;
    expiredOrExhaustedTrials: number;
    trialDeviceBindings: number;
  };
  protection: {
    openReviews: number;
    reviews7d: number;
    resolved7d: number;
    rollupEvents7d: number;
    userDayEvents7d: number;
    topRollups7d: Array<{ metricKey: string; segment: string; count: number }>;
    recentReviews: Array<{ id: string; reason: string; score: number; createdAt: string; userIdPrefix: string }>;
  };
  diagnostics: string[];
};

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 86400000);
}

function utcDayStartDaysAgo(n: number): Date {
  const d = daysAgo(n);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function sumCounts(rows: Array<{ count: number | null }>): number {
  return rows.reduce((sum, row) => sum + (row.count ?? 0), 0);
}

export async function loadAdminSecurityTelemetry(): Promise<AdminSecurityTelemetry> {
  const database = isDatabaseUrlConfigured();
  const safeMode = isRuntimeSafeMode();
  const configured = {
    database,
    safeMode,
    posthogQueryApi: posthogProjectConfigured(),
    posthogClientKey: Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim()),
    accountSharingMonitor: isAccountSharingMonitorEnabled(),
    accountSharingSoftOnly: isAccountSharingSoftLimitOnly(),
    accountSharingEnforce: isAccountSharingEnforceEnabled(),
    maxIps24h: accountSharingMaxIps24h(),
    maxActiveDevices: accountSharingMaxActiveDevices(),
  };

  const empty: AdminSecurityTelemetry = {
    configured,
    sessionActivity: {
      rows24h: 0,
      rows7d: 0,
      uniqueUsers24h: 0,
      uniqueUsers7d: 0,
      activeDeviceSlots7d: 0,
      ipObservations24h: 0,
      usersWithIpObservations24h: 0,
      suspiciousRowsOpen: 0,
      latestSeenAt: null,
    },
    verification: {
      learnerUsers: 0,
      verifiedLearners: 0,
      unverifiedLearners: 0,
      newUnverified24h: 0,
      activeTrials: 0,
      expiredOrExhaustedTrials: 0,
      trialDeviceBindings: 0,
    },
    protection: {
      openReviews: 0,
      reviews7d: 0,
      resolved7d: 0,
      rollupEvents7d: 0,
      userDayEvents7d: 0,
      topRollups7d: [],
      recentReviews: [],
    },
    diagnostics: [],
  };

  if (!database || safeMode) {
    return {
      ...empty,
      diagnostics: [
        !database ? "DATABASE_URL is not configured, so DB-backed fraud telemetry cannot load." : "",
        safeMode ? "Runtime safe mode is enabled, so DB-backed fraud telemetry is suppressed." : "",
      ].filter(Boolean),
    };
  }

  const since24h = daysAgo(1);
  const since7d = daysAgo(7);
  const rollupSince = utcDayStartDaysAgo(6);
  const diagnostics: string[] = [];

  const safe = async <T>(label: string, fn: () => Promise<T>, fallback: T): Promise<T> => {
    try {
      return await fn();
    } catch (e) {
      diagnostics.push(`${label}: ${e instanceof Error ? e.message : String(e)}`.slice(0, 220));
      return fallback;
    }
  };

  const [
    rows24h,
    rows7d,
    uniqueUsers24h,
    uniqueUsers7d,
    activeDeviceSlots7d,
    ipObservations24h,
    usersWithIpObservations24h,
    suspiciousRowsOpen,
    latestSession,
    learnerUsers,
    verifiedLearners,
    unverifiedLearners,
    newUnverified24h,
    activeTrials,
    expiredOrExhaustedTrials,
    trialDeviceBindings,
    openReviews,
    reviews7d,
    resolved7d,
    rollupRows,
    userDayRows,
    recentReviews,
  ] = await Promise.all([
    safe("sessionRows24h", () => prisma.learnerSessionActivity.count({ where: { lastSeenAt: { gte: since24h } } }), 0),
    safe("sessionRows7d", () => prisma.learnerSessionActivity.count({ where: { lastSeenAt: { gte: since7d } } }), 0),
    safe(
      "sessionUsers24h",
      () =>
        prisma.learnerSessionActivity
          .findMany({ where: { lastSeenAt: { gte: since24h } }, distinct: ["userId"], select: { userId: true } })
          .then((r) => r.length),
      0,
    ),
    safe(
      "sessionUsers7d",
      () =>
        prisma.learnerSessionActivity
          .findMany({ where: { lastSeenAt: { gte: since7d } }, distinct: ["userId"], select: { userId: true } })
          .then((r) => r.length),
      0,
    ),
    safe(
      "activeDeviceSlots7d",
      () => prisma.learnerSessionActivity.count({ where: { lastSeenAt: { gte: since7d }, revokedAt: null } }),
      0,
    ),
    safe("ipObservations24h", () => prisma.learnerSessionIpObservation.count({ where: { lastSeenAt: { gte: since24h } } }), 0),
    safe(
      "ipObservationUsers24h",
      () =>
        prisma.learnerSessionIpObservation
          .findMany({ where: { lastSeenAt: { gte: since24h } }, distinct: ["userId"], select: { userId: true } })
          .then((r) => r.length),
      0,
    ),
    safe("suspiciousSessionRowsOpen", () => prisma.learnerSessionActivity.count({ where: { revokedAt: null, suspiciousReason: { not: null } } }), 0),
    safe("latestSession", () => prisma.learnerSessionActivity.findFirst({ orderBy: { lastSeenAt: "desc" }, select: { lastSeenAt: true } }), null),
    safe("learnerUsers", () => prisma.user.count({ where: { role: UserRole.LEARNER, isDemoUser: false } }), 0),
    safe("verifiedLearners", () => prisma.user.count({ where: { role: UserRole.LEARNER, isDemoUser: false, emailVerified: true } }), 0),
    safe("unverifiedLearners", () => prisma.user.count({ where: { role: UserRole.LEARNER, isDemoUser: false, emailVerified: false } }), 0),
    safe("newUnverified24h", () => prisma.user.count({ where: { role: UserRole.LEARNER, isDemoUser: false, emailVerified: false, createdAt: { gte: since24h } } }), 0),
    safe("activeTrials", () => prisma.user.count({ where: { role: UserRole.LEARNER, isDemoUser: false, trialStatus: TrialStatus.ACTIVE } }), 0),
    safe(
      "expiredTrials",
      () =>
        prisma.user.count({
          where: { role: UserRole.LEARNER, isDemoUser: false, trialStatus: { in: [TrialStatus.EXHAUSTED, TrialStatus.EXPIRED] } },
        }),
      0,
    ),
    safe("trialDeviceBindings", () => prisma.trialDeviceBinding.count(), 0),
    safe("openAbuseReviews", () => prisma.protectionAbuseReview.count({ where: { dismissedAt: null } }), 0),
    safe("abuseReviews7d", () => prisma.protectionAbuseReview.count({ where: { createdAt: { gte: since7d } } }), 0),
    safe("resolvedAbuseReviews7d", () => prisma.protectionAbuseReview.count({ where: { dismissedAt: { gte: since7d } } }), 0),
    safe("protectionRollups7d", () => prisma.premiumProtectionRollup.findMany({ where: { day: { gte: rollupSince } }, select: { metricKey: true, segment: true, count: true } }), []),
    safe("protectionUserDays7d", () => prisma.premiumProtectionUserDay.findMany({ where: { day: { gte: rollupSince } }, select: { count: true } }), []),
    safe(
      "recentAbuseReviews",
      () =>
        prisma.protectionAbuseReview.findMany({
          orderBy: { createdAt: "desc" },
          take: 8,
          select: { id: true, reason: true, score: true, createdAt: true, userId: true },
        }),
      [],
    ),
  ]);

  const topRollups = Array.from(
    rollupRows
      .reduce((m, row) => {
        const key = `${row.metricKey}\u0000${row.segment}`;
        const prev = m.get(key) ?? { metricKey: row.metricKey, segment: row.segment, count: 0 };
        prev.count += row.count;
        m.set(key, prev);
        return m;
      }, new Map<string, { metricKey: string; segment: string; count: number }>())
      .values(),
  )
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  if (!configured.accountSharingMonitor) {
    diagnostics.push("NN_ENABLE_ACCOUNT_SHARING_MONITOR is off; LearnerSessionActivity rows will remain empty until enabled.");
  }
  if (!configured.posthogQueryApi) {
    diagnostics.push("PostHog query API is not configured; DB-backed security telemetry is shown, but pageview/session funnels stay unavailable.");
  }
  if (rows7d === 0 && configured.accountSharingMonitor) {
    diagnostics.push("Account-sharing monitor is enabled, but no session rows were found in the last 7 days; verify subscriber entitlement paths call the session touch hook.");
  }

  return {
    configured,
    sessionActivity: {
      rows24h,
      rows7d,
      uniqueUsers24h,
      uniqueUsers7d,
      activeDeviceSlots7d,
      ipObservations24h,
      usersWithIpObservations24h,
      suspiciousRowsOpen,
      latestSeenAt: latestSession?.lastSeenAt?.toISOString() ?? null,
    },
    verification: {
      learnerUsers,
      verifiedLearners,
      unverifiedLearners,
      newUnverified24h,
      activeTrials,
      expiredOrExhaustedTrials,
      trialDeviceBindings,
    },
    protection: {
      openReviews,
      reviews7d,
      resolved7d,
      rollupEvents7d: sumCounts(rollupRows),
      userDayEvents7d: sumCounts(userDayRows),
      topRollups7d: topRollups,
      recentReviews: recentReviews.map((r) => ({
        id: r.id,
        reason: r.reason,
        score: r.score,
        createdAt: r.createdAt.toISOString(),
        userIdPrefix: r.userId.slice(0, 8),
      })),
    },
    diagnostics,
  };
}
