import "server-only";

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
  const row = await prisma.contentImportRun.create({
    data: {
      sourceKind: input.sourceKind,
      label: input.label,
      manifest: (input.manifest ?? {}) as Prisma.InputJsonValue,
      triggeredByUserId: input.triggeredByUserId ?? undefined,
      gitCommitSha: input.gitCommitSha ?? undefined,
      environment: input.environment ?? undefined,
      inputSha256: input.inputSha256 ?? undefined,
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
  await prisma.contentImportRun.update({
    where: { id },
    data: {
      status: input.status,
      finishedAt: new Date(),
      report: (input.report ?? {}) as Prisma.InputJsonValue,
      stats: (input.stats ?? {}) as Prisma.InputJsonValue,
      errorMessage: input.errorMessage ?? undefined,
    },
  });
}
