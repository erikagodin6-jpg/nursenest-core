import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { requireStudyToolsApiSession } from "@/lib/study-tools/study-tools-api-access.server";
import { shareVerifiedStudyDeck } from "@/lib/verified-study/verified-study-mutations.server";

export const dynamic = "force-dynamic";

const postBody = z
  .object({
    targetUserId: z.string().min(1).optional(),
    targetEmail: z.string().email().optional(),
  })
  .strict()
  .refine((b) => Boolean(b.targetUserId?.trim()) || Boolean(b.targetEmail?.trim()), { message: "need_target" });

export async function POST(req: NextRequest, ctx: { params: Promise<{ deckId: string }> }) {
  return runWithApiTelemetry(req, "POST /api/verified-study/decks/[deckId]/share", "content", async () => {
    const gate = await requireStudyToolsApiSession();
    if (!gate.ok) return gate.response;
    const { deckId } = await ctx.params;

    let body: z.infer<typeof postBody>;
    try {
      body = postBody.parse(await req.json());
    } catch {
      return NextResponse.json({ ok: false, code: "bad_request" }, { status: 400 });
    }

    const res = await shareVerifiedStudyDeck({
      deckId,
      ownerId: gate.userId,
      targetUserId: body.targetUserId ?? null,
      targetEmail: body.targetEmail ?? null,
    });
    if (!res.ok) {
      const status = res.code === "forbidden" ? 403 : 404;
      return NextResponse.json({ ok: false, code: res.code }, { status });
    }
    return NextResponse.json({ ok: true, targetUserId: res.targetUserId });
  });
}
