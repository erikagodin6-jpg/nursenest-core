import { DraftReviewStatus, JobStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { isAdminAiGenerationEnabled } from "@/lib/ai/admin-ai-policy";
import { checkAdminAiGenerateLimit } from "@/lib/ai/admin-rate-limit";
import { assertOpenAiKeyConfigured, getOpenAiChatModel } from "@/lib/ai/openai-env";
import {
  ADMIN_LESSON_BATCH_TOOL,
  loadLessonBatchSummaryWithHydration,
  claimNextLessonBatchItem,
  resolveLessonBatchDerived,
  findLessonDraftDuplicate,
  lessonBatchTopicKey,
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
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const maxDuration = 180;

type Props = { params: Promise<{ jobId: string }> };

export async function POST(_req: Request, ctx: Props) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  if (!isAdminAiGenerationEnabled()) {
    return NextResponse.json(
      { error: "Admin AI generation disabled", hint: "Set AI_ADMIN_GENERATION_ENABLED=true" },
      { status: 403 },
    );
  }
  const keyCheck = assertOpenAiKeyConfigured();
  if (!keyCheck.ok) return NextResponse.json({ error: keyCheck.message }, { status: 503 });

  const rl = checkAdminAiGenerateLimit(gate.admin.userId);
  if (!rl.ok) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again later.", code: "RATE_LIMIT" }, { status: 429 });
  }

  const { jobId } = await ctx.params;
  const requestId = randomUUID();

  const jobCheck = await prisma.aiGenerationJob.findUnique({ where: { id: jobId } });
  if (!jobCheck) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (jobCheck.createdById !== gate.admin.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (jobCheck.tool !== ADMIN_LESSON_BATCH_TOOL) {
    return NextResponse.json({ error: "Not a lesson batch job" }, { status: 400 });
  }

  const claim = await claimNextLessonBatchItem(prisma, jobId, requestId);

  if (claim.kind === "job_not_runnable") {
    await syncJobResultSummaryJson(prisma, jobId);
    const summary = await loadLessonBatchSummaryWithHydration(prisma, jobId);
    const derived = summary ? resolveLessonBatchDerived(summary) : null;
    const j = await prisma.aiGenerationJob.findUnique({ where: { id: jobId } });
    return NextResponse.json({
      done: true,
      stopped: true,
      reason: j?.status === JobStatus.CANCELLED ? "canceled" : "job_not_running",
      summary,
      derived,
    });
  }

  if (claim.kind === "idle") {
    await syncJobResultSummaryJson(prisma, jobId);
    const summary = await loadLessonBatchSummaryWithHydration(prisma, jobId);
    const derived = summary ? resolveLessonBatchDerived(summary) : null;
    const done = derived?.allTerminal ?? true;
    return NextResponse.json({
      done,
      idle: true,
      message: done ? "Batch finished" : "No claimable pending items",
      summary,
      derived,
    });
  }

  const row = claim.row;
  const job = await prisma.aiGenerationJob.findUnique({ where: { id: jobId } });
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const inputPayload = job.inputPayload as Record<string, unknown>;
  const settings = {
    pathway: inputPayload.pathway as LessonBatchResultSummaryV1["settings"]["pathway"],
    country: inputPayload.country as "CA" | "US",
    topicDomain: String(inputPayload.topicDomain ?? ""),
    lessonType: inputPayload.lessonType as LessonBatchResultSummaryV1["settings"]["lessonType"],
    difficulty: inputPayload.difficulty as LessonBatchResultSummaryV1["settings"]["difficulty"] | undefined,
    relatedCategoryIds: Array.isArray(inputPayload.relatedCategoryIds)
      ? (inputPayload.relatedCategoryIds as string[])
      : [],
  };
  const allowDuplicates = Boolean(inputPayload.allowDuplicates);

  let relatedCategoryLabels: string[] = [];
  if (settings.relatedCategoryIds.length > 0) {
    const cats = await prisma.category.findMany({
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
      const dup = await findLessonDraftDuplicate(prisma, key, {
        topic: row.topic,
        pathway: settings.pathway,
        country: settings.country,
        lessonType: settings.lessonType,
      });
      if (dup) {
        const now = new Date();
        await prisma.lessonBatchQueueItem.update({
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
        await syncJobResultSummaryJson(prisma, jobId);
        await prisma.aiGenerationLog.create({
          data: {
            jobId,
            step: "batch_item_skipped_duplicate",
            detail: { itemId: row.publicItemId, existingDraftId: dup.id },
          },
        });
        const summary = await loadLessonBatchSummaryWithHydration(prisma, jobId);
        const derived = summary ? resolveLessonBatchDerived(summary) : null;
        const item = summary?.items.find((i) => i.itemId === row.publicItemId);
        return NextResponse.json({
          done: derived?.allTerminal ?? false,
          item,
          summary,
          derived,
        });
      }
    }

    const { lesson, rawTokens } = await generateAdminAiLesson(genInput);
    const normalized = buildDraftNormalized(genInput, lesson);
    const model = getOpenAiChatModel();

    const createdDraftId = await prisma.$transaction(async (tx) => {
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
          createdById: gate.admin.userId,
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

    await syncJobResultSummaryJson(prisma, jobId);

    await prisma.aiGenerationLog.create({
      data: {
        jobId,
        step: "batch_item_completed",
        detail: { itemId: row.publicItemId, draftId: createdDraftId },
      },
    });

    const summary = await loadLessonBatchSummaryWithHydration(prisma, jobId);
    const derived = summary ? resolveLessonBatchDerived(summary) : null;
    const item = summary?.items.find((i) => i.itemId === row.publicItemId);

    return NextResponse.json({
      done: derived?.allTerminal ?? false,
      item,
      summary,
      derived,
    });
  } catch (e) {
    const raw = e instanceof Error ? e.message : String(e);
    const message = sanitizeLessonBatchError(raw);
    const now = new Date();
    await prisma.lessonBatchQueueItem.update({
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
    await syncJobResultSummaryJson(prisma, jobId);

    await prisma.aiGenerationLog.create({
      data: {
        jobId,
        step: "batch_item_failed",
        detail: { itemId: row.publicItemId, error: message.slice(0, 500) },
      },
    });

    const summary = await loadLessonBatchSummaryWithHydration(prisma, jobId);
    const derived = summary ? resolveLessonBatchDerived(summary) : null;
    const item = summary?.items.find((i) => i.itemId === row.publicItemId);

    return NextResponse.json({
      done: false,
      item,
      summary,
      derived,
    });
  }
}
