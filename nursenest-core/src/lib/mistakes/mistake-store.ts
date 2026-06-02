/**
 * Mistake Notebook — server-side data store.
 *
 * Mistakes are derived from PracticeTest.results.incorrectQuestionIds (already persisted).
 * User reason tags and notes live in LearnerNote (scope=QUESTION_BANK, contextId="mistake:{questionId}").
 */

import { prisma } from "@/lib/db";
import { LearnerNoteScope } from "@prisma/client";
import { MISTAKE_REASONS, type MistakeEntry, type MistakeReason, type MistakeTagBody } from "./mistake-types";
import type { PracticeTestResultsJson } from "@/lib/practice-tests/types";

const MISTAKE_PREFIX = "mistake:";
const MAX_RECENT_TESTS = 25;
const MAX_UNIQUE_QUESTIONS = 200;

/** Load the full Mistake Notebook for a user. */
export async function loadMistakeNotebook(userId: string): Promise<MistakeEntry[]> {
  // 1. Load recent completed practice tests
  const tests = await prisma.practiceTest.findMany({
    where: { userId, status: "COMPLETED" },
    select: { id: true, results: true, completedAt: true },
    orderBy: { completedAt: "desc" },
    take: MAX_RECENT_TESTS,
  });

  const tagRows = await prisma.learnerNote.findMany({
    where: {
      userId,
      scope: LearnerNoteScope.QUESTION_BANK,
      contextId: { startsWith: MISTAKE_PREFIX },
    },
    select: { contextId: true, body: true, topic: true, createdAt: true, updatedAt: true },
  });

  // 2. Aggregate missed question IDs across all tests
  const questionMissMap = new Map<string, { missCount: number; lastMissedAt: string; sourceIds: string[] }>();
  for (const test of tests) {
    const results = test.results as PracticeTestResultsJson | null;
    const incorrectIds: string[] = results?.incorrectQuestionIds ?? [];
    if (incorrectIds.length === 0) continue;
    const missedAt = test.completedAt?.toISOString() ?? new Date().toISOString();
    for (const qId of incorrectIds) {
      const existing = questionMissMap.get(qId);
      if (existing) {
        existing.missCount++;
        if (missedAt > existing.lastMissedAt) existing.lastMissedAt = missedAt;
        existing.sourceIds.push(test.id);
      } else {
        questionMissMap.set(qId, { missCount: 1, lastMissedAt: missedAt, sourceIds: [test.id] });
      }
    }
  }

  // Cap to most-frequently-missed questions
  const taggedQuestionIds = tagRows.map((row) => row.contextId.slice(MISTAKE_PREFIX.length)).filter(Boolean);
  const sortedIds = [...new Set([
    ...[...questionMissMap.entries()]
    .sort((a, b) => b[1].missCount - a[1].missCount)
    .slice(0, MAX_UNIQUE_QUESTIONS)
      .map(([id]) => id),
    ...taggedQuestionIds,
  ])].slice(0, MAX_UNIQUE_QUESTIONS);

  if (sortedIds.length === 0) return [];

  // 3. Load question details in one query
  const questions = await prisma.examQuestion.findMany({
    where: { id: { in: sortedIds } },
    select: {
      id: true,
      stem: true,
      topic: true,
      bodySystem: true,
      questionType: true,
      rationale: true,
      options: true,
      correctAnswer: true,
    },
  });

  const tagMap = new Map<string, MistakeTagBody>();
  for (const row of tagRows) {
    const qId = row.contextId.slice(MISTAKE_PREFIX.length);
    try {
      const parsed = JSON.parse(row.body) as MistakeTagBody;
      const reason = MISTAKE_REASONS.includes(parsed.reason as MistakeReason) ? parsed.reason : null;
      tagMap.set(qId, {
        reason,
        note: parsed.note ?? "",
        sourceType: parsed.sourceType ?? null,
        stemPreview: parsed.stemPreview ?? null,
        topic: parsed.topic ?? row.topic ?? null,
        bodySystem: parsed.bodySystem ?? null,
        questionType: parsed.questionType ?? null,
        sourceHref: parsed.sourceHref ?? null,
        pathwayId: parsed.pathwayId ?? null,
        createdAt: parsed.createdAt ?? row.createdAt.toISOString(),
      });
    } catch {
      tagMap.set(qId, { reason: null, note: "" });
    }
  }

  // 5. Merge into MistakeEntry[]
  const questionById = new Map(questions.map((q) => [q.id, q]));
  const entries: MistakeEntry[] = sortedIds.map((questionId) => {
    const q = questionById.get(questionId);
    const tag = tagMap.get(questionId);
    const fallbackMissedAt = tag?.createdAt ?? new Date().toISOString();
    const effectiveMissData = questionMissMap.get(questionId) ?? { missCount: 1, lastMissedAt: fallbackMissedAt, sourceIds: [] };
    return {
      questionId,
      stemPreview: (typeof q?.stem === "string" ? q.stem : tag?.stemPreview ?? "Missed study item").slice(0, 300),
      topic: q?.topic ?? tag?.topic ?? null,
      bodySystem: (q?.bodySystem as string | null) ?? tag?.bodySystem ?? null,
      questionType: (q?.questionType as string | null) ?? tag?.questionType ?? null,
      rationale: q?.rationale ?? null,
      options: q?.options ?? null,
      correctAnswer: q?.correctAnswer ?? null,
      missCount: effectiveMissData.missCount,
      lastMissedAt: effectiveMissData.lastMissedAt,
      reason: tag?.reason ?? null,
      note: tag?.note ?? "",
      tagged: tagMap.has(questionId),
      sourceIds: effectiveMissData.sourceIds,
      sourceType: tag?.sourceType ?? null,
      sourceHref: tag?.sourceHref ?? null,
      pathwayId: tag?.pathwayId ?? null,
    };
  });

  // Sort: most missed first, then most recent
  entries.sort((a, b) => {
    if (b.missCount !== a.missCount) return b.missCount - a.missCount;
    return b.lastMissedAt.localeCompare(a.lastMissedAt);
  });

  return entries;
}

/** Upsert a user's reason tag + note for a missed question. */
export async function upsertMistakeTag(
  userId: string,
  questionId: string,
  tag: MistakeTagBody,
  topic?: string | null,
): Promise<void> {
  const contextId = `${MISTAKE_PREFIX}${questionId}`;
  const body = JSON.stringify({
    reason: tag.reason,
    note: tag.note,
    sourceType: tag.sourceType ?? null,
    stemPreview: tag.stemPreview ?? null,
    topic: tag.topic ?? topic ?? null,
    bodySystem: tag.bodySystem ?? null,
    questionType: tag.questionType ?? null,
    sourceHref: tag.sourceHref ?? null,
    pathwayId: tag.pathwayId ?? null,
    createdAt: tag.createdAt ?? new Date().toISOString(),
  });
  await prisma.learnerNote.upsert({
    where: { userId_scope_contextId: { userId, scope: LearnerNoteScope.QUESTION_BANK, contextId } },
    create: {
      userId,
      scope: LearnerNoteScope.QUESTION_BANK,
      contextId,
      topic: tag.topic ?? topic ?? null,
      body,
    },
    update: { body, topic: tag.topic ?? topic ?? undefined },
  });
}

/** Remove a user's reason tag for a question (reverts to untagged). */
export async function deleteMistakeTag(userId: string, questionId: string): Promise<void> {
  const contextId = `${MISTAKE_PREFIX}${questionId}`;
  await prisma.learnerNote
    .delete({
      where: { userId_scope_contextId: { userId, scope: LearnerNoteScope.QUESTION_BANK, contextId } },
    })
    .catch(() => {
      /* ignore not-found */
    });
}
