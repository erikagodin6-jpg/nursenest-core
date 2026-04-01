import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { loadAdminDiagnostics } from "@/lib/admin/load-admin-diagnostics";

export const dynamic = "force-dynamic";

/**
 * JSON snapshot for the admin diagnostics dashboard (safe when optional tables are missing).
 */
export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  try {
    const diagnostics = await loadAdminDiagnostics();
    return NextResponse.json({ ok: true, diagnostics });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg.slice(0, 400) }, { status: 500 });
  }
}
