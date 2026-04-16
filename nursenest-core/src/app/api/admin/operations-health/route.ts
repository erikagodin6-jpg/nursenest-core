import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { loadAdminOperationsHealth } from "@/lib/admin/load-admin-operations-health";

/**
 * Aggregated operational health for admin dashboard (DB jobs, automation logs, AI, billing signals).
 */
export async function GET() {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  try {
    const health = await loadAdminOperationsHealth();
    return NextResponse.json({ ok: true, health });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
