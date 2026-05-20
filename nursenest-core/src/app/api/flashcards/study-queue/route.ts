/**
 * GET /api/flashcards/study-queue
 *
 * Returns segmented SRS queues for the authenticated learner:
 *   - counts: { newCards, dueToday, overdue, lapsing, totalReviewed }
 *   - cards:  prioritised list (lapsing → overdue → due today) up to ?limit per segment
 *
 * Query params:
 *   pathwayId  — narrow to a specific exam track (optional)
 *   limit      — max cards per segment (default 50, max 100)
 *   countsOnly — "1" to skip card rows, only return counts (faster for dashboard widgets)
 */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { loadStudyQueueCounts, loadStudyQueueSegments } from "@/lib/flashcards/study-queue-segments";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  return runWithApiTelemetry(req, "GET /api/flashcards/study-queue", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    const { userId, entitlement } = gate;
    setSentryServerContext({ route: "/api/flashcards/study-queue", feature: SERVER_FEATURE.flashcard, userId });

    if (!isDatabaseUrlConfigured()) {
      return NextResponse.json(
        { error: "Study queue unavailable (database not configured).", code: "db_unavailable", degraded: true },
        { status: 503 },
      );
    }

    const url = req.nextUrl;
    const pathwayId = url.searchParams.get("pathwayId")?.trim() || null;
    const countsOnly = url.searchParams.get("countsOnly") === "1";
    const rawLimit = Number(url.searchParams.get("limit") || "50");
    const limit = Math.min(100, Math.max(1, Number.isFinite(rawLimit) ? rawLimit : 50));

    try {
      if (countsOnly) {
        const counts = await loadStudyQueueCounts(userId, entitlement, pathwayId);
        return NextResponse.json({ counts, cards: [], asOf: new Date().toISOString() });
      }

      const { counts, cards } = await loadStudyQueueSegments(userId, entitlement, pathwayId, limit);
      return NextResponse.json({ counts, cards, asOf: new Date().toISOString() });
    } catch (e) {
      safeServerLogCritical("api_flashcards_study_queue", "query_failed", {}, e);
      return NextResponse.json({ error: "Unable to load study queue", code: "query_failed" }, { status: 503 });
    }
  });
}
