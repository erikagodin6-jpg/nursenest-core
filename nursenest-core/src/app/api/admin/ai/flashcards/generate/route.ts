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
  normalizeAiFlashcardItem,
  tierFromApi,
  validateNormalizedFlashcard,
} from "@/lib/content/ai-draft-validation";
import { prisma } from "@/lib/db";

const bodySchema = z.object({
  topic: z.string().trim().min(1).max(500),
  quantity: z.coerce.number().int().min(1).max(15),
  tier: z.enum(["free", "rpn", "rn", "np"]).default("rn"),
  deckTitle: z.string().max(200).optional(),
  country: z.enum(["CA", "US"]).default("CA"),
  examFamily: z.enum(["NCLEX_RN", "NCLEX_PN", "REX_PN", "NP", "ALLIED", "GENERIC"]).default("GENERIC"),
  lessonId: z.string().optional(),
  categoryId: z.string().optional(),
});

const TOOL = "FLASHCARD_BATCH";

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

  const { topic, quantity, tier, deckTitle, country, examFamily, lessonId, categoryId } = parsed.data;
  const batchId = `fc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const sourcePrompt = `Generate ${quantity} nursing flashcards for "${topic}" (${deckTitle ?? topic}). Tier ${tier}. JSON array only: front, back, tags, difficulty.`;

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

  try {
    const response = await openAiChatCompletion({
      messages: [
        {
          role: "system",
          content: "You are a nursing education expert. Output JSON array only.",
        },
        { role: "user", content: `${sourcePrompt}\nReturn ONLY JSON array.` },
      ],
      temperature: 0.7,
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
    const draftIds: string[] = [];

    for (const item of items) {
      const norm = normalizeAiFlashcardItem(item);
      const payloadJson = item as object;
      if (!norm.ok) {
        await prisma.generatedFlashcardDraft.create({
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
            frontPreview: "(normalize failed)",
          },
        });
        continue;
      }

      const v = validateNormalizedFlashcard(norm.value);
      const draft = await prisma.generatedFlashcardDraft.create({
        data: {
          jobId: job.id,
          tool: TOOL,
          batchId,
          payloadJson,
          normalizedJson: norm.value as object,
          validationJson: { ok: v.ok, errors: v.errors, warnings: v.warnings, duplicateRisk: false },
          reviewStatus: DraftReviewStatus.PENDING_REVIEW,
          frontPreview: norm.value.front.slice(0, 200),
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
      },
    });

    await prisma.aiGenerationLog.create({
      data: { jobId: job.id, step: "complete", detail: { draftIds, batchId } },
    });

    return NextResponse.json({
      jobId: job.id,
      batchId,
      draftIds,
      tokensUsed: response.totalTokens,
      message: "Flashcard drafts stored for review. Nothing was published to the flashcard bank.",
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
