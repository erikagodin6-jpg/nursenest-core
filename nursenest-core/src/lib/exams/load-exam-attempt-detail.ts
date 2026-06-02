import "server-only";

import { prisma } from "@/lib/db";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import type { ExamReviewJson } from "@/lib/exams/exam-session-review";
import type { PostTestStudyNextBundle } from "@/lib/learner/adaptive-recommendations";
import { buildPostTestStudyNextFromReview } from "@/lib/learner/post-test-study-next";

export type ExamAttemptDetailPayload = {
  attempt: {
    id: string;
    examId: string;
    score: number;
    total: number;
    createdAt: Date;
    examTitle: string;
  };
  review: ExamReviewJson | null;
  studyNext: PostTestStudyNextBundle | null;
};

/**
 * Subscriber-only attempt detail for API + `/app/exams/attempts/[id]` (same fields as GET /api/exams/attempt/[id]).
 */
export async function loadExamAttemptDetailForSubscriber(
  userId: string,
  entitlement: AccessScope,
  attemptId: string,
): Promise<ExamAttemptDetailPayload | null> {
  if (!userId || !entitlement.hasAccess || !attemptId || attemptId.length < 8) return null;

  const attempt = await prisma.examAttempt.findFirst({
    where: { id: attemptId, userId },
    select: {
      id: true,
      examId: true,
      score: true,
      total: true,
      createdAt: true,
      results: true,
      exam: { select: { title: true } },
    },
  });

  if (!attempt) return null;

  const subscriberRow = await prisma.user.findUnique({
    where: { id: userId },
    select: { learnerPath: true },
  });
  const learnerPath = subscriberRow?.learnerPath ?? null;

  const review =
    attempt.results && typeof attempt.results === "object" && attempt.results !== null
      ? (attempt.results as ExamReviewJson)
      : null;

  let studyNext: PostTestStudyNextBundle | null = null;
  if (review?.items?.length) {
    try {
      studyNext = await buildPostTestStudyNextFromReview(review, entitlement, learnerPath);
    } catch {
      studyNext = null;
    }
  }

  return {
    attempt: {
      id: attempt.id,
      examId: attempt.examId,
      score: attempt.score,
      total: attempt.total,
      createdAt: attempt.createdAt,
      examTitle: attempt.exam.title,
    },
    review,
    studyNext,
  };
}
