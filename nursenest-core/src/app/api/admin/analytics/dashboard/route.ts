import { requireAdmin } from "@/lib/admin/ensure-admin";
import { loadAdminAnalyticsDashboard } from "@/lib/admin/load-admin-analytics-dashboard";
import { type NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const data = await loadAdminAnalyticsDashboard();
  if (!data) {
    return NextResponse.json(
      {
        error: "Analytics unavailable (database not configured or safe mode).",
        degraded: true,
      },
      { status: 503 },
    );
  }

  return NextResponse.json(data);
}
