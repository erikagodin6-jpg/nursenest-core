import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import {
  getReliabilityCounters,
  type ReliabilitySurface,
  type ReliabilityTier,
} from "@/lib/server/content-cache";
import { getRecoveryMetrics as getInProcessRecoveryMetrics } from "@/lib/study-content-failover/self-healing-flashcard-session-cache";

export const dynamic = "force-dynamic";

type SurfaceMetrics = {
  daily: Record<string, Record<ReliabilityTier, number>>;
  totals: Record<ReliabilityTier, number>;
  primarySuccessRate: number;
  cacheRecoveryRate: number;
  snapshotRecoveryRate: number;
  failureRate: number;
};

function aggregateDailyMetrics(
  daily: Record<string, Record<ReliabilityTier, number>>,
  daysBack: number,
): SurfaceMetrics {
  const now = new Date();
  const totals: Record<ReliabilityTier, number> = {
    tier_a: 0, tier_b: 0, tier_c: 0, tier_d_error: 0,
  };
  let dayCount = 0;
  for (let i = 0; i < daysBack; i++) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    const dateKey = d.toISOString().slice(0, 10);
    const dayData = daily[dateKey];
    if (!dayData) continue;
    dayCount++;
    totals.tier_a += dayData.tier_a ?? 0;
    totals.tier_b += dayData.tier_b ?? 0;
    totals.tier_c += dayData.tier_c ?? 0;
    totals.tier_d_error += dayData.tier_d_error ?? 0;
  }
  const totalRequests = totals.tier_a + totals.tier_b + totals.tier_c + totals.tier_d_error;
  return {
    daily,
    totals,
    primarySuccessRate: totalRequests > 0 ? (totals.tier_b / totalRequests) * 100 : 0,
    cacheRecoveryRate: totalRequests > 0 ? (totals.tier_a / totalRequests) * 100 : 0,
    snapshotRecoveryRate: totalRequests > 0 ? (totals.tier_c / totalRequests) * 100 : 0,
    failureRate: totalRequests > 0 ? (totals.tier_d_error / totalRequests) * 100 : 0,
  };
}

export async function GET() {
  await requireAdmin();

  const daysBack = 7;

  const [flashcardDaily, practiceDaily, lessonDaily] = await Promise.all([
    getReliabilityCounters("flashcard", daysBack),
    getReliabilityCounters("practice", daysBack),
    getReliabilityCounters("lesson", daysBack),
  ]);

  const flashcard = aggregateDailyMetrics(flashcardDaily, daysBack);
  const practice = aggregateDailyMetrics(practiceDaily, daysBack);
  const lesson = aggregateDailyMetrics(lessonDaily, daysBack);

  const inProcessCounters = getInProcessRecoveryMetrics();

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    windowDays: daysBack,
    surfaces: { flashcard, practice, lesson },
    inProcessCounters,
    meta: {
      description: "Redis INCR reliability counters per surface per tier, aggregated over the last 7 days.",
      tiers: {
        tier_a: "Session persistence cache hit (served without DB round-trip)",
        tier_b: "Live generation success",
        tier_c: "Snapshot/catalog fallback served",
        tier_d_error: "All tiers exhausted — error returned to client",
      },
    },
  });
}
