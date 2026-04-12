/**
 * Single claimed lesson batch queue item — generation, duplicate skip, failure handling.
 * Used by POST /api/admin/lessons/ai-generate-batch/[jobId]/step (possibly multiple times per request).
 */
import { DraftReviewStatus, type LessonBatchQueueItem, type PrismaClient } from "@prisma/client";
import type { AdminSession } from "@/lib/admin/ensure-admin";
import {
  findLessonDraftDuplicate,
  lessonBatchTopicKey,
  loadLessonBatchSummaryWithHydration,
  resolveLessonBatchDerived,
  sanitizeLessonBatchError,
  syncJobResultSummaryJson,
  type LessonBatchResultSummaryV1,
} from "@/lib/lessons/admin-ai-lesson-batch";
import type { AdminAiLessonGenerateInput } from "@/lib/lessons/admin-ai-lesson-pipeline";
import {
  ADMIN_AI_LESSON_GENERATOR_TOOL,
  buildDraftNormalized,
  generateAdminAiLesson,
} from "@/lib/lessons/admin-ai-lesson-pipeline";
import { getOpenAiChatModel } from "@/lib/ai/openai-env";

export type LessonBatchStepResult = Record<string, unknown>;

export async function executeLessonBatchItemForClaimedRow(params: {
  db: PrismaClient;
  jobId: string;
  row: LessonBatchQueueItem;
  jobInputPayload: Record<string, unknown>;
  gate: AdminSession;
}): Promise<LessonBatchStepResult> {
  const { db, jobId, row, jobInputPayload, gate } = params;

  const settings = {
    pathway: jobInputPayload.pathway as LessonBatchResultSummaryV1["settings"]["pathway"],
    country: jobInputPayload.country as "CA" | "US",
    topicDomain: String(jobInputPayload.topicDomain ?? ""),
    lessonType: jobInputPayload.lessonType as LessonBatchResultSummaryV1["settings"]["lessonType"],
    difficulty: jobInputPayload.difficulty as LessonBatchResultSummaryV1["settings"]["difficulty"] | undefined,
    relatedCategoryIds: Array.isArray(jobInputPayload.relatedCategoryIds)
      ? (jobInputPayload.relatedCategoryIds as string[])
      : [],
  };
  const allowDuplicates = Boolean(jobInputPayload.allowDuplicates);

  let relatedCategoryLabels: string[] = [];
  if (settings.relatedCategoryIds.length > 0) {
    const cats = await db.category.findMany({
      where: { id: { in: settings.relatedCategoryIds } },
      select: { name: true, slug: true },
    });
    relatedCategoryLabels = cats.map((c) => c.name || c.slug);
  }

  const genInput: AdminAiLessonGenerateInput = {
    topic: row.topic,
    pathway: settings.pathway,
    country: settings.country,
    topicDomain: settings.topicDomain,
    lessonType: settings.lessonType,
    difficulty: settings.difficulty,
    relatedCategoryLabels,
  };

  const key = lessonBatchTopicKey(row.topic, settings.pathway, settings.country, settings.lessonType);

  try {
    if (!allowDuplicates) {
      const dup = await findLessonDraftDuplicate(db, key, {
        topic: row.topic,
        pathway: settings.pathway,
        country: settings.country,
        lessonType: settings.lessonType,
      });
      if (dup) {
        const now = new Date();
        await db.lessonBatchQueueItem.update({
          where: { id: row.id },
          data: {
            status: "SKIPPED_DUPLICATE",
            existingDraftId: dup.id,
            skippedAt: now,
            startedAt: null,
            claimedByRequestId: null,
            generatedDraftTitle: dup.titlePreview,
          },
        });
        await syncJobResultSummaryJson(db, jobId);
        await db.aiGenerationLog.create({
          data: {
            jobId,
            step: "batch_item_skipped_duplicate",
            detail: { itemId: row.publicItemId, existingDraftId: dup.id },
          },
        });
        const summary = await loadLessonBatchSummaryWithHydration(db, jobId);
        const derived = summary ? resolveLessonBatchDerived(summary) : null;
        const item = summary?.items.find((i) => i.itemId === row.publicItemId);
        return {
          done: derived?.allTerminal ?? false,
          item,
          summary,
          derived,
        };
      }
    }

    const { lesson, rawTokens } = await generateAdminAiLesson(genInput);
    const normalized = buildDraftNormalized(genInput, lesson);
    const model = getOpenAiChatModel();

    const createdDraftId = await db.$transaction(async (tx) => {
      const draft = await tx.generatedLessonDraft.create({
        data: {
          jobId,
          tool: ADMIN_AI_LESSON_GENERATOR_TOOL,
          lessonBatchTopicKey: key,
          payloadJson: {
            topic: row.topic,
            pathway: settings.pathway,
            country: settings.country,
            topicDomain: settings.topicDomain,
            lessonType: settings.lessonType,
            difficulty: settings.difficulty ?? null,
            relatedCategoryIds: settings.relatedCategoryIds,
            batchTopicKey: key,
            batchItemId: row.publicItemId,
            batchJobId: jobId,
          },
          normalizedJson: normalized as object,
          validationJson: {
            ok: true,
            model,
            totalTokens: rawTokens ?? null,
            batchJobId: jobId,
            batchItemId: row.publicItemId,
          },
          reviewStatus: DraftReviewStatus.PENDING_REVIEW,
          titlePreview: lesson.title.slice(0, 500),
          sourcePrompt: `topic=${row.topic}; pathway=${settings.pathway}; country=${settings.country}; type=${settings.lessonType}; batch=${jobId}`,
          model,
          createdById: gate.userId,
        },
        select: { id: true },
      });

      await tx.lessonBatchQueueItem.update({
        where: { id: row.id },
        data: {
          status: "COMPLETED",
          generatedDraftId: draft.id,
          generatedDraftTitle: lesson.title.slice(0, 500),
          completedAt: new Date(),
          startedAt: null,
          claimedByRequestId: null,
          lastError: null,
        },
      });

      await tx.aiGenerationJob.update({
        where: { id: jobId },
        data: {
          tokensUsed: { increment: rawTokens ?? 0 },
        },
      });

      return draft.id;
    });

    await syncJobResultSummaryJson(db, jobId);

    await db.aiGenerationLog.create({
      data: {
        jobId,
        step: "batch_item_completed",
        detail: { itemId: row.publicItemId, draftId: createdDraftId },
      },
    });

    const summary = await loadLessonBatchSummaryWithHydration(db, jobId);
    const derived = summary ? resolveLessonBatchDerived(summary) : null;
    const item = summary?.items.find((i) => i.itemId === row.publicItemId);

    return {
      done: derived?.allTerminal ?? false,
      item,
      summary,
      derived,
    };
  } catch (e) {
    const raw = e instanceof Error ? e.message : String(e);
    const message = sanitizeLessonBatchError(raw);
    const now = new Date();
    await db.lessonBatchQueueItem.update({
      where: { id: row.id },
      data: {
        status: "FAILED",
        lastError: message,
        startedAt: null,
        claimedByRequestId: null,
        completedAt: null,
        lastAttemptAt: now,
      },
    });
    await syncJobResultSummaryJson(db, jobId);

    await db.aiGenerationLog.create({
      data: {
        jobId,
        step: "batch_item_failed",
        detail: { itemId: row.publicItemId, error: message.slice(0, 500) },
      },
    });

    const summary = await loadLessonBatchSummaryWithHydration(db, jobId);
    const derived = summary ? resolveLessonBatchDerived(summary) : null;
    const item = summary?.items.find((i) => i.itemId === row.publicItemId);

    return {
      done: false,
      item,
      summary,
      derived,
    };
  }
}
