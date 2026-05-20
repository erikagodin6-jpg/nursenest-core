import { NextResponse } from "next/server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { prisma } from "@/lib/db";
import { isRemediationEngineEnabled } from "@/lib/remediation/remediation-flag";
import { applyRemediationQueueOutcome } from "@/lib/remediation/queue-outcome";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  return runWithApiTelemetry(req, "PATCH /api/study-plan/queue/[id]", "content", async () => {
    if (!isRemediationEngineEnabled()) {
      return NextResponse.json({ ok: true, skipped: true }, { status: 200 });
    }

    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    const { id } = await ctx.params;
    if (!id || id.length < 8 || id.length > 40) {
      return NextResponse.json({ error: "invalid_id" }, { status: 400 });
    }

    let body: { wellPerformed?: boolean };
    try {
      body = (await req.json()) as { wellPerformed?: boolean };
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    if (typeof body.wellPerformed !== "boolean") {
      return NextResponse.json({ error: "wellPerformed_boolean_required" }, { status: 400 });
    }

    const r = await applyRemediationQueueOutcome(prisma, {
      userId: gate.userId,
      queueItemId: id,
      wellPerformed: body.wellPerformed,
    });

    if (!r.ok && r.error === "not_found") {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    if (!r.ok) {
      return NextResponse.json({ error: "update_failed" }, { status: 503 });
    }

    return NextResponse.json({ ok: true });
  });
}
