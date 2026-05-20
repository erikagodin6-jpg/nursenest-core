import { type NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { buildContentScalabilityReport } from "@/lib/scalability/build-content-scalability-report";

/**
 * Bounded content / scale diagnostics for ops (counts + pathway source matrix only).
 * No raw lesson bodies, question stems, or unbounded arrays beyond registry pathways (~10–50 rows).
 */
export async function GET(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  try {
    const report = await buildContentScalabilityReport();
    return NextResponse.json({ ok: true, report });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
