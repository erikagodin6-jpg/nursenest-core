"use client";

import { useCallback, useRef } from "react";
import { trackClientEvent } from "@/lib/observability/posthog-client";
import type { FlashcardRating } from "@/lib/flashcards/spaced-repetition";

/**
 * Tracks key flashcard study events via PostHog.
 *
 * Events:
 *   flashcard_reveal        — card flipped; includes dwell time on front (ms)
 *   flashcard_rated         — confidence button pressed; includes rating + dwell since reveal
 *   flashcard_link_clicked  — internal study link clicked after reveal
 *   flashcard_distractor_expanded — wrong-answer menu opened on mobile
 *
 * All events are best-effort (fire-and-forget, never throws).
 */
export function useFlashcardStudyTelemetry(opts?: { pathwayId?: string | null; itemKind?: string | null }) {
  const frontShownAt = useRef<number | null>(null);
  const revealedAt = useRef<number | null>(null);

  const onCardShown = useCallback(() => {
    frontShownAt.current = Date.now();
    revealedAt.current = null;
  }, []);

  const onReveal = useCallback(
    (cardId: string) => {
      const now = Date.now();
      const dwellFrontMs = frontShownAt.current != null ? now - frontShownAt.current : undefined;
      revealedAt.current = now;
      void trackClientEvent("flashcard_reveal", {
        card_id: cardId.slice(0, 24),
        dwell_front_ms: dwellFrontMs,
        pathway_id: opts?.pathwayId ?? undefined,
        item_kind: opts?.itemKind ?? undefined,
      });
    },
    [opts?.pathwayId, opts?.itemKind],
  );

  const onRated = useCallback(
    (cardId: string, rating: FlashcardRating) => {
      const dwellRevealMs = revealedAt.current != null ? Date.now() - revealedAt.current : undefined;
      void trackClientEvent("flashcard_rated", {
        card_id: cardId.slice(0, 24),
        rating,
        dwell_reveal_ms: dwellRevealMs,
        pathway_id: opts?.pathwayId ?? undefined,
        item_kind: opts?.itemKind ?? undefined,
      });
    },
    [opts?.pathwayId, opts?.itemKind],
  );

  const onLinkClicked = useCallback(
    (linkType: "lesson" | "practice_tests" | "topic_drill", cardId: string) => {
      void trackClientEvent("flashcard_link_clicked", {
        link_type: linkType,
        card_id: cardId.slice(0, 24),
        pathway_id: opts?.pathwayId ?? undefined,
      });
    },
    [opts?.pathwayId],
  );

  const onDistractorExpanded = useCallback(
    (cardId: string) => {
      void trackClientEvent("flashcard_distractor_expanded", {
        card_id: cardId.slice(0, 24),
        pathway_id: opts?.pathwayId ?? undefined,
      });
    },
    [opts?.pathwayId],
  );

  return { onCardShown, onReveal, onRated, onLinkClicked, onDistractorExpanded };
}
