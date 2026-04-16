import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { userShouldSeeBaselinePrompt } from "@/lib/baseline/baseline-assessment";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return runWithApiTelemetry(req, "GET /api/learner/baseline-assessment/status", "content", async () => {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId || !isDatabaseUrlConfigured()) {
    return NextResponse.json({ showPrompt: false, completed: false, skipped: false });
  }

  const row = await prisma.user.findUnique({
    where: { id: userId },
    select: { baselineAssessmentSkippedAt: true, baselineAssessmentCompletedAt: true },
  });
  if (!row) {
    return NextResponse.json({ showPrompt: false, completed: false, skipped: false });
  }

  const showPrompt = userShouldSeeBaselinePrompt(row);
  return NextResponse.json({
    showPrompt,
    completed: row.baselineAssessmentCompletedAt != null,
    skipped: row.baselineAssessmentSkippedAt != null,
  });
  });
}
