/**
 * Learner-centric analytics with filters. Uses Postgres only — no invented metrics.
 * Active users = users with lesson/exam/session/practice activity in the date range (no login table).
 */
import { CountryCode, Prisma, UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { isRuntimeSafeMode } from "@/lib/runtime/safe-mode";

export type UserAnalyticsSubscriptionFilter =
  | "all"
  | "paid"
  | "free"
  | "active"
  | "grace"
  | "cancelled"
  | "past_due"
  | "none";

export type ParsedUserAnalyticsQuery = {
  from: Date;
  to: Date;
  fromDay: string;
  toDay: string;
  country: "ALL" | CountryCode;
  pathway: "ALL" | "__unset__" | string;
  subscription: UserAnalyticsSubscriptionFilter;
};

export type AdminUserAnalyticsData = {
  generatedAt: string;
  query: ParsedUserAnalyticsQuery;
  degraded: boolean;
  warnings: string[];
  dataNotes: string[];
  totals: {
    /** Learners matching filters (current profile). */
    users: number;
    /** Distinct learners with any study activity in [from, to]. */
    activeUsers: number;
    /** Share of matching learners who were active in range. */
    activeShare: number | null;
  };
  subscriptionBreakdown: {
    /** Mutually exclusive primary state per user (priority ACTIVE > GRACE > PAST_DUE > CANCELLED > NONE). */
    byPrimaryState: Array<{ state: string; users: number }>;
    note: string;
  };
  newUsersByDay: Array<{ day: string; count: number }>;
  pathwayDistribution: Array<{ pathwayId: string | null; label: string; users: number }>;
  engagementByPathway: Array<{
    pathwayId: string | null;
    label: string;
    users: number;
    activeInRange: number;
    avgProgressEventsPerActive: number | null;
    avgExamAttemptsPerActive: number | null;
  }>;
  lessonUsage: {
    topLessonsByDistinctUsers: Array<{ lessonId: string; title: string | null; distinctUsers: number }>;
    avgLessonsTouchedPerActiveUser: number | null;
    note: string;
  };
  questionCatUsage: {
    examAttemptsInRange: number;
    avgExamAttemptsPerActiveUser: number | null;
    examSessionsInRange: number;
    catSessionsInRange: number;
    practiceTestsCompletedInRange: number;
    practiceTestsAdaptiveCompletedInRange: number;
    note: string;
  };
  freeVsPaid: {
    available: boolean;
    reason?: string;
    paid: {
      users: number;
      activeUsers: number;
      avgExamAttemptsPerActive: number | null;
      avgProgressTouchesPerActive: number | null;
    };
    free: {
      users: number;
      activeUsers: number;
      avgExamAttemptsPerActive: number | null;
      avgProgressTouchesPerActive: number | null;
    };
  };
  cohortRetention: {
    available: boolean;
    reason?: string;
    /** ISO week start (UTC) */
    weeks: Array<{
      cohortWeekStart: string;
      cohortSize: number;
      /** % with activity in days 7–13 after signup */
      retentionWeek1Pct: number | null;
      /** % with activity in days 14–20 after signup */
      retentionWeek2Pct: number | null;
    }>;
    note: string;
  };
  filterOptions: {
    countries: Array<{ value: CountryCode; label: string }>;
    pathways: Array<{ value: string; label: string }>;
    subscriptions: Array<{ value: UserAnalyticsSubscriptionFilter; label: string }>;
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

export function parseUserAnalyticsSearchParams(
  raw: Record<string, string | string[] | undefined>,
): ParsedUserAnalyticsQuery {
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

  const countryRaw = get("country")?.toUpperCase();
  const country: ParsedUserAnalyticsQuery["country"] =
    countryRaw === "CA" || countryRaw === "US" ? (countryRaw as CountryCode) : "ALL";

  const pathwayRaw = get("pathway") ?? "ALL";
  const pathway: ParsedUserAnalyticsQuery["pathway"] =
    pathwayRaw === "ALL" || pathwayRaw === "__unset__" ? pathwayRaw : pathwayRaw;

  const subRaw = (get("subscription") ?? "all").toLowerCase();
  const subscriptionMap: UserAnalyticsSubscriptionFilter[] = [
    "all",
    "paid",
    "free",
    "active",
    "grace",
    "cancelled",
    "past_due",
    "none",
  ];
  const subscription = subscriptionMap.includes(subRaw as UserAnalyticsSubscriptionFilter)
    ? (subRaw as UserAnalyticsSubscriptionFilter)
    : "all";

  return {
    from,
    to,
    fromDay: utcDayString(from),
    toDay: utcDayString(to),
    country,
    pathway,
    subscription,
  };
}

function subscriptionSqlFragment(mode: UserAnalyticsSubscriptionFilter): Prisma.Sql {
  switch (mode) {
    case "all":
      return Prisma.empty;
    case "paid":
      return Prisma.sql`AND EXISTS (
        SELECT 1 FROM "Subscription" s
        WHERE s."userId" = u.id AND s.status IN ('ACTIVE', 'GRACE')
      )`;
    case "free":
      return Prisma.sql`AND NOT EXISTS (
        SELECT 1 FROM "Subscription" s
        WHERE s."userId" = u.id AND s.status IN ('ACTIVE', 'GRACE')
      )`;
    case "active":
      return Prisma.sql`AND EXISTS (
        SELECT 1 FROM "Subscription" s WHERE s."userId" = u.id AND s.status = 'ACTIVE'
      )`;
    case "grace":
      return Prisma.sql`AND EXISTS (
        SELECT 1 FROM "Subscription" s WHERE s."userId" = u.id AND s.status = 'GRACE'
      )`;
    case "cancelled":
      return Prisma.sql`AND EXISTS (
        SELECT 1 FROM "Subscription" s WHERE s."userId" = u.id AND s.status = 'CANCELLED'
      )`;
    case "past_due":
      return Prisma.sql`AND EXISTS (
        SELECT 1 FROM "Subscription" s WHERE s."userId" = u.id AND s.status = 'PAST_DUE'
      )`;
    case "none":
      return Prisma.sql`AND NOT EXISTS (SELECT 1 FROM "Subscription" s WHERE s."userId" = u.id)`;
    default:
      return Prisma.empty;
  }
}

function countryPathwaySql(q: ParsedUserAnalyticsQuery): Prisma.Sql {
  const country =
    q.country === "ALL"
      ? Prisma.empty
      : Prisma.sql`AND u.country = ${q.country}::"CountryCode"`;
  const pathway =
    q.pathway === "ALL"
      ? Prisma.empty
      : q.pathway === "__unset__"
        ? Prisma.sql`AND u."targetExamPathwayId" IS NULL`
        : Prisma.sql`AND u."targetExamPathwayId" = ${q.pathway}`;
  return Prisma.sql`${country} ${pathway}`;
}

export async function loadAdminUserAnalytics(
  q: ParsedUserAnalyticsQuery,
): Promise<AdminUserAnalyticsData | null> {
  if (!isDatabaseUrlConfigured() || isRuntimeSafeMode()) {
    return null;
  }

  const generatedAt = new Date().toISOString();
  const warnings: string[] = [];
  const pushWarn = (e: unknown, label: string) => {
    warnings.push(`${label}: ${e instanceof Error ? e.message : String(e)}`);
  };

  const dataNotes: string[] = [
    "“Active” is inferred from lesson progress, exam attempts, exam sessions, or practice tests in the selected window — there is no separate login/session table.",
    "Pathway and country filters use the learner’s current profile. Historical pathway changes are not tracked.",
    "Subscription breakdown uses a single primary status per user (priority: ACTIVE → GRACE → PAST_DUE → CANCELLED → none).",
  ];

  const subFrag = subscriptionSqlFragment(q.subscription);
  const geoFrag = countryPathwaySql(q);

  let users = 0;
  let activeUsers = 0;
  let subscriptionByPrimary: AdminUserAnalyticsData["subscriptionBreakdown"]["byPrimaryState"] = [];
  let newUsersByDay: AdminUserAnalyticsData["newUsersByDay"] = [];
  let pathwayDistribution: AdminUserAnalyticsData["pathwayDistribution"] = [];
  let engagementByPathway: AdminUserAnalyticsData["engagementByPathway"] = [];
  let topLessons: AdminUserAnalyticsData["lessonUsage"]["topLessonsByDistinctUsers"] = [];
  let avgLessonsTouched: number | null = null;
  let examAttemptsInRange = 0;
  let examSessionsInRange = 0;
  let catSessionsInRange = 0;
  let practiceTestsCompletedInRange = 0;
  let practiceTestsAdaptiveCompletedInRange = 0;

  try {
    const [userRow] = await prisma.$queryRaw<[{ n: bigint }]>`
      SELECT COUNT(*)::bigint AS n
      FROM "User" u
      WHERE u.role = 'LEARNER' ${subFrag} ${geoFrag}
    `;
    users = Number(userRow?.n ?? 0);

    const [activeRow] = await prisma.$queryRaw<[{ n: bigint }]>`
      SELECT COUNT(DISTINCT a.uid)::bigint AS n
      FROM (
        SELECT p."userId" AS uid FROM "Progress" p
        WHERE p."updatedAt" >= ${q.from} AND p."updatedAt" <= ${q.to}
        UNION
        SELECT e."userId" FROM "ExamAttempt" e
        WHERE e."createdAt" >= ${q.from} AND e."createdAt" <= ${q.to}
        UNION
        SELECT s."userId" FROM "ExamSession" s
        WHERE s."updatedAt" >= ${q.from} AND s."updatedAt" <= ${q.to}
        UNION
        SELECT pt."userId" FROM "practice_tests" pt
        WHERE pt."updatedAt" >= ${q.from} AND pt."updatedAt" <= ${q.to}
      ) a
      INNER JOIN "User" u ON u.id = a.uid
      WHERE u.role = 'LEARNER' ${subFrag} ${geoFrag}
    `;
    activeUsers = Number(activeRow?.n ?? 0);

    const primaryRows = await prisma.$queryRaw<Array<{ st: string; n: bigint }>>`
      WITH prim AS (
        SELECT u.id,
          COALESCE(
            (SELECT s.status::text FROM "Subscription" s WHERE s."userId" = u.id ORDER BY
              CASE s.status
                WHEN 'ACTIVE' THEN 1
                WHEN 'GRACE' THEN 2
                WHEN 'PAST_DUE' THEN 3
                WHEN 'CANCELLED' THEN 4
                ELSE 5
              END
              LIMIT 1),
            'NONE'
          ) AS primary_state
        FROM "User" u
        WHERE u.role = 'LEARNER' ${subFrag} ${geoFrag}
      )
      SELECT primary_state AS st, COUNT(*)::bigint AS n
      FROM prim
      GROUP BY primary_state
      ORDER BY n DESC
    `;
    subscriptionByPrimary = primaryRows.map((r) => ({ state: r.st, users: Number(r.n) }));

    const newDayRows = await prisma.$queryRaw<Array<{ d: Date; n: bigint }>>`
      SELECT date_trunc('day', u."createdAt" AT TIME ZONE 'UTC') AS d, COUNT(*)::bigint AS n
      FROM "User" u
      WHERE u.role = 'LEARNER'
        AND u."createdAt" >= ${q.from} AND u."createdAt" <= ${q.to}
        ${subFrag} ${geoFrag}
      GROUP BY 1
      ORDER BY 1 ASC
    `;
    newUsersByDay = newDayRows.map((r) => ({
      day: r.d.toISOString().slice(0, 10),
      count: Number(r.n),
    }));

    if (q.pathway === "ALL") {
      const distRows = await prisma.$queryRaw<Array<{ pid: string | null; n: bigint }>>`
        SELECT u."targetExamPathwayId" AS pid, COUNT(*)::bigint AS n
        FROM "User" u
        WHERE u.role = 'LEARNER' ${subFrag} ${countryPathwaySql({ ...q, pathway: "ALL" })}
        GROUP BY u."targetExamPathwayId"
        ORDER BY n DESC
        LIMIT 24
      `;
      pathwayDistribution = distRows.map((r) => ({
        pathwayId: r.pid,
        label: r.pid ?? "(no pathway set)",
        users: Number(r.n),
      }));
    } else {
      pathwayDistribution = [];
    }

    const engRows = await prisma.$queryRaw<
      Array<{
        pid: string | null;
        users: bigint;
        active_in_range: bigint;
        progress_rows: bigint;
        exam_attempts: bigint;
      }>
    >`
      WITH base AS (
        SELECT u.id, u."targetExamPathwayId" AS pid
        FROM "User" u
        WHERE u.role = 'LEARNER' ${subFrag} ${geoFrag}
      ),
      act AS (
        SELECT DISTINCT b.id
        FROM base b
        INNER JOIN (
          SELECT p."userId" AS uid FROM "Progress" p
          WHERE p."updatedAt" >= ${q.from} AND p."updatedAt" <= ${q.to}
          UNION
          SELECT e."userId" FROM "ExamAttempt" e
          WHERE e."createdAt" >= ${q.from} AND e."createdAt" <= ${q.to}
          UNION
          SELECT s."userId" FROM "ExamSession" s
          WHERE s."updatedAt" >= ${q.from} AND s."updatedAt" <= ${q.to}
          UNION
          SELECT pt."userId" FROM "practice_tests" pt
          WHERE pt."updatedAt" >= ${q.from} AND pt."updatedAt" <= ${q.to}
        ) z ON z.uid = b.id
      ),
      prog AS (
        SELECT p."userId" AS uid, COUNT(*)::bigint AS c
        FROM "Progress" p
        WHERE p."updatedAt" >= ${q.from} AND p."updatedAt" <= ${q.to}
        GROUP BY 1
      ),
      ex AS (
        SELECT e."userId" AS uid, COUNT(*)::bigint AS c
        FROM "ExamAttempt" e
        WHERE e."createdAt" >= ${q.from} AND e."createdAt" <= ${q.to}
        GROUP BY 1
      )
      SELECT
        b.pid,
        COUNT(*)::bigint AS users,
        COUNT(*) FILTER (WHERE a.id IS NOT NULL)::bigint AS active_in_range,
        COALESCE(SUM(prog.c), 0)::bigint AS progress_rows,
        COALESCE(SUM(ex.c), 0)::bigint AS exam_attempts
      FROM base b
      LEFT JOIN act a ON a.id = b.id
      LEFT JOIN prog ON prog.uid = b.id
      LEFT JOIN ex ON ex.uid = b.id
      GROUP BY b.pid
      ORDER BY users DESC
      LIMIT 24
    `;
    engagementByPathway = engRows.map((r) => {
      const au = Number(r.active_in_range);
      return {
        pathwayId: r.pid,
        label: r.pid ?? "(no pathway set)",
        users: Number(r.users),
        activeInRange: au,
        avgProgressEventsPerActive: au > 0 ? Number(r.progress_rows) / au : null,
        avgExamAttemptsPerActive: au > 0 ? Number(r.exam_attempts) / au : null,
      };
    });

    const lessonRows = await prisma.$queryRaw<Array<{ lessonId: string; n: bigint }>>`
      SELECT p."lessonId", COUNT(DISTINCT p."userId")::bigint AS n
      FROM "Progress" p
      INNER JOIN "User" u ON u.id = p."userId"
      WHERE u.role = 'LEARNER'
        AND p."updatedAt" >= ${q.from} AND p."updatedAt" <= ${q.to}
        ${subFrag} ${geoFrag}
      GROUP BY p."lessonId"
      ORDER BY n DESC
      LIMIT 15
    `;
    const lessonIds = lessonRows.map((x) => x.lessonId);
    const lessons =
      lessonIds.length > 0
        ? await prisma.pathwayLesson.findMany({
            where: { id: { in: lessonIds } },
            select: { id: true, title: true },
          })
        : [];
    const titleById = new Map(lessons.map((l) => [l.id, l.title]));
    topLessons = lessonRows.map((r) => ({
      lessonId: r.lessonId,
      title: titleById.get(r.lessonId) ?? null,
      distinctUsers: Number(r.n),
    }));

    const [touchRow] = await prisma.$queryRaw<[{ n: bigint; users: bigint }]>`
      WITH act AS (
        SELECT DISTINCT a.uid FROM (
          SELECT p."userId" AS uid FROM "Progress" p
          WHERE p."updatedAt" >= ${q.from} AND p."updatedAt" <= ${q.to}
          UNION
          SELECT e."userId" FROM "ExamAttempt" e
          WHERE e."createdAt" >= ${q.from} AND e."createdAt" <= ${q.to}
          UNION
          SELECT s."userId" FROM "ExamSession" s
          WHERE s."updatedAt" >= ${q.from} AND s."updatedAt" <= ${q.to}
          UNION
          SELECT pt."userId" FROM "practice_tests" pt
          WHERE pt."updatedAt" >= ${q.from} AND pt."updatedAt" <= ${q.to}
        ) a
        INNER JOIN "User" u ON u.id = a.uid
        WHERE u.role = 'LEARNER' ${subFrag} ${geoFrag}
      ),
      touches AS (
        SELECT p."userId", COUNT(*)::bigint AS c
        FROM "Progress" p
        INNER JOIN act ON act.uid = p."userId"
        WHERE p."updatedAt" >= ${q.from} AND p."updatedAt" <= ${q.to}
        GROUP BY p."userId"
      )
      SELECT COALESCE(SUM(c), 0)::bigint AS n, COUNT(*)::bigint AS users FROM touches
    `;
    const totalTouches = Number(touchRow?.n ?? 0);
    const touchUsers = Number(touchRow?.users ?? 0);
    avgLessonsTouched = touchUsers > 0 ? totalTouches / touchUsers : null;

    const [examAgg] = await prisma.$queryRaw<[{ attempts: bigint; sessions: bigint; cat: bigint }]>`
      SELECT
        (SELECT COUNT(*)::bigint FROM "ExamAttempt" e
          INNER JOIN "User" u ON u.id = e."userId"
          WHERE e."createdAt" >= ${q.from} AND e."createdAt" <= ${q.to}
          AND u.role = 'LEARNER' ${subFrag} ${geoFrag}) AS attempts,
        (SELECT COUNT(*)::bigint FROM "ExamSession" s
          INNER JOIN "User" u ON u.id = s."userId"
          WHERE s."updatedAt" >= ${q.from} AND s."updatedAt" <= ${q.to}
          AND u.role = 'LEARNER' ${subFrag} ${geoFrag}) AS sessions,
        (SELECT COUNT(*)::bigint FROM "ExamSession" s
          INNER JOIN "User" u ON u.id = s."userId"
          WHERE s."updatedAt" >= ${q.from} AND s."updatedAt" <= ${q.to}
          AND s.adaptive_state IS NOT NULL
          AND u.role = 'LEARNER' ${subFrag} ${geoFrag}) AS cat
    `;
    examAttemptsInRange = Number(examAgg?.attempts ?? 0);
    examSessionsInRange = Number(examAgg?.sessions ?? 0);
    catSessionsInRange = Number(examAgg?.cat ?? 0);

    const [ptAgg] = await prisma.$queryRaw<[{ done: bigint; ad: bigint }]>`
      SELECT
        COUNT(*) FILTER (WHERE pt.status = 'COMPLETED')::bigint AS done,
        COUNT(*) FILTER (WHERE pt.status = 'COMPLETED' AND pt.adaptive_state IS NOT NULL)::bigint AS ad
      FROM "practice_tests" pt
      INNER JOIN "User" u ON u.id = pt."userId"
      WHERE pt."updatedAt" >= ${q.from} AND pt."updatedAt" <= ${q.to}
        AND u.role = 'LEARNER' ${subFrag} ${geoFrag}
    `;
    practiceTestsCompletedInRange = Number(ptAgg?.done ?? 0);
    practiceTestsAdaptiveCompletedInRange = Number(ptAgg?.ad ?? 0);
  } catch (e) {
    pushWarn(e, "coreMetrics");
  }

  const activeShare = users > 0 ? activeUsers / users : null;
  const avgExamPerActive =
    activeUsers > 0 ? examAttemptsInRange / activeUsers : null;

  /** Free vs paid (ignores subscription dropdown unless “all” — compare segments under same geo/pathway). */
  let freeVsPaid: AdminUserAnalyticsData["freeVsPaid"] = {
    available: false,
    reason: "Enable comparison by setting subscription filter to “All”.",
    paid: { users: 0, activeUsers: 0, avgExamAttemptsPerActive: null, avgProgressTouchesPerActive: null },
    free: { users: 0, activeUsers: 0, avgExamAttemptsPerActive: null, avgProgressTouchesPerActive: null },
  };

  if (q.subscription === "all") {
    try {
      const geoOnly = countryPathwaySql(q);
      const segment = async (paid: boolean) => {
        const paidFrag = paid
          ? Prisma.sql`AND EXISTS (SELECT 1 FROM "Subscription" s WHERE s."userId" = u.id AND s.status IN ('ACTIVE', 'GRACE'))`
          : Prisma.sql`AND NOT EXISTS (SELECT 1 FROM "Subscription" s WHERE s."userId" = u.id AND s.status IN ('ACTIVE', 'GRACE'))`;
        const [uc] = await prisma.$queryRaw<[{ n: bigint }]>`
          SELECT COUNT(*)::bigint AS n FROM "User" u
          WHERE u.role = 'LEARNER' ${paidFrag} ${geoOnly}
        `;
        const [ac] = await prisma.$queryRaw<[{ n: bigint }]>`
          SELECT COUNT(DISTINCT x.uid)::bigint AS n FROM (
            SELECT p."userId" AS uid FROM "Progress" p
            WHERE p."updatedAt" >= ${q.from} AND p."updatedAt" <= ${q.to}
            UNION
            SELECT e."userId" FROM "ExamAttempt" e
            WHERE e."createdAt" >= ${q.from} AND e."createdAt" <= ${q.to}
            UNION
            SELECT s."userId" FROM "ExamSession" s
            WHERE s."updatedAt" >= ${q.from} AND s."updatedAt" <= ${q.to}
            UNION
            SELECT pt."userId" FROM "practice_tests" pt
            WHERE pt."updatedAt" >= ${q.from} AND pt."updatedAt" <= ${q.to}
          ) x
          INNER JOIN "User" u ON u.id = x.uid
          WHERE u.role = 'LEARNER' ${paidFrag} ${geoOnly}
        `;
        const [ea] = await prisma.$queryRaw<[{ n: bigint }]>`
          SELECT COUNT(*)::bigint AS n FROM "ExamAttempt" e
          INNER JOIN "User" u ON u.id = e."userId"
          WHERE e."createdAt" >= ${q.from} AND e."createdAt" <= ${q.to}
            AND u.role = 'LEARNER' ${paidFrag} ${geoOnly}
        `;
        const [prTouch] = await prisma.$queryRaw<[{ total: bigint; nu: bigint }]>`
          WITH touches AS (
            SELECT p."userId", COUNT(*)::bigint AS c
            FROM "Progress" p
            INNER JOIN "User" u ON u.id = p."userId"
            WHERE p."updatedAt" >= ${q.from} AND p."updatedAt" <= ${q.to}
              AND u.role = 'LEARNER' ${paidFrag} ${geoOnly}
            GROUP BY p."userId"
          )
          SELECT COALESCE(SUM(c), 0)::bigint AS total, COUNT(*)::bigint AS nu FROM touches
        `;
        const usersN = Number(uc?.n ?? 0);
        const actN = Number(ac?.n ?? 0);
        const examN = Number(ea?.n ?? 0);
        const tot = Number(prTouch?.total ?? 0);
        const nu = Number(prTouch?.nu ?? 0);
        return {
          users: usersN,
          activeUsers: actN,
          avgExamAttemptsPerActive: actN > 0 ? examN / actN : null,
          avgProgressTouchesPerActive: nu > 0 ? tot / nu : null,
        };
      };
      const [paid, free] = await Promise.all([segment(true), segment(false)]);
      freeVsPaid = { available: true, paid, free };
    } catch (e) {
      pushWarn(e, "freeVsPaid");
      freeVsPaid = {
        available: false,
        reason: "Could not compute free vs paid split.",
        paid: freeVsPaid.paid,
        free: freeVsPaid.free,
      };
    }
  }

  /** Weekly cohorts: signups in last 8 full UTC weeks; retention = activity in calendar windows after signup. */
  let cohortRetention: AdminUserAnalyticsData["cohortRetention"] = {
    available: false,
    reason: "Cohort query failed.",
    weeks: [],
    note: "Week 1 = share with activity between day 7 and 13 after signup; week 2 = days 14–20. Requires enough cohort size — small cohorts may show 0%.",
  };

  try {
    const cohortRows = await prisma.$queryRaw<
      Array<{
        cohort_week: Date;
        cohort_size: bigint;
        r1: bigint;
        r2: bigint;
      }>
    >`
      WITH base AS (
        SELECT u.id, u."createdAt" AS ca
        FROM "User" u
        WHERE u.role = 'LEARNER' ${subFrag} ${geoFrag}
          AND u."createdAt" >= (date_trunc('week', NOW() AT TIME ZONE 'UTC') - INTERVAL '8 weeks')
      ),
      cohorts AS (
        SELECT date_trunc('week', ca AT TIME ZONE 'UTC') AS cw, id, ca
        FROM base
      ),
      agg AS (
        SELECT c.cw,
          COUNT(*)::bigint AS cohort_size,
          COUNT(*) FILTER (WHERE
            EXISTS (
              SELECT 1 FROM "Progress" p
              WHERE p."userId" = c.id
                AND p."updatedAt" >= c.ca + INTERVAL '7 days'
                AND p."updatedAt" < c.ca + INTERVAL '14 days'
            )
            OR EXISTS (
              SELECT 1 FROM "ExamAttempt" e
              WHERE e."userId" = c.id
                AND e."createdAt" >= c.ca + INTERVAL '7 days'
                AND e."createdAt" < c.ca + INTERVAL '14 days'
            )
            OR EXISTS (
              SELECT 1 FROM "ExamSession" s
              WHERE s."userId" = c.id
                AND s."updatedAt" >= c.ca + INTERVAL '7 days'
                AND s."updatedAt" < c.ca + INTERVAL '14 days'
            )
            OR EXISTS (
              SELECT 1 FROM "practice_tests" pt
              WHERE pt."userId" = c.id
                AND pt."updatedAt" >= c.ca + INTERVAL '7 days'
                AND pt."updatedAt" < c.ca + INTERVAL '14 days'
            )
          )::bigint AS r1,
          COUNT(*) FILTER (WHERE
            EXISTS (
              SELECT 1 FROM "Progress" p
              WHERE p."userId" = c.id
                AND p."updatedAt" >= c.ca + INTERVAL '14 days'
                AND p."updatedAt" < c.ca + INTERVAL '21 days'
            )
            OR EXISTS (
              SELECT 1 FROM "ExamAttempt" e
              WHERE e."userId" = c.id
                AND e."createdAt" >= c.ca + INTERVAL '14 days'
                AND e."createdAt" < c.ca + INTERVAL '21 days'
            )
            OR EXISTS (
              SELECT 1 FROM "ExamSession" s
              WHERE s."userId" = c.id
                AND s."updatedAt" >= c.ca + INTERVAL '14 days'
                AND s."updatedAt" < c.ca + INTERVAL '21 days'
            )
            OR EXISTS (
              SELECT 1 FROM "practice_tests" pt
              WHERE pt."userId" = c.id
                AND pt."updatedAt" >= c.ca + INTERVAL '14 days'
                AND pt."updatedAt" < c.ca + INTERVAL '21 days'
            )
          )::bigint AS r2
        FROM cohorts c
        GROUP BY c.cw
      )
      SELECT cw AS cohort_week, cohort_size, r1, r2
      FROM agg
      ORDER BY cw ASC
    `;
    cohortRetention = {
      available: true,
      weeks: cohortRows.map((w) => {
        const cs = Number(w.cohort_size);
        const r1 = cs > 0 ? Number(w.r1) / cs : null;
        const r2 = cs > 0 ? Number(w.r2) / cs : null;
        return {
          cohortWeekStart: w.cohort_week.toISOString().slice(0, 10),
          cohortSize: cs,
          retentionWeek1Pct: r1 !== null ? Math.round(r1 * 1000) / 10 : null,
          retentionWeek2Pct: r2 !== null ? Math.round(r2 * 1000) / 10 : null,
        };
      }),
      note: "Cohorts are UTC week buckets for users who signed up in the last 8 weeks (subject to filters). Retention uses the same activity sources as “active users”.",
    };
  } catch (e) {
    pushWarn(e, "cohortRetention");
  }

  const distinctPathways = await prisma.user.findMany({
    where: { role: UserRole.LEARNER, targetExamPathwayId: { not: null } },
    select: { targetExamPathwayId: true },
    distinct: ["targetExamPathwayId"],
  });
  const pathwaysForSelect = distinctPathways
    .map((r) => r.targetExamPathwayId)
    .filter((x): x is string => Boolean(x))
    .sort();

  const filterOptions: AdminUserAnalyticsData["filterOptions"] = {
    countries: [
      { value: CountryCode.CA, label: "Canada" },
      { value: CountryCode.US, label: "United States" },
    ],
    pathways: [
      { value: "ALL", label: "All pathways" },
      { value: "__unset__", label: "No pathway set" },
      ...pathwaysForSelect.map((id) => ({ value: id, label: id })),
    ],
    subscriptions: [
      { value: "all", label: "All (no subscription filter)" },
      { value: "paid", label: "Paid (ACTIVE or GRACE)" },
      { value: "free", label: "Free (no ACTIVE/GRACE)" },
      { value: "active", label: "Has ACTIVE subscription" },
      { value: "grace", label: "Has GRACE subscription" },
      { value: "cancelled", label: "Has CANCELLED (any)" },
      { value: "past_due", label: "Has PAST_DUE (any)" },
      { value: "none", label: "No subscription rows" },
    ],
  };

  return {
    generatedAt,
    query: q,
    degraded: warnings.length > 0,
    warnings,
    dataNotes,
    totals: {
      users,
      activeUsers,
      activeShare,
    },
    subscriptionBreakdown: {
      byPrimaryState: subscriptionByPrimary,
      note: "Each learner appears once. If you need Stripe MRR or churn, pull billing analytics separately.",
    },
    newUsersByDay,
    pathwayDistribution,
    engagementByPathway,
    lessonUsage: {
      topLessonsByDistinctUsers: topLessons,
      avgLessonsTouchedPerActiveUser: avgLessonsTouched,
      note: "Lesson touches count Progress rows updated in range (revisits count).",
    },
    questionCatUsage: {
      examAttemptsInRange,
      avgExamAttemptsPerActiveUser: avgExamPerActive,
      examSessionsInRange,
      catSessionsInRange,
      practiceTestsCompletedInRange,
      practiceTestsAdaptiveCompletedInRange,
      note: "CAT sessions = ExamSession rows with adaptive state in range. Practice tests count completed rows in range.",
    },
    freeVsPaid: freeVsPaid,
    cohortRetention,
    filterOptions,
  };
}
