import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { loadPreNursingAnalyticsReport } from "@/lib/admin/load-pre-nursing-report";

export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  try {
    const report = await loadPreNursingAnalyticsReport();
    return NextResponse.json({ report });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: "pre_nursing_report_failed", detail: msg.slice(0, 300) }, { status: 503 });
  }
}

