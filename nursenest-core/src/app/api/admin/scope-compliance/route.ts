import { type NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { loadScopeComplianceDashboard } from "@/lib/content-scope/load-scope-compliance-dashboard.server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const limit = Math.min(1500, Math.max(100, Number(req.nextUrl.searchParams.get("limit") ?? 900)));
  const data = await loadScopeComplianceDashboard({ limit });
  return NextResponse.json({ ok: true, data });
}

