import { DraftReviewStatus, JobStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import {
  buildExamQuestionSystemPrompt,
  buildExamQuestionUserPrompt,
  ADMIN_AI_QUESTION_TOOL,
  parseJsonArrayFromModel,
  type LessonHintRow,
} from "@/lib/ai/admin-ai-question-pipeline";
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
  withQuestionDraftContext,
} from "@/lib/content/ai-draft-validation";
import { stemHash } from "@/lib/content/stem-hash";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const maxDuration = 120;

const bodySchema = z.object({
  tier: z.enum(["free", "rpn", "rn", "np"]),
  topic: z.string().trim().min(1).max(500),
  quantity: z.coerce.number().int().min(1).max(15),
  questionTypes: z.array(z.string().max(80)).max(20).optional(),
  country: z.enum(["CA", "US"]).default("CA"),
  examFamily: z.enum(["NCLEX_RN", "NCLEX_PN", "REX_PN", "NP", "ALLIED", "GENERIC"]).default("GENERIC"),
  lessonId: z.string().optional(),
  categoryId: z.string().optional(),
  /** Human pathway label (FNP, Med-Surg RN, etc.) — steers tone and scope */
  pathway: z.string().trim().max(120).optional(),
  difficulty: z.enum(["FOUNDATION", "INTERMEDIATE", "ADVANCED"]).default("INTERMEDIATE"),
  questionTypeMode: z.enum(["auto", "mcq", "sata"]).default("auto"),
  /** Optional lesson ContentItem ids to anchor lessonLinkSuggestions */
  lessonTargets: z.array(z.string().min(5)).max(20).optional(),
});

const TOOL = ADMIN_AI_QUESTION_TOOL;

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

  const {
    tier,
    topic,
    quantity,
    questionTypes,
    country,
    examFamily,
    lessonId,
    categoryId,
    pathway,
    difficulty,
    questionTypeMode,
    lessonTargets,
  } = parsed.data;

  const styleHints =
    questionTypes?.length && questionTypeMode === "auto"
      ? questionTypes
      : questionTypes?.length
        ? questionTypes
        : questionTypeMode === "auto"
          ? ["prioritization", "pharmacology", "lab-values", "clinical judgment"]
          : [];

  let categoryLabel: string | undefined;
  if (categoryId?.trim()) {
    const cat = await prisma.category.findUnique({
      where: { id: categoryId.trim() },
      select: { name: true, slug: true },
    });
    if (cat) categoryLabel = `${cat.name} (${cat.slug})`;
  }

  let lessonHints: LessonHintRow[] = [];
  const targetIds = [...new Set((lessonTargets ?? []).map((x) => x.trim()).filter(Boolean))];
  if (targetIds.length > 0) {
    const rows = await prisma.contentItem.findMany({
      where: { id: { in: targetIds }, type: "lesson" },
      select: { id: true, title: true, slug: true },
    });
    lessonHints = rows.map((r) => ({ id: r.id, title: r.title, slug: r.slug }));
  }

  const pathwayLabel =
    pathway?.trim() ||
    (tier === "np" ? "NP / advanced practice" : tier === "rpn" ? "RPN/LPN" : tier === "rn" ? "RN" : "RN");

  const genCtx = {
    topic,
    quantity,
    tier,
    pathwayLabel,
    country,
    examFamily,
    difficulty,
    categoryLabel,
    questionTypeMode,
    questionStyleHints: styleHints,
    lessonHints,
  };

  const sourcePrompt = `${buildExamQuestionUserPrompt(genCtx)}\n\n[system spec: exam-style items with rationales + lesson links]`;
  const batchId = `q-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

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
    const userPrompt = `${buildExamQuestionUserPrompt(genCtx)}\n\nReturn ONLY a JSON array, no markdown.`;

    const response = await openAiChatCompletion({
      messages: [
        { role: "system", content: buildExamQuestionSystemPrompt() },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.72,
      maxTokens: 8000,
    });

    const raw = response.content?.trim() ?? "[]";
    let items: unknown[] = [];
    try {
      items = parseJsonArrayFromModel(raw);
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

    const examContextLabel = `${examFamily} · ${country}`;

    for (const item of items) {
      const normBase = normalizeAiQuestionItem(item);
      const payloadJson = item as object;
      if (!normBase.ok) {
        await prisma.generatedQuestionDraft.create({
          data: {
            jobId: job.id,
            tool: TOOL,
            batchId,
            payloadJson,
            validationJson: { ok: false, errors: [normBase.error], warnings: [], duplicateRisk: false },
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

      const norm = withQuestionDraftContext(normBase.value, { pathwayLabel, examContextLabel });

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
          jobId: job.id,
          tool: TOOL,
          batchId,
          payloadJson,
          normalizedJson: norm as object,
          validationJson,
          reviewStatus: DraftReviewStatus.PENDING_REVIEW,
          stemHash: sh,
          stemPreview: norm.stem.slice(0, 280),
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
