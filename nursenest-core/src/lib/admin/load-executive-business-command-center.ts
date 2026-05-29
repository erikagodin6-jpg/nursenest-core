import { SubscriptionStatus, UserRole, type CountryCode, type TierCode } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured, withDatabaseFallback } from "@/lib/db/safe-database";
import {
  durationMonths,
  getAlliedDisplayPrice,
  getDisplayTotalMajorUnits,
} from "@/lib/pricing/display-catalog";
import type { BillingDuration } from "@/lib/pricing/billing-types";
import { isRuntimeSafeMode } from "@/lib/runtime/safe-mode";

export type ExecutiveHealthStatus = "green" | "yellow" | "red";

export type ExecutiveBusinessMetric = {
  label: string;
  value: string;
  status: ExecutiveHealthStatus;
  note?: string;
};

export type ExecutiveBusinessCommandCenterData = {
  generatedAt: string;
  degraded: boolean;
  notes: string[];
  revenue: {
    mrr: ExecutiveBusinessMetric;
    arr: ExecutiveBusinessMetric;
    revenueYesterday: ExecutiveBusinessMetric;
    referralRevenue: ExecutiveBusinessMetric;
    institutionRevenue: ExecutiveBusinessMetric;
    refunds: ExecutiveBusinessMetric;
    chargebacks: ExecutiveBusinessMetric;
    failedPayments: ExecutiveBusinessMetric;
  };
  subscriptions: {
    newSubscribers: ExecutiveBusinessMetric;
    cancelledSubscribers: ExecutiveBusinessMetric;
  };
  learnerActivity: {
    activeLearners: ExecutiveBusinessMetric;
    studySessions: ExecutiveBusinessMetric;
    questionsAnswered: ExecutiveBusinessMetric;
  };
  uptime: {
    flashcards: ExecutiveBusinessMetric;
    cat: ExecutiveBusinessMetric;
    questions: ExecutiveBusinessMetric;
    systemHealth: ExecutiveBusinessMetric;
  };
  topProducts: Array<{ label: string; value: string; status: ExecutiveHealthStatus; note?: string }>;
  topReferralSources: Array<{ label: string; value: string; status: ExecutiveHealthStatus; note?: string }>;
};

type ActiveSubscriptionRow = {
  planTier: TierCode | null;
  planCountry: CountryCode | null;
  planDuration: string | null;
  alliedCareer: string | null;
  createdAt: Date;
};

type CountRow = { n: bigint | number | null };
type GroupCountRow = { label: string | null; n: bigint | number | null };

const DAY_MS = 24 * 60 * 60 * 1000;

function toNumber(value: bigint | number | null | undefined): number {
  if (typeof value === "bigint") return Number(value);
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function cad(value: number | null): string {
  if (value === null) return "Stripe";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value);
}

function integer(value: number): string {
  return new Intl.NumberFormat("en-CA", { maximumFractionDigits: 0 }).format(value);
}

function pct(value: number | null): string {
  if (value === null) return "No data";
  return `${value.toFixed(value % 1 === 0 ? 0 : 1)}%`;
}

function metric(
  label: string,
  value: string,
  status: ExecutiveHealthStatus,
  note?: string,
): ExecutiveBusinessMetric {
  return { label, value, status, note };
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

function monthlyEquivalent(row: ActiveSubscriptionRow): number | null {
  const duration = normalizeDuration(row.planDuration);
  const country = billingCatalogCountry(row.planCountry);
  if (row.planTier === "ALLIED") {
    return getAlliedDisplayPrice(country, duration) / durationMonths(duration);
  }
  if (!row.planTier) return null;
  const total = getDisplayTotalMajorUnits(country, row.planTier, duration);
  return total == null ? null : total / durationMonths(duration);
}

function planLabel(row: { planTier: TierCode | null; planDuration: string | null; alliedCareer?: string | null }) {
  const tier = row.planTier ?? "Unknown";
  const career = row.planTier === "ALLIED" && row.alliedCareer ? ` · ${row.alliedCareer}` : "";
  return `${tier}${career} · ${normalizeDuration(row.planDuration)}`;
}

async function syntheticUptime(checkLike: string): Promise<number | null> {
  const rows = await prisma.$queryRaw<Array<{ total: bigint; passed: bigint }>>`
    SELECT
      COUNT(*)::bigint AS total,
      COUNT(*) FILTER (WHERE status = 'pass')::bigint AS passed
    FROM "synthetic_learning_check_results"
    WHERE checked_at >= NOW() - INTERVAL '24 hours'
      AND LOWER(check_name) LIKE ${`%${checkLike.toLowerCase()}%`}
  `;
  const total = toNumber(rows[0]?.total);
  if (total === 0) return null;
  return Math.round((toNumber(rows[0]?.passed) / total) * 1000) / 10;
}

function uptimeStatus(value: number | null): ExecutiveHealthStatus {
  if (value === null) return "yellow";
  if (value >= 99) return "green";
  if (value >= 95) return "yellow";
  return "red";
}

function countStatus(value: number, warnAt: number, redAt: number): ExecutiveHealthStatus {
  if (value >= redAt) return "red";
  if (value >= warnAt) return "yellow";
  return "green";
}

function growthStatus(value: number): ExecutiveHealthStatus {
  if (value > 0) return "green";
  return "yellow";
}

function emptyCommandCenter(generatedAt: string): ExecutiveBusinessCommandCenterData {
  const noDb = "Database metrics unavailable in this runtime.";
  return {
    generatedAt,
    degraded: true,
    notes: [noDb],
    revenue: {
      mrr: metric("MRR", "No data", "yellow", noDb),
      arr: metric("ARR", "No data", "yellow", noDb),
      revenueYesterday: metric("Revenue Yesterday", "No data", "yellow", noDb),
      referralRevenue: metric("Referral Revenue", "Stripe", "yellow", "Attribution rows are in-app; revenue amount remains Stripe-side."),
      institutionRevenue: metric("Institution Revenue", "Stripe", "yellow", "Institution billing amount remains Stripe-side."),
      refunds: metric("Refunds", "Stripe", "yellow", "Refund amount is not persisted in NurseNest DB."),
      chargebacks: metric("Chargebacks", "Stripe", "yellow", "Dispute amount is not persisted in NurseNest DB."),
      failedPayments: metric("Failed Payments", "No data", "yellow", noDb),
    },
    subscriptions: {
      newSubscribers: metric("New Subscribers", "No data", "yellow", noDb),
      cancelledSubscribers: metric("Cancelled Subscribers", "No data", "yellow", noDb),
    },
    learnerActivity: {
      activeLearners: metric("Active Learners", "No data", "yellow", noDb),
      studySessions: metric("Study Sessions", "No data", "yellow", noDb),
      questionsAnswered: metric("Questions Answered", "No data", "yellow", noDb),
    },
    uptime: {
      flashcards: metric("Flashcard Uptime", "No data", "yellow", noDb),
      cat: metric("CAT Uptime", "No data", "yellow", noDb),
      questions: metric("Question Uptime", "No data", "yellow", noDb),
      systemHealth: metric("System Health", "Watch", "yellow", noDb),
    },
    topProducts: [],
    topReferralSources: [],
  };
}

export async function loadExecutiveBusinessCommandCenter(): Promise<ExecutiveBusinessCommandCenterData> {
  const generatedAt = new Date().toISOString();
  if (!isDatabaseUrlConfigured() || isRuntimeSafeMode()) return emptyCommandCenter(generatedAt);

  return withDatabaseFallback(async () => {
    const now = new Date();
    const startToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const startYesterday = new Date(startToday.getTime() - DAY_MS);
    const since24h = new Date(now.getTime() - DAY_MS);

    const [
      activeSubscriptions,
      newSubscribers,
      cancelledSubscribers,
      failedPayments,
      activeLearners,
      studySessions,
      questionsAnswered,
      referralQualified,
      referralPaid,
      activeInstitutions,
      productRows,
      referralRows,
      flashcardUptime,
      catUptime,
      questionUptime,
    ] = await Promise.all([
      prisma.subscription.findMany({
        where: { status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.GRACE] } },
        select: { planTier: true, planCountry: true, planDuration: true, alliedCareer: true, createdAt: true },
      }),
      prisma.subscription.count({ where: { createdAt: { gte: startYesterday, lt: startToday } } }),
      prisma.subscription.count({
        where: { status: SubscriptionStatus.CANCELLED, updatedAt: { gte: startYesterday, lt: startToday } },
      }),
      prisma.subscription.count({ where: { status: SubscriptionStatus.PAST_DUE } }),
      prisma.user.count({
        where: {
          role: UserRole.LEARNER,
          OR: [
            { lastLoginAt: { gte: since24h } },
            { learnerActivityEvents: { some: { createdAt: { gte: since24h } } } },
          ],
        },
      }),
      prisma.learnerActivityEvent.count({ where: { lifecycle: "started", createdAt: { gte: since24h } } }),
      prisma.examQuestionPracticeAnswerAttempt.count({ where: { createdAt: { gte: since24h } } }),
      prisma.referralAttribution.count({ where: { qualifiedAt: { gte: startYesterday, lt: startToday } } }),
      prisma.referralAttribution.count({ where: { firstSubscribedAt: { gte: startYesterday, lt: startToday } } }),
      prisma.institutionalOrganization.count({ where: { status: "active" } }),
      prisma.subscription.groupBy({
        by: ["planTier", "planDuration", "alliedCareer"],
        where: { status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.GRACE] } },
        _count: { _all: true },
        orderBy: { _count: { id: "desc" } },
        take: 6,
      }),
      prisma.$queryRaw<GroupCountRow[]>`
        SELECT COALESCE(utm_source, 'direct') AS label, COUNT(*)::bigint AS n
        FROM "referral_clicks"
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY label
        ORDER BY n DESC
        LIMIT 6
      `,
      syntheticUptime("flashcard"),
      syntheticUptime("cat"),
      syntheticUptime("question"),
    ]);

    const monthlyValues = activeSubscriptions
      .map((row) => monthlyEquivalent(row))
      .filter((value): value is number => value !== null);
    const mrr = monthlyValues.reduce((sum, value) => sum + value, 0);
    const revenueYesterday = activeSubscriptions
      .filter((row) => row.createdAt >= startYesterday && row.createdAt < startToday)
      .map((row) => {
        const duration = normalizeDuration(row.planDuration);
        const monthly = monthlyEquivalent(row);
        return monthly == null ? 0 : monthly * durationMonths(duration);
      })
      .reduce((sum, value) => sum + value, 0);

    const uptimeValues = [flashcardUptime, catUptime, questionUptime].filter((v): v is number => v !== null);
    const averageUptime =
      uptimeValues.length === 0 ? null : uptimeValues.reduce((sum, value) => sum + value, 0) / uptimeValues.length;
    const systemStatus = averageUptime === null ? "yellow" : uptimeStatus(averageUptime);

    const notes = [
      "MRR/ARR are operational CAD estimates from active NurseNest subscription mirrors and display-price catalog. Stripe remains the billing source of truth.",
      "Refunds, chargebacks, exact invoice revenue, and institutional contract amounts remain Stripe-side unless explicitly mirrored.",
      "Daily revenue uses subscriptions created yesterday and catalog list price, not Stripe invoice net revenue.",
    ];

    return {
      generatedAt,
      degraded: false,
      notes,
      revenue: {
        mrr: metric("MRR", cad(mrr), mrr > 0 ? "green" : "yellow", "Estimated from active/grace subscriptions."),
        arr: metric("ARR", cad(mrr * 12), mrr > 0 ? "green" : "yellow", "MRR × 12 operational estimate."),
        revenueYesterday: metric(
          "Revenue Yesterday",
          cad(revenueYesterday),
          growthStatus(newSubscribers),
          `${newSubscribers} new subscription row${newSubscribers === 1 ? "" : "s"} yesterday.`,
        ),
        referralRevenue: metric(
          "Referral Revenue",
          referralPaid > 0 ? `${integer(referralPaid)} paid referral${referralPaid === 1 ? "" : "s"}` : "Stripe",
          referralPaid > 0 ? "green" : "yellow",
          `${referralQualified} qualified referral${referralQualified === 1 ? "" : "s"} yesterday; amount is Stripe-side.`,
        ),
        institutionRevenue: metric(
          "Institution Revenue",
          activeInstitutions > 0 ? `${integer(activeInstitutions)} active org${activeInstitutions === 1 ? "" : "s"}` : "Stripe",
          activeInstitutions > 0 ? "green" : "yellow",
          "Institution contract amount is not mirrored in NurseNest DB.",
        ),
        refunds: metric("Refunds", "Stripe", "yellow", "Use Stripe disputes/refunds report for exact amount."),
        chargebacks: metric("Chargebacks", "Stripe", "yellow", "Use Stripe disputes report; evidence packages remain in-app."),
        failedPayments: metric(
          "Failed Payments",
          integer(failedPayments),
          countStatus(failedPayments, 1, 5),
          "Current PAST_DUE subscription rows.",
        ),
      },
      subscriptions: {
        newSubscribers: metric("New Subscribers", integer(newSubscribers), growthStatus(newSubscribers), "Yesterday."),
        cancelledSubscribers: metric(
          "Cancelled Subscribers",
          integer(cancelledSubscribers),
          countStatus(cancelledSubscribers, 1, 5),
          "Rows moved/updated as CANCELLED yesterday.",
        ),
      },
      learnerActivity: {
        activeLearners: metric("Active Learners", integer(activeLearners), activeLearners > 0 ? "green" : "yellow", "Last 24h."),
        studySessions: metric("Study Sessions", integer(studySessions), studySessions > 0 ? "green" : "yellow", "Activity starts in last 24h."),
        questionsAnswered: metric(
          "Questions Answered",
          integer(questionsAnswered),
          questionsAnswered > 0 ? "green" : "yellow",
          "Practice answer attempts in last 24h.",
        ),
      },
      uptime: {
        flashcards: metric("Flashcard Uptime", pct(flashcardUptime), uptimeStatus(flashcardUptime), "Synthetic monitor, last 24h."),
        cat: metric("CAT Uptime", pct(catUptime), uptimeStatus(catUptime), "Synthetic monitor, last 24h."),
        questions: metric("Question Uptime", pct(questionUptime), uptimeStatus(questionUptime), "Synthetic monitor, last 24h."),
        systemHealth: metric(
          "System Health",
          systemStatus === "green" ? "Healthy" : systemStatus === "yellow" ? "Watch" : "Critical",
          systemStatus,
          averageUptime === null ? "Waiting for synthetic monitor data." : `Core activity average ${pct(averageUptime)}.`,
        ),
      },
      topProducts: productRows.map((row) => ({
        label: planLabel(row),
        value: integer(row._count._all),
        status: "green" as const,
        note: "Active/grace subscription rows.",
      })),
      topReferralSources: referralRows.map((row) => ({
        label: row.label ?? "direct",
        value: integer(toNumber(row.n)),
        status: "green" as const,
        note: "Referral clicks, last 30d.",
      })),
    };
  }, emptyCommandCenter(generatedAt));
}
