"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import type { ClinicalSkillFlashcard } from "@/lib/clinical-skills/clinical-skills-enrichment";
import { cn } from "@/lib/utils";

export function ClinicalSkillsFlashcardReview({
  cards,
  reviewedIds,
  onReviewedChange,
}: {
  cards: ClinicalSkillFlashcard[];
  reviewedIds: string[];
  onReviewedChange: (ids: string[]) => void;
}) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!cards.length) return null;

  const card = cards[index]!;
  const reviewed = reviewedIds.includes(card.id);

  const go = (next: number) => {
    setIndex(next);
    setFlipped(false);
  };

  const markReviewed = () => {
    if (!reviewed) onReviewedChange([...reviewedIds, card.id]);
    setFlipped(true);
  };

  return (
    <div className="nn-clinical-skills-flashcard-deck">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-[var(--semantic-text-secondary)]">
          Card {index + 1} of {cards.length}
        </p>
        <span className="text-xs text-[var(--semantic-text-secondary)]">{reviewedIds.length} reviewed</span>
      </div>

      <button
        type="button"
        className={cn("nn-clinical-skills-flashcard-deck__card mt-3", flipped && "nn-clinical-skills-flashcard-deck__card--flipped")}
        onClick={() => {
          setFlipped((f) => !f);
          if (!flipped && !reviewed) onReviewedChange([...reviewedIds, card.id]);
        }}
        aria-pressed={flipped}
      >
        <div className="nn-clinical-skills-flashcard-deck__face nn-clinical-skills-flashcard-deck__face--front">
          <p className="text-xs font-semibold uppercase tracking-wide text-[color-mix(in_srgb,var(--semantic-brand)_80%,var(--semantic-text-secondary))]">Recall prompt</p>
          <p className="mt-3 text-base font-semibold leading-snug text-[var(--semantic-text-primary)] sm:text-lg">{card.front}</p>
          <p className="mt-4 text-xs text-[var(--semantic-text-secondary)]">Tap to reveal answer</p>
        </div>
        <div className="nn-clinical-skills-flashcard-deck__face nn-clinical-skills-flashcard-deck__face--back">
          <p className="text-xs font-semibold text-[var(--semantic-success)]">Clinical answer</p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--semantic-text-primary)]">{card.back}</p>
        </div>
      </button>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <button
            type="button"
            className="nn-clinical-skills-flashcard-deck__nav-btn"
            disabled={index === 0}
            onClick={() => go(index - 1)}
            aria-label="Previous card"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="nn-clinical-skills-flashcard-deck__nav-btn"
            disabled={index >= cards.length - 1}
            onClick={() => go(index + 1)}
            aria-label="Next card"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <button type="button" className="nn-clinical-skills-flashcard-deck__ghost-btn" onClick={() => setFlipped(false)}>
          <RotateCcw className="mr-1 inline h-3.5 w-3.5" aria-hidden />
          Flip to prompt
        </button>
        <button type="button" className="nn-clinical-skills-flashcard-deck__mark-btn" onClick={markReviewed} disabled={reviewed}>
          {reviewed ? "Saved for retention" : "Mark reviewed"}
        </button>
      </div>
    </div>
  );
}
