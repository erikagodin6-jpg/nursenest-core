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

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page") ?? "1"));
  const pageSize = Math.min(30, Math.max(6, Number(req.nextUrl.searchParams.get("pageSize") ?? "18")));

  const examFamily = req.nextUrl.searchParams.get("examFamily")?.trim();
  const pathwayId = req.nextUrl.searchParams.get("pathwayId")?.trim();

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
          },
          orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
          skip: (page - 1) * pageSize,
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
