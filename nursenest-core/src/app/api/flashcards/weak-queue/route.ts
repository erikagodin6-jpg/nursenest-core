import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import {
  loadWeakAreaFlashcardsForUser,
  resolveSubscriberWeakQueuePathwayId,
} from "@/lib/flashcards/load-weak-flashcards";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";

export const dynamic = "force-dynamic";

/** Subscriber-only: cards aligned to weak topics from question/practice stats (virtual “weak deck”). */
export async function GET(req: NextRequest) {
  return runWithApiTelemetry(req, "GET /api/flashcards/weak-queue", "content", async () => {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  setSentryServerContext({ route: "/api/flashcards/weak-queue", feature: SERVER_FEATURE.flashcard, userId: gate.userId });

  try {
    const requestedPathwayId = req.nextUrl.searchParams.get("pathwayId")?.trim() || null;
    const resolved = await resolveSubscriberWeakQueuePathwayId(gate.userId, gate.entitlement, requestedPathwayId);

    if (!resolved.ok) {
      if (resolved.resolution.state === "invalid_requested") {
        return NextResponse.json(
          {
            error: "This study track is not on your account",
            code: "flashcard_weak_queue_invalid_pathway",
            requestedPathwayId: resolved.resolution.requestedPathwayId,
          },
          { status: 400 },
        );
      }
      return NextResponse.json({
        pathwayId: null,
        pathwayResolution: resolved.resolution.state,
        pathwayRequired: true,
        weakTopics: [],
        topicCodes: [],
        cards: [],
        confidenceBreakdown: { high: 0, medium: 0, low: 0 },
        empty: true,
        hint:
          "Choose your exam track in Study preferences, or open Weak Areas from Flashcards with ?pathwayId=… matching your subscription so cards stay on one pathway.",
      });
    }

    const pathwayId = resolved.pathwayId;
    const { weakTopics, topicCodes, cards } = await loadWeakAreaFlashcardsForUser(
      gate.userId,
      gate.entitlement,
      pathwayId,
    );
    return NextResponse.json({
      pathwayId,
      pathwayResolution: "scoped" as const,
      weakTopics,
      topicCodes,
      cards,
      confidenceBreakdown: {
        high: cards.filter((c) => c.confidence === "high").length,
        medium: cards.filter((c) => c.confidence === "medium").length,
        low: cards.filter((c) => c.confidence === "low").length,
      },
      empty: cards.length === 0,
      hint:
        cards.length === 0
          ? "Complete a few more questions with mapped topics so we can build a precise weak-area queue."
          : null,
    });
  } catch (e) {
    safeServerLogCritical("api_flashcards_weak_queue", "load_failed", {}, e);
    return NextResponse.json({ error: "Unable to build weak-area set" }, { status: 503 });
  }
  });
}
