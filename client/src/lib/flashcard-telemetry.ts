/**
 * Flashcard Telemetry
 *
 * Tracks every learner interaction during a flashcard session.  All events
 * are forwarded to Google Analytics 4 (gtag) using the same pattern as the
 * rest of the app's analytics-tracker.  Events are fire-and-forget; telemetry
 * failures never block the study session.
 *
 * Usage:
 *   import { flashcardTelemetry } from "@/lib/flashcard-telemetry";
 *   flashcardTelemetry.answered({ ... });
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function emit(eventName: string, params: Record<string, unknown>): void {
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    }
  } catch {
    // Never let telemetry crash the UI
  }
}

export interface FlashcardSessionContext {
  sessionId: string;
  userId?: string;
  tier?: string;
  sessionLength: number; // total cards in session
}

export interface FlashcardCardContext {
  cardId: string;
  questionId?: string;
  cardType: "question" | "term" | string;
  topic?: string;
  category?: string;
  sessionIndex: number; // 0-based position within the session
}

// ─── Event types ─────────────────────────────────────────────────────────────

export const flashcardTelemetry = {

  /** User opened the flashcard session (session started). */
  sessionOpened(ctx: FlashcardSessionContext): void {
    emit("flashcard_session_opened", {
      session_id: ctx.sessionId,
      user_id: ctx.userId,
      tier: ctx.tier,
      session_length: ctx.sessionLength,
    });
  },

  /** User answered a question-type card (selected an option). */
  answered(ctx: FlashcardSessionContext & FlashcardCardContext & {
    selectedIndex: number;
    isCorrect: boolean;
    timeToAnswerMs?: number;
  }): void {
    emit("flashcard_answered", {
      session_id: ctx.sessionId,
      user_id: ctx.userId,
      tier: ctx.tier,
      card_id: ctx.cardId,
      card_type: ctx.cardType,
      topic: ctx.topic ?? ctx.category,
      session_index: ctx.sessionIndex,
      is_correct: ctx.isCorrect,
      time_to_answer_ms: ctx.timeToAnswerMs,
    });
  },

  /** User viewed the rationale panel after answering. */
  rationaleViewed(ctx: FlashcardSessionContext & FlashcardCardContext): void {
    emit("flashcard_rationale_viewed", {
      session_id: ctx.sessionId,
      user_id: ctx.userId,
      card_id: ctx.cardId,
      topic: ctx.topic ?? ctx.category,
      session_index: ctx.sessionIndex,
    });
  },

  /** User selected a difficulty rating (Again/Hard/Good/Easy). */
  ratingSelected(ctx: FlashcardSessionContext & FlashcardCardContext & {
    rating: "again" | "hard" | "good" | "easy";
    isCorrect?: boolean;
  }): void {
    emit("flashcard_rating_selected", {
      session_id: ctx.sessionId,
      user_id: ctx.userId,
      tier: ctx.tier,
      card_id: ctx.cardId,
      card_type: ctx.cardType,
      topic: ctx.topic ?? ctx.category,
      session_index: ctx.sessionIndex,
      rating: ctx.rating,
      is_correct: ctx.isCorrect,
    });
  },

  /** User selected a confidence level (adaptive mode). */
  confidenceSelected(ctx: FlashcardSessionContext & FlashcardCardContext & {
    confidence: string;
  }): void {
    emit("flashcard_confidence_selected", {
      session_id: ctx.sessionId,
      user_id: ctx.userId,
      card_id: ctx.cardId,
      topic: ctx.topic ?? ctx.category,
      session_index: ctx.sessionIndex,
      confidence: ctx.confidence,
    });
  },

  /** Card advanced via SM2 rating or confidence auto-advance. */
  autoAdvanced(ctx: FlashcardSessionContext & FlashcardCardContext & {
    trigger: "sm2_rating" | "confidence_auto";
  }): void {
    emit("flashcard_auto_advanced", {
      session_id: ctx.sessionId,
      user_id: ctx.userId,
      card_id: ctx.cardId,
      session_index: ctx.sessionIndex,
      trigger: ctx.trigger,
    });
  },

  /** User clicked the "Next Card" button in the toolbar. */
  manualNext(ctx: FlashcardSessionContext & FlashcardCardContext): void {
    emit("flashcard_manual_next", {
      session_id: ctx.sessionId,
      user_id: ctx.userId,
      card_id: ctx.cardId,
      session_index: ctx.sessionIndex,
    });
  },

  /** User clicked the "Prev Card" button in the toolbar. */
  manualPrev(ctx: FlashcardSessionContext & FlashcardCardContext): void {
    emit("flashcard_manual_prev", {
      session_id: ctx.sessionId,
      user_id: ctx.userId,
      card_id: ctx.cardId,
      session_index: ctx.sessionIndex,
    });
  },

  /** User navigated forward via keyboard (ArrowRight / Enter / Space). */
  keyboardNext(ctx: FlashcardSessionContext & FlashcardCardContext & {
    key: string;
  }): void {
    emit("flashcard_keyboard_next", {
      session_id: ctx.sessionId,
      user_id: ctx.userId,
      card_id: ctx.cardId,
      session_index: ctx.sessionIndex,
      key: ctx.key,
    });
  },

  /** User navigated backward via keyboard (ArrowLeft). */
  keyboardPrev(ctx: FlashcardSessionContext & FlashcardCardContext & {
    key: string;
  }): void {
    emit("flashcard_keyboard_prev", {
      session_id: ctx.sessionId,
      user_id: ctx.userId,
      card_id: ctx.cardId,
      session_index: ctx.sessionIndex,
      key: ctx.key,
    });
  },

  /** All cards in the session were completed. */
  sessionCompleted(ctx: FlashcardSessionContext & {
    cardsAnswered: number;
    cardsSkipped: number;
    againCount: number;
    hardCount: number;
    goodCount: number;
    easyCount: number;
    correctCount: number;
    durationMs: number;
  }): void {
    emit("flashcard_session_completed", {
      session_id: ctx.sessionId,
      user_id: ctx.userId,
      tier: ctx.tier,
      session_length: ctx.sessionLength,
      cards_answered: ctx.cardsAnswered,
      cards_skipped: ctx.cardsSkipped,
      again_count: ctx.againCount,
      hard_count: ctx.hardCount,
      good_count: ctx.goodCount,
      easy_count: ctx.easyCount,
      correct_count: ctx.correctCount,
      duration_ms: ctx.durationMs,
      completion_rate: ctx.sessionLength > 0
        ? Math.round((ctx.cardsAnswered / ctx.sessionLength) * 100)
        : 0,
    });
  },

  /** User exited the session before completing all cards. */
  sessionAbandoned(ctx: FlashcardSessionContext & {
    cardReachedIndex: number;
    cardsAnswered: number;
    durationMs: number;
  }): void {
    emit("flashcard_session_abandoned", {
      session_id: ctx.sessionId,
      user_id: ctx.userId,
      tier: ctx.tier,
      session_length: ctx.sessionLength,
      card_reached_index: ctx.cardReachedIndex,
      cards_answered: ctx.cardsAnswered,
      duration_ms: ctx.durationMs,
      completion_rate: ctx.sessionLength > 0
        ? Math.round((ctx.cardReachedIndex / ctx.sessionLength) * 100)
        : 0,
    });
  },
};
