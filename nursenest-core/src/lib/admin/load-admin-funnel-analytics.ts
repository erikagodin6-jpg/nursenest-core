/**
 * Funnel step counts via PostHog HogQL (unique persons per event in the date window).
 * When PostHog query API is not configured, returns an honest fallback with DB proxies where possible.
 */
import { CountryCode, Prisma, UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { isRuntimeSafeMode } from "@/lib/runtime/safe-mode";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { posthogHogqlScalar, posthogProjectConfigured } from "@/lib/observability/posthog-hogql-query";

export type FunnelSegment = {
  country: "ALL" | CountryCode;
  pathway: "ALL" | "__unset__" | string;
};

export type ParsedFunnelQuery = {
  fromDay: string;
  toDay: string;
  segment: FunnelSegment;
};

export type FunnelStepRow = {
  id: string;
  label: string;
  event: string;
  /** Unique persons (PostHog) or approximate count for DB-only rows. */
  count: number | null;
  /** Step-to-step vs previous step (same cohort window; not a strict ordered funnel). */
  conversionFromPriorPct: number | null;
  dropOffFromPriorPct: number | null;
  note?: string;
};

export type AdminFunnelAnalyticsData = {
  generatedAt: string;
  query: ParsedFunnelQuery;
  source: "posthog_hogql" | "database_proxy" | "unavailable";
  dataNotes: string[];
  warnings: string[];
  degraded: boolean;
  steps: FunnelStepRow[];
  posthogConfigured: boolean;
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

export function parseFunnelSearchParams(raw: Record<string, string | string[] | undefined>): ParsedFunnelQuery {
  const get = (k: string) => {
    const v = raw[k];
    return Array.isArray(v) ? v[0] : v;
  };

  const toDay = get("to");
  const fromDay = get("from");
  const today = utcDayString(new Date());
  let to = toDay ? endOfUtcDay(toDay) : endOfUtcDay(today);
  let from = fromDay ? startOfUtcDay(fromDay) : new Date(to.getTime() - 13 * MS_DAY);
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
  const country: ParsedFunnelQuery["segment"]["country"] =
    countryRaw === "CA" || countryRaw === "US" ? (countryRaw as CountryCode) : "ALL";

  const pathwayRaw = get("pathway") ?? "ALL";
  const pathway: ParsedFunnelQuery["segment"]["pathway"] =
    pathwayRaw === "ALL" || pathwayRaw === "__unset__" ? pathwayRaw : pathwayRaw;

  return {
    fromDay: utcDayString(from),
    toDay: utcDayString(to),
    segment: { country, pathway },
  };
}

function escapeSqlString(s: string): string {
  return s.replace(/'/g, "''");
}

/** Extra HogQL predicates from segment (properties on our captures). */
function segmentPredicate(segment: FunnelSegment): string {
  const parts: string[] = [];
  if (segment.country !== "ALL") {
    const c = escapeSqlString(segment.country);
    parts.push(
      `(properties.marketing_region = '${c}' OR properties.country = '${c}' OR toString(properties.plan_country) = '${c}')`,
    );
  }
  if (segment.pathway !== "ALL") {
    if (segment.pathway === "__unset__") {
      parts.push(`(properties.pathway_id IS NULL OR toString(properties.pathway_id) = '')`);
    } else if (/^[a-z0-9._-]+$/i.test(segment.pathway) && segment.pathway.length <= 96) {
      const p = escapeSqlString(segment.pathway);
      parts.push(`properties.pathway_id = '${p}'`);
    }
  }
  if (parts.length === 0) return "";
  return ` AND (${parts.join(" AND ")})`;
}

function buildUniquesQuery(event: string, fromDay: string, toDay: string, segment: FunnelSegment): string {
  const t0 = escapeSqlString(`${fromDay} 00:00:00`);
  const t1 = escapeSqlString(`${toDay} 23:59:59`);
  const seg = segmentPredicate(segment);
  return `
    SELECT uniq(person_id)
    FROM events
    WHERE event = '${escapeSqlString(event)}'
      AND timestamp >= toDateTime('${t0}')
      AND timestamp <= toDateTime('${t1}')
      ${seg}
  `.trim();
}

const STEP_DEF: Array<{ id: string; label: string; event: string; note?: string }> = [
  { id: "home_view", label: "Homepage viewed", event: PH.funnelHomepageViewed },
  { id: "home_to_hub_click", label: "Homepage → exam hub (click)", event: PH.funnelHomeToExamHub },
  { id: "exam_hub_view", label: "Exam hub viewed", event: PH.funnelExamHubViewed },
  { id: "hub_study_intent", label: "Exam hub → study surface (click)", event: PH.funnelExamHubStudyIntent },
  { id: "signup", label: "Signup completed (client)", event: PH.signupSuccessClient },
  { id: "checkout", label: "Checkout started", event: PH.checkoutStarted },
  { id: "subscribed", label: "First subscription (checkout)", event: PH.learnerConversionSubscribed },
  { id: "first_study", label: "First lesson progress (app)", event: PH.funnelFirstStudyProgress },
  { id: "repeat_study", label: "Repeat study day (2+ UTC days)", event: PH.funnelRepeatStudyDay },
  { id: "renewal", label: "Subscription renewal (invoice)", event: PH.funnelSubscriptionRenewed },
];

export async function loadAdminFunnelAnalytics(q: ParsedFunnelQuery): Promise<AdminFunnelAnalyticsData | null> {
  if (!isDatabaseUrlConfigured() || isRuntimeSafeMode()) {
    return null;
  }

  const generatedAt = new Date().toISOString();
  const warnings: string[] = [];
  const dataNotes: string[] = [
    "Step counts are **unique persons** in the selected window who fired each event (not necessarily the same users in sequence). For strict ordered funnels, use PostHog’s Funnel insight on these event names.",
    "Segment filters match `properties` we attach in code (`marketing_region`, `country`, `pathway_id`). Events without those properties may be excluded when a segment is set.",
    "Database fallback counts are operational proxies (signups, subscriptions, progress) — not identical to PostHog uniques.",
  ];

  const from = startOfUtcDay(q.fromDay);
  const to = endOfUtcDay(q.toDay);

  const posthogConfigured = posthogProjectConfigured();

  if (posthogConfigured) {
    const steps: FunnelStepRow[] = [];
    let prior: number | null = null;

    for (const def of STEP_DEF) {
      const sql = buildUniquesQuery(def.event, q.fromDay, q.toDay, q.segment);
      const res = await posthogHogqlScalar(sql);
      if (!res.ok || res.scalar === null) {
        warnings.push(`${def.event}: ${res.error ?? "no result"}`);
        steps.push({
          id: def.id,
          label: def.label,
          event: def.event,
          count: null,
          conversionFromPriorPct: null,
          dropOffFromPriorPct: null,
          note: def.note,
        });
        continue;
      }

      const count = Math.round(res.scalar);
      let conversionFromPriorPct: number | null = null;
      let dropOffFromPriorPct: number | null = null;
      if (prior !== null && prior > 0) {
        conversionFromPriorPct = Math.round((count / prior) * 1000) / 10;
        dropOffFromPriorPct = Math.round((1 - count / prior) * 1000) / 10;
      }
      prior = count;

      steps.push({
        id: def.id,
        label: def.label,
        event: def.event,
        count,
        conversionFromPriorPct,
        dropOffFromPriorPct,
        note: def.note,
      });
    }

    return {
      generatedAt,
      query: q,
      source: "posthog_hogql",
      dataNotes,
      warnings,
      degraded: warnings.length > 0,
      steps,
      posthogConfigured: true,
    };
  }

  /** DB-only proxies — no marketing funnel without PostHog. */
  try {
    const userWhere: Parameters<typeof prisma.user.count>[0]["where"] = {
      role: UserRole.LEARNER,
      createdAt: { gte: from, lte: to },
    };
    if (q.segment.country !== "ALL") userWhere.country = q.segment.country;
    if (q.segment.pathway === "__unset__") userWhere.targetExamPathwayId = null;
    else if (q.segment.pathway !== "ALL") userWhere.targetExamPathwayId = q.segment.pathway;

    const newUsers = await prisma.user.count({ where: userWhere });

    const userSeg: Prisma.UserWhereInput = { role: UserRole.LEARNER };
    if (q.segment.country !== "ALL") userSeg.country = q.segment.country;
    if (q.segment.pathway === "__unset__") userSeg.targetExamPathwayId = null;
    else if (q.segment.pathway !== "ALL") userSeg.targetExamPathwayId = q.segment.pathway;

    const subWhere: Prisma.SubscriptionWhereInput = {
      createdAt: { gte: from, lte: to },
      user: q.segment.country !== "ALL" || q.segment.pathway !== "ALL" ? userSeg : { role: UserRole.LEARNER },
    };

    const newSubscriptions = await prisma.subscription.count({ where: subWhere });

    const firstProgressUsers = await prisma.$queryRaw<[{ n: bigint }]>`
      SELECT COUNT(*)::bigint AS n
      FROM (
        SELECT p."userId"
        FROM "Progress" p
        INNER JOIN "User" u ON u.id = p."userId"
        WHERE u.role = 'LEARNER'
          ${q.segment.country !== "ALL" ? Prisma.sql`AND u.country = ${q.segment.country}::"CountryCode"` : Prisma.empty}
          ${
            q.segment.pathway === "__unset__"
              ? Prisma.sql`AND u."targetExamPathwayId" IS NULL`
              : q.segment.pathway !== "ALL"
                ? Prisma.sql`AND u."targetExamPathwayId" = ${q.segment.pathway}`
                : Prisma.empty
          }
        GROUP BY p."userId"
        HAVING MIN(p."createdAt") >= ${from} AND MIN(p."createdAt") <= ${to}
      ) x
    `;
    const firstProg = Number(firstProgressUsers[0]?.n ?? 0);

    const steps: FunnelStepRow[] = [
      {
        id: "proxy_note",
        label: "PostHog not configured — homepage / hub / checkout funnels unavailable here",
        event: "—",
        count: null,
        conversionFromPriorPct: null,
        dropOffFromPriorPct: null,
        note: "Set POSTHOG_PERSONAL_API_KEY and POSTHOG_PROJECT_ID for full funnel metrics.",
      },
      {
        id: "signup_proxy",
        label: "New learners (signup proxy)",
        event: "User.createdAt",
        count: newUsers,
        conversionFromPriorPct: null,
        dropOffFromPriorPct: null,
      },
      {
        id: "sub_proxy",
        label: "New subscription rows (checkout proxy)",
        event: "Subscription.createdAt",
        count: newSubscriptions,
        conversionFromPriorPct:
          newUsers > 0 ? Math.round((newSubscriptions / newUsers) * 1000) / 10 : null,
        dropOffFromPriorPct:
          newUsers > 0 ? Math.round((1 - newSubscriptions / newUsers) * 1000) / 10 : null,
      },
      {
        id: "first_prog_proxy",
        label: "Learners whose first progress row falls in window",
        event: "Progress (approx)",
        count: firstProg,
        conversionFromPriorPct:
          newUsers > 0 ? Math.round((firstProg / newUsers) * 1000) / 10 : null,
        dropOffFromPriorPct: newUsers > 0 ? Math.round((1 - firstProg / newUsers) * 1000) / 10 : null,
      },
    ];

    return {
      generatedAt,
      query: q,
      source: "database_proxy",
      dataNotes,
      warnings,
      degraded: true,
      steps,
      posthogConfigured: false,
    };
  } catch (e) {
    warnings.push(e instanceof Error ? e.message : String(e));
    return {
      generatedAt,
      query: q,
      source: "unavailable",
      dataNotes,
      warnings,
      degraded: true,
      steps: [],
      posthogConfigured: false,
    };
  }
}
