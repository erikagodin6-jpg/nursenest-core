import { PracticeTestStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { loadLearnerDashboard, loadPathwayStudySummaries, type RecentMock } from "@/lib/learner/load-learner-dashboard";
import type { ReadinessResult } from "@/lib/learner/readiness-score";

export type PathwayProgressRow = {
  pathwayId: string;
  label: string;
  shortLabel: string;
  lessonsCompleted: number;
  lessonsTotal: number;
  /** 0–100 */
  pct: number;
};

export type PracticePerformanceSummary = {
  gradedCorrect: number;
  gradedTotal: number;
  sessionCount: number;
  accuracyPct: number | null;
};

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDaysYmd(day: string, delta: number): string {
  const [y, m, dd] = day.split("-").map(Number);
  const dt = new Date(Date.UTC(y!, m! - 1, dd!));
  dt.setUTCDate(dt.getUTCDate() + delta);
  return dt.toISOString().slice(0, 10);
}

/**
 * Consecutive calendar days (UTC) with any study signal, anchored to today or yesterday.
 */
export async function loadStudyStreakDays(userId: string, lookbackDays = 90): Promise<number> {
  if (!userId || !isDatabaseUrlConfigured()) return 0;
  const since = new Date(Date.now() - lookbackDays * 86400000);
  try {
    const [attempts, progressRows, practiceDone] = await Promise.all([
      prisma.examAttempt.findMany({
        where: { userId, createdAt: { gte: since } },
        select: { createdAt: true },
      }),
      prisma.progress.findMany({
        where: { userId, updatedAt: { gte: since } },
        select: { updatedAt: true },
      }),
      prisma.practiceTest.findMany({
        where: { userId, status: PracticeTestStatus.COMPLETED, completedAt: { not: null, gte: since } },
        select: { completedAt: true },
      }),
    ]);

    const dates = new Set<string>();
    for (const a of attempts) dates.add(ymd(a.createdAt));
    for (const p of progressRows) dates.add(ymd(p.updatedAt));
    for (const p of practiceDone) {
      if (p.completedAt) dates.add(ymd(p.completedAt));
    }

    const today = ymd(new Date());
    let cursor = dates.has(today) ? today : addDaysYmd(today, -1);
    if (!dates.has(cursor)) return 0;

    let streak = 0;
    while (dates.has(cursor)) {
      streak += 1;
      cursor = addDaysYmd(cursor, -1);
    }
    return streak;
  } catch {
    return 0;
  }
}

function topStrongTopicFromLedger(userId: string): Promise<string | null> {
  return prisma.userTopicStat
    .findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      select: { topic: true, correctCount: true, wrongCount: true },
      take: 120,
    })
    .then((rows) => {
      let best: { topic: string; acc: number; n: number } | null = null;
      for (const s of rows) {
        const n = s.correctCount + s.wrongCount;
        if (n < 5) continue;
        const acc = s.correctCount / n;
        if (acc < 0.72) continue;
        if (!best || acc > best.acc || (acc === best.acc && n > best.n)) {
          best = { topic: s.topic, acc, n };
        }
      }
      return best?.topic ?? null;
    })
    .catch(() => null);
}

function buildMomentumMessages(args: {
  recentMocks: RecentMock[];
  topStrongTopic: string | null;
  readiness: ReadinessResult;
  streakDays: number;
  lessonPct: number;
}): string[] {
  const out: string[] = [];

  if (args.streakDays >= 3) {
    out.push(
      args.streakDays >= 7
        ? `You have a ${args.streakDays}-day study streak—consistency like this compounds.`
        : `${args.streakDays} days in a row with activity. Keep the chain going.`,
    );
  }

  if (args.recentMocks.length >= 2) {
    const latest = args.recentMocks[0]!;
    const prev = args.recentMocks[1]!;
    if (latest.pct > prev.pct) {
      out.push(`You improved on your latest mock (${latest.pct}% vs ${prev.pct}% on the prior attempt).`);
    }
  }

  if (args.topStrongTopic) {
    out.push(`You’re building real strength in ${args.topStrongTopic}—balance it with one weak-topic set per session.`);
  }

  if (args.lessonPct >= 40 && args.lessonPct < 85) {
    out.push(`You’re past the early stretch of your lesson plan (${args.lessonPct}% complete)—momentum matters now.`);
  }

  if (args.readiness.band === "near_ready") {
    out.push("You’re close to exam-ready on our blended readiness view—tighten weak topics and run one more full mock.");
  } else if (args.readiness.band === "ready") {
    out.push("Signals look strong—stay exam-sharp with spaced mocks, sleep, and light review.");
  } else if (args.readiness.band === "improving") {
    out.push("Trajectory is positive—add one more scored block this week to solidify gains.");
  }

  return [...new Set(out)].slice(0, 4);
}

function examReadyHeadline(readiness: ReadinessResult): string | null {
  if (readiness.band === "near_ready") {
    return "You’re close to exam-ready";
  }
  if (readiness.band === "ready") {
    return "You’re in strong exam shape";
  }
  if (readiness.band === "improving" && readiness.score != null && readiness.score >= 55) {
    return "You’re gaining ground toward exam readiness";
  }
  return null;
}

function milestoneLines(args: {
  pathways: PathwayProgressRow[];
  lessonPct: number;
  practice: PracticePerformanceSummary;
  streakDays: number;
  mockCount: number;
}): string[] {
  const lines: string[] = [];

  if (args.lessonPct >= 25 && args.lessonPct < 100) {
    lines.push(`${args.lessonPct}% of your lesson pool complete`);
  } else if (args.lessonPct >= 100) {
    lines.push("Lesson pool complete for your plan—rotate mocks and weak-topic drills.");
  }

  const bestPath = [...args.pathways].sort((a, b) => b.pct - a.pct)[0];
  if (bestPath && bestPath.lessonsTotal > 0) {
    if (bestPath.pct >= 50 && bestPath.pct < 100) {
      lines.push(`Halfway through ${bestPath.shortLabel} pathway lessons`);
    } else if (bestPath.pct >= 100) {
      lines.push(`${bestPath.shortLabel} pathway lessons complete`);
    } else if (bestPath.pct >= 25) {
      lines.push(`${bestPath.pct}% through ${bestPath.shortLabel} pathway`);
    }
  }

  if (args.practice.gradedTotal >= 25) {
    lines.push(`${args.practice.gradedTotal} scored items in recent sessions`);
  }

  if (args.streakDays >= 5) {
    lines.push(`${args.streakDays}-day activity streak`);
  }

  if (args.mockCount >= 3) {
    lines.push(`${args.mockCount} mock exams logged—use trends, not single scores`);
  }

  return lines.slice(0, 5);
}

export type PremiumDashboardSnapshot = {
  pathways: PathwayProgressRow[];
  overallLessons: { completed: number; total: number; pct: number };
  readiness: ReadinessResult;
  practice: PracticePerformanceSummary;
  recentMocks: RecentMock[];
  studyStreakDays: number;
  momentumMessages: string[];
  examReadyHeadline: string | null;
  milestones: string[];
  mockCount: number;
};

export async function loadPremiumDashboardSnapshot(
  userId: string,
  entitlement: AccessScope,
): Promise<PremiumDashboardSnapshot | null> {
  if (!userId || !entitlement.hasAccess || !isDatabaseUrlConfigured()) return null;

  const dash = await loadLearnerDashboard(userId, entitlement);
  if (!dash) return null;

  const [pathwayRaw, streakDays, topStrongTopic] = await Promise.all([
    loadPathwayStudySummaries(userId, entitlement),
    loadStudyStreakDays(userId),
    topStrongTopicFromLedger(userId),
  ]);

  const pathways: PathwayProgressRow[] = pathwayRaw.map((p) => {
    const pct = p.lessonsTotal > 0 ? Math.round((p.lessonsCompleted / p.lessonsTotal) * 100) : 0;
    return { ...p, pct };
  });

  const lessonPct =
    dash.lessonsAvailable > 0 ? Math.round((dash.lessonsCompleted / dash.lessonsAvailable) * 100) : 0;

  const agg = dash.sessionGrading;
  const practice: PracticePerformanceSummary = {
    gradedCorrect: agg.correct,
    gradedTotal: agg.total,
    sessionCount: agg.sessionCount,
    accuracyPct: agg.total > 0 ? Math.round((agg.correct / agg.total) * 100) : null,
  };

  const momentumMessages = buildMomentumMessages({
    recentMocks: dash.recentMocks,
    topStrongTopic,
    readiness: dash.readiness,
    streakDays,
    lessonPct,
  });

  const headline = examReadyHeadline(dash.readiness);

  const mockCount = await prisma.examAttempt
    .count({ where: { userId } })
    .catch(() => dash.recentMocks.length);

  const milestones = milestoneLines({
    pathways,
    lessonPct,
    practice,
    streakDays,
    mockCount,
  });

  return {
    pathways,
    overallLessons: {
      completed: dash.lessonsCompleted,
      total: dash.lessonsAvailable,
      pct: lessonPct,
    },
    readiness: dash.readiness,
    practice,
    recentMocks: dash.recentMocks,
    studyStreakDays: streakDays,
    momentumMessages,
    examReadyHeadline: headline,
    milestones,
    mockCount,
  };
}
