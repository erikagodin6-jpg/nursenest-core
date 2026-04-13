/**
 * Admin “weak areas” intelligence: ranked entities + dual-window trends + cohort filters.
 * All metrics are explainable; PostHog sections are optional (personal API key + project id).
 */
import { CountryCode, Prisma, UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { isRuntimeSafeMode } from "@/lib/runtime/safe-mode";
import { posthogHogqlTable, posthogProjectConfigured } from "@/lib/observability/posthog-hogql-query";
import { PH } from "@/lib/observability/posthog-conversion-events";
import {
  classifyFeature,
  classifyLesson,
  computeConversionPageScore,
  computeFeatureWeakScore,
  computeLessonWeakScore,
  computePageWeakScore,
  computeTopicWeakScore,
  lessonTrend,
  normalizeFrictionDensity,
  severityFromScore,
  streakPain,
  type WeakAreaClassification,
  type WeakAreaTrend,
} from "@/lib/admin/weak-areas-scoring";

/** More user reports vs prior window = worse (inverse of marketing traffic). */
function feedbackReportTrend(prev: number, cur: number): WeakAreaTrend {
  if (prev < 3) return "unknown";
  const ch = (cur - prev) / prev;
  if (ch >= 0.22) return "worsening";
  if (ch <= -0.22) return "improving";
  return "flat";
}

/** Fewer unique visitors vs prior window = worse for conversion URLs. */
function marketingTrafficTrend(prev: number | null, cur: number): WeakAreaTrend {
  if (prev == null || prev < 5) return "unknown";
  const ch = (cur - prev) / prev;
  if (ch <= -0.18) return "worsening";
  if (ch >= 0.15) return "improving";
  return "flat";
}

export type WeakAreasSubscriptionFilter = "all" | "paying" | "trial_active" | "free_no_sub";
export type WeakAreasRecencyFilter = "all" | "new_accounts" | "returning_accounts";

export type WeakAreasQuery = {
  from: Date;
  to: Date;
  fromDay: string;
  toDay: string;
  prevFrom: Date;
  prevTo: Date;
  prevFromDay: string;
  prevToDay: string;
  pathwayId: string | null;
  country: CountryCode | null;
  subscriptionFilter: WeakAreasSubscriptionFilter;
  recencyFilter: WeakAreasRecencyFilter;
};

export type RankedWeakArea = {
  id: string;
  title: string;
  subtitle?: string;
  category: "page" | "lesson" | "feature" | "topic" | "conversion";
  score: number;
  severity: ReturnType<typeof severityFromScore>;
  classification: WeakAreaClassification;
  trend: WeakAreaTrend;
  trendSummary: string | null;
  signals: Array<{ label: string; value: string }>;
  reasons: string[];
};

export type AdminWeakAreasData = {
  generatedAt: string;
  query: WeakAreasQuery;
  degraded: boolean;
  warnings: string[];
  filterSummary: string[];
  cohortLearnerCount: number | null;
  scoringNote: string;
  pathwayOptions: Array<{ id: string; label: string }>;
  /** Practice tests in cohort + window — context for abandonment. */
  practiceSlice: { started: number; completed: number; abandoned: number; abandonRatePct: number | null };
  rankedUnpopularPages: RankedWeakArea[];
  rankedWeakLearnerFeatures: RankedWeakArea[];
  rankedWeakLessons: RankedWeakArea[];
  rankedConfusingQuestionAreas: RankedWeakArea[];
  rankedWeakConversionPages: RankedWeakArea[];
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

function parseSubscriptionFilter(raw: string | undefined): WeakAreasSubscriptionFilter {
  if (raw === "paying" || raw === "trial_active" || raw === "free_no_sub") return raw;
  return "all";
}

function parseRecencyFilter(raw: string | undefined): WeakAreasRecencyFilter {
  if (raw === "new_accounts" || raw === "returning_accounts") return raw;
  return "all";
}

export function parseWeakAreasSearchParams(
  raw: Record<string, string | string[] | undefined>,
): WeakAreasQuery {
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

  const span = to.getTime() - from.getTime();
  const prevTo = new Date(from.getTime() - 1);
  const prevFrom = new Date(prevTo.getTime() - span);

  const pathwayRaw = get("pathway")?.trim();
  const pathwayId = pathwayRaw && pathwayRaw !== "all" ? pathwayRaw : null;

  const countryRaw = get("country")?.trim().toUpperCase();
  const country =
    countryRaw === "US" || countryRaw === "CA" ? (countryRaw as CountryCode) : null;

  return {
    from,
    to,
    fromDay: utcDayString(from),
    toDay: utcDayString(to),
    prevFrom,
    prevTo,
    prevFromDay: utcDayString(prevFrom),
    prevToDay: utcDayString(prevTo),
    pathwayId,
    country,
    subscriptionFilter: parseSubscriptionFilter(get("sub")),
    recencyFilter: parseRecencyFilter(get("recency")),
  };
}

function filteredUsersFu(q: WeakAreasQuery): Prisma.Sql {
  const countrySql =
    q.country == null ? Prisma.empty : Prisma.sql` AND u.country = ${q.country}::"CountryCode"`;

  let subSql: Prisma.Sql = Prisma.empty;
  if (q.subscriptionFilter === "paying") {
    subSql = Prisma.sql`
      AND EXISTS (
        SELECT 1 FROM "Subscription" s
        WHERE s."userId" = u.id AND s.status IN ('ACTIVE'::"SubscriptionStatus", 'GRACE'::"SubscriptionStatus")
      )`;
  } else if (q.subscriptionFilter === "trial_active") {
    subSql = Prisma.sql`
      AND u."trialStatus" = 'ACTIVE'::"TrialStatus"
      AND NOT EXISTS (
        SELECT 1 FROM "Subscription" s
        WHERE s."userId" = u.id AND s.status IN ('ACTIVE'::"SubscriptionStatus", 'GRACE'::"SubscriptionStatus")
      )`;
  } else if (q.subscriptionFilter === "free_no_sub") {
    subSql = Prisma.sql`
      AND u."trialStatus" != 'ACTIVE'::"TrialStatus"
      AND NOT EXISTS (
        SELECT 1 FROM "Subscription" s
        WHERE s."userId" = u.id AND s.status IN ('ACTIVE'::"SubscriptionStatus", 'GRACE'::"SubscriptionStatus")
      )`;
  }

  let recSql: Prisma.Sql = Prisma.empty;
  if (q.recencyFilter === "new_accounts") {
    recSql = Prisma.sql` AND u."createdAt" >= ${q.from} AND u."createdAt" <= ${q.to}`;
  } else if (q.recencyFilter === "returning_accounts") {
    recSql = Prisma.sql` AND u."createdAt" < ${q.from}`;
  }

  return Prisma.sql`
    fu AS (
      SELECT u.id
      FROM "User" u
      WHERE u.role = ${UserRole.LEARNER}::"UserRole"
      ${countrySql}
      ${subSql}
      ${recSql}
    )
  `;
}

function pathwayLessonSql(q: WeakAreasQuery): Prisma.Sql {
  if (q.pathwayId == null) return Prisma.empty;
  return Prisma.sql`
    AND COALESCE(
      pl.pathway_id,
      CASE WHEN p."lessonId" LIKE 'pathway:%' THEN split_part(p."lessonId", ':', 2) ELSE NULL END
    ) = ${q.pathwayId}
  `;
}

function feedbackPathwaySql(q: WeakAreasQuery): Prisma.Sql {
  if (q.pathwayId == null) return Prisma.empty;
  return Prisma.sql` AND (fr."pathwayId" = ${q.pathwayId} OR fr."pathwayId" IS NULL)`;
}

const frictionCategoryList = Prisma.join([
  Prisma.sql`'BUG'::"UserFeedbackCategory"`,
  Prisma.sql`'BROKEN_CONTENT'::"UserFeedbackCategory"`,
  Prisma.sql`'CONFUSING_QUESTION'::"UserFeedbackCategory"`,
  Prisma.sql`'LESSON_ISSUE'::"UserFeedbackCategory"`,
]);

type LessonAggRow = {
  lessonId: string;
  rows: bigint;
  completed: bigint;
  never_engaged: bigint;
  learners: bigint;
  revisiting: bigint;
};

async function lessonAgg(
  q: WeakAreasQuery,
  from: Date,
  to: Date,
): Promise<Map<string, LessonAggRow>> {
  const fu = filteredUsersFu(q);
  const pPath = pathwayLessonSql(q);
  const rows = await prisma.$queryRaw<LessonAggRow[]>`
    WITH ${fu}
    SELECT
      p."lessonId",
      COUNT(*)::bigint AS rows,
      COUNT(*) FILTER (WHERE p.completed = true)::bigint AS completed,
      COUNT(*) FILTER (WHERE p.completed = false AND p."engagedAt" IS NULL)::bigint AS never_engaged,
      COUNT(DISTINCT p."userId")::bigint AS learners,
      COUNT(DISTINCT p."userId") FILTER (WHERE EXISTS (
        SELECT 1 FROM "Progress" p0
        WHERE p0."userId" = p."userId" AND p0."lessonId" = p."lessonId"
          AND p0."createdAt" < ${from}
      ))::bigint AS revisiting
    FROM "Progress" p
    INNER JOIN fu ON fu.id = p."userId"
    LEFT JOIN pathway_lessons pl ON pl.id = p."lessonId"
    WHERE p."updatedAt" >= ${from} AND p."updatedAt" <= ${to}
    ${pPath}
    GROUP BY p."lessonId"
    HAVING COUNT(*) >= 2
  `;
  return new Map(rows.map((r) => [r.lessonId, r]));
}

function mergeLessonRows(
  cur: Map<string, LessonAggRow>,
  prev: Map<string, LessonAggRow>,
  titles: Map<string, { title: string; pathwayId: string | null }>,
  practiceAbandonRate: number,
): RankedWeakArea[] {
  const out: RankedWeakArea[] = [];
  for (const [lessonId, c] of cur) {
    const total = Number(c.rows);
    const comp = Number(c.completed);
    const learners = Number(c.learners);
    const never = Number(c.never_engaged);
    const revisit = Number(c.revisiting);
    const completionRate = total > 0 ? comp / total : 0;
    const neverEngagedRate = total > 0 ? never / total : 0;
    const revisitRate = learners > 0 ? revisit / learners : 0;

    const p = prev.get(lessonId);
    const prevCompletionRate =
      p && Number(p.rows) > 0 ? Number(p.completed) / Number(p.rows) : null;
    const prevNever =
      p && Number(p.rows) > 0 ? Number(p.never_engaged) / Number(p.rows) : null;

    const signals = {
      completionRate,
      neverEngagedRate,
      revisitRate,
      frictionDensity: 0,
      practiceAbandonRate,
      learners,
      prevCompletionRate,
      prevNeverEngagedRate: prevNever,
    };
    const score = computeLessonWeakScore(signals);
    const { classification, reasons: classReasons } = classifyLesson(signals, score);
    const { trend, deltaCompletionPts } = lessonTrend(signals);

    const meta = titles.get(lessonId);
    const title = meta?.title ?? lessonId.slice(0, 56);

    const reasons: string[] = [...classReasons];
    if (completionRate < 0.45 && learners >= 6) {
      reasons.push(`Completion ${Math.round(completionRate * 100)}% across ${learners} learners in-window.`);
    }
    if (neverEngagedRate >= 0.25) {
      reasons.push(`${Math.round(neverEngagedRate * 100)}% of progress rows never reached engaged state.`);
    }

    let trendSummary: string | null = null;
    if (trend === "worsening" && deltaCompletionPts != null) {
      trendSummary = `Completion ${deltaCompletionPts >= 0 ? "+" : ""}${deltaCompletionPts} pts vs prior window.`;
    } else if (trend === "improving" && deltaCompletionPts != null) {
      trendSummary = `Completion improved ${deltaCompletionPts} pts vs prior window.`;
    } else if (trend === "flat") {
      trendSummary = "Stable vs prior window.";
    }

    out.push({
      id: `lesson:${lessonId}`,
      title,
      subtitle: meta?.pathwayId ? `Pathway ${meta.pathwayId}` : undefined,
      category: "lesson",
      score,
      severity: severityFromScore(score),
      classification,
      trend,
      trendSummary,
      signals: [
        { label: "Learners", value: String(learners) },
        { label: "Completion", value: `${Math.round(completionRate * 100)}%` },
        { label: "Never engaged", value: `${Math.round(neverEngagedRate * 100)}%` },
        { label: "Revisit rate", value: `${Math.round(revisitRate * 100)}%` },
      ],
      reasons: [...new Set(reasons)].slice(0, 6),
    });
  }
  return out.sort((a, b) => b.score - a.score).slice(0, 40);
}

export async function loadAdminWeakAreas(q: WeakAreasQuery): Promise<AdminWeakAreasData | null> {
  if (!isDatabaseUrlConfigured() || isRuntimeSafeMode()) {
    return null;
  }

  const generatedAt = new Date().toISOString();
  const warnings: string[] = [];
  const pushWarn = (e: unknown, label: string) => {
    warnings.push(`${label}: ${e instanceof Error ? e.message : String(e)}`.slice(0, 240));
  };

  const filterSummary: string[] = [];
  if (q.pathwayId) filterSummary.push(`Pathway: ${q.pathwayId}`);
  if (q.country) filterSummary.push(`Country: ${q.country}`);
  if (q.subscriptionFilter !== "all") filterSummary.push(`Subscription: ${q.subscriptionFilter.replace(/_/g, " ")}`);
  if (q.recencyFilter !== "all") filterSummary.push(`Accounts: ${q.recencyFilter.replace(/_/g, " ")}`);
  filterSummary.push(`Window: ${q.fromDay} → ${q.toDay} (vs ${q.prevFromDay} → ${q.prevToDay})`);

  let pathwayOptions: Array<{ id: string; label: string }> = [];
  try {
    const rows = await prisma.pathwayLesson.findMany({
      where: { status: "PUBLISHED" },
      select: { pathwayId: true },
      distinct: ["pathwayId"],
      orderBy: { pathwayId: "asc" },
      take: 48,
    });
    pathwayOptions = rows.map((r) => ({ id: r.pathwayId, label: r.pathwayId }));
  } catch (e) {
    pushWarn(e, "pathwayOptions");
  }

  let cohortLearnerCount: number | null = null;
  try {
    const fu = filteredUsersFu(q);
    const [c] = await prisma.$queryRaw<[{ n: bigint }]>`
      WITH ${fu} SELECT COUNT(*)::bigint AS n FROM fu
    `;
    cohortLearnerCount = Number(c?.n ?? 0);
  } catch (e) {
    pushWarn(e, "cohortCount");
  }

  /** Cohort practice-test abandonment (context for lessons / features). */
  let practiceSlice = { started: 0, completed: 0, abandoned: 0, abandonRatePct: null as number | null };
  try {
    const fu = filteredUsersFu(q);
    const [row] = await prisma.$queryRaw<Array<{ n: bigint; done: bigint; ab: bigint }>>`
      WITH ${fu}
      SELECT
        COUNT(*)::bigint AS n,
        COUNT(*) FILTER (WHERE pt.status = 'COMPLETED'::"PracticeTestStatus")::bigint AS done,
        COUNT(*) FILTER (WHERE pt.status = 'ABANDONED'::"PracticeTestStatus")::bigint AS ab
      FROM "practice_tests" pt
      INNER JOIN fu ON fu.id = pt."userId"
      WHERE pt."startedAt" >= ${q.from} AND pt."startedAt" <= ${q.to}
    `;
    practiceSlice = {
      started: Number(row?.n ?? 0),
      completed: Number(row?.done ?? 0),
      abandoned: Number(row?.ab ?? 0),
      abandonRatePct:
        row && Number(row.n) > 0 ? Math.round((Number(row.ab) / Number(row.n)) * 1000) / 10 : null,
    };
  } catch (e) {
    pushWarn(e, "practiceSlice");
  }

  const practiceAbandonRate =
    practiceSlice.started > 0 ? practiceSlice.abandoned / practiceSlice.started : 0;

  let rankedWeakLessons: RankedWeakArea[] = [];
  try {
    const [curMap, prevMap] = await Promise.all([
      lessonAgg(q, q.from, q.to),
      lessonAgg(q, q.prevFrom, q.prevTo),
    ]);
    const ids = [...new Set([...curMap.keys(), ...prevMap.keys()])].filter((id) => /^[a-z0-9]{20,40}$/i.test(id));
    const plRows =
      ids.length > 0
        ? await prisma.pathwayLesson.findMany({
            where: { id: { in: ids.slice(0, 200) } },
            select: { id: true, title: true, pathwayId: true },
          })
        : [];
    const titles = new Map<string, { title: string; pathwayId: string | null }>();
    for (const pl of plRows) {
      titles.set(pl.id, { title: pl.title, pathwayId: pl.pathwayId });
    }
    for (const lessonId of curMap.keys()) {
      if (titles.has(lessonId)) continue;
      if (lessonId.startsWith("pathway:")) {
        const parts = lessonId.split(":");
        titles.set(lessonId, {
          title: parts[2] ? `pathway:${parts[1]}:${parts[2]}` : lessonId,
          pathwayId: parts[1] ?? null,
        });
      } else {
        titles.set(lessonId, { title: lessonId.slice(0, 48), pathwayId: null });
      }
    }
    rankedWeakLessons = mergeLessonRows(curMap, prevMap, titles, practiceAbandonRate);
  } catch (e) {
    pushWarn(e, "lessons");
  }

  /** Feedback surfaces — current + previous window. */
  type FbRow = { surface: string; total: bigint; friction: bigint };
  async function feedbackAgg(from: Date, to: Date): Promise<FbRow[]> {
    const fu = filteredUsersFu(q);
    const pPath = feedbackPathwaySql(q);
    return prisma.$queryRaw<FbRow[]>`
      WITH ${fu}
      SELECT
        COALESCE(NULLIF(TRIM(fr."routeKey"), ''), LEFT(fr."pageUrl", 160)) AS surface,
        COUNT(*)::bigint AS total,
        COUNT(*) FILTER (WHERE fr.category IN (${frictionCategoryList}))::bigint AS friction
      FROM "UserFeedbackReport" fr
      INNER JOIN fu ON fu.id = fr."userId"
      WHERE fr."createdAt" >= ${from} AND fr."createdAt" <= ${to}
        AND fr."duplicateOfId" IS NULL
        ${pPath}
      GROUP BY 1
      HAVING COUNT(*) >= 1
    `;
  }

  let rankedUnpopularPages: RankedWeakArea[] = [];
  try {
    const [curFb, prevFb] = await Promise.all([feedbackAgg(q.from, q.to), feedbackAgg(q.prevFrom, q.prevTo)]);
    const prevMap = new Map(prevFb.map((r) => [r.surface, r]));
    for (const row of curFb) {
      const surface = row.surface || "(unknown)";
      const total = Number(row.total);
      const friction = Number(row.friction);
      const p = prevMap.get(surface);
      const prevTotal = p ? Number(p.total) : 0;
      const prevFriction = p ? Number(p.friction) : 0;
      const fd = normalizeFrictionDensity(friction, total);
      const rt = feedbackReportTrend(prevTotal, total);
      const visitorDrop =
        rt === "worsening"
          ? 0.42
          : rt === "improving"
            ? 0
            : prevTotal >= 3
              ? clamp01((prevTotal - total) / prevTotal)
              : prevFriction > 0 && friction > prevFriction
                ? 0.22
                : 0;
      const score = computePageWeakScore({
        frictionDensity: fd,
        visitorDropoff: visitorDrop,
        engagementGap: 0,
        uniqueVisitors: total,
        prevUniqueVisitors: prevTotal,
      });
      const trend = rt;
      const { classification, reasons } = classifySurface(surface, score, total, prevTotal, friction, prevFriction);

      rankedUnpopularPages.push({
        id: `page:${surface}`,
        title: surface,
        category: "page",
        score,
        severity: severityFromScore(score),
        classification,
        trend,
        trendSummary:
          trend === "worsening"
            ? "Report volume increased vs prior window (worse UX signal)."
            : trend === "improving"
              ? "Report volume decreased vs prior window."
              : prevTotal < 3
                ? "Not enough prior-window data for a trend."
                : "Roughly flat vs prior window.",
        signals: [
          { label: "Reports", value: String(total) },
          { label: "Friction events", value: String(friction) },
          { label: "Friction share", value: total > 0 ? `${Math.round((friction / total) * 100)}%` : "—" },
        ],
        reasons,
      });
    }
    rankedUnpopularPages = rankedUnpopularPages.sort((a, b) => b.score - a.score).slice(0, 36);
  } catch (e) {
    pushWarn(e, "feedbackPages");
    rankedUnpopularPages = [];
  }

  /** Topics — lifetime bank stats filtered by cohort (not windowed). */
  let rankedConfusingQuestionAreas: RankedWeakArea[] = [];
  try {
    const fu = filteredUsersFu(q);
    const topicRows = await prisma.$queryRaw<
      Array<{ topic: string; attempts: bigint; c: bigint; frustrated: bigint }>
    >`
      WITH ${fu}
      SELECT
        ut.topic,
        SUM(ut."correctCount" + ut."wrongCount")::bigint AS attempts,
        SUM(ut."correctCount")::bigint AS c,
        COUNT(*) FILTER (WHERE ut."wrongStreak" >= 4)::bigint AS frustrated
      FROM "UserTopicStat" ut
      INNER JOIN fu ON fu.id = ut."userId"
      GROUP BY ut.topic
      HAVING SUM(ut."correctCount" + ut."wrongCount") >= 18
      ORDER BY
        CASE
          WHEN SUM(ut."correctCount" + ut."wrongCount") > 0
          THEN SUM(ut."correctCount")::double precision / SUM(ut."correctCount" + ut."wrongCount")::double precision
          ELSE 1.0
        END ASC NULLS LAST
      LIMIT 28
    `;
    for (const r of topicRows) {
      const attempts = Number(r.attempts);
      const c = Number(r.c);
      const acc = attempts > 0 ? c / attempts : 0;
      const frustrated = Number(r.frustrated);
      const learnersApprox = Math.max(frustrated, Math.ceil(attempts / 12));
      const sp = streakPain(frustrated, learnersApprox);
      const score = computeTopicWeakScore({ accuracy: acc, streakPain: sp, attempts });
      const reasons: string[] = [
        `Aggregate accuracy ${Math.round(acc * 100)}% over ${attempts} graded attempts (cohort-filtered bank stats).`,
      ];
      if (frustrated >= 4) reasons.push(`${frustrated} learner/topic rows still carry a high wrong streak (≥4).`);
      reasons.push(
        "Topic rows are cumulative — use feedback “confusion” routes for short-term spikes; add attempt-level telemetry for true week-over-week topic trends.",
      );
      rankedConfusingQuestionAreas.push({
        id: `topic:${r.topic}`,
        title: r.topic,
        category: "topic",
        score,
        severity: severityFromScore(score),
        classification: acc < 0.45 && attempts >= 40 ? "underperforming" : attempts < 28 ? "low_exposure" : "mixed",
        trend: "unknown",
        trendSummary: "Bank aggregates are not window-differenced.",
        signals: [
          { label: "Accuracy", value: `${Math.round(acc * 100)}%` },
          { label: "Attempts (sum)", value: String(attempts) },
          { label: "High-streak rows", value: String(frustrated) },
        ],
        reasons,
      });
    }
  } catch (e) {
    pushWarn(e, "topics");
  }

  /** Confusing-question feedback routes — windowed trend (merged + re-sorted below). */
  const confusionCards: RankedWeakArea[] = [];
  try {
    type CfRow = { surface: string; n: bigint };
    const fu = filteredUsersFu(q);
    const pPath = feedbackPathwaySql(q);
    const curCf = await prisma.$queryRaw<CfRow[]>`
      WITH ${fu}
      SELECT
        COALESCE(NULLIF(TRIM(fr."routeKey"), ''), LEFT(fr."pageUrl", 120)) AS surface,
        COUNT(*)::bigint AS n
      FROM "UserFeedbackReport" fr
      INNER JOIN fu ON fu.id = fr."userId"
      WHERE fr."createdAt" >= ${q.from} AND fr."createdAt" <= ${q.to}
        AND fr.category = 'CONFUSING_QUESTION'::"UserFeedbackCategory"
        AND fr."duplicateOfId" IS NULL
        ${pPath}
      GROUP BY 1
    `;
    const prevCf = await prisma.$queryRaw<CfRow[]>`
      WITH ${fu}
      SELECT
        COALESCE(NULLIF(TRIM(fr."routeKey"), ''), LEFT(fr."pageUrl", 120)) AS surface,
        COUNT(*)::bigint AS n
      FROM "UserFeedbackReport" fr
      INNER JOIN fu ON fu.id = fr."userId"
      WHERE fr."createdAt" >= ${q.prevFrom} AND fr."createdAt" <= ${q.prevTo}
        AND fr.category = 'CONFUSING_QUESTION'::"UserFeedbackCategory"
        AND fr."duplicateOfId" IS NULL
        ${pPath}
      GROUP BY 1
    `;
    const prevM = new Map(prevCf.map((x) => [x.surface, Number(x.n)]));
    for (const row of curCf) {
      const surface = row.surface || "(unknown)";
      const n = Number(row.n);
      const prev = prevM.get(surface) ?? 0;
      const trend: WeakAreaTrend =
        prev >= 2 && n > prev * 1.35 ? "worsening" : n < prev * 0.65 && prev >= 3 ? "improving" : prev < 2 ? "unknown" : "flat";
      const score = Math.min(
        100,
        Math.round(n * 14 + (trend === "worsening" ? 18 : 0) + normalizeFrictionDensity(n, n) * 20),
      );
      confusionCards.push({
        id: `confusion-route:${surface}`,
        title: surface,
        subtitle: "Confusing-question reports",
        category: "topic",
        score,
        severity: severityFromScore(score),
        classification: n >= 4 && trend === "worsening" ? "active_decline" : n >= 5 ? "underperforming" : "mixed",
        trend,
        trendSummary:
          trend === "worsening"
            ? `Up from ${prev} → ${n} reports vs prior window.`
            : trend === "improving"
              ? `Down from ${prev} → ${n} vs prior window.`
              : prev < 2
                ? "Sparse prior window — trend is indeterminate."
                : "Roughly stable.",
        signals: [
          { label: "Reports (window)", value: String(n) },
          { label: "Prior window", value: String(prev) },
        ],
        reasons: [
          "Counts only authenticated learners in the selected cohort (anonymous feedback excluded when cohort filters apply).",
        ],
      });
    }
    confusionCards.sort((a, b) => b.score - a.score);
  } catch (e) {
    pushWarn(e, "confusionRoutes");
  }

  rankedConfusingQuestionAreas = [...confusionCards.slice(0, 14), ...rankedConfusingQuestionAreas]
    .sort((a, b) => b.score - a.score)
    .slice(0, 40);

  /** PostHog: learner sections + marketing URLs. */
  let rankedWeakLearnerFeatures: RankedWeakArea[] = [];
  let rankedWeakConversionPages: RankedWeakArea[] = [];

  if (posthogProjectConfigured()) {
    try {
      const ev = PH.appSectionView;
      const hogCur = `
        SELECT properties.section AS section, count() AS c
        FROM events
        WHERE event = '${ev}'
          AND timestamp >= toDate('${q.fromDay}')
          AND timestamp < toDate('${q.toDay}') + INTERVAL 1 DAY
        GROUP BY properties.section
        ORDER BY c DESC
        LIMIT 32
      `;
      const hogPrev = `
        SELECT properties.section AS section, count() AS c
        FROM events
        WHERE event = '${ev}'
          AND timestamp >= toDate('${q.prevFromDay}')
          AND timestamp < toDate('${q.prevToDay}') + INTERVAL 1 DAY
        GROUP BY properties.section
        ORDER BY c DESC
        LIMIT 32
      `;
      const [resC, resP] = await Promise.all([posthogHogqlTable(hogCur), posthogHogqlTable(hogPrev)]);
      const parseSections = (res: typeof resC): Array<{ section: string; c: number }> => {
        if (!res.ok || !res.rows.length) return [];
        const iS = res.columns.indexOf("section");
        const iC = res.columns.indexOf("c");
        if (iS < 0 || iC < 0) return [];
        return res.rows.map((row) => ({ section: String(row[iS] ?? ""), c: Number(row[iC] ?? 0) }));
      };
      const curS = parseSections(resC);
      const prevS = parseSections(resP);
      const prevMap = new Map(prevS.map((x) => [x.section, x.c]));
      const median = (() => {
        const xs = curS.map((x) => x.c).sort((a, b) => a - b);
        if (!xs.length) return 0;
        return xs[Math.floor(xs.length / 2)] ?? 0;
      })();
      const maxC = Math.max(1, ...curS.map((x) => x.c));
      for (const { section, c } of curS) {
        const prev = prevMap.get(section) ?? null;
        const tailRank = 1 - c / maxC;
        const score = computeFeatureWeakScore({ views: c, prevViews: prev, medianViews: median, tailRank });
        const { classification, reasons } = classifyFeature({ views: c, prevViews: prev, medianViews: median, tailRank }, score);
        const trend: WeakAreaTrend =
          prev != null && prev >= 12 && c < prev * 0.55
            ? "worsening"
            : prev != null && prev > 0 && c > prev * 1.2
              ? "improving"
              : prev == null || prev < 6
                ? "unknown"
                : "flat";
        rankedWeakLearnerFeatures.push({
          id: `feature:${section}`,
          title: section || "(unset section)",
          category: "feature",
          score,
          severity: severityFromScore(score),
          classification,
          trend,
          trendSummary:
            trend === "worsening"
              ? `Views down materially (${prev} → ${c}).`
              : trend === "improving"
                ? `Views up vs prior window (${prev} → ${c}).`
                : "Trend needs more PostHog volume.",
          signals: [
            { label: "Views (window)", value: String(c) },
            { label: "Prior window", value: prev == null ? "—" : String(prev) },
            { label: "Median section (window)", value: String(median) },
          ],
          reasons,
        });
      }
      rankedWeakLearnerFeatures = rankedWeakLearnerFeatures.sort((a, b) => b.score - a.score).slice(0, 24);
    } catch (e) {
      pushWarn(e, "posthogSections");
    }

    try {
      const esc = (s: string) => s.replace(/'/g, "''");
      const urlHog = (fromD: string, toD: string) => `
        SELECT
          properties.$current_url AS url,
          count() AS pv,
          uniqExact(distinct_id) AS uv
        FROM events
        WHERE event = '$pageview'
          AND timestamp >= toDate('${esc(fromD)}')
          AND timestamp < toDate('${esc(toD)}') + INTERVAL 1 DAY
          AND properties.$host NOT LIKE '%localhost%'
          AND (
            properties.$current_url ILIKE '%pricing%'
            OR properties.$current_url ILIKE '%subscribe%'
            OR properties.$current_url ILIKE '%checkout%'
            OR properties.$current_url ILIKE '%/upgrade%'
          )
        GROUP BY url
        HAVING uv >= 3
        ORDER BY uv DESC
        LIMIT 24
      `;
      const [curP, prevP] = await Promise.all([
        posthogHogqlTable(urlHog(q.fromDay, q.toDay)),
        posthogHogqlTable(urlHog(q.prevFromDay, q.prevToDay)),
      ]);
      const parseUrl = (res: typeof curP): Array<{ url: string; pv: number; uv: number }> => {
        if (!res.ok || !res.rows.length) return [];
        const iU = res.columns.indexOf("url");
        const iPv = res.columns.indexOf("pv");
        const iUv = res.columns.indexOf("uv");
        if (iU < 0 || iPv < 0 || iUv < 0) return [];
        return res.rows.map((row) => ({
          url: String(row[iU] ?? ""),
          pv: Number(row[iPv] ?? 0),
          uv: Number(row[iUv] ?? 0),
        }));
      };
      const curU = parseUrl(curP);
      const prevU = parseUrl(prevP);
      const prevMap = new Map(prevU.map((x) => [x.url, x.uv]));

      const checkoutCur = await posthogHogqlTable(`
        SELECT uniqExact(distinct_id) AS u
        FROM events
        WHERE event = '${PH.checkoutStarted}'
          AND timestamp >= toDate('${q.fromDay.replace(/'/g, "''")}')
          AND timestamp < toDate('${q.toDay.replace(/'/g, "''")}') + INTERVAL 1 DAY
      `);
      const checkoutPrev = await posthogHogqlTable(`
        SELECT uniqExact(distinct_id) AS u
        FROM events
        WHERE event = '${PH.checkoutStarted}'
          AND timestamp >= toDate('${q.prevFromDay.replace(/'/g, "''")}')
          AND timestamp < toDate('${q.prevToDay.replace(/'/g, "''")}') + INTERVAL 1 DAY
      `);
      let checkoutUvCur = 0;
      let checkoutUvPrev = 0;
      if (checkoutCur.ok && checkoutCur.rows[0]) {
        const idx = checkoutCur.columns.indexOf("u");
        if (idx >= 0) checkoutUvCur = Number(checkoutCur.rows[0][idx] ?? 0);
      }
      if (checkoutPrev.ok && checkoutPrev.rows[0]) {
        const idx = checkoutPrev.columns.indexOf("u");
        if (idx >= 0) checkoutUvPrev = Number(checkoutPrev.rows[0][idx] ?? 0);
      }
      const totalUvCur = curU.reduce((a, x) => a + x.uv, 0) || 1;
      const totalUvPrev = prevU.reduce((a, x) => a + x.uv, 0) || 1;
      const gapCur = 1 - checkoutUvCur / totalUvCur;
      const gapPrev = 1 - checkoutUvPrev / Math.max(1, totalUvPrev);

      for (const row of curU) {
        const prevUv = prevMap.get(row.url) ?? null;
        const drop = prevUv != null && prevUv >= 5 ? clamp01((prevUv - row.uv) / prevUv) : 0;
        const friction = 0;
        const checkoutGap = Math.max(0, gapCur - 0.02);
        const score = computeConversionPageScore({ frictionDensity: friction, visitorDropoff: drop, checkoutGap });
        const trend = marketingTrafficTrend(prevUv, row.uv);
        rankedWeakConversionPages.push({
          id: `conv:${row.url}`,
          title: row.url,
          category: "conversion",
          score,
          severity: severityFromScore(score),
          classification: drop >= 0.22 && row.uv >= 8 ? "active_decline" : score >= 44 ? "mixed" : "low_exposure",
          trend,
          trendSummary:
            trend === "worsening"
              ? `Unique visitors fell vs prior window on this URL.`
              : trend === "improving"
                ? "Traffic recovered vs prior window."
                : "Limited prior-window traffic for trend.",
          signals: [
            { label: "Unique visitors", value: String(row.uv) },
            { label: "Pageviews", value: String(row.pv) },
            { label: "Checkout starts (cohort-wide)", value: `${checkoutUvCur} this window` },
          ],
          reasons: [
            "Checkout gap compares global `checkout_started` uniques to summed pricing-page UVs in the same window — directional, not per-URL attributed revenue.",
          ],
        });
      }
      rankedWeakConversionPages = rankedWeakConversionPages.sort((a, b) => b.score - a.score).slice(0, 20);
    } catch (e) {
      pushWarn(e, "posthogConversion");
    }
  }

  const scoringNote =
    "Scores are weighted sums of normalized pain signals (0–100, higher = weaker). See `weak-areas-scoring.ts` for weights and classification rules. Anonymous feedback is excluded whenever any cohort filter is applied.";

  return {
    generatedAt,
    query: q,
    degraded: warnings.length > 0,
    warnings,
    filterSummary,
    cohortLearnerCount,
    scoringNote,
    pathwayOptions,
    practiceSlice,
    rankedUnpopularPages,
    rankedWeakLearnerFeatures,
    rankedWeakLessons,
    rankedConfusingQuestionAreas,
    rankedWeakConversionPages,
  };
}

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}

function classifySurface(
  surface: string,
  score: number,
  total: number,
  prevTotal: number,
  friction: number,
  prevFriction: number,
): { classification: WeakAreaClassification; reasons: string[] } {
  const reasons: string[] = [];
  const share = total > 0 ? friction / total : 0;
  if (total < 3 && prevTotal < 3) {
    reasons.push("Very few reports — could be noise or an under-sampled surface.");
    return { classification: "low_exposure", reasons };
  }
  if (share >= 0.5 && total >= 4) {
    reasons.push(`High friction share (${Math.round(share * 100)}% of reports are bug/confusion/lesson issues).`);
    return { classification: "underperforming", reasons };
  }
  if (prevTotal >= 4 && total > prevTotal * 1.4 && friction >= prevFriction) {
    reasons.push("Report volume grew vs prior window while friction did not improve.");
    return { classification: "active_decline", reasons };
  }
  if (score >= 48) {
    reasons.push("Elevated composite score — triage in Feedback inbox.");
    return { classification: "mixed", reasons };
  }
  reasons.push("Below automatic weak thresholds.");
  return { classification: "mixed", reasons };
}
