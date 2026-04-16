import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { BaselineAssessmentAttemptStatus } from "@prisma/client";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return runWithApiTelemetry(req, "POST /api/learner/baseline-assessment/skip", "content", async () => {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId || !isDatabaseUrlConfigured()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { baselineAssessmentSkippedAt: now },
    }),
    prisma.baselineAssessmentAttempt.deleteMany({
      where: { userId, status: BaselineAssessmentAttemptStatus.OPEN },
    }),
  ]);

  return NextResponse.json({ ok: true });
  });
}
