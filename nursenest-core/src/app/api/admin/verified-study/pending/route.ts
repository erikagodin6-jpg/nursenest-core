import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { listPendingPublicVerifiedStudyDecks } from "@/lib/verified-study/verified-study-admin.server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  return runWithApiTelemetry(req, "GET /api/admin/verified-study/pending", "admin", async () => {
    const gate = await requireAdmin(req);
    if (!gate.ok) return gate.response;
    const decks = await listPendingPublicVerifiedStudyDecks(60);
    return NextResponse.json({ ok: true, decks });
  });
}
