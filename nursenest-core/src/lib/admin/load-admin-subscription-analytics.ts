/**
 * Subscription & revenue-adjacent operational metrics from Postgres.
 * Dollar amounts, tax, MRR, and exact renewal dates live in Stripe — not duplicated here.
 */
import { SubscriptionStatus, TrialStatus, UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { isRuntimeSafeMode } from "@/lib/runtime/safe-mode";

export type SubscriptionAnalyticsQuery = {
  from: Date;
  to: Date;
  fromDay: string;
  toDay: string;
};

export type AdminSubscriptionAnalyticsData = {
  generatedAt: string;
  query: SubscriptionAnalyticsQuery;
  degraded: boolean;
  warnings: string[];
  dataNotes: string[];
  overview: {
    subscriptionRowsTotal: number;
    activeOrGrace: number;
    activePaid: number;
    grace: number;
    pastDue: number;
    cancelled: number;
  };
  trial: {
    trialActiveLearners: number;
    trialEndingWithin7Days: number;
    learnersWithPaidAccess: number;
    trialOnlyNoPaidSub: number;
    byTrialStatus: Array<{ status: string; learners: number }>;
  };
  byPathway: Array<{ pathwayId: string | null; label: string; subscriptions: number; activePaid: number }>;
  byPlanTier: Array<{ tier: string | null; activePaid: number; allRows: number }>;
  byPlanCountry: Array<{ country: string | null; activePaid: number; allRows: number }>;
  churnAndRisk: {
    /** Status became CANCELLED with `updatedAt` in window (approximate churn events). */
    cancelledUpdatedInRange: number;
    pastDueUpdatedInRange: number;
    graceRows: number;
    pastDueRows: number;
    note: string;
  };
  planDrift: {
    /** ACTIVE subs where billed `planTier` ≠ profile `User.tier` (data drift — not an upgrade event). */
    activeTierMismatchVsProfile: number;
    upgradesDowngradesNote: string;
  };
  acquisition: {
    newSubscriptionsInRange: number;
    newLearnersInRange: number;
    /** New subs ÷ new signups in window — rough proxy; real checkout funnel is in PostHog. */
    newSubPerSignupPct: number | null;
    newSubscriptionsByDay: Array<{ day: string; count: number }>;
    checkoutNote: string;
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

export function parseSubscriptionAnalyticsSearchParams(
  raw: Record<string, string | string[] | undefined>,
): SubscriptionAnalyticsQuery {
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

export async function loadAdminSubscriptionAnalytics(
  q: SubscriptionAnalyticsQuery,
): Promise<AdminSubscriptionAnalyticsData | null> {
  if (!isDatabaseUrlConfigured() || isRuntimeSafeMode()) {
    return null;
  }

  const generatedAt = new Date().toISOString();
  const warnings: string[] = [];
  const pushWarn = (e: unknown, label: string) => {
    warnings.push(`${label}: ${e instanceof Error ? e.message : String(e)}`);
  };

  const dataNotes = [
    "Revenue (MRR/ARR), invoices, and renewal calendar dates are in Stripe — this view uses NurseNest DB rows only.",
    "“Churn” uses subscription rows with status CANCELLED and `updatedAt` in the window — not a full subscription lifecycle audit.",
    "Upgrade/downgrade history is not stored; use Stripe subscription version history or webhooks to build that.",
    "Checkout conversion: pair `checkout_started` / `learner_conversion_subscribed` in PostHog for funnel accuracy; below is a signup→first-sub proxy from DB.",
    "Renewal risk: PAST_DUE and GRACE rows are explicit risk; trial ending soon flags learners who may convert or drop.",
  ];

  let overview: AdminSubscriptionAnalyticsData["overview"] = {
    subscriptionRowsTotal: 0,
    activeOrGrace: 0,
    activePaid: 0,
    grace: 0,
    pastDue: 0,
    cancelled: 0,
  };
  let trial: AdminSubscriptionAnalyticsData["trial"] = {
    trialActiveLearners: 0,
    trialEndingWithin7Days: 0,
    learnersWithPaidAccess: 0,
    trialOnlyNoPaidSub: 0,
    byTrialStatus: [],
  };
  let byPathway: AdminSubscriptionAnalyticsData["byPathway"] = [];
  let byPlanTier: AdminSubscriptionAnalyticsData["byPlanTier"] = [];
  let byPlanCountry: AdminSubscriptionAnalyticsData["byPlanCountry"] = [];
  let churnAndRisk: AdminSubscriptionAnalyticsData["churnAndRisk"] = {
    cancelledUpdatedInRange: 0,
    pastDueUpdatedInRange: 0,
    graceRows: 0,
    pastDueRows: 0,
    note: "",
  };
  let planDrift: AdminSubscriptionAnalyticsData["planDrift"] = {
    activeTierMismatchVsProfile: 0,
    upgradesDowngradesNote: "",
  };
  let acquisition: AdminSubscriptionAnalyticsData["acquisition"] = {
    newSubscriptionsInRange: 0,
    newLearnersInRange: 0,
    newSubPerSignupPct: null,
    newSubscriptionsByDay: [],
    checkoutNote: "",
  };

  try {
    const [st] = await prisma.$queryRaw<
      Array<{
        total: bigint;
        active_grace: bigint;
        active: bigint;
        grace: bigint;
        past_due: bigint;
        cancelled: bigint;
      }>
    >`
      SELECT
        COUNT(*)::bigint AS total,
        COUNT(*) FILTER (WHERE status IN ('ACTIVE', 'GRACE'))::bigint AS active_grace,
        COUNT(*) FILTER (WHERE status = 'ACTIVE')::bigint AS active,
        COUNT(*) FILTER (WHERE status = 'GRACE')::bigint AS grace,
        COUNT(*) FILTER (WHERE status = 'PAST_DUE')::bigint AS past_due,
        COUNT(*) FILTER (WHERE status = 'CANCELLED')::bigint AS cancelled
      FROM "Subscription"
    `;
    overview = {
      subscriptionRowsTotal: Number(st?.total ?? 0),
      activeOrGrace: Number(st?.active_grace ?? 0),
      activePaid: Number(st?.active ?? 0),
      grace: Number(st?.grace ?? 0),
      pastDue: Number(st?.past_due ?? 0),
      cancelled: Number(st?.cancelled ?? 0),
    };
  } catch (e) {
    pushWarn(e, "overview");
  }

  try {
    const now = new Date();
    const in7 = new Date(now.getTime() + 7 * MS_DAY);

    const trialActiveLearners = await prisma.user.count({
      where: {
        role: UserRole.LEARNER,
        trialStatus: TrialStatus.ACTIVE,
        trialEndsAt: { gt: now },
      },
    });

    const trialEndingWithin7Days = await prisma.user.count({
      where: {
        role: UserRole.LEARNER,
        trialStatus: TrialStatus.ACTIVE,
        trialEndsAt: { gt: now, lte: in7 },
      },
    });

    const learnersWithPaidAccess = await prisma.user.count({
      where: {
        role: UserRole.LEARNER,
        subscriptions: { some: { status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.GRACE] } } },
      },
    });

    const trialOnlyNoPaidSub = await prisma.$queryRaw<[{ n: bigint }]>`
      SELECT COUNT(*)::bigint AS n
      FROM "User" u
      WHERE u.role = 'LEARNER'
        AND u."trialStatus" = 'ACTIVE'
        AND u."trialEndsAt" IS NOT NULL
        AND u."trialEndsAt" > NOW()
        AND NOT EXISTS (
          SELECT 1 FROM "Subscription" s
          WHERE s."userId" = u.id AND s.status IN ('ACTIVE', 'GRACE')
        )
    `;

    const byTs = await prisma.user.groupBy({
      by: ["trialStatus"],
      where: { role: UserRole.LEARNER },
      _count: { _all: true },
    });

    trial = {
      trialActiveLearners,
      trialEndingWithin7Days,
      learnersWithPaidAccess,
      trialOnlyNoPaidSub: Number(trialOnlyNoPaidSub[0]?.n ?? 0),
      byTrialStatus: byTs.map((r) => ({ status: String(r.trialStatus), learners: r._count._all })),
    };
  } catch (e) {
    pushWarn(e, "trial");
  }

  try {
    const pathRows = await prisma.$queryRaw<Array<{ pid: string | null; n: bigint; ap: bigint }>>`
      SELECT
        u."targetExamPathwayId" AS pid,
        COUNT(*)::bigint AS n,
        COUNT(*) FILTER (WHERE s.status = 'ACTIVE')::bigint AS ap
      FROM "Subscription" s
      INNER JOIN "User" u ON u.id = s."userId"
      WHERE u.role = 'LEARNER'
      GROUP BY u."targetExamPathwayId"
      ORDER BY n DESC
      LIMIT 28
    `;
    byPathway = pathRows.map((r) => ({
      pathwayId: r.pid,
      label: r.pid ?? "(no pathway)",
      subscriptions: Number(r.n),
      activePaid: Number(r.ap),
    }));
  } catch (e) {
    pushWarn(e, "byPathway");
  }

  try {
    const tierRows = await prisma.$queryRaw<Array<{ tier: string | null; ap: bigint; all: bigint }>>`
      SELECT
        s."planTier"::text AS tier,
        COUNT(*) FILTER (WHERE s.status = 'ACTIVE')::bigint AS ap,
        COUNT(*)::bigint AS all
      FROM "Subscription" s
      GROUP BY s."planTier"
      ORDER BY all DESC
    `;
    byPlanTier = tierRows.map((r) => ({
      tier: r.tier,
      activePaid: Number(r.ap),
      allRows: Number(r.all),
    }));

    const countryRows = await prisma.$queryRaw<Array<{ c: string | null; ap: bigint; all: bigint }>>`
      SELECT
        s."planCountry"::text AS c,
        COUNT(*) FILTER (WHERE s.status = 'ACTIVE')::bigint AS ap,
        COUNT(*)::bigint AS all
      FROM "Subscription" s
      GROUP BY s."planCountry"
      ORDER BY all DESC
    `;
    byPlanCountry = countryRows.map((r) => ({
      country: r.c,
      activePaid: Number(r.ap),
      allRows: Number(r.all),
    }));
  } catch (e) {
    pushWarn(e, "byPlan");
  }

  try {
    const [ch] = await prisma.$queryRaw<[{ canc: bigint; pd: bigint; grace: bigint; pdu: bigint }]>`
      SELECT
        COUNT(*) FILTER (
          WHERE status = 'CANCELLED' AND "updatedAt" >= ${q.from} AND "updatedAt" <= ${q.to}
        )::bigint AS canc,
        COUNT(*) FILTER (
          WHERE status = 'PAST_DUE' AND "updatedAt" >= ${q.from} AND "updatedAt" <= ${q.to}
        )::bigint AS pd,
        COUNT(*) FILTER (WHERE status = 'GRACE')::bigint AS grace,
        COUNT(*) FILTER (WHERE status = 'PAST_DUE')::bigint AS pdu
      FROM "Subscription"
    `;
    churnAndRisk = {
      cancelledUpdatedInRange: Number(ch?.canc ?? 0),
      pastDueUpdatedInRange: Number(ch?.pd ?? 0),
      graceRows: Number(ch?.grace ?? 0),
      pastDueRows: Number(ch?.pdu ?? 0),
      note: "PAST_DUE / GRACE counts are current snapshot; “updated in range” flags status changes touching the window.",
    };
  } catch (e) {
    pushWarn(e, "churn");
  }

  try {
    const [mismatch] = await prisma.$queryRaw<[{ n: bigint }]>`
      SELECT COUNT(*)::bigint AS n
      FROM "Subscription" s
      INNER JOIN "User" u ON u.id = s."userId"
      WHERE s.status = 'ACTIVE'
        AND s."planTier" IS NOT NULL
        AND s."planTier"::text != u.tier::text
    `;
    planDrift = {
      activeTierMismatchVsProfile: Number(mismatch?.n ?? 0),
      upgradesDowngradesNote:
        "True upgrade/downgrade events are not stored. Mismatch counts ACTIVE rows where Stripe plan tier differs from the learner profile tier (often after plan changes or legacy accounts).",
    };
  } catch (e) {
    pushWarn(e, "planDrift");
  }

  try {
    const newSubs = await prisma.subscription.count({
      where: { createdAt: { gte: q.from, lte: q.to } },
    });
    const newLearners = await prisma.user.count({
      where: { role: UserRole.LEARNER, createdAt: { gte: q.from, lte: q.to } },
    });
    const newSubPerSignupPct =
      newLearners > 0 ? Math.round((newSubs / newLearners) * 1000) / 10 : newSubs > 0 ? 100 : null;

    const dayRows = await prisma.$queryRaw<Array<{ d: Date; n: bigint }>>`
      SELECT date_trunc('day', "createdAt" AT TIME ZONE 'UTC') AS d, COUNT(*)::bigint AS n
      FROM "Subscription"
      WHERE "createdAt" >= ${q.from} AND "createdAt" <= ${q.to}
      GROUP BY 1
      ORDER BY 1 ASC
    `;
    acquisition = {
      newSubscriptionsInRange: newSubs,
      newLearnersInRange: newLearners,
      newSubPerSignupPct,
      newSubscriptionsByDay: dayRows.map((r) => ({
        day: r.d.toISOString().slice(0, 10),
        count: Number(r.n),
      })),
      checkoutNote:
        "Ratio is subscription rows created ÷ new learner accounts — not checkout sessions. Use PostHog `checkout_started` vs `learner_conversion_subscribed` for checkout conversion.",
    };
  } catch (e) {
    pushWarn(e, "acquisition");
  }

  return {
    generatedAt,
    query: q,
    degraded: warnings.length > 0,
    warnings,
    dataNotes,
    overview,
    trial,
    byPathway,
    byPlanTier,
    byPlanCountry,
    churnAndRisk,
    planDrift,
    acquisition,
  };
}
