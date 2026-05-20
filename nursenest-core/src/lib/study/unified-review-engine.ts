/**
 * Unified Review Engine
 *
 * Multi-source spaced repetition data loader. Aggregates three independent
 * review signals into a single prioritised queue:
 *
 *   1. Questions  — ExamAttempt.results JSON → heuristic urgency (srs-scheduler.ts)
 *   2. Flashcards — FlashcardProgress.nextReviewAt → SM-2 interval data
 *   3. Topics     — UserTopicStat → decay-adjusted wrong signal (weak-topic-priority.ts)
 *
 * Each source is loaded concurrently and contributes independently-scored
 * UnifiedReviewItems. All three sources are merged into five priority tiers:
 *   overdue | due_today | high_risk | due_soon | stable
 *
 * Performance protections:
 *   - Questions: capped at MAX_SESSIONS (20) / MAX_ATTEMPTS (600) per srs-scheduler spec
 *   - Flashcards: grouped per-deck with counts only — no per-card hydration
 *   - Topics: capped at MAX_TOPICS (30) rows from UserTopicStat
 *   - All sources run concurrently with Promise.all
 *   - DB errors in any source return empty arrays (never break the page)
 */

import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { flashcardAccessWhere } from "@/lib/entitlements/content-access-scope";
import {
  buildReviewQueue,
  buildReviewQueueSummary,
  type QuestionAttemptRecord,
  type ReviewQueueSummary,
  type ScoredReviewItem,
} from "@/lib/study/srs-scheduler";
import { computeWeakPriorityScore, computeDecaySignals } from "@/lib/learner/weak-topic-priority";
import { remediationTopicDrillHref, remediationLessonsTopicHref } from "@/lib/learner/remediation-links";
import type {
  FlashcardDeckReviewData,
  TopicReviewData,
  UnifiedReviewData,
  UnifiedReviewItem,
  UnifiedReviewSummary,
  ReviewPriorityTier,
} from "@/lib/study/unified-review-types";

// ── Constants ─────────────────────────────────────────────────────────────────

const HISTORY_DAYS = 30;
const MAX_SESSIONS = 20;
const MAX_ATTEMPTS_TOTAL = 600;
const MAX_TOPICS = 30;
const FLASHCARD_SOON_DAYS = 7;

// Question urgency thresholds (mirrors srs-scheduler.ts)
const Q_OVERDUE_MIN = 100;
const Q_DUE_TODAY_MIN = 70;  // maps to srs "due_now" (some are overdue-level)
const Q_DUE_SOON_MIN = 35;   // maps to srs "review_soon"

// Topic high-risk thresholds
const TOPIC_HIGH_RISK_SCORE = 0.45;   // computeWeakPriorityScore threshold
const TOPIC_HIGH_RISK_STREAK = 2;     // wrong streak floor for high_risk

// ── Questions source ──────────────────────────────────────────────────────────

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
    const questionId =
      typeof r.questionId === "string" ? r.questionId
      : typeof r.id === "string" ? r.id
      : typeof r.qid === "string" ? r.qid
      : null;
    if (!questionId) continue;
    const isCorrect =
      typeof r.isCorrect === "boolean" ? r.isCorrect
      : typeof r.correct === "boolean" ? r.correct
      : null;
    if (isCorrect === null) continue;
    parsed.push({
      questionId,
      stem: typeof r.stem === "string" ? r.stem
        : typeof r.questionStem === "string" ? r.questionStem : null,
      topic: typeof r.topic === "string" ? r.topic
        : typeof r.category === "string" ? r.category : null,
      rationale: typeof r.correctAnswerExplanation === "string" ? r.correctAnswerExplanation
        : typeof r.rationale === "string" ? r.rationale
        : typeof r.explanation === "string" ? r.explanation : null,
      isCorrect,
      confidence: parseConfidence(r.confidence),
      attemptedAt,
      sessionId,
    });
  }
  return parsed;
}

async function loadQuestionSource(userId: string): Promise<ScoredReviewItem[]> {
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
    return [];
  }
  const rawAttempts = recentAttempts.slice(0, MAX_SESSIONS);
  const allAttempts: QuestionAttemptRecord[] = [];
  for (const attempt of rawAttempts) {
    const items = parseResultItems(attempt.results, attempt.id, attempt.createdAt);
    allAttempts.push(...items);
    if (allAttempts.length >= MAX_ATTEMPTS_TOTAL) break;
  }
  if (allAttempts.length === 0) return [];
  return buildReviewQueue(allAttempts);
}

// ── Flashcards source ─────────────────────────────────────────────────────────

async function loadFlashcardSource(
  userId: string,
  entitlement: AccessScope,
): Promise<FlashcardDeckReviewData[]> {
  const now = new Date();
  const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000 - 1);
  const soonEnd = new Date(todayStart.getTime() + FLASHCARD_SOON_DAYS * 24 * 60 * 60 * 1000);
  const cardScope = flashcardAccessWhere(entitlement);

  try {
    // Load progress entries with deck info, grouped
    const progRows = await prisma.flashcardProgress.findMany({
      where: {
        userId,
        flashcard: cardScope,
        nextReviewAt: { not: null, lte: soonEnd },
      },
      select: {
        easeFactor: true,
        repetitions: true,
        nextReviewAt: true,
        flashcard: {
          select: {
            deck: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    // Group by deck
    const deckMap = new Map<string, {
      deckId: string;
      deckName: string;
      slug: string;
      overdue: number;
      dueToday: number;
      dueSoon: number;
      easeFactors: number[];
      progressedCount: number;
    }>();

    for (const row of progRows) {
      const deck = row.flashcard.deck;
      if (!deck) continue;
      const nra = row.nextReviewAt!;

      if (!deckMap.has(deck.id)) {
        deckMap.set(deck.id, {
          deckId: deck.id,
          deckName: deck.title,
          slug: deck.slug,
          overdue: 0,
          dueToday: 0,
          dueSoon: 0,
          easeFactors: [],
          progressedCount: 0,
        });
      }
      const entry = deckMap.get(deck.id)!;
      entry.progressedCount++;
      entry.easeFactors.push(row.easeFactor);

      if (nra < todayStart) {
        entry.overdue++;
      } else if (nra <= todayEnd) {
        entry.dueToday++;
      } else {
        entry.dueSoon++;
      }
    }

    return [...deckMap.values()].map((d) => ({
      deckId: d.deckId,
      deckName: d.deckName,
      overdueCount: d.overdue,
      dueTodayCount: d.dueToday,
      dueSoonCount: d.dueSoon,
      avgEaseFactor:
        d.easeFactors.length > 0
          ? Math.round((d.easeFactors.reduce((a, b) => a + b, 0) / d.easeFactors.length) * 100) / 100
          : 2.5,
      progressedCount: d.progressedCount,
      reviewHref: `/app/flashcards/${d.slug}?mode=review`,
    }));
  } catch {
    return [];
  }
}

// ── Topics source ─────────────────────────────────────────────────────────────

async function loadTopicSource(userId: string): Promise<TopicReviewData[]> {
  try {
    const rows = await prisma.userTopicStat.findMany({
      where: { userId, wrongCount: { gte: 1 } },
      select: {
        topic: true,
        correctCount: true,
        wrongCount: true,
        wrongStreak: true,
        lastWrongAt: true,
        lastAttemptAt: true,
      },
      orderBy: { wrongCount: "desc" },
      take: MAX_TOPICS,
    });

    return rows.map((r) => {
      const attempted = r.correctCount + r.wrongCount;
      const missRate = attempted > 0 ? Math.round((r.wrongCount / attempted) * 100) : 0;
      const statLike = {
        correctCount: r.correctCount,
        wrongCount: r.wrongCount,
        wrongStreak: r.wrongStreak,
        lastWrongAt: r.lastWrongAt,
        lastAttemptAt: r.lastAttemptAt,
      };
      const weakPriorityScore = computeWeakPriorityScore(statLike);
      const { decayAdjustedWrongSignal } = computeDecaySignals(statLike);
      return {
        topic: r.topic,
        bodySystem: null,
        missRate,
        wrongStreak: r.wrongStreak,
        wrongCount: r.wrongCount,
        correctCount: r.correctCount,
        lastWrongAt: r.lastWrongAt?.toISOString() ?? null,
        weakPriorityScore,
        decayAdjustedWrongSignal,
      };
    });
  } catch {
    return [];
  }
}

// ── Item builders ─────────────────────────────────────────────────────────────

function questionTier(item: ScoredReviewItem): ReviewPriorityTier {
  if (item.urgencyScore >= Q_OVERDUE_MIN) return "overdue";
  if (item.urgencyScore >= Q_DUE_TODAY_MIN) return "due_today";
  if (item.urgencyScore >= Q_DUE_SOON_MIN) return "due_soon";
  return "stable";
}

function flashcardTier(deck: FlashcardDeckReviewData): ReviewPriorityTier {
  if (deck.overdueCount > 0) return "overdue";
  if (deck.dueTodayCount > 0) return "due_today";
  if (deck.dueSoonCount > 0) return "due_soon";
  return "stable";
}

function topicTier(topic: TopicReviewData): ReviewPriorityTier {
  if (
    topic.wrongStreak >= TOPIC_HIGH_RISK_STREAK ||
    topic.weakPriorityScore >= TOPIC_HIGH_RISK_SCORE
  ) {
    return "high_risk";
  }
  return "due_soon";
}

function flashcardUrgency(deck: FlashcardDeckReviewData): number {
  const tier = flashcardTier(deck);
  if (tier === "overdue") return Math.min(100 + deck.overdueCount * 3, 150);
  if (tier === "due_today") return 75 + deck.dueTodayCount * 2;
  return 40 + deck.dueSoonCount;
}

function flashcardDueLabel(deck: FlashcardDeckReviewData): string {
  if (deck.overdueCount > 0) {
    return `${deck.overdueCount} overdue${deck.dueTodayCount > 0 ? ` · ${deck.dueTodayCount} due today` : ""}`;
  }
  if (deck.dueTodayCount > 0) return `${deck.dueTodayCount} due today`;
  return `${deck.dueSoonCount} due this week`;
}

function topicUrgency(topic: TopicReviewData): number {
  return Math.min(Math.round(topic.weakPriorityScore * 120), 90);
}

function topicDueLabel(topic: TopicReviewData): string {
  if (topic.wrongStreak >= 3) return `${topic.wrongStreak} misses in a row`;
  if (topic.wrongStreak >= 2) return "Struggling — 2+ miss streak";
  const pct = topic.missRate;
  return pct >= 60 ? `${pct}% miss rate` : `${topic.wrongCount} errors recorded`;
}

function buildQuestionItems(questions: ScoredReviewItem[]): UnifiedReviewItem[] {
  return questions.map((q) => ({
    id: `q:${q.questionId}`,
    kind: "question" as const,
    tier: questionTier(q),
    urgencyScore: q.urgencyScore,
    dueLabel: q.dueLabel,
    title: q.stem ?? "Practice question",
    subtitle: q.topic ?? null,
    topic: q.topic,
    bodySystem: null,
    drillHref: q.topic
      ? remediationTopicDrillHref(q.topic)
      : "/app/questions",
    lessonHref: q.topic ? remediationLessonsTopicHref(q.topic) : null,
    questionData: { questionItem: q },
  }));
}

function buildFlashcardItems(decks: FlashcardDeckReviewData[]): UnifiedReviewItem[] {
  return decks
    .filter((d) => d.overdueCount > 0 || d.dueTodayCount > 0 || d.dueSoonCount > 0)
    .map((d) => ({
      id: `fc:${d.deckId}`,
      kind: "flashcard" as const,
      tier: flashcardTier(d),
      urgencyScore: flashcardUrgency(d),
      dueLabel: flashcardDueLabel(d),
      title: d.deckName,
      subtitle: `${d.progressedCount} card${d.progressedCount !== 1 ? "s" : ""} studied`,
      topic: null,
      bodySystem: null,
      drillHref: d.reviewHref,
      lessonHref: null,
      flashcardData: d,
    }));
}

function buildTopicItems(topics: TopicReviewData[]): UnifiedReviewItem[] {
  return topics
    .filter((t) => t.weakPriorityScore > 0.15 || t.wrongStreak >= 2)
    .map((t) => ({
      id: `t:${t.topic}`,
      kind: "topic" as const,
      tier: topicTier(t),
      urgencyScore: topicUrgency(t),
      dueLabel: topicDueLabel(t),
      title: t.topic,
      subtitle: t.bodySystem ?? `${t.missRate}% miss rate · ${t.wrongCount} errors`,
      topic: t.topic,
      bodySystem: t.bodySystem,
      drillHref: remediationTopicDrillHref(t.topic),
      lessonHref: remediationLessonsTopicHref(t.topic),
      topicData: t,
    }));
}

// ── Summary builder ───────────────────────────────────────────────────────────

function buildSummaryMessage(s: Omit<UnifiedReviewSummary, "summaryMessage">): string {
  if (s.totalItems === 0) {
    return "Complete practice sessions or flashcard decks and your review queue will populate automatically.";
  }
  const urgent = s.overdueCount + s.dueTodayCount;
  if (urgent === 0 && s.highRiskCount === 0) {
    return `All ${s.totalItems} tracked item${s.totalItems !== 1 ? "s" : ""} are stable or coming up soon. Keep your pace.`;
  }
  const parts: string[] = [];
  if (s.overdueCount > 0) parts.push(`${s.overdueCount} overdue`);
  if (s.dueTodayCount > 0) parts.push(`${s.dueTodayCount} due today`);
  if (s.flashcardDecksWithDue > 0) parts.push(`${s.flashcardDecksWithDue} deck${s.flashcardDecksWithDue !== 1 ? "s" : ""} with cards due`);
  if (s.topicsAtRisk > 0) parts.push(`${s.topicsAtRisk} high-risk concept${s.topicsAtRisk !== 1 ? "s" : ""}`);
  return `${parts.join(" · ")} — tackle the overdue and high-risk items first.`;
}

function buildSummary(items: UnifiedReviewItem[], flashcardDecks: FlashcardDeckReviewData[]): UnifiedReviewSummary {
  const overdueCount   = items.filter((i) => i.tier === "overdue").length;
  const dueTodayCount  = items.filter((i) => i.tier === "due_today").length;
  const dueSoonCount   = items.filter((i) => i.tier === "due_soon").length;
  const highRiskCount  = items.filter((i) => i.tier === "high_risk").length;
  const stableCount    = items.filter((i) => i.tier === "stable").length;
  const flashcardDecksWithDue = flashcardDecks.filter(
    (d) => d.overdueCount > 0 || d.dueTodayCount > 0,
  ).length;
  const topicsAtRisk   = items.filter((i) => i.kind === "topic" && i.tier === "high_risk").length;

  const partial = {
    overdueCount, dueTodayCount, dueSoonCount, highRiskCount, stableCount,
    totalItems: items.length,
    flashcardDecksWithDue,
    topicsAtRisk,
  };
  return { ...partial, summaryMessage: buildSummaryMessage(partial) };
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function loadUnifiedReviewData(
  userId: string,
  entitlement: AccessScope,
): Promise<UnifiedReviewData> {
  const empty: UnifiedReviewData = {
    summary: {
      overdueCount: 0, dueTodayCount: 0, dueSoonCount: 0, highRiskCount: 0,
      stableCount: 0, totalItems: 0, flashcardDecksWithDue: 0, topicsAtRisk: 0,
      summaryMessage:
        "Complete practice sessions or flashcard decks and your review queue will populate automatically.",
    },
    overdue: [], dueToday: [], highRisk: [], dueSoon: [], stable: [],
  };

  if (!userId || !isDatabaseUrlConfigured()) return empty;

  // Run all three sources concurrently
  const [questionQueue, flashcardDecks, topicStats] = await Promise.all([
    loadQuestionSource(userId),
    loadFlashcardSource(userId, entitlement),
    loadTopicSource(userId),
  ]);

  const questionItems  = buildQuestionItems(questionQueue);
  const flashcardItems = buildFlashcardItems(flashcardDecks);
  const topicItems     = buildTopicItems(topicStats);

  // Merge all items
  const allItems = [...questionItems, ...flashcardItems, ...topicItems];

  // Sort by urgency descending within each tier
  const byUrgency = (a: UnifiedReviewItem, b: UnifiedReviewItem) =>
    b.urgencyScore - a.urgencyScore;

  const summary = buildSummary(allItems, flashcardDecks);

  return {
    summary,
    overdue:   allItems.filter((i) => i.tier === "overdue").sort(byUrgency),
    dueToday:  allItems.filter((i) => i.tier === "due_today").sort(byUrgency),
    highRisk:  allItems.filter((i) => i.tier === "high_risk").sort(byUrgency),
    dueSoon:   allItems.filter((i) => i.tier === "due_soon").sort(byUrgency),
    stable:    allItems.filter((i) => i.tier === "stable").sort(byUrgency),
  };
}

/**
 * Re-export the question-level summary for legacy compatibility with the
 * existing ReviewQueueHero that reads ReviewQueueSummary.
 */
export function legacyQuestionSummary(questions: ScoredReviewItem[]): ReviewQueueSummary {
  return buildReviewQueueSummary(questions);
}
