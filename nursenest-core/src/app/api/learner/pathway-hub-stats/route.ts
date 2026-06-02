import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import {
  countProgressCompletedForSyntheticIds,
  countProgressTouchedForSyntheticIds,
  listPublishedSyntheticLessonIdsForPathway,
} from "@/lib/lessons/pathway-lesson-progress";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";

export const dynamic = "force-dynamic";

/**
 * GET /api/learner/pathway-hub-stats?pathwayId=<id>
 *
 * Returns lesson completion counts for the signed-in user scoped to one pathway.
 * Used by the marketing hub page to display a progress indicator on the Lessons card.
 * Returns { completed, total } — total is all opened lesson rows (not the pathway lesson
 * catalogue total, which is passed from the server as `pathwayLessonCount`).
 */
export async function GET(req: Request) {
  return runWithApiTelemetry(req, "GET /api/learner/pathway-hub-stats", "content", async () => {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const pathwayId = searchParams.get("pathwayId");
  if (!pathwayId || pathwayId.length < 3) {
    return NextResponse.json({ error: "Missing pathwayId" }, { status: 400 });
  }

  setSentryServerContext({
    route: "/api/learner/pathway-hub-stats",
    feature: SERVER_FEATURE.lesson,
    userId,
  });

  if (!isDatabaseUrlConfigured()) {
    return NextResponse.json({ completed: 0, total: 0 });
  }

  try {
    const inventoryIds = await listPublishedSyntheticLessonIdsForPathway(pathwayId);
    const [completed, total] = await Promise.all([
      countProgressCompletedForSyntheticIds(userId, inventoryIds),
      countProgressTouchedForSyntheticIds(userId, inventoryIds),
    ]);

    return NextResponse.json({ completed, total });
  } catch {
    return NextResponse.json({ completed: 0, total: 0 });
  }
  });
}
