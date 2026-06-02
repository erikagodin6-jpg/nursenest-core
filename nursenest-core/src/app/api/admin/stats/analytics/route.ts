import { type NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { loadAdminSecurityTelemetry } from "@/lib/admin/load-admin-security-telemetry";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/stats/analytics
 *
 * Comprehensive platform analytics for the admin dashboard.
 * Runs all key operational queries in parallel with individual fallbacks.
 *
 * Raw SQL equivalents (run directly in psql/pgAdmin to verify):
 *
 * -- DAU
 * SELECT COUNT(*) FROM "User"
 *   WHERE "updatedAt" >= NOW() - INTERVAL '1 day' AND is_demo_user = false;
 *
 * -- WAU
 * SELECT COUNT(*) FROM "User"
 *   WHERE "updatedAt" >= NOW() - INTERVAL '7 days' AND is_demo_user = false;
 *
 * -- MAU
 * SELECT COUNT(*) FROM "User"
 *   WHERE "updatedAt" >= NOW() - INTERVAL '30 days' AND is_demo_user = false;
 *
 * -- Email domain distribution
 * SELECT SPLIT_PART(email, '@', 2) AS domain, COUNT(*)
 *   FROM "User" WHERE is_demo_user = false
 *   GROUP BY domain ORDER BY COUNT(*) DESC LIMIT 30;
 *
 * -- Monthly signup growth
 * SELECT DATE_TRUNC('month', "createdAt") AS month, COUNT(*) AS users
 *   FROM "User" WHERE is_demo_user = false
 *   GROUP BY month ORDER BY month ASC;
 *
 * -- Dead accounts (registered but never engaged)
 * SELECT COUNT(*) FROM "User"
 *   WHERE "createdAt" = "updatedAt" AND is_demo_user = false;
 *
 * -- New users today
 * SELECT COUNT(*) FROM "User"
 *   WHERE "createdAt" >= CURRENT_DATE AND is_demo_user = false;
 *
 * -- New users this month
 * SELECT COUNT(*) FROM "User"
 *   WHERE "createdAt" >= DATE_TRUNC('month', NOW()) AND is_demo_user = false;
 */
export async function GET(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  if (!isDatabaseUrlConfigured()) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const now = new Date();
  const since1d  = new Date(now.getTime() - 1  * 24 * 60 * 60 * 1000);
  const since7d  = new Date(now.getTime() - 7  * 24 * 60 * 60 * 1000);
  const since30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    userMetrics,
    monthlyGrowthRaw,
    emailDomainsRaw,
    practiceTestsStarted,
    lessonsCompleted,
    securityTelemetry,
  ] = await Promise.all([
    prisma.$queryRaw<
      Array<{
        total_users: bigint;
        dau: bigint;
        wau: bigint;
        mau: bigint;
        new_today: bigint;
        new_this_month: bigint;
        dead_accounts: bigint;
      }>
    >`
      SELECT
        COUNT(*)::bigint AS total_users,
        COUNT(*) FILTER (WHERE "updatedAt" >= ${since1d})::bigint AS dau,
        COUNT(*) FILTER (WHERE "updatedAt" >= ${since7d})::bigint AS wau,
        COUNT(*) FILTER (WHERE "updatedAt" >= ${since30d})::bigint AS mau,
        COUNT(*) FILTER (WHERE "createdAt" >= CURRENT_DATE)::bigint AS new_today,
        COUNT(*) FILTER (WHERE "createdAt" >= DATE_TRUNC('month', NOW()))::bigint AS new_this_month,
        COUNT(*) FILTER (WHERE "createdAt" = "updatedAt")::bigint AS dead_accounts
      FROM "User"
      WHERE is_demo_user = false
    `.then((rows) => rows[0] ?? null).catch(() => null),

    // Monthly signup growth (last 24 months)
    prisma.$queryRaw<{ month: Date; users: bigint }[]>`
      SELECT DATE_TRUNC('month', "createdAt") AS month, COUNT(*)::bigint AS users
      FROM "User"
      WHERE is_demo_user = false
        AND "createdAt" >= NOW() - INTERVAL '24 months'
      GROUP BY month
      ORDER BY month ASC
    `.catch(() => null),

    // Email domain distribution (top 30)
    prisma.$queryRaw<{ domain: string; count: bigint }[]>`
      SELECT SPLIT_PART(email, '@', 2) AS domain, COUNT(*)::bigint AS count
      FROM "User"
      WHERE is_demo_user = false
      GROUP BY domain
      ORDER BY count DESC
      LIMIT 30
    `.catch(() => null),

    // Practice tests started (total)
    prisma.practiceTest.count().catch(() => null),

    // Lessons completed — progress rows where completed = true
    prisma.progress.count({ where: { completed: true } }).catch(() => null),

    // DB-backed anti-fraud / user verification telemetry.
    loadAdminSecurityTelemetry().catch(() => null),
  ]);
  const totalUsers = userMetrics ? Number(userMetrics.total_users) : null;
  const dau = userMetrics ? Number(userMetrics.dau) : null;
  const wau = userMetrics ? Number(userMetrics.wau) : null;
  const mau = userMetrics ? Number(userMetrics.mau) : null;
  const newToday = userMetrics ? Number(userMetrics.new_today) : null;
  const newThisMonth = userMetrics ? Number(userMetrics.new_this_month) : null;
  const deadAccounts = userMetrics ? Number(userMetrics.dead_accounts) : null;

  // Compute retention % (MAU / total, rough proxy)
  const retentionPct =
    totalUsers && mau != null && totalUsers > 0
      ? Math.round((mau / totalUsers) * 100)
      : null;

  // Serialize monthly growth
  const monthlyGrowth = monthlyGrowthRaw
    ? monthlyGrowthRaw.map((r) => ({
        month: r.month instanceof Date ? r.month.toISOString().slice(0, 7) : String(r.month),
        users: Number(r.users),
      }))
    : null;

  // Serialize email domains
  const emailDomains = emailDomainsRaw
    ? emailDomainsRaw.map((r) => ({
        domain: r.domain,
        count: Number(r.count),
      }))
    : null;

  safeServerLog("admin_analytics", "query_ok", {
    totalUsers: String(totalUsers ?? "?"),
    dau: String(dau ?? "?"),
    mau: String(mau ?? "?"),
  });

  return NextResponse.json({
    generatedAt: now.toISOString(),
    users: {
      total: totalUsers,
      dau,
      wau,
      mau,
      newToday,
      newThisMonth,
      deadAccounts,
      retentionPct,
    },
    growth: {
      monthly: monthlyGrowth,
    },
    emailDomains,
    activity: {
      practiceTestsStarted,
      lessonsCompleted,
    },
    securityTelemetry,
  });
}
