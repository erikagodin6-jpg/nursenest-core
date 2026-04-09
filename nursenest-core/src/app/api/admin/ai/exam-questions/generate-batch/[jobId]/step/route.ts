import { DraftReviewStatus, JobStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import {
  ADMIN_QUESTION_BATCH_JOB_TOOL,
  findQuestionDraftByBatchTopicKey,
  isTerminalQuestionBatchStatus,
  parseQuestionBatchSummary,
  questionBatchTopicKey,
  reviveStaleQuestionBatchItems,
  type QuestionBatchItem,
  type QuestionBatchResultSummaryV1,
} from "@/lib/ai/admin-ai-question-batch";
import {
  ADMIN_AI_QUESTION_TOOL,
  openAiExamQuestionItemsForContext,
  type LessonHintRow,
} from "@/lib/ai/admin-ai-question-pipeline";
import { isAdminAiGenerationEnabled } from "@/lib/ai/admin-ai-policy";
import { checkAdminAiGenerateLimit } from "@/lib/ai/admin-rate-limit";
import { assertOpenAiKeyConfigured, getOpenAiChatModel } from "@/lib/ai/openai-env";
import {
  countryFromApi,
  examFamilyFromApi,
  normalizeAiQuestionItem,
  tierFromApi,
  validateNormalizedQuestion,
  withQuestionDraftContext,
} from "@/lib/content/ai-draft-validation";
import { stemHash } from "@/lib/content/stem-hash";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const maxDuration = 180;

type Props = { params: Promise<{ jobId: string }> };

const MAX_LOCK_ATTEMPTS = 5;

async function persistQuestionBatchItem(
  jobId: string,
  itemId: string,
  patch: Partial<QuestionBatchItem>,
  tokenDelta?: number,
): Promise<QuestionBatchResultSummaryV1 | null> {
  const fresh = await prisma.aiGenerationJob.findUnique({ where: { id: jobId } });
  const s = parseQuestionBatchSummary(fresh?.resultSummary);
  if (!s) return null;
  const idx = s.items.findIndex((x) => x.itemId === itemId);
  if (idx < 0) return null;
  const mergedItems = [...s.items];
  mergedItems[idx] = { ...mergedItems[idx]!, ...patch };
  const allTerminal = mergedItems.every((i) => isTerminalQuestionBatchStatus(i.status));
  await prisma.aiGenerationJob.update({
    where: { id: jobId },
    data: {
      resultSummary: { ...s, items: mergedItems } as object,
      status: allTerminal ? JobStatus.COMPLETED : JobStatus.RUNNING,
      ...(tokenDelta != null ? { tokensUsed: (fresh?.tokensUsed ?? 0) + tokenDelta } : {}),
    },
  });
  const after = await prisma.aiGenerationJob.findUnique({ where: { id: jobId } });
  return parseQuestionBatchSummary(after?.resultSummary);
}

export async function POST(_req: Request, ctx: Props) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  if (!isAdminAiGenerationEnabled()) {
    return NextResponse.json(
      { error: "Admin AI generation is disabled. Set AI_ADMIN_GENERATION_ENABLED=true." },
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
    if (job.tool !== ADMIN_QUESTION_BATCH_JOB_TOOL) {
      return NextResponse.json({ error: "Not a question batch job" }, { status: 400 });
    }

    let summary = parseQuestionBatchSummary(job.resultSummary);
    if (!summary) {
      return NextResponse.json({ error: "Invalid batch state" }, { status: 500 });
    }

    const { summary: revived, mutated } = reviveStaleQuestionBatchItems(summary);
    if (mutated) {
      await prisma.aiGenerationJob.update({
        where: { id: jobId },
        data: { resultSummary: revived as object },
      });
      job = await prisma.aiGenerationJob.findUnique({ where: { id: jobId } });
      if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
      summary = parseQuestionBatchSummary(job.resultSummary) ?? revived;
    } else {
      summary = revived;
    }

    if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const pendingIdx = summary.items.findIndex((i) => i.status === "pending");
    if (pendingIdx === -1) {
      const allDone = summary.items.every((i) => isTerminalQuestionBatchStatus(i.status));
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
    const nextSummary: QuestionBatchResultSummaryV1 = {
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
    const tierCode = tierFromApi(settings.tier);
    const cc = countryFromApi(settings.country);
    const ef = examFamilyFromApi(settings.examFamily);
    const examContextLabel = `${settings.examFamily} · ${settings.country}`;
    const batchId = `qb-${jobId.slice(0, 12)}`;
    const model = getOpenAiChatModel();

    let categoryLabel: string | undefined;
    if (settings.categoryId) {
      const cat = await prisma.category.findUnique({
        where: { id: settings.categoryId },
        select: { name: true, slug: true },
      });
      if (cat) categoryLabel = `${cat.name} (${cat.slug})`;
    }

    let lessonHints: LessonHintRow[] = [];
    if (settings.lessonTargetIds.length > 0) {
      const rows = await prisma.contentItem.findMany({
        where: { id: { in: settings.lessonTargetIds }, type: "lesson" },
        select: { id: true, title: true, slug: true },
      });
      lessonHints = rows.map((r) => ({ id: r.id, title: r.title, slug: r.slug }));
    }

    const key = questionBatchTopicKey(item.topic, settings);

    try {
      if (!summary.allowDuplicates) {
        const dup = await findQuestionDraftByBatchTopicKey(prisma, key);
        if (dup) {
          const afterSum = await persistQuestionBatchItem(jobId, item.itemId, {
            status: "skipped_duplicate",
            existingDraftId: dup.id,
            startedAt: null,
          });
          await prisma.aiGenerationLog.create({
            data: {
              jobId,
              step: "question_batch_skipped_duplicate",
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

      const genCtx = {
        topic: item.topic,
        quantity: 1,
        tier: settings.tier,
        pathwayLabel: settings.pathwayLabel,
        country: settings.country,
        examFamily: settings.examFamily,
        difficulty: settings.difficulty,
        categoryLabel,
        questionTypeMode: settings.questionTypeMode,
        questionStyleHints: settings.questionStyleHints,
        lessonHints,
      };

      const { items: aiItems, totalTokens } = await openAiExamQuestionItemsForContext(genCtx);
      const first = aiItems[0];
      if (first === undefined || first === null) {
        throw new Error("Model returned an empty array");
      }

      const rawPayload = first as object;
      const payloadJson = {
        ...rawPayload,
        batchTopicKey: key,
        batchJobId: jobId,
        batchItemId: item.itemId,
        batchSourceTopic: item.topic,
      };

      const sourcePrompt = `topic=${item.topic}; batch=${jobId}; item=${item.itemId}`;

      const normBase = normalizeAiQuestionItem(first);
      if (!normBase.ok) {
        const badDraft = await prisma.generatedQuestionDraft.create({
          data: {
            jobId,
            tool: ADMIN_AI_QUESTION_TOOL,
            batchId,
            payloadJson: payloadJson as object,
            validationJson: { ok: false, errors: [normBase.error], warnings: [], duplicateRisk: false },
            reviewStatus: DraftReviewStatus.PENDING_REVIEW,
            tier: tierCode,
            country: cc,
            examFamily: ef,
            lessonId: settings.lessonId,
            categoryId: settings.categoryId,
            sourcePrompt,
            model,
            createdById: gate.admin.userId,
            stemPreview: "(normalize failed)",
          },
          select: { id: true },
        });
        const afterSum = await persistQuestionBatchItem(
          jobId,
          item.itemId,
          {
            status: "completed",
            draftId: badDraft.id,
            startedAt: null,
            error: normBase.error,
          },
          totalTokens ?? 0,
        );
        await prisma.aiGenerationLog.create({
          data: {
            jobId,
            step: "question_batch_normalize_failed",
            detail: { itemId: item.itemId, draftId: badDraft.id, error: normBase.error },
          },
        });
        return NextResponse.json({
          done: false,
          item: {
            ...item,
            status: "completed" as const,
            draftId: badDraft.id,
            error: normBase.error,
          },
          summary: afterSum,
          warning: "Draft saved with normalization errors for manual repair",
        });
      }

      const norm = withQuestionDraftContext(normBase.value, {
        pathwayLabel: settings.pathwayLabel,
        examContextLabel,
      });

      const sh = stemHash(norm.stem);
      const [existingQ, existingDraft] = await Promise.all([
        prisma.examQuestion.findFirst({ where: { stemHash: sh }, select: { id: true } }),
        prisma.generatedQuestionDraft.findFirst({
          where: {
            stemHash: sh,
            reviewStatus: { in: [DraftReviewStatus.PENDING_REVIEW, DraftReviewStatus.APPROVED] },
          },
          select: { id: true },
        }),
      ]);

      if (!summary.allowDuplicates && (existingDraft || existingQ)) {
        const afterSum = await persistQuestionBatchItem(jobId, item.itemId, {
          status: "skipped_duplicate_stem",
          existingDraftId: existingDraft?.id,
          existingQuestionBankId: existingQ?.id,
          startedAt: null,
        });
        await prisma.aiGenerationLog.create({
          data: {
            jobId,
            step: "question_batch_skipped_stem",
            detail: {
              itemId: item.itemId,
              stemHash: sh,
              existingDraftId: existingDraft?.id,
              existingQuestionBankId: existingQ?.id,
            },
          },
        });
        return NextResponse.json({
          done: false,
          item: {
            ...item,
            status: "skipped_duplicate_stem" as const,
            existingDraftId: existingDraft?.id,
            existingQuestionBankId: existingQ?.id,
          },
          summary: afterSum,
        });
      }

      const dupSet = new Set<string>();
      const v = validateNormalizedQuestion(norm, { duplicateStemHashes: dupSet });
      const warnings = [...v.warnings];
      if (existingQ) warnings.push("Stem hash matches an existing Question in the bank.");
      if (existingDraft) warnings.push("Stem hash matches another pending/approved draft.");
      if (existingQ || existingDraft) v.duplicateRisk = true;

      const validationJson = {
        ok: v.ok,
        errors: v.errors,
        warnings,
        duplicateRisk: v.duplicateRisk,
      };

      const draft = await prisma.generatedQuestionDraft.create({
        data: {
          jobId,
          tool: ADMIN_AI_QUESTION_TOOL,
          batchId,
          payloadJson: payloadJson as object,
          normalizedJson: norm as object,
          validationJson,
          reviewStatus: DraftReviewStatus.PENDING_REVIEW,
          stemHash: sh,
          stemPreview: norm.stem.slice(0, 280),
          lessonId: settings.lessonId,
          categoryId: settings.categoryId,
          examFamily: ef,
          tier: tierCode,
          country: cc,
          sourcePrompt,
          model,
          createdById: gate.admin.userId,
        },
        select: { id: true },
      });

      const afterSum = await persistQuestionBatchItem(
        jobId,
        item.itemId,
        {
          status: "completed",
          draftId: draft.id,
          startedAt: null,
        },
        totalTokens ?? 0,
      );

      await prisma.aiGenerationLog.create({
        data: {
          jobId,
          step: "question_batch_item_completed",
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
      const afterSum = await persistQuestionBatchItem(jobId, item.itemId, {
        status: "failed",
        error: message.slice(0, 2000),
        startedAt: null,
      });
      await prisma.aiGenerationLog.create({
        data: {
          jobId,
          step: "question_batch_item_failed",
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
