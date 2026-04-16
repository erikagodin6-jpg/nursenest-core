import { NextRequest, NextResponse } from "next/server";
import { ContentStatus } from "@prisma/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { ADMIN_API_LIST_PAGE, parseBoundedPageSize, parseListPage } from "@/lib/api/api-pagination-limits";

const createSchema = z.object({
  front: z.string().min(4),
  back: z.string().min(4),
  country: z.enum(["CA", "US"]),
  tier: z.enum(["RPN", "LVN_LPN", "RN", "NP", "ALLIED"]),
  categoryId: z.string().min(3),
  status: z.nativeEnum(ContentStatus).default(ContentStatus.DRAFT),
  examFamily: z.enum(["NCLEX_RN", "NCLEX_PN", "REX_PN", "NP", "ALLIED", "GENERIC"]).optional(),
  deckId: z.string().min(3).optional(),
  positionInDeck: z.number().int().min(0).optional(),
});

export async function GET(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const sp = req.nextUrl.searchParams;
  const pageParsed = parseListPage(sp.get("page"));
  if (!pageParsed.ok) {
    return NextResponse.json({ error: pageParsed.error, code: "invalid_page" }, { status: 400 });
  }
  const sizeParsed = parseBoundedPageSize(sp.get("pageSize"), ADMIN_API_LIST_PAGE);
  if (!sizeParsed.ok) {
    return NextResponse.json(
      {
        error: sizeParsed.error.message,
        code: sizeParsed.error.code,
        ...(sizeParsed.error.maxPageSize !== undefined ? { maxPageSize: sizeParsed.error.maxPageSize } : {}),
      },
      { status: 400 },
    );
  }
  const page = pageParsed.page;
  const pageSize = sizeParsed.pageSize;

  const where = {};
  const [total, flashcards] = await Promise.all([
    prisma.flashcard.count({ where }),
    prisma.flashcard.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: { id: true, front: true, status: true, tier: true, country: true, updatedAt: true },
    }),
  ]);

  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return NextResponse.json({ page, pageSize, total, pageCount, flashcards });
}

export async function POST(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;
  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  if (parsed.data.status === ContentStatus.PUBLISHED) {
    if (parsed.data.front.trim().length < 4 || parsed.data.back.trim().length < 4) {
      return NextResponse.json({ error: "Front/back too short to publish" }, { status: 400 });
    }
  }

  const { deckId, positionInDeck, examFamily, ...cardFields } = parsed.data;

  const card = await prisma.$transaction(async (tx) => {
    const nextPos =
      positionInDeck ??
      (deckId
        ? ((await tx.flashcard.aggregate({ where: { deckId }, _max: { positionInDeck: true } }))._max.positionInDeck ?? -1) + 1
        : 0);

    const created = await tx.flashcard.create({
      data: {
        ...cardFields,
        examFamily: examFamily ?? "GENERIC",
        deckId: deckId ?? null,
        positionInDeck: deckId ? nextPos : 0,
      },
    });

    if (deckId) {
      await tx.flashcardDeck.update({
        where: { id: deckId },
        data: { cardCount: { increment: 1 } },
      });
    }

    return created;
  });

  return NextResponse.json({ flashcard: card }, { status: 201 });
}
