import { DraftReviewStatus, JobStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { adminAiGenerationHttpBlock } from "@/lib/ai/admin-ai-policy";
import { checkAdminAiGenerateLimit } from "@/lib/ai/admin-rate-limit";
import {
  ADMIN_AI_ECG_VIDEO_QUESTION_TOOL,
  buildEcgVideoQuestionDraft,
} from "@/lib/ecg-video-quiz/admin-ecg-video-question-draft";
import {
  ECG_VIDEO_QUESTION_FORMAT,
  ECG_VIDEO_SUPPORTED_MIME_TYPES,
  validateEcgVideoQuestionForPublish,
} from "@/lib/ecg-video-quiz/ecg-video-question";
import {
  countryFromApi,
  examFamilyFromApi,
  tierFromApi,
  validateNormalizedQuestion,
} from "@/lib/content/ai-draft-validation";
import { stemHash } from "@/lib/content/stem-hash";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const videoAssetSchema = z.object({
  url: z.string().url().optional(),
  assetId: z.string().min(3).optional(),
  mimeType: z.enum(ECG_VIDEO_SUPPORTED_MIME_TYPES).optional(),
  thumbnailUrl: z.string().url().optional(),
  alt: z.string().trim().min(3).max(500).optional(),
  caption: z.string().trim().max(1000).optional(),
  durationSeconds: z.number().positive().max(180).optional(),
}).refine((value) => Boolean(value.url || value.assetId), "url or assetId is required");

const bodySchema = z.object({
  tier: z.enum(["free", "rpn", "rn", "np"]).default("rn"),
  country: z.enum(["CA", "US"]).default("CA"),
  examFamily: z.enum(["NCLEX_RN", "NCLEX_PN", "REX_PN", "NP", "GENERIC"]).default("GENERIC"),
  level: z.enum(["basic", "advanced"]).default("basic"),
  mode: z.enum(["lesson", "quiz", "drill"]).default("quiz"),
  rhythmCategory: z.string().trim().min(2).max(120),
  stem: z.string().trim().min(10).max(2000),
  options: z.array(z.string().trim().min(1).max(240)).min(2).max(8),
  answerKey: z.array(z.string().trim().min(1).max(240)).min(1).max(8),
  rationale: z.string().trim().min(10).max(5000),
  recognitionClues: z.array(z.string().trim().min(2).max(300)).min(1).max(8),
  videoAsset: videoAssetSchema,
  linkedLesson: z.object({
    pathwayId: z.string().trim().min(2).optional(),
    slug: z.string().trim().min(2).optional(),
    href: z.string().trim().min(2).optional(),
    title: z.string().trim().min(2).optional(),
  }).optional(),
  categoryId: z.string().optional(),
  lessonId: z.string().optional(),
  difficulty: z.enum(["FOUNDATION", "INTERMEDIATE", "ADVANCED"]).default("INTERMEDIATE"),
  tags: z.array(z.string().trim().min(1).max(80)).max(20).optional(),
});

export async function POST(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const aiBlock = adminAiGenerationHttpBlock();
  if (aiBlock) return aiBlock;

  const rl = await checkAdminAiGenerateLimit(gate.admin.userId);
  if (!rl.ok) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again later.", code: "RATE_LIMIT" }, { status: 429 });
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
  }

  const input = parsed.data;
  const sourcePrompt = [
    "ECG video question draft request.",
    `Rhythm/category: ${input.rhythmCategory}`,
    "Admin supplied the video asset and clinical answer fields. Store as draft only; never publish automatically.",
  ].join("\n");

  const job = await prisma.aiGenerationJob.create({
    data: {
      tool: ADMIN_AI_ECG_VIDEO_QUESTION_TOOL,
      status: JobStatus.COMPLETED,
      model: "admin-supplied-draft",
      sourcePrompt,
      inputPayload: input,
      createdById: gate.admin.userId,
    },
  });

  const normalized = buildEcgVideoQuestionDraft({
    stem: input.stem,
    options: input.options,
    answerKey: input.answerKey,
    rationale: input.rationale,
    topicTag: input.rhythmCategory,
    difficultyLabel: input.difficulty,
    level: input.level,
    mode: input.mode,
    tags: input.tags,
    exhibit: {
      kind: ECG_VIDEO_QUESTION_FORMAT,
      asset: input.videoAsset,
      rhythmCategory: input.rhythmCategory,
      recognitionClues: input.recognitionClues,
      linkedLesson: input.linkedLesson,
    },
  });

  const validation = validateNormalizedQuestion(normalized, {
    duplicateStemHashes: new Set(),
    expectedTags: { topic: input.rhythmCategory, tier: input.tier, exam: input.examFamily },
  });
  const publishGate = validateEcgVideoQuestionForPublish({
    stem: normalized.stem,
    rationale: normalized.rationale,
    questionType: normalized.questionType,
    options: normalized.options,
    answerKey: normalized.answerKey,
    questionFormat: ECG_VIDEO_QUESTION_FORMAT,
    level: normalized.metadata?.ecgLevel,
    mode: normalized.metadata?.ecgMode,
    exhibitData: normalized.metadata?.ecgVideo,
    tags: normalized.metadata?.tags,
  });
  const validationJson = {
    ...validation,
    publishReady: publishGate.ok,
    publishBlockers: publishGate.reasons,
    warnings: [...validation.warnings, ...publishGate.warnings],
  };

  const draft = await prisma.generatedQuestionDraft.create({
    data: {
      jobId: job.id,
      tool: ADMIN_AI_ECG_VIDEO_QUESTION_TOOL,
      batchId: `ecg-${Date.now()}`,
      payloadJson: input,
      normalizedJson: normalized,
      validationJson,
      reviewStatus: DraftReviewStatus.PENDING_REVIEW,
      tier: tierFromApi(input.tier),
      country: countryFromApi(input.country),
      examFamily: examFamilyFromApi(input.examFamily),
      lessonId: input.lessonId ?? null,
      categoryId: input.categoryId ?? null,
      sourcePrompt,
      model: "admin-supplied-draft",
      createdById: gate.admin.userId,
      stemHash: stemHash(normalized.stem),
      stemPreview: normalized.stem.slice(0, 240),
    },
  });

  return NextResponse.json(
    {
      ok: true,
      jobId: job.id,
      draftId: draft.id,
      reviewStatus: draft.reviewStatus,
      message: "ECG video question draft created for clinical review. Nothing was published.",
      validation: validationJson,
    },
    { status: 201 },
  );
}
