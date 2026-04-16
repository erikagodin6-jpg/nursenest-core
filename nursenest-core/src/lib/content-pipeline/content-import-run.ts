import "server-only";

import { randomUUID } from "node:crypto";

import type { ContentImportRunStatus, Prisma, PrismaClient } from "@prisma/client";

export type StartContentImportRunInput = {
  sourceKind: string;
  label?: string;
  manifest?: Prisma.InputJsonValue;
  triggeredByUserId?: string | null;
  gitCommitSha?: string | null;
  environment?: string | null;
  inputSha256?: string | null;
};

/**
 * Begin an ingestion run — call {@link finishContentImportRun} when the job completes.
 */
export async function startContentImportRun(
  prisma: PrismaClient,
  input: StartContentImportRunInput,
): Promise<{ id: string }> {
  const row = await prisma.content_import_runs.create({
    data: {
      id: randomUUID(),
      source_kind: input.sourceKind,
      label: input.label ?? undefined,
      manifest: (input.manifest ?? {}) as Prisma.InputJsonValue,
      triggered_by_user_id: input.triggeredByUserId ?? undefined,
      git_commit_sha: input.gitCommitSha ?? undefined,
      environment: input.environment ?? undefined,
      input_sha256: input.inputSha256 ?? undefined,
      status: "STARTED",
    },
  });
  return { id: row.id };
}

export type FinishContentImportRunInput = {
  status: ContentImportRunStatus;
  report?: Prisma.InputJsonValue;
  stats?: Prisma.InputJsonValue;
  errorMessage?: string | null;
};

export async function finishContentImportRun(
  prisma: PrismaClient,
  id: string,
  input: FinishContentImportRunInput,
): Promise<void> {
  await prisma.content_import_runs.update({
    where: { id },
    data: {
      status: input.status,
      finished_at: new Date(),
      report: (input.report ?? {}) as Prisma.InputJsonValue,
      stats: (input.stats ?? {}) as Prisma.InputJsonValue,
      error_message: input.errorMessage ?? undefined,
    },
  });
}
