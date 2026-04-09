import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { runSystemStatusProbes } from "@/lib/admin/system-status";

export const dynamic = "force-dynamic";

/**
 * Fresh system status (no caching). Admin-only. Does not expose secrets.
 */
export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  try {
    const payload = await runSystemStatusProbes();
    return NextResponse.json(payload, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg.slice(0, 400) }, { status: 500 });
  }
}
