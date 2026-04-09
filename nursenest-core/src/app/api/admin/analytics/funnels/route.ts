import { requireAdmin } from "@/lib/admin/ensure-admin";
import { loadAdminFunnelAnalytics, parseFunnelSearchParams } from "@/lib/admin/load-admin-funnel-analytics";
import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const sp = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = parseFunnelSearchParams(sp);
  const data = await loadAdminFunnelAnalytics(parsed);
  if (!data) {
    return NextResponse.json({ error: "Funnel analytics unavailable (database not configured or safe mode)." }, { status: 503 });
  }
  return NextResponse.json(data);
}
