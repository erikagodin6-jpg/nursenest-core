/**
 * Exam Plan Page — Initial Data Loader
 *
 * Combines the existing coach/adaptive data layer with a bounded weak-area
 * detail query. Designed for fast server-side rendering of the hero, summary
 * row, today's plan, and weak areas without loading historical bulk data.
 *
 * Loading strategy:
 *   - Initial (this loader): readiness, adaptive plan, forecast, exam date,
 *     weak-area details (top 5), pathway
 *   - Lazy (client actions): notes preview, progress trend, detailed benchmark
 */

import "server-only";

import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { loadCoachPageData } from "@/lib/study/coach-page-data";
import type { CoachPageData } from "@/lib/study/coach-page-data";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";

// ── Public types ──────────────────────────────────────────────────────────────

export type ExamPlanWeakArea = {
  topic: string;
  accuracyPct: number;
  wrongStreak: number;
  totalAttempts: number;
  /** Human-readable diagnostic label for the card row. */
  descriptor: "Major gap" | "Needs reinforcement" | "Inconsistent" | "Overconfident errors";
};

export type ExamPlanPageData = {
  coach: CoachPageData;
  /** Top weak areas with accuracy detail (max 5). */
  weakAreas: ExamPlanWeakArea[];
  /** User's preferred pathway (for benchmark + links). */
  pathwayId: string | null;
};

// ── Descriptor logic ──────────────────────────────────────────────────────────

function weakAreaDescriptor(
  accuracyPct: number,
  wrongStreak: number,
  totalAttempts: number,
): ExamPlanWeakArea["descriptor"] {
  if (wrongStreak >= 3) return "Major gap";
  if (totalAttempts >= 8 && accuracyPct >= 60) return "Overconfident errors";
  if (totalAttempts < 5) return "Inconsistent";
  return "Needs reinforcement";
}

// ── Bounded weak-area query ───────────────────────────────────────────────────

async function loadWeakAreaDetails(userId: string): Promise<ExamPlanWeakArea[]> {
  if (!isDatabaseUrlConfigured()) return [];
  try {
    const rows = await prisma.userTopicStat.findMany({
      where: {
        userId,
        OR: [{ wrongCount: { gt: 0 } }, { wrongStreak: { gt: 0 } }],
      },
      orderBy: [{ wrongStreak: "desc" }, { wrongCount: "desc" }],
      take: 5,
      select: { topic: true, correctCount: true, wrongCount: true, wrongStreak: true },
    });
    return rows.map((r) => {
      const total = r.correctCount + r.wrongCount;
      const accuracyPct = total > 0 ? Math.round((r.correctCount / total) * 100) : 0;
      return {
        topic: r.topic,
        accuracyPct,
        wrongStreak: r.wrongStreak,
        totalAttempts: total,
        descriptor: weakAreaDescriptor(accuracyPct, r.wrongStreak, total),
      };
    });
  } catch {
    return [];
  }
}

// ── Main loader ───────────────────────────────────────────────────────────────

/**
 * Loads all data needed for the initial server render of the Exam Plan page.
 * Three bounded DB calls in parallel:
 *   1. loadCoachPageData (readiness + adaptive + forecast + benchmark + exam date)
 *   2. loadWeakAreaDetails (top 5 weak UserTopicStat rows)
 *   3. user.targetExamPathwayId (single field from User)
 */
export async function loadExamPlanPageData(
  userId: string,
  entitlement: AccessScope,
): Promise<ExamPlanPageData | null> {
  const [coach, weakAreas, userRow] = await Promise.all([
    loadCoachPageData(userId, entitlement),
    loadWeakAreaDetails(userId),
    isDatabaseUrlConfigured()
      ? prisma.user
          .findUnique({ where: { id: userId }, select: { targetExamPathwayId: true } })
          .catch(() => null)
      : Promise.resolve(null),
  ]);

  if (!coach) return null;

  return {
    coach,
    weakAreas,
    pathwayId: userRow?.targetExamPathwayId ?? null,
  };
}
