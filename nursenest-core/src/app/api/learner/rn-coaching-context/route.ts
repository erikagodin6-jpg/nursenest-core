import { NextResponse } from "next/server";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { loadUnifiedTopicPerformance } from "@/lib/learner/topic-performance";
import { readLearnerState } from "@/lib/learner/rn-coaching-intelligence/learner-state-store";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";

/**
 * Server context for RN coaching intelligence (topic trends + optional client learner state echo).
 * Client learner state persists in localStorage; this route supplies authoritative topic performance.
 */
export async function GET(req: Request) {
  return runWithApiTelemetry(req, "GET /api/learner/rn-coaching-context", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    setSentryServerContext({
      route: "/api/learner/rn-coaching-context",
      feature: SERVER_FEATURE.question,
      userId: gate.userId,
    });

    try {
      const snap = await loadUnifiedTopicPerformance(gate.userId, gate.entitlement, 12);
      return NextResponse.json({
        topicTrends: snap.trends,
        weakTopics: snap.weakTopics,
        strongTopics: snap.strongTopics,
        recentSessionCount: snap.weakTopics.reduce((n, w) => n + (w.attempted ?? 0), 0),
        source: snap.source,
        learnerStateVersion: 1,
      });
    } catch {
      return NextResponse.json({ error: "Unable to load RN coaching context." }, { status: 503 });
    }
  });
}
