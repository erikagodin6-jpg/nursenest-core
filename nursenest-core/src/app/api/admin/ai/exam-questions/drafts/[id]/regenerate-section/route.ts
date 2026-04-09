import { DraftReviewStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import {
  buildRegenerateSectionMessages,
  mergeQuestionPayload,
  parseJsonObjectFromModel,
  payloadRecordFromNormalized,
  type RegenerateSection,
} from "@/lib/ai/admin-ai-question-pipeline";
import { isAdminAiGenerationEnabled } from "@/lib/ai/admin-ai-policy";
import { checkAdminAiGenerateLimit } from "@/lib/ai/admin-rate-limit";
import { openAiChatCompletion } from "@/lib/ai/openai-chat-completions";
import { assertOpenAiKeyConfigured } from "@/lib/ai/openai-env";
import {
  normalizeAiQuestionItem,
  validateNormalizedQuestion,
  type NormalizedQuestionDraft,
} from "@/lib/content/ai-draft-validation";
import { stemHash } from "@/lib/content/stem-hash";
import { prisma } from "@/lib/db";

const bodySchema = z.object({
  section: z.enum([
    "stem",
    "options",
    "rationale",
    "wrong_rationales",
    "lesson_links",
    "metadata",
  ]) as z.ZodType<RegenerateSection>,
});

type Props = { params: Promise<{ id: string }> };

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

  const { id } = await ctx.params;
  const parsed = bodySchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
  }

  const draft = await prisma.generatedQuestionDraft.findUnique({ where: { id } });
  if (!draft) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (draft.reviewStatus === DraftReviewStatus.PROMOTED) {
    return NextResponse.json({ error: "Cannot regenerate a promoted draft" }, { status: 400 });
  }

  const currentNorm = draft.normalizedJson as unknown as NormalizedQuestionDraft | null;
  if (!currentNorm?.stem) {
    return NextResponse.json({ error: "Draft has no normalized content to regenerate from" }, { status: 400 });
  }

  const basePayload =
    draft.payloadJson && typeof draft.payloadJson === "object" && !Array.isArray(draft.payloadJson)
      ? ({ ...(draft.payloadJson as Record<string, unknown>) } as Record<string, unknown>)
      : payloadRecordFromNormalized(currentNorm);

  const section = parsed.data.section;
  const { system, user } = buildRegenerateSectionMessages({
    section,
    currentItemJson: JSON.stringify(basePayload, null, 2),
    contextSummary: `Exam: ${draft.examFamily}, Country: ${draft.country}, Tier: ${draft.tier}. Keep pathway/exam alignment.`,
  });

  try {
    const response = await openAiChatCompletion({
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.65,
      maxTokens: 2500,
    });

    const raw = response.content?.trim() ?? "{}";
    let partial: Record<string, unknown>;
    try {
      partial = parseJsonObjectFromModel(raw);
    } catch {
      return NextResponse.json({ error: "Model returned invalid JSON for section" }, { status: 502 });
    }

    const mergedPayload = mergeQuestionPayload(basePayload, section, partial);
    const normResult = normalizeAiQuestionItem(mergedPayload);
    if (!normResult.ok) {
      return NextResponse.json(
        { error: "Regenerated content failed validation", detail: normResult.error, partial },
        { status: 422 },
      );
    }

    const metaMerged = {
      ...(currentNorm.metadata ?? {}),
      ...(normResult.value.metadata ?? {}),
    };
    const mergedNorm: NormalizedQuestionDraft = {
      ...normResult.value,
      metadata: Object.keys(metaMerged).length > 0 ? metaMerged : undefined,
    };

    const dupSet = new Set<string>();
    const v = validateNormalizedQuestion(mergedNorm, { duplicateStemHashes: dupSet });
    const sh = stemHash(mergedNorm.stem);

    const [existingQ, existingDraft] = await Promise.all([
      prisma.examQuestion.findFirst({ where: { stemHash: sh }, select: { id: true } }),
      prisma.generatedQuestionDraft.findFirst({
        where: {
          stemHash: sh,
          id: { not: id },
          reviewStatus: { in: [DraftReviewStatus.PENDING_REVIEW, DraftReviewStatus.APPROVED] },
        },
        select: { id: true },
      }),
    ]);

    const warnings = [...v.warnings];
    if (existingQ) warnings.push("Stem hash matches an existing Question in the bank.");
    if (existingDraft) warnings.push("Stem hash matches another pending/approved draft.");
    const duplicateRisk = Boolean(existingQ || existingDraft);

    const validationJson = {
      ok: v.ok,
      errors: v.errors,
      warnings,
      duplicateRisk,
    };

    await prisma.generatedQuestionDraft.update({
      where: { id },
      data: {
        payloadJson: mergedPayload as object,
        normalizedJson: mergedNorm as object,
        validationJson,
        stemHash: sh,
        stemPreview: mergedNorm.stem.slice(0, 280),
        reviewStatus: DraftReviewStatus.PENDING_REVIEW,
        reviewedById: null,
        reviewedAt: null,
        reviewNotes: `Section regenerated: ${section}`,
      },
    });

    return NextResponse.json({
      ok: true,
      draftId: id,
      section,
      tokensUsed: response.totalTokens,
      validation: validationJson,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Regeneration failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
