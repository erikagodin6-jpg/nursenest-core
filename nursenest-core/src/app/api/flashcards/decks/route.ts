import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { resolveEntitlement } from "@/lib/entitlements/resolve-entitlement";
import { prismaDeckListWhere } from "@/lib/flashcards/flashcard-access";
import { prisma } from "@/lib/db";
import { estimateJsonUtf8Bytes } from "@/lib/questions/question-payload-metrics";
import { logLargeApiResponse } from "@/lib/observability/perf-log";
import { setSentryServerContext } from "@/lib/observability/sentry-server-context";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { withRetry } from "@/lib/resilience/with-retry";
import { ExamFamily, type Prisma } from "@prisma/client";
import { logFlashcardLargePayload } from "@/lib/observability/flashcard-log";
import {
  FLASHCARD_DECK_PAGE,
  MAX_LIST_SKIP_ROWS_DEFAULT,
  isSkipBeyondLimit,
  listSkipRows,
  parseBoundedPageSize,
  parseListPage,
} from "@/lib/api/api-pagination-limits";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  const pageParsed = parseListPage(req.nextUrl.searchParams.get("page"));
  if (!pageParsed.ok) {
    return NextResponse.json({ error: pageParsed.error, code: "invalid_page" }, { status: 400 });
  }
  const page = pageParsed.page;

  const sizeParsed = parseBoundedPageSize(req.nextUrl.searchParams.get("pageSize"), FLASHCARD_DECK_PAGE);
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
  const pageSize = sizeParsed.pageSize;

  const skipRows = listSkipRows(page, pageSize);
  if (isSkipBeyondLimit(skipRows)) {
    safeServerLog("api_flashcards_decks", "pagination_depth_rejected", {
      skipRows,
      maxSkipRows: MAX_LIST_SKIP_ROWS_DEFAULT,
      page,
      pageSize,
      userId: userId ?? "",
    });
    return NextResponse.json(
      {
        error: `Pagination too deep; use filters or a smaller page (max offset ${MAX_LIST_SKIP_ROWS_DEFAULT} rows).`,
        code: "pagination_depth_limit",
        maxSkipRows: MAX_LIST_SKIP_ROWS_DEFAULT,
      },
      { status: 400 },
    );
  }

  const examFamily = req.nextUrl.searchParams.get("examFamily")?.trim();
  const pathwayId = req.nextUrl.searchParams.get("pathwayId")?.trim();
  const tagSlug = req.nextUrl.searchParams.get("tagSlug")?.trim();
  const topicSlug = req.nextUrl.searchParams.get("topicSlug")?.trim();

  setSentryServerContext({ route: "/api/flashcards/decks", feature: "flashcard", userId: userId ?? "" });

  let entitlement = null;
  try {
    if (userId) {
      entitlement = await resolveEntitlement(userId);
    }
  } catch (e) {
    safeServerLogCritical("api_flashcards_decks", "entitlement_failed", {}, e);
    return NextResponse.json({ error: "Unable to verify access" }, { status: 503 });
  }

  const isSubscriber = Boolean(entitlement?.hasAccess);
  const hasSession = Boolean(userId);

  const baseWhere = prismaDeckListWhere({ hasSession, isSubscriber, entitlement });
  const andExtra: Prisma.FlashcardDeckWhereInput[] = [];
  if (examFamily && (Object.values(ExamFamily) as string[]).includes(examFamily)) {
    andExtra.push({ examFamily: examFamily as ExamFamily });
  }
  if (pathwayId) {
    andExtra.push({ pathwayId });
  }
  const tagFilter = tagSlug ?? topicSlug;
  if (tagFilter) {
    andExtra.push({ tags: { some: { tag: { slug: tagFilter } } } });
  }
  const where: Prisma.FlashcardDeckWhereInput =
    andExtra.length > 0 ? { AND: [baseWhere, ...andExtra] } : baseWhere;

  try {
    const [decks, total] = await Promise.all([
      withRetry(() =>
        prisma.flashcardDeck.findMany({
          where,
          select: {
            id: true,
            slug: true,
            title: true,
            description: true,
            country: true,
            tier: true,
            examFamily: true,
            pathwayId: true,
            visibility: true,
            cardCount: true,
            tags: { select: { tag: { select: { slug: true, name: true } } } },
          },
          orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
          skip: skipRows,
          take: pageSize,
        }),
      ),
      withRetry(() => prisma.flashcardDeck.count({ where })),
    ]);

    const body = {
      page,
      pageSize,
      total,
      pageCount: Math.max(1, Math.ceil(total / pageSize)),
      decks: decks.map((d) => ({
        ...d,
        tags: d.tags.map((t) => t.tag),
        locked: !isSubscriber && d.visibility === "SUBSCRIBER",
      })),
    };

    const approx = estimateJsonUtf8Bytes(body);
    logLargeApiResponse("/api/flashcards/decks", approx);
    if (approx > 400_000) {
      logFlashcardLargePayload({ route: "/api/flashcards/decks", approxUtf8: approx });
    }

    return NextResponse.json(body);
  } catch (e) {
    safeServerLogCritical("api_flashcards_decks", "query_failed", { page }, e);
    return NextResponse.json({ error: "Unable to load decks" }, { status: 503 });
  }
}
