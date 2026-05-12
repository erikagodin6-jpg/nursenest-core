"use client";

import { useCallback, useRef } from "react";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import type { FlashcardRating } from "@/lib/flashcards/spaced-repetition";

/**
 * Session-level options passed once when the hook is created.
 * All are derived from stable session data (first-card pathwayId, etc.)
 * so they do not cause callback churn when the current card changes.
 */
export type FlashcardTelemetryOpts = {
  pathwayId?: string | null;
};

/**
 * Per-card clinical metadata threaded through every event.
 * Callers derive this from the current card without changing the hook opts.
 */
export type CardEventMeta = {
  itemKind?: string | null;
  /** Computed from the payload shape: "MCQ" | "SATA" | "plain" */
  questionType?: "MCQ" | "SATA" | "plain" | null;
  topic?: string | null;
  domain?: string | null;
  /** SRS segment the card came from */
  segment?: "new" | "due" | "overdue" | "lapsing" | null;
  /** Card was served because it matches an active remediation queue entry */
  remediationBoosted?: boolean;
  /** Detected from stem/topic: rhythm strip / 12-lead ECG question */
  ecgFlag?: boolean;
  /** Detected from stem/topic: bow-tie clinical judgment item */
  bowtieFlag?: boolean;
  /** Detected from stem/topic: laboratory-value interpretation */
  labFlag?: boolean;
};

/** Serialise CardEventMeta to flat PostHog-compatible props. */
function flattenMeta(meta: CardEventMeta | null | undefined): Record<string, string | number | boolean | undefined> {
  if (!meta) return {};
  return {
    item_kind: meta.itemKind ?? undefined,
    question_type: meta.questionType ?? undefined,
    topic: meta.topic ?? undefined,
    domain: meta.domain ?? undefined,
    segment: meta.segment ?? undefined,
    remediation_boosted: meta.remediationBoosted,
    ecg_flag: meta.ecgFlag,
    bowtie_flag: meta.bowtieFlag,
    lab_flag: meta.labFlag,
  };
}

/**
 * Detect ECG / bowtie / lab flags from card text or topic label.
 * Called at the call site to build CardEventMeta — not inside the hook.
 */
export function deriveCardFlags(opts: {
  topic?: string | null;
  questionStem?: string | null;
  sourceKey?: string | null;
}): Pick<CardEventMeta, "ecgFlag" | "bowtieFlag" | "labFlag"> {
  const haystack = [opts.topic, opts.questionStem, opts.sourceKey]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return {
    ecgFlag: /\becg\b|electrocardiogram|rhythm strip|12[\s-]?lead/.test(haystack),
    bowtieFlag: /\bbow[\s-]?tie\b/.test(haystack),
    labFlag:
      /\blab\b|laboratory|serum|creatinine|potassium|sodium|hemoglobin|hematocrit|wbc|rbc|platelet|troponin|bnp|inr\b/.test(
        haystack,
      ),
  };
}

/**
 * Tracks clinical flashcard study events via PostHog.
 *
 * Events:
 *   flashcard_reveal           — card flipped; includes dwell on front (reveal_dwell_ms)
 *   flashcard_rated            — Anki confidence button pressed
 *   answer_submitted           — MCQ/SATA answer committed (before reveal, or on SATA confirm)
 *   flashcard_distractor_expanded — wrong-answer details opened
 *   rationale_opened           — rationale section explicitly expanded post-reveal
 *   lesson_link_clicked        — internal study link clicked after reveal
 *   remediation_triggered      — card served from active remediation queue
 *
 * All events are fire-and-forget (never throws).
 * Deduplication: each (cardId, eventType) pair fires at most once per card lifecycle.
 */
export function useFlashcardStudyTelemetry(opts?: FlashcardTelemetryOpts) {
  const pathwayId = opts?.pathwayId;

  const frontShownAt = useRef<number | null>(null);
  const revealedAt = useRef<number | null>(null);

  // Deduplication guards — store last-fired card ID for reveal + rated events
  // so double-tap or rAF race conditions can't produce duplicate PostHog events.
  const lastRevealFiredFor = useRef<string | null>(null);
  const lastRatedFiredFor = useRef<string | null>(null);

  const onCardShown = useCallback(() => {
    frontShownAt.current = Date.now();
    revealedAt.current = null;
    // Reset dedup guards when the card changes
    lastRevealFiredFor.current = null;
    lastRatedFiredFor.current = null;
  }, []);

  const onReveal = useCallback(
    (cardId: string, meta?: CardEventMeta) => {
      if (lastRevealFiredFor.current === cardId) return;
      lastRevealFiredFor.current = cardId;

      const now = Date.now();
      const reveal_dwell_ms =
        frontShownAt.current != null ? now - frontShownAt.current : undefined;
      revealedAt.current = now;

      void trackClientEvent("flashcard_reveal", {
        card_id: cardId.slice(0, 24),
        reveal_dwell_ms,
        pathway_id: pathwayId ?? undefined,
        ...flattenMeta(meta),
      });
    },
    [pathwayId],
  );

  const onRated = useCallback(
    (cardId: string, rating: FlashcardRating, meta?: CardEventMeta) => {
      if (lastRatedFiredFor.current === cardId) return;
      lastRatedFiredFor.current = cardId;

      const dwell_reveal_ms =
        revealedAt.current != null ? Date.now() - revealedAt.current : undefined;

      void trackClientEvent("flashcard_rated", {
        card_id: cardId.slice(0, 24),
        confidence_level: rating,
        dwell_reveal_ms,
        pathway_id: pathwayId ?? undefined,
        ...flattenMeta(meta),
      });
    },
    [pathwayId],
  );

  const onAnswerSubmitted = useCallback(
    (
      cardId: string,
      opts: {
        selectedLetter?: string;
        selectedLetters?: string[];
        correctLetter?: string;
        correctLetters?: string[];
        isCorrect: boolean;
        meta?: CardEventMeta;
      },
    ) => {
      const { selectedLetter, selectedLetters, correctLetter, correctLetters, isCorrect, meta } = opts;

      // SATA partial accuracy: fraction of correct letters selected
      let sata_partial_accuracy: number | undefined;
      if (selectedLetters && correctLetters && correctLetters.length > 0) {
        const correctSelected = selectedLetters.filter((l) => correctLetters.includes(l)).length;
        sata_partial_accuracy = Math.round((correctSelected / correctLetters.length) * 100) / 100;
      }

      // distractor_selected: the wrong MCQ letter picked (undefined when correct)
      const distractor_selected =
        !isCorrect && selectedLetter && selectedLetter !== correctLetter
          ? selectedLetter
          : undefined;

      void trackClientEvent("answer_submitted", {
        card_id: cardId.slice(0, 24),
        is_correct: isCorrect,
        distractor_selected,
        sata_partial_accuracy,
        pathway_id: pathwayId ?? undefined,
        ...flattenMeta(meta),
      });
    },
    [pathwayId],
  );

  const onDistractorExpanded = useCallback(
    (cardId: string, opts?: { distractorLetter?: string; meta?: CardEventMeta }) => {
      void trackClientEvent("flashcard_distractor_expanded", {
        card_id: cardId.slice(0, 24),
        distractor_selected: opts?.distractorLetter,
        pathway_id: pathwayId ?? undefined,
        ...flattenMeta(opts?.meta),
      });
    },
    [pathwayId],
  );

  const onRationaleOpened = useCallback(
    (cardId: string, meta?: CardEventMeta) => {
      void trackClientEvent("rationale_opened", {
        card_id: cardId.slice(0, 24),
        pathway_id: pathwayId ?? undefined,
        ...flattenMeta(meta),
      });
    },
    [pathwayId],
  );

  const onLinkClicked = useCallback(
    (linkType: "lesson" | "practice_tests" | "topic_drill", cardId: string, meta?: CardEventMeta) => {
      void trackClientEvent("lesson_link_clicked", {
        link_type: linkType,
        card_id: cardId.slice(0, 24),
        pathway_id: pathwayId ?? undefined,
        ...flattenMeta(meta),
      });
    },
    [pathwayId],
  );

  const onRemediationTriggered = useCallback(
    (cardId: string, topic: string, priorityScore: number) => {
      void trackClientEvent("remediation_triggered", {
        card_id: cardId.slice(0, 24),
        topic,
        priority_score: priorityScore,
        pathway_id: pathwayId ?? undefined,
      });
    },
    [pathwayId],
  );

  return {
    onCardShown,
    onReveal,
    onRated,
    onAnswerSubmitted,
    onDistractorExpanded,
    onRationaleOpened,
    onLinkClicked,
    onRemediationTriggered,
  };
}
