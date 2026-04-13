/**
 * Product intelligence: composes Postgres study aggregates + friction tables + optional PostHog learner sections.
 * All numbers are explainable; gaps are surfaced in `dataMaturity`.
 */
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { isRuntimeSafeMode } from "@/lib/runtime/safe-mode";
import {
  loadAdminStudyPerformanceAnalytics,
  parseStudyPerformanceSearchParams,
  type AdminStudyPerformanceData,
  type StudyPerformanceQuery,
} from "@/lib/admin/load-admin-study-performance-analytics";
import { posthogHogqlTable, posthogProjectConfigured } from "@/lib/observability/posthog-hogql-query";
import { PH } from "@/lib/observability/posthog-conversion-events";
import {
  buildProductIntelligenceInsights,
  type ProductInsight,
  type ProductIntelligenceSignals,
} from "@/lib/admin/product-intelligence-insights";

export type ProductIntelligenceData = {
  generatedAt: string;
  query: StudyPerformanceQuery;
  degraded: boolean;
  warnings: string[];
  dataMaturity: string[];
  study: AdminStudyPerformanceData | null;
  signals: ProductIntelligenceSignals;
  insights: ProductInsight[];
};

export function parseProductIntelligenceSearchParams(
  raw: Record<string, string | string[] | undefined>,
): StudyPerformanceQuery {
  return parseStudyPerformanceSearchParams(raw);
}

export async function loadAdminProductIntelligence(q: StudyPerformanceQuery): Promise<ProductIntelligenceData | null> {
  if (!isDatabaseUrlConfigured() || isRuntimeSafeMode()) {
    return null;
  }

  const generatedAt = new Date().toISOString();
  const warnings: string[] = [];
  const pushWarn = (e: unknown, label: string) => {
    warnings.push(`${label}: ${e instanceof Error ? e.message : String(e)}`.slice(0, 240));
  };

  const study = await loadAdminStudyPerformanceAnalytics(q);

  const signals: ProductIntelligenceSignals = {
    feedbackBySurface: [],
    practiceTestByStatus: [],
    examSessionInProgressWindow: 0,
    examSessionCompletedWindow: 0,
    staleExamSessionsInProgress: 0,
    frustratedTopics: [],
    appSectionViews: null,
    learnerAccuracyBuckets: [],
    flashcardSessionTouches: 0,
  };

  try {
    const fb = await prisma.$queryRaw<Array<{ surface: string; total: bigint; friction: bigint }>>`
      SELECT
        COALESCE(NULLIF(TRIM("routeKey"), ''), LEFT("pageUrl", 160)) AS surface,
        COUNT(*)::bigint AS total,
        COUNT(*) FILTER (WHERE category IN ('BUG', 'BROKEN_CONTENT', 'CONFUSING_QUESTION', 'LESSON_ISSUE'))::bigint AS friction
      FROM "UserFeedbackReport"
      WHERE "createdAt" >= ${q.from} AND "createdAt" <= ${q.to}
      GROUP BY 1
      ORDER BY total DESC
      LIMIT 28
    `;
    signals.feedbackBySurface = fb.map((r) => ({
      surface: r.surface || "(unknown)",
      total: Number(r.total),
      friction: Number(r.friction),
    }));
  } catch (e) {
    pushWarn(e, "feedbackBySurface");
  }

  try {
    const pt = await prisma.$queryRaw<Array<{ status: string; n: bigint }>>`
      SELECT status::text, COUNT(*)::bigint AS n
      FROM "practice_tests"
      WHERE "startedAt" >= ${q.from} AND "startedAt" <= ${q.to}
      GROUP BY status
    `;
    signals.practiceTestByStatus = pt.map((r) => ({ status: r.status, n: Number(r.n) }));
  } catch (e) {
    pushWarn(e, "practiceTestByStatus");
  }

  try {
    const es = await prisma.$queryRaw<Array<{ status: string; n: bigint }>>`
      SELECT status::text, COUNT(*)::bigint AS n
      FROM "ExamSession"
      WHERE "updatedAt" >= ${q.from} AND "updatedAt" <= ${q.to}
      GROUP BY status
    `;
    for (const row of es) {
      if (row.status === "IN_PROGRESS") signals.examSessionInProgressWindow = Number(row.n);
      if (row.status === "COMPLETED") signals.examSessionCompletedWindow = Number(row.n);
    }
  } catch (e) {
    pushWarn(e, "examSession");
  }

  try {
    const staleCutoff = new Date(Date.now() - 48 * 3600000);
    const [st] = await prisma.$queryRaw<[{ n: bigint }]>`
      SELECT COUNT(*)::bigint AS n
      FROM "ExamSession"
      WHERE status = 'IN_PROGRESS' AND "updatedAt" < ${staleCutoff}
    `;
    signals.staleExamSessionsInProgress = Number(st?.n ?? 0);
  } catch (e) {
    pushWarn(e, "staleExamSessions");
  }

  try {
    const ft = await prisma.$queryRaw<Array<{ topic: string; frustrated: bigint; learners: bigint }>>`
      SELECT
        topic,
        COUNT(*) FILTER (WHERE "wrongStreak" >= 4)::bigint AS frustrated,
        COUNT(*)::bigint AS learners
      FROM "UserTopicStat"
      WHERE "wrongStreak" >= 4
      GROUP BY topic
      ORDER BY frustrated DESC
      LIMIT 16
    `;
    signals.frustratedTopics = ft.map((r) => ({
      topic: r.topic,
      frustratedLearners: Number(r.frustrated),
      learners: Number(r.learners),
    }));
  } catch (e) {
    pushWarn(e, "frustratedTopics");
  }

  try {
    const bk = await prisma.$queryRaw<Array<{ bucket: string; n: bigint }>>`
      WITH acc AS (
        SELECT
          "userId",
          SUM("correctCount")::double precision / NULLIF(SUM("correctCount" + "wrongCount"), 0) AS a
        FROM "UserTopicStat"
        GROUP BY "userId"
        HAVING SUM("correctCount" + "wrongCount") >= 15
      )
      SELECT
        CASE
          WHEN a >= 0.68 THEN 'strong'
          WHEN a < 0.42 THEN 'struggling'
          ELSE 'building'
        END AS bucket,
        COUNT(*)::bigint AS n
      FROM acc
      GROUP BY 1
    `;
    signals.learnerAccuracyBuckets = bk.map((r) => ({ bucket: r.bucket, learners: Number(r.n) }));
  } catch (e) {
    pushWarn(e, "learnerAccuracyBuckets");
  }

  try {
    const [fc] = await prisma.$queryRaw<[{ n: bigint }]>`
      SELECT COUNT(*)::bigint AS n
      FROM "flashcard_study_sessions"
      WHERE updated_at >= ${q.from} AND updated_at <= ${q.to}
    `;
    signals.flashcardSessionTouches = Number(fc?.n ?? 0);
  } catch (e) {
    pushWarn(e, "flashcardSessions");
  }

  if (posthogProjectConfigured()) {
    try {
      const ev = PH.appSectionView;
      const hogql = `
        SELECT properties.section AS section, count() AS c
        FROM events
        WHERE event = '${ev}'
          AND timestamp >= toDate('${q.fromDay}')
          AND timestamp < toDate('${q.toDay}') + INTERVAL 1 DAY
        GROUP BY properties.section
        ORDER BY c DESC
        LIMIT 24
      `;
      const res = await posthogHogqlTable(hogql);
      if (res.ok && res.rows.length) {
        const idxS = res.columns.indexOf("section");
        const idxC = res.columns.indexOf("c");
        if (idxS >= 0 && idxC >= 0) {
          signals.appSectionViews = res.rows.map((row) => ({
            section: String(row[idxS] ?? "(unset)"),
            views: Number(row[idxC] ?? 0),
          }));
        } else {
          signals.posthogAppSectionError = "Unexpected HogQL columns for app_section_view.";
        }
      } else if (!res.ok) {
        signals.posthogAppSectionError = res.error ?? "HogQL failed.";
      }
    } catch (e) {
      signals.posthogAppSectionError = e instanceof Error ? e.message : String(e);
    }
  }

  const dataMaturity = [
    "Postgres: `Progress` (lesson open / engage / complete), `UserTopicStat` (bank aggregates), `practice_tests`, `ExamSession`, `UserFeedbackReport`, `flashcard_study_sessions`.",
    "PostHog (optional): `app_section_view` for authenticated learner shell areas; requires POSTHOG_PERSONAL_API_KEY + POSTHOG_PROJECT_ID.",
    "Not in DB: per-page marketing exit rate, fine-grained funnels (signup→activation), rationale clicks — use PostHog funnels or add server events later.",
    "Cohort filters (pathway / country / subscription tier) can slice these same queries with extra WHERE clauses — not yet exposed in UI.",
  ];

  const insights =
    study != null ? buildProductIntelligenceInsights(study, signals) : [];

  return {
    generatedAt,
    query: q,
    degraded: warnings.length > 0 || (study?.degraded ?? false),
    warnings: [...(study?.warnings ?? []), ...warnings],
    dataMaturity,
    study,
    signals,
    insights,
  };
}
