import { NextRequest, NextResponse } from "next/server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { auth } from "@/lib/auth";
import { flashcardAccessWhere } from "@/lib/entitlements/content-access-scope";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { logLargeApiResponse } from "@/lib/observability/perf-log";
import { applyFlashcardCardOverlay } from "@/lib/i18n/educational-content-overlay";
import { resolveMergedFlashcardEducationalBundle } from "@/lib/i18n/educational-translation-db";
import { getMarketingLocaleFromRequestCookie } from "@/lib/i18n/marketing-locale-cookie";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { estimateJsonUtf8Bytes } from "@/lib/questions/question-payload-metrics";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { withRetry } from "@/lib/resilience/with-retry";
import {
  FLASHCARD_PAGE,
  MAX_LIST_SKIP_ROWS_DEFAULT,
  isSkipBeyondLimit,
  listSkipRows,
  parseBoundedPageSize,
  parseListPage,
} from "@/lib/api/api-pagination-limits";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/** Keep numeric literal — Next segment config must be statically analyzable (see `API_ROUTE_MAX_DURATION_LIST_HEAVY_SEC`). */
export const maxDuration = 60;

/**
 * Subscriber-only flashcard list (backend-enforced; no freemium bypass of full backs).
 */
export async function GET(req: NextRequest) {
  return runWithApiTelemetry(req, "GET /api/flashcards", "content", async () => {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pageParsed = parseListPage(req.nextUrl.searchParams.get("page"));
  if (!pageParsed.ok) {
    return NextResponse.json({ error: pageParsed.error, code: "invalid_page" }, { status: 400 });
  }
  const page = pageParsed.page;

  const sizeParsed = parseBoundedPageSize(req.nextUrl.searchParams.get("pageSize"), FLASHCARD_PAGE);
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
    safeServerLog("api_flashcards", "pagination_depth_rejected", {
      skipRows,
      maxSkipRows: MAX_LIST_SKIP_ROWS_DEFAULT,
      page,
      pageSize,
      userId,
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

  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  setSentryServerContext({ route: "/api/flashcards", feature: SERVER_FEATURE.flashcard, userId: gate.userId });

  const educationalLocale = getMarketingLocaleFromRequestCookie(req);
  const flashcardBundle = await resolveMergedFlashcardEducationalBundle(educationalLocale);

  if (!isDatabaseUrlConfigured()) {
    return NextResponse.json({
      page,
      pageSize,
      total: 0,
      pageCount: 1,
      flashcards: [],
      mode: "subscriber" as const,
      degraded: true,
    });
  }

  try {
    const where = flashcardAccessWhere(gate.entitlement);
    const [flashcards, total] = await Promise.all([
      withRetry(() =>
        prisma.flashcard.findMany({
          where,
          select: {
            id: true,
            front: true,
            back: true,
            examFamily: true,
            category: { select: { name: true, slug: true } },
          },
          orderBy: { updatedAt: "desc" },
          skip: skipRows,
          take: pageSize,
        }),
      ),
      withRetry(() => prisma.flashcard.count({ where })),
    ]);

    const pageCount = Math.max(1, Math.ceil(total / pageSize));

    const localized = flashcards.map((c) => {
      const loc = applyFlashcardCardOverlay(
        { id: c.id, front: c.front, back: c.back },
        educationalLocale,
        flashcardBundle,
      );
      return {
        ...c,
        front: loc.front,
        back: loc.back,
        ...(loc.explanation ? { explanation: loc.explanation } : {}),
      };
    });

    const body = {
      page,
      pageSize,
      total,
      pageCount,
      flashcards: localized,
      mode: "subscriber" as const,
    };
    logLargeApiResponse("/api/flashcards", estimateJsonUtf8Bytes(body));
    return NextResponse.json(body);
  } catch (e) {
    safeServerLogCritical("api_flashcards", "find_failed", { page }, e);
    return NextResponse.json({ error: "Unable to load flashcards" }, { status: 503 });
  }
  });
}
