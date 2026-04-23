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
import { readFlashcardsSubscriberListSnapshot } from "@/lib/study-content-failover/flashcards-list-snapshot-read";
import { snapshotAgeMs as computeSnapshotAgeMs } from "@/lib/study-content-failover/study-published-snapshot-store";

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
    safeServerLog("api_flashcards", "critical_study_load_diagnostics", {
      event: "critical_study_load_diagnostics",
      operation: "GET /api/flashcards",
      feature_surface: "flashcards_subscriber_list",
      live_outcome: "error",
      snapshot_used: "false",
      final_outcome: "error",
      fallback_used: "false",
      error_message: "database_url_unset",
    });
    return NextResponse.json(
      {
        error: "Study content is temporarily unavailable (database not configured in this environment).",
        code: "db_unavailable",
        retryable: true,
      },
      { status: 503 },
    );
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
      source_used: "primary" as const,
    };
    logLargeApiResponse("/api/flashcards", estimateJsonUtf8Bytes(body));
    return NextResponse.json(body);
  } catch (e) {
    safeServerLogCritical("api_flashcards", "find_failed", { page }, e);
    const snap = await readFlashcardsSubscriberListSnapshot({
      tier: String(gate.entitlement.tier ?? "unknown"),
      country: String(gate.entitlement.country ?? "unknown"),
      locale: educationalLocale,
    });
    if (
      snap &&
      snap.payload.page === page &&
      snap.payload.pageSize === pageSize &&
      Array.isArray(snap.payload.flashcards)
    ) {
      const age = computeSnapshotAgeMs(snap.capturedAt);
      const localized = snap.payload.flashcards.map((c) => {
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
        page: snap.payload.page,
        pageSize: snap.payload.pageSize,
        total: snap.payload.total,
        pageCount: snap.payload.pageCount,
        flashcards: localized,
        mode: "subscriber" as const,
        source_used: "secondary" as const,
        failover_reason: "primary_db_failed",
        snapshot_version: snap.version,
        snapshot_age_ms: age,
      };
      safeServerLog("api_flashcards", "study_content_failover", {
        event: "study_content_failover",
        surface: "flashcards_subscriber_list",
        source_used: "secondary",
        failover_reason: "primary_db_failed",
        snapshot_version: snap.version.slice(0, 120),
        snapshot_age_ms: String(Math.round(age)),
        user_id_prefix: gate.userId.slice(0, 8),
      });
      logLargeApiResponse("/api/flashcards", estimateJsonUtf8Bytes(body));
      safeServerLog("api_flashcards", "critical_study_load_diagnostics", {
        event: "critical_study_load_diagnostics",
        operation: "GET /api/flashcards",
        feature_surface: "flashcards_subscriber_list",
        live_outcome: "error",
        snapshot_used: "true",
        final_outcome: "degraded_snapshot",
        fallback_used: "true",
        snapshot_age_ms: String(Math.round(age)),
      });
      return NextResponse.json(body);
    }
    safeServerLog("api_flashcards", "critical_study_load_diagnostics", {
      event: "critical_study_load_diagnostics",
      operation: "GET /api/flashcards",
      feature_surface: "flashcards_subscriber_list",
      live_outcome: "error",
      snapshot_used: "false",
      final_outcome: "error",
      fallback_used: "false",
    });
    return NextResponse.json(
      { error: "Unable to load flashcards", code: "primary_and_snapshot_failed", retryable: true },
      { status: 503 },
    );
  }
  });
}
