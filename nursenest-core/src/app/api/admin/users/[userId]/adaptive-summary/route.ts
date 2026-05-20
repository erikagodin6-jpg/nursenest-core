import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { loadAdaptiveLearnerAdminSummary } from "@/lib/admin/adaptive-learner-summary.server";

type RouteContext = { params: Promise<{ userId: string }> };

/**
 * Admin-only JSON for Phase 5C adaptive visibility (bounded, non-clinical).
 */
export async function GET(req: NextRequest, ctx: RouteContext) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { userId } = await ctx.params;
  const summary = await loadAdaptiveLearnerAdminSummary(userId);
  if (!summary) {
    return NextResponse.json({ ok: false, error: "User not found or unavailable" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, summary });
}
