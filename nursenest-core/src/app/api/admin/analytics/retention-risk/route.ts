import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { loadRetentionRiskDashboard, type RiskLevel } from "@/lib/admin/subscription-risk";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const minLevel = (req.nextUrl.searchParams.get("minLevel") ?? "medium") as RiskLevel;
  const limit = Math.min(500, Number(req.nextUrl.searchParams.get("limit") ?? "200"));

  const summary = await loadRetentionRiskDashboard({ minRiskLevel: minLevel, limit });
  return NextResponse.json(summary, {
    headers: { "cache-control": "private, no-store" },
  });
}
