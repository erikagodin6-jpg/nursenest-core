import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { requireStudyToolsApiSession } from "@/lib/study-tools/study-tools-api-access.server";
import { addVerifiedStudyCard } from "@/lib/verified-study/verified-study-decks.server";

export const dynamic = "force-dynamic";

const postBody = z
  .object({
    promptFront: z.string().min(1),
    answerBack: z.string().min(1),
    rationale: z.string().nullable().optional(),
    clinicalPearl: z.string().nullable().optional(),
    canonicalCategoryId: z.string().max(64).nullable().optional(),
    referencesJson: z.array(z.object({ url: z.string() }).passthrough()).optional(),
  })
  .strict();

export async function POST(req: NextRequest, ctx: { params: Promise<{ deckId: string }> }) {
  return runWithApiTelemetry(req, "POST /api/verified-study/decks/[deckId]/cards", "content", async () => {
    const gate = await requireStudyToolsApiSession();
    if (!gate.ok) return gate.response;
    const { deckId } = await ctx.params;

    let body: z.infer<typeof postBody>;
    try {
      body = postBody.parse(await req.json());
    } catch {
      return NextResponse.json({ ok: false, code: "bad_request" }, { status: 400 });
    }

    const card = await addVerifiedStudyCard({
      deckId,
      ownerId: gate.userId,
      promptFront: body.promptFront,
      answerBack: body.answerBack,
      rationale: body.rationale ?? null,
      clinicalPearl: body.clinicalPearl ?? null,
      canonicalCategoryId: body.canonicalCategoryId ?? null,
      referencesJson: body.referencesJson ?? [],
    });
    if (!card) return NextResponse.json({ ok: false, code: "forbidden" }, { status: 403 });
    return NextResponse.json({ ok: true, card: { id: card.id, position: card.position } });
  });
}
