import { JobStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import {
  ADMIN_QUESTION_BATCH_JOB_TOOL,
  parseQuestionBatchSummary,
  parseQuestionBatchTopicList,
  questionBatchTopicKey,
  type QuestionBatchResultSummaryV1,
  type QuestionBatchSettings,
} from "@/lib/ai/admin-ai-question-batch";
import { assertOpenAiKeyConfigured, getOpenAiChatModel } from "@/lib/ai/openai-env";
import { isAdminAiGenerationEnabled } from "@/lib/ai/admin-ai-policy";
import { prisma } from "@/lib/db";
import {
  batchControlSchema,
  findJobByIdempotencyKey,
  idempotencyKeySchema,
} from "@/lib/ai/controlled-ai-batch";
import {
  buildVariationSpecsForConcept,
  clampVariationsPerTopicBatch,
  formatVariationDirective,
} from "@/lib/ai/question-variation-engine";

const MAX_TOPICS = 35;
const MAX_BATCH_ITEMS = 200;

const bodySchema = z.object({
  topicsRaw: z.string().min(2).max(20_000),
  tier: z.enum(["free", "rpn", "rn", "np"]),
  country: z.enum(["CA", "US"]),
  examFamily: z.enum(["NCLEX_RN", "NCLEX_PN", "REX_PN", "NP", "ALLIED", "GENERIC"]),
  pathway: z.string().trim().max(120).optional(),
  difficulty: z.enum(["FOUNDATION", "INTERMEDIATE", "ADVANCED"]),
  questionTypeMode: z.enum(["auto", "mcq", "sata"]),
  questionTypes: z.string().max(500).optional(),
  lessonId: z.string().optional(),
  categoryId: z.string().optional(),
  lessonTargets: z.string().max(2000).optional(),
  allowDuplicates: z.boolean().default(false),
  /**1 = one item per topic line; 2–8 expands each topic into unique scenario variations. */
  variationsPerTopic: z.coerce.number().int().min(1).max(8).optional(),
  idempotencyKey: idempotencyKeySchema,
  batchControl: batchControlSchema.optional(),
});

export async function POST(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  if (!isAdminAiGenerationEnabled()) {
    return NextResponse.json(
      { error: "Admin AI generation is disabled. Set AI_ADMIN_GENERATION_ENABLED=true." },
      { status: 403 },
    );
  }
  const keyCheck = assertOpenAiKeyConfigured();
  if (!keyCheck.ok) return NextResponse.json({ error: keyCheck.message }, { status: 503 });

  const parsed = bodySchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
  }

  const d = parsed.data;

  if (d.idempotencyKey) {
    const existing = await findJobByIdempotencyKey(prisma, {
      createdById: gate.admin.userId,
      tool: ADMIN_QUESTION_BATCH_JOB_TOOL,
      idempotencyKey: d.idempotencyKey,
    });
    if (existing) {
      const job = await prisma.aiGenerationJob.findUnique({ where: { id: existing.id } });
      const summary = parseQuestionBatchSummary(job?.resultSummary);
      return NextResponse.json({
        ok: true,
        jobId: existing.id,
        summary,
        idempotentReplay: true,
      });
    }
  }

  const topics = parseQuestionBatchTopicList(d.topicsRaw);
  if (topics.length === 0) {
    return NextResponse.json({ error: "No topics parsed from input" }, { status: 400 });
  }
  if (topics.length > MAX_TOPICS) {
    return NextResponse.json(
      { error: `Too many topics (max ${MAX_TOPICS}). Split into multiple batches.` },
      { status: 400 },
    );
  }

  const variationsPerTopic = clampVariationsPerTopicBatch(d.variationsPerTopic);
  const expandedCount = topics.length * variationsPerTopic;
  if (expandedCount > MAX_BATCH_ITEMS) {
    return NextResponse.json(
      {
        error: `Too many batch items (${expandedCount}); max ${MAX_BATCH_ITEMS}. Reduce topics or variationsPerTopic (currently ${variationsPerTopic}).`,
      },
      { status: 400 },
    );
  }

  const hints = (d.questionTypes ?? "")
    .split(/[,;]+/g)
    .map((s) => s.trim())
    .filter(Boolean);
  const lessonTargetIds = (d.lessonTargets ?? "")
    .split(/[,;\s]+/g)
    .map((s) => s.trim())
    .filter((s) => s.length >= 5);

  const pathwayLabel =
    d.pathway?.trim() ||
    (d.tier === "np" ? "NP / advanced practice" : d.tier === "rpn" ? "RPN/LPN" : d.tier === "rn" ? "RN" : "RN");

  const settings: QuestionBatchSettings = {
    tier: d.tier,
    country: d.country,
    examFamily: d.examFamily,
    pathwayLabel,
    difficulty: d.difficulty,
    questionTypeMode: d.questionTypeMode,
    questionStyleHints:
      hints.length > 0
        ? hints
        : d.questionTypeMode === "auto"
          ? ["prioritization", "pharmacology", "lab-values", "clinical judgment"]
          : [],
    lessonTargetIds: [...new Set(lessonTargetIds)],
    lessonId: d.lessonId?.trim() || null,
    categoryId: d.categoryId?.trim() || null,
  };

  const items: QuestionBatchResultSummaryV1["items"] = [];
  for (const topic of topics) {
    if (variationsPerTopic <= 1) {
      items.push({
        itemId: randomUUID(),
        topic,
        batchTopicKey: questionBatchTopicKey(topic, settings),
        status: "pending" as const,
      });
    } else {
      const specs = buildVariationSpecsForConcept(topic, variationsPerTopic);
      for (const spec of specs) {
        items.push({
          itemId: randomUUID(),
          baseTopic: topic,
          topic,
          variationDirective: formatVariationDirective(spec),
          batchTopicKey: questionBatchTopicKey(topic, settings, spec.signature),
          status: "pending" as const,
        });
      }
    }
  }

  const summary: QuestionBatchResultSummaryV1 = {
    version: 1,
    allowDuplicates: d.allowDuplicates,
    settings,
    items,
  };

  const model = getOpenAiChatModel();
  const job = await prisma.aiGenerationJob.create({
    data: {
      tool: ADMIN_QUESTION_BATCH_JOB_TOOL,
      status: JobStatus.RUNNING,
      model,
      sourcePrompt: `Batch question generation: ${topics.length} topics × ${variationsPerTopic} variations (${d.examFamily}, ${d.country}, ${d.tier})`,
      inputPayload: {
        ...d,
        topics,
        settings,
        ...(d.idempotencyKey ? { idempotencyKey: d.idempotencyKey } : {}),
        ...(d.batchControl ? { batchControl: d.batchControl } : {}),
      } as object,
      resultSummary: summary as object,
      createdById: gate.admin.userId,
    },
  });

  await prisma.aiGenerationLog.create({
    data: { jobId: job.id, step: "question_batch_created", detail: { topicCount: topics.length } },
  });

  return NextResponse.json({ ok: true, jobId: job.id, summary });
}
