import "server-only";

import { PracticeTestStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { loadPremiumDashboardSnapshot, type PremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import { loadUnifiedTopicPerformance, type TopicPerformanceSnapshot } from "@/lib/learner/topic-performance";
import type { PracticeTestConfigJson, PracticeTestResultsJson } from "@/lib/practice-tests/types";

export type CatReadinessSignal = {
  completedCount: number;
  avgAccuracyPct: number | null;
  lastCompletedAt: Date | null;
};

export type ReadinessPagePayload = {
  snapshot: PremiumDashboardSnapshot;
  topicPerf: TopicPerformanceSnapshot | null;
  catSignal: CatReadinessSignal | null;
};

function parseCatAccuracy(res: PracticeTestResultsJson | null): number | null {
  if (!res) return null;
  if (typeof res.accuracyPct === "number" && Number.isFinite(res.accuracyPct)) {
    return Math.round(res.accuracyPct);
  }
  if (res.scoreTotal > 0) {
    return Math.round((res.scoreCorrect / res.scoreTotal) * 100);
  }
  return null;
}

async function loadCatSignal(userId: string): Promise<CatReadinessSignal | null> {
  try {
    const rows = await prisma.practiceTest.findMany({
      where: { userId, status: PracticeTestStatus.COMPLETED, completedAt: { not: null } },
      orderBy: [{ completedAt: "desc" }, { createdAt: "desc" }],
      take: 12,
      select: { config: true, results: true, completedAt: true },
    });
    const catRows = rows.filter((r) => {
      const cfg = r.config as PracticeTestConfigJson | null;
      return cfg?.selectionMode === "cat";
    });
    if (catRows.length === 0) return null;
    const pcts: number[] = [];
    for (const r of catRows) {
      const pct = parseCatAccuracy(r.results as PracticeTestResultsJson | null);
      if (pct != null) pcts.push(pct);
    }
    return {
      completedCount: catRows.length,
      avgAccuracyPct: pcts.length > 0 ? Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length) : null,
      lastCompletedAt: catRows[0]!.completedAt,
    };
  } catch {
    return null;
  }
}

/**
 * Server bundle for the Account Readiness page: premium snapshot (includes `computeReadiness` output),
 * unified topic performance for weak-area links, and optional CAT practice-test signal (informational).
 */
export async function loadReadinessPagePayload(userId: string, entitlement: AccessScope): Promise<ReadinessPagePayload | null> {
  if (!userId || !entitlement.hasAccess || !isDatabaseUrlConfigured()) return null;

  const [snapshot, topicPerf, catSignal] = await Promise.all([
    loadPremiumDashboardSnapshot(userId, entitlement),
    loadUnifiedTopicPerformance(userId, entitlement, 12).catch(() => null),
    loadCatSignal(userId),
  ]);

  if (!snapshot) return null;
  return { snapshot, topicPerf, catSignal };
}
