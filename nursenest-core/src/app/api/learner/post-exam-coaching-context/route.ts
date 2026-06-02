import { NextResponse } from "next/server";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { loadLearnerCoachingContext } from "@/lib/learner/rn-coaching-intelligence/learner-coaching-context-loader";
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
      const ctx = await loadLearnerCoachingContext(gate.userId, gate.entitlement);
      return NextResponse.json(ctx, {
        headers: { "Cache-Control": "private, no-store, must-revalidate" },
      });
    } catch {
      return NextResponse.json({ error: "Unable to load coaching context." }, { status: 503 });
    }
  });
}
