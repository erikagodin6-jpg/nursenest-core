import "server-only";

import { PracticeTestStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { buildLearnerStudySnapshot } from "@/lib/learner/build-learner-study-snapshot";
import {
  buildReviewSequence,
  pickAnchor,
  toPublicWeakSummaries,
  type PersonalizedWeakAreaStudyPlanDebug,
  type PersonalizedWeakAreaStudyPlanPublic,
} from "@/lib/learner/personalized-weak-area-study-plan-surface";
import { loadMissedQuestionSignals } from "@/lib/learner/study-question-signals";
import { recommendNextActions } from "@/lib/learner/recommend-next-actions";
import type { TopicPerformanceSnapshot } from "@/lib/learner/topic-performance";
import { loadUnifiedTopicPerformance } from "@/lib/learner/topic-performance";

export type {
  PersonalizedStudyPlanStep,
  PersonalizedWeakAreaStudyPlanDebug,
  PersonalizedWeakAreaStudyPlanPublic,
  WeakAreaPublicBand,
  WeakAreaPublicSummary,
} from "@/lib/learner/personalized-weak-area-study-plan-surface";

export { buildReviewSequence, toPublicWeakSummaries } from "@/lib/learner/personalized-weak-area-study-plan-surface";

const MAX_STALE_IN_PROGRESS = 6;
const STALE_MS = 36 * 3600 * 1000;

function questionIdsLen(raw: unknown): number {
  if (!Array.isArray(raw)) return 0;
  return raw.filter((x): x is string => typeof x === "string" && x.length > 4).length;
}

async function loadStaleInProgressPractice(userId: string): Promise<boolean> {
  const cutoff = new Date(Date.now() - STALE_MS);
  const rows = await prisma.practiceTest.findMany({
    where: {
      userId,
      status: PracticeTestStatus.IN_PROGRESS,
      updatedAt: { lt: cutoff },
    },
    orderBy: { updatedAt: "desc" },
    take: MAX_STALE_IN_PROGRESS,
    select: { cursorIndex: true, questionIds: true },
  });
  for (const r of rows) {
    const total = questionIdsLen(r.questionIds);
    const n = typeof r.cursorIndex === "number" ? r.cursorIndex : 0;
    if (total > 0 && n > 0 && n < total) return true;
  }
  return false;
}

/**
 * Personalized weak-area plan for learners: qualitative summaries + concrete next steps.
 * Tier safety: uses {@link loadUnifiedTopicPerformance} + {@link buildLearnerStudySnapshot} (entitlement-scoped pools).
 */
export async function buildPersonalizedWeakAreaStudyPlan(args: {
  userId: string;
  entitlement: AccessScope;
  learnerPath: string | null;
  /** When set, avoids a second topic performance load (e.g. study-plan page). */
  topicPerformance?: TopicPerformanceSnapshot | null;
}): Promise<PersonalizedWeakAreaStudyPlanPublic | null> {
  const { userId, entitlement, learnerPath } = args;
  if (!userId || !entitlement.hasAccess || !isDatabaseUrlConfigured()) return null;

  const perf = args.topicPerformance ?? (await loadUnifiedTopicPerformance(userId, entitlement, 10));
  const snapshot = await buildLearnerStudySnapshot(userId, entitlement, learnerPath, {
    topicPerformance: perf,
  });
  if (!snapshot) return null;

  const recs = recommendNextActions(snapshot, { maxTotal: 6 });

  const missed = await loadMissedQuestionSignals(userId);
  let repeatIncorrect = false;
  for (const s of missed.values()) {
    if (s.missCount >= 2) {
      repeatIncorrect = true;
      break;
    }
  }

  const staleInProgress = await loadStaleInProgressPractice(userId);

  const weakestAreas = toPublicWeakSummaries(perf.weakTopics, 4);

  return {
    pathwayId: learnerPath?.trim() || null,
    weakestAreas,
    reviewSequence: buildReviewSequence(recs),
    anchors: {
      lesson: pickAnchor(recs, (r) => r.type === "weak_topic_lesson"),
      flashcards: pickAnchor(recs, (r) => r.type === "weak_topic_flashcards"),
      questions: pickAnchor(recs, (r) => r.type === "weak_topic_qbank"),
      practiceWeak:
        pickAnchor(recs, (r) => r.type === "missed_review_session") ??
        pickAnchor(recs, (r) => r.type === "retest_topic"),
    },
    signals: {
      hasRepeatIncorrects: repeatIncorrect,
      hasStaleInProgressPractice: staleInProgress,
      perQuestionTimingAvailable: false,
    },
    sessionIntegrationNote:
      "Question and CAT picks stay inside your exam access tier. Practice builds sessions with weak or missed modes that respect your pathway, then shuffle and down-rank very recent items so review stays focused without feeling repetitive.",
  };
}

export async function buildPersonalizedWeakAreaStudyPlanDebug(args: {
  userId: string;
  entitlement: AccessScope;
  learnerPath: string | null;
  topicPerformance?: TopicPerformanceSnapshot | null;
}): Promise<PersonalizedWeakAreaStudyPlanDebug | null> {
  const base = await buildPersonalizedWeakAreaStudyPlan(args);
  if (!base) return null;
  const perf = args.topicPerformance ?? (await loadUnifiedTopicPerformance(args.userId, args.entitlement, 12));
  const snapshot = await buildLearnerStudySnapshot(args.userId, args.entitlement, args.learnerPath, {
    topicPerformance: perf,
  });
  const recs = snapshot ? recommendNextActions(snapshot, { maxTotal: 6 }) : [];
  const rawWeakTopics = perf.weakTopics.map((w) => ({
    topic: w.topic,
    normalizedTopic: w.normalizedTopic,
    strength: w.strength,
    weakPriorityScore: w.weakPriorityScore,
    sourceConfidence: w.sourceConfidence,
    topicSource: w.topicSource,
    wrongStreak: w.wrongStreak,
    missRate: w.missRate,
    attempted: w.attempted,
  }));
  return {
    ...base,
    topicPerformanceSource: perf.source,
    rawWeakTopics,
    topRecommendationTypes: recs.map((r) => r.type),
  };
}
