import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { requireStudyToolsApiSession } from "@/lib/study-tools/study-tools-api-access.server";
import { updateVerifiedStudyCardByOwner } from "@/lib/verified-study/verified-study-mutations.server";

export const dynamic = "force-dynamic";

const patchBody = z
  .object({
    promptFront: z.string().min(1).optional(),
    answerBack: z.string().min(1).optional(),
    rationale: z.string().nullable().optional(),
    clinicalPearl: z.string().nullable().optional(),
    canonicalCategoryId: z.string().max(64).nullable().optional(),
    referencesJson: z.array(z.object({ url: z.string() }).passthrough()).optional(),
  })
  .strict();

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ cardId: string }> }) {
  return runWithApiTelemetry(req, "PATCH /api/verified-study/cards/[cardId]", "content", async () => {
    const gate = await requireStudyToolsApiSession();
    if (!gate.ok) return gate.response;
    const { cardId } = await ctx.params;

    let body: z.infer<typeof patchBody>;
    try {
      body = patchBody.parse(await req.json());
    } catch {
      return NextResponse.json({ ok: false, code: "bad_request" }, { status: 400 });
    }

    const res = await updateVerifiedStudyCardByOwner({
      cardId,
      ownerId: gate.userId,
      patch: body,
    });
    if (!res.ok) {
      const status = res.code === "not_found" ? 404 : 403;
      return NextResponse.json({ ok: false, code: res.code }, { status });
    }
    return NextResponse.json({ ok: true });
  });
}
