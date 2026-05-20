import { NextResponse } from "next/server";
import { z } from "zod";
import { ecgApiDeniedResponse, getCurrentEcgModuleAccess } from "@/lib/ecg-module/ecg-module.server";
import { getPediatricCaseSimulation } from "@/lib/ecg-module/ecg-pediatric-case-simulations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

const attemptSchema = z.object({
  /** Index of the decision point (0-based). */
  decisionPointIndex: z.number().int().min(0),
  /** Index of the selected option within that decision point. */
  selectedOptionIndex: z.number().int().min(0),
}).strict();

/**
 * POST /api/modules/ecg-pediatric/cases/[id]/attempt
 *
 * Records a decision point answer and returns:
 *   - isCorrect
 *   - consequence (the educational feedback for the selected option)
 *   - teachingPoint (always revealed — post-answer learning)
 *   - allCorrectOptionIndices (so client can highlight correct answer)
 *
 * Pulsus paradoxus governance: if the case contains pulsus paradoxus as a
 * hemodynamic finding and any wrong answer involves treating it as a rhythm,
 * the consequence text reinforces the classification.
 */
export async function POST(req: Request, ctx: Props) {
  const access = await getCurrentEcgModuleAccess();
  if (!access.ok) return ecgApiDeniedResponse(access.reason);

  const { id } = await ctx.params;
  const caseData = getPediatricCaseSimulation(id);
  if (!caseData) {
    return NextResponse.json({ ok: false, code: "case_not_found" }, { status: 404 });
  }

  const body = attemptSchema.safeParse(await req.json().catch(() => null));
  if (!body.success) {
    return NextResponse.json({ ok: false, code: "invalid_attempt" }, { status: 400 });
  }

  const { decisionPointIndex, selectedOptionIndex } = body.data;
  const dp = caseData.decisionPoints[decisionPointIndex];
  if (!dp) {
    return NextResponse.json(
      { ok: false, code: "decision_point_not_found", decisionPointIndex },
      { status: 404 },
    );
  }

  const option = dp.options[selectedOptionIndex];
  if (!option) {
    return NextResponse.json(
      { ok: false, code: "option_not_found", selectedOptionIndex },
      { status: 404 },
    );
  }

  const correctOptionIndex = dp.options.findIndex((o) => o.isCorrect);

  return NextResponse.json({
    ok: true,
    decisionPointIndex,
    selectedOptionIndex,
    isCorrect: option.isCorrect,
    consequence: option.consequence,
    teachingPoint: dp.teachingPoint,
    correctOptionIndex,
    correctAction: dp.options[correctOptionIndex]?.action ?? null,
  });
}
