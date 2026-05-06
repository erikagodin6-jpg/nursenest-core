import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { requireStudyToolsApiSession } from "@/lib/study-tools/study-tools-api-access.server";
import { upsertVerifiedStudyCardProgress } from "@/lib/verified-study/verified-study-mutations.server";

export const dynamic = "force-dynamic";

const postBody = z
  .object({
    viewedDelta: z.number().int().min(0).max(50).optional(),
    correctDelta: z.number().int().min(0).max(50).optional(),
    incorrectDelta: z.number().int().min(0).max(50).optional(),
    weak: z.boolean().optional(),
    starred: z.boolean().optional(),
    mastered: z.boolean().optional(),
    confidenceRating: z.number().int().min(0).max(5).nullable().optional(),
    grade: z.enum(["correct", "incorrect"]).optional(),
  })
  .strict();

export async function POST(req: NextRequest, ctx: { params: Promise<{ cardId: string }> }) {
  return runWithApiTelemetry(req, "POST /api/verified-study/cards/[cardId]/progress", "content", async () => {
    const gate = await requireStudyToolsApiSession();
    if (!gate.ok) return gate.response;
    const { cardId } = await ctx.params;

    let body: z.infer<typeof postBody>;
    try {
      body = postBody.parse(await req.json());
    } catch {
      return NextResponse.json({ ok: false, code: "bad_request" }, { status: 400 });
    }

    const res = await upsertVerifiedStudyCardProgress({
      viewerId: gate.userId,
      cardId,
      patch: body,
    });
    if (!res.ok) {
      const status = res.code === "not_found" ? 404 : 403;
      return NextResponse.json({ ok: false, code: res.code }, { status });
    }
    return NextResponse.json({ ok: true });
  });
}
