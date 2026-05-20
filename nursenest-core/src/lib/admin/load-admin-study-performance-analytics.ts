/**
 * Content & study-mode performance from Postgres (lessons/progress, topic stats, CAT practice tests).
 * Rationale CTA funnels are PostHog-only — surfaced as a data note, not fabricated counts.
 */
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { isRuntimeSafeMode } from "@/lib/runtime/safe-mode";

export type StudyPerformanceQuery = {
  from: Date;
  to: Date;
  fromDay: string;
  toDay: string;
};

export type AdminStudyPerformanceData = {
  generatedAt: string;
  query: StudyPerformanceQuery;
  degraded: boolean;
  warnings: string[];
  dataNotes: string[];
  lessons: {
    topLessons: Array<{
      lessonKey: string;
      title: string | null;
      pathwayId: string | null;
      progressRows: number;
      completedRows: number;
      completionRatePct: number | null;
      /** Opened but never crossed engage threshold (proxy “bounce”). */
      neverEngagedRows: number;
      distinctLearners: number;
    }>;
    pathwayDistribution: Array<{ pathwayId: string | null; progressRows: number; distinctLearners: number }>;
    note: string;
  };
  questions: {
    topTopicsByAttempts: Array<{ topic: string; attempts: number; correct: number; wrong: number; accuracyPct: number | null }>;
    hardestTopics: Array<{ topic: string; attempts: number; accuracyPct: number }>;
    rationaleNote: string;
  };
  cat: {
    practiceTestsCatStarted: number;
    practiceTestsCatCompleted: number;
    practiceTestsCatAvgAccuracyPct: number | null;
    examSessionsCatTouched: number;
    examSessionsCatCompleted: number;
    pathwayDistribution: Array<{ pathwayId: string; sessions: number; completed: number }>;
    readinessByWeek: Array<{ weekStart: string; label: string | null; sessions: number }>;
    note: string;
  };
  /** Distinct learners per UTC day + coarse session/lesson drop-off proxies (Postgres-only). */
  engagement: {
    dailyActiveUsers: Array<{ day: string; users: number }>;
    /** Share of lesson progress rows in window that never reached engage threshold (bounce proxy). */
    lessonDropOffRatePct: number | null;
    /** Mean duration of completed practice tests with elapsed time, in minutes. */
    avgPracticeTestMinutes: number | null;
    note: string;
  };
};

const MS_DAY = 86400000;

function utcDayString(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function startOfUtcDay(day: string): Date {
  return new Date(`${day}T00:00:00.000Z`);
}

function endOfUtcDay(day: string): Date {
  return new Date(`${day}T23:59:59.999Z`);
}

export function parseStudyPerformanceSearchParams(
  raw: Record<string, string | string[] | undefined>,
): StudyPerformanceQuery {
  const get = (k: string) => {
    const v = raw[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const toDay = get("to");
  const fromDay = get("from");
  const today = utcDayString(new Date());
  let to = toDay ? endOfUtcDay(toDay) : endOfUtcDay(today);
  let from = fromDay ? startOfUtcDay(fromDay) : new Date(to.getTime() - 29 * MS_DAY);
  if (from > to) {
    const t = from;
    from = to;
    to = t;
  }
  const maxSpan = 366 * MS_DAY;
  if (to.getTime() - from.getTime() > maxSpan) {
    from = new Date(to.getTime() - maxSpan);
  }
  return { from, to, fromDay: utcDayString(from), toDay: utcDayString(to) };
}

export async function loadAdminStudyPerformanceAnalytics(
  q: StudyPerformanceQuery,
): Promise<AdminStudyPerformanceData | null> {
  if (!isDatabaseUrlConfigured() || isRuntimeSafeMode()) {
    return null;
  }

  const generatedAt = new Date().toISOString();
  const warnings: string[] = [];
  const pushWarn = (e: unknown, label: string) => {
    warnings.push(`${label}: ${e instanceof Error ? e.message : String(e)}`);
  };

  const dataNotes = [
    "Daily active learners = distinct `userId` per UTC calendar day across `Progress.updatedAt`, `practice_tests.startedAt`, and `ExamSession.updatedAt` in the window (union, deduped per day).",
    "Lesson metrics use `Progress` rows in the window (`updatedAt`). Completion rate = completed rows ÷ all rows for that lesson key.",
    "“Never engaged” = progress row exists but `engagedAt` is null — proxy for drop-off before read-depth; not scroll-mapped.",
    "Question topics use aggregated `UserTopicStat` (correct/wrong counts) — not per-attempt rows.",
    "CAT practice tests: CAT = `practice_tests` where `config.selectionMode = cat` or `adaptive_state` is set. Exam hub CAT intros may use `ExamSession` without a practice test row.",
    "CAT Study vs Test mode: JSON `config.catExamFeedbackMode` is `study` or `test` (default test; exam simulation is always test). Example: `WHERE (config->>'selectionMode')='cat' AND (config->>'catExamFeedbackMode')='study'`. PostHog `learner_cat_exam_started` and `learner_practice_test_session_completed` include `cat_exam_feedback_mode`, and completion may include `pass_outlook_pct`, `cat_coach_present`, `cat_confidence_level`, `cat_pattern_codes`. Link follow-through: `learner_cat_learning_link_clicked`.",
    "Rationale link clicks are not stored in Postgres. Use PostHog for `freemium_see_rationale_cta`, `lesson_preview_unlock_cta`, and question-bank explanation toggles.",
  ];

  let topLessons: AdminStudyPerformanceData["lessons"]["topLessons"] = [];
  let pathwayDistribution: AdminStudyPerformanceData["lessons"]["pathwayDistribution"] = [];
  let topTopics: AdminStudyPerformanceData["questions"]["topTopicsByAttempts"] = [];
  let hardestTopics: AdminStudyPerformanceData["questions"]["hardestTopics"] = [];
  let catStarted = 0;
  let catCompleted = 0;
  let catAvgAcc: number | null = null;
  let examSessCat = 0;
  let examSessCatDone = 0;
  let catPathDist: AdminStudyPerformanceData["cat"]["pathwayDistribution"] = [];
  let readinessByWeek: AdminStudyPerformanceData["cat"]["readinessByWeek"] = [];

  let dailyActiveUsers: AdminStudyPerformanceData["engagement"]["dailyActiveUsers"] = [];
  let lessonDropOffRatePct: number | null = null;
  let avgPracticeTestMinutes: number | null = null;

  try {
    const lessonAgg = await prisma.$queryRaw<
      Array<{
        lessonId: string;
        rows: bigint;
        completed: bigint;
        never_engaged: bigint;
        learners: bigint;
      }>
    >`
      SELECT
        p."lessonId",
        COUNT(*)::bigint AS rows,
        COUNT(*) FILTER (WHERE p.completed = true)::bigint AS completed,
        COUNT(*) FILTER (WHERE p.completed = false AND p."engagedAt" IS NULL)::bigint AS never_engaged,
        COUNT(DISTINCT p."userId")::bigint AS learners
      FROM "Progress" p
      WHERE p."updatedAt" >= ${q.from} AND p."updatedAt" <= ${q.to}
      GROUP BY p."lessonId"
      ORDER BY rows DESC
      LIMIT 30
    `;

    const pathwayRows = await prisma.$queryRaw<
      Array<{ pathway_id: string | null; rows: bigint; learners: bigint }>
    >`
      SELECT
        COALESCE(
          pl.pathway_id,
          CASE
            WHEN p."lessonId" LIKE 'pathway:%' THEN split_part(p."lessonId", ':', 2)
            ELSE NULL
          END,
          'unknown'
        ) AS pathway_id,
        COUNT(*)::bigint AS rows,
        COUNT(DISTINCT p."userId")::bigint AS learners
      FROM "Progress" p
      LEFT JOIN pathway_lessons pl ON pl.id = p."lessonId"
      WHERE p."updatedAt" >= ${q.from} AND p."updatedAt" <= ${q.to}
      GROUP BY 1
      ORDER BY rows DESC
      LIMIT 32
    `;
    pathwayDistribution = pathwayRows.map((r) => ({
      pathwayId: r.pathway_id,
      progressRows: Number(r.rows),
      distinctLearners: Number(r.learners),
    }));

    const lessonIds = lessonAgg.map((x) => x.lessonId);
    const uuidLike = lessonIds.filter((id) => /^[a-z0-9]{20,40}$/i.test(id));
    const pathwayLessons =
      uuidLike.length > 0
        ? await prisma.pathwayLesson.findMany({
            where: { id: { in: uuidLike } },
            select: { id: true, title: true, pathwayId: true },
          })
        : [];
    const plById = new Map(pathwayLessons.map((x) => [x.id, x]));

    topLessons = lessonAgg.map((row) => {
      const total = Number(row.rows);
      const comp = Number(row.completed);
      const titlePl = plById.get(row.lessonId);
      let title: string | null = titlePl?.title ?? null;
      let pathwayId: string | null = titlePl?.pathwayId ?? null;
      if (!title && row.lessonId.startsWith("pathway:")) {
        const parts = row.lessonId.split(":");
        pathwayId = parts[1] ?? null;
        const slug = parts[2] ?? "";
        title = slug ? `pathway:${pathwayId}:${slug}` : row.lessonId;
      }
      return {
        lessonKey: row.lessonId,
        title: title ?? row.lessonId.slice(0, 48),
        pathwayId,
        progressRows: total,
        completedRows: comp,
        completionRatePct: total > 0 ? Math.round((comp / total) * 1000) / 10 : null,
        neverEngagedRows: Number(row.never_engaged),
        distinctLearners: Number(row.learners),
      };
    });
  } catch (e) {
    pushWarn(e, "lessons");
  }

  try {
    const topicRows = await prisma.$queryRaw<
      Array<{ topic: string; c: bigint; w: bigint; attempts: bigint }>
    >`
      SELECT
        topic,
        SUM("correctCount")::bigint AS c,
        SUM("wrongCount")::bigint AS w,
        SUM("correctCount" + "wrongCount")::bigint AS attempts
      FROM "UserTopicStat"
      GROUP BY topic
      HAVING SUM("correctCount" + "wrongCount") >= 5
      ORDER BY attempts DESC
      LIMIT 24
    `;
    topTopics = topicRows.map((r) => {
      const c = Number(r.c);
      const w = Number(r.w);
      const a = Number(r.attempts);
      return {
        topic: r.topic,
        attempts: a,
        correct: c,
        wrong: w,
        accuracyPct: a > 0 ? Math.round((c / a) * 1000) / 10 : null,
      };
    });

    const hardRows = await prisma.$queryRaw<Array<{ topic: string; attempts: bigint; c: bigint }>>`
      SELECT topic, SUM("correctCount" + "wrongCount")::bigint AS attempts, SUM("correctCount")::bigint AS c
      FROM "UserTopicStat"
      GROUP BY topic
      HAVING SUM("correctCount" + "wrongCount") >= 20
      ORDER BY
        CASE
          WHEN SUM("correctCount" + "wrongCount") > 0
          THEN SUM("correctCount")::double precision / SUM("correctCount" + "wrongCount")::double precision
          ELSE 1.0
        END ASC NULLS LAST
      LIMIT 15
    `;
    hardestTopics = hardRows.map((r) => {
      const a = Number(r.attempts);
      const c = Number(r.c);
      return {
        topic: r.topic,
        attempts: a,
        accuracyPct: a > 0 ? Math.round((c / a) * 1000) / 10 : 0,
      };
    });
  } catch (e) {
    pushWarn(e, "questions");
  }

  try {
    const [ptStart] = await prisma.$queryRaw<[{ n: bigint }]>`
      SELECT COUNT(*)::bigint AS n
      FROM "practice_tests"
      WHERE "startedAt" >= ${q.from} AND "startedAt" <= ${q.to}
        AND (
          (config->>'selectionMode') = 'cat'
          OR adaptive_state IS NOT NULL
        )
    `;
    catStarted = Number(ptStart?.n ?? 0);

    const [ptDone] = await prisma.$queryRaw<[{ n: bigint; avg: number | null }]>`
      SELECT
        COUNT(*)::bigint AS n,
        AVG((results->>'accuracyPct')::double precision) AS avg
      FROM "practice_tests"
      WHERE status = 'COMPLETED'
        AND "updatedAt" >= ${q.from} AND "updatedAt" <= ${q.to}
        AND (
          (config->>'selectionMode') = 'cat'
          OR adaptive_state IS NOT NULL
        )
        AND results IS NOT NULL
    `;
    catCompleted = Number(ptDone?.n ?? 0);
    catAvgAcc = ptDone?.avg != null && Number.isFinite(ptDone.avg) ? Math.round(ptDone.avg * 10) / 10 : null;

    const catPath = await prisma.$queryRaw<Array<{ pathway_id: string | null; n: bigint; done: bigint }>>`
      SELECT
        NULLIF(TRIM(config->>'pathwayId'), '') AS pathway_id,
        COUNT(*)::bigint AS n,
        COUNT(*) FILTER (WHERE status = 'COMPLETED')::bigint AS done
      FROM "practice_tests"
      WHERE "startedAt" >= ${q.from} AND "startedAt" <= ${q.to}
        AND (
          (config->>'selectionMode') = 'cat'
          OR adaptive_state IS NOT NULL
        )
      GROUP BY 1
      ORDER BY n DESC
      LIMIT 24
    `;
    catPathDist = catPath.map((r) => ({
      pathwayId: r.pathway_id ?? "(unset)",
      sessions: Number(r.n),
      completed: Number(r.done),
    }));

    const [es] = await prisma.$queryRaw<[{ cat: bigint; done: bigint }]>`
      SELECT
        COUNT(*)::bigint AS cat,
        COUNT(*) FILTER (WHERE status = 'COMPLETED')::bigint AS done
      FROM "ExamSession"
      WHERE "updatedAt" >= ${q.from} AND "updatedAt" <= ${q.to}
        AND adaptive_state IS NOT NULL
    `;
    examSessCat = Number(es?.cat ?? 0);
    examSessCatDone = Number(es?.done ?? 0);

    const readiness = await prisma.$queryRaw<Array<{ wk: Date; label: string | null; n: bigint }>>`
      SELECT
        date_trunc('week', COALESCE("completedAt", "updatedAt") AT TIME ZONE 'UTC') AS wk,
        NULLIF(TRIM(results->>'readinessLabel'), '') AS label,
        COUNT(*)::bigint AS n
      FROM "practice_tests"
      WHERE status = 'COMPLETED'
        AND "updatedAt" >= ${q.from} AND "updatedAt" <= ${q.to}
        AND adaptive_state IS NOT NULL
        AND results IS NOT NULL
      GROUP BY 1, 2
      ORDER BY wk ASC, n DESC
      LIMIT 40
    `;
    readinessByWeek = readiness.map((r) => ({
      weekStart: r.wk.toISOString().slice(0, 10),
      label: r.label,
      sessions: Number(r.n),
    }));
  } catch (e) {
    pushWarn(e, "cat");
  }

  try {
    const dauRows = await prisma.$queryRaw<Array<{ day: Date; users: bigint }>>`
      SELECT u.day, COUNT(DISTINCT u.user_id)::bigint AS users
      FROM (
        SELECT (p."updatedAt" AT TIME ZONE 'UTC')::date AS day, p."userId" AS user_id
        FROM "Progress" p
        WHERE p."updatedAt" >= ${q.from} AND p."updatedAt" <= ${q.to}
        UNION ALL
        SELECT (pt."startedAt" AT TIME ZONE 'UTC')::date, pt."userId"
        FROM "practice_tests" pt
        WHERE pt."startedAt" >= ${q.from} AND pt."startedAt" <= ${q.to}
        UNION ALL
        SELECT (es."updatedAt" AT TIME ZONE 'UTC')::date, es."userId"
        FROM "ExamSession" es
        WHERE es."updatedAt" >= ${q.from} AND es."updatedAt" <= ${q.to}
      ) u
      GROUP BY u.day
      ORDER BY u.day ASC
    `;
    dailyActiveUsers = dauRows.map((r) => ({
      day: r.day.toISOString().slice(0, 10),
      users: Number(r.users),
    }));

    const [dropRow] = await prisma.$queryRaw<Array<{ rows: bigint; never_engaged: bigint }>>`
      SELECT
        COUNT(*)::bigint AS rows,
        COUNT(*) FILTER (WHERE p.completed = false AND p."engagedAt" IS NULL)::bigint AS never_engaged
      FROM "Progress" p
      WHERE p."updatedAt" >= ${q.from} AND p."updatedAt" <= ${q.to}
    `;
    const dr = Number(dropRow?.rows ?? 0);
    const ne = Number(dropRow?.never_engaged ?? 0);
    lessonDropOffRatePct = dr > 0 ? Math.round((ne / dr) * 1000) / 10 : null;

    const [avgRow] = await prisma.$queryRaw<Array<{ avg_ms: number | null }>>`
      SELECT AVG("elapsedMs")::double precision AS avg_ms
      FROM "practice_tests"
      WHERE status = 'COMPLETED'
        AND "elapsedMs" IS NOT NULL
        AND "elapsedMs" > 0
        AND "updatedAt" >= ${q.from}
        AND "updatedAt" <= ${q.to}
    `;
    if (avgRow?.avg_ms != null && Number.isFinite(avgRow.avg_ms)) {
      avgPracticeTestMinutes = Math.round((avgRow.avg_ms / 60000) * 10) / 10;
    }
  } catch (e) {
    pushWarn(e, "engagement");
  }

  return {
    generatedAt,
    query: q,
    degraded: warnings.length > 0,
    warnings,
    dataNotes,
    lessons: {
      topLessons,
      pathwayDistribution,
      note: "Titles resolve from `pathway_lessons.id`; synthetic `pathway:…` keys show slug-derived labels when no row match.",
    },
    questions: {
      topTopicsByAttempts: topTopics,
      hardestTopics,
      rationaleNote:
        "Rationale / explanation engagement is not persisted in Postgres. Use PostHog (`freemium_see_rationale_cta`, `lesson_preview_unlock_cta`, `learner_question_bank_session_started`) for CTR-style analysis.",
    },
    cat: {
      practiceTestsCatStarted: catStarted,
      practiceTestsCatCompleted: catCompleted,
      practiceTestsCatAvgAccuracyPct: catAvgAcc,
      examSessionsCatTouched: examSessCat,
      examSessionsCatCompleted: examSessCatDone,
      pathwayDistribution: catPathDist,
      readinessByWeek,
      note: "Readiness breakdown uses `results.readinessLabel` on completed CAT practice tests. `ExamSession` counts are in-app sessions with adaptive state (may overlap practice tests).",
    },
    engagement: {
      dailyActiveUsers,
      lessonDropOffRatePct,
      avgPracticeTestMinutes,
      note: "Drop-off rate uses lesson rows updated in-window (not cohort funnel). Practice-test duration is mean `elapsedMs` on completed rows only.",
    },
  };
}
