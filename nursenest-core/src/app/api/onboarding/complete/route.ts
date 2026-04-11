import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { captureServerEvent } from "@/lib/observability/posthog-server";
import { analyticsDistinctId } from "@/lib/observability/analytics-distinct-id";

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

  const learnerPathMap: Record<string, string> = {
    structured: "structured_plan",
    questions: "practice_first",
    weak_areas: "weak_area_focus",
  };

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        examFocus: examGoal,
        examDate: examDate,
        learnerPath: studyStyle ? (learnerPathMap[studyStyle] ?? studyStyle) : undefined,
        onboardingCompletedAt: new Date(),
      },
    });

    captureServerEvent(analyticsDistinctId(userId), "onboarding_completed", {
      exam_goal: examGoal ?? "none",
      has_exam_date: examDate !== null,
      study_style: studyStyle ?? "none",
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not save onboarding" }, { status: 500 });
  }
}
