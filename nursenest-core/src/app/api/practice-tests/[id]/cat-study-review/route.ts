import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { PracticeTestStatus } from "@prisma/client";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { prisma } from "@/lib/db";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { parseAdaptiveState } from "@/lib/exams/cat-engine";
import { buildCatStudyFeedback } from "@/lib/practice-tests/build-cat-study-feedback";
import { buildMinimalCatStudyFeedbackPayload } from "@/lib/practice-tests/cat-practice-fallbacks";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { enforcePracticeTestDetailProtection } from "@/lib/http/api-protection";
import { parsePracticeTestConfigAtBoundary } from "@/lib/practice-tests/practice-test-config-boundary";
function asIdList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((x): x is string => typeof x === "string" && x.length > 4);
}

/**
 * Resume-safe: rebuild CAT Study Mode teaching payload for the current item after refresh
 * when `adaptiveState.catStudyAwaitingContinue` is true.
 */
export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  const limited = enforcePracticeTestDetailProtection(req, gate.userId);
  if (limited) return limited;

  const { id } = await ctx.params;
  if (!id || id.length < 8) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  setSentryServerContext({
    route: "/api/practice-tests/[id]/cat-study-review",
    feature: SERVER_FEATURE.practiceTest,
    userId: gate.userId,
  });

  const row = await prisma.practiceTest.findFirst({
    where: { id, userId: gate.userId },
  });
  if (!row || row.status !== PracticeTestStatus.IN_PROGRESS) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const cfg = parsePracticeTestConfigAtBoundary(row.config, { practiceTestId: id, surface: "cat_study_review_get" });
  if (cfg.selectionMode !== "cat" || (cfg.catExamFeedbackMode ?? "test") !== "study") {
    return NextResponse.json({ error: "Not a CAT Study Mode session" }, { status: 400 });
  }

  const state = parseAdaptiveState(row.adaptiveState);
  if (!state?.catStudyAwaitingContinue) {
    return NextResponse.json({ error: "No study review pending for this item" }, { status: 409 });
  }

  const ids = asIdList(row.questionIds);
  const cursor = row.cursorIndex;
  if (cursor < 0 || cursor >= ids.length) {
    return NextResponse.json({ error: "Invalid session cursor" }, { status: 400 });
  }
  const qid = ids[cursor]!;
  const answers =
    typeof row.answers === "object" && row.answers !== null && !Array.isArray(row.answers)
      ? (row.answers as Record<string, unknown>)
      : {};
  const userAns = answers[qid];
  if (userAns === undefined) {
    return NextResponse.json({ error: "No answer recorded for current item" }, { status: 400 });
  }

  const last = state.results[state.results.length - 1];
  if (!last || last.questionId !== qid) {
    safeServerLog("cat_runner", "cat_resume_state_invalid", {
      event: "cat_resume_state_invalid",
      route: "cat_study_review",
    });
    const fallback = buildMinimalCatStudyFeedbackPayload({
      questionId: qid,
      isCorrect: Boolean(last?.correct),
      correctKeys: [],
    });
    return NextResponse.json({ studyFeedback: fallback, degraded: true });
  }

  let feedback = await buildCatStudyFeedback(qid, userAns, gate.entitlement, cfg.pathwayId ?? null);
  if (!feedback) {
    safeServerLog("cat_runner", "cat_study_feedback_build_failed", {
      event: "cat_study_feedback_build_failed",
      route: "cat_study_review",
    });
    feedback = buildMinimalCatStudyFeedbackPayload({
      questionId: qid,
      isCorrect: last.correct,
      correctKeys: [],
    });
    return NextResponse.json({ studyFeedback: feedback, degraded: true });
  }

  return NextResponse.json({ studyFeedback: feedback });
}
