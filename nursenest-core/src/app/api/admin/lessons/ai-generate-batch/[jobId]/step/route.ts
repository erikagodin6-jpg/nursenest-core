import { DraftReviewStatus, JobStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import {
  ADMIN_AI_STEP_ROUTE_MAX_DURATION_SEC,
  ADMIN_API_RUNTIME_NODE,
} from "@/lib/admin/admin-api-route-config";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { isAdminAiGenerationEnabled } from "@/lib/ai/admin-ai-policy";
import { checkAdminAiGenerateLimit } from "@/lib/ai/admin-rate-limit";
import { assertOpenAiKeyConfigured, getOpenAiChatModel } from "@/lib/ai/openai-env";
import {
  ADMIN_LESSON_BATCH_TOOL,
  findLessonDraftDuplicate,
  isTerminalBatchStatus,
  lessonBatchTopicKey,
  parseBatchSummary,
  reviveStaleGeneratingItems,
  type LessonBatchItem,
  type LessonBatchResultSummaryV1,
} from "@/lib/lessons/admin-ai-lesson-batch";
import type { AdminAiLessonGenerateInput } from "@/lib/lessons/admin-ai-lesson-pipeline";
import {
  ADMIN_AI_LESSON_GENERATOR_TOOL,
  buildDraftNormalized,
  generateAdminAiLesson,
} from "@/lib/lessons/admin-ai-lesson-pipeline";
import { prisma } from "@/lib/db";

export const runtime = ADMIN_API_RUNTIME_NODE;
export const maxDuration = ADMIN_AI_STEP_ROUTE_MAX_DURATION_SEC;

type Props = { params: Promise<{ jobId: string }> };

const MAX_LOCK_ATTEMPTS = 5;

async function persistItemPatch(
  jobId: string,
  itemId: string,
  patch: Partial<LessonBatchItem>,
  tokenDelta?: number,
): Promise<LessonBatchResultSummaryV1 | null> {
  const fresh = await prisma.aiGenerationJob.findUnique({ where: { id: jobId } });
  const s = parseBatchSummary(fresh?.resultSummary);
  if (!s) return null;
  const idx = s.items.findIndex((x) => x.itemId === itemId);
  if (idx < 0) return null;
  const mergedItems = [...s.items];
  mergedItems[idx] = { ...mergedItems[idx]!, ...patch };
  const allTerminal = mergedItems.every((i) => isTerminalBatchStatus(i.status));
  await prisma.aiGenerationJob.update({
    where: { id: jobId },
    data: {
      resultSummary: { ...s, items: mergedItems } as object,
      status: allTerminal ? JobStatus.COMPLETED : JobStatus.RUNNING,
      ...(tokenDelta != null ? { tokensUsed: (fresh?.tokensUsed ?? 0) + tokenDelta } : {}),
    },
  });
  const after = await prisma.aiGenerationJob.findUnique({ where: { id: jobId } });
  return parseBatchSummary(after?.resultSummary);
}

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

  for (let attempt = 0; attempt < MAX_LOCK_ATTEMPTS; attempt++) {
    let job = await prisma.aiGenerationJob.findUnique({ where: { id: jobId } });
    if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (job.createdById !== gate.admin.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (job.tool !== ADMIN_LESSON_BATCH_TOOL) {
      return NextResponse.json({ error: "Not a lesson batch job" }, { status: 400 });
    }

    let summary = parseBatchSummary(job.resultSummary);
    if (!summary) {
      return NextResponse.json({ error: "Invalid batch state" }, { status: 500 });
    }

    const { summary: revived, mutated } = reviveStaleGeneratingItems(summary);
    if (mutated) {
      await prisma.aiGenerationJob.update({
        where: { id: jobId },
        data: { resultSummary: revived as object },
      });
      job = await prisma.aiGenerationJob.findUnique({ where: { id: jobId } });
      if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
      summary = parseBatchSummary(job.resultSummary) ?? revived;
    } else {
      summary = revived;
    }

    if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const pendingIdx = summary.items.findIndex((i) => i.status === "pending");
    if (pendingIdx === -1) {
      const allDone = summary.items.every((i) => isTerminalBatchStatus(i.status));
      if (allDone && job.status !== JobStatus.COMPLETED) {
        await prisma.aiGenerationJob.update({
          where: { id: jobId },
          data: { status: JobStatus.COMPLETED, error: null },
        });
      }
      return NextResponse.json({
        done: true,
        summary,
        message: "No pending items",
      });
    }

    const item = summary.items[pendingIdx]!;
    const startedAt = new Date().toISOString();
    const nextSummary: LessonBatchResultSummaryV1 = {
      ...summary,
      items: summary.items.map((it, i) =>
        i === pendingIdx ? { ...it, status: "generating" as const, startedAt } : it,
      ),
    };

    const lock = await prisma.aiGenerationJob.updateMany({
      where: { id: jobId, updatedAt: job.updatedAt },
      data: {
        resultSummary: nextSummary as object,
        status: JobStatus.RUNNING,
      },
    });

    if (lock.count === 0) {
      continue;
    }

    const settings = summary.settings;
    let relatedCategoryLabels: string[] = [];
    if (settings.relatedCategoryIds.length > 0) {
      const cats = await prisma.category.findMany({
        where: { id: { in: settings.relatedCategoryIds } },
        select: { name: true, slug: true },
      });
      relatedCategoryLabels = cats.map((c) => c.name || c.slug);
    }

    const genInput: AdminAiLessonGenerateInput = {
      topic: item.topic,
      pathway: settings.pathway,
      country: settings.country,
      topicDomain: settings.topicDomain,
      lessonType: settings.lessonType,
      difficulty: settings.difficulty,
      relatedCategoryLabels,
    };

    try {
      if (!summary.allowDuplicates) {
        const dup = await findLessonDraftDuplicate(prisma, item.batchTopicKey, {
          topic: item.topic,
          pathway: settings.pathway,
          country: settings.country,
          lessonType: settings.lessonType,
        });
        if (dup) {
          const afterSum = await persistItemPatch(jobId, item.itemId, {
            status: "skipped_duplicate",
            existingDraftId: dup.id,
            startedAt: null,
          });
          await prisma.aiGenerationLog.create({
            data: {
              jobId,
              step: "batch_item_skipped_duplicate",
              detail: { itemId: item.itemId, existingDraftId: dup.id },
            },
          });
          return NextResponse.json({
            done: false,
            item: { ...item, status: "skipped_duplicate" as const, existingDraftId: dup.id },
            summary: afterSum,
          });
        }
      }

      const { lesson, rawTokens } = await generateAdminAiLesson(genInput);
      const normalized = buildDraftNormalized(genInput, lesson);
      const model = getOpenAiChatModel();
      const key = lessonBatchTopicKey(item.topic, settings.pathway, settings.country, settings.lessonType);

      const draft = await prisma.generatedLessonDraft.create({
        data: {
          jobId,
          tool: ADMIN_AI_LESSON_GENERATOR_TOOL,
          payloadJson: {
            topic: item.topic,
            pathway: settings.pathway,
            country: settings.country,
            topicDomain: settings.topicDomain,
            lessonType: settings.lessonType,
            difficulty: settings.difficulty ?? null,
            relatedCategoryIds: settings.relatedCategoryIds,
            batchTopicKey: key,
            batchItemId: item.itemId,
            batchJobId: jobId,
          },
          normalizedJson: normalized as object,
          validationJson: {
            ok: true,
            model,
            totalTokens: rawTokens ?? null,
            batchJobId: jobId,
            batchItemId: item.itemId,
          },
          reviewStatus: DraftReviewStatus.PENDING_REVIEW,
          titlePreview: lesson.title.slice(0, 500),
          sourcePrompt: `topic=${item.topic}; pathway=${settings.pathway}; country=${settings.country}; type=${settings.lessonType}; batch=${jobId}`,
          model,
          createdById: gate.admin.userId,
        },
        select: { id: true },
      });

      const afterSum = await persistItemPatch(
        jobId,
        item.itemId,
        {
          status: "completed",
          draftId: draft.id,
          startedAt: null,
        },
        rawTokens ?? 0,
      );

      await prisma.aiGenerationLog.create({
        data: {
          jobId,
          step: "batch_item_completed",
          detail: { itemId: item.itemId, draftId: draft.id },
        },
      });

      return NextResponse.json({
        done: false,
        item: { ...item, status: "completed" as const, draftId: draft.id },
        summary: afterSum,
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      const afterSum = await persistItemPatch(jobId, item.itemId, {
        status: "failed",
        error: message.slice(0, 2000),
        startedAt: null,
      });

      await prisma.aiGenerationLog.create({
        data: {
          jobId,
          step: "batch_item_failed",
          detail: { itemId: item.itemId, error: message.slice(0, 500) },
        },
      });

      return NextResponse.json({
        done: false,
        item: { ...item, status: "failed" as const, error: message },
        summary: afterSum,
      });
    }
  }

  return NextResponse.json({ error: "Could not claim batch item (try again)" }, { status: 409 });
}
