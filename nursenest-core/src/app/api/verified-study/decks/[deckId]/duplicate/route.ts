import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { requireStudyToolsApiSession } from "@/lib/study-tools/study-tools-api-access.server";
import { duplicateVerifiedStudyDeck } from "@/lib/verified-study/verified-study-decks.server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, ctx: { params: Promise<{ deckId: string }> }) {
  return runWithApiTelemetry(req, "POST /api/verified-study/decks/[deckId]/duplicate", "content", async () => {
    const gate = await requireStudyToolsApiSession();
    if (!gate.ok) return gate.response;
    const { deckId } = await ctx.params;

    const dup = await duplicateVerifiedStudyDeck({ sourceDeckId: deckId, newOwnerId: gate.userId });
    if (!dup) return NextResponse.json({ ok: false, code: "forbidden" }, { status: 403 });
    return NextResponse.json({ ok: true, deck: { id: dup.id, title: dup.title, visibility: dup.visibility } });
  });
}
