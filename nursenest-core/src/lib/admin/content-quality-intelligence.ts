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
  avgCorrectRate: number;
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

type QuestionMissRow = {
  question_id: string;
  total_count: bigint;
  correct_count: bigint;
};

type TopicRow = {
  topic: string | null;
  total_count: bigint;
  correct_count: bigint;
};

export async function loadContentQualityReport(): Promise<ContentQualityReport | null> {
  if (!isDatabaseUrlConfigured()) return null;

  const now = new Date();
  const since = new Date(Date.now() - WINDOW_DAYS * 86_400_000);

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
        select: { id: true, category: { select: { name: true, slug: true } } },
      })
    : [];
  const flashcardMap = new Map(flashcardDetails.map((f) => [f.id, f]));

  const mostMissedFlashcards: MissedContentItem[] = flashcardMasteryData
    .map((r) => {
      const total = r._sum.totalAttempts ?? 0;
      const correct = r._sum.correctCount ?? 0;
      const incorrectCount = total - correct;
      const f = flashcardMap.get(r.flashcardId);
      const label = f?.category?.name ?? r.flashcardId.slice(0, 12);
      return {
        id: r.flashcardId,
        topic: f?.category?.name ?? null,
        subtopic: f?.category?.slug ?? null,
        incorrectCount,
        totalAttempts: total,
        incorrectRate: total > 0 ? incorrectCount / total : 0,
        label,
      };
    })
    .filter((r) => r.incorrectRate > 0.5)
    .sort((a, b) => b.incorrectRate - a.incorrectRate)
    .slice(0, 15);

  // ── Most missed questions (raw SQL for reliable groupBy+having) ─────────
  const questionMissRows = await prisma.$queryRaw<QuestionMissRow[]>`
    SELECT
      question_id,
      COUNT(*) AS total_count,
      SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) AS correct_count
    FROM exam_question_practice_answer_attempts
    WHERE created_at >= ${since}
    GROUP BY question_id
    HAVING COUNT(*) >= ${MIN_ATTEMPTS}
    ORDER BY SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) ASC
    LIMIT 30
  `;

  const questionIds = questionMissRows.map((r) => r.question_id);
  const questionDetails = questionIds.length > 0
    ? await prisma.examQuestion.findMany({
        where: { id: { in: questionIds } },
        select: { id: true, topic: true, subtopic: true },
      })
    : [];
  const questionMap = new Map(questionDetails.map((q) => [q.id, q]));

  const mostMissedQuestions: MissedContentItem[] = questionMissRows
    .map((r) => {
      const total = Number(r.total_count);
      const correct = Number(r.correct_count);
      const incorrectCount = total - correct;
      const q = questionMap.get(r.question_id);
      return {
        id: r.question_id,
        topic: q?.topic ?? null,
        subtopic: q?.subtopic ?? null,
        incorrectCount,
        totalAttempts: total,
        incorrectRate: total > 0 ? incorrectCount / total : 0,
        label: q?.topic ?? r.question_id.slice(0, 12),
      };
    })
    .filter((r) => r.incorrectRate > 0.6)
    .sort((a, b) => b.incorrectRate - a.incorrectRate)
    .slice(0, 15);

  // ── Topic engagement (raw SQL) ───────────────────────────────────────────
  const topicRows = await prisma.$queryRaw<TopicRow[]>`
    SELECT
      eq.topic,
      COUNT(a.id) AS total_count,
      SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END) AS correct_count
    FROM exam_question_practice_answer_attempts a
    JOIN exam_questions eq ON eq.id = a.question_id
    WHERE a.created_at >= ${since}
      AND eq.topic IS NOT NULL
    GROUP BY eq.topic
    HAVING COUNT(a.id) >= ${MIN_ATTEMPTS}
    ORDER BY COUNT(a.id) DESC
    LIMIT 200
  `;

  const topicList: TopicEngagementItem[] = topicRows
    .filter((r) => r.topic != null)
    .map((r) => ({
      topic: r.topic!,
      avgCorrectRate: Number(r.total_count) > 0 ? Number(r.correct_count) / Number(r.total_count) : 0,
      totalAttempts: Number(r.total_count),
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

  potentialIssueFlags.sort(
    (a, b) =>
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
