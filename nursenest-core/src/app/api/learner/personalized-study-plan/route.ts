import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { buildCognitionIntegratedStudyPlan } from "@/lib/educational-cognition/study-plan-cognition";
import { warmDurableLearnerCognitionCache } from "@/lib/educational-cognition/learner-cognition-persistence";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";

export async function GET(req: Request) {
  return runWithApiTelemetry(req, "GET /api/learner/personalized-study-plan", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    setSentryServerContext({
      route: "/api/learner/personalized-study-plan",
      feature: SERVER_FEATURE.question,
      userId: gate.userId,
    });

    try {
      const user = await prisma.user.findUnique({
        where: { id: gate.userId },
        select: { learnerPath: true },
      });
      await warmDurableLearnerCognitionCache(gate.userId);
      const cognitionPlan = await buildCognitionIntegratedStudyPlan({
        userId: gate.userId,
        entitlement: gate.entitlement,
        learnerPath: user?.learnerPath ?? null,
      });
      if (!cognitionPlan) {
        return NextResponse.json({ ok: false, error: "Unable to build study plan." }, { status: 503 });
      }
      return NextResponse.json({ ok: true, plan: cognitionPlan.publicPlan });
    } catch {
      return NextResponse.json({ ok: false, error: "Unable to load personalized study plan." }, { status: 503 });
    }
  });
}
