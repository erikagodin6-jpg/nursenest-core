import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { buildNpCanadaCoverageReport } from "@/lib/np/build-np-canada-coverage-report";

/**
 * GET /api/admin/np-coverage — Canadian NP question-bank depth vs product thresholds (admin only).
 */
export async function GET() {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  try {
    const report = await buildNpCanadaCoverageReport();
    return NextResponse.json(report);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: "np_coverage_failed", detail: msg.slice(0, 400) }, { status: 503 });
  }
}
