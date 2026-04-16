import { NextResponse } from "next/server";
import { loadAdminDashboardStats } from "@/lib/admin/load-admin-dashboard-stats";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { ttlGet, ttlSet } from "@/lib/cache/memory-cache";

const CACHE_KEY = "admin:stats:v1";
const TTL_MS = 60_000;

/**
 * Aggregated platform metrics (admin-only). Short TTL reduces DB load; refresh may lag up to 60s.
 */
export async function GET() {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const cached = ttlGet<Awaited<ReturnType<typeof loadAdminDashboardStats>>>(CACHE_KEY);
  if (cached) {
    return NextResponse.json({ ...cached, cached: true as const });
  }

  const stats = await loadAdminDashboardStats();
  if (!stats) {
    return NextResponse.json({ error: "Stats unavailable (database not configured or query failed)." }, { status: 503 });
  }

  ttlSet(CACHE_KEY, stats, TTL_MS);
  return NextResponse.json({ ...stats, cached: false as const });
}
