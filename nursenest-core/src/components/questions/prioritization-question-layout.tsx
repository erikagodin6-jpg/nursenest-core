"use client";

import { useCallback, useId, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  GripVertical,
  ListOrdered,
  User,
  XCircle,
} from "lucide-react";

/* ── Types ──────────────────────────────────────────────────────────────────── */

export type PriorityItem = {
  id: string;
  label: string;
  /** Correct rank (1 = highest priority) */
  correctRank: number;
  /** Optional rationale shown after reveal */
  rationale?: string;
};

export type PrioritizationQuestionProps = {
  questionStem: string;
  instruction?: string;
  patientVignette?: string | null;
  items: PriorityItem[];
  revealed?: boolean;
  onSubmit?: (orderedIds: string[]) => void;
  /** Controlled order — array of item IDs from highest to lowest priority */
  order?: string[];
};

/* ── Helpers ────────────────────────────────────────────────────────────────── */

function scoreOrder(items: PriorityItem[], orderedIds: string[]): { correct: number; total: number } {
  let correct = 0;
  orderedIds.forEach((id, idx) => {
    const item = items.find((i) => i.id === id);
    if (item && item.correctRank === idx + 1) correct++;
  });
  return { correct, total: items.length };
}

/* ── Mobile tap-to-rank ─────────────────────────────────────────────────────── */

function PriorityMobile({
  items,
  orderedIds,
  revealed,
  onMoveUp,
  onMoveDown,
}: {
  items: PriorityItem[];
  orderedIds: string[];
  revealed: boolean;
  onMoveUp: (idx: number) => void;
  onMoveDown: (idx: number) => void;
}) {
  return (
    <div className="nn-priority-workspace sm:hidden">
      {orderedIds.map((id, idx) => {
        const item = items.find((i) => i.id === id);
        if (!item) return null;
        const isPlaced    = true;
        const isCorrect   = revealed && item.correctRank === idx + 1;
        const isIncorrect = revealed && item.correctRank !== idx + 1;
        const correctPos  = revealed ? `Correct position: ${item.correctRank}` : "";
        return (
          <div
            key={id}
            className={`nn-priority-item ${isCorrect ? "nn-priority-item--correct" : ""} ${isIncorrect ? "nn-priority-item--incorrect" : ""}`}
          >
            {/* Rank badge */}
            <span className={`nn-priority-item__rank ${isPlaced ? "nn-priority-item--placed" : ""}`}>
              {idx + 1}
            </span>

            {/* Text */}
            <span className="nn-priority-item__text">{item.label}</span>

            {/* Result icon */}
            {revealed ? (
              isCorrect
                ? <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[var(--semantic-success)]" aria-hidden />
                : <XCircle      className="h-4 w-4 flex-shrink-0 text-[var(--semantic-danger)]"  aria-hidden />
            ) : null}

            {/* Move controls (hidden when revealed) */}
            {!revealed ? (
              <div className="nn-priority-item__controls">
                <button
                  type="button"
                  aria-label={`Move "${item.label}" up`}
                  disabled={idx === 0}
                  className="nn-priority-move-btn"
                  onClick={() => onMoveUp(idx)}
                >
                  <ArrowUp className="h-3 w-3" aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label={`Move "${item.label}" down`}
                  disabled={idx === orderedIds.length - 1}
                  className="nn-priority-move-btn"
                  onClick={() => onMoveDown(idx)}
                >
                  <ArrowDown className="h-3 w-3" aria-hidden />
                </button>
              </div>
            ) : null}
          </div>
        );
      })}

      {/* After reveal: show correct order if different */}
      {revealed ? (
        <div className="mt-3 rounded-[0.8rem] border border-[color-mix(in_srgb,var(--semantic-border-soft)_65%,transparent)] bg-[var(--semantic-surface)] p-3">
          <p className="text-xs font-[800] uppercase tracking-[0.1em] text-[var(--semantic-text-muted)] mb-2">
            Correct Priority Order
          </p>
          {[...items].sort((a, b) => a.correctRank - b.correctRank).map((item) => (
            <div key={item.id} className="flex items-start gap-2 py-1.5 border-b border-[color-mix(in_srgb,var(--semantic-border-soft)_50%,transparent)] last:border-b-0">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--semantic-brand)] text-white text-[0.65rem] font-[800] flex-shrink-0">
                {item.correctRank}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-[600] text-[var(--semantic-text-primary)] leading-tight">{item.label}</p>
                {item.rationale ? (
                  <p className="text-xs text-[var(--semantic-text-secondary)] mt-0.5 leading-relaxed">{item.rationale}</p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* ── Desktop drag-and-drop ──────────────────────────────────────────────────── */

function PriorityDesktop({
  items,
  orderedIds,
  revealed,
  onDragEnd,
  onMoveUp,
  onMoveDown,
}: {
  items: PriorityItem[];
  orderedIds: string[];
  revealed: boolean;
  onDragEnd: (fromIdx: number, toIdx: number) => void;
  onMoveUp: (idx: number) => void;
  onMoveDown: (idx: number) => void;
}) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  return (
    <div
      className="nn-priority-workspace max-sm:hidden"
      role="list"
      aria-label="Drag to rank items from highest to lowest priority"
    >
      {orderedIds.map((id, idx) => {
        const item      = items.find((i) => i.id === id);
        if (!item) return null;
        const isCorrect   = revealed && item.correctRank === idx + 1;
        const isIncorrect = revealed && item.correctRank !== idx + 1;
        const isDragging  = dragIdx === idx;
        const isOver      = overIdx === idx;
        return (
          <div
            key={id}
            role="listitem"
            draggable={!revealed}
            aria-grabbed={isDragging}
            className={`nn-priority-item ${isCorrect ? "nn-priority-item--correct" : ""} ${isIncorrect ? "nn-priority-item--incorrect" : ""} ${isDragging ? "nn-priority-item--dragging" : ""} ${isOver && !isDragging ? "outline outline-2 outline-offset-2 outline-[var(--semantic-brand)]" : ""}`}
            onDragStart={() => setDragIdx(idx)}
            onDragOver={(e) => { e.preventDefault(); setOverIdx(idx); }}
            onDragLeave={() => setOverIdx(null)}
            onDrop={() => {
              if (dragIdx !== null && dragIdx !== idx) onDragEnd(dragIdx, idx);
              setDragIdx(null);
              setOverIdx(null);
            }}
            onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
          >
            {!revealed ? (
              <span className="nn-priority-item__handle" aria-hidden>
                <GripVertical className="h-4 w-4" />
              </span>
            ) : null}
            <span className="nn-priority-item__rank nn-priority-item--placed">{idx + 1}</span>
            <span className="nn-priority-item__text">{item.label}</span>
            {revealed ? (
              <div className="ml-auto flex items-center gap-2 flex-shrink-0">
                {isCorrect
                  ? <CheckCircle2 className="h-4 w-4 text-[var(--semantic-success)]" aria-hidden />
                  : <span className="text-xs text-[var(--semantic-danger)] font-[700]">
                      Correct: #{item.correctRank}
                    </span>}
              </div>
            ) : (
              <div className="nn-priority-item__controls ml-auto">
                <button
                  type="button"
                  aria-label={`Move up`}
                  disabled={idx === 0}
                  className="nn-priority-move-btn"
                  onClick={() => onMoveUp(idx)}
                >
                  <ArrowUp className="h-3 w-3" aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label={`Move down`}
                  disabled={idx === orderedIds.length - 1}
                  className="nn-priority-move-btn"
                  onClick={() => onMoveDown(idx)}
                >
                  <ArrowDown className="h-3 w-3" aria-hidden />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────────── */

export function PrioritizationQuestionLayout({
  questionStem,
  instruction = "Rank the following from highest to lowest priority.",
  patientVignette,
  items,
  revealed = false,
  onSubmit,
  order: controlledOrder,
}: PrioritizationQuestionProps) {
  const [internalOrder, setInternalOrder] = useState<string[]>(
    () => [...items].sort(() => Math.random() - 0.5).map((i) => i.id),
  );
  const orderedIds = controlledOrder ?? internalOrder;

  const swap = useCallback((idxA: number, idxB: number) => {
    setInternalOrder((prev) => {
      const next = [...prev];
      [next[idxA], next[idxB]] = [next[idxB], next[idxA]];
      return next;
    });
  }, []);

  const moveUp   = useCallback((idx: number) => { if (idx > 0)                      swap(idx, idx - 1); }, [swap]);
  const moveDown = useCallback((idx: number) => { if (idx < items.length - 1)        swap(idx, idx + 1); }, [items.length, swap]);
  const dragEnd  = useCallback((from: number, to: number) => {
    setInternalOrder((prev) => {
      const next = [...prev];
      const [removed] = next.splice(from, 1);
      next.splice(to, 0, removed);
      return next;
    });
  }, []);

  const score = revealed ? scoreOrder(items, orderedIds) : null;

  return (
    <div className="nn-prioritization-question flex flex-col gap-4">
      {/* Badge */}
      <div className="nn-aqt-badge">
        <div className="nn-aqt-badge__icon">
          <ListOrdered className="h-4 w-4" aria-hidden />
        </div>
        <span className="nn-aqt-badge__label">Prioritization</span>
      </div>

      {/* Stem */}
      <div>
        <p className="text-lg font-bold leading-snug text-[var(--semantic-text-primary)]">{questionStem}</p>
        <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">{instruction}</p>
      </div>

      {/* Patient vignette */}
      {patientVignette ? (
        <div className="nn-aqt-patient-card">
          <div className="nn-aqt-patient-card__icon" aria-hidden><User className="h-3.5 w-3.5" /></div>
          <div>
            <span className="nn-aqt-patient-card__label">Patient</span>
            <p className="nn-aqt-patient-card__text">{patientVignette}</p>
          </div>
        </div>
      ) : null}

      {/* Desktop drag list */}
      <PriorityDesktop
        items={items}
        orderedIds={orderedIds}
        revealed={revealed}
        onDragEnd={dragEnd}
        onMoveUp={moveUp}
        onMoveDown={moveDown}
      />

      {/* Mobile tap list */}
      <PriorityMobile
        items={items}
        orderedIds={orderedIds}
        revealed={revealed}
        onMoveUp={moveUp}
        onMoveDown={moveDown}
      />

      {/* Score */}
      {score ? (
        <div className={`nn-aqt-feedback-banner ${score.correct === score.total ? "nn-aqt-feedback-banner--success" : score.correct >= score.total / 2 ? "nn-aqt-feedback-banner--partial" : "nn-aqt-feedback-banner--error"}`}>
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" aria-hidden />
          <span>
            {score.correct === score.total
              ? "Perfect prioritization — all items in the correct order."
              : `${score.correct} of ${score.total} items in the correct position.`}
          </span>
        </div>
      ) : null}

      {/* Submit */}
      {!revealed && onSubmit ? (
        <button
          type="button"
          className="inline-flex w-full min-h-[3rem] items-center justify-center gap-2 rounded-[0.8rem] border border-[color-mix(in_srgb,var(--semantic-brand)_48%,var(--semantic-border-soft))] bg-[var(--semantic-brand)] text-white text-sm font-[750] shadow-[0_6px_18px_-8px_color-mix(in_srgb,var(--semantic-brand)_48%,transparent)] transition-opacity hover:opacity-95"
          onClick={() => onSubmit(orderedIds)}
        >
          Submit Priority Order
        </button>
      ) : null}
    </div>
  );
}
