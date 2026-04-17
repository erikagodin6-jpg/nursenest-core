/**
 * Motivation Data Layer
 *
 * Server-side only. Loads all data needed for the Premium Motivation System:
 *   - Study streak + weekly activity map
 *   - Topic progress (paginated: first 8 rows)
 *   - Recent readiness trend (last 5 CAT scores)
 *   - Derived milestones (no extra queries — computed from loaded data)
 *
 * Performance protections (per spec Section 6):
 *   - Weekly activity: last 14 days only (3 small queries)
 *   - Topic progress: first 8 rows; more loaded via Server Action
 *   - Readiness trend: last 5 CAT completions
 *   - Milestones: derived purely from already-loaded data
 *   - All queries bounded, no full-history fetches
 */

import "server-only";

import { PracticeTestStatus } from "@prisma/client";
import { loadWithLearnerPrivateReadCache } from "@/lib/cache/learner-private-read-cache";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { loadStudyStreakDays } from "@/lib/learner/premium-dashboard-snapshot";
import { getReadinessBand } from "@/components/study/cat-readiness-hero";
import type { ReadinessBand } from "@/components/study/cat-readiness-hero";

// ── Shared public types ───────────────────────────────────────────────────────

export type WeeklyActivityDay = {
  /** ISO date: YYYY-MM-DD */
  date: string;
  active: boolean;
  /** "Mon" | "Tue" … | "Sun" */
  dayLabel: string;
  isToday: boolean;
};

export type TopicProgressRow = {
  id: string;
  topic: string;
  correctCount: number;
  totalAttempts: number;
  accuracyPct: number;
  wrongStreak: number;
  lastAttemptAt: string | null;
  status: "mastered" | "strong" | "improving" | "weak" | "critical";
};

export type RecentReadinessPoint = {
  id: string;
  score: number;
  completedAt: string;
  band: ReadinessBand;
  sessionLabel: string;
};

export type MotivationMilestone = {
  id: string;
  label: string;
  achieved: boolean;
};

export type MotivationPayload = {
  streakDays: number;
  /** Days since last study activity: 0 = today, 1 = yesterday, null = no history */
  lastActiveDaysAgo: number | null;
  weeklyActivity: WeeklyActivityDay[];
  topicRows: TopicProgressRow[];
  topicTotal: number;
  hasMoreTopics: boolean;
  recentReadiness: RecentReadinessPoint[];
  milestones: MotivationMilestone[];
  overallAccuracyPct: number | null;
  totalQuestionsAnswered: number;
  mockCount: number;
};

// ── Internal helpers ──────────────────────────────────────────────────────────

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(day: string, delta: number): string {
  const [y, m, dd] = day.split("-").map(Number);
  const dt = new Date(Date.UTC(y!, m! - 1, dd!));
  dt.setUTCDate(dt.getUTCDate() + delta);
  return dt.toISOString().slice(0, 10);
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function dayLabel(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y!, m! - 1, d!));
  return DAY_LABELS[dt.getUTCDay()]!;
}

function topicStatus(accuracyPct: number, totalAttempts: number): TopicProgressRow["status"] {
  if (accuracyPct >= 90 && totalAttempts >= 10) return "mastered";
  if (accuracyPct >= 75) return "strong";
  if (accuracyPct >= 60) return "improving";
  if (accuracyPct >= 45) return "weak";
  return "critical";
}

/** Safely extract a 0–100 readiness score from a PracticeTest.results JSON blob. */
function parseReadinessScore(results: unknown): number | null {
  if (!results || typeof results !== "object") return null;
  const r = results as Record<string, unknown>;
  const raw = r.readinessScore ?? r.passOutlookPercent ?? r.score ?? null;
  if (typeof raw === "number" && raw >= 0 && raw <= 100) return Math.round(raw);
  if (typeof raw === "object" && raw !== null) {
    const s = (raw as Record<string, unknown>).score;
    if (typeof s === "number") return Math.round(s);
  }
  return null;
}

// ── Weekly activity map ───────────────────────────────────────────────────────

async function loadWeeklyActivity(userId: string): Promise<{
  days: WeeklyActivityDay[];
  lastActiveDaysAgo: number | null;
}> {
  const LOOKBACK = 14;
  const since = new Date(Date.now() - LOOKBACK * 86_400_000);

  const [attempts, practiceDone] = await Promise.all([
    prisma.examAttempt.findMany({
      where: { userId, createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      take: 60,
      select: { createdAt: true },
    }),
    prisma.practiceTest.findMany({
      where: {
        userId,
        status: PracticeTestStatus.COMPLETED,
        completedAt: { not: null, gte: since },
      },
      orderBy: { completedAt: "desc" },
      take: 12,
      select: { completedAt: true },
    }),
  ]);

  const activeDates = new Set<string>();
  for (const a of attempts) activeDates.add(ymd(a.createdAt));
  for (const p of practiceDone) {
    if (p.completedAt) activeDates.add(ymd(p.completedAt));
  }

  const today = ymd(new Date());
  const days: WeeklyActivityDay[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = addDays(today, -i);
    days.push({
      date,
      active: activeDates.has(date),
      dayLabel: dayLabel(date),
      isToday: date === today,
    });
  }

  // Find how many days ago user was last active
  let lastActiveDaysAgo: number | null = null;
  for (let i = 0; i <= LOOKBACK; i++) {
    const d = addDays(today, -i);
    if (activeDates.has(d)) {
      lastActiveDaysAgo = i;
      break;
    }
  }

  return { days, lastActiveDaysAgo };
}

// ── Topic progress rows ───────────────────────────────────────────────────────

export const TOPIC_PAGE_SIZE = 8;

function mapTopicStat(s: {
  id: string;
  topic: string;
  correctCount: number;
  wrongCount: number;
  wrongStreak: number;
  lastAttemptAt: Date | null;
}): TopicProgressRow | null {
  const total = s.correctCount + s.wrongCount;
  if (total < 3) return null; // not enough data to show
  const accuracyPct = Math.round((s.correctCount / total) * 100);
  return {
    id: s.id,
    topic: s.topic,
    correctCount: s.correctCount,
    totalAttempts: total,
    accuracyPct,
    wrongStreak: s.wrongStreak,
    lastAttemptAt: s.lastAttemptAt ? s.lastAttemptAt.toISOString() : null,
    status: topicStatus(accuracyPct, total),
  };
}

async function loadTopicProgressPage(
  userId: string,
  page: number,
): Promise<{ rows: TopicProgressRow[]; total: number }> {
  const [rawRows, total] = await Promise.all([
    prisma.userTopicStat.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      skip: page * TOPIC_PAGE_SIZE,
      take: TOPIC_PAGE_SIZE + 1, // +1 for hasMore
      select: {
        id: true,
        topic: true,
        correctCount: true,
        wrongCount: true,
        wrongStreak: true,
        lastAttemptAt: true,
      },
    }),
    prisma.userTopicStat.count({ where: { userId } }),
  ]);

  const rows = rawRows
    .slice(0, TOPIC_PAGE_SIZE)
    .map(mapTopicStat)
    .filter((r): r is TopicProgressRow => r !== null);

  return { rows, total };
}

// ── Recent readiness trend ────────────────────────────────────────────────────

async function loadRecentReadiness(userId: string, limit = 5): Promise<RecentReadinessPoint[]> {
  const recentRows = await prisma.practiceTest.findMany({
    where: { userId, status: PracticeTestStatus.COMPLETED, completedAt: { not: null } },
    orderBy: { completedAt: "desc" },
    take: 12,
    select: { id: true, results: true, completedAt: true },
  });
  const rows = recentRows.slice(0, limit);

  const points: RecentReadinessPoint[] = [];
  rows.forEach((r, i) => {
    const score = parseReadinessScore(r.results);
    if (score === null || !r.completedAt) return;
    points.push({
      id: r.id,
      score,
      completedAt: r.completedAt.toISOString(),
      band: getReadinessBand(score),
      sessionLabel: `Session ${rows.length - i}`,
    });
  });

  return points.reverse(); // oldest first (for left→right chart)
}

// ── Milestones ────────────────────────────────────────────────────────────────

function deriveMilestones(args: {
  streakDays: number;
  mockCount: number;
  overallAccuracyPct: number | null;
  topicRows: TopicProgressRow[];
  totalQuestionsAnswered: number;
}): MotivationMilestone[] {
  const milestones: MotivationMilestone[] = [
    {
      id: "first_questions",
      label: "First practice session",
      achieved: args.totalQuestionsAnswered >= 1,
    },
    {
      id: "questions_50",
      label: "50 questions answered",
      achieved: args.totalQuestionsAnswered >= 50,
    },
    {
      id: "questions_250",
      label: "250 questions answered",
      achieved: args.totalQuestionsAnswered >= 250,
    },
    {
      id: "streak_3",
      label: "3-day consistency",
      achieved: args.streakDays >= 3,
    },
    {
      id: "streak_7",
      label: "7-day streak",
      achieved: args.streakDays >= 7,
    },
    {
      id: "streak_14",
      label: "14-day streak",
      achieved: args.streakDays >= 14,
    },
    {
      id: "first_cat",
      label: "First CAT completed",
      achieved: args.mockCount >= 1,
    },
    {
      id: "cat_5",
      label: "5 CAT sessions",
      achieved: args.mockCount >= 5,
    },
    {
      id: "accuracy_65",
      label: "65%+ overall accuracy",
      achieved: (args.overallAccuracyPct ?? 0) >= 65,
    },
    {
      id: "accuracy_75",
      label: "75%+ overall accuracy",
      achieved: (args.overallAccuracyPct ?? 0) >= 75,
    },
    {
      id: "topic_mastered",
      label: "First topic mastered",
      achieved: args.topicRows.some((t) => t.status === "mastered"),
    },
  ];

  // Show achieved + next 2 unachieved (keeps the list focused)
  const achieved = milestones.filter((m) => m.achieved);
  const nextTwo = milestones.filter((m) => !m.achieved).slice(0, 2);
  return [...achieved, ...nextTwo];
}

// ── Overall accuracy from UserTopicStat ──────────────────────────────────────

async function loadOverallAccuracy(userId: string): Promise<{
  pct: number | null;
  total: number;
}> {
  const stats = await prisma.userTopicStat.findMany({
    where: { userId },
    select: { correctCount: true, wrongCount: true },
    take: 200,
  });
  let correct = 0;
  let total = 0;
  for (const s of stats) {
    correct += s.correctCount;
    total += s.correctCount + s.wrongCount;
  }
  return {
    pct: total >= 5 ? Math.round((correct / total) * 100) : null,
    total,
  };
}

// ── Main loader ───────────────────────────────────────────────────────────────

async function loadMotivationPayloadUncached(userId: string): Promise<MotivationPayload> {
  if (!isDatabaseUrlConfigured()) return buildEmptyPayload();

  const [
    streakDays,
    weeklyData,
    topicData,
    recentReadiness,
    accuracy,
    mockCount,
  ] = await Promise.all([
    loadStudyStreakDays(userId, 30).catch(() => 0),
    loadWeeklyActivity(userId).catch(() => ({ days: buildEmptyWeek(), lastActiveDaysAgo: null })),
    loadTopicProgressPage(userId, 0).catch(() => ({ rows: [] as TopicProgressRow[], total: 0 })),
    loadRecentReadiness(userId, 5).catch(() => [] as RecentReadinessPoint[]),
    loadOverallAccuracy(userId).catch(() => ({ pct: null, total: 0 })),
    prisma.practiceTest.count({ where: { userId, status: PracticeTestStatus.COMPLETED } }).catch(() => 0),
  ]);

  const milestones = deriveMilestones({
    streakDays,
    mockCount,
    overallAccuracyPct: accuracy.pct,
    topicRows: topicData.rows,
    totalQuestionsAnswered: accuracy.total,
  });

  return {
    streakDays,
    lastActiveDaysAgo: weeklyData.lastActiveDaysAgo,
    weeklyActivity: weeklyData.days,
    topicRows: topicData.rows,
    topicTotal: topicData.total,
    hasMoreTopics: topicData.total > TOPIC_PAGE_SIZE,
    recentReadiness,
    milestones,
    overallAccuracyPct: accuracy.pct,
    totalQuestionsAnswered: accuracy.total,
    mockCount,
  };
}

export async function loadMotivationPayload(userId: string): Promise<MotivationPayload> {
  return loadWithLearnerPrivateReadCache(
    {
      surface: "motivation-payload",
      userId,
      ttlSeconds: 45,
    },
    () => loadMotivationPayloadUncached(userId),
  );
}

// ── Paginator (called from Server Action) ─────────────────────────────────────

export async function loadTopicProgressPageForUser(
  userId: string,
  page: number,
): Promise<{ rows: TopicProgressRow[]; hasMore: boolean }> {
  if (!isDatabaseUrlConfigured()) return { rows: [], hasMore: false };

  const rawRows = await prisma.userTopicStat.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    skip: page * TOPIC_PAGE_SIZE,
    take: TOPIC_PAGE_SIZE + 1,
    select: {
      id: true,
      topic: true,
      correctCount: true,
      wrongCount: true,
      wrongStreak: true,
      lastAttemptAt: true,
    },
  });

  const hasMore = rawRows.length > TOPIC_PAGE_SIZE;
  const rows = rawRows
    .slice(0, TOPIC_PAGE_SIZE)
    .map(mapTopicStat)
    .filter((r): r is TopicProgressRow => r !== null);

  return { rows, hasMore };
}

// ── Empty state helpers ───────────────────────────────────────────────────────

function buildEmptyWeek(): WeeklyActivityDay[] {
  const today = new Date().toISOString().slice(0, 10);
  const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
  return Array.from({ length: 7 }, (_, i) => {
    const [y, m, d] = today.split("-").map(Number);
    const dt = new Date(Date.UTC(y!, m! - 1, d!));
    dt.setUTCDate(dt.getUTCDate() - (6 - i));
    const date = dt.toISOString().slice(0, 10);
    return {
      date,
      active: false,
      dayLabel: labels[dt.getUTCDay()]!,
      isToday: i === 6,
    };
  });
}

function buildEmptyPayload(): MotivationPayload {
  return {
    streakDays: 0,
    lastActiveDaysAgo: null,
    weeklyActivity: buildEmptyWeek(),
    topicRows: [],
    topicTotal: 0,
    hasMoreTopics: false,
    recentReadiness: [],
    milestones: [
      { id: "first_questions", label: "First practice session", achieved: false },
      { id: "streak_3", label: "3-day consistency", achieved: false },
      { id: "first_cat", label: "First CAT completed", achieved: false },
    ],
    overallAccuracyPct: null,
    totalQuestionsAnswered: 0,
    mockCount: 0,
  };
}
