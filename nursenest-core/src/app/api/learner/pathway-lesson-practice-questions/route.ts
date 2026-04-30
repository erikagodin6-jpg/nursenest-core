import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { resolveEntitlement } from "@/lib/entitlements/resolve-entitlement";
import { listPathwaysCompatibleWithSubscription } from "@/lib/exam-pathways/pathway-entitlements";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { getPracticeQuestionsForPathway, getStudySystemsForPathway } from "@/lib/learner-study-hub/pathway-lesson-study-materials";

export const dynamic = "force-dynamic";

const MAX_RETURN = 80;

export async function GET(req: NextRequest) {
  return runWithApiTelemetry(req, "GET /api/learner/pathway-lesson-practice-questions", "content", async () => {
    const session = await auth();
    const userId = (session?.user as { id?: string } | undefined)?.id;
    if (!userId) {
      return NextResponse.json({ error: "Sign in required", code: "auth_required" }, { status: 401 });
    }

    const entitlement = await resolveEntitlement(userId);
    if (!entitlement.hasAccess) {
      return NextResponse.json({ error: "Subscription required", code: "subscription_required" }, { status: 403 });
    }

    const pathwayId = req.nextUrl.searchParams.get("pathwayId")?.trim() ?? "";
    if (!pathwayId) {
      return NextResponse.json({ error: "pathwayId required", code: "bad_request" }, { status: 400 });
    }

    const compatible = await listPathwaysCompatibleWithSubscription(entitlement);
    const allowed = new Set(compatible.map((p) => p.id));
    if (!allowed.has(pathwayId)) {
      return NextResponse.json({ error: "Pathway not available for this account", code: "forbidden_pathway" }, { status: 403 });
    }

    const bodySystemsRaw = req.nextUrl.searchParams.get("bodySystems")?.trim();
    const bodySystems = bodySystemsRaw
      ? bodySystemsRaw
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean)
      : undefined;
    const topicSlug = req.nextUrl.searchParams.get("topicSlug")?.trim() || null;

    const { questions, truncated } = await getPracticeQuestionsForPathway(pathwayId, {
      maxQuestions: 600,
      maxLessons: 400,
      bodySystems,
      topicSlug,
    });
    const systems = await getStudySystemsForPathway(pathwayId);

    return NextResponse.json({
      pathwayId,
      total: questions.length,
      truncated,
      publishedLessonCount: systems.publishedLessonCount,
      systems: systems.systems.slice(0, 24),
      questions: questions.slice(0, MAX_RETURN),
    });
  });
}
