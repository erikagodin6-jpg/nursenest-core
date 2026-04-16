import { NextResponse } from "next/server";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { loadPremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";

export const dynamic = "force-dynamic";

/**
 * JSON insight snapshot for clients (same model as dashboard `PremiumDashboardSnapshot.insights`).
 */
export async function GET(req: Request) {
  return runWithApiTelemetry(req, "GET /api/learner/insights", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    setSentryServerContext({ route: "/api/learner/insights", feature: SERVER_FEATURE.question, userId: gate.userId });

    try {
      const snap = await loadPremiumDashboardSnapshot(gate.userId, gate.entitlement);
      return NextResponse.json({
        insights: snap?.insights ?? null,
        generatedAt: snap?.insights?.generatedAt ?? null,
      });
    } catch {
      return NextResponse.json({ insights: null, reason: "load_failed" }, { status: 200 });
    }
  });
}
