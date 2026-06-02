import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { loadAdminBlueprintComplianceDashboard } from "@/lib/blueprints/load-blueprint-compliance.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const pathwayId = req.nextUrl.searchParams.get("pathwayId");
  const data = await loadAdminBlueprintComplianceDashboard(pathwayId);
  return NextResponse.json({ ok: true, data });
}
