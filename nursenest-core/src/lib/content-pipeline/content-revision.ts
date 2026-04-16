import "server-only";

import { randomUUID } from "node:crypto";

import type { ContentEntityKind, ExamQuestion, Prisma, PrismaClient } from "@prisma/client";

import { contentIntegritySha256 } from "@/lib/content-pipeline/content-integrity";

function examQuestionToSnapshot(row: ExamQuestion): Record<string, unknown> {
  return JSON.parse(JSON.stringify(row)) as Record<string, unknown>;
}

/**
 * Archives the **current** live row before a mutation so `version` matches the row’s `sourceVersion` at rest.
 * Call inside the same transaction as your update, **before** writing new bytes.
 */
export async function archiveExamQuestionRevision(
  prisma: PrismaClient | Prisma.TransactionClient,
  params: {
    questionId: string;
    reason: string;
    importRunId?: string | null;
    createdByUserId?: string | null;
  },
): Promise<{ archivedVersion: number; revisionId: string } | null> {
  const row = await prisma.examQuestion.findUnique({ where: { id: params.questionId } });
  if (!row) return null;

  const snapshot = examQuestionToSnapshot(row);
  const snapshotSha256 = contentIntegritySha256(snapshot);

  const rev = await prisma.content_entity_revisions.create({
    data: {
      id: randomUUID(),
      entity_kind: "EXAM_QUESTION",
      entity_id: row.id,
      version: row.sourceVersion,
      snapshot: snapshot as Prisma.InputJsonValue,
      snapshot_sha256: snapshotSha256,
      reason: params.reason,
      previous_version: row.sourceVersion > 1 ? row.sourceVersion - 1 : null,
      import_run_id: params.importRunId ?? null,
      created_by_user_id: params.createdByUserId ?? null,
    },
  });

  return { archivedVersion: row.sourceVersion, revisionId: rev.id };
}

/**
 * Restores an archived snapshot onto the live row and bumps `sourceVersion` (monotonic).
 * Archives the current live row first (rollback-of-rollback stays traceable).
 */
export async function rollbackExamQuestionToArchivedVersion(
  prisma: PrismaClient,
  params: {
    questionId: string;
    /** `version` column on `content_entity_revisions` (matches `sourceVersion` when archived). */
    targetArchivedVersion: number;
    actorUserId?: string | null;
    reason?: string;
  },
): Promise<{ newSourceVersion: number }> {
  const target = await prisma.content_entity_revisions.findFirst({
    where: {
      entity_kind: "EXAM_QUESTION",
      entity_id: params.questionId,
      version: params.targetArchivedVersion,
    },
  });
  if (!target) {
    throw new Error(`No archived revision for question ${params.questionId} at version ${params.targetArchivedVersion}`);
  }

  return prisma.$transaction(async (tx) => {
    await archiveExamQuestionRevision(tx, {
      questionId: params.questionId,
      reason: params.reason ?? "pre_rollback_snapshot",
      createdByUserId: params.actorUserId ?? undefined,
    });

    const snap = target.snapshot as Record<string, unknown>;
    const nextVersion =
      (await tx.examQuestion.findUnique({ where: { id: params.questionId }, select: { sourceVersion: true } }))!
        .sourceVersion + 1;

    const { id: _id, createdAt: _c, updatedAt: _u, ...payload } = snap;

    // Admin rollback: snapshot is JSON from DB; Prisma coerces ISO date strings for DateTime fields.
    await tx.examQuestion.update({
      where: { id: params.questionId },
      data: {
        ...(payload as Record<string, unknown>),
        sourceVersion: nextVersion,
        updatedAt: new Date(),
        publishedByUserId: params.actorUserId ?? undefined,
      } as Prisma.ExamQuestionUpdateInput,
    });

    return { newSourceVersion: nextVersion };
  });
}

export type PathwayLessonSnapshot = Record<string, unknown>;

export async function archivePathwayLessonRevision(
  prisma: PrismaClient | Prisma.TransactionClient,
  params: {
    lessonRowId: string;
    reason: string;
    importRunId?: string | null;
    createdByUserId?: string | null;
  },
): Promise<{ archivedVersion: number; revisionId: string } | null> {
  const row = await prisma.pathwayLesson.findUnique({ where: { id: params.lessonRowId } });
  if (!row) return null;

  const snapshot = JSON.parse(JSON.stringify(row)) as PathwayLessonSnapshot;
  const snapshotSha256 = contentIntegritySha256(snapshot);

  const rev = await prisma.content_entity_revisions.create({
    data: {
      id: randomUUID(),
      entity_kind: "PATHWAY_LESSON" satisfies ContentEntityKind,
      entity_id: row.id,
      version: row.content_version,
      snapshot: snapshot as Prisma.InputJsonValue,
      snapshot_sha256: snapshotSha256,
      reason: params.reason,
      previous_version: row.content_version > 1 ? row.content_version - 1 : null,
      import_run_id: params.importRunId ?? null,
      created_by_user_id: params.createdByUserId ?? null,
    },
  });

  return { archivedVersion: row.content_version, revisionId: rev.id };
}

export async function archiveContentItemRevision(
  prisma: PrismaClient | Prisma.TransactionClient,
  params: {
    contentItemId: string;
    reason: string;
    importRunId?: string | null;
    createdByUserId?: string | null;
  },
): Promise<{ archivedVersion: number; revisionId: string } | null> {
  const row = await prisma.contentItem.findUnique({ where: { id: params.contentItemId } });
  if (!row) return null;

  const snapshot = JSON.parse(JSON.stringify(row)) as Record<string, unknown>;
  const snapshotSha256 = contentIntegritySha256(snapshot);

  const rev = await prisma.content_entity_revisions.create({
    data: {
      id: randomUUID(),
      entity_kind: "CONTENT_ITEM" satisfies ContentEntityKind,
      entity_id: row.id,
      version: row.sourceVersion,
      snapshot: snapshot as Prisma.InputJsonValue,
      snapshot_sha256: snapshotSha256,
      reason: params.reason,
      previous_version: row.sourceVersion > 1 ? row.sourceVersion - 1 : null,
      import_run_id: params.importRunId ?? null,
      created_by_user_id: params.createdByUserId ?? null,
    },
  });

  return { archivedVersion: row.sourceVersion, revisionId: rev.id };
}
