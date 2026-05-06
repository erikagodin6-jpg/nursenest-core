/**
 * Premium adaptive recommendations: server gate is {@link requireSubscriberSession} → `getUserAccess` /
 * `accessScopeFromUserAccess`. For the typed cross-platform contract see
 * {@link toCanonicalLearnerAccess} in `canonical-learner-access.server.ts` (Phase 4B).
 */
import { NextResponse } from "next/server";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { mergeSubscriberPrivateCacheHeaders } from "@/lib/http/subscriber-api-cache";
import { isAdaptiveLearningEnabled } from "@/lib/adaptive-learning/adaptive-learning-flags";
import { loadLearnerAdaptiveWireBundle } from "@/lib/learner/build-learner-adaptive-wire-bundle";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return runWithApiTelemetry(req, "GET /api/learner/adaptive-recommendations", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    setSentryServerContext({
      route: "/api/learner/adaptive-recommendations",
      feature: SERVER_FEATURE.api,
      userId: gate.userId,
    });

    if (!isAdaptiveLearningEnabled()) {
      return NextResponse.json(
        { featureEnabled: false, message: "Adaptive learning recommendations are disabled." },
        { headers: mergeSubscriberPrivateCacheHeaders() },
      );
    }

    const payload = await loadLearnerAdaptiveWireBundle(gate.userId, gate.entitlement, {
      source: "api:GET:learner/adaptive-recommendations",
    });

    if (!payload) {
      return NextResponse.json(
        {
          featureEnabled: true,
          error: "Unable to load recommendations.",
          code: "adaptive_unavailable",
        },
        { status: 503, headers: mergeSubscriberPrivateCacheHeaders() },
      );
    }

    return NextResponse.json(
      {
        featureEnabled: true,
        generatedAt: new Date().toISOString(),
        ...payload,
      },
      { headers: mergeSubscriberPrivateCacheHeaders() },
    );
  });
}
