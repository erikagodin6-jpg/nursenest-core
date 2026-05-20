import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { runSystemStatusProbes } from "@/lib/admin/system-status";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";

export const dynamic = "force-dynamic";

const NO_STORE = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
} as const;

/**
 * Fresh system status (no caching). Admin-only. Does not expose secrets.
 */
export async function GET(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  try {
    const payload = await runSystemStatusProbes();
    return NextResponse.json(payload, {
      status: 200,
      headers: NO_STORE,
    });
  } catch (e) {
    safeServerLogCritical("admin_system_status", "run_probes_unhandled", {}, e);
    const error =
      process.env.NODE_ENV === "production"
        ? "Failed to collect system status."
        : (e instanceof Error ? e.message : String(e)).slice(0, 400);
    return NextResponse.json({ ok: false, error }, { status: 500, headers: NO_STORE });
  }
}
