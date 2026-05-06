import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { requireStudyToolsApiSession } from "@/lib/study-tools/study-tools-api-access.server";
import { getVerifiedStudyDeckForViewer, updateVerifiedStudyDeck } from "@/lib/verified-study/verified-study-decks.server";

export const dynamic = "force-dynamic";

const patchBody = z
  .object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(2000).nullable().optional(),
    visibility: z.enum(["PRIVATE", "SHARED", "PUBLIC", "UNLISTED"]).optional(),
    canonicalCategoryId: z.string().max(64).nullable().optional(),
    professionKey: z.string().max(64).nullable().optional(),
  })
  .strict();

export async function GET(req: NextRequest, ctx: { params: Promise<{ deckId: string }> }) {
  return runWithApiTelemetry(req, "GET /api/verified-study/decks/[deckId]", "content", async () => {
    const gate = await requireStudyToolsApiSession();
    if (!gate.ok) return gate.response;
    const { deckId } = await ctx.params;
    const unlistedSlug = req.nextUrl.searchParams.get("unlistedSlug")?.trim() ?? null;

    const res = await getVerifiedStudyDeckForViewer({
      viewerId: gate.userId,
      deckId,
      unlistedSlug,
    });
    if (!res.ok) {
      const status = res.code === "not_found" ? 404 : 403;
      return NextResponse.json({ ok: false, code: res.code }, { status });
    }
    return NextResponse.json({ ok: true, deck: res.deck, cards: res.cards });
  });
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ deckId: string }> }) {
  return runWithApiTelemetry(req, "PATCH /api/verified-study/decks/[deckId]", "content", async () => {
    const gate = await requireStudyToolsApiSession();
    if (!gate.ok) return gate.response;
    const { deckId } = await ctx.params;

    let body: z.infer<typeof patchBody>;
    try {
      body = patchBody.parse(await req.json());
    } catch {
      return NextResponse.json({ ok: false, code: "bad_request" }, { status: 400 });
    }

    const out = await updateVerifiedStudyDeck(deckId, gate.userId, body);
    if (!out.updated) return NextResponse.json({ ok: false, code: "forbidden" }, { status: 403 });
    return NextResponse.json({ ok: true });
  });
}
