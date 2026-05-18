import { NextResponse } from "next/server";

import { CASPER_FREE_MINI_TEST } from "@/lib/casper/casper-scenarios";
import { saveCasperSession, listCasperSessionsForLearner } from "@/lib/casper/casper-storage";
import type { CasperSessionMode, CasperSessionRecord } from "@/lib/casper/casper-session-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CreateCasperSessionBody = {
  learnerId?: string;
  mode?: CasperSessionMode;
};

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const learnerId = searchParams.get("learnerId") ?? "guest";
  const sessions = await listCasperSessionsForLearner(learnerId);

  return NextResponse.json({ sessions });
}

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json().catch(() => ({}))) as CreateCasperSessionBody;
  const learnerId = body.learnerId ?? "guest";
  const mode = body.mode ?? "mini";
  const now = new Date().toISOString();

  const session: CasperSessionRecord = {
    id: `casper_${Date.now()}`,
    learnerId,
    mode,
    status: "in-progress",
    startedAtIso: now,
    responses: CASPER_FREE_MINI_TEST.map((scenario) => ({
      scenarioId: scenario.id,
      responseText: "",
      createdAtIso: now,
      updatedAtIso: now,
    })),
  };

  await saveCasperSession(session);

  return NextResponse.json({ session }, { status: 201 });
}
