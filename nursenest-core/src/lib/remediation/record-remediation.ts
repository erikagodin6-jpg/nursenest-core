import type { PrismaClient } from "@prisma/client";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { normalizeTopicKey } from "@/lib/learner/topic-normalize";
import { inferRemediationMistakeType } from "@/lib/remediation/infer-mistake-type";
import { isRemediationEngineEnabled } from "@/lib/remediation/remediation-flag";
import { computeRemediationScore, spacedReviewDays } from "@/lib/remediation/remediation-scoring";
import {
  resolveCanonicalTopicId,
  isPrescribingSafetyTopic,
  topicDangerLevel,
} from "@/lib/remediation/topic-taxonomy";

export type RemediationCaptureReason = "incorrect" | "low_confidence_correct";

/**
 * Which study surface fired this remediation capture.
 * Used for analytics segmentation — never changes scoring weights.
 */
export type RemediationSource =
  | "practice_incorrect"
  | "ecg_miss"
  | "cat_miss"
  | "practice_miss"
  | "flashcard_again"
  | "manual";

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
  /** Time the learner spent on the question before submitting (ms). */
  dwellTimeMs?: number | null;
  /** True when this is a SATA item. */
  isSata?: boolean;
  /** True when SATA learner selected some but not all correct options. */
  sataPartialCredit?: boolean;
  /** Caller-supplied override: this miss involves a prescribing-safety topic. */
  prescribingSafetyMissOverride?: boolean;
  /** Aggregated lapse count for this topic from FlashcardProgress. */
  lapseCount?: number;
  /** Which study surface fired this capture — for analytics only. */
  remediationSource?: RemediationSource;
};

function slotKeys(pathwayId: string | null, topic: string | null, bodySystem: string | null) {
  const pathwayKey = (pathwayId ?? "").trim().slice(0, 64);
  const topicKey = normalizeTopicKey(topic ?? "").trim().slice(0, 200);
  const bodySystemKey = (bodySystem ?? "").trim().toLowerCase().slice(0, 128);
  return { pathwayKey, topicKey, bodySystemKey };
}

/**
 * Persists remediation event + upserts queue row with multi-dimensional scoring.
 * Swallows errors — never throws to callers.
 */
export async function recordRemediationCapture(
  prisma: PrismaClient,
  input: RemediationCaptureInput,
): Promise<void> {
  if (!isRemediationEngineEnabled()) return;
  if (input.reason === "low_confidence_correct" && input.confidence !== "low") return;

  const { pathwayKey, topicKey, bodySystemKey } = slotKeys(
    input.pathwayId,
    input.topic,
    input.bodySystem,
  );

  const mistakeType = inferRemediationMistakeType({
    tags: input.tags,
    nclexClientNeedsCategory: input.nclexClientNeedsCategory,
    nclexClientNeedsSubcategory: input.nclexClientNeedsSubcategory,
    questionType: input.questionType,
  });

  const canonicalTopicId = resolveCanonicalTopicId(input.topic);
  const prescribingSafetyMiss =
    input.prescribingSafetyMissOverride === true || isPrescribingSafetyTopic(input.topic);

  const examMeta =
    input.exam != null || input.difficulty != null
      ? { exam: input.exam, difficulty: input.difficulty }
      : undefined;

  try {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 86_400_000);
    const dayAgo = new Date(now.getTime() - 86_400_000);

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

      const [recentWeek, recent24h, existing] = await Promise.all([
        tx.userRemediationEvent.count({
          where: {
            userId: input.userId,
            topic: input.topic ?? undefined,
            createdAt: { gte: weekAgo },
          },
        }),
        tx.userRemediationEvent.count({
          where: {
            userId: input.userId,
            pathwayId: input.pathwayId,
            topic: input.topic ?? undefined,
            bodySystem: input.bodySystem ?? undefined,
            createdAt: { gte: dayAgo },
          },
        }),
        tx.userRemediationQueue.findUnique({
          where: {
            userId_pathwayKey_topicKey_bodySystemKey: {
              userId: input.userId,
              pathwayKey,
              topicKey,
              bodySystemKey,
            },
          },
        }),
      ]);

      const priorMistakeCount = existing?.mistakeCount ?? 0;
      const scoreBreakdown = computeRemediationScore({
        recent24h,
        recentWeek7d: recentWeek,
        catDifficultyHint: input.catDifficultyHint,
        priorMistakeCount,
        confidence: input.confidence,
        dwellTimeMs: input.dwellTimeMs ?? undefined,
        isSata: input.isSata,
        sataPartialCredit: input.sataPartialCredit,
        topic: input.topic,
        prescribingSafetyMissOverride: prescribingSafetyMiss,
      });

      const mistakeCount = priorMistakeCount + 1;
      const priorityScore = scoreBreakdown.total;
      const days = spacedReviewDays(mistakeCount);
      const nextReviewAt = new Date(now.getTime() + days * 86_400_000);

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

      // ── Analytics payload ─────────────────────────────────────────────────
      // PHI exclusions: no question stem, answer text, rationale, or raw topic
      // strings. Only normalized keys and structured signals are logged.
      // queueRank is computed at resurfacing time (buildResurfacingQueue).
      const dangerLevel = topicDangerLevel(input.topic);
      const readinessImpactTier =
        prescribingSafetyMiss || dangerLevel === "critical"
          ? "critical"
          : dangerLevel === "high"
            ? "high"
            : "standard";

      safeServerLog("remediation", "REMEDIATION_QUEUE_UPDATED", {
        userId: input.userId,
        pathwayKey,
        topicKey,               // normalized, not raw topic string
        bodySystemKey,          // normalized, not raw
        canonicalTopicId,       // null when outside CNPLE taxonomy
        prescribingSafetyMiss,
        totalScore: scoreBreakdown.total,
        scoreBreakdownJson: JSON.stringify(scoreBreakdown), // per-component for PostHog ingestion
        mistakeCount,
        isSata: input.isSata ?? false,
        sataPartialCredit: input.sataPartialCredit ?? false,
        aggregatedLapseCount: input.lapseCount ?? 0,
        topicAliasResolved: canonicalTopicId !== null,
        remediationSource: input.remediationSource ?? "manual",
        readinessImpactTier,
        // queueRank: set at resurfacing time in buildResurfacingQueue
      });
    });

    safeServerLog("remediation", "REMEDIATION_EVENT_CREATED", {
      userId: input.userId,
      questionId: input.questionId,
      mistakeType,
      reason: input.reason,
      pathwayKey,
      topicKey,
    });
  } catch (e) {
    safeServerLog("remediation", "REMEDIATION_CAPTURE_FAILED", {
      userId: input.userId,
      questionId: input.questionId,
      message: e instanceof Error ? e.message : String(e),
    });
  }
}
