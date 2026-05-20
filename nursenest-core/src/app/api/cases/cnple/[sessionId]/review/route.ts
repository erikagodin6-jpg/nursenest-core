/**
 * GET /api/cases/cnple/[sessionId]/review
 * Retrieve a completed session's full review payload (all steps with rationale).
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { findCnpleLoftCase } from "@/content/cases/cnple-case-catalog";
import {
  parseDecisionsJson,
  classifyReadiness,
  buildDomainRemediationLinks,
} from "@/lib/cases/longitudinal-case-engine";
import type { CaseSessionScore } from "@/lib/cases/longitudinal-case-types";

type RouteParams = { params: Promise<{ sessionId: string }> };

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  const userId = (session.user as { id?: string }).id;
  if (!userId) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

  const { sessionId } = await params;

  const caseSession = await prisma.longitudinalCaseSession.findUnique({
    where: { id: sessionId },
  });
  if (!caseSession) return NextResponse.json({ error: "Session not found" }, { status: 404 });
  if (caseSession.userId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const patientCase = findCnpleLoftCase(caseSession.scenarioId);
  if (!patientCase) return NextResponse.json({ error: "Case not found" }, { status: 404 });

  const decisions = parseDecisionsJson(caseSession.decisionsJson);
  const score = caseSession.scoreJson as CaseSessionScore | null;
  const readiness = score ? classifyReadiness(score.score0to100) : "not_ready";

  const stepReviews = patientCase.steps.map((step, i) => {
    const decision = decisions.find((d) => d.stepIndex === i);
    return {
      stepIndex: i,
      heading: step.heading,
      questionStem: step.question.stem,
      options: step.question.options,
      correctOptionId: step.question.correctOptionId,
      chosenOptionId: decision?.chosenOptionId ?? null,
      isCorrect: decision?.isCorrect ?? false,
      trajectory: decision?.trajectory ?? null,
      rationale: step.question.rationale,
      whyWrong: decision && !decision.isCorrect
        ? (step.question.whyWrongByOptionId?.[decision.chosenOptionId] ?? null)
        : null,
      consequence: decision
        ? (step.question.consequencesByOptionId?.[decision.chosenOptionId]?.outcome ?? null)
        : null,
      clinicalJudgmentFocus: step.question.clinicalJudgmentFocus ?? null,
      cnpleDomain: step.cnpleDomain,
    };
  });

  const remediationLinks = (score?.weakDomains ?? []).map(buildDomainRemediationLinks);

  return NextResponse.json({
    sessionId,
    scenarioId: caseSession.scenarioId,
    caseTitle: patientCase.title,
    mode: caseSession.mode,
    status: caseSession.status,
    completedAt: caseSession.completedAt,
    score,
    readinessLevel: readiness,
    stepReviews,
    remediationLinks,
  });
}
