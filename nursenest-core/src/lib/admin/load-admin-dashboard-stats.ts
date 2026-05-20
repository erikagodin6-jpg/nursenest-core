import { ContentStatus, SubscriptionStatus, UserRole } from "@prisma/client";
import { DB_PUBLISHED } from "@/lib/entitlements/content-access-scope";
import { prisma } from "@/lib/db";
import { subscriptionWhereRealUserMetrics, userWhereRealMetrics } from "@/lib/admin/admin-metrics-exclude-demo-users";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { isRuntimeSafeMode } from "@/lib/runtime/safe-mode";

const LIST_LIMIT = 15;
const DAU_WINDOW_MS = 24 * 60 * 60 * 1000;
const STATS_CACHE_MS = 30_000;
let cachedStats: { at: number; value: AdminDashboardStats | null } | null = null;
let inFlightStats: Promise<AdminDashboardStats | null> | null = null;

export type QuestionTierBucket = "RN" | "PN" | "NP" | "Allied" | "Other";

function bucketExamQuestionTier(tier: string): QuestionTierBucket {
  const t = tier.trim().toLowerCase();
  if (t === "np") return "NP";
  if (t === "allied") return "Allied";
  if (t === "rn") return "RN";
  if (t === "rpn" || t === "lvn" || t === "lvn_lpn") return "PN";
  return "Other";
}

export type AdminDashboardStats = {
  generatedAt: string;
  totals: {
    users: number;
    learners: number;
    activeSubscriptions: number;
    /** Distinct learners with ≥1 subscription row (Stripe checkout completed at least once). */
    learnersEverSubscribed: number;
    /** Percent of learners with ≥1 subscription; null if no learners. */
    conversionRatePct: number | null;
    questionsPublished: number;
    /** Published app lessons (`content_items`) + published pathway lessons. */
    lessonsTotal: number;
    appLessonsPublished: number;
    pathwayLessonsPublished: number;
    flashcardsPublished: number;
    /** Unique learners with activity in last 24h (attempts, sessions, or progress). */
    dailyActiveUsers: number;
  };
  questionsByExam: { exam: string; count: number }[];
  questionsByTierBucket: Record<QuestionTierBucket, number>;
  recentUsers: {
    id: string;
    email: string;
    name: string;
    role: string;
    updatedAt: string;
    createdAt: string;
  }[];
  recentSignups: {
    id: string;
    email: string;
    name: string;
    createdAt: string;
  }[];
  recentPurchases: {
    id: string;
    userId: string;
    userEmail: string;
    userName: string;
    status: string;
    planTier: string | null;
    createdAt: string;
  }[];
};

async function dailyActiveUsersCount(since: Date): Promise<number> {
  /** Exclude demo QA accounts from admin “active learners” signal (same as recent lists). */
  const rows = await prisma.$queryRaw<[{ n: bigint }]>`
    SELECT COUNT(*)::bigint AS n FROM (
      SELECT ea."userId" FROM "ExamAttempt" ea
      INNER JOIN "User" u ON u.id = ea."userId"
      WHERE ea."createdAt" >= ${since} AND u."is_demo_user" = false
      UNION
      SELECT es."userId" FROM "ExamSession" es
      INNER JOIN "User" u2 ON u2.id = es."userId"
      WHERE es."updatedAt" >= ${since} AND u2."is_demo_user" = false
      UNION
      SELECT p."userId" FROM "Progress" p
      INNER JOIN "User" u3 ON u3.id = p."userId"
      WHERE p."updatedAt" >= ${since} AND u3."is_demo_user" = false
    ) AS active
  `;
  return Number(rows[0]?.n ?? 0);
}

/**
 * Aggregated admin dashboard metrics — bounded queries only (no full-table loads).
 */
export async function loadAdminDashboardStats(): Promise<AdminDashboardStats | null> {
  if (!isDatabaseUrlConfigured() || isRuntimeSafeMode()) return null;
  const now = Date.now();
  if (cachedStats && now - cachedStats.at < STATS_CACHE_MS) return cachedStats.value;
  if (inFlightStats) return inFlightStats;

  const sinceDau = new Date(Date.now() - DAU_WINDOW_MS);

  inFlightStats = (async () => {
    try {
      const users = await prisma.user.count({ where: userWhereRealMetrics() });
      const learners = await prisma.user.count({ where: userWhereRealMetrics({ role: UserRole.LEARNER }) });
      const activePayingSubscriptions = await prisma.subscription.count({
        where: subscriptionWhereRealUserMetrics({
          status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.GRACE] },
        }),
      });
      const questionsPublished = await prisma.examQuestion.count({ where: { status: DB_PUBLISHED } });
      const appLessonsPublished = await prisma.contentItem.count({ where: { type: "lesson", status: DB_PUBLISHED } });
      const pathwayLessonsPublished = await prisma.pathwayLesson.count({ where: { status: ContentStatus.PUBLISHED } });
      const flashcardsPublished = await prisma.flashcard.count({ where: { status: ContentStatus.PUBLISHED } });
      const learnersEverSubscribed = await prisma.user.count({
        where: userWhereRealMetrics({
          role: UserRole.LEARNER,
          subscriptions: { some: {} },
        }),
      });
      const examGroups = await prisma.examQuestion.groupBy({
        by: ["exam"],
        where: { status: DB_PUBLISHED },
        _count: { _all: true },
      });
      const tierGroups = await prisma.examQuestion.groupBy({
        by: ["tier"],
        where: { status: DB_PUBLISHED },
        _count: { _all: true },
      });
      const dau = await dailyActiveUsersCount(sinceDau).catch((e) => {
        console.error("[admin-dashboard] dau", e);
        return 0;
      });
      const recentUsers = await prisma.user.findMany({
        where: userWhereRealMetrics(),
        orderBy: { updatedAt: "desc" },
        take: LIST_LIMIT,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          updatedAt: true,
          createdAt: true,
        },
      });
      const recentSignups = await prisma.user.findMany({
        where: userWhereRealMetrics({ role: UserRole.LEARNER }),
        orderBy: { createdAt: "desc" },
        take: LIST_LIMIT,
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });
      const recentPurchases = await prisma.subscription.findMany({
        where: subscriptionWhereRealUserMetrics(),
        orderBy: { createdAt: "desc" },
        take: LIST_LIMIT,
        select: {
          id: true,
          userId: true,
          status: true,
          planTier: true,
          createdAt: true,
          user: { select: { email: true, name: true } },
        },
      });

      const tierBuckets: Record<QuestionTierBucket, number> = {
        RN: 0,
        PN: 0,
        NP: 0,
        Allied: 0,
        Other: 0,
      };
      for (const row of tierGroups) {
        const b = bucketExamQuestionTier(row.tier);
        tierBuckets[b] += row._count._all;
      }

    const questionsByExam = examGroups
      .map((g) => ({
        exam: g.exam || "(empty)",
        count: g._count._all,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 40);

    const conversionRatePct =
      learners > 0 ? Math.round((learnersEverSubscribed / learners) * 10000) / 100 : null;

    const lessonsTotal = appLessonsPublished + pathwayLessonsPublished;

      const result = {
      generatedAt: new Date().toISOString(),
      totals: {
        users,
        learners,
        activeSubscriptions: activePayingSubscriptions,
        learnersEverSubscribed,
        conversionRatePct,
        questionsPublished,
        lessonsTotal,
        appLessonsPublished,
        pathwayLessonsPublished,
        flashcardsPublished,
        dailyActiveUsers: dau,
      },
      questionsByExam,
      questionsByTierBucket: tierBuckets,
      recentUsers: recentUsers.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        updatedAt: u.updatedAt.toISOString(),
        createdAt: u.createdAt.toISOString(),
      })),
      recentSignups: recentSignups.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        createdAt: u.createdAt.toISOString(),
      })),
      recentPurchases: recentPurchases.map((s) => ({
        id: s.id,
        userId: s.userId,
        userEmail: s.user.email,
        userName: s.user.name,
        status: s.status,
        planTier: s.planTier,
        createdAt: s.createdAt.toISOString(),
      })),
      };
      cachedStats = { at: Date.now(), value: result };
      return result;
    } catch (e) {
      console.error("[loadAdminDashboardStats]", e);
      cachedStats = { at: Date.now(), value: null };
      return null;
    } finally {
      inFlightStats = null;
    }
  })();

  return inFlightStats;
}

