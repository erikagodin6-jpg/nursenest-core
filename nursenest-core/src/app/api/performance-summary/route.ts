import { NextResponse } from "next/server";
import { isPerformanceSummaryApiEnabled } from "@/lib/config/performance-summary-api-flag";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { loadUserPerformanceSummary } from "@/lib/study/performance-summary-load";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";

/**
 * Aggregated performance summary (accuracy by body system / topic, timing, weak areas, pass-probability estimate).
 *
 * - **Auth**: subscriber session (same gate as `/api/learner/readiness`).
 * - **Flag**: `NN_ENABLE_PERFORMANCE_SUMMARY_API=true` required (safe rollout).
 * - **Data**: bounded reads via `analytics-data` loaders; no schema changes.
 */
export async function GET(req: Request) {
  return runWithApiTelemetry(req, "GET /api/performance-summary", "content", async () => {
    if (!isPerformanceSummaryApiEnabled()) {
      return NextResponse.json(
        {
          error: "Performance summary API is not enabled in this environment.",
          code: "feature_disabled",
        },
        { status: 501 },
      );
    }

    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    setSentryServerContext({
      route: "/api/performance-summary",
      feature: SERVER_FEATURE.api,
      userId: gate.userId,
    });

    const payload = await loadUserPerformanceSummary(gate.userId);
    return NextResponse.json(payload);
  });
}
