import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { loadAdminObservabilityHub } from "@/lib/admin/load-admin-observability-hub";

export const dynamic = "force-dynamic";

/** Aggregated observability metrics (no per-user PII). */
export async function GET(request: Request) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return gate.response;

  const hub = await loadAdminObservabilityHub();
  if (!hub) {
    return NextResponse.json({ ok: false, error: "hub_unavailable" }, { status: 503 });
  }
  return NextResponse.json({ ok: true, hub });
}
