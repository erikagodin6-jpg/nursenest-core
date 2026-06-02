import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { buildAdminOperationsDashboard } from "@/lib/admin/build-admin-operations-dashboard";

/**
 * Paginated operations summary (no lesson/question bodies). Query params:
 * - pathwayPage, pathwayPageSize (default 1 / 12, max 50)
 * - questionCrossTabPage, questionCrossTabPageSize (default 1 / 30, max 60)
 * - topicTopPage, topicTopPageSize (default 1 / 25, max 80)
 */
export async function GET(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const sp = req.nextUrl.searchParams;
  const parse = (k: string) => {
    const v = sp.get(k);
    if (v == null || v === "") return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };

  try {
    const dashboard = await buildAdminOperationsDashboard({
      pathwayPage: parse("pathwayPage"),
      pathwayPageSize: parse("pathwayPageSize"),
      questionCrossTabPage: parse("questionCrossTabPage"),
      questionCrossTabPageSize: parse("questionCrossTabPageSize"),
      topicTopPage: parse("topicTopPage"),
      topicTopPageSize: parse("topicTopPageSize"),
    });
    return NextResponse.json({ ok: true, dashboard });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
