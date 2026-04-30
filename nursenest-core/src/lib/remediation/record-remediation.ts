import type { PrismaClient } from "@prisma/client";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { normalizeTopicLabel } from "@/lib/learner/weak-topics-from-sessions";
import { inferRemediationMistakeType } from "@/lib/remediation/infer-mistake-type";
import { isRemediationEngineEnabled } from "@/lib/remediation/remediation-flag";

export type RemediationCaptureReason = "incorrect" | "low_confidence_correct";

export type RemediationCaptureInput = {
  userId: string;
  questionId: string;
  reason: RemediationCaptureReason;
  pathwayId: string | null;
  topic: string | null;
  subtopic: string | null;
  bodySystem: string | null;
  exam: string | null;
  difficulty: number | null;
  tags: string[];
  nclexClientNeedsCategory?: string | null;
  nclexClientNeedsSubcategory?: string | null;
  questionType: string | null;
  confidence: "low" | "medium" | "high" | null;
  catDifficultyHint?: number | null;
};

function slotKeys(pathwayId: string | null, topic: string | null, bodySystem: string | null) {
  const pathwayKey = (pathwayId ?? "").trim().slice(0, 64);
  const topicKey = normalizeTopicLabel(topic ?? "").trim().slice(0, 200);
  const bodySystemKey = (bodySystem ?? "").trim().toLowerCase().slice(0, 128);
  return { pathwayKey, topicKey, bodySystemKey };
}

function spacedReviewDays(mistakeCount: number): number {
  const n = Math.max(1, Math.min(mistakeCount, 8));
  return Math.min(32, 2 ** (n - 1));
}

/**
 * Persists remediation event + upserts queue row. Swallows errors (never throws to callers).
 */
export async function recordRemediationCapture(prisma: PrismaClient, input: RemediationCaptureInput): Promise<void> {
  if (!isRemediationEngineEnabled()) return;
  if (input.reason === "low_confidence_correct" && input.confidence !== "low") return;

  const { pathwayKey, topicKey, bodySystemKey } = slotKeys(input.pathwayId, input.topic, input.bodySystem);

  const mistakeType = inferRemediationMistakeType({
    tags: input.tags,
    nclexClientNeedsCategory: input.nclexClientNeedsCategory,
    nclexClientNeedsSubcategory: input.nclexClientNeedsSubcategory,
    questionType: input.questionType,
  });

  const examMeta =
    input.exam != null || input.difficulty != null
      ? { exam: input.exam, difficulty: input.difficulty }
      : undefined;

  try {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 86400000);
    const dayAgo = new Date(now.getTime() - 86400000);

    await prisma.$transaction(async (tx) => {
      await tx.userRemediationEvent.create({
        data: {
          userId: input.userId,
          questionId: input.questionId,
          pathwayId: input.pathwayId,
          topic: input.topic,
          bodySystem: input.bodySystem,
          examMeta: examMeta as object | undefined,
          mistakeType,
          confidence: input.confidence ?? undefined,
          catDifficultyHint: input.catDifficultyHint ?? undefined,
        },
      });

      const recentWeek = await tx.userRemediationEvent.count({
        where: {
          userId: input.userId,
          topic: input.topic ?? undefined,
          createdAt: { gte: weekAgo },
        },
      });

      const recent24h = await tx.userRemediationEvent.count({
        where: {
          userId: input.userId,
          pathwayId: input.pathwayId,
          topic: input.topic ?? undefined,
          bodySystem: input.bodySystem ?? undefined,
          createdAt: { gte: dayAgo },
        },
      });

      const existing = await tx.userRemediationQueue.findUnique({
        where: {
          userId_pathwayKey_topicKey_bodySystemKey: {
            userId: input.userId,
            pathwayKey,
            topicKey,
            bodySystemKey,
          },
        },
      });

      const catBoost = Number.isFinite(input.catDifficultyHint ?? NaN) ? Number(input.catDifficultyHint) * 3 : 0;
      const base = 10 + recent24h * 5 + recentWeek * 2 + catBoost;
      const mistakeCount = (existing?.mistakeCount ?? 0) + 1;
      const priorityScore = base + mistakeCount * 1.5;
      const days = spacedReviewDays(mistakeCount);
      const nextReviewAt = new Date(now.getTime() + days * 86400000);

      if (existing) {
        await tx.userRemediationQueue.update({
          where: { id: existing.id },
          data: {
            pathwayId: input.pathwayId,
            topic: input.topic,
            bodySystem: input.bodySystem,
            priorityScore,
            nextReviewAt,
            mistakeCount,
            resolved: false,
            resolvedAt: null,
            updatedAt: now,
          },
        });
      } else {
        await tx.userRemediationQueue.create({
          data: {
            userId: input.userId,
            pathwayId: input.pathwayId,
            topic: input.topic,
            bodySystem: input.bodySystem,
            pathwayKey,
            topicKey,
            bodySystemKey,
            priorityScore,
            nextReviewAt,
            mistakeCount,
            updatedAt: now,
          },
        });
      }
    });

    safeServerLog("remediation", "REMEDIATION_EVENT_CREATED", {
      userId: input.userId,
      questionId: input.questionId,
      mistakeType,
      reason: input.reason,
      pathwayKey,
      topicKey,
    });
    safeServerLog("remediation", "REMEDIATION_QUEUE_UPDATED", {
      userId: input.userId,
      pathwayKey,
      topicKey,
      bodySystemKey,
    });
  } catch (e) {
    safeServerLog("remediation", "REMEDIATION_CAPTURE_FAILED", {
      userId: input.userId,
      questionId: input.questionId,
      message: e instanceof Error ? e.message : String(e),
    });
  }
}
