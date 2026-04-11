import "server-only";

import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import type { TodayGoalProgress } from "@/lib/learner/load-today-goal-progress";

/**
 * Engagement notification trigger engine.
 *
 * Computes a prioritised list of in-app nudges from the learner's current state.
 * Does NOT persist notifications — computes them on the fly from existing data
 * (study activity, streak, exam date, weak topics, flashcard due counts).
 *
 * Design: supportive, not stressful. Calm tone. Max 4 nudges returned.
 */

// ── Types ────────────────────────────────────────────────────────────────────

export type EngagementNudgeKind =
  | "inactive_24h"
  | "inactive_48h"
  | "streak_protect"
  | "streak_milestone"
  | "weak_area_review"
  | "improvement"
  | "near_exam"
  | "flashcard_due"
  | "continue_plan"
  | "first_session";

export type EngagementNudge = {
  kind: EngagementNudgeKind;
  /** 1 = most urgent, higher = less urgent */
  priority: number;
  headline: string;
  body: string;
  /** Suggested action link */
  href: string;
  /** Short CTA label */
  ctaLabel: string;
  /** Semantic tone for styling */
  tone: "info" | "success" | "warning" | "encourage";
};

// ── Nudge builders ───────────────────────────────────────────────────────────

function buildInactiveNudge(hoursSinceActivity: number): EngagementNudge | null {
  if (hoursSinceActivity >= 48) {
    return {
      kind: "inactive_48h",
      priority: 1,
      headline: "You're falling behind",
      body: "Continue your study plan today — even 5 minutes keeps you on track.",
      href: "/app",
      ctaLabel: "Continue Studying",
      tone: "warning",
    };
  }
  if (hoursSinceActivity >= 24) {
    return {
      kind: "inactive_24h",
      priority: 3,
      headline: "You haven't studied today",
      body: "Pick up where you left off to keep your momentum going.",
      href: "/app",
      ctaLabel: "Resume Study",
      tone: "info",
    };
  }
  return null;
}

function buildStreakNudges(
  streakDays: number,
  todayGoal: TodayGoalProgress | null,
): EngagementNudge[] {
  const nudges: EngagementNudge[] = [];

  if (streakDays > 0 && todayGoal && todayGoal.credits === 0) {
    nudges.push({
      kind: "streak_protect",
      priority: 2,
      headline: `Protect your ${streakDays}-day streak`,
      body: "Complete one study activity today to keep your streak alive.",
      href: "/app/questions",
      ctaLabel: "Quick Practice",
      tone: "warning",
    });
  }

  const milestones = [3, 7, 14, 21, 30, 60, 90];
  if (milestones.includes(streakDays)) {
    nudges.push({
      kind: "streak_milestone",
      priority: 6,
      headline: `${streakDays}-day streak!`,
      body: "You're building a strong study habit. Keep it going.",
      href: "/app",
      ctaLabel: "View Dashboard",
      tone: "success",
    });
  }

  return nudges;
}

function buildWeakAreaNudge(weakTopic: string | null): EngagementNudge | null {
  if (!weakTopic) return null;
  return {
    kind: "weak_area_review",
    priority: 4,
    headline: "Review this topic before you forget it",
    body: `You've been struggling with ${weakTopic}. A short practice session can help.`,
    href: "/app/questions",
    ctaLabel: "Practice Now",
    tone: "info",
  };
}

function buildImprovementNudge(
  improvingTopic: string | null,
): EngagementNudge | null {
  if (!improvingTopic) return null;
  return {
    kind: "improvement",
    priority: 7,
    headline: "You're improving — keep going",
    body: `Your accuracy in ${improvingTopic} is trending up. A few more sessions will lock it in.`,
    href: "/app/questions",
    ctaLabel: "Keep Practicing",
    tone: "success",
  };
}

function buildNearExamNudge(
  examDate: Date | null,
): EngagementNudge | null {
  if (!examDate) return null;
  const daysUntil = Math.ceil(
    (examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  if (daysUntil > 14 || daysUntil < 0) return null;

  return {
    kind: "near_exam",
    priority: 1,
    headline: `${daysUntil} day${daysUntil === 1 ? "" : "s"} until your exam`,
    body: "Focus on your weakest areas and take a practice exam to check your readiness.",
    href: "/app/exams",
    ctaLabel: "Practice Exam",
    tone: "warning",
  };
}

function buildFlashcardDueNudge(
  dueToday: number,
  overdue: number,
): EngagementNudge | null {
  const total = dueToday + overdue;
  if (total === 0) return null;
  return {
    kind: "flashcard_due",
    priority: 5,
    headline: `${total} flashcard${total === 1 ? "" : "s"} due for review`,
    body: "Spaced repetition works best when you review on schedule.",
    href: "/app/flashcards",
    ctaLabel: "Review Cards",
    tone: "info",
  };
}

function buildContinuePlanNudge(
  continueLesson: { title: string; href: string } | null,
): EngagementNudge | null {
  if (!continueLesson) return null;
  return {
    kind: "continue_plan",
    priority: 5,
    headline: "Continue your study plan",
    body: `Pick up where you left off: ${continueLesson.title}`,
    href: continueLesson.href,
    ctaLabel: "Continue Lesson",
    tone: "encourage",
  };
}

// ── Main loader ──────────────────────────────────────────────────────────────

export interface EngagementContext {
  streakDays: number;
  todayGoal: TodayGoalProgress | null;
  weakTopicName: string | null;
  improvingTopicName: string | null;
  examDate: Date | null;
  flashcardDueToday: number;
  flashcardOverdue: number;
  continueLesson: { title: string; href: string } | null;
  hoursSinceLastActivity: number;
}

/**
 * Compute engagement nudges from pre-loaded dashboard context.
 * Returns up to `maxNudges` items sorted by priority.
 */
export function computeEngagementNudges(
  ctx: EngagementContext,
  maxNudges = 4,
): EngagementNudge[] {
  const all: EngagementNudge[] = [];

  const inactive = buildInactiveNudge(ctx.hoursSinceLastActivity);
  if (inactive) all.push(inactive);

  all.push(...buildStreakNudges(ctx.streakDays, ctx.todayGoal));

  const weak = buildWeakAreaNudge(ctx.weakTopicName);
  if (weak) all.push(weak);

  const improvement = buildImprovementNudge(ctx.improvingTopicName);
  if (improvement) all.push(improvement);

  const exam = buildNearExamNudge(ctx.examDate);
  if (exam) all.push(exam);

  const flashcard = buildFlashcardDueNudge(
    ctx.flashcardDueToday,
    ctx.flashcardOverdue,
  );
  if (flashcard) all.push(flashcard);

  const cont = buildContinuePlanNudge(ctx.continueLesson);
  if (cont) all.push(cont);

  all.sort((a, b) => a.priority - b.priority);
  return all.slice(0, maxNudges);
}

/**
 * Compute hours since the user's last study activity.
 * Uses the same signals as the streak engine.
 */
export async function loadHoursSinceLastActivity(
  userId: string,
): Promise<number> {
  if (!userId || !isDatabaseUrlConfigured()) return 0;

  const since = new Date(Date.now() - 90 * 86400000);

  try {
    const [latestAttempt, latestProgress, latestPractice] = await Promise.all([
      prisma.examAttempt.findFirst({
        where: { userId, createdAt: { gte: since } },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      }),
      prisma.progress.findFirst({
        where: { userId, updatedAt: { gte: since } },
        orderBy: { updatedAt: "desc" },
        select: { updatedAt: true },
      }),
      prisma.practiceTest.findFirst({
        where: { userId, completedAt: { not: null, gte: since } },
        orderBy: { completedAt: "desc" },
        select: { completedAt: true },
      }),
    ]);

    const timestamps = [
      latestAttempt?.createdAt,
      latestProgress?.updatedAt,
      latestPractice?.completedAt,
    ].filter(Boolean) as Date[];

    if (timestamps.length === 0) return 999;

    const latest = Math.max(...timestamps.map((d) => d.getTime()));
    return Math.round((Date.now() - latest) / (1000 * 60 * 60));
  } catch {
    return 0;
  }
}
