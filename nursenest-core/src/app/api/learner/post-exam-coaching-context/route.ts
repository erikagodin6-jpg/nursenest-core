import { NextResponse } from "next/server";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { loadUnifiedTopicPerformance } from "@/lib/learner/topic-performance";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";

export async function GET(req: Request) {
  return runWithApiTelemetry(req, "GET /api/learner/post-exam-coaching-context", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    setSentryServerContext({
      route: "/api/learner/post-exam-coaching-context",
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
      });
    } catch {
      return NextResponse.json({ error: "Unable to load coaching context." }, { status: 503 });
    }
  });
}
