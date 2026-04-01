import { NextResponse } from "next/server";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { loadWeakAreaFlashcardsForUser } from "@/lib/flashcards/load-weak-flashcards";
import { setSentryServerContext } from "@/lib/observability/sentry-server-context";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";

export const dynamic = "force-dynamic";

/** Subscriber-only: cards aligned to weak topics from question/practice stats (virtual “weak deck”). */
export async function GET() {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  setSentryServerContext({ route: "/api/flashcards/weak-queue", feature: "flashcard", userId: gate.userId });

  try {
    const { weakTopics, cards } = await loadWeakAreaFlashcardsForUser(gate.userId, gate.entitlement);
    return NextResponse.json({
      weakTopics,
      cards,
      empty: cards.length === 0,
      hint:
        cards.length === 0
          ? "Complete a few more questions so we can infer weak topics, or study a full deck from Flashcards."
          : null,
    });
  } catch (e) {
    safeServerLogCritical("api_flashcards_weak_queue", "load_failed", {}, e);
    return NextResponse.json({ error: "Unable to build weak-area set" }, { status: 503 });
  }
}
