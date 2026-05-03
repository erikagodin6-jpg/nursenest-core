import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { buildAppFlashcardsTopicHref, buildAppLessonsReviewLessonHref } from "@/lib/learner/app-study-internal-links";
import type { ContinueStudyCheckpoint } from "@/lib/learner/continue-study-types";
import { normalizeTopicSlugInput } from "@/lib/study/topic-slug-normalize";

export type { ContinueStudyActivityType, ContinueStudyCheckpoint } from "@/lib/learner/continue-study-types";

const SYNTH = /^pathway:([^:]+):(.+)$/;

/**
 * Best-effort “continue where you left off” from existing progress tables (no new storage).
 */
export async function inferContinueStudyFromActivity(
  userId: string,
  pathwayId: string,
): Promise<ContinueStudyCheckpoint | null> {
  if (!userId || !pathwayId.trim() || !isDatabaseUrlConfigured()) return null;
  const pid = pathwayId.trim();
  const prefix = `pathway:${pid}:`;

  let best: ContinueStudyCheckpoint | null = null;
  const consider = (c: ContinueStudyCheckpoint) => {
    if (!best || c.updatedAt.getTime() > best.updatedAt.getTime()) best = c;
  };

  try {
    const [progRows, fcRows, attRows] = await Promise.all([
      prisma.progress.findMany({
        where: { userId, lessonId: { startsWith: prefix } },
        orderBy: { updatedAt: "desc" },
        take: 12,
        select: { lessonId: true, updatedAt: true },
      }),
      prisma.flashcardProgress.findMany({
        where: { userId, flashcard: { deck: { pathwayId: pid } } },
        orderBy: { lastReviewedAt: "desc" },
        take: 12,
        select: {
          lastReviewedAt: true,
          updatedAt: true,
          flashcard: {
            select: {
              category: { select: { slug: true, topicCode: true } },
            },
          },
        },
      }),
      prisma.examQuestionPracticeAnswerAttempt.findMany({
        where: { userId, pathwayId: pid },
        orderBy: { createdAt: "desc" },
        take: 12,
        select: { createdAt: true, question: { select: { topic: true } } },
      }),
    ]);

    for (const p of progRows) {
      const m = SYNTH.exec(p.lessonId);
      if (!m) continue;
      const lessonSlug = m[2]!.trim();
      if (!lessonSlug) continue;
      consider({
        pathwayId: pid,
        topicSlug: null,
        lessonSlug,
        activityType: "lesson",
        updatedAt: p.updatedAt,
        href: buildAppLessonsReviewLessonHref(pid, lessonSlug),
        label: "Continue lesson",
      });
    }

    for (const f of fcRows) {
      const at = f.lastReviewedAt ?? f.updatedAt;
      const cat = f.flashcard.category;
      const topicSlug = normalizeTopicSlugInput(cat.topicCode?.trim() || cat.slug || "");
      consider({
        pathwayId: pid,
        topicSlug: topicSlug || null,
        lessonSlug: null,
        activityType: "flashcards",
        updatedAt: at,
        href: topicSlug ? buildAppFlashcardsTopicHref(pid, topicSlug) : `/app/flashcards?pathwayId=${encodeURIComponent(pid)}`,
        label: "Continue flashcards",
      });
    }

    for (const a of attRows) {
      const topicSlug = normalizeTopicSlugInput(a.question.topic ?? "");
      consider({
        pathwayId: pid,
        topicSlug: topicSlug || null,
        lessonSlug: null,
        activityType: "practice",
        updatedAt: a.createdAt,
        href: topicSlug
          ? `/app/practice-tests?pathwayId=${encodeURIComponent(pid)}&topic=${encodeURIComponent(topicSlug)}`
          : `/app/practice-tests?pathwayId=${encodeURIComponent(pid)}`,
        label: "Continue practice questions",
      });
    }
  } catch {
    return null;
  }

  return best;
}
