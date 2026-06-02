/**
 * Canonical, bounded DB reads for learner progress signals shared by admin adaptive summary,
 * `/app` adaptive wiring, and `/api/learner/adaptive-recommendations` (same userId → same store).
 * No new metrics — only aggregates already persisted on existing models.
 */
import type { PerformanceProfile } from "@/lib/cat/types";
import { emptyPerformanceProfile } from "@/lib/cat/performance-tracker";
import { extractSnapshotFromAdaptiveState } from "@/lib/cat/session-persistence";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { Prisma } from "@prisma/client";

export const SHARED_LEARNER_PROGRESS_MAX_TOPIC_STATS = 15;
export const SHARED_LEARNER_PROGRESS_MAX_ACTIVITY_SLICE = 4;
export const SHARED_LEARNER_PROGRESS_MAX_ACTIVITY_ITEMS = 12;

export type SharedLearnerActivityKind =
  | "lesson_progress"
  | "practice_test"
  | "exam_session"
  | "exam_attempt"
  | "flashcard_session";

export type SharedLearnerActivityRow = {
  kind: SharedLearnerActivityKind;
  label: string;
  at: string;
};

export type SharedLearnerTopicStatRow = {
  topic: string;
  correctCount: number;
  wrongCount: number;
  wrongStreak: number;
  lastAttemptAt: Date | null;
};

export type SharedLearnerProgressBundle = {
  topicRows: SharedLearnerTopicStatRow[];
  mergedPerformanceProfile: PerformanceProfile;
  adaptiveSnapshot: ReturnType<typeof extractSnapshotFromAdaptiveState> | null;
  recentActivity: SharedLearnerActivityRow[];
};

/** Pull aggregate performance from NP-CAT JSON without surfacing sessionAnswers to callers. */
export function extractPerformanceProfileFromAdaptiveJson(raw: unknown): PerformanceProfile | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  if (obj["_v"] !== 1) return null;
  const perf = obj["performance"];
  if (!perf || typeof perf !== "object") return null;
  return perf as PerformanceProfile;
}

function performanceAttemptScore(p: PerformanceProfile): number {
  return Object.values(p.bySystem).reduce((s, d) => s + (d.attempted ?? 0), 0);
}

/** Prefer whichever adaptive blob carries more attempted items (same rule as admin summary). */
export function mergePerformanceProfilesPreferringMoreAttempts(
  a: PerformanceProfile,
  b: PerformanceProfile,
): PerformanceProfile {
  return performanceAttemptScore(a) >= performanceAttemptScore(b) ? a : b;
}

export function mergedPerformanceFromLatestAdaptiveRows(args: {
  practiceAdaptiveState: unknown | null;
  examAdaptiveState: unknown | null;
}): PerformanceProfile {
  const perfPt = args.practiceAdaptiveState
    ? extractPerformanceProfileFromAdaptiveJson(args.practiceAdaptiveState)
    : null;
  const perfEx = args.examAdaptiveState ? extractPerformanceProfileFromAdaptiveJson(args.examAdaptiveState) : null;
  const a = perfPt ?? emptyPerformanceProfile();
  const b = perfEx ?? emptyPerformanceProfile();
  return mergePerformanceProfilesPreferringMoreAttempts(a, b);
}

/** Pure: deterministic recent-activity cards from bounded DB slices (exported for tests). */
export function buildSharedRecentActivityRows(input: {
  progActs: Array<{ lessonId: string; updatedAt: Date; completed: boolean }>;
  ptActs: Array<{ title: string | null; status: string; updatedAt: Date }>;
  exSessActs: Array<{ id: string; status: string; examMode: string; updatedAt: Date }>;
  attActs: Array<{ createdAt: Date; exam: { title: string } | null }>;
  fcActs: Array<{ updatedAt: Date; deckId: string }>;
}): SharedLearnerActivityRow[] {
  const recentActivity: SharedLearnerActivityRow[] = [];
  for (const p of input.progActs) {
    recentActivity.push({
      kind: "lesson_progress",
      label: `Lesson ${p.lessonId} ${p.completed ? "completed" : "in progress"}`,
      at: p.updatedAt.toISOString(),
    });
  }
  for (const p of input.ptActs) {
    recentActivity.push({
      kind: "practice_test",
      label: `${p.title?.trim() || "Practice test"} · ${p.status}`,
      at: p.updatedAt.toISOString(),
    });
  }
  for (const s of input.exSessActs) {
    recentActivity.push({
      kind: "exam_session",
      label: `Exam session ${s.id.slice(0, 10)}… · ${s.examMode} · ${s.status}`,
      at: s.updatedAt.toISOString(),
    });
  }
  for (const a of input.attActs) {
    recentActivity.push({
      kind: "exam_attempt",
      label: a.exam?.title ? `Exam attempt · ${a.exam.title}` : "Exam attempt",
      at: a.createdAt.toISOString(),
    });
  }
  for (const f of input.fcActs) {
    recentActivity.push({
      kind: "flashcard_session",
      label: `Flashcard session · deck ${f.deckId.slice(0, 8)}…`,
      at: f.updatedAt.toISOString(),
    });
  }
  recentActivity.sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0));
  return recentActivity.slice(0, SHARED_LEARNER_PROGRESS_MAX_ACTIVITY_ITEMS);
}

/**
 * Bounded parallel read of progress tables used for admin adaptive summary and learner adaptive
 * `progressSummary` (merged CAT/practice performance JSON only — no stems).
 */
export async function loadSharedLearnerProgressBundle(userId: string): Promise<SharedLearnerProgressBundle | null> {
  if (!isDatabaseUrlConfigured() || !userId.trim()) return null;

  try {
    const [topicRows, ptState, exState, progActs, ptActs, exSessActs, attActs, fcActs] = await Promise.all([
      prisma.userTopicStat.findMany({
        where: { userId },
        orderBy: [{ wrongStreak: "desc" }, { wrongCount: "desc" }, { lastAttemptAt: "desc" }],
        take: SHARED_LEARNER_PROGRESS_MAX_TOPIC_STATS,
        select: {
          topic: true,
          correctCount: true,
          wrongCount: true,
          wrongStreak: true,
          lastAttemptAt: true,
        },
      }),
      prisma.practiceTest.findFirst({
        where: { userId, adaptiveState: { not: Prisma.JsonNull } },
        orderBy: { updatedAt: "desc" },
        select: { adaptiveState: true },
      }),
      prisma.examSession.findFirst({
        where: { userId, adaptiveState: { not: Prisma.JsonNull } },
        orderBy: { updatedAt: "desc" },
        select: { adaptiveState: true },
      }),
      prisma.progress.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        take: SHARED_LEARNER_PROGRESS_MAX_ACTIVITY_SLICE,
        select: { lessonId: true, updatedAt: true, completed: true },
      }),
      prisma.practiceTest.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        take: SHARED_LEARNER_PROGRESS_MAX_ACTIVITY_SLICE,
        select: { title: true, status: true, updatedAt: true },
      }),
      prisma.examSession.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        take: SHARED_LEARNER_PROGRESS_MAX_ACTIVITY_SLICE,
        select: { id: true, status: true, examMode: true, updatedAt: true },
      }),
      prisma.examAttempt.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: SHARED_LEARNER_PROGRESS_MAX_ACTIVITY_SLICE,
        select: { createdAt: true, exam: { select: { title: true } } },
      }),
      prisma.flashcardStudySession.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        take: SHARED_LEARNER_PROGRESS_MAX_ACTIVITY_SLICE,
        select: { updatedAt: true, deckId: true },
      }),
    ]);

    const snapPt = ptState?.adaptiveState ? extractSnapshotFromAdaptiveState(ptState.adaptiveState) : null;
    const snapEx = exState?.adaptiveState ? extractSnapshotFromAdaptiveState(exState.adaptiveState) : null;
    const adaptiveSnapshot = snapPt ?? snapEx;

    const mergedPerformanceProfile = mergedPerformanceFromLatestAdaptiveRows({
      practiceAdaptiveState: ptState?.adaptiveState ?? null,
      examAdaptiveState: exState?.adaptiveState ?? null,
    });

    const recentActivity = buildSharedRecentActivityRows({
      progActs,
      ptActs,
      exSessActs,
      attActs,
      fcActs,
    });

    return {
      topicRows,
      mergedPerformanceProfile,
      adaptiveSnapshot,
      recentActivity,
    };
  } catch {
    return null;
  }
}
