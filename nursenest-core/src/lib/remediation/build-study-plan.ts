import type { PrismaClient } from "@prisma/client";
import { resolveRemediationContentLinks } from "@/lib/remediation/remediation-links";

export type StudyPlanItemJson = {
  id: string;
  pathwayId: string | null;
  topic: string | null;
  bodySystem: string | null;
  priorityScore: number;
  nextReviewAt: string;
  mistakeCount: number;
  lessonHref: string | null;
  flashcardsHref: string | null;
  practiceQuestionsHref: string | null;
  retestQuestionsHref: string | null;
};

export type StudyPlanResponse = {
  enabled: boolean;
  asOf: string;
  remediationDue: StudyPlanItemJson[];
  recommendedLessons: { href: string | null; title: string | null }[];
  recommendedFlashcards: { href: string | null }[];
  recommendedPractice: { href: string | null }[];
};

/**
 * Due = not resolved and nextReviewAt <= endOfToday (UTC).
 */
export async function buildStudyPlanForUser(prisma: PrismaClient, userId: string): Promise<StudyPlanResponse> {
  const asOf = new Date();
  const endOfUtcDay = new Date(Date.UTC(asOf.getUTCFullYear(), asOf.getUTCMonth(), asOf.getUTCDate(), 23, 59, 59, 999));

  const rows = await prisma.userRemediationQueue.findMany({
    where: {
      userId,
      resolved: false,
      nextReviewAt: { lte: endOfUtcDay },
    },
    orderBy: [{ priorityScore: "desc" }, { nextReviewAt: "asc" }],
    take: 25,
    select: {
      id: true,
      pathwayId: true,
      topic: true,
      bodySystem: true,
      priorityScore: true,
      nextReviewAt: true,
      mistakeCount: true,
    },
  });

  const remediationDue: StudyPlanItemJson[] = [];
  const lessonSet = new Map<string, { href: string | null; title: string | null }>();
  const flashSet = new Map<string, { href: string | null }>();
  const practiceSet = new Map<string, { href: string | null }>();

  for (const row of rows) {
    const links = await resolveRemediationContentLinks(prisma, {
      pathwayId: row.pathwayId,
      topic: row.topic,
      subtopic: null,
      bodySystem: row.bodySystem,
      tags: [],
    });

    const retestQs = new URLSearchParams();
    retestQs.set("preset", "topic_drill");
    if (row.pathwayId) retestQs.set("pathwayId", row.pathwayId);
    if (row.topic) retestQs.set("topic", row.topic);
    if (links.topicCode) retestQs.set("topicCode", links.topicCode);
    retestQs.set("sessionSize", "5");
    const retestQuestionsHref =
      retestQs.has("topic") || retestQs.has("topicCode")
        ? `/app/questions?${retestQs.toString()}`
        : links.practiceQuestionsHref;

    remediationDue.push({
      id: row.id,
      pathwayId: row.pathwayId,
      topic: row.topic,
      bodySystem: row.bodySystem,
      priorityScore: row.priorityScore,
      nextReviewAt: row.nextReviewAt.toISOString(),
      mistakeCount: row.mistakeCount,
      lessonHref: links.lessonHref,
      flashcardsHref: links.flashcardsHref,
      practiceQuestionsHref: links.practiceQuestionsHref,
      retestQuestionsHref,
    });

    if (links.lessonHref) lessonSet.set(links.lessonHref, { href: links.lessonHref, title: row.topic });
    if (links.flashcardsHref) flashSet.set(links.flashcardsHref, { href: links.flashcardsHref });
    if (links.practiceQuestionsHref) practiceSet.set(links.practiceQuestionsHref, { href: links.practiceQuestionsHref });
  }

  return {
    enabled: true,
    asOf: asOf.toISOString(),
    remediationDue: remediationDue.slice(0, 10),
    recommendedLessons: [...lessonSet.values()].slice(0, 8),
    recommendedFlashcards: [...flashSet.values()].slice(0, 8),
    recommendedPractice: [...practiceSet.values()].slice(0, 8),
  };
}
