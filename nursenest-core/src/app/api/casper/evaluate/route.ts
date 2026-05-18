import { NextResponse } from "next/server";

import { buildPlaceholderCasperAiEvaluation } from "@/lib/casper/casper-ai-hooks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type EvaluateCasperSessionBody = {
  sessionId?: string;
  learnerId?: string;
  responses?: Array<{
    scenarioId: string;
    response: string;
  }>;
};

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json().catch(() => ({}))) as EvaluateCasperSessionBody;

  const evaluation = await buildPlaceholderCasperAiEvaluation({
    sessionId: body.sessionId ?? `session_${Date.now()}`,
    learnerId: body.learnerId ?? "guest",
    responses: body.responses ?? [],
  });

  return NextResponse.json({ evaluation });
}
