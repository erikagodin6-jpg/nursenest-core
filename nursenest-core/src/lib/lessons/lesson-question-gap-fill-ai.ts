/**
 * Optional AI backfill: create {@link GeneratedQuestionDraft} rows for lessons still below the
 * related-question minimum (nothing published automatically). Requires OpenAI + automation admin user.
 */
import { DraftReviewStatus, JobStatus, UserRole } from "@prisma/client";
import {
  ADMIN_AI_QUESTION_TOOL,
  buildExamQuestionSystemPrompt,
  buildExamQuestionUserPrompt,
  parseJsonArrayFromModel,
  type QuestionGenerationContext,
} from "@/lib/ai/admin-ai-question-pipeline";
import { assertOpenAiKeyConfigured } from "@/lib/ai/openai-env";
import { openAiChatCompletion } from "@/lib/ai/openai-chat-completions";
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
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import {
  countRelatedExamQuestionsForPathwayLesson,
  RELATED_EXAM_QUESTIONS_IDEAL_MIN,
  RELATED_EXAM_QUESTIONS_MIN_TARGET,
} from "@/lib/lessons/lesson-question-cross-links";
import type { LessonQuestionLinkCoverageRow } from "@/lib/lessons/lesson-question-link-coverage-core";

const TOOL = ADMIN_AI_QUESTION_TOOL;

function pathwayToAiTier(pathway: ExamPathwayDefinition): "rpn" | "rn" | "np" {
  switch (pathway.stripeTier) {
    case "NP":
      return "np";
    case "RN":
      return "rn";
    default:
      return "rpn";
  }
}

function pathwayToApiCountry(pathway: ExamPathwayDefinition): "CA" | "US" {
  return pathway.countryCode === "US" ? "US" : "CA";
}

function pathwayToExamFamilyKey(pathway: ExamPathwayDefinition): string {
  return String(pathway.examFamily);
}

export async function resolveAutomationAdminUserId(): Promise<string | null> {
  const envId = process.env.LESSON_GAP_FILL_ADMIN_USER_ID?.trim();
  if (envId) return envId;
  const u = await prisma.user.findFirst({
    where: { role: { in: [UserRole.SUPER_ADMIN, UserRole.CONTENT_ADMIN, UserRole.ADMIN] } },
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });
  return u?.id ?? null;
}

/**
 * For each gap row (below min), generate drafts with topic = lesson topic; quantity scales toward ideal band.
 */
export async function runLessonGapAiDrafts(options: {
  gaps: LessonQuestionLinkCoverageRow[];
  adminUserId: string;
  /** Max lessons to call the model for */
  maxLessons: number;
  /** Pause ms between OpenAI calls */
  delayMs?: number;
}): Promise<{
  jobs: Array<{ pathwayId: string; slug: string; jobId: string; draftCount: number; quantity: number; error?: string }>;
}> {
  const key = assertOpenAiKeyConfigured();
  if (!key.ok) {
    throw new Error(key.message);
  }

  const delayMs = options.delayMs ?? 1500;
  const jobs: Array<{
    pathwayId: string;
    slug: string;
    jobId: string;
    draftCount: number;
    quantity: number;
    error?: string;
  }> = [];

  const sorted = [...options.gaps]
    .filter((g) => g.relatedQuestionCount < RELATED_EXAM_QUESTIONS_MIN_TARGET)
    .sort((a, b) => a.relatedQuestionCount - b.relatedQuestionCount);

  let used = 0;
  for (const row of sorted) {
    if (used >= options.maxLessons) break;
    used += 1;

    const pathway = getExamPathwayById(row.pathwayId);
    if (!pathway) {
      jobs.push({
        pathwayId: row.pathwayId,
        slug: row.slug,
        jobId: "",
        draftCount: 0,
        quantity: 0,
        error: "unknown_pathway",
      });
      continue;
    }

    const liveCount = await countRelatedExamQuestionsForPathwayLesson({
      pathway,
      lessonTitle: row.title,
      lessonTopic: row.topic,
      lessonTopicSlug: row.topicSlug,
      bodySystem: row.bodySystem,
      lessonSlug: row.slug,
    });

    if (liveCount >= RELATED_EXAM_QUESTIONS_MIN_TARGET) {
      jobs.push({
        pathwayId: row.pathwayId,
        slug: row.slug,
        jobId: "",
        draftCount: 0,
        quantity: 0,
        error: "already_at_min_after_rescan",
      });
      continue;
    }

    const quantity = Math.max(
      1,
      Math.min(
        12,
        Math.max(RELATED_EXAM_QUESTIONS_MIN_TARGET - liveCount, RELATED_EXAM_QUESTIONS_IDEAL_MIN - liveCount),
      ),
    );

    const tier = pathwayToAiTier(pathway);
    const country = pathwayToApiCountry(pathway);
    const examFamily = pathwayToExamFamilyKey(pathway);

    const genCtx: QuestionGenerationContext = {
      topic: `${row.topic} — align to lesson “${row.title}” (body system: ${row.bodySystem})`,
      quantity,
      tier,
      pathwayLabel: pathway.displayName,
      country,
      examFamily,
      difficulty: "INTERMEDIATE",
      questionTypeMode: "auto",
      questionStyleHints: ["clinical judgment", "safety", "prioritization"],
      lessonHints: [],
    };

    const sourcePrompt = `${buildExamQuestionUserPrompt(genCtx)}\n\n[lesson gap fill: require topic/subtopic tags to include "${row.topicSlug}" and "${row.bodySystem}"]`;
    const batchId = `gap-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const job = await prisma.aiGenerationJob.create({
      data: {
        tool: TOOL,
        status: JobStatus.RUNNING,
        model: process.env.AI_OPENAI_MODEL ?? process.env.AI_ADMIN_MODEL ?? "gpt-4o-mini",
        sourcePrompt,
        inputPayload: { pathwayId: row.pathwayId, lessonSlug: row.slug, quantity } as object,
        createdById: options.adminUserId,
      },
    });

    try {
      const userPrompt = `${buildExamQuestionUserPrompt(genCtx)}\n\nReturn ONLY a JSON array, no markdown. Each item tags must include "${row.topicSlug}".`;

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
        jobs.push({
          pathwayId: row.pathwayId,
          slug: row.slug,
          jobId: job.id,
          draftCount: 0,
          quantity,
          error: "invalid_json",
        });
        await sleep(delayMs);
        continue;
      }

      const tierCode = tierFromApi(tier);
      const cc = countryFromApi(country);
      const ef = examFamilyFromApi(examFamily);
      const dupSet = new Set<string>();
      let draftCount = 0;
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
              lessonId: null,
              categoryId: null,
              sourcePrompt,
              model: job.model ?? "unknown",
              createdById: options.adminUserId,
              stemPreview: "(normalize failed)",
            },
          });
          continue;
        }

        const norm = withQuestionDraftContext(normBase.value, { pathwayLabel: pathway.displayName, examContextLabel });
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
        const duplicateRisk = v.duplicateRisk || Boolean(existingQ || existingDraft);

        await prisma.generatedQuestionDraft.create({
          data: {
            jobId: job.id,
            tool: TOOL,
            batchId,
            payloadJson,
            normalizedJson: norm as object,
            validationJson: {
              ok: v.ok,
              errors: v.errors,
              warnings,
              duplicateRisk,
            },
            reviewStatus: DraftReviewStatus.PENDING_REVIEW,
            stemHash: sh,
            stemPreview: norm.stem.slice(0, 280),
            lessonId: null,
            categoryId: null,
            examFamily: ef,
            tier: tierCode,
            country: cc,
            sourcePrompt,
            model: job.model ?? "unknown",
            createdById: options.adminUserId,
          },
        });
        draftCount += 1;
      }

      await prisma.aiGenerationJob.update({
        where: { id: job.id },
        data: {
          status: JobStatus.COMPLETED,
          tokensUsed: response.totalTokens,
          resultSummary: { batchId, draftCount, itemCount: items.length, pathwayId: row.pathwayId, slug: row.slug },
          error: null,
        },
      });

      jobs.push({ pathwayId: row.pathwayId, slug: row.slug, jobId: job.id, draftCount, quantity });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      await prisma.aiGenerationJob.update({
        where: { id: job.id },
        data: { status: JobStatus.FAILED, error: msg },
      });
      jobs.push({ pathwayId: row.pathwayId, slug: row.slug, jobId: job.id, draftCount: 0, quantity, error: msg });
    }

    await sleep(delayMs);
  }

  return { jobs };
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
