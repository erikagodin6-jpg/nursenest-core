import { PathwayLaunchWorkflowStage, type PathwayLaunchWorkflow } from "@prisma/client";
import { prisma } from "@/lib/db";
import { runPathwayLaunchDeterministicChecks } from "@/lib/admin/run-pathway-launch-deterministic-checks";
import {
  formatLaunchWorkflowTargetKey,
  parseLaunchWorkflowTargetKey,
  pathwayExistsInRegistry,
} from "@/lib/admin/pathway-launch-workflow-target";
import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";

export type LaunchWorkflowAttestations = {
  qaReviewed?: boolean;
  seoReviewed?: boolean;
  /** After merging `GLOBAL_REGION_EXPANSION_PUBLISHED` / `PATHWAY_LAUNCH_APPROVED` in git. */
  codeMergeConfirmed?: boolean;
  postPublishVerified?: boolean;
};

const STAGE_ORDER: PathwayLaunchWorkflowStage[] = [
  PathwayLaunchWorkflowStage.DRAFT,
  PathwayLaunchWorkflowStage.CONTENT_BUILD,
  PathwayLaunchWorkflowStage.QA_REVIEW,
  PathwayLaunchWorkflowStage.SEO_REVIEW,
  PathwayLaunchWorkflowStage.READY_TO_PUBLISH,
  PathwayLaunchWorkflowStage.PUBLISHED_LIVE,
  PathwayLaunchWorkflowStage.POST_PUBLISH_VERIFY,
];

function stageIndex(s: PathwayLaunchWorkflowStage): number {
  return STAGE_ORDER.indexOf(s);
}

function parseAttestations(raw: unknown): LaunchWorkflowAttestations {
  if (!raw || typeof raw !== "object") return {};
  const o = raw as Record<string, unknown>;
  return {
    qaReviewed: Boolean(o.qaReviewed),
    seoReviewed: Boolean(o.seoReviewed),
    codeMergeConfirmed: Boolean(o.codeMergeConfirmed),
    postPublishVerified: Boolean(o.postPublishVerified),
  };
}

export async function listPathwayLaunchWorkflows(): Promise<PathwayLaunchWorkflow[]> {
  return prisma.pathwayLaunchWorkflow.findMany({ orderBy: [{ isTeamFocus: "desc" }, { updatedAt: "desc" }] });
}

export async function getPathwayLaunchWorkflow(targetKey: string): Promise<PathwayLaunchWorkflow | null> {
  return prisma.pathwayLaunchWorkflow.findUnique({ where: { targetKey } });
}

export type TransitionValidation = { ok: true } | { ok: false; error: string };

export async function validateStageTransition(
  targetKey: string,
  nextStage: PathwayLaunchWorkflowStage,
  attestations: LaunchWorkflowAttestations,
): Promise<TransitionValidation> {
  const parsed = parseLaunchWorkflowTargetKey(targetKey);
  if (!parsed) return { ok: false, error: "Invalid targetKey (use pathway:id or region:slug)." };
  if (parsed.kind === "pathway" && !pathwayExistsInRegistry(parsed.pathwayId)) {
    return { ok: false, error: "Pathway id not in registry." };
  }

  const run = await runPathwayLaunchDeterministicChecks(parsed);

  if (nextStage === PathwayLaunchWorkflowStage.READY_TO_PUBLISH) {
    if (!run.allDeterministicPass) {
      return { ok: false, error: "Automated launch checks must pass before READY TO PUBLISH." };
    }
    if (!attestations.qaReviewed || !attestations.seoReviewed) {
      return { ok: false, error: "QA + SEO attestations required (checklist in UI)." };
    }
  }

  if (nextStage === PathwayLaunchWorkflowStage.PUBLISHED_LIVE) {
    if (!run.allDeterministicPass) {
      return { ok: false, error: "Automated checks must still pass for PUBLISHED LIVE." };
    }
    if (!attestations.codeMergeConfirmed) {
      return {
        ok: false,
        error: "Confirm code merge (PATHWAY_LAUNCH_APPROVED / GLOBAL_REGION_EXPANSION_PUBLISHED) before PUBLISHED LIVE.",
      };
    }
  }

  if (nextStage === PathwayLaunchWorkflowStage.POST_PUBLISH_VERIFY) {
    if (!attestations.postPublishVerified) {
      return {
        ok: false,
        error: "Confirm post-publish smoke checks and monitoring before advancing to post-publish verification.",
      };
    }
  }

  return { ok: true };
}

export async function upsertPathwayLaunchWorkflow(input: {
  targetKey: string;
  stage: PathwayLaunchWorkflowStage;
  attestations: LaunchWorkflowAttestations;
  notes?: string | null;
  isTeamFocus?: boolean;
  userId: string | null;
}): Promise<{ workflow: PathwayLaunchWorkflow | null; validation: TransitionValidation }> {
  const parsed = parseLaunchWorkflowTargetKey(input.targetKey);
  if (!parsed) {
    return { validation: { ok: false, error: "Invalid targetKey." }, workflow: null };
  }

  const existing = await prisma.pathwayLaunchWorkflow.findUnique({ where: { targetKey: input.targetKey } });
  const fromStage = existing?.stage ?? PathwayLaunchWorkflowStage.DRAFT;

  if (stageIndex(input.stage) < stageIndex(fromStage)) {
    /* Allow rollback without extra attestation gates */
  } else if (input.stage !== fromStage) {
    const v = await validateStageTransition(input.targetKey, input.stage, input.attestations);
    if (!v.ok) {
      return { validation: v, workflow: existing };
    }
  }

  if (input.isTeamFocus) {
    await prisma.pathwayLaunchWorkflow.updateMany({ data: { isTeamFocus: false }, where: { isTeamFocus: true } });
  }

  const attestJson = input.attestations as object;

  const workflow = await prisma.pathwayLaunchWorkflow.upsert({
    where: { targetKey: input.targetKey },
    create: {
      targetKey: input.targetKey,
      stage: input.stage,
      attestations: attestJson,
      notes: input.notes ?? null,
      isTeamFocus: input.isTeamFocus ?? false,
      updatedById: input.userId,
    },
    update: {
      stage: input.stage,
      attestations: attestJson,
      notes: input.notes ?? undefined,
      isTeamFocus: input.isTeamFocus ?? undefined,
      updatedById: input.userId,
    },
  });

  return { workflow, validation: { ok: true } };
}

export function attestationsFromRow(row: PathwayLaunchWorkflow): LaunchWorkflowAttestations {
  return parseAttestations(row.attestations);
}

/** Human-readable ops note for merging code (single focus region/pathway). */
export function mergeInstructionsForTarget(target: { kind: "pathway"; pathwayId: string } | { kind: "region"; region: GlobalRegionSlug }): string {
  if (target.kind === "pathway") {
    return `Add "${target.pathwayId}" to PATHWAY_LAUNCH_APPROVED in src/lib/navigation/country-exam-launch-readiness.ts (and keep snapshot current).`;
  }
  return `Add "${target.region}" to GLOBAL_REGION_EXPANSION_PUBLISHED in src/lib/navigation/country-exam-launch-readiness.ts after QA/SEO sign-off.`;
}

export { formatLaunchWorkflowTargetKey, parseLaunchWorkflowTargetKey };
