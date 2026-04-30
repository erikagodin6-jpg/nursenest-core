import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { analyticsDistinctId, captureServerEvent } from "@/lib/observability/posthog-server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";

const bodySchema = z.object({
  scenarioId: z.string().min(1).max(64),
  pathwayId: z.string().min(1).max(64),
  tierFocus: z.string().min(1).max(32),
  stageOrder: z.number().int().min(0).max(50),
  optionId: z.string().min(1).max(64),
  isCorrect: z.boolean(),
  incorrectSoFar: z.number().int().min(0).max(50),
  trajectoryAggregate: z.enum(["improving", "stable", "deteriorating"]),
  reachedStageOrder: z.number().int().min(0).max(50),
  premiumUnlocked: z.boolean(),
  completedScenario: z.boolean().optional(),
});

export async function POST(req: Request) {
  return runWithApiTelemetry(req, "POST /api/learner/clinical-scenario-analytics", "content", async () => {
    const session = await auth();
    const userId = (session?.user as { id?: string })?.id?.trim();
    if (!userId) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }

    let json: unknown;
    try {
      json = await req.json();
    } catch {
      return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
    }

    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "validation_failed" }, { status: 400 });
    }

    const b = parsed.data;
    await captureServerEvent(analyticsDistinctId(userId), "clinical_scenario_branch", {
      scenario_id: b.scenarioId,
      pathway_id: b.pathwayId,
      tier_focus: b.tierFocus,
      stage_order: b.stageOrder,
      option_id: b.optionId,
      is_correct: b.isCorrect,
      incorrect_so_far: b.incorrectSoFar,
      trajectory_aggregate: b.trajectoryAggregate,
      reached_stage_order: b.reachedStageOrder,
      premium_unlocked: b.premiumUnlocked,
      completed_scenario: b.completedScenario ?? false,
    });

    return NextResponse.json({ ok: true });
  });
}
