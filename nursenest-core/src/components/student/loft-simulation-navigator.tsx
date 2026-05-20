"use client";

import { Flag, Grid3X3, ListChecks } from "lucide-react";

export type LoftSimulationNavigatorItemState = "current" | "answered" | "flagged" | "unanswered";

export type LoftSimulationNavigatorItem = {
  id: string;
  index: number;
  label?: string | null;
  section?: string | null;
  state: LoftSimulationNavigatorItemState;
};

export function LoftSimulationNavigator({
  items,
  currentIndex,
  answeredCount,
  flaggedCount,
  total,
  onSelect,
}: {
  items: LoftSimulationNavigatorItem[];
  currentIndex: number;
  answeredCount: number;
  flaggedCount: number;
  total: number;
  onSelect?: (index: number) => void;
}) {
  const sectionLabels = Array.from(new Set(items.map((item) => item.section).filter(Boolean) as string[]));
  return (
    <aside
      className="nn-loft-navigator rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-surface)_94%,var(--semantic-panel-muted))] p-3 shadow-sm"
      data-nn-loft-navigator=""
      aria-label="LOFT simulation navigator"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="m-0 text-xs font-bold uppercase tracking-[0.18em] text-[var(--semantic-text-muted)]">
            Simulation map
          </p>
          <h2 className="mt-1 text-sm font-semibold text-[var(--semantic-text-primary)]">
            Review &amp; progress
          </h2>
        </div>
        <Grid3X3 className="h-4 w-4 shrink-0 text-[var(--semantic-text-muted)]" aria-hidden />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-2 py-2">
          <p className="m-0 font-semibold tabular-nums text-[var(--semantic-text-primary)]">{answeredCount}</p>
          <p className="m-0 text-[var(--semantic-text-muted)]">Answered</p>
        </div>
        <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-2 py-2">
          <p className="m-0 font-semibold tabular-nums text-[var(--semantic-text-primary)]">{flaggedCount}</p>
          <p className="m-0 text-[var(--semantic-text-muted)]">Flagged</p>
        </div>
        <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-2 py-2">
          <p className="m-0 font-semibold tabular-nums text-[var(--semantic-text-primary)]">{total}</p>
          <p className="m-0 text-[var(--semantic-text-muted)]">Total</p>
        </div>
      </div>

      {sectionLabels.length > 0 ? (
        <div className="mt-3 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-3 py-2 text-xs text-[var(--semantic-text-secondary)]">
          <div className="flex items-center gap-2 font-semibold text-[var(--semantic-text-primary)]">
            <ListChecks className="h-3.5 w-3.5" aria-hidden />
            Sections
          </div>
          <p className="mt-1 line-clamp-2">{sectionLabels.join(" · ")}</p>
        </div>
      ) : null}

      <div className="mt-3 grid grid-cols-5 gap-1.5" role="list" aria-label="Question navigation grid">
        {items.map((item) => {
          const selected = item.index === currentIndex || item.state === "current";
          const flagged = item.state === "flagged";
          return (
            <button
              key={item.id}
              type="button"
              role="listitem"
              aria-current={selected ? "step" : undefined}
              aria-label={`Question ${item.index + 1}${flagged ? ", flagged" : ""}`}
              className={`nn-loft-navigator__item inline-flex min-h-9 items-center justify-center rounded-lg border text-xs font-semibold tabular-nums transition ${
                selected
                  ? "border-[color-mix(in_srgb,var(--semantic-brand)_58%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_14%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                  : item.state === "answered"
                    ? "border-[color-mix(in_srgb,var(--semantic-success)_32%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_8%,var(--semantic-surface))] text-[var(--semantic-text-secondary)]"
                    : flagged
                      ? "border-[color-mix(in_srgb,var(--semantic-warning)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_10%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                      : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-muted)]"
              }`}
              onClick={() => onSelect?.(item.index)}
            >
              <span>{item.index + 1}</span>
              {flagged ? <Flag className="ml-1 h-3 w-3" aria-hidden /> : null}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
