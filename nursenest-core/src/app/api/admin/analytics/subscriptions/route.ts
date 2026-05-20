import { requireAdmin } from "@/lib/admin/ensure-admin";
import {
  loadAdminSubscriptionAnalytics,
  parseSubscriptionAnalyticsSearchParams,
} from "@/lib/admin/load-admin-subscription-analytics";
import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const sp = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = parseSubscriptionAnalyticsSearchParams(sp);
  const data = await loadAdminSubscriptionAnalytics(parsed);
  if (!data) {
    return NextResponse.json({ error: "Subscription analytics unavailable." }, { status: 503 });
  }
  return NextResponse.json(data);
}
