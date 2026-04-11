/**
 * Adaptive Engine Data Loader
 *
 * Server-side data loader for the /app/study-coach page.
 * Combines the existing coach data with the new adaptive engine layers:
 *   - Study time budget (from dailyStudyMinutes + cadence)
 *   - Multi-dimensional weak area analysis (body system, cognitive level, speed)
 *   - Probability uplift opportunities (ranked by readiness impact)
 *
 * Performance:
 *   - Reuses loadCoachPageData (already bounded)
 *   - UserTopicStat: bounded at 50 rows
 *   - PracticeTest timing: bounded at 12 recent completed sessions
 *   - No full history loads
 */

import "server-only";

import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { loadCoachPageData } from "@/lib/study/coach-page-data";
import type { CoachPageData } from "@/lib/study/coach-page-data";
import { urgencyFromDays } from "@/lib/learner/exam-timeline";
import { computeStudyTimeBudget } from "./study-time-budget";
import type { StudyTimeBudget } from "./study-time-budget";
import { computeWeakAreaDimensions } from "./weak-area-dimensions";
import type { WeakAreaDimensions } from "./weak-area-dimensions";
import { computeProbabilityUplift } from "./probability-uplift";
import type { ProbabilityUpliftResult } from "./probability-uplift";

// ── Public types ──────────────────────────────────────────────────────────────

export type AdaptiveEngineData = CoachPageData & {
  timeBudget: StudyTimeBudget;
  weakAreaDimensions: WeakAreaDimensions;
  uplift: ProbabilityUpliftResult;
  /** Cadence preference stored on user (may differ from adaptive.studyCadencePreference). */
  dailyStudyMinutes: number | null;
};

// ── Loader ────────────────────────────────────────────────────────────────────

export async function loadAdaptiveEngineData(
  userId: string,
  entitlement: AccessScope,
): Promise<AdaptiveEngineData | null> {
  if (!userId || !isDatabaseUrlConfigured() || !entitlement.hasAccess) return null;

  try {
    const [coach, topicStats, userRow, recentTests] = await Promise.all([
      loadCoachPageData(userId, entitlement),

      // Bounded: top 50 topics by wrong signal
      prisma.userTopicStat.findMany({
        where: { userId },
        orderBy: [{ wrongStreak: "desc" }, { wrongCount: "desc" }],
        take: 50,
      }),

      // Just the time budget fields
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          dailyStudyMinutes: true,
          studyCadencePreference: true,
        },
      }),

      // Speed data from recent completed practice tests (bounded at 12)
      prisma.practiceTest.findMany({
        where: { userId, status: "COMPLETED", elapsedMs: { not: null } },
        orderBy: { completedAt: "desc" },
        take: 12,
        select: { questionIds: true, elapsedMs: true, results: true, completedAt: true },
      }),
    ]);

    if (!coach) return null;

    // ── Study time budget ──────────────────────────────────────────────────
    const timeBudget = computeStudyTimeBudget({
      dailyStudyMinutes: userRow?.dailyStudyMinutes ?? null,
      studyCadencePreference: userRow?.studyCadencePreference ?? null,
      urgency: urgencyFromDays(coach.daysUntilExam),
    });

    // ── Session timing for speed analysis ─────────────────────────────────
    const sessionTimings = recentTests.map((t) => {
      const ids = Array.isArray(t.questionIds) ? t.questionIds : [];
      return { elapsedMs: t.elapsedMs, questionCount: ids.length };
    });

    // ── Session accuracy for consistency scoring ───────────────────────────
    const sessionAccuracies: number[] = recentTests
      .map((t) => {
        const r = t.results as Record<string, unknown> | null;
        if (!r) return null;
        const pct =
          typeof r.accuracyPct === "number"
            ? r.accuracyPct
            : typeof r.score === "number" && typeof r.total === "number" && r.total > 0
              ? Math.round((r.score / r.total) * 100)
              : null;
        return pct;
      })
      .filter((v): v is number => v !== null);

    // ── Weak area dimensions ───────────────────────────────────────────────
    const weakAreaDimensions = computeWeakAreaDimensions({
      topicStats,
      sessionTimings,
      sessionAccuracies,
    });

    // ── Probability uplift ─────────────────────────────────────────────────
    const uplift = computeProbabilityUplift({ topicStats, limit: 6 });

    return {
      ...coach,
      timeBudget,
      weakAreaDimensions,
      uplift,
      dailyStudyMinutes: userRow?.dailyStudyMinutes ?? null,
    };
  } catch {
    return null;
  }
}
