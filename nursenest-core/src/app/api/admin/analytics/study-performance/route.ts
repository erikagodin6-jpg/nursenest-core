import { requireAdmin } from "@/lib/admin/ensure-admin";
import {
  loadAdminStudyPerformanceAnalytics,
  parseStudyPerformanceSearchParams,
} from "@/lib/admin/load-admin-study-performance-analytics";
import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const sp = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = parseStudyPerformanceSearchParams(sp);
  const data = await loadAdminStudyPerformanceAnalytics(parsed);
  if (!data) {
    return NextResponse.json({ error: "Study performance analytics unavailable." }, { status: 503 });
  }
  return NextResponse.json(data);
}
