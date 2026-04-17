/**
 * Review Queue Data Layer
 *
 * Server-side only. Reads ExamAttempt.results JSON for a user, extracts
 * per-question attempt records, runs the SRS scheduler, and returns a
 * paginated, prioritized review queue.
 *
 * Performance protections (per spec Section 6):
 *   - Fetches only the last HISTORY_DAYS (30) days of attempts
 *   - Caps at MAX_SESSIONS (20) sessions to bound DB load
 *   - Caps total attempt records at MAX_ATTEMPTS_TOTAL (600)
 *   - All JSON parsing is defensive (try/catch, type guards)
 *
 * No DB schema changes required — works from existing ExamAttempt.results Json.
 */

import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import {
  buildReviewQueue,
  buildReviewQueueSummary,
  paginateByPriority,
  type QuestionAttemptRecord,
  type ReviewPriority,
  type ReviewQueueSummary,
  type ScoredReviewItem,
} from "@/lib/study/srs-scheduler";

// ── Configuration ─────────────────────────────────────────────────────────────

const HISTORY_DAYS = 30;
const MAX_SESSIONS = 20;
const MAX_ATTEMPTS_TOTAL = 600;
export const PAGE_SIZE = 10;

// ── Results JSON parsing ──────────────────────────────────────────────────────

/**
 * Raw shape of a single question result as stored in ExamAttempt.results.
 *
 * The field is untyped Json in the DB; we defensively extract only what we need.
 * `id` / `questionId` / `stem` / `isCorrect` / `confidence` are the key fields.
 */
type RawResultItem = Record<string, unknown>;

function parseConfidence(raw: unknown): QuestionAttemptRecord["confidence"] {
  if (raw === "high" || raw === "medium" || raw === "low") return raw;
  return null;
}

function parseResultItems(
  results: unknown,
  sessionId: string,
  attemptedAt: Date,
): QuestionAttemptRecord[] {
  if (!Array.isArray(results)) return [];

  const parsed: QuestionAttemptRecord[] = [];

  for (const item of results) {
    if (!item || typeof item !== "object") continue;
    const r = item as RawResultItem;

    // questionId may be stored as "id", "questionId", or "qid"
    const questionId =
      typeof r.questionId === "string" ? r.questionId
      : typeof r.id === "string" ? r.id
      : typeof r.qid === "string" ? r.qid
      : null;

    if (!questionId) continue;

    // isCorrect may be stored as boolean or as a "correct" key
    const isCorrect =
      typeof r.isCorrect === "boolean" ? r.isCorrect
      : typeof r.correct === "boolean" ? r.correct
      : null;

    if (isCorrect === null) continue; // skip ungraded items

    const stem =
      typeof r.stem === "string" ? r.stem
      : typeof r.questionStem === "string" ? r.questionStem
      : null;

    const topic =
      typeof r.topic === "string" ? r.topic
      : typeof r.category === "string" ? r.category
      : null;

    const rationale =
      typeof r.correctAnswerExplanation === "string"
        ? r.correctAnswerExplanation
        : typeof r.rationale === "string" ? r.rationale
        : typeof r.explanation === "string" ? r.explanation
        : null;

    parsed.push({
      questionId,
      stem,
      topic,
      rationale,
      isCorrect,
      confidence: parseConfidence(r.confidence),
      attemptedAt,
      sessionId,
    });
  }

  return parsed;
}

// ── Main data loading ─────────────────────────────────────────────────────────

export interface ReviewQueueInitialData {
  summary: ReviewQueueSummary;
  /** First page of "Due Now" items */
  dueNow: { items: ScoredReviewItem[]; total: number; hasMore: boolean };
  /** First page of "Review Soon" items */
  reviewSoon: { items: ScoredReviewItem[]; total: number; hasMore: boolean };
  /** First page of "Stable" items */
  stable: { items: ScoredReviewItem[]; total: number; hasMore: boolean };
  /**
   * The full sorted queue is NOT serialized to the client.
   * Only the paginated slices above are sent.
   * Further pages are fetched via server actions.
   */
}

function emptyInitialData(): ReviewQueueInitialData {
  const emptyPage = { items: [], total: 0, hasMore: false };
  return {
    summary: {
      dueNowCount: 0,
      reviewSoonCount: 0,
      stableCount: 0,
      total: 0,
      overconfidenceCount: 0,
      uncertainCount: 0,
    },
    dueNow: emptyPage,
    reviewSoon: emptyPage,
    stable: emptyPage,
  };
}

/**
 * Load the full review queue initial data for a user.
 * Returns the first page of each priority tier + summary counts.
 *
 * Safe to call from RSC — all IO is server-side.
 */
export async function loadReviewQueueInitialData(
  userId: string,
): Promise<ReviewQueueInitialData> {
  if (!userId || !isDatabaseUrlConfigured()) return emptyInitialData();

  const since = new Date(Date.now() - HISTORY_DAYS * 24 * 60 * 60 * 1000);

  let recentAttempts: { id: string; results: unknown; createdAt: Date }[];
  try {
    recentAttempts = await prisma.examAttempt.findMany({
      where: {
        userId,
        createdAt: { gte: since },
      },
      select: {
        id: true,
        results: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 60,
    });
  } catch {
    // DB errors must not break the page — return empty queue
    return emptyInitialData();
  }
  const rawAttempts = recentAttempts.slice(0, MAX_SESSIONS);

  const allAttempts: QuestionAttemptRecord[] = [];
  for (const attempt of rawAttempts) {
    const items = parseResultItems(attempt.results, attempt.id, attempt.createdAt);
    allAttempts.push(...items);
    if (allAttempts.length >= MAX_ATTEMPTS_TOTAL) break;
  }

  if (allAttempts.length === 0) return emptyInitialData();

  const queue = buildReviewQueue(allAttempts);
  const summary = buildReviewQueueSummary(queue);

  return {
    summary,
    dueNow:     paginateByPriority(queue, "due_now",     0, PAGE_SIZE),
    reviewSoon: paginateByPriority(queue, "review_soon", 0, PAGE_SIZE),
    stable:     paginateByPriority(queue, "stable",       0, PAGE_SIZE),
  };
}

/**
 * Load a specific page of a priority tier.
 * Used by server actions for "Load more" pagination.
 * Re-runs the same aggregation — safe for the data volumes involved.
 */
export async function loadReviewQueuePage(
  userId: string,
  priority: ReviewPriority,
  page: number,
): Promise<{ items: ScoredReviewItem[]; total: number; hasMore: boolean }> {
  if (!userId || !isDatabaseUrlConfigured()) {
    return { items: [], total: 0, hasMore: false };
  }

  const since = new Date(Date.now() - HISTORY_DAYS * 24 * 60 * 60 * 1000);

  let recentAttempts: { id: string; results: unknown; createdAt: Date }[];
  try {
    recentAttempts = await prisma.examAttempt.findMany({
      where: { userId, createdAt: { gte: since } },
      select: { id: true, results: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 60,
    });
  } catch {
    return { items: [], total: 0, hasMore: false };
  }
  const rawAttempts = recentAttempts.slice(0, MAX_SESSIONS);

  const allAttempts: QuestionAttemptRecord[] = [];
  for (const attempt of rawAttempts) {
    const items = parseResultItems(attempt.results, attempt.id, attempt.createdAt);
    allAttempts.push(...items);
    if (allAttempts.length >= MAX_ATTEMPTS_TOTAL) break;
  }

  const queue = buildReviewQueue(allAttempts);
  return paginateByPriority(queue, priority, page, PAGE_SIZE);
}
