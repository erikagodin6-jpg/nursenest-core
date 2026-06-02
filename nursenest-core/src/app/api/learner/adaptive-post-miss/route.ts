import { NextResponse } from "next/server";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { mergeSubscriberPrivateCacheHeaders } from "@/lib/http/subscriber-api-cache";
import { isAdaptiveLearningEnabled } from "@/lib/learner/adaptive-learning-env";
import { buildPracticeAdaptivePostMissPayload } from "@/lib/learner/build-learner-adaptive-wire-bundle";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";

export const dynamic = "force-dynamic";

function featureDisabledResponse() {
  return NextResponse.json(
    {
      locked: true,
      code: "adaptive_learning_disabled",
      message: "Adaptive study recommendations are not enabled for this environment.",
    },
    { status: 403, headers: mergeSubscriberPrivateCacheHeaders() },
  );
}

function narrowPostMiss(plan: NonNullable<Awaited<ReturnType<typeof buildPracticeAdaptivePostMissPayload>>>) {
  const { recommendations } = plan;
  return {
    trigger: plan.trigger,
    suggestedSurfaceOrder: plan.suggestedSurfaceOrder,
    recommendations: {
      ...recommendations,
      rankedWeakTopics: recommendations.rankedWeakTopics.slice(0, 8),
      lessons: recommendations.lessons.slice(0, 5),
      flashcards: recommendations.flashcards.slice(0, 6),
      practiceCat: {
        ...recommendations.practiceCat,
        topicKeys: recommendations.practiceCat.topicKeys.slice(0, 8),
      },
    },
  };
}

export async function POST(req: Request) {
  return runWithApiTelemetry(req, "POST /api/learner/adaptive-post-miss", "content", async () => {
    if (!isAdaptiveLearningEnabled()) return featureDisabledResponse();

    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    setSentryServerContext({
      route: "/api/learner/adaptive-post-miss",
      feature: SERVER_FEATURE.api,
      userId: gate.userId,
    });

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON", code: "bad_request" }, { status: 400 });
    }
    const o = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
    const pathwayId = typeof o.pathwayId === "string" ? o.pathwayId.trim() : "";
    if (!pathwayId || pathwayId.length > 120) {
      return NextResponse.json({ error: "pathwayId required", code: "bad_request" }, { status: 400 });
    }
    const missedTopicKey = typeof o.missedTopicKey === "string" ? o.missedTopicKey.slice(0, 200) : null;

    const plan = await buildPracticeAdaptivePostMissPayload(gate.userId, gate.entitlement, {
      pathwayId,
      missedTopicKey,
    });
    if (!plan) {
      return NextResponse.json(
        { locked: true, code: "adaptive_unavailable", message: "Could not compose post-miss plan." },
        { status: 503, headers: mergeSubscriberPrivateCacheHeaders() },
      );
    }

    return NextResponse.json(narrowPostMiss(plan), { headers: mergeSubscriberPrivateCacheHeaders() });
  });
}
