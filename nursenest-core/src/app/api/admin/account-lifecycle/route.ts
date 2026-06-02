/**
 * POST /api/admin/account-lifecycle
 *
 * Trigger the inactivity lifecycle cron manually from the admin dashboard
 * or via an external cron scheduler (e.g. DO App Platform scheduled jobs,
 * GitHub Actions daily workflow, or any HTTPS cron service).
 *
 * Auth: requireAdmin() gate — staff only.
 * For external cron: also accepts Authorization: Bearer $CRON_SECRET header.
 *
 * Body (optional JSON):
 *   { dryRun?: boolean, batchSize?: number }
 *
 * dryRun=true logs what WOULD happen without touching the database.
 * Use this to audit before enabling for real.
 */

import { type NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { runAccountLifecycleCron } from "@/lib/account-lifecycle/lifecycle-engine";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const dynamic = "force-dynamic";

function isCronSecretValid(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  const auth = req.headers.get("authorization") ?? "";
  return auth === `Bearer ${secret}`;
}

export async function POST(req: NextRequest) {
  // Accept admin session OR cron secret (for scheduled external calls)
  const cronAuth = isCronSecretValid(req);
  if (!cronAuth) {
    const gate = await requireAdmin(req);
    if (!gate.ok) return gate.response;
  }

  if (!isDatabaseUrlConfigured()) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  let dryRun = true; // Default to dry run for safety
  let batchSize = 200;

  try {
    const body = await req.json().catch(() => ({})) as { dryRun?: boolean; batchSize?: number };
    if (typeof body.dryRun === "boolean") dryRun = body.dryRun;
    if (typeof body.batchSize === "number") batchSize = Math.min(body.batchSize, 500);
  } catch {
    // malformed body — use defaults
  }

  safeServerLog("account_lifecycle", "cron_triggered", {
    dryRun,
    batchSize: String(batchSize),
    via: cronAuth ? "cron_secret" : "admin_session",
  });

  try {
    const result = await runAccountLifecycleCron({ dryRun, batchSize });
    return NextResponse.json({ ok: true, dryRun, result });
  } catch (e) {
    safeServerLog("account_lifecycle", "cron_fatal_error", {
      detail: e instanceof Error ? e.message.slice(0, 400) : String(e),
    });
    return NextResponse.json({ error: "Lifecycle cron failed." }, { status: 500 });
  }
}

/** GET: return current deletion queue stats for the admin dashboard */
export async function GET(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  if (!isDatabaseUrlConfigured()) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  try {
    const now = new Date();
    const [
      pendingWarning1,
      pendingWarning2,
      pendingWarning3,
      softDeleted,
      pendingPurge,
      recentlyRecovered,
    ] = await Promise.all([
      // Users who have received warning 1 but not yet warning 2
      prisma_count({ warning1SentAt: { not: null }, warning2SentAt: null, deletedAt: null }),
      prisma_count({ warning2SentAt: { not: null }, warning3SentAt: null, deletedAt: null }),
      prisma_count({ warning3SentAt: { not: null }, deletedAt: null }),
      prisma_count({ deletedAt: { not: null }, permanentlyPurgedAt: null }),
      prisma_count({
        deletedAt: { not: null },
        scheduledPermanentDeletionAt: { lte: now },
        permanentlyPurgedAt: null,
      }),
      // Recovered in last 30 days (lastLifecycleEmailType = 'recovered')
      prisma_count({
        lastLifecycleEmailType: "recovered",
        updatedAt: { gte: new Date(now.getTime() - 30 * 86_400_000) },
      }),
    ]);

    return NextResponse.json({
      pendingWarning1,
      pendingWarning2,
      pendingWarning3,
      softDeleted,
      pendingPermanentPurge: pendingPurge,
      recentlyRecovered,
      generatedAt: now.toISOString(),
    });
  } catch (e) {
    return NextResponse.json({ error: "Stats query failed." }, { status: 500 });
  }
}

// Lazy import to avoid loading prisma at module-level
import { prisma } from "@/lib/db";

async function prisma_count(where: Prisma.UserWhereInput): Promise<number> {
  return prisma.user.count({ where: { isDemoUser: false, ...where } }).catch(() => 0);
}
