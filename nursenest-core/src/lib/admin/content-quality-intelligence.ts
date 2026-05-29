import "server-only";

import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

export type ContentQualityReport = {
  mostMissedFlashcards:    MissedContentItem[];
  mostMissedQuestions:     MissedContentItem[];
  lowestConfidenceTopics:  TopicEngagementItem[];
  highestConfidenceTopics: TopicEngagementItem[];
  potentialIssueFlags:     ContentIssueFlag[];
  generatedAt: string;
};

export type MissedContentItem = {
  id: string;
  topic: string | null;
  subtopic: string | null;
  incorrectCount: number;
  totalAttempts: number;
  incorrectRate: number;
  label: string;
};

export type TopicEngagementItem = {
  topic: string;
  avgCorrectRate: number;  // 0–1
  totalAttempts: number;
};

export type ContentIssueFlag = {
  id: string;
  kind: "flashcard" | "question";
  topic: string | null;
  issue: string;
  severity: "high" | "medium" | "low";
  metric: string;
};

const WINDOW_DAYS = 30;
const MIN_ATTEMPTS = 10;

export async function loadContentQualityReport(): Promise<ContentQualityReport | null> {
  if (!isDatabaseUrlConfigured()) return null;

  const since = new Date(Date.now() - WINDOW_DAYS * 86_400_000);
  const now = new Date();

  // ── Most missed flashcards (via FlashcardMastery aggregate) ──────────────
  const flashcardMasteryData = await prisma.flashcardMastery.groupBy({
    by: ["flashcardId"],
    _sum: { totalAttempts: true, correctCount: true },
    having: { totalAttempts: { _sum: { gte: MIN_ATTEMPTS } } },
    orderBy: { _sum: { correctCount: "asc" } },
    take: 30,
  });

  const flashcardIds = flashcardMasteryData.map((r) => r.flashcardId);
  const flashcardDetails = flashcardIds.length > 0
    ? await prisma.flashcard.findMany({
        where: { id: { in: flashcardIds } },
        select: { id: true, topic: true, subtopic: true },
      })
    : [];
  const flashcardMap = new Map(flashcardDetails.map((f) => [f.id, f]));

  const mostMissedFlashcards: MissedContentItem[] = flashcardMasteryData
    .map((r) => {
      const total = r._sum.totalAttempts ?? 0;
      const correct = r._sum.correctCount ?? 0;
      const incorrectCount = total - correct;
      const f = flashcardMap.get(r.flashcardId);
      return {
        id: r.flashcardId,
        topic: f?.topic ?? null,
        subtopic: f?.subtopic ?? null,
        incorrectCount,
        totalAttempts: total,
        incorrectRate: total > 0 ? incorrectCount / total : 0,
        label: f?.topic ?? r.flashcardId.slice(0, 12),
      };
    })
    .filter((r) => r.incorrectRate > 0.5)
    .sort((a, b) => b.incorrectRate - a.incorrectRate)
    .slice(0, 15);

  // ── Most missed questions (via ExamQuestionPracticeAnswerAttempt) ─────────
  const questionMissData = await prisma.examQuestionPracticeAnswerAttempt.groupBy({
    by: ["questionId"],
    where: { createdAt: { gte: since } },
    _count: { _all: true },
    _sum: { isCorrect: true },
    having: { _count: { _all: { gte: MIN_ATTEMPTS } } },
    orderBy: { _sum: { isCorrect: "asc" } },
    take: 30,
  });

  const questionIds = questionMissData.map((r) => r.questionId).filter(Boolean) as string[];
  const questionDetails = questionIds.length > 0
    ? await prisma.examQuestion.findMany({
        where: { id: { in: questionIds } },
        select: { id: true, topic: true, subtopic: true },
      })
    : [];
  const questionMap = new Map(questionDetails.map((q) => [q.id, q]));

  const mostMissedQuestions: MissedContentItem[] = questionMissData
    .map((r) => {
      const total = r._count._all;
      // _sum.isCorrect counts `true` values in Prisma when the field is Boolean
      const correct = Number(r._sum.isCorrect ?? 0);
      const incorrectCount = total - correct;
      const q = questionMap.get(r.questionId);
      return {
        id: r.questionId,
        topic: q?.topic ?? null,
        subtopic: q?.subtopic ?? null,
        incorrectCount,
        totalAttempts: total,
        incorrectRate: total > 0 ? incorrectCount / total : 0,
        label: q?.topic ?? r.questionId.slice(0, 12),
      };
    })
    .filter((r) => r.incorrectRate > 0.6)
    .sort((a, b) => b.incorrectRate - a.incorrectRate)
    .slice(0, 15);

  // ── Topic engagement via question attempts ───────────────────────────────
  const topicData = await prisma.examQuestionPracticeAnswerAttempt.groupBy({
    by: ["questionId"],
    where: { createdAt: { gte: since } },
    _count: { _all: true },
    _sum: { isCorrect: true },
    having: { _count: { _all: { gte: MIN_ATTEMPTS } } },
    take: 200,
  });

  // Aggregate by topic
  const topicAggMap = new Map<string, { correct: number; total: number }>();
  const topicQIds = topicData.map((r) => r.questionId).filter(Boolean) as string[];
  const topicQDetails = topicQIds.length > 0
    ? await prisma.examQuestion.findMany({
        where: { id: { in: topicQIds } },
        select: { id: true, topic: true },
      })
    : [];
  const topicQMap = new Map(topicQDetails.map((q) => [q.id, q.topic]));

  for (const r of topicData) {
    const topic = topicQMap.get(r.questionId);
    if (!topic) continue;
    const existing = topicAggMap.get(topic) ?? { correct: 0, total: 0 };
    topicAggMap.set(topic, {
      correct: existing.correct + Number(r._sum.isCorrect ?? 0),
      total: existing.total + r._count._all,
    });
  }

  const topicList: TopicEngagementItem[] = [...topicAggMap.entries()]
    .filter(([, v]) => v.total >= MIN_ATTEMPTS)
    .map(([topic, v]) => ({
      topic,
      avgCorrectRate: v.total > 0 ? v.correct / v.total : 0,
      totalAttempts: v.total,
    }));

  const lowestConfidenceTopics = [...topicList]
    .sort((a, b) => a.avgCorrectRate - b.avgCorrectRate)
    .slice(0, 10);

  const highestConfidenceTopics = [...topicList]
    .sort((a, b) => b.avgCorrectRate - a.avgCorrectRate)
    .slice(0, 10);

  // ── Issue flags ───────────────────────────────────────────────────────────
  const potentialIssueFlags: ContentIssueFlag[] = [];

  for (const item of mostMissedFlashcards.filter((i) => i.incorrectRate > 0.7)) {
    potentialIssueFlags.push({
      id: item.id,
      kind: "flashcard",
      topic: item.topic,
      issue: "Unusually high miss rate — may be confusing, ambiguous, or incorrectly keyed",
      severity: item.incorrectRate > 0.85 ? "high" : "medium",
      metric: `${Math.round(item.incorrectRate * 100)}% miss rate over ${item.totalAttempts} attempts`,
    });
  }

  for (const item of mostMissedQuestions.filter((i) => i.incorrectRate > 0.75)) {
    potentialIssueFlags.push({
      id: item.id,
      kind: "question",
      topic: item.topic,
      issue: "Very high incorrect rate — may have a misleading stem, incorrect answer key, or poor distractors",
      severity: item.incorrectRate > 0.85 ? "high" : "medium",
      metric: `${Math.round(item.incorrectRate * 100)}% incorrect over ${item.totalAttempts} attempts`,
    });
  }

  potentialIssueFlags.sort((a, b) =>
    (a.severity === "high" ? 0 : a.severity === "medium" ? 1 : 2) -
    (b.severity === "high" ? 0 : b.severity === "medium" ? 1 : 2),
  );

  return {
    mostMissedFlashcards,
    mostMissedQuestions,
    lowestConfidenceTopics,
    highestConfidenceTopics,
    potentialIssueFlags: potentialIssueFlags.slice(0, 30),
    generatedAt: now.toISOString(),
  };
}
