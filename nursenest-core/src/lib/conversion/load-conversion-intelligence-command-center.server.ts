import "server-only";

import { Prisma, SubscriptionStatus, UserRole, type CountryCode, type TierCode } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured, withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import { isRuntimeSafeMode } from "@/lib/runtime/safe-mode";
import {
  durationMonths,
  getAlliedDisplayPrice,
  getDisplayTotalMajorUnits,
} from "@/lib/pricing/display-catalog";
import type { BillingDuration } from "@/lib/pricing/billing-types";
import { posthogHogqlScalar, posthogProjectConfigured } from "@/lib/observability/posthog-hogql-query";
import { PH } from "@/lib/observability/posthog-conversion-events";
import {
  buildConversionFunnel,
  buildConversionIntelligenceReport,
  CONVERSION_COHORTS,
  CONVERSION_STAGE_LABELS,
  type ContentAttributionInput,
  type ConversionCohort,
  type ConversionIntelligenceReport,
  type ConversionStage,
  type ConversionStageMetric,
  type FeatureDiscoveryInput,
  type PricingIntelligenceInput,
} from "@/lib/conversion/conversion-intelligence-engine";

const CIE_TIMEOUT_MS = 6000;
const DAY_MS = 24 * 60 * 60 * 1000;

export type ConversionIntelligenceCommandCenterData = {
  generatedAt: string;
  source: "posthog_hogql" | "database_proxy" | "unavailable";
  degraded: boolean;
  fromDay: string;
  toDay: string;
  report: ConversionIntelligenceReport;
  notes: string[];
};

type SubscriptionRevenueRow = {
  planTier: TierCode | null;
  planCountry: CountryCode | null;
  planDuration: string | null;
  alliedCareer: string | null;
  planCode: string | null;
  cancelAtPeriodEnd: boolean;
};

type FeatureDiscoveryRow = {
  feature: string | null;
  explorers: bigint | number | null;
  subscribers: bigint | number | null;
};

function utcDayString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function startOfUtcDay(day: string): Date {
  return new Date(`${day}T00:00:00.000Z`);
}

function endOfUtcDay(day: string): Date {
  return new Date(`${day}T23:59:59.999Z`);
}

function toNumber(value: bigint | number | null | undefined): number {
  if (typeof value === "bigint") return Number(value);
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function normalizeDuration(value: string | null): BillingDuration {
  if (value === "3-month" || value === "6-month" || value === "yearly" || value === "monthly") return value;
  if (value === "annual" || value === "year" || value === "1-year") return "yearly";
  if (value === "month" || value === "1-month") return "monthly";
  return "monthly";
}

function billingCatalogCountry(value: CountryCode | null): "CA" | "US" {
  return value === "US" ? "US" : "CA";
}

function subscriptionRevenueCents(row: SubscriptionRevenueRow): number {
  const duration = normalizeDuration(row.planDuration);
  const country = billingCatalogCountry(row.planCountry);
  if (row.planTier === "ALLIED") {
    return Math.round(getAlliedDisplayPrice(country, duration) * 100);
  }
  if (!row.planTier) return 0;
  return Math.round((getDisplayTotalMajorUnits(country, row.planTier, duration) ?? 0) * 100);
}

function cohortWhere(cohort: ConversionCohort): Prisma.UserWhereInput {
  switch (cohort) {
    case "RN":
      return { OR: [{ targetExamPathwayId: { contains: "rn", mode: "insensitive" } }, { targetExamPathwayId: null }] };
    case "RPN":
      return { targetExamPathwayId: { contains: "pn", mode: "insensitive" } };
    case "NP":
      return { OR: [{ targetExamPathwayId: { contains: "np", mode: "insensitive" } }, { targetExamPathwayId: { contains: "cnple", mode: "insensitive" } }] };
    case "RT":
      return { targetExamPathwayId: { contains: "rt", mode: "insensitive" } };
    case "Allied":
      return { targetExamPathwayId: { contains: "allied", mode: "insensitive" } };
    case "NewGrad":
      return { targetExamPathwayId: { contains: "new", mode: "insensitive" } };
    case "HESI":
      return { targetExamPathwayId: { contains: "hesi", mode: "insensitive" } };
    case "TEAS":
      return { targetExamPathwayId: { contains: "teas", mode: "insensitive" } };
    case "ECGCore":
      return { targetExamPathwayId: { contains: "ecg", mode: "insensitive" } };
    case "AdvancedECG":
      return { targetExamPathwayId: { contains: "advanced", mode: "insensitive" } };
  }
}

function subscriptionPlanWhere(cohort: ConversionCohort): Prisma.SubscriptionWhereInput {
  switch (cohort) {
    case "RN":
      return { OR: [{ planTier: "RN" }, { planTier: null, user: cohortWhere(cohort) }] };
    case "RPN":
      return { OR: [{ planTier: { in: ["RPN", "LVN_LPN"] } }, { user: cohortWhere(cohort) }] };
    case "NP":
      return { OR: [{ planTier: "NP" }, { user: cohortWhere(cohort) }] };
    case "Allied":
    case "RT":
      return { OR: [{ planTier: "ALLIED" }, { user: cohortWhere(cohort) }] };
    case "NewGrad":
      return { OR: [{ planTier: "NEW_GRAD" }, { user: cohortWhere(cohort) }] };
    case "AdvancedECG":
      return { planCode: { contains: "advanced_ecg", mode: "insensitive" } };
    case "ECGCore":
    case "HESI":
    case "TEAS":
      return { user: cohortWhere(cohort) };
  }
}

function featureFromActivity(value: string | null): FeatureDiscoveryInput["feature"] | null {
  const normalized = String(value ?? "").toLowerCase();
  if (normalized.includes("question")) return "questions";
  if (normalized.includes("flashcard")) return "flashcards";
  if (normalized.includes("lesson")) return "lessons";
  if (normalized.includes("clinical")) return "clinical_skills";
  if (normalized.includes("pharm")) return "pharmacology";
  if (normalized.includes("ecg")) return "ecg";
  if (normalized.includes("cat") || normalized.includes("practice")) return "cat";
  if (normalized.includes("loft") || normalized.includes("simulation")) return "loft";
  return null;
}

function planType(row: SubscriptionRevenueRow): PricingIntelligenceInput["planType"] {
  const code = String(row.planCode ?? "").toLowerCase();
  if (code.includes("module") || code.includes("addon") || code.includes("advanced_ecg")) return "addon";
  const duration = normalizeDuration(row.planDuration);
  if (duration === "yearly") return "annual";
  if (duration === "3-month" || duration === "6-month") return "bundle";
  return "monthly";
}

function escapeSqlString(value: string): string {
  return value.replace(/'/g, "''");
}

function hogqlCount(event: string, fromDay: string, toDay: string, extraPredicate = ""): Promise<number | null> {
  return posthogHogqlScalar(`
    SELECT uniq(person_id)
    FROM events
    WHERE event = '${escapeSqlString(event)}'
      AND timestamp >= toDateTime('${escapeSqlString(fromDay)} 00:00:00')
      AND timestamp <= toDateTime('${escapeSqlString(toDay)} 23:59:59')
      ${extraPredicate}
  `.trim()).then((result) => (result.ok && result.scalar != null ? Math.round(result.scalar) : null));
}

function cohortPredicate(cohort: ConversionCohort): string {
  const needles: Record<ConversionCohort, string[]> = {
    RN: ["rn", "nclex"],
    RPN: ["rpn", "pn", "rex"],
    NP: ["np", "cnple"],
    RT: ["rt", "respiratory"],
    Allied: ["allied"],
    NewGrad: ["new"],
    HESI: ["hesi"],
    TEAS: ["teas"],
    ECGCore: ["ecg"],
    AdvancedECG: ["advanced"],
  };
  const parts = needles[cohort].map((needle) => `positionCaseInsensitive(toString(properties.pathway_id), '${escapeSqlString(needle)}') > 0`);
  return `AND (${parts.join(" OR ")})`;
}

async function posthogFunnel(cohort: ConversionCohort, fromDay: string, toDay: string): Promise<ReturnType<typeof buildConversionFunnel>> {
  const pred = cohortPredicate(cohort);
  const values = await Promise.all([
    hogqlCount(PH.funnelHomepageViewed, fromDay, toDay, pred),
    hogqlCount(PH.funnelExamHubViewed, fromDay, toDay, pred),
    hogqlCount("$pageview", fromDay, toDay, `${pred} AND positionCaseInsensitive(toString(properties.$current_url), 'pricing') > 0`),
    hogqlCount(PH.signupSuccessClient, fromDay, toDay, pred),
    hogqlCount(PH.trialStarted, fromDay, toDay, pred),
    hogqlCount(PH.funnelExamHubStudyIntent, fromDay, toDay, pred),
    hogqlCount(PH.checkoutStarted, fromDay, toDay, pred),
    hogqlCount(PH.learnerConversionSubscribed, fromDay, toDay, pred),
    hogqlCount(PH.funnelSubscriptionRenewed, fromDay, toDay, pred),
  ]);
  const allStages: ConversionStageMetric[] = [
    { stage: "anonymous_visitor", label: CONVERSION_STAGE_LABELS.anonymous_visitor, count: values[0] },
    { stage: "marketing_page", label: CONVERSION_STAGE_LABELS.marketing_page, count: values[1] },
    { stage: "pricing", label: CONVERSION_STAGE_LABELS.pricing, count: values[2] },
    { stage: "signup", label: CONVERSION_STAGE_LABELS.signup, count: values[3] },
    { stage: "trial_or_free_access", label: CONVERSION_STAGE_LABELS.trial_or_free_access, count: values[4] },
    { stage: "feature_exploration", label: CONVERSION_STAGE_LABELS.feature_exploration, count: values[5] },
    { stage: "checkout", label: CONVERSION_STAGE_LABELS.checkout, count: values[6] },
    { stage: "subscription", label: CONVERSION_STAGE_LABELS.subscription, count: values[7] },
    { stage: "retention", label: CONVERSION_STAGE_LABELS.retention, count: values[8] },
  ];
  const stages = allStages.filter((stage) => stage.count != null);
  return buildConversionFunnel(cohort, stages);
}

async function databaseFunnel(cohort: ConversionCohort, from: Date, to: Date): Promise<ReturnType<typeof buildConversionFunnel>> {
  const userBase: Prisma.UserWhereInput = { role: UserRole.LEARNER, ...cohortWhere(cohort) };
  const [signups, subscribers, trials, explorers, retained] = await Promise.all([
    prisma.user.count({ where: { ...userBase, createdAt: { gte: from, lte: to } } }),
    prisma.subscription.count({
      where: { ...subscriptionPlanWhere(cohort), createdAt: { gte: from, lte: to } },
    }),
    prisma.subscription.count({
      where: { ...subscriptionPlanWhere(cohort), trialEnd: { not: null }, createdAt: { gte: from, lte: to } },
    }),
    prisma.learnerActivityEvent.count({
      where: { createdAt: { gte: from, lte: to }, user: userBase },
    }),
    prisma.subscription.count({
      where: {
        ...subscriptionPlanWhere(cohort),
        status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.GRACE] },
        createdAt: { lt: from },
        updatedAt: { lte: to },
      },
    }),
  ]);
  return buildConversionFunnel(cohort, [
    { stage: "signup", label: CONVERSION_STAGE_LABELS.signup, count: signups },
    { stage: "trial_or_free_access", label: CONVERSION_STAGE_LABELS.trial_or_free_access, count: trials },
    { stage: "feature_exploration", label: CONVERSION_STAGE_LABELS.feature_exploration, count: explorers },
    { stage: "subscription", label: CONVERSION_STAGE_LABELS.subscription, count: subscribers },
    { stage: "retention", label: CONVERSION_STAGE_LABELS.retention, count: retained },
  ]);
}

async function loadPricingAndAttribution(from: Date, to: Date): Promise<{
  pricing: PricingIntelligenceInput[];
  attribution: ContentAttributionInput[];
}> {
  const rows = await prisma.subscription.findMany({
    where: { createdAt: { gte: from, lte: to } },
    select: {
      planTier: true,
      planCountry: true,
      planDuration: true,
      alliedCareer: true,
      planCode: true,
      cancelAtPeriodEnd: true,
    },
    take: 5000,
  });
  const byPlan = new Map<string, PricingIntelligenceInput & { cancelled: number }>();
  for (const row of rows) {
    const code = row.planCode ?? `${row.planCountry ?? "CA"}_${row.planTier ?? "unknown"}_${normalizeDuration(row.planDuration)}`.toLowerCase();
    const current = byPlan.get(code) ?? {
      planCode: code,
      planType: planType(row),
      starts: 0,
      completions: 0,
      revenueCents: 0,
      retainedSubscriptions: 0,
      cancelled: 0,
    };
    current.starts += 1;
    current.completions += 1;
    current.revenueCents += subscriptionRevenueCents(row);
    if (!row.cancelAtPeriodEnd) current.retainedSubscriptions = (current.retainedSubscriptions ?? 0) + 1;
    if (row.cancelAtPeriodEnd) current.cancelled += 1;
    byPlan.set(code, current);
  }
  const pricing = [...byPlan.values()].map(({ cancelled: _cancelled, ...row }) => row);
  const attribution = pricing.map((row) => ({
    page: `/pricing?plan=${encodeURIComponent(row.planCode)}`,
    pageType: "pricing" as const,
    revenueCents: row.revenueCents,
    subscriptions: row.completions,
    assistedCheckouts: row.starts,
  }));
  return { pricing, attribution };
}

async function loadFeatureDiscovery(from: Date, to: Date): Promise<FeatureDiscoveryInput[]> {
  const rows = await prisma.$queryRaw<FeatureDiscoveryRow[]>`
    SELECT
      e.activity_type AS feature,
      COUNT(DISTINCT e.user_id)::bigint AS explorers,
      COUNT(DISTINCT s."userId")::bigint AS subscribers
    FROM learner_activity_events e
    LEFT JOIN "Subscription" s
      ON s."userId" = e.user_id
      AND s."createdAt" >= ${from}
      AND s."createdAt" <= ${to}
    WHERE e.created_at >= ${from}
      AND e.created_at <= ${to}
    GROUP BY e.activity_type
    ORDER BY explorers DESC
  `;
  const byFeature = new Map<FeatureDiscoveryInput["feature"], FeatureDiscoveryInput>();
  for (const row of rows) {
    const feature = featureFromActivity(row.feature);
    if (!feature) continue;
    const current = byFeature.get(feature) ?? { feature, explorers: 0, subscribersAfterExploration: 0, repeatUsers: 0 };
    current.explorers += toNumber(row.explorers);
    current.subscribersAfterExploration += toNumber(row.subscribers);
    byFeature.set(feature, current);
  }
  return [...byFeature.values()];
}

function unavailableReport(generatedAt: string, fromDay: string, toDay: string): ConversionIntelligenceCommandCenterData {
  return {
    generatedAt,
    fromDay,
    toDay,
    source: "unavailable",
    degraded: true,
    notes: ["Database and PostHog metrics are unavailable in this runtime."],
    report: buildConversionIntelligenceReport({ generatedAt, funnels: [] }),
  };
}

export async function loadConversionIntelligenceCommandCenter(input?: {
  fromDay?: string;
  toDay?: string;
}): Promise<ConversionIntelligenceCommandCenterData> {
  const generatedAt = new Date().toISOString();
  const today = utcDayString(new Date());
  const toDay = input?.toDay ?? today;
  const fromDay = input?.fromDay ?? utcDayString(new Date(endOfUtcDay(toDay).getTime() - 29 * DAY_MS));
  const from = startOfUtcDay(fromDay);
  const to = endOfUtcDay(toDay);

  if (!isDatabaseUrlConfigured() || isRuntimeSafeMode()) return unavailableReport(generatedAt, fromDay, toDay);

  return withDatabaseFallbackTimeout(
    async () => {
      const [pricingAndAttribution, featureDiscovery, funnels] = await Promise.all([
        loadPricingAndAttribution(from, to),
        loadFeatureDiscovery(from, to),
        posthogProjectConfigured()
          ? Promise.all(CONVERSION_COHORTS.map((cohort) => posthogFunnel(cohort, fromDay, toDay)))
          : Promise.all(CONVERSION_COHORTS.map((cohort) => databaseFunnel(cohort, from, to))),
      ]);
      const source = posthogProjectConfigured() ? "posthog_hogql" : "database_proxy";
      const report = buildConversionIntelligenceReport({
        generatedAt,
        funnels,
        contentAttribution: pricingAndAttribution.attribution,
        featureDiscovery,
        pricing: pricingAndAttribution.pricing,
      });

      return {
        generatedAt,
        source,
        degraded: source !== "posthog_hogql",
        fromDay,
        toDay,
        report,
        notes: [
          source === "posthog_hogql"
            ? "Funnel stages use PostHog unique-person counts. Pricing and revenue use NurseNest subscription mirrors."
            : "PostHog query API is not configured; marketing-page, pricing-view, checkout-start, and page attribution use database proxies where available.",
          "Revenue is an operational catalog estimate from subscription rows; Stripe remains the billing source of truth.",
          "Use this dashboard to identify cohort drop-off, feature discovery lift, pricing weakness, and instrumentation gaps.",
        ],
      } satisfies ConversionIntelligenceCommandCenterData;
    },
    unavailableReport(generatedAt, fromDay, toDay),
    CIE_TIMEOUT_MS,
    { scope: "conversion_intelligence", label: "command_center" },
  );
}
