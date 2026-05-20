import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { serverLearnerPosthogDisabledForVerifiedQaUser } from "@/lib/observability/admin-learner-qa-analytics";
import { captureServerEvent } from "@/lib/observability/posthog-server";
import { analyticsDistinctId } from "@/lib/observability/posthog-distinct-id";
import { resolveDefaultPathwayIdForOnboarding } from "@/lib/onboarding/resolve-default-pathway-for-onboarding";

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { examGoal?: string; examDate?: string | null; studyStyle?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const examGoal = typeof body.examGoal === "string" ? body.examGoal.slice(0, 32) : null;
  const studyStyle = typeof body.studyStyle === "string" ? body.studyStyle.slice(0, 32) : null;

  let examDate: Date | null = null;
  if (typeof body.examDate === "string" && body.examDate.length > 0) {
    const parsed = new Date(body.examDate);
    if (!isNaN(parsed.getTime())) {
      examDate = parsed;
    }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { country: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const pathwayId = resolveDefaultPathwayIdForOnboarding(examGoal, user.country);

    await prisma.user.update({
      where: { id: userId },
      data: {
        examFocus: examGoal,
        examDate: examDate,
        /** Registry pathway id — used by learner app scoping (see `pathwayFromLearnerPath`). */
        learnerPath: pathwayId ?? undefined,
        targetExamPathwayId: pathwayId ?? undefined,
        examGoalSetAt: new Date(),
        onboardingCompletedAt: new Date(),
      },
    });

    if (!(await serverLearnerPosthogDisabledForVerifiedQaUser(userId))) {
      captureServerEvent(analyticsDistinctId(userId), "onboarding_completed", {
        exam_goal: examGoal ?? "none",
        has_exam_date: examDate !== null,
        study_style: studyStyle ?? "none",
        pathway_id: pathwayId ?? "none",
      });
    }

    return NextResponse.json({ ok: true, pathwayId });
  } catch {
    return NextResponse.json({ error: "Could not save onboarding" }, { status: 500 });
  }
}
