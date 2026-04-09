import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
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
  LESSON_PAGE,
  MAX_LIST_SKIP_ROWS_DEFAULT,
  isSkipBeyondLimit,
  listSkipRows,
  maxSafeOffsetPage,
  parseBoundedPageSize,
  parseListPage,
} from "@/lib/api/api-pagination-limits";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export async function GET(req: NextRequest) {
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

  const sizeParsed = parseBoundedPageSize(req.nextUrl.searchParams.get("pageSize"), LESSON_PAGE);
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

  const skipRows = listSkipRows(page, pageSize);
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

  let entitlement;
  try {
    entitlement = await resolveEntitlement(userId);
  } catch (e) {
    safeServerLogCritical("api_lessons", "entitlement_resolve_failed", { page }, e);
    return NextResponse.json({ error: "Unable to verify access. Try again shortly." }, { status: 503 });
  }

  if (entitlement.hasAccess) {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    setSentryServerContext({ route: "/api/lessons", feature: SERVER_FEATURE.lesson, userId: gate.userId });

    try {
      const where = lessonAccessWhere(gate.entitlement);
      const [lessons, total] = await Promise.all([
        withRetry(() =>
          prisma.contentItem.findMany({
            where,
            select: { id: true, slug: true, title: true, summary: true },
            orderBy: { updatedAt: "desc" },
            skip: skipRows,
            take: pageSize,
          }),
        ),
        withRetry(() => prisma.contentItem.count({ where })),
      ]);

      const pageCount = Math.max(1, Math.ceil(total / pageSize));

      const subscriberBody = {
        page,
        pageSize,
        total,
        pageCount,
        lessons,
        mode: "subscriber" as const,
      };
      logLargeApiResponse("/api/lessons", estimateJsonUtf8Bytes(subscriberBody));
      return NextResponse.json(subscriberBody);
    } catch (e) {
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
        orderBy: { updatedAt: "desc" },
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
      mode: "freemium" as const,
      freemiumRemainingAfterBatch: remaining,
    };
    logLargeApiResponse("/api/lessons", estimateJsonUtf8Bytes(freemiumBody));
    return NextResponse.json(freemiumBody);
  } catch (e) {
    safeServerLogCritical("api_lessons", "prisma_find_failed_freemium", { page }, e);
    return NextResponse.json({ error: "Unable to load lessons. Try again shortly." }, { status: 503 });
  }
}
