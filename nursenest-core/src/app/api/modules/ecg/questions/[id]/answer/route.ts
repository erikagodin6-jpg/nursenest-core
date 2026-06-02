import { NextResponse } from "next/server";
import { PracticeQuestionAnswerMode } from "@prisma/client";
import { ecgApiDeniedResponse, getCurrentEcgModuleAccess } from "@/lib/ecg-module/ecg-module.server";
import { recordEcgQuestionAnswer } from "@/lib/ecg-module/ecg-question-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

function parseAttemptMode(raw: unknown): PracticeQuestionAnswerMode {
  if (
    raw === PracticeQuestionAnswerMode.practice ||
    raw === PracticeQuestionAnswerMode.quiz ||
    raw === PracticeQuestionAnswerMode.remediation
  ) {
    return raw;
  }
  return PracticeQuestionAnswerMode.quiz;
}

export async function POST(req: Request, ctx: Props) {
  const access = await getCurrentEcgModuleAccess();
  if (!access.ok) return ecgApiDeniedResponse(access.reason);

  const { id } = await ctx.params;
  const body = (await req.json().catch(() => null)) as { selectedOptionId?: unknown; attemptMode?: unknown } | null;
  const selectedOptionId =
    typeof body?.selectedOptionId === "string" && body.selectedOptionId.trim().length > 0
      ? body.selectedOptionId.trim()
      : null;
  if (!selectedOptionId) {
    return NextResponse.json({ ok: false, code: "invalid_selected_option" }, { status: 400 });
  }

  const result = await recordEcgQuestionAnswer(access, {
    questionId: id,
    selectedOptionId,
    attemptMode: parseAttemptMode(body?.attemptMode),
  });
  if (!result) {
    return NextResponse.json({ ok: false, code: "question_not_found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, result });
}
