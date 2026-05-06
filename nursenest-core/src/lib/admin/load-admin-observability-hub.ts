/**
 * Bounded observability payload for `/admin/observability` — aggregates only (no per-user PII).
 * Each query is isolated; failures become nulls where noted.
 */
import "server-only";
import {
  ContentStatus,
  CountryCode,
  PracticeTestStatus,
  SubscriptionStatus,
  TrialStatus,
  UserRole,
} from "@prisma/client";
import { prisma } from "@/lib/db";
import { subscriptionWhereRealUserMetrics, userWhereRealMetrics } from "@/lib/admin/admin-metrics-exclude-demo-users";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { isRuntimeSafeMode } from "@/lib/runtime/safe-mode";
import { LAB_VALUES_MODULES } from "@/lib/lab-values/lab-values-module";
import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-product-registry";
import { DB_PUBLISHED } from "@/lib/entitlements/content-access-scope";

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 86400000);
}

export type AdminObservabilityHub = {
  generatedAt: string;
  studySystemsLast7d: {
    examAttempts: number | null;
    examSessions: number | null;
    catLikeAdaptiveSessions: number | null;
    flashcardStudySessions: number | null;
    practiceTestsCompleted: number | null;
    ecgPracticeAttempts: number | null;
  };
  flashcardHealth: {
    publishedDecksWithCardCountUnder3: number | null;
    publishedOrphanCards: number | null;
    publishedCardsMissingTopicCode: number | null;
  };
  subscriptions: {
    active: number | null;
    grace: number | null;
    pastDue: number | null;
    trialActiveLearners: number | null;
    learnersTotal: number | null;
  };
  pathwayReadiness: {
    usPathwaysSampled: number;
    ready: number;
    partial: number;
    notReady: number;
  };
  alliedAndLab: {
    publishedPathwayLessonsWithAlliedKey: number | null;
    labPreviewModuleCount: number;
    labAdminHref: string;
    alliedAdminHref: string;
  };
  contentSignals: {
    pathwayLessonsPublished: number | null;
    pathwayLessonsWeakSeo: number | null;
    questionsPublishedMissingRationale: number | null;
  };
  deepTools: {
    lessonQuestionLinkCoverageApi: string;
    flashcardSummaryApi: string;
    operationsDashboardApi: string;
    userAnalytics: string;
    subscriptionAnalytics: string;
    studyPerformance: string;
  };
};

export async function loadAdminObservabilityHub(): Promise<AdminObservabilityHub | null> {
  if (!isDatabaseUrlConfigured() || isRuntimeSafeMode()) return null;
  const generatedAt = new Date().toISOString();
  const weekAgo = daysAgo(7);

  try {
    const [
      examAttempts,
      examSessions,
      catLike,
      fcSessions,
      ptDone,
      ecg,
      fcLowDecks,
      fcOrphans,
      fcMissingTopic,
      subActive,
      subGrace,
      subPast,
      trialActive,
      learners,
      plPub,
      plWeakSeo,
      qNoRat,
      alliedLessons,
    ] = await Promise.all([
      prisma.examAttempt.count({
        where: { createdAt: { gte: weekAgo }, user: userWhereRealMetrics() },
      }),
      prisma.examSession.count({
        where: { updatedAt: { gte: weekAgo }, user: userWhereRealMetrics() },
      }),
      prisma.$queryRaw<[{ n: bigint }]>`
        SELECT COUNT(*)::bigint AS n FROM "ExamSession" es
        INNER JOIN "User" u ON u.id = es."userId"
        WHERE es."updatedAt" >= ${weekAgo}
          AND es."adaptive_state" IS NOT NULL
          AND u."is_demo_user" = false
      `.then((r) => Number(r[0]?.n ?? 0)),
      prisma.flashcardStudySession.count({
        where: { updatedAt: { gte: weekAgo }, user: userWhereRealMetrics() },
      }),
      prisma.practiceTest.count({
        where: {
          status: PracticeTestStatus.COMPLETED,
          completedAt: { gte: weekAgo },
          user: userWhereRealMetrics(),
        },
      }),
      prisma.ecgVideoQuestionPracticeAnswerAttempt.count({
        where: { createdAt: { gte: weekAgo }, user: userWhereRealMetrics() },
      }),
      prisma.flashcardDeck.count({
        where: { status: ContentStatus.PUBLISHED, cardCount: { lt: 3 } },
      }),
      prisma.flashcard.count({
        where: { deckId: null, status: ContentStatus.PUBLISHED },
      }),
      prisma.flashcard.count({
        where: { status: ContentStatus.PUBLISHED, category: { topicCode: null } },
      }),
      prisma.subscription.count({
        where: subscriptionWhereRealUserMetrics({ status: SubscriptionStatus.ACTIVE }),
      }),
      prisma.subscription.count({
        where: subscriptionWhereRealUserMetrics({ status: SubscriptionStatus.GRACE }),
      }),
      prisma.subscription.count({
        where: subscriptionWhereRealUserMetrics({ status: SubscriptionStatus.PAST_DUE }),
      }),
      prisma.user.count({
        where: userWhereRealMetrics({ role: UserRole.LEARNER, trialStatus: TrialStatus.ACTIVE }),
      }),
      prisma.user.count({ where: userWhereRealMetrics({ role: UserRole.LEARNER }) }),
      prisma.pathwayLesson.count({ where: { status: ContentStatus.PUBLISHED } }),
      prisma.pathwayLesson.count({
        where: {
          status: ContentStatus.PUBLISHED,
          OR: [{ seoTitle: "" }, { seoDescription: "" }],
        },
      }),
      prisma.examQuestion.count({
        where: { status: DB_PUBLISHED, rationale: null },
      }),
      prisma.pathwayLesson.count({
        where: { status: ContentStatus.PUBLISHED, alliedProfessionKey: { not: null } },
      }),
    ]);

    const pathwayLessonCounts = await prisma.pathwayLesson.groupBy({
      by: ["pathwayId"],
      where: { status: ContentStatus.PUBLISHED },
      _count: { _all: true },
    });
    const pubByPathway = new Map(pathwayLessonCounts.map((r) => [r.pathwayId, r._count._all]));

    const usSample = EXAM_PATHWAYS.filter((p) => p.countryCode === CountryCode.US).slice(0, 12);
    let ready = 0;
    let partial = 0;
    let notReady = 0;
    for (const p of usSample) {
      const lessonsPublished = pubByPathway.get(p.id) ?? 0;
      const r: "ready" | "partial" | "not_ready" =
        lessonsPublished >= 10 ? "ready" : lessonsPublished > 0 ? "partial" : "not_ready";
      if (r === "ready") ready += 1;
      else if (r === "partial") partial += 1;
      else notReady += 1;
    }

    return {
      generatedAt,
      studySystemsLast7d: {
        examAttempts,
        examSessions,
        catLikeAdaptiveSessions: catLike,
        flashcardStudySessions: fcSessions,
        practiceTestsCompleted: ptDone,
        ecgPracticeAttempts: ecg,
      },
      flashcardHealth: {
        publishedDecksWithCardCountUnder3: fcLowDecks,
        publishedOrphanCards: fcOrphans,
        publishedCardsMissingTopicCode: fcMissingTopic,
      },
      subscriptions: {
        active: subActive,
        grace: subGrace,
        pastDue: subPast,
        trialActiveLearners: trialActive,
        learnersTotal: learners,
      },
      pathwayReadiness: {
        usPathwaysSampled: usSample.length,
        ready,
        partial,
        notReady,
      },
      alliedAndLab: {
        publishedPathwayLessonsWithAlliedKey: alliedLessons,
        labPreviewModuleCount: LAB_VALUES_MODULES.length,
        labAdminHref: "/admin/modules/lab-values",
        alliedAdminHref: "/admin/modules/allied",
      },
      contentSignals: {
        pathwayLessonsPublished: plPub,
        pathwayLessonsWeakSeo: plWeakSeo,
        questionsPublishedMissingRationale: qNoRat,
      },
      deepTools: {
        lessonQuestionLinkCoverageApi: "/api/admin/lesson-question-link-coverage",
        flashcardSummaryApi: "/api/admin/flashcards/summary",
        operationsDashboardApi: "/api/admin/operations-dashboard",
        userAnalytics: "/admin/analytics/users",
        subscriptionAnalytics: "/admin/analytics/subscriptions",
        studyPerformance: "/admin/analytics/study-performance",
      },
    };
  } catch (e) {
    console.error("[loadAdminObservabilityHub]", e);
    return null;
  }
}
