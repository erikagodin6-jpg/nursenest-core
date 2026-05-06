import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { requireStudyToolsApiSession } from "@/lib/study-tools/study-tools-api-access.server";
import { createVerifiedStudyDeck, listVerifiedStudyDecksForPathway } from "@/lib/verified-study/verified-study-decks.server";

export const dynamic = "force-dynamic";

const postBody = z
  .object({
    title: z.string().min(1).max(200),
    pathwayId: z.string().min(1).max(64),
    description: z.string().max(2000).optional(),
    professionKey: z.string().max(64).nullable().optional(),
    canonicalCategoryId: z.string().max(64).nullable().optional(),
    visibility: z.enum(["PRIVATE", "SHARED", "PUBLIC", "UNLISTED"]).optional(),
  })
  .strict();

export async function GET(req: NextRequest) {
  return runWithApiTelemetry(req, "GET /api/verified-study/decks", "content", async () => {
    const gate = await requireStudyToolsApiSession();
    if (!gate.ok) return gate.response;

    const pathwayId = req.nextUrl.searchParams.get("pathwayId")?.trim() ?? "";
    if (!pathwayId) {
      return NextResponse.json({ ok: false, code: "missing_pathway" }, { status: 400 });
    }

    const decks = await listVerifiedStudyDecksForPathway({ userId: gate.userId, pathwayId });
    return NextResponse.json({ ok: true, decks });
  });
}

export async function POST(req: NextRequest) {
  return runWithApiTelemetry(req, "POST /api/verified-study/decks", "content", async () => {
    const gate = await requireStudyToolsApiSession();
    if (!gate.ok) return gate.response;

    let body: z.infer<typeof postBody>;
    try {
      body = postBody.parse(await req.json());
    } catch {
      return NextResponse.json({ ok: false, code: "bad_request" }, { status: 400 });
    }

    const deck = await createVerifiedStudyDeck({
      ownerId: gate.userId,
      title: body.title,
      pathwayId: body.pathwayId,
      description: body.description ?? null,
      professionKey: body.professionKey ?? null,
      canonicalCategoryId: body.canonicalCategoryId ?? null,
      visibility: body.visibility,
    });

    return NextResponse.json({
      ok: true,
      deck: {
        id: deck.id,
        title: deck.title,
        pathwayId: deck.pathwayId,
        visibility: deck.visibility,
        moderationStatus: deck.moderationStatus,
        unlistedSlug: deck.unlistedSlug,
      },
    });
  });
}
