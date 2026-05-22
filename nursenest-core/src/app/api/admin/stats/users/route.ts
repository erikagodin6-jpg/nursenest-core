import { type NextRequest, NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { userWhereRealMetrics } from "@/lib/admin/admin-metrics-exclude-demo-users";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/stats/users
 *
 * Authoritative user count metrics for the admin dashboard.
 * Admin-only (requireAdmin gate). Returns safe fallback zeros on DB failure.
 *
 * Manual SQL verification:
 *   SELECT COUNT(*) FROM "User" WHERE is_demo_user = false;
 *   SELECT COUNT(*) FROM "User" WHERE role = 'LEARNER' AND is_demo_user = false;
 *   SELECT COUNT(*) FROM "User" WHERE role IN ('ADMIN','SUPER_ADMIN','CONTENT_ADMIN','SUPPORT_ADMIN') AND is_demo_user = false;
 *   SELECT COUNT(*) FROM "User" WHERE "createdAt" >= NOW() - INTERVAL '24 hours' AND is_demo_user = false;
 *   SELECT COUNT(*) FROM "User" WHERE "createdAt" >= NOW() - INTERVAL '7 days'  AND is_demo_user = false;
 *   SELECT COUNT(*) FROM "User" WHERE "createdAt" >= NOW() - INTERVAL '30 days' AND is_demo_user = false;
 *   -- "active" = updated within 30 days (any user action updates updatedAt)
 *   SELECT COUNT(*) FROM "User" WHERE "updatedAt" >= NOW() - INTERVAL '30 days' AND is_demo_user = false;
 */
export async function GET(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  if (!isDatabaseUrlConfigured()) {
    return NextResponse.json(
      { error: "Database not configured in this environment." },
      { status: 503 },
    );
  }

  const ADMIN_ROLES = [
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
    UserRole.CONTENT_ADMIN,
    UserRole.SUPPORT_ADMIN,
  ] as const;

  const now = new Date();
  const since24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const since7d  = new Date(now.getTime() - 7  * 24 * 60 * 60 * 1000);
  const since30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // "Active" = any user action updated their record in the last 30 days.
  // updatedAt is bumped on login, profile edits, exam activity, subscription changes.
  const activeWindow = since30d;

  const SAFE_ZERO = {
    totalUsers: 0,
    learnerUsers: 0,
    adminUsers: 0,
    activeUsers: 0,
    newLast24Hours: 0,
    newLast7Days: 0,
    newLast30Days: 0,
    generatedAt: now.toISOString(),
    note: "Returned zeros due to a database error — check server logs.",
  };

  try {
    const [
      totalUsers,
      learnerUsers,
      adminUsers,
      activeUsers,
      newLast24Hours,
      newLast7Days,
      newLast30Days,
    ] = await Promise.all([
      // Total non-demo users
      prisma.user.count({ where: userWhereRealMetrics() }),

      // Learners only
      prisma.user.count({
        where: userWhereRealMetrics({ role: UserRole.LEARNER }),
      }),

      // All admin tiers (ADMIN deprecated + SUPER_ADMIN + CONTENT_ADMIN + SUPPORT_ADMIN)
      prisma.user.count({
        where: userWhereRealMetrics({ role: { in: [...ADMIN_ROLES] } }),
      }),

      // Active: updatedAt within the last 30 days
      prisma.user.count({
        where: userWhereRealMetrics({ updatedAt: { gte: activeWindow } }),
      }),

      // New signups windows
      prisma.user.count({
        where: userWhereRealMetrics({ createdAt: { gte: since24h } }),
      }),
      prisma.user.count({
        where: userWhereRealMetrics({ createdAt: { gte: since7d } }),
      }),
      prisma.user.count({
        where: userWhereRealMetrics({ createdAt: { gte: since30d } }),
      }),
    ]);

    safeServerLog("admin_stats", "users_query_ok", {
      totalUsers: String(totalUsers),
      learnerUsers: String(learnerUsers),
      adminUsers: String(adminUsers),
    });

    return NextResponse.json({
      totalUsers,
      learnerUsers,
      adminUsers,
      activeUsers,
      newLast24Hours,
      newLast7Days,
      newLast30Days,
      generatedAt: now.toISOString(),
    });
  } catch (e) {
    safeServerLog("admin_stats", "users_query_failed", {
      detail: e instanceof Error ? e.message.slice(0, 300) : String(e).slice(0, 300),
    });
    console.error("[api/admin/stats/users] query failed", e);
    return NextResponse.json(SAFE_ZERO, { status: 200 });
  }
}
