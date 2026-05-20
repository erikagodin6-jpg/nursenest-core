/**
 * POST /api/cases/cnple/session
 * Start a new longitudinal case session.
 *
 * Body: { scenarioId: string; mode?: "PRACTICE" | "SIMULATION" }
 * Returns: CaseStepPayload for the first step.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { findCnpleLoftCase } from "@/content/cases/cnple-case-catalog";
import { buildStepPayload } from "@/lib/cases/longitudinal-case-engine";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }
  const userId = (session.user as { id?: string }).id;
  if (!userId) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Missing body" }, { status: 400 });
  }
  const { scenarioId, mode = "PRACTICE" } = body as Record<string, unknown>;

  if (typeof scenarioId !== "string" || !scenarioId.trim()) {
    return NextResponse.json({ error: "scenarioId is required" }, { status: 400 });
  }
  if (mode !== "PRACTICE" && mode !== "SIMULATION") {
    return NextResponse.json({ error: "mode must be PRACTICE or SIMULATION" }, { status: 400 });
  }

  const patientCase = findCnpleLoftCase(scenarioId);
  if (!patientCase) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }
  if (patientCase.steps.length === 0) {
    return NextResponse.json({ error: "Case has no steps" }, { status: 422 });
  }

  // Create session record
  const caseSession = await prisma.longitudinalCaseSession.create({
    data: {
      userId,
      scenarioId,
      pathwayId: "ca-np-cnple",
      cnpleDomains: [
        patientCase.primaryDomain,
        ...patientCase.secondaryDomains,
      ],
      status: "IN_PROGRESS",
      currentStageIndex: 0,
      decisionsJson: [],
      mode: mode as "PRACTICE" | "SIMULATION",
    },
  });

  const payload = buildStepPayload(caseSession.id, patientCase, 0, mode as "PRACTICE" | "SIMULATION");
  return NextResponse.json(payload, { status: 201 });
}
