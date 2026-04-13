"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  getStudyItemState,
  setStudyItemState,
  type StudyItemState,
} from "@/lib/flashcards/study-session-persistence";
import { resolveFlashcardRelatedLessonHref } from "@/lib/flashcards/flashcard-study-links";

export type ActiveStudyCard = {
  id: string;
  prompt: string;
  answer: string;
  explanation?: string;
  topic?: string | null;
  subtopic?: string | null;
  sourceKey?: string | null;
  pathwayId?: string | null;
  distractors?: Array<{ option: string; rationale: string }>;
};

export type ActiveStudyHeader = {
  sessionTitle: string;
  modeLabel: string;
  categoriesLabel: string;
  exitHref: string;
};

type Props = {
  cards: ActiveStudyCard[];
  header: ActiveStudyHeader;
  loading?: boolean;
  onRate?: (cardId: string, rating: "incorrect" | "unsure" | "known") => Promise<void>;
  onExit?: () => void;
};

const RATINGS: Array<{ id: "incorrect" | "unsure" | "known"; label: string }> = [
  { id: "incorrect", label: "Incorrect" },
  { id: "unsure", label: "Unsure" },
  { id: "known", label: "Known" },
];

function buildClinicalPearl(card: ActiveStudyCard): string {
  if (card.explanation?.trim()) {
    const firstSentence = card.explanation.split(".").map((part) => part.trim()).find(Boolean);
    if (firstSentence) return firstSentence.endsWith(".") ? firstSentence : `${firstSentence}.`;
  }
  if (card.topic?.trim()) {
    return `Anchor this concept to ${card.topic.trim()} priorities and choose the safest nursing action first.`;
  }
  return "Anchor this concept to patient safety priorities and first-action NCLEX judgment.";
}

export function ActiveStudySession({
  cards,
  header,
  loading = false,
  onRate,
  onExit,
}: Props) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [localState, setLocalState] = useState<Record<string, StudyItemState>>({});
  const [localNotes, setLocalNotes] = useState<Record<string, string>>({});

  const current = cards[index] ?? null;
  const progressLabel = `${Math.min(index + 1, Math.max(cards.length, 1))} of ${Math.max(cards.length, 1)}`;

  const itemState = useMemo(() => {
    if (!current) return {};
    const cached = localState[current.id];
    if (cached) return cached;
    return getStudyItemState(current.id);
  }, [current, localState]);

  const currentNote = current
    ? localNotes[current.id] ?? itemState.note ?? ""
    : "";

  const relatedLessonHref = current
    ? resolveFlashcardRelatedLessonHref({
        sourceKey: current.sourceKey,
        topic: current.topic,
        pathwayId: current.pathwayId,
      })
    : "/app/lessons";

  const applyItemState = (patch: Partial<StudyItemState>) => {
    if (!current) return;
    const next = setStudyItemState(current.id, patch);
    setLocalState((prev) => ({ ...prev, [current.id]: next }));
  };

  const goPrevious = () => {
    setIndex((prev) => Math.max(0, prev - 1));
    setRevealed(false);
  };

  const goNext = () => {
    setIndex((prev) => Math.min(cards.length - 1, prev + 1));
    setRevealed(false);
  };

  const submitRating = async (rating: "incorrect" | "unsure" | "known") => {
    if (!current) return;
    if (!revealed) return;
    setSaving(true);
    try {
      await onRate?.(current.id, rating);
    } finally {
      setSaving(false);
      goNext();
    }
  };

  if (loading) {
    return <div className="rounded-xl border border-border p-4 text-sm text-[var(--theme-muted-text)]">Preparing Study Session…</div>;
  }

  if (!current) {
    return (
      <div className="rounded-xl border border-border p-5 text-sm text-[var(--theme-muted-text)]">
        No items match this Study Session.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-border bg-[var(--theme-card-bg)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">Study Session</p>
            <h1 className="text-lg font-bold text-[var(--theme-heading-text)]">{header.sessionTitle}</h1>
            <p className="text-xs text-[var(--theme-muted-text)]">
              {progressLabel} · {header.modeLabel} · {header.categoriesLabel}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-[var(--theme-muted-text)]">
              Progress: {progressLabel}
            </span>
            <Link href={header.exitHref} onClick={onExit} className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-[var(--theme-heading-text)]">
              Exit Session
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,1fr)]">
        <div className="rounded-2xl border border-border bg-[var(--theme-card-bg)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">Prompt</p>
          <h2 className="mt-2 text-base font-semibold leading-snug text-[var(--theme-heading-text)]">{current.prompt}</h2>
          {(current.topic || current.subtopic) ? (
            <p className="mt-2 text-xs text-[var(--theme-muted-text)]">
              {current.topic ?? "General"}
              {current.subtopic ? ` · ${current.subtopic}` : ""}
            </p>
          ) : null}

          {!revealed ? (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="mt-4 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-[var(--theme-heading-text)]"
            >
              Reveal Answer
            </button>
          ) : (
            <div className="mt-4 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-cool)] p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">Correct Answer</p>
              <p className="mt-1 text-sm font-medium leading-relaxed text-[var(--theme-heading-text)]">{current.answer}</p>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button type="button" onClick={goPrevious} disabled={index <= 0} className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold disabled:opacity-40">
              Previous
            </button>
            <button type="button" onClick={goNext} disabled={!revealed || index + 1 >= cards.length} className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold disabled:opacity-40">
              Next
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {RATINGS.map((rating) => (
              <button
                key={rating.id}
                type="button"
                disabled={!revealed || saving}
                onClick={() => void submitRating(rating.id)}
                className="rounded-xl border border-border px-2 py-2 text-xs font-semibold text-[var(--theme-heading-text)] disabled:opacity-40"
              >
                {rating.label}
              </button>
            ))}
          </div>
        </div>

        <aside className="space-y-3">
          <div className={`rounded-2xl border border-border bg-[var(--theme-card-bg)] p-4 ${itemState.highlighted ? "ring-1 ring-[var(--semantic-brand)]" : ""}`}>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">Rationale</p>
            {!revealed ? (
              <p className="mt-2 text-sm text-[var(--theme-muted-text)]">Reveal the answer to see detailed rationale.</p>
            ) : (
              <div className="mt-2 space-y-3 text-sm">
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">1. Correct Answer</h3>
                  <p className="mt-1 font-medium text-[var(--theme-heading-text)]">{current.answer}</p>
                </section>
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">2. Why It Is Correct</h3>
                  <p className="mt-1 text-[var(--theme-heading-text)]">{current.explanation ?? "This response matches the core clinical concept and safest nursing action for the prompt."}</p>
                </section>
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">3. Why the Other Options Are Wrong</h3>
                  {current.distractors && current.distractors.length > 0 ? (
                    <ul className="mt-1 space-y-1 text-[var(--theme-heading-text)]">
                      {current.distractors.map((d) => (
                        <li key={d.option}>
                          <span className="font-semibold">{d.option}:</span> {d.rationale}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1 text-[var(--theme-muted-text)]">
                      This item uses active recall format without fixed distractors. Incorrect choices usually miss the key nursing priority in the answer.
                    </p>
                  )}
                </section>
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">4. Clinical Pearl / Exam Tip</h3>
                  <p className="mt-1 text-[var(--theme-heading-text)]">{buildClinicalPearl(current)}</p>
                </section>
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">5. Related Lesson Link</h3>
                  <Link href={relatedLessonHref} className="mt-1 inline-flex font-semibold text-[var(--semantic-brand)] underline underline-offset-2">
                    Review Lesson
                  </Link>
                </section>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-[var(--theme-card-bg)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">Item Actions</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" onClick={() => applyItemState({ starred: !itemState.starred })} className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-[var(--theme-heading-text)]">
                {itemState.starred ? "Starred" : "Star for Later"}
              </button>
              <button type="button" onClick={() => applyItemState({ saved: !itemState.saved })} className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-[var(--theme-heading-text)]">
                {itemState.saved ? "Saved" : "Save for Later"}
              </button>
              <button type="button" onClick={() => applyItemState({ confusing: !itemState.confusing })} className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-[var(--theme-heading-text)]">
                {itemState.confusing ? "Marked for Revisit" : "Mark as Confusing"}
              </button>
              <button type="button" onClick={() => applyItemState({ highlighted: !itemState.highlighted })} className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-[var(--theme-heading-text)]">
                {itemState.highlighted ? "Highlighted" : "Highlight Rationale"}
              </button>
            </div>
            <label className="mt-3 block text-xs font-semibold text-[var(--theme-muted-text)]">
              Personal Note
              <textarea
                value={currentNote}
                onChange={(event) => {
                  const value = event.target.value;
                  setLocalNotes((prev) => ({ ...prev, [current.id]: value }));
                  applyItemState({ note: value });
                }}
                rows={3}
                className="mt-1 w-full rounded-lg border border-border bg-[var(--theme-card-bg)] px-3 py-2 text-sm text-[var(--theme-heading-text)]"
                placeholder="Capture your nursing takeaway for this item."
              />
            </label>
          </div>
        </aside>
      </section>
    </div>
  );
}
