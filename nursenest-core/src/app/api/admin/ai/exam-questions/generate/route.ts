import { DraftReviewStatus, JobStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { isAdminAiGenerationEnabled } from "@/lib/ai/admin-ai-policy";
import { checkAdminAiGenerateLimit } from "@/lib/ai/admin-rate-limit";
import { openAiChatCompletion } from "@/lib/ai/openai-chat-completions";
import { assertOpenAiKeyConfigured } from "@/lib/ai/openai-env";
import {
  countryFromApi,
  examFamilyFromApi,
  normalizeAiQuestionItem,
  tierFromApi,
  validateNormalizedQuestion,
} from "@/lib/content/ai-draft-validation";
import { stemHash } from "@/lib/content/stem-hash";
import { prisma } from "@/lib/db";

const bodySchema = z.object({
  tier: z.enum(["free", "rpn", "rn", "np"]),
  topic: z.string().trim().min(1).max(500),
  quantity: z.coerce.number().int().min(1).max(15),
  questionTypes: z.array(z.string().max(80)).max(20).optional(),
  country: z.enum(["CA", "US"]).default("CA"),
  examFamily: z.enum(["NCLEX_RN", "NCLEX_PN", "REX_PN", "NP", "ALLIED", "GENERIC"]).default("GENERIC"),
  lessonId: z.string().optional(),
  categoryId: z.string().optional(),
});

const TOOL = "EXAM_QUESTION_BATCH";

export async function POST(req: Request) {
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

  const parsed = bodySchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
  }

  const { tier, topic, quantity, questionTypes, country, examFamily, lessonId, categoryId } = parsed.data;
  const types = questionTypes?.length
    ? questionTypes
    : ["mcq", "sata", "prioritization", "pharmacology", "lab-values"];

  const batchId = `q-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const sourcePrompt = `Generate ${quantity} nursing exam questions for "${topic}" at ${tier.toUpperCase()} level. Mix types: ${types.join(", ")}. JSON array fields per item: question, type, options (4 strings), correctIndex, rationale, difficulty, tags.`;

  const job = await prisma.aiGenerationJob.create({
    data: {
      tool: TOOL,
      status: JobStatus.RUNNING,
      model: process.env.AI_OPENAI_MODEL ?? process.env.AI_ADMIN_MODEL ?? "gpt-4o-mini",
      sourcePrompt,
      inputPayload: parsed.data as object,
      createdById: gate.admin.userId,
    },
  });

  await prisma.aiGenerationLog.create({
    data: { jobId: job.id, step: "start", detail: { batchId } },
  });

  try {
    const prompt = `${sourcePrompt}
Return ONLY a JSON array, no markdown.`;

    const response = await openAiChatCompletion({
      messages: [
        {
          role: "system",
          content:
            "You are a nursing exam question writer. Output valid JSON array only. Each item must include rationale and four options.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.75,
      maxTokens: 4000,
    });

    const raw = response.content?.trim() ?? "[]";
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    let items: unknown[] = [];
    try {
      const parsedJson = JSON.parse(cleaned);
      items = Array.isArray(parsedJson) ? parsedJson : [];
    } catch {
      await prisma.aiGenerationJob.update({
        where: { id: job.id },
        data: { status: JobStatus.FAILED, error: "Invalid JSON from model", tokensUsed: response.totalTokens },
      });
      return NextResponse.json({ error: "Failed to parse AI response as JSON", jobId: job.id }, { status: 502 });
    }

    const tierCode = tierFromApi(tier);
    const cc = countryFromApi(country);
    const ef = examFamilyFromApi(examFamily);
    const dupSet = new Set<string>();
    const draftIds: string[] = [];

    for (const item of items) {
      const norm = normalizeAiQuestionItem(item);
      const payloadJson = item as object;
      if (!norm.ok) {
        await prisma.generatedQuestionDraft.create({
          data: {
            jobId: job.id,
            tool: TOOL,
            batchId,
            payloadJson,
            validationJson: { ok: false, errors: [norm.error], warnings: [], duplicateRisk: false },
            reviewStatus: DraftReviewStatus.PENDING_REVIEW,
            tier: tierCode,
            country: cc,
            examFamily: ef,
            lessonId: lessonId ?? null,
            categoryId: categoryId ?? null,
            sourcePrompt,
            model: job.model ?? "unknown",
            createdById: gate.admin.userId,
            stemPreview: "(normalize failed)",
          },
        });
        continue;
      }

      const sh = stemHash(norm.value.stem);
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

      const v = validateNormalizedQuestion(norm.value, { duplicateStemHashes: dupSet });
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
          jobId: job.id,
          tool: TOOL,
          batchId,
          payloadJson,
          normalizedJson: norm.value as object,
          validationJson,
          reviewStatus: DraftReviewStatus.PENDING_REVIEW,
          stemHash: sh,
          stemPreview: norm.value.stem.slice(0, 280),
          lessonId: lessonId ?? null,
          categoryId: categoryId ?? null,
          examFamily: ef,
          tier: tierCode,
          country: cc,
          sourcePrompt,
          model: job.model ?? "unknown",
          createdById: gate.admin.userId,
        },
      });
      draftIds.push(draft.id);
    }

    await prisma.aiGenerationJob.update({
      where: { id: job.id },
      data: {
        status: JobStatus.COMPLETED,
        tokensUsed: response.totalTokens,
        resultSummary: { batchId, draftCount: draftIds.length, itemCount: items.length },
        error: null,
      },
    });

    await prisma.aiGenerationLog.create({
      data: {
        jobId: job.id,
        step: "complete",
        detail: { draftIds, batchId },
      },
    });

    return NextResponse.json({
      jobId: job.id,
      batchId,
      draftIds,
      tokensUsed: response.totalTokens,
      message: "Drafts stored for review. Nothing was published to the question bank.",
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Generation failed";
    await prisma.aiGenerationJob.update({
      where: { id: job.id },
      data: { status: JobStatus.FAILED, error: msg },
    });
    return NextResponse.json({ error: msg, jobId: job.id }, { status: 502 });
  }
}
