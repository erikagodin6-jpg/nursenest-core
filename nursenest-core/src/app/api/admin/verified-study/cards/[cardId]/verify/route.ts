import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { adminVerifyVerifiedStudyCard } from "@/lib/verified-study/verified-study-admin.server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, ctx: { params: Promise<{ cardId: string }> }) {
  return runWithApiTelemetry(req, "POST /api/admin/verified-study/cards/[cardId]/verify", "admin", async () => {
    const gate = await requireAdmin(req);
    if (!gate.ok) return gate.response;
    const { cardId } = await ctx.params;
    await adminVerifyVerifiedStudyCard(cardId);
    return NextResponse.json({ ok: true });
  });
}
