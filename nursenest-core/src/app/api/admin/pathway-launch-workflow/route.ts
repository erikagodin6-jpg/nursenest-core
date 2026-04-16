import { PathwayLaunchWorkflowStage } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { mergeInstructionsForTarget, upsertPathwayLaunchWorkflow, listPathwayLaunchWorkflows } from "@/lib/admin/pathway-launch-workflow-service";
import { parseLaunchWorkflowTargetKey } from "@/lib/admin/pathway-launch-workflow-target";
import { runPathwayLaunchDeterministicChecks } from "@/lib/admin/run-pathway-launch-deterministic-checks";
import { auth } from "@/lib/auth";
import { getStaffSession } from "@/lib/auth/staff-session";

export const dynamic = "force-dynamic";

function isStage(v: string): v is PathwayLaunchWorkflowStage {
  return (Object.values(PathwayLaunchWorkflowStage) as string[]).includes(v);
}

export async function GET(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const url = new URL(req.url);
  const targetKey = url.searchParams.get("targetKey")?.trim() ?? "";

  const workflows = await listPathwayLaunchWorkflows();

  if (!targetKey) {
    return NextResponse.json({ workflows });
  }

  const parsed = parseLaunchWorkflowTargetKey(targetKey);
  if (!parsed) {
    return NextResponse.json({ error: "Invalid targetKey" }, { status: 400 });
  }

  const run = await runPathwayLaunchDeterministicChecks(parsed);
  const workflow = workflows.find((w) => w.targetKey === targetKey) ?? null;

  return NextResponse.json({
    workflows,
    workflow,
    checks: run.checks,
    allDeterministicPass: run.allDeterministicPass,
    summaryLine: run.summaryLine,
    mergeInstructions: mergeInstructionsForTarget(parsed),
  });
}

export async function POST(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Expected object body" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const targetKey = typeof b.targetKey === "string" ? b.targetKey.trim() : "";
  const stageRaw = typeof b.stage === "string" ? b.stage.trim() : "";
  if (!targetKey || !stageRaw || !isStage(stageRaw)) {
    return NextResponse.json({ error: "targetKey and valid stage required" }, { status: 400 });
  }

  const attestations = {
    qaReviewed: Boolean(b.qaReviewed),
    seoReviewed: Boolean(b.seoReviewed),
    codeMergeConfirmed: Boolean(b.codeMergeConfirmed),
    postPublishVerified: Boolean(b.postPublishVerified),
  };

  const notes = typeof b.notes === "string" ? b.notes : null;
  const isTeamFocus = Boolean(b.isTeamFocus);

  const session = await auth();
  const staff = await getStaffSession();
  const userId = staff?.userId ?? (session?.user as { id?: string } | undefined)?.id ?? null;

  const { workflow, validation } = await upsertPathwayLaunchWorkflow({
    targetKey,
    stage: stageRaw,
    attestations,
    notes,
    isTeamFocus,
    userId,
  });

  if (!validation.ok) {
    const workflows = await listPathwayLaunchWorkflows();
    return NextResponse.json({ error: validation.error, workflow, workflows }, { status: 422 });
  }

  const workflows = await listPathwayLaunchWorkflows();
  const parsed = parseLaunchWorkflowTargetKey(targetKey);
  const run = parsed ? await runPathwayLaunchDeterministicChecks(parsed) : null;

  return NextResponse.json({
    workflows,
    workflow,
    checks: run?.checks,
    allDeterministicPass: run?.allDeterministicPass,
    summaryLine: run?.summaryLine,
    mergeInstructions: parsed ? mergeInstructionsForTarget(parsed) : null,
  });
}
