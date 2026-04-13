import { DraftReviewStatus, JobStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import {
  ADMIN_QUESTION_BATCH_JOB_TOOL,
  findQuestionDraftByBatchTopicKey,
  isTerminalQuestionBatchStatus,
  parseQuestionBatchSummary,
  reviveStaleQuestionBatchItems,
  type QuestionBatchItem,
  type QuestionBatchResultSummaryV1,
} from "@/lib/ai/admin-ai-question-batch";
import {
  ADMIN_AI_QUESTION_TOOL,
  openAiExamQuestionItemsForContext,
  type LessonHintRow,
} from "@/lib/ai/admin-ai-question-pipeline";
import { answerPatternFingerprint } from "@/lib/ai/question-variation-engine";
import {
  abortQuestionBatchForSafety,
  BATCH_ABORT_ERROR_THRESHOLD,
  batchControlSchema,
  consecutiveFailuresQuestionItems,
  mergeBatchControl,
} from "@/lib/ai/controlled-ai-batch";
import { batchProgressLogDetail, questionBatchProgress } from "@/lib/ai/content-generation-pipeline";
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
import { normalizeGeneratedStemForNearDupList } from "@/lib/content/generated-question-auto-validation";
import { stemHash } from "@/lib/content/stem-hash";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const maxDuration = 180;

type Props = { params: Promise<{ jobId: string }> };

const MAX_LOCK_ATTEMPTS = 5;

const stepBodySchema = z.object({
  batchControl: batchControlSchema.optional(),
});

const NEAR_DUP_NORMS_CAP = 48;
const ANSWER_PATTERN_CAP = 64;

async function persistQuestionBatchItem(
  jobId: string,
  itemId: string,
  patch: Partial<QuestionBatchItem>,
  tokenDelta?: number,
  nearDupStemNormAppend?: string,
  answerPatternAppend?: string,
): Promise<QuestionBatchResultSummaryV1 | null> {
  const fresh = await prisma.aiGenerationJob.findUnique({ where: { id: jobId } });
  const s = parseQuestionBatchSummary(fresh?.resultSummary);
  if (!s) return null;
  const idx = s.items.findIndex((x) => x.itemId === itemId);
  if (idx < 0) return null;
  const mergedItems = [...s.items];
  mergedItems[idx] = { ...mergedItems[idx]!, ...patch };
  const allTerminal = mergedItems.every((i) => isTerminalQuestionBatchStatus(i.status));
  const nextSummary: QuestionBatchResultSummaryV1 = { ...s, items: mergedItems };
  if (nearDupStemNormAppend != null && nearDupStemNormAppend.length > 0) {
    nextSummary.nearDupStemNorms = [...(s.nearDupStemNorms ?? []), nearDupStemNormAppend].slice(-NEAR_DUP_NORMS_CAP);
  }
  if (answerPatternAppend != null && answerPatternAppend.length > 0) {
    nextSummary.usedAnswerPatterns = [...(s.usedAnswerPatterns ?? []), answerPatternAppend].slice(-ANSWER_PATTERN_CAP);
  }
  await prisma.aiGenerationJob.update({
    where: { id: jobId },
    data: {
      resultSummary: nextSummary as object,
      status: allTerminal ? JobStatus.COMPLETED : JobStatus.RUNNING,
      ...(tokenDelta != null ? { tokensUsed: (fresh?.tokensUsed ?? 0) + tokenDelta } : {}),
    },
  });
  const after = await prisma.aiGenerationJob.findUnique({ where: { id: jobId } });
  return parseQuestionBatchSummary(after?.resultSummary);
}

export async function POST(req: Request, ctx: Props) {
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
  const bodyParsed = stepBodySchema.safeParse(await req.json().catch(() => ({})));
  const requestControl = bodyParsed.success ? bodyParsed.data.batchControl : undefined;

  const jobPre = await prisma.aiGenerationJob.findUnique({ where: { id: jobId } });
  if (!jobPre) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (jobPre.createdById !== gate.admin.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (jobPre.tool !== ADMIN_QUESTION_BATCH_JOB_TOOL) {
    return NextResponse.json({ error: "Not a question batch job" }, { status: 400 });
  }

  const control = mergeBatchControl(jobPre.inputPayload, requestControl);
  let processedInRequest = 0;
  let lastPayload: Record<string, unknown> | null = null;

  outer: while (processedInRequest < control.maxItemsPerRun) {
    let itemPayload: Record<string, unknown> | null = null;

    inner: for (let attempt = 0; attempt < MAX_LOCK_ATTEMPTS; attempt++) {
      let job = await prisma.aiGenerationJob.findUnique({ where: { id: jobId } });
      if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });

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

      const pendingIdx = summary.items.findIndex((i) => i.status === "pending");
      if (pendingIdx === -1) {
        const allDone = summary.items.every((i) => isTerminalQuestionBatchStatus(i.status));
        if (allDone && job.status !== JobStatus.COMPLETED) {
          await prisma.aiGenerationJob.update({
            where: { id: jobId },
            data: { status: JobStatus.COMPLETED, error: null },
          });
        }
        const payload = { done: true, summary, message: "No pending items" };
        if (processedInRequest === 0) {
          return NextResponse.json({
            ...payload,
            batchChunk: { processedInRequest, maxItemsPerRun: control.maxItemsPerRun },
          });
        }
        lastPayload = { ...payload, batchChunk: { processedInRequest, maxItemsPerRun: control.maxItemsPerRun } };
        break outer;
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

        const key = item.batchTopicKey;

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
            itemPayload = {
              done: false,
              item: { ...item, status: "skipped_duplicate" as const, existingDraftId: dup.id },
              summary: afterSum,
            };
            break inner;
          }
        }

        const topicForModel = item.baseTopic ?? item.topic;
        const genCtx = {
          topic: topicForModel,
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
          ...(item.variationDirective?.trim()
            ? { variationDirective: item.variationDirective.trim() }
            : {}),
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
          batchSourceTopic: topicForModel,
        };

        const sourcePrompt = `topic=${topicForModel}; batch=${jobId}; item=${item.itemId}`;

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
          itemPayload = {
            done: false,
            item: {
              ...item,
              status: "completed" as const,
              draftId: badDraft.id,
              error: normBase.error,
            },
            summary: afterSum,
            warning: "Draft saved with normalization errors for manual repair",
          };
          break inner;
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
          itemPayload = {
            done: false,
            item: {
              ...item,
              status: "skipped_duplicate_stem" as const,
              existingDraftId: existingDraft?.id,
              existingQuestionBankId: existingQ?.id,
            },
            summary: afterSum,
          };
          break inner;
        }

        const dupSet = new Set<string>();
        const v = validateNormalizedQuestion(norm, {
          duplicateStemHashes: dupSet,
          expectedTags: {
            topic: topicForModel,
            tier: settings.tier,
            exam: settings.examFamily,
          },
          priorNormalizedStems: summary.nearDupStemNorms ?? [],
        });
        const warnings = [...v.warnings];
        if (existingQ) warnings.push("Stem hash matches an existing Question in the bank.");
        if (existingDraft) warnings.push("Stem hash matches another pending/approved draft.");
        if (existingQ || existingDraft) v.duplicateRisk = true;

        const answerFp = answerPatternFingerprint(norm);
        const answerPatternDup = (summary.usedAnswerPatterns ?? []).includes(answerFp);
        const patternErrors = answerPatternDup
          ? [
              "Variation: same correct-option index pattern as another item in this batch — shuffle distractors or change which option is keyed correct.",
            ]
          : [];
        const mergedErrors = [...v.errors, ...patternErrors];
        const mergedOk = mergedErrors.length === 0;

        const validationJson = {
          ok: mergedOk,
          errors: mergedErrors,
          warnings,
          duplicateRisk: v.duplicateRisk,
          autoValidation: v.autoValidation,
          answerPattern: answerFp,
          answerPatternDuplicate: answerPatternDup,
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
          mergedOk ? normalizeGeneratedStemForNearDupList(norm.stem) : undefined,
          mergedOk ? answerFp : undefined,
        );

        await prisma.aiGenerationLog.create({
          data: {
            jobId,
            step: "question_batch_item_completed",
            detail: { itemId: item.itemId, draftId: draft.id },
          },
        });

        itemPayload = {
          done: false,
          item: { ...item, status: "completed" as const, draftId: draft.id },
          summary: afterSum,
        };
        break inner;
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
        itemPayload = {
          done: false,
          item: { ...item, status: "failed" as const, error: message },
          summary: afterSum,
        };
        break inner;
      }
    }

    if (!itemPayload) {
      return NextResponse.json({ error: "Could not claim batch item (try again)" }, { status: 409 });
    }

    processedInRequest += 1;
    lastPayload = itemPayload;

    const jobMid = await prisma.aiGenerationJob.findUnique({ where: { id: jobId } });
    const summaryMid = parseQuestionBatchSummary(jobMid?.resultSummary);
    if (
      control.maxConsecutiveFailures > 0 &&
      summaryMid &&
      consecutiveFailuresQuestionItems(summaryMid.items) >= control.maxConsecutiveFailures
    ) {
      await abortQuestionBatchForSafety(prisma, jobId, BATCH_ABORT_ERROR_THRESHOLD);
      const jobAfter = await prisma.aiGenerationJob.findUnique({ where: { id: jobId } });
      const summaryAfter = parseQuestionBatchSummary(jobAfter?.resultSummary);
      await prisma.aiGenerationLog.create({
        data: {
          jobId,
          step: "batch_chunk_stopped",
          detail: {
            processedInRequest,
            reason: "error_threshold",
            maxConsecutiveFailures: control.maxConsecutiveFailures,
          },
        },
      });
      return NextResponse.json({
        stopped: true,
        reason: "error_threshold",
        ...itemPayload,
        summary: summaryAfter,
        batchChunk: { processedInRequest, maxItemsPerRun: control.maxItemsPerRun },
      });
    }

    if (summaryMid?.items.every((i) => isTerminalQuestionBatchStatus(i.status))) {
      await prisma.aiGenerationLog.create({
        data: {
          jobId,
          step: "batch_chunk_completed",
          detail: { processedInRequest, terminal: true },
        },
      });
      return NextResponse.json({
        ...itemPayload,
        batchChunk: { processedInRequest, maxItemsPerRun: control.maxItemsPerRun },
      });
    }
  }

  await prisma.aiGenerationLog.create({
    data: {
      jobId,
      step: "batch_chunk_completed",
      detail: { processedInRequest, terminal: false },
    },
  });

  const jobSnap = await prisma.aiGenerationJob.findUnique({ where: { id: jobId } });
  const summarySnap = parseQuestionBatchSummary(jobSnap?.resultSummary);
  if (summarySnap) {
    await prisma.aiGenerationLog.create({
      data: {
        jobId,
        step: "batch_progress_snapshot",
        detail: batchProgressLogDetail(questionBatchProgress(summarySnap)) as object,
      },
    });
  }

  return NextResponse.json({
    ...(lastPayload ?? {}),
    batchChunk: { processedInRequest, maxItemsPerRun: control.maxItemsPerRun },
  });
}
