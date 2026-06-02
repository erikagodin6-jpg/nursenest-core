"use client";

import { FileText, HeartPulse, ImageIcon, Microscope, Stethoscope } from "lucide-react";
import type { ReactNode } from "react";

export type LoftSimulationExhibitType =
  | "labs"
  | "ecg"
  | "imaging"
  | "clinical-note"
  | "assessment";

export type LoftSimulationExhibit = {
  id: string;
  title: string;
  type: LoftSimulationExhibitType;
  summary?: string | null;
  content?: ReactNode;
  active?: boolean;
};

function ExhibitIcon({ type }: { type: LoftSimulationExhibitType }) {
  switch (type) {
    case "labs":
      return <Microscope className="h-4 w-4" aria-hidden />;
    case "ecg":
      return <HeartPulse className="h-4 w-4" aria-hidden />;
    case "imaging":
      return <ImageIcon className="h-4 w-4" aria-hidden />;
    case "assessment":
      return <Stethoscope className="h-4 w-4" aria-hidden />;
    default:
      return <FileText className="h-4 w-4" aria-hidden />;
  }
}

export function LoftSimulationExhibitRail({
  exhibits,
  activeExhibitId,
  onSelectExhibit,
}: {
  exhibits: LoftSimulationExhibit[];
  activeExhibitId?: string | null;
  onSelectExhibit?: (exhibitId: string) => void;
}) {
  const active =
    exhibits.find((item) => item.id === activeExhibitId) ??
    exhibits.find((item) => item.active) ??
    exhibits[0] ??
    null;

  return (
    <aside
      className="nn-loft-exhibit-rail rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-surface)_96%,var(--semantic-panel-muted))] p-3 shadow-sm"
      data-nn-loft-exhibit-rail=""
      aria-label="Clinical exhibits and labs"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="m-0 text-xs font-bold uppercase tracking-[0.18em] text-[var(--semantic-text-muted)]">
            Clinical exhibits
          </p>
          <h2 className="mt-1 text-sm font-semibold text-[var(--semantic-text-primary)]">
            Persistent case materials
          </h2>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {exhibits.map((exhibit) => {
          const selected = exhibit.id === active?.id;
          return (
            <button
              key={exhibit.id}
              type="button"
              onClick={() => onSelectExhibit?.(exhibit.id)}
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition ${
                selected
                  ? "border-[color-mix(in_srgb,var(--semantic-brand)_55%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                  : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)] hover:border-[color-mix(in_srgb,var(--semantic-brand)_30%,var(--semantic-border-soft))]"
              }`}
            >
              <ExhibitIcon type={exhibit.type} />
              <span>{exhibit.title}</span>
            </button>
          );
        })}
      </div>

      {active ? (
        <div className="mt-4 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] text-[var(--semantic-text-primary)]">
              <ExhibitIcon type={active.type} />
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-[var(--semantic-text-primary)]">
                {active.title}
              </h3>
              {active.summary ? (
                <p className="mt-0.5 text-xs text-[var(--semantic-text-muted)]">
                  {active.summary}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-4 overflow-auto rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_65%,var(--semantic-surface))] p-3 text-sm text-[var(--semantic-text-secondary)]">
            {active.content ?? (
              <div className="space-y-2">
                <p className="m-0 font-medium text-[var(--semantic-text-primary)]">
                  Exhibit preview
                </p>
                <p className="m-0 text-[var(--semantic-text-muted)]">
                  Persistent clinical exhibits remain visible throughout LOFT simulations so learners can
                  reference labs, ECGs, assessment findings, and documentation while progressing through
                  fixed-form questions.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </aside>
  );
}
