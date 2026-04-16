import { NextResponse } from "next/server";
import { loadAdminQaIssueSnapshot } from "@/lib/admin/admin-qa-snapshot";
import { requireAdmin } from "@/lib/admin/ensure-admin";

/** Quality control summary for content ops (no full table scans on huge DBs — uses limits). */
export async function GET() {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const issues = await loadAdminQaIssueSnapshot();

  return NextResponse.json({
    issues,
    note: "Tune queries as volume grows; duplicate detection uses stemHash populated by background job.",
  });
}
