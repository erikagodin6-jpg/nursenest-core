"use server";

/**
 * Strategy Session Server Actions
 *
 * Provides authenticated, entitlement-gated question fetching for strategy
 * practice sessions. Uses cursor-based pagination to load batches of questions
 * tagged with a specific examStrategy.
 *
 * These actions are called from:
 *   - Strategy session client component (initial batch load)
 *   - "Load next batch" button (subsequent page calls)
 *
 * Performance:
 *   - Only fetches questions needed for the current batch (default 10)
 *   - No question bodies loaded for strategies not in the current session
 *   - Cursor pagination prevents unbounded skip scans
 */

import { auth } from "@/lib/auth";
import { resolveEntitlement } from "@/lib/entitlements/resolve-entitlement";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { withRetry } from "@/lib/resilience/with-retry";
import {
  ALL_STRATEGY_KEYS,
  isStrategyKey,
  type StrategyKey,
} from "@/lib/study/strategy-taxonomy";

// ── Types ──────────────────────────────────────────────────────────────────────

export type StrategyQuestion = {
  id: string;
  stem: string;
  options: string[];
  correctAnswer: string[];
  rationale: string | null;
  examStrategy: string | null;
  clinicalTrap: string | null;
  memoryHook: string | null;
  frameworkUsed: string | null;
  topic: string | null;
  difficulty: number | null;
};

export type StrategySessionBatch = {
  questions: StrategyQuestion[];
  /** Opaque cursor for the next batch — pass back as `afterId`. */
  nextCursor: string | null;
  /** Total count (may be approximate if > 500). */
  total: number;
  strategyKey: string;
};

const BATCH_SIZE = 10;
const MAX_BATCH_SIZE = 20;

// ── Helpers ────────────────────────────────────────────────────────────────────

async function requireSubscriberUserId(): Promise<string | null> {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return null;
  const entitlement = await resolveEntitlement(userId);
  if (!entitlement.hasAccess) return null;
  return userId;
}

function parseOptions(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map((x: unknown) => String(x));
  return [];
}

function parseCorrectAnswer(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map((x: unknown) => String(x));
  if (typeof raw === "string") return [raw];
  return [];
}

// ── Server Actions ─────────────────────────────────────────────────────────────

/**
 * Load the initial batch of strategy questions.
 * Returns the first BATCH_SIZE questions for the given strategy.
 */
export async function loadStrategySession(
  strategyKey: string,
  batchSize?: number,
): Promise<StrategySessionBatch> {
  const userId = await requireSubscriberUserId();
  if (!userId || !isDatabaseUrlConfigured()) {
    return { questions: [], nextCursor: null, total: 0, strategyKey };
  }

  // For "mixed" sessions, use all strategy keys
  const isMixed = strategyKey === "mixed";
  const strategyFilter: string[] = isMixed
    ? (ALL_STRATEGY_KEYS as unknown as string[])
    : isStrategyKey(strategyKey)
    ? [strategyKey]
    : [];

  if (strategyFilter.length === 0) {
    return { questions: [], nextCursor: null, total: 0, strategyKey };
  }

  const take = Math.min(batchSize ?? BATCH_SIZE, MAX_BATCH_SIZE);

  try {
    const [rows, total] = await Promise.all([
      withRetry(() =>
        prisma.examQuestion.findMany({
          where: {
            status: "published",
            examStrategy: { in: strategyFilter },
          },
          select: {
            id: true,
            stem: true,
            options: true,
            correctAnswer: true,
            rationale: true,
            examStrategy: true,
            clinicalTrap: true,
            memoryHook: true,
            frameworkUsed: true,
            topic: true,
            difficulty: true,
          },
          orderBy: [{ difficulty: "asc" }, { id: "asc" }],
          take,
        }),
      ),
      withRetry(() =>
        prisma.examQuestion.count({
          where: {
            status: "published",
            examStrategy: { in: strategyFilter },
          },
        }),
      ),
    ]);

    const questions: StrategyQuestion[] = rows.map((r) => ({
      id: r.id,
      stem: r.stem,
      options: parseOptions(r.options),
      correctAnswer: parseCorrectAnswer(r.correctAnswer),
      rationale: r.rationale ?? null,
      examStrategy: r.examStrategy ?? null,
      clinicalTrap: r.clinicalTrap ?? null,
      memoryHook: r.memoryHook ?? null,
      frameworkUsed: r.frameworkUsed ?? null,
      topic: r.topic ?? null,
      difficulty: r.difficulty ?? null,
    }));

    const nextCursor = rows.length === take ? (rows[rows.length - 1]?.id ?? null) : null;

    return { questions, nextCursor, total, strategyKey };
  } catch {
    return { questions: [], nextCursor: null, total: 0, strategyKey };
  }
}

/**
 * Load the next batch after a given cursor ID.
 */
export async function loadMoreStrategyQuestions(
  strategyKey: string,
  afterId: string,
  batchSize?: number,
): Promise<StrategySessionBatch> {
  const userId = await requireSubscriberUserId();
  if (!userId || !isDatabaseUrlConfigured()) {
    return { questions: [], nextCursor: null, total: 0, strategyKey };
  }

  const isMixed = strategyKey === "mixed";
  const strategyFilter: string[] = isMixed
    ? (ALL_STRATEGY_KEYS as unknown as string[])
    : isStrategyKey(strategyKey)
    ? [strategyKey]
    : [];

  if (strategyFilter.length === 0) {
    return { questions: [], nextCursor: null, total: 0, strategyKey };
  }

  const take = Math.min(batchSize ?? BATCH_SIZE, MAX_BATCH_SIZE);

  try {
    const rows = await withRetry(() =>
      prisma.examQuestion.findMany({
        where: {
          status: "published",
          examStrategy: { in: strategyFilter },
        },
        select: {
          id: true,
          stem: true,
          options: true,
          correctAnswer: true,
          rationale: true,
          examStrategy: true,
          clinicalTrap: true,
          memoryHook: true,
          frameworkUsed: true,
          topic: true,
          difficulty: true,
        },
        orderBy: [{ difficulty: "asc" }, { id: "asc" }],
        cursor: { id: afterId },
        skip: 1, // skip the cursor item itself
        take,
      }),
    );

    const questions: StrategyQuestion[] = rows.map((r) => ({
      id: r.id,
      stem: r.stem,
      options: parseOptions(r.options),
      correctAnswer: parseCorrectAnswer(r.correctAnswer),
      rationale: r.rationale ?? null,
      examStrategy: r.examStrategy ?? null,
      clinicalTrap: r.clinicalTrap ?? null,
      memoryHook: r.memoryHook ?? null,
      frameworkUsed: r.frameworkUsed ?? null,
      topic: r.topic ?? null,
      difficulty: r.difficulty ?? null,
    }));

    const nextCursor = rows.length === take ? (rows[rows.length - 1]?.id ?? null) : null;

    return { questions, nextCursor, total: 0, strategyKey };
  } catch {
    return { questions: [], nextCursor: null, total: 0, strategyKey };
  }
}

/**
 * Load strategy question counts for the hub page.
 * Mirrors /api/questions/strategy-counts but as a server action for RSC.
 */
export async function loadStrategyCounts(): Promise<Record<string, number>> {
  const userId = await requireSubscriberUserId();
  if (!userId || !isDatabaseUrlConfigured()) return {};

  try {
    const rows = await withRetry(() =>
      prisma.examQuestion.groupBy({
        by: ["examStrategy"],
        where: {
          status: "published",
          examStrategy: { in: ALL_STRATEGY_KEYS as unknown as string[] },
        },
        _count: { _all: true },
      }),
    );

    return Object.fromEntries(
      rows
        .filter((r): r is typeof r & { examStrategy: StrategyKey } => r.examStrategy !== null)
        .map((r) => [r.examStrategy, r._count._all]),
    );
  } catch {
    return {};
  }
}
