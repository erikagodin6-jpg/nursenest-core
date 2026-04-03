import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import {
  catBlueprintSessionsToCsv,
  queryCatBlueprintSessionsForAdmin,
} from "@/lib/admin/cat-blueprint-sessions-admin";

/**
 * Admin-only: recent adaptive (CAT) practice tests with persisted blueprint diagnostics.
 * GET ?limit=30&status=COMPLETED|ALL|IN_PROGRESS&completedOnly=0|1&pathwayId=&catExamConfigId=&lowQualityOnly=1&format=json|csv
 */
export async function GET(req: NextRequest) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const sp = req.nextUrl.searchParams;
  const format = (sp.get("format") ?? "json").toLowerCase();

  const { sessions, qualityThresholds } = await queryCatBlueprintSessionsForAdmin(sp);

  if (format === "csv") {
    const csv = catBlueprintSessionsToCsv(sessions);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="cat-blueprint-sessions.csv"',
      },
    });
  }

  return NextResponse.json({
    qualityThresholds,
    count: sessions.length,
    sessions,
  });
}
