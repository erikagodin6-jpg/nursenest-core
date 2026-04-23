import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { buildPersonalizedWeakAreaStudyPlan } from "@/lib/learner/personalized-weak-area-study-plan";
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
      const plan = await buildPersonalizedWeakAreaStudyPlan({
        userId: gate.userId,
        entitlement: gate.entitlement,
        learnerPath: user?.learnerPath ?? null,
      });
      if (!plan) {
        return NextResponse.json({ ok: false, error: "Unable to build study plan." }, { status: 503 });
      }
      return NextResponse.json({ ok: true, plan });
    } catch {
      return NextResponse.json({ ok: false, error: "Unable to load personalized study plan." }, { status: 503 });
    }
  });
}
