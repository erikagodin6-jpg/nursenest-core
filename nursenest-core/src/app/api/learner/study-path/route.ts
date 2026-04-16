import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { loadStructuredStudyPathForSubscriber, STUDY_PATH_KINDS } from "@/lib/learner/structured-study-path";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";

const kindSchema = z.enum(STUDY_PATH_KINDS);

/**
 * Structured study path: lessons → questions → weak-area CAT blocks → advanced → capstone CAT.
 * Query: `kind` (pn | rn | np | allied | new_grad), optional `pathwayId`.
 */
export async function GET(req: NextRequest) {
  return runWithApiTelemetry(req, "GET /api/learner/study-path", "content", async () => {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  setSentryServerContext({ route: "/api/learner/study-path", feature: SERVER_FEATURE.question, userId: gate.userId });

  const kindRaw = req.nextUrl.searchParams.get("kind") ?? "rn";
  const kindParsed = kindSchema.safeParse(kindRaw);
  if (!kindParsed.success) {
    return NextResponse.json(
      { error: "Invalid kind", allowed: [...STUDY_PATH_KINDS] },
      { status: 400 },
    );
  }

  const pathwayId = req.nextUrl.searchParams.get("pathwayId")?.trim() || null;

  try {
    const path = await loadStructuredStudyPathForSubscriber({
      kind: kindParsed.data,
      pathwayId,
      userId: gate.userId,
      entitlement: gate.entitlement,
    });
    return NextResponse.json(path);
  } catch {
    return NextResponse.json({ error: "Unable to build study path." }, { status: 503 });
  }
  });
}
