/**
 * Guided Study Data Layer
 *
 * Server-side only. Computes a compact, actionable recommendation plan for
 * overwhelmed users by combining:
 *   - UserTopicStat (weak areas, wrongStreak)
 *   - AnalyticsSummary (readiness, accuracy, streak)
 *   - User preferences (examFocus, studyGoal, dailyStudyMinutes)
 *
 * Performance protections (per spec Section 6):
 *   - At most 10 UserTopicStat rows fetched
 *   - AnalyticsSummary has its own 4-query bounded load
 *   - No ExamAttempt.results JSON parsing (SRS scheduler is NOT called here)
 *   - All computation is in-memory after 3–4 bounded DB queries
 *   - No unbounded findMany calls
 */

import "server-only";

import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { logLearnerStudyLoadDiagnostics } from "@/lib/learner/learner-study-load-diagnostics";
import { loadAnalyticsSummary } from "@/lib/study/analytics-data";
import { getReadinessBand } from "@/components/study/cat-readiness-hero";
import type { ReadinessBand } from "@/components/study/cat-readiness-hero";

// ── Public types ─────────────────────────────────────────────────────────────

export type GuidedStepKind = "lesson" | "questions" | "review" | "retest" | "baseline";

export type GuidedStudyStep = {
  kind: GuidedStepKind;
  title: string;
  /** One-sentence explanation of why this matters now. */
  why: string;
  ctaLabel: string;
  href: string;
  urgency: "high" | "medium" | "low";
  /** Present when the step is topic-specific. */
  topic?: string;
};

export type GuidedWeakArea = {
  topic: string;
  accuracyPct: number;
  wrongStreak: number;
  totalAttempts: number;
};

export type GuidedRetestRec = {
  band: ReadinessBand | null;
  message: string;
  ctaLabel: string;
  href: string;
  urgency: "ready" | "soon" | "not_yet";
};

export type GuidedStudySignalsReliability = {
  topicStats: boolean;
  analyticsSummary: boolean;
  reviewLaterCount: boolean;
  userPreferences: boolean;
};

export type GuidedStudyPayload = {
  // ── Hero signals ────────────────────────────────────────────────────────
  readinessScore: number | null;
  readinessBand: ReadinessBand | null;
  streakDays: number;
  overallAccuracyPct: number | null;
  examFocus: string | null;
  studyGoal: string | null;
  dailyStudyMinutes: number | null;

  // ── Recommended actions ─────────────────────────────────────────────────
  /** Single highest-urgency step to do RIGHT NOW. */
  nextStep: GuidedStudyStep;
  /** Ordered stack of remaining actions (2–3 cards, does not repeat nextStep). */
  studyStack: GuidedStudyStep[];

  // ── Review later block ──────────────────────────────────────────────────
  /** Count of topics with wrongStreak ≥ 1 (proxy for review queue size). */
  reviewLaterCount: number;
  /** Top topic names with wrongStreak ≥ 1. */
  reviewLaterTopics: string[];

  // ── Retest recommendation ───────────────────────────────────────────────
  retestRec: GuidedRetestRec;

  // ── Context ─────────────────────────────────────────────────────────────
  weakAreas: GuidedWeakArea[];
  /** false if user has < 5 total question attempts — show onboarding-friendly copy. */
  hasEnoughData: boolean;
  /**
   * When any critical segment failed, UI must not treat empty counts or null readiness as “caught up” or “new user”.
   * Prefer {@link GuidedStudySignalsReliability} per dimension for partial failure.
   */
  signalsReliability: GuidedStudySignalsReliability;
  /** Both topic stats and analytics failed — recommendations cannot be trusted; show retry, not baseline empty. */
  criticalLoadFailed: boolean;
};

// ── Recommendation helpers ────────────────────────────────────────────────────

function lessonHref(topic: string): string {
  return `/app/lessons?topic=${encodeURIComponent(topic)}`;
}

function questionsHref(topic?: string): string {
  if (topic) return `/app/questions?topic=${encodeURIComponent(topic)}`;
  return "/app/questions";
}

/**
 * Derive the single "do this first" step from the available signals.
 *
 * Priority order:
 *   1. Has a major gap (accuracy < 45%) → study that lesson
 *   2. Has topics with wrongStreak ≥ 2 (repeated miss) → review queue
 *   3. Has a weaker area (accuracy < 65%) → practice targeted questions
 *   4. No data / first session → baseline questionsbank
 *   5. Strong data, no obvious gap → measure readiness via CAT
 */
function deriveNextStep(
  weakAreas: GuidedWeakArea[],
  reviewCount: number,
  readinessBand: ReadinessBand | null,
  hasEnoughData: boolean,
  criticalLoadFailed: boolean,
): GuidedStudyStep {
  if (criticalLoadFailed) {
    return {
      kind: "baseline",
      title: "We couldn’t refresh your study signals",
      why: "Your personalized plan is paused until practice data loads. This is not the same as having nothing to study.",
      ctaLabel: "Retry",
      href: "/app/guided",
      urgency: "high",
    };
  }
  if (!hasEnoughData) {
    return {
      kind: "baseline",
      title: "Start your first practice session",
      why: "A short practice run gives us the data to personalize everything you see here.",
      ctaLabel: "Practice questions",
      href: "/app/questions",
      urgency: "high",
    };
  }

  // Major gap → lesson study (highest urgency)
  const majorGap = weakAreas.find((w) => w.accuracyPct < 45);
  if (majorGap) {
    return {
      kind: "lesson",
      title: `Study: ${majorGap.topic}`,
      why: `Your accuracy in ${majorGap.topic} is only ${majorGap.accuracyPct}% — this is your largest gap right now.`,
      ctaLabel: "Open lesson",
      href: lessonHref(majorGap.topic),
      urgency: "high",
      topic: majorGap.topic,
    };
  }

  // Repeated misses on a topic → review queue
  const repeatedMiss = weakAreas.find((w) => w.wrongStreak >= 2);
  if (repeatedMiss && reviewCount > 0) {
    return {
      kind: "review",
      title: `Review ${reviewCount} topic${reviewCount > 1 ? "s" : ""} you keep missing`,
      why: `${repeatedMiss.topic} has ${repeatedMiss.wrongStreak} consecutive wrong answers — reviewing now locks in the fix.`,
      ctaLabel: "Open review queue",
      href: "/app/review",
      urgency: "high",
      topic: repeatedMiss.topic,
    };
  }

  // Moderate weakness → targeted practice
  const moderateWeak = weakAreas.find((w) => w.accuracyPct < 65);
  if (moderateWeak) {
    return {
      kind: "questions",
      title: `Practice: ${moderateWeak.topic}`,
      why: `${moderateWeak.topic} accuracy is ${moderateWeak.accuracyPct}% — focused practice will move this the most.`,
      ctaLabel: "Start practice",
      href: questionsHref(moderateWeak.topic),
      urgency: "medium",
      topic: moderateWeak.topic,
    };
  }

  // Looking strong → measure readiness
  if (readinessBand === "approaching" || readinessBand === "exam_ready") {
    return {
      kind: "retest",
      title: "Take a readiness check",
      why: "Your practice scores are solid. A CAT session confirms where you really stand.",
      ctaLabel: "Start CAT",
      href: "/app/exams",
      urgency: "low",
    };
  }

  // Default: practice
  return {
    kind: "questions",
    title: "Do a practice session",
    why: "Keep your momentum going with a focused question set.",
    ctaLabel: "Practice now",
    href: "/app/questions",
    urgency: "medium",
  };
}

/**
 * Build the ordered study action stack (2–3 items, deduped from nextStep).
 */
function buildStudyStack(
  nextStep: GuidedStudyStep,
  weakAreas: GuidedWeakArea[],
  reviewCount: number,
  readinessBand: ReadinessBand | null,
  hasEnoughData: boolean,
): GuidedStudyStep[] {
  if (!hasEnoughData) return [];

  const steps: GuidedStudyStep[] = [];

  // Slot 1: Lesson for top weak area (if not already nextStep)
  const topWeak = weakAreas[0];
  if (topWeak && nextStep.kind !== "lesson") {
    steps.push({
      kind: "lesson",
      title: `Read the ${topWeak.topic} lesson`,
      why: `Reinforce the concepts behind your ${topWeak.accuracyPct}% accuracy score in ${topWeak.topic}.`,
      ctaLabel: "Open lesson",
      href: lessonHref(topWeak.topic),
      urgency: topWeak.accuracyPct < 45 ? "high" : "medium",
      topic: topWeak.topic,
    });
  }

  // Slot 2: Questions for second weak area (or same area as a different step)
  const questionTopic = nextStep.kind !== "questions"
    ? (topWeak ?? weakAreas[1])
    : weakAreas[1];

  if (questionTopic) {
    steps.push({
      kind: "questions",
      title: `Practice 10 questions: ${questionTopic.topic}`,
      why: `Targeted repetition on ${questionTopic.topic} is the fastest way to raise your score.`,
      ctaLabel: "Start practice",
      href: questionsHref(questionTopic.topic),
      urgency: "medium",
      topic: questionTopic.topic,
    });
  } else if (nextStep.kind !== "questions") {
    steps.push({
      kind: "questions",
      title: "Do a general practice session",
      why: "Regular mixed practice builds pattern recognition across topics.",
      ctaLabel: "Practice now",
      href: "/app/questions",
      urgency: "low",
    });
  }

  // Slot 3: Review queue (if items exist and not already nextStep)
  if (reviewCount > 0 && nextStep.kind !== "review") {
    steps.push({
      kind: "review",
      title: `Review ${reviewCount} topic${reviewCount > 1 ? "s" : ""} needing attention`,
      why: "These topics have recent wrong answers — a quick review session locks in the correct patterns.",
      ctaLabel: "Open review queue",
      href: "/app/review",
      urgency: "medium",
    });
  }

  // Slot 4: CAT retest (if band is good and not already nextStep)
  if (
    nextStep.kind !== "retest" &&
    (readinessBand === "approaching" || readinessBand === "exam_ready") &&
    steps.length < 3
  ) {
    steps.push({
      kind: "retest",
      title: "Take a CAT readiness check",
      why: "Adaptive testing reveals your real exam readiness more accurately than practice alone.",
      ctaLabel: "Start CAT",
      href: "/app/exams",
      urgency: "low",
    });
  }

  return steps.slice(0, 3);
}

/**
 * Build a retest recommendation based on the current readiness band.
 */
function buildRetestRec(
  band: ReadinessBand | null,
  accuracyPct: number | null,
  hasEnoughData: boolean,
  criticalLoadFailed: boolean,
): GuidedRetestRec {
  if (criticalLoadFailed) {
    return {
      band: null,
      message: "We could not load your readiness band. Refresh to retry — this is not a recommendation to wait.",
      ctaLabel: "Refresh guided study",
      href: "/app/guided",
      urgency: "not_yet",
    };
  }
  if (!hasEnoughData || band === null) {
    return {
      band: null,
      message:
        "Complete a few practice sessions first to unlock your personalized retest recommendation.",
      ctaLabel: "Start practicing",
      href: "/app/questions",
      urgency: "not_yet",
    };
  }

  switch (band) {
    case "not_ready":
      return {
        band,
        message:
          "Focus on core content and targeted practice for at least 1 week before retesting. Build your foundation first.",
        ctaLabel: "Study lessons",
        href: "/app/lessons",
        urgency: "not_yet",
      };
    case "building":
      return {
        band,
        message:
          "You're improving. Try to reach 70%+ accuracy in your weakest areas, then take a CAT to measure true readiness.",
        ctaLabel: "Practice to 70%+",
        href: "/app/questions",
        urgency: "not_yet",
      };
    case "approaching":
      return {
        band,
        message:
          "You're close. Take a CAT session in your next study block to see your exact readiness score before scheduling.",
        ctaLabel: "Take a CAT now",
        href: "/app/exams",
        urgency: "soon",
      };
    case "exam_ready":
      return {
        band,
        message:
          "Your performance is exam-ready. Schedule your exam or take one final full-length practice to confirm.",
        ctaLabel: "Schedule or retest",
        href: "/app/exams",
        urgency: "ready",
      };
  }
}

// ── Main loader ───────────────────────────────────────────────────────────────

export async function loadGuidedStudyPayload(userId: string): Promise<GuidedStudyPayload> {
  if (!isDatabaseUrlConfigured()) {
    return buildEmptyPayload();
  }

  const t0 = performance.now();
  const reliability: GuidedStudySignalsReliability = {
    topicStats: true,
    analyticsSummary: true,
    reviewLaterCount: true,
    userPreferences: true,
  };

  // ── Bounded parallel DB loads (no catch-to-empty — failures are explicit) ─
  const [summaryResult, topicStatsResult, userResult, reviewLaterResult] = await Promise.allSettled([
    loadAnalyticsSummary(userId),
    prisma.userTopicStat.findMany({
      where: { userId, lastAttemptAt: { not: null } },
      orderBy: [{ wrongStreak: "desc" }, { wrongCount: "desc" }],
      take: 10,
      select: {
        topic: true,
        correctCount: true,
        wrongCount: true,
        wrongStreak: true,
        lastWrongAt: true,
      },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { examFocus: true, studyGoal: true, dailyStudyMinutes: true },
    }),
    prisma.userTopicStat.count({
      where: { userId, wrongStreak: { gt: 0 } },
    }),
  ]);

  const summary = summaryResult.status === "fulfilled" ? summaryResult.value : null;
  if (summaryResult.status === "rejected") {
    reliability.analyticsSummary = false;
    logLearnerStudyLoadDiagnostics({
      operation: "loadGuidedStudyPayload",
      feature_surface: "guided_study",
      duration_ms: Math.round(performance.now() - t0),
      outcome: "error",
      segment: "analytics_summary",
      user_id_prefix: userId.slice(0, 8),
      reason:
        summaryResult.reason instanceof Error
          ? summaryResult.reason.message.slice(0, 400)
          : String(summaryResult.reason).slice(0, 400),
      fallback_used: "false",
    });
  }

  const topicStats = topicStatsResult.status === "fulfilled" ? topicStatsResult.value : [];
  if (topicStatsResult.status === "rejected") {
    reliability.topicStats = false;
    logLearnerStudyLoadDiagnostics({
      operation: "loadGuidedStudyPayload",
      feature_surface: "guided_study",
      duration_ms: Math.round(performance.now() - t0),
      outcome: "error",
      segment: "user_topic_stat_top",
      user_id_prefix: userId.slice(0, 8),
      reason:
        topicStatsResult.reason instanceof Error
          ? topicStatsResult.reason.message.slice(0, 400)
          : String(topicStatsResult.reason).slice(0, 400),
      fallback_used: "false",
    });
  }

  const user = userResult.status === "fulfilled" ? userResult.value : null;
  if (userResult.status === "rejected") {
    reliability.userPreferences = false;
    logLearnerStudyLoadDiagnostics({
      operation: "loadGuidedStudyPayload",
      feature_surface: "guided_study",
      duration_ms: Math.round(performance.now() - t0),
      outcome: "degraded",
      segment: "user_preferences",
      user_id_prefix: userId.slice(0, 8),
      reason:
        userResult.reason instanceof Error
          ? userResult.reason.message.slice(0, 400)
          : String(userResult.reason).slice(0, 400),
      fallback_used: "false",
    });
  }

  let reviewLaterCount = 0;
  if (reviewLaterResult.status === "fulfilled") {
    reviewLaterCount = reviewLaterResult.value;
  } else {
    reliability.reviewLaterCount = false;
    logLearnerStudyLoadDiagnostics({
      operation: "loadGuidedStudyPayload",
      feature_surface: "guided_study",
      duration_ms: Math.round(performance.now() - t0),
      outcome: "error",
      segment: "review_later_count",
      user_id_prefix: userId.slice(0, 8),
      reason:
        reviewLaterResult.reason instanceof Error
          ? reviewLaterResult.reason.message.slice(0, 400)
          : String(reviewLaterResult.reason).slice(0, 400),
      fallback_used: "false",
    });
  }

  // ── Derive weak areas from UserTopicStat ──────────────────────────────────
  const rawAreas: GuidedWeakArea[] = topicStats
    .map((s) => {
      const total = s.correctCount + s.wrongCount;
      if (total < 3) return null;
      const accuracyPct = Math.round((s.correctCount / total) * 100);
      return { topic: s.topic, accuracyPct, wrongStreak: s.wrongStreak, totalAttempts: total };
    })
    .filter((x): x is GuidedWeakArea => x !== null)
    .sort((a, b) => {
      // Sort: highest wrongStreak first, then lowest accuracy
      if (b.wrongStreak !== a.wrongStreak) return b.wrongStreak - a.wrongStreak;
      return a.accuracyPct - b.accuracyPct;
    })
    .slice(0, 4);

  // Topics with wrongStreak > 0 (for review block labels)
  const reviewLaterTopics = topicStats
    .filter((s) => s.wrongStreak > 0)
    .map((s) => s.topic)
    .slice(0, 3);

  // ── Compute signals ───────────────────────────────────────────────────────
  const readinessScore = summary?.latestReadinessScore ?? null;
  const readinessBand =
    readinessScore !== null ? getReadinessBand(readinessScore) : null;
  const overallAccuracyPct = summary?.overallAccuracyPct ?? null;
  const streakDays = summary?.streakDays ?? 0;

  const criticalLoadFailed = !reliability.topicStats && !reliability.analyticsSummary;

  // "Enough data" only when the underlying signals actually loaded
  const hasEnoughData =
    !criticalLoadFailed &&
    ((reliability.topicStats && rawAreas.length > 0) ||
      (reliability.analyticsSummary && (summary?.totalQuestionsAnswered ?? 0) >= 5));

  // ── Build recommendation plan ─────────────────────────────────────────────
  const nextStep = deriveNextStep(rawAreas, reviewLaterCount, readinessBand, hasEnoughData, criticalLoadFailed);
  const studyStack = buildStudyStack(
    nextStep,
    rawAreas,
    reliability.reviewLaterCount ? reviewLaterCount : 0,
    readinessBand,
    hasEnoughData,
  );
  const retestRec = buildRetestRec(readinessBand, overallAccuracyPct, hasEnoughData, criticalLoadFailed);

  logLearnerStudyLoadDiagnostics({
    operation: "loadGuidedStudyPayload",
    feature_surface: "guided_study",
    duration_ms: Math.round(performance.now() - t0),
    outcome: criticalLoadFailed ? "error" : Object.values(reliability).every(Boolean) ? "ok" : "degraded",
    user_id_prefix: userId.slice(0, 8),
    final_outcome: criticalLoadFailed ? "error" : "ok",
    fallback_used: "false",
  });

  return {
    readinessScore,
    readinessBand,
    streakDays,
    overallAccuracyPct,
    examFocus: user?.examFocus ?? null,
    studyGoal: user?.studyGoal ?? null,
    dailyStudyMinutes: user?.dailyStudyMinutes ?? null,
    nextStep,
    studyStack,
    reviewLaterCount,
    reviewLaterTopics,
    retestRec,
    weakAreas: reliability.topicStats ? rawAreas : [],
    hasEnoughData,
    signalsReliability: reliability,
    criticalLoadFailed,
  };
}

// ── Empty payload (DB unavailable / new user) ─────────────────────────────────

function buildEmptyPayload(): GuidedStudyPayload {
  const deadSignals: GuidedStudySignalsReliability = {
    topicStats: false,
    analyticsSummary: false,
    reviewLaterCount: false,
    userPreferences: false,
  };
  return {
    readinessScore: null,
    readinessBand: null,
    streakDays: 0,
    overallAccuracyPct: null,
    examFocus: null,
    studyGoal: null,
    dailyStudyMinutes: null,
    nextStep: {
      kind: "baseline",
      title: "Start your first practice session",
      why: "Answer a few questions to unlock your personalized study plan.",
      ctaLabel: "Practice questions",
      href: "/app/questions",
      urgency: "high",
    },
    studyStack: [],
    reviewLaterCount: 0,
    reviewLaterTopics: [],
    retestRec: {
      band: null,
      message: "Complete a few practice sessions to unlock your retest recommendation.",
      ctaLabel: "Start practicing",
      href: "/app/questions",
      urgency: "not_yet",
    },
    weakAreas: [],
    hasEnoughData: false,
    signalsReliability: deadSignals,
    criticalLoadFailed: true,
  };
}
