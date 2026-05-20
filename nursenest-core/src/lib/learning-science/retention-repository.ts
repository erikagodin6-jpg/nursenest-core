import type {
  RetentionEvent,
  RetentionMemoryState,
} from "@/lib/learning-science/adaptive-retention-engine";
import type {
  AdaptiveSequenceRecommendation,
} from "@/lib/learning-science/adaptive-sequencing";

export type PersistedRetentionEvent = RetentionEvent & {
  id: string;
  userId: string;
};

export type PersistedReviewQueueItem = {
  id: string;
  userId: string;
  conceptId: string;
  priority: string;
  nextSurface: string;
  reason: string;
  dueAt: Date;
  completedAt: Date | null;
};

/**
 * Repository contract for adaptive learning persistence.
 *
 * Intentionally framework-agnostic so the same orchestration layer can be used by:
 * - ECG
 * - CAT
 * - flashcards
 * - simulations
 * - lessons
 * - future mobile apps
 */
export interface RetentionRepository {
  createRetentionEvent(event: PersistedRetentionEvent): Promise<void>;

  getRetentionEvents(input: {
    userId: string;
    conceptId?: string;
    limit?: number;
  }): Promise<readonly PersistedRetentionEvent[]>;

  getMemoryState(input: {
    userId: string;
    conceptId: string;
  }): Promise<RetentionMemoryState | null>;

  upsertMemoryState(input: {
    userId: string;
    state: RetentionMemoryState;
  }): Promise<void>;

  enqueueReviewRecommendation(input: {
    userId: string;
    recommendation: AdaptiveSequenceRecommendation;
    dueAt: Date;
  }): Promise<void>;

  getDueReviewQueue(input: {
    userId: string;
    limit?: number;
  }): Promise<readonly PersistedReviewQueueItem[]>;

  completeReviewQueueItem(input: {
    queueItemId: string;
    completedAt: Date;
  }): Promise<void>;
}

/**
 * In-memory fallback implementation for development and tests.
 *
 * Production should replace this with Prisma-backed persistence.
 */
export class InMemoryRetentionRepository implements RetentionRepository {
  private events: PersistedRetentionEvent[] = [];
  private states = new Map<string, RetentionMemoryState>();
  private queue: PersistedReviewQueueItem[] = [];

  async createRetentionEvent(event: PersistedRetentionEvent): Promise<void> {
    this.events.push(event);
  }

  async getRetentionEvents(input: {
    userId: string;
    conceptId?: string;
    limit?: number;
  }): Promise<readonly PersistedRetentionEvent[]> {
    return this.events
      .filter(
        (event) =>
          event.userId === input.userId &&
          (!input.conceptId || event.conceptId === input.conceptId),
      )
      .slice(0, input.limit ?? 50);
  }

  async getMemoryState(input: {
    userId: string;
    conceptId: string;
  }): Promise<RetentionMemoryState | null> {
    return this.states.get(`${input.userId}:${input.conceptId}`) ?? null;
  }

  async upsertMemoryState(input: {
    userId: string;
    state: RetentionMemoryState;
  }): Promise<void> {
    this.states.set(`${input.userId}:${input.state.conceptId}`, input.state);
  }

  async enqueueReviewRecommendation(input: {
    userId: string;
    recommendation: AdaptiveSequenceRecommendation;
    dueAt: Date;
  }): Promise<void> {
    this.queue.push({
      id: crypto.randomUUID(),
      userId: input.userId,
      conceptId: input.recommendation.conceptId,
      priority: input.recommendation.urgency,
      nextSurface: input.recommendation.nextSurface,
      reason: input.recommendation.reason,
      dueAt: input.dueAt,
      completedAt: null,
    });
  }

  async getDueReviewQueue(input: {
    userId: string;
    limit?: number;
  }): Promise<readonly PersistedReviewQueueItem[]> {
    return this.queue
      .filter((item) => item.userId === input.userId && item.completedAt === null)
      .slice(0, input.limit ?? 25);
  }

  async completeReviewQueueItem(input: {
    queueItemId: string;
    completedAt: Date;
  }): Promise<void> {
    this.queue = this.queue.map((item) =>
      item.id === input.queueItemId
        ? {
            ...item,
            completedAt: input.completedAt,
          }
        : item,
    );
  }
}
