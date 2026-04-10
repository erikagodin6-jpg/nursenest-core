/**
 * Aggregates real database metrics for /admin/analytics.
 * Does not invent page-view or funnel data — surfaces gaps explicitly.
 */
import {
  BlogPostStatus,
  ContentAutomationLogStatus,
  ContentStatus,
  JobStatus,
  PracticeTestStatus,
  SubscriptionStatus,
  UserRole,
} from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { isRuntimeSafeMode } from "@/lib/runtime/safe-mode";
import { posthogHogqlTable, posthogProjectConfigured } from "@/lib/observability/posthog-hogql-query";

export type TimeSeriesPoint = { label: string; value: number };

export type AdminAnalyticsDashboardData = {
  generatedAt: string;
  degraded: boolean;
  warnings: string[];
  /** Human-readable gaps (what we do not have in DB). */
  dataGaps: string[];
  traffic: {
    siteTrafficAvailable: false;
    siteTrafficNote: string;
    /** PostHog-sourced site traffic — populated when POSTHOG_PERSONAL_API_KEY + POSTHOG_PROJECT_ID are set. */
    posthogTraffic: {
      configured: boolean;
      windowDays: number;
      totalPageviews: number | null;
      uniqueVisitors: number | null;
      topPages: Array<{ url: string; pageviews: number; uniqueVisitors: number }>;
      dailySeries: Array<{ day: string; pageviews: number; uniqueVisitors: number }>;
      error?: string;
    } | null;
    blogPerformance: Array<{
      slug: string;
      title: string;
      impressions: number | null;
      clicks: number | null;
      ctr: number | null;
      internalClicks: number | null;
      href: string;
    }>;
    blogPerformanceNote: string;
  };
  pathwayInterest: {
    lessonsPublishedByPathway: Array<{ pathwayId: string; count: number }>;
    learnerGoalPathways: Array<{ pathwayId: string; learners: number }>;
    note: string;
  };
  lessonUsage: {
    topLessonsByProgressRows: Array<{ lessonId: string; title: string; progressRows: number }>;
    progressRowsTotal: number;
    distinctLearnersWithProgress7d: number;
    note: string;
  };
  questionUsage: {
    examAttempts7d: number;
    topExamsByAttempts7d: Array<{ examId: string; examTitle: string | null; attempts: number }>;
    topTopicsByVolume: Array<{ topic: string; totalAttempts: number }>;
    note: string;
  };
  catUsage: {
    examSessionsAdaptive7d: number;
    examSessionsLinear7d: number;
    practiceTestsAdaptiveCompleted7d: number;
    practiceTestsCompleted7d: number;
    note: string;
  };
  subscriptions: {
    active: number;
    grace: number;
    cancelled: number;
    pastDue: number;
    newSubscriptionsByDay: TimeSeriesPoint[];
    newUsersByDay: TimeSeriesPoint[];
    chartDays: number;
  };
  contentGeneration: {
    jobs7d: { completed: number; failed: number; pendingOrRunning: number };
    recentJobs: Array<{
      id: string;
      tool: string;
      status: string;
      createdAt: string;
      errorPreview: string | null;
    }>;
  };
  automation: {
    recentLogs: Array<{
      id: string;
      category: string;
      jobType: string;
      status: string;
      summary: string | null;
      createdAt: string;
      blogPostId: string | null;
    }>;
  };
  failures: {
    backgroundJobsFailed: Array<{ id: string; type: string; lastError: string | null; updatedAt: string }>;
    aiJobsWithErrors: Array<{ id: string; tool: string; errorPreview: string; createdAt: string }>;
    automationFailures: Array<{ id: string; category: string; jobType: string; errorPreview: string; createdAt: string }>;
  };
};

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 86400000);
}

export async function loadAdminAnalyticsDashboard(): Promise<AdminAnalyticsDashboardData | null> {
  if (!isDatabaseUrlConfigured() || isRuntimeSafeMode()) {
    return null;
  }

  const generatedAt = new Date().toISOString();
  const warnings: string[] = [];
  const weekAgo = daysAgo(7);
  const chartSince = daysAgo(14);

  const phConfigured = posthogProjectConfigured();
  const dataGaps = phConfigured
    ? [
        "Conversion funnels (visit → signup → checkout): see Funnels tab for PostHog-backed step counts.",
      ]
    : [
        "Site-wide traffic (sessions, landing pages, referrer) is not stored in this database — set POSTHOG_PERSONAL_API_KEY and POSTHOG_PROJECT_ID to pull live PostHog traffic data.",
        "Conversion funnels (visit → signup → checkout) require product analytics tooling unless you add server-side funnel tables.",
      ];

  const pushWarn = (e: unknown, label: string) => {
    warnings.push(`${label}: ${e instanceof Error ? e.message : String(e)}`.slice(0, 240));
  };

  // PostHog site traffic — parallel fetch when configured.
  const TRAFFIC_DAYS = 14;
  const trafficFromDay = new Date(Date.now() - TRAFFIC_DAYS * 86400000).toISOString().slice(0, 10);

  let posthogTraffic: AdminAnalyticsDashboardData["traffic"]["posthogTraffic"] = null;

  if (phConfigured) {
    try {
      const [topPagesResult, dailyResult, totalsResult] = await Promise.all([
        posthogHogqlTable(
          `SELECT properties.$current_url, count() AS pageviews, uniqExact(distinct_id) AS unique_visitors
           FROM events
           WHERE event = '$pageview'
             AND timestamp >= toDate('${trafficFromDay}')
             AND properties.$host NOT LIKE '%localhost%'
           GROUP BY properties.$current_url
           ORDER BY pageviews DESC
           LIMIT 15`,
        ),
        posthogHogqlTable(
          `SELECT toDate(timestamp) AS day, count() AS pageviews, uniqExact(distinct_id) AS unique_visitors
           FROM events
           WHERE event = '$pageview'
             AND timestamp >= toDate('${trafficFromDay}')
             AND properties.$host NOT LIKE '%localhost%'
           GROUP BY day
           ORDER BY day ASC`,
        ),
        posthogHogqlTable(
          `SELECT count() AS pageviews, uniqExact(distinct_id) AS unique_visitors
           FROM events
           WHERE event = '$pageview'
             AND timestamp >= toDate('${trafficFromDay}')
             AND properties.$host NOT LIKE '%localhost%'`,
        ),
      ]);

      const topPages = topPagesResult.ok
        ? topPagesResult.rows.map((r) => ({
            url: String(r[0] ?? ""),
            pageviews: Number(r[1] ?? 0),
            uniqueVisitors: Number(r[2] ?? 0),
          }))
        : [];

      const dailySeries = dailyResult.ok
        ? dailyResult.rows.map((r) => ({
            day: String(r[0] ?? ""),
            pageviews: Number(r[1] ?? 0),
            uniqueVisitors: Number(r[2] ?? 0),
          }))
        : [];

      const totalsRow = totalsResult.ok && totalsResult.rows[0] ? totalsResult.rows[0] : null;

      posthogTraffic = {
        configured: true,
        windowDays: TRAFFIC_DAYS,
        totalPageviews: totalsRow ? Number(totalsRow[0] ?? 0) : null,
        uniqueVisitors: totalsRow ? Number(totalsRow[1] ?? 0) : null,
        topPages,
        dailySeries,
        error: topPagesResult.error ?? dailyResult.error ?? totalsResult.error,
      };
    } catch (e) {
      posthogTraffic = {
        configured: true,
        windowDays: TRAFFIC_DAYS,
        totalPageviews: null,
        uniqueVisitors: null,
        topPages: [],
        dailySeries: [],
        error: e instanceof Error ? e.message : String(e),
      };
      pushWarn(e, "posthogTraffic");
    }
  }

  let blogPerformance: AdminAnalyticsDashboardData["traffic"]["blogPerformance"] = [];
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        postStatus: BlogPostStatus.PUBLISHED,
        OR: [{ perfImpressions: { not: null } }, { perfClicks: { not: null } }],
      },
      orderBy: [{ perfImpressions: "desc" }],
      take: 15,
      select: {
        slug: true,
        title: true,
        perfImpressions: true,
        perfClicks: true,
        perfCtr: true,
        perfInternalClicks: true,
      },
    });
    blogPerformance = posts.map((p) => ({
      slug: p.slug,
      title: p.title,
      impressions: p.perfImpressions,
      clicks: p.perfClicks,
      ctr: p.perfCtr,
      internalClicks: p.perfInternalClicks,
      href: `/blog/${encodeURIComponent(p.slug)}`,
    }));
  } catch (e) {
    pushWarn(e, "blogPerformance");
  }

  let lessonsPublishedByPathway: Array<{ pathwayId: string; count: number }> = [];
  try {
    const g = await prisma.pathwayLesson.groupBy({
      by: ["pathwayId"],
      where: { status: ContentStatus.PUBLISHED },
      _count: { _all: true },
    });
    lessonsPublishedByPathway = g
      .map((r) => ({ pathwayId: r.pathwayId, count: r._count._all }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 24);
  } catch (e) {
    pushWarn(e, "pathwayLessonsGroupBy");
  }

  let learnerGoalPathways: Array<{ pathwayId: string; learners: number }> = [];
  try {
    const gg = await prisma.user.groupBy({
      by: ["targetExamPathwayId"],
      where: { role: UserRole.LEARNER, targetExamPathwayId: { not: null } },
      _count: { _all: true },
    });
    learnerGoalPathways = gg
      .filter((r): r is typeof r & { targetExamPathwayId: string } => Boolean(r.targetExamPathwayId))
      .map((r) => ({ pathwayId: r.targetExamPathwayId, learners: r._count._all }))
      .sort((a, b) => b.learners - a.learners)
      .slice(0, 20);
  } catch (e) {
    pushWarn(e, "learnerPathwayGoals");
  }

  let topLessonsByProgressRows: AdminAnalyticsDashboardData["lessonUsage"]["topLessonsByProgressRows"] = [];
  let progressRowsTotal = 0;
  let distinctLearnersWithProgress7d = 0;
  try {
    progressRowsTotal = await prisma.progress.count();
    distinctLearnersWithProgress7d = await prisma.progress
      .findMany({
        where: { createdAt: { gte: weekAgo } },
        distinct: ["userId"],
        select: { userId: true },
      })
      .then((r) => r.length);
    const top = await prisma.$queryRaw<Array<{ lessonId: string; c: bigint }>>`
      SELECT "lessonId", COUNT(*)::bigint AS c
      FROM "Progress"
      GROUP BY "lessonId"
      ORDER BY c DESC
      LIMIT 15
    `;
    const ids = top.map((t) => t.lessonId);
    const titles =
      ids.length > 0
        ? await prisma.contentItem.findMany({
            where: { id: { in: ids }, type: "lesson" },
            select: { id: true, title: true },
          })
        : [];
    const titleById = new Map(titles.map((t) => [t.id, t.title]));
    topLessonsByProgressRows = top.map((row) => ({
      lessonId: row.lessonId,
      title: titleById.get(row.lessonId) ?? "(unknown lesson)",
      progressRows: Number(row.c),
    }));
  } catch (e) {
    pushWarn(e, "lessonUsage");
  }

  let examAttempts7d = 0;
  let topExamsByAttempts7d: AdminAnalyticsDashboardData["questionUsage"]["topExamsByAttempts7d"] = [];
  let topTopicsByVolume: Array<{ topic: string; totalAttempts: number }> = [];
  try {
    examAttempts7d = await prisma.examAttempt.count({ where: { createdAt: { gte: weekAgo } } });
    const examGroups = await prisma.examAttempt.groupBy({
      by: ["examId"],
      where: { createdAt: { gte: weekAgo } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    });
    const examIds = examGroups.map((g) => g.examId);
    const exams =
      examIds.length > 0
        ? await prisma.exam.findMany({
            where: { id: { in: examIds } },
            select: { id: true, title: true },
          })
        : [];
    const titleByExam = new Map(exams.map((e) => [e.id, e.title]));
    topExamsByAttempts7d = examGroups.map((g) => ({
      examId: g.examId,
      examTitle: titleByExam.get(g.examId) ?? null,
      attempts: g._count.id,
    }));

    const topicRows = await prisma.$queryRaw<Array<{ topic: string; n: bigint }>>`
      SELECT topic, SUM("correctCount" + "wrongCount")::bigint AS n
      FROM "UserTopicStat"
      GROUP BY topic
      ORDER BY n DESC NULLS LAST
      LIMIT 12
    `;
    topTopicsByVolume = topicRows.map((r) => ({ topic: r.topic, totalAttempts: Number(r.n) }));
  } catch (e) {
    pushWarn(e, "questionUsage");
  }

  let examSessionsAdaptive7d = 0;
  let examSessionsLinear7d = 0;
  let practiceTestsAdaptiveCompleted7d = 0;
  let practiceTestsCompleted7d = 0;
  try {
    const sess = await prisma.$queryRaw<[{ cat: bigint; total: bigint }]>`
      SELECT
        COUNT(*) FILTER (WHERE "adaptive_state" IS NOT NULL)::bigint AS cat,
        COUNT(*)::bigint AS total
      FROM "ExamSession"
      WHERE "updatedAt" >= ${weekAgo}
    `;
    const cat = Number(sess[0]?.cat ?? 0);
    const totalSess = Number(sess[0]?.total ?? 0);
    examSessionsAdaptive7d = cat;
    examSessionsLinear7d = Math.max(0, totalSess - cat);

    practiceTestsCompleted7d = await prisma.practiceTest.count({
      where: { status: PracticeTestStatus.COMPLETED, completedAt: { gte: weekAgo } },
    });
    practiceTestsAdaptiveCompleted7d = await prisma.$queryRaw<[{ n: bigint }]>`
      SELECT COUNT(*)::bigint AS n FROM "practice_tests"
      WHERE "status" = 'COMPLETED'
        AND "completedAt" >= ${weekAgo}
        AND "adaptiveState" IS NOT NULL
    `.then((r) => Number(r[0]?.n ?? 0));
  } catch (e) {
    pushWarn(e, "catUsage");
  }

  let active = 0;
  let grace = 0;
  let cancelled = 0;
  let pastDue = 0;
  let newSubscriptionsByDay: TimeSeriesPoint[] = [];
  let newUsersByDay: TimeSeriesPoint[] = [];
  try {
    [active, grace, cancelled, pastDue] = await Promise.all([
      prisma.subscription.count({ where: { status: SubscriptionStatus.ACTIVE } }),
      prisma.subscription.count({ where: { status: SubscriptionStatus.GRACE } }),
      prisma.subscription.count({ where: { status: SubscriptionStatus.CANCELLED } }),
      prisma.subscription.count({ where: { status: SubscriptionStatus.PAST_DUE } }),
    ]);
    const signupsRaw = await prisma.$queryRaw<Array<{ d: Date; c: bigint }>>`
      SELECT date_trunc('day', "createdAt") AS d, COUNT(*)::bigint AS c
      FROM "User"
      WHERE "createdAt" >= ${chartSince}
      GROUP BY 1
      ORDER BY 1 ASC
    `;
    const subsRaw = await prisma.$queryRaw<Array<{ d: Date; c: bigint }>>`
      SELECT date_trunc('day', "createdAt") AS d, COUNT(*)::bigint AS c
      FROM "Subscription"
      WHERE "createdAt" >= ${chartSince}
      GROUP BY 1
      ORDER BY 1 ASC
    `;
    newUsersByDay = signupsRaw.map((r) => ({
      label: r.d.toISOString().slice(0, 10),
      value: Number(r.c),
    }));
    newSubscriptionsByDay = subsRaw.map((r) => ({
      label: r.d.toISOString().slice(0, 10),
      value: Number(r.c),
    }));
  } catch (e) {
    pushWarn(e, "subscriptions");
  }

  let jobs7d = { completed: 0, failed: 0, pendingOrRunning: 0 };
  let recentJobs: AdminAnalyticsDashboardData["contentGeneration"]["recentJobs"] = [];
  try {
    const since7d = weekAgo;
    const [completed, failed, pend] = await Promise.all([
      prisma.aiGenerationJob.count({
        where: { createdAt: { gte: since7d }, status: JobStatus.COMPLETED },
      }),
      prisma.aiGenerationJob.count({
        where: { createdAt: { gte: since7d }, status: JobStatus.FAILED },
      }),
      prisma.aiGenerationJob.count({
        where: {
          createdAt: { gte: since7d },
          status: { in: [JobStatus.PENDING, JobStatus.RUNNING] },
        },
      }),
    ]);
    jobs7d = { completed, failed, pendingOrRunning: pend };
    const jobs = await prisma.aiGenerationJob.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        tool: true,
        status: true,
        createdAt: true,
        error: true,
      },
    });
    recentJobs = jobs.map((j) => ({
      id: j.id,
      tool: j.tool,
      status: j.status,
      createdAt: j.createdAt.toISOString(),
      errorPreview: j.error ? j.error.slice(0, 160) : null,
    }));
  } catch (e) {
    pushWarn(e, "contentGeneration");
  }

  let recentLogs: AdminAnalyticsDashboardData["automation"]["recentLogs"] = [];
  try {
    const logs = await prisma.contentAutomationLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 25,
      select: {
        id: true,
        category: true,
        jobType: true,
        status: true,
        summary: true,
        createdAt: true,
        blogPostId: true,
      },
    });
    recentLogs = logs.map((l) => ({
      id: l.id,
      category: l.category,
      jobType: l.jobType,
      status: l.status,
      summary: l.summary,
      createdAt: l.createdAt.toISOString(),
      blogPostId: l.blogPostId,
    }));
  } catch (e) {
    pushWarn(e, "automation");
  }

  let backgroundJobsFailed: AdminAnalyticsDashboardData["failures"]["backgroundJobsFailed"] = [];
  let aiJobsWithErrors: AdminAnalyticsDashboardData["failures"]["aiJobsWithErrors"] = [];
  let automationFailures: AdminAnalyticsDashboardData["failures"]["automationFailures"] = [];
  try {
    const bj = await prisma.backgroundJob.findMany({
      where: { status: JobStatus.FAILED },
      orderBy: { updatedAt: "desc" },
      take: 12,
      select: { id: true, type: true, lastError: true, updatedAt: true },
    });
    backgroundJobsFailed = bj.map((j) => ({
      id: j.id,
      type: j.type,
      lastError: j.lastError,
      updatedAt: j.updatedAt.toISOString(),
    }));
  } catch (e) {
    pushWarn(e, "backgroundJobs");
  }
  try {
    const aj = await prisma.aiGenerationJob.findMany({
      where: { error: { not: null } },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: { id: true, tool: true, error: true, createdAt: true },
    });
    aiJobsWithErrors = aj.map((j) => ({
      id: j.id,
      tool: j.tool,
      errorPreview: (j.error ?? "").slice(0, 200),
      createdAt: j.createdAt.toISOString(),
    }));
  } catch (e) {
    pushWarn(e, "aiJobErrors");
  }
  try {
    const af = await prisma.contentAutomationLog.findMany({
      where: { status: ContentAutomationLogStatus.FAILED },
      orderBy: { createdAt: "desc" },
      take: 15,
      select: { id: true, category: true, jobType: true, error: true, createdAt: true },
    });
    automationFailures = af.map((a) => ({
      id: a.id,
      category: a.category,
      jobType: a.jobType,
      errorPreview: (a.error ?? "").slice(0, 200),
      createdAt: a.createdAt.toISOString(),
    }));
  } catch (e) {
    pushWarn(e, "automationFailures");
  }

  const degraded = warnings.length > 0;

  return {
    generatedAt,
    degraded,
    warnings,
    dataGaps,
    traffic: {
      siteTrafficAvailable: false,
      siteTrafficNote: phConfigured
        ? `PostHog connected — showing last ${TRAFFIC_DAYS} days of pageview data.`
        : "Page views and top landing URLs are not recorded in Postgres. Set POSTHOG_PERSONAL_API_KEY and POSTHOG_PROJECT_ID to pull live traffic data.",
      posthogTraffic,
      blogPerformance,
      blogPerformanceNote:
        blogPerformance.length === 0
          ? "No rows with perfImpressions/perfClicks yet — blog SEO performance fields populate when your ingestion pipeline writes them."
          : "Blog SEO metrics from BlogPost perf* fields (where populated).",
    },
    pathwayInterest: {
      lessonsPublishedByPathway,
      learnerGoalPathways,
      note: "Pathway interest: published lesson counts per pathwayId, and learner study-goal pathways from User.targetExamPathwayId.",
    },
    lessonUsage: {
      topLessonsByProgressRows,
      progressRowsTotal,
      distinctLearnersWithProgress7d,
      note: "Lesson opens/progress from Progress rows (ContentItem lesson ids). Engaged learners = distinct users with new progress rows in the last 7 days.",
    },
    questionUsage: {
      examAttempts7d,
      topExamsByAttempts7d,
      topTopicsByVolume,
      note: "Question practice volume: ExamAttempt in 7d by exam; topic aggregates from UserTopicStat (bank + mocks + practice tests that update stats).",
    },
    catUsage: {
      examSessionsAdaptive7d,
      examSessionsLinear7d,
      practiceTestsAdaptiveCompleted7d,
      practiceTestsCompleted7d,
      note: "CAT/adaptive: ExamSession rows with adaptive_state in last 7d vs linear-pattern sessions. Practice tests: completed adaptive (JSON state) vs all completed.",
    },
    subscriptions: {
      active,
      grace,
      cancelled,
      pastDue,
      newSubscriptionsByDay,
      newUsersByDay,
      chartDays: 14,
    },
    contentGeneration: {
      jobs7d,
      recentJobs,
    },
    automation: { recentLogs },
    failures: {
      backgroundJobsFailed,
      aiJobsWithErrors,
      automationFailures,
    },
  };
}
