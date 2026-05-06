import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import {
  adminApprovePublicVerifiedStudyDeck,
  adminRejectPublicVerifiedStudyDeck,
  adminUnpublishPublicVerifiedStudyDeck,
} from "@/lib/verified-study/verified-study-admin.server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";

export const dynamic = "force-dynamic";

const postBody = z
  .object({
    decision: z.enum(["approve", "reject", "unpublish"]),
  })
  .strict();

export async function POST(req: NextRequest, ctx: { params: Promise<{ deckId: string }> }) {
  return runWithApiTelemetry(req, "POST /api/admin/verified-study/decks/[deckId]/publish-review", "admin", async () => {
    const gate = await requireAdmin(req);
    if (!gate.ok) return gate.response;
    const { deckId } = await ctx.params;

    let body: z.infer<typeof postBody>;
    try {
      body = postBody.parse(await req.json());
    } catch {
      return NextResponse.json({ ok: false, code: "bad_request" }, { status: 400 });
    }

    if (body.decision === "reject") {
      await adminRejectPublicVerifiedStudyDeck(deckId);
      return NextResponse.json({ ok: true });
    }
    if (body.decision === "unpublish") {
      await adminUnpublishPublicVerifiedStudyDeck(deckId);
      return NextResponse.json({ ok: true });
    }

    const res = await adminApprovePublicVerifiedStudyDeck(deckId);
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, code: res.code, reasons: "reasons" in res ? res.reasons : undefined },
        { status: res.code === "not_found" ? 404 : 400 },
      );
    }
    return NextResponse.json({ ok: true });
  });
}
