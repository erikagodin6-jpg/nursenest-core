import { NextResponse } from "next/server";
import { ContentStatus, CountryCode, ExamFamily, FlashcardDeckVisibility, TierCode } from "@prisma/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";

const createSchema = z.object({
  slug: z.string().min(2).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(2).max(200),
  description: z.string().max(5000).optional(),
  country: z.nativeEnum(CountryCode),
  tier: z.nativeEnum(TierCode),
  examFamily: z.nativeEnum(ExamFamily).optional(),
  pathwayId: z.string().max(120).optional().nullable(),
  visibility: z.nativeEnum(FlashcardDeckVisibility).optional(),
  status: z.nativeEnum(ContentStatus).optional(),
  sortOrder: z.number().int().optional(),
});

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    const deck = await prisma.flashcardDeck.create({
      data: {
        slug: parsed.data.slug,
        title: parsed.data.title,
        description: parsed.data.description,
        country: parsed.data.country,
        tier: parsed.data.tier,
        examFamily: parsed.data.examFamily ?? ExamFamily.GENERIC,
        pathwayId: parsed.data.pathwayId ?? null,
        visibility: parsed.data.visibility ?? FlashcardDeckVisibility.SUBSCRIBER,
        status: parsed.data.status ?? ContentStatus.DRAFT,
        sortOrder: parsed.data.sortOrder ?? 0,
        cardCount: 0,
      },
      select: {
        id: true,
        slug: true,
        title: true,
        status: true,
        visibility: true,
        cardCount: true,
      },
    });
    return NextResponse.json({ deck }, { status: 201 });
  } catch (e) {
    safeServerLogCritical("admin_flashcards_deck_create", "create_failed", { slug: parsed.data.slug }, e);
    return NextResponse.json({ error: "Create failed (duplicate slug?)" }, { status: 503 });
  }
}
