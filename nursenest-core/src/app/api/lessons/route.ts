import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  decodeLessonListCursor,
  encodeLessonListCursor,
  LESSON_LIST_ORDER_BY,
  lessonListKeysetWhereAfter,
} from "@/lib/api/lessons-list-cursor";
import { freemiumLessonWhereForProfile, lessonAccessWhere } from "@/lib/entitlements/content-access-scope";
import { getFreemiumSnapshot } from "@/lib/entitlements/freemium";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { resolveEntitlement } from "@/lib/entitlements/resolve-entitlement";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { logLargeApiResponse } from "@/lib/observability/perf-log";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { estimateJsonUtf8Bytes } from "@/lib/questions/question-payload-metrics";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { withRetry } from "@/lib/resilience/with-retry";
import type { CountryCode, TierCode } from "@prisma/client";
import {
  LESSON_API_OFFSET_LIMIT,
  MAX_LIST_SKIP_ROWS_DEFAULT,
  isSkipBeyondLimit,
  listSkipRows,
  maxSafeOffsetPage,
  parseBoundedPageSize,
  parseListPage,
} from "@/lib/api/api-pagination-limits";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { correlationIdFromRequest } from "@/lib/observability/request-correlation";
import { recordEntitlementResolveFailureSignal } from "@/lib/observability/production-signal-metrics";
import { productEvent } from "@/lib/observability/product-events";
import { emitStructuredLog } from "@/lib/observability/structured-log";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { jsonResponseGuarded } from "@/lib/server/response-guard";

/** Keep numeric literal — Next segment config must be statically analyzable (see `API_ROUTE_MAX_DURATION_LIST_HEAVY_SEC`). */
export const maxDuration = 60;

function wantsCursorMode(req: NextRequest): boolean {
  const mode = req.nextUrl.searchParams.get("paginationMode");
  if (mode === "cursor") return true;
  const c = req.nextUrl.searchParams.get("cursor");
  return c !== null && c !== "";
}

export async function GET(req: NextRequest) {
  return runWithApiTelemetry(req, "GET /api/lessons", "content", async () => {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const useCursor = wantsCursorMode(req);

  const rawLimit = req.nextUrl.searchParams.get("limit") ?? req.nextUrl.searchParams.get("pageSize");
  const sizeParsed = parseBoundedPageSize(rawLimit, LESSON_API_OFFSET_LIMIT);
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

  let page = 1;
  let skipRows = 0;
  if (!useCursor) {
    const pageParsed = parseListPage(req.nextUrl.searchParams.get("page"));
    if (!pageParsed.ok) {
      return NextResponse.json({ error: pageParsed.error, code: "invalid_page" }, { status: 400 });
    }
    page = pageParsed.page;

    const maxPage = maxSafeOffsetPage(pageSize);
    if (page > maxPage) {
      return NextResponse.json(
        {
          error: `page must be at most ${maxPage} for this pageSize (offset cap ${MAX_LIST_SKIP_ROWS_DEFAULT}).`,
          code: "page_out_of_range",
          maxPage,
        },
        { status: 400 },
      );
    }

    skipRows = listSkipRows(page, pageSize);
    if (isSkipBeyondLimit(skipRows)) {
      safeServerLog("api_lessons", "pagination_depth_rejected", {
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
  }

  let entitlement;
  try {
    entitlement = await resolveEntitlement(userId);
  } catch (e) {
    const correlationId = correlationIdFromRequest(req);
    productEvent("entitlement_resolve_failed", { surface: "api_lessons_list" });
    recordEntitlementResolveFailureSignal("api_lessons_list", correlationId);
    emitStructuredLog("entitlement_resolve_failed", "error", {
      correlationId,
      route: "/api/lessons",
      method: "GET",
      flow: "content",
      errorClass: e instanceof Error ? e.name : typeof e,
      message: "entitlement resolve failed in lesson list",
    });
    safeServerLogCritical("api_lessons", "entitlement_resolve_failed", { page }, e);
    return NextResponse.json({ error: "Unable to verify access. Try again shortly." }, { status: 503 });
  }

  if (useCursor && !entitlement.hasAccess) {
    return NextResponse.json(
      {
        error: "Cursor pagination requires an active subscription.",
        code: "cursor_requires_subscriber",
      },
      { status: 400 },
    );
  }

  if (entitlement.hasAccess) {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    setSentryServerContext({ route: "/api/lessons", feature: SERVER_FEATURE.lesson, userId: gate.userId });

    const whereBase = lessonAccessWhere(gate.entitlement);

    if (useCursor) {
      const rawCursor = req.nextUrl.searchParams.get("cursor");
      let cursor: { updatedAt: Date; id: string } | null = null;
      if (rawCursor !== null && rawCursor !== "") {
        const decoded = decodeLessonListCursor(rawCursor);
        if (!decoded.ok) {
          return NextResponse.json({ error: decoded.message, code: decoded.code }, { status: 400 });
        }
        cursor = { updatedAt: decoded.updatedAt, id: decoded.id };
      }

      try {
        const where: typeof whereBase =
          cursor === null ? whereBase : { AND: [whereBase, lessonListKeysetWhereAfter(cursor)] };

        const rawRows = await withRetry(() =>
          prisma.contentItem.findMany({
            where,
            select: { id: true, slug: true, title: true, summary: true, updatedAt: true },
            orderBy: LESSON_LIST_ORDER_BY,
            take: pageSize + 1,
          }),
        );

        const hasMore = rawRows.length > pageSize;
        const slice = hasMore ? rawRows.slice(0, pageSize) : rawRows;
        const lessons = slice.map(({ updatedAt: _u, ...rest }) => rest);

        const last = slice[pageSize - 1];
        const nextCursor =
          hasMore && last ? encodeLessonListCursor(last.updatedAt, last.id) : null;

        const subscriberCursorBody = {
          pageSize,
          lessons,
          totalCount: null as number | null,
          currentPage: null as number | null,
          totalPages: null as number | null,
          mode: "subscriber" as const,
          pagination: {
            mode: "cursor" as const,
            pageSize,
            hasMore,
            nextCursor,
          },
        };
        logLargeApiResponse("/api/lessons", estimateJsonUtf8Bytes(subscriberCursorBody));
        return jsonResponseGuarded("/api/lessons", subscriberCursorBody);
      } catch (e) {
        safeServerLogCritical("api_lessons", "prisma_find_failed_cursor", { pageSize }, e);
        return NextResponse.json({ error: "Unable to load lessons. Try again shortly." }, { status: 503 });
      }
    }

    try {
      const [lessons, total] = await Promise.all([
        withRetry(() =>
          prisma.contentItem.findMany({
            where: whereBase,
            select: { id: true, slug: true, title: true, summary: true },
            orderBy: LESSON_LIST_ORDER_BY,
            skip: skipRows,
            take: pageSize,
          }),
        ),
        withRetry(() => prisma.contentItem.count({ where: whereBase })),
      ]);

      const pageCount = Math.max(1, Math.ceil(total / pageSize));
      const maxPage = maxSafeOffsetPage(pageSize);
      const hasMore = page < pageCount;

      const subscriberBody = {
        page,
        pageSize,
        total,
        pageCount,
        lessons,
        totalCount: total,
        currentPage: page,
        totalPages: pageCount,
        mode: "subscriber" as const,
        pagination: {
          mode: "offset" as const,
          pageSize,
          hasMore,
          totalCount: total,
          page,
          maxPage,
        },
      };
      logLargeApiResponse("/api/lessons", estimateJsonUtf8Bytes(subscriberBody));
      return jsonResponseGuarded("/api/lessons", subscriberBody);
    } catch (e) {
      emitStructuredLog("lesson_load_failed", "error", {
        correlationId: correlationIdFromRequest(req),
        route: "/api/lessons",
        method: "GET",
        flow: "content",
        httpStatus: 503,
        errorClass: e instanceof Error ? e.name : "unknown",
        message: "subscriber lesson list failure",
      });
      safeServerLogCritical("api_lessons", "prisma_find_failed", { page }, e);
      return NextResponse.json({ error: "Unable to load lessons. Try again shortly." }, { status: 503 });
    }
  }

  if (!isDatabaseUrlConfigured()) {
    return NextResponse.json(
      { error: "Study content is temporarily unavailable. Try again shortly.", code: "database_unavailable" },
      { status: 503 },
    );
  }

  let user: { country: string | null; tier: string | null; freeLessonOpens: number } | null = null;
  try {
    user = await prisma.user.findUnique({
      where: { id: userId },
      select: { country: true, tier: true, freeLessonOpens: true },
    });
  } catch (e) {
    emitStructuredLog("lesson_load_failed", "error", {
      correlationId: correlationIdFromRequest(req),
      route: "/api/lessons",
      method: "GET",
      flow: "content",
      httpStatus: 503,
      errorClass: e instanceof Error ? e.name : "unknown",
      message: "freemium user lookup failure",
    });
    safeServerLogCritical("api_lessons", "user_lookup_failed_freemium", { userId: userId.slice(0, 8) }, e);
    return NextResponse.json({ error: "Unable to load profile. Try again shortly." }, { status: 503 });
  }
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  setSentryServerContext({ route: "/api/lessons", feature: SERVER_FEATURE.lesson, userId });

  const snap = await getFreemiumSnapshot(userId);
  if (!snap || snap.lessonRemaining <= 0) {
    const payload = { code: "not_subscribed", message: "Subscription required", freemiumExhausted: true };
    return NextResponse.json(payload, { status: 403 });
  }

  const take = Math.min(pageSize, snap.lessonRemaining);

  try {
    const where = freemiumLessonWhereForProfile(user.country as CountryCode, user.tier as TierCode);
    const lessons = await withRetry(() =>
      prisma.contentItem.findMany({
        where,
        select: { id: true, slug: true, title: true, summary: true },
        orderBy: LESSON_LIST_ORDER_BY,
        skip: 0,
        take,
      }),
    );

    const used = lessons.length;
    if (used > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: { freeLessonOpens: { increment: used } },
      });
    }

    const remaining = Math.max(0, snap.lessonRemaining - used);
    const trimmedSummary = lessons.map((l) => ({
      ...l,
      summary:
        (l.summary ?? "").length > 220
          ? `${(l.summary ?? "").slice(0, 220).trim()}… Unlock full lessons with a subscription.`
          : l.summary ?? "",
    }));

    const freemiumBody = {
      page: 1,
      pageSize: take,
      lessons: trimmedSummary,
      totalCount: trimmedSummary.length,
      currentPage: 1,
      totalPages: 1,
      mode: "freemium" as const,
      freemiumRemainingAfterBatch: remaining,
      pagination: {
        mode: "offset" as const,
        pageSize: take,
        hasMore: false,
        page: 1,
      },
    };
    logLargeApiResponse("/api/lessons", estimateJsonUtf8Bytes(freemiumBody));
    return jsonResponseGuarded("/api/lessons", freemiumBody);
  } catch (e) {
    emitStructuredLog("lesson_load_failed", "error", {
      correlationId: correlationIdFromRequest(req),
      route: "/api/lessons",
      method: "GET",
      flow: "content",
      httpStatus: 503,
      errorClass: e instanceof Error ? e.name : "unknown",
      message: "lesson list prisma failure",
    });
    safeServerLogCritical("api_lessons", "prisma_find_failed_freemium", { page }, e);
    return NextResponse.json({ error: "Unable to load lessons. Try again shortly." }, { status: 503 });
  }
  });
}
