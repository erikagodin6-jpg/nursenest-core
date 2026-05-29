import { type NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { loadFlaggedQuestionsForReview } from "@/lib/questions/compute-question-psychometrics";
import { loadQuestionQualityDashboard } from "@/lib/questions/load-question-quality-dashboard.server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Admin question quality review queue.
 *
 * GET  ?severity=critical|high|medium|low  — list flagged questions
 * PATCH body: { questionId, action: "re_enable" | "mark_reviewed" }
 */
export async function GET(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const severity = req.nextUrl.searchParams.get("severity") as
    | "low" | "medium" | "high" | "critical" | null;
  const limit = Math.min(200, Number(req.nextUrl.searchParams.get("limit") ?? 100));
  if (req.nextUrl.searchParams.get("view") === "dashboard") {
    const data = await loadQuestionQualityDashboard({ limit });
    return NextResponse.json({ ok: true, data });
  }

  const flagged = await loadFlaggedQuestionsForReview({ severity: severity ?? undefined, limit });
  return NextResponse.json({ ok: true, items: flagged, count: flagged.length });
}

export async function PATCH(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  let body: { questionId?: string; action?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { questionId, action } = body;
  if (!questionId || typeof questionId !== "string") {
    return NextResponse.json({ error: "questionId required" }, { status: 400 });
  }

  if (action === "re_enable") {
    await prisma.examQuestion.update({
      where: { id: questionId },
      data: { isAdaptiveEligible: true, isMockExamEligible: true },
    });
    return NextResponse.json({ ok: true, action: "re_enabled", questionId });
  }

  if (action === "mark_reviewed") {
    // Clear the quality feedback flags after admin review
    await prisma.examQuestion.update({
      where: { id: questionId },
      data: { qualityFeedback: { reviewed: true, reviewedAt: new Date().toISOString() } },
    });
    return NextResponse.json({ ok: true, action: "marked_reviewed", questionId });
  }

  return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
}
