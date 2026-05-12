/**
 * POST /api/cases/cnple/[sessionId]/advance
 * Submit a decision for the current step and receive the next step (or completion).
 *
 * Body: { chosenOptionId: string; dwellMs?: number }
 * Returns: CaseStepAdvanceResult
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import { CNPLE_SAMPLE_CASES } from "@/content/cases/cnple-sample-cases";
import {
  parseDecisionsJson,
  processStepAdvance,
  isValidOptionId,
} from "@/lib/cases/longitudinal-case-engine";

type RouteParams = { params: Promise<{ sessionId: string }> };

export async function POST(req: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
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
  if (caseSession.status !== "IN_PROGRESS") {
    return NextResponse.json({ error: "Session is already completed or abandoned" }, { status: 409 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Missing body" }, { status: 400 });
  }
  const { chosenOptionId, dwellMs } = body as Record<string, unknown>;
  if (typeof chosenOptionId !== "string" || !chosenOptionId.trim()) {
    return NextResponse.json({ error: "chosenOptionId is required" }, { status: 400 });
  }

  const patientCase = CNPLE_SAMPLE_CASES.find((c) => c.id === caseSession.scenarioId);
  if (!patientCase) return NextResponse.json({ error: "Case not found" }, { status: 404 });

  const stepIndex = caseSession.currentStageIndex;
  const step = patientCase.steps[stepIndex];
  if (!step) return NextResponse.json({ error: "Step out of bounds" }, { status: 422 });

  if (!isValidOptionId(step, chosenOptionId)) {
    return NextResponse.json({ error: "Invalid option ID" }, { status: 400 });
  }

  const existingDecisions = parseDecisionsJson(caseSession.decisionsJson);
  const mode = (caseSession.mode ?? "PRACTICE") as "PRACTICE" | "SIMULATION";

  const result = processStepAdvance(
    sessionId,
    patientCase,
    stepIndex,
    chosenOptionId,
    mode,
    existingDecisions,
    typeof dwellMs === "number" ? dwellMs : undefined,
  );

  // Persist updated session
  const nextStageIndex = result.completed ? stepIndex : stepIndex + 1;
  await prisma.longitudinalCaseSession.update({
    where: { id: sessionId },
    data: {
      currentStageIndex: nextStageIndex,
      decisionsJson: [
        ...existingDecisions,
        {
          stepIndex,
          chosenOptionId,
          isCorrect: result.isCorrect,
          cnpleDomainSlug: step.cnpleDomain,
          trajectory: result.trajectory,
          dwellMs: typeof dwellMs === "number" ? dwellMs : undefined,
        },
      ],
      status: result.completed ? "COMPLETED" : "IN_PROGRESS",
      scoreJson: result.score ?? undefined,
      completedAt: result.completed ? new Date() : undefined,
    },
  });

  return NextResponse.json(result);
}
