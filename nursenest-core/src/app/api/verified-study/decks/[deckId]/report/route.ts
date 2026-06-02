import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { requireStudyToolsApiSession } from "@/lib/study-tools/study-tools-api-access.server";
import { reportVerifiedStudyDeck } from "@/lib/verified-study/verified-study-mutations.server";

export const dynamic = "force-dynamic";

const postBody = z.object({ reason: z.string().min(4).max(500) }).strict();

export async function POST(req: NextRequest, ctx: { params: Promise<{ deckId: string }> }) {
  return runWithApiTelemetry(req, "POST /api/verified-study/decks/[deckId]/report", "content", async () => {
    const gate = await requireStudyToolsApiSession();
    if (!gate.ok) return gate.response;
    const { deckId } = await ctx.params;

    let body: z.infer<typeof postBody>;
    try {
      body = postBody.parse(await req.json());
    } catch {
      return NextResponse.json({ ok: false, code: "bad_request" }, { status: 400 });
    }

    const res = await reportVerifiedStudyDeck({
      deckId,
      reporterId: gate.userId,
      reason: body.reason,
    });
    if (!res.ok) {
      const status = res.code === "not_found" ? 404 : 403;
      return NextResponse.json({ ok: false, code: res.code }, { status });
    }
    return NextResponse.json({ ok: true });
  });
}
