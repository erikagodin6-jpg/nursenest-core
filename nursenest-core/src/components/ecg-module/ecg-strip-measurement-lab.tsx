"use client";

import { useCallback, useState } from "react";
import { Ruler } from "lucide-react";
import { cn } from "@/lib/utils";

export type EcgMeasurementTarget = {
  id: string;
  label: string;
  expectedSmallBoxes: number;
  tolerance: number;
  rationale: string;
};

const DEFAULT_TARGETS: EcgMeasurementTarget[] = [
  {
    id: "pr",
    label: "PR interval",
    expectedSmallBoxes: 4,
    tolerance: 1,
    rationale: "Normal PR is 3–5 small boxes (0.12–0.20 s). Measure from start of P to start of QRS.",
  },
  {
    id: "qrs",
    label: "QRS duration",
    expectedSmallBoxes: 2,
    tolerance: 1,
    rationale: "Narrow QRS is ≤3 small boxes (0.12 s). Wide complex suggests ventricular origin or bundle branch block.",
  },
];

export function EcgStripMeasurementLab({
  targets = DEFAULT_TARGETS,
  onMeasured,
}: {
  targets?: EcgMeasurementTarget[];
  onMeasured?: (correct: boolean) => void;
}) {
  const [activeTarget, setActiveTarget] = useState(targets[0]?.id ?? "pr");
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragEnd, setDragEnd] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [validated, setValidated] = useState<boolean | null>(null);

  const target = targets.find((t) => t.id === activeTarget) ?? targets[0]!;
  const measuredBoxes = dragStart != null && dragEnd != null ? Math.max(1, Math.round(Math.abs(dragEnd - dragStart))) : null;

  const validate = useCallback(() => {
    if (measuredBoxes == null || !target) return;
    const diff = Math.abs(measuredBoxes - target.expectedSmallBoxes);
    const ok = diff <= target.tolerance;
    setValidated(ok);
    setFeedback(
      ok
        ? `Correct — ${target.label} ≈ ${target.expectedSmallBoxes} small boxes. ${target.rationale}`
        : `Not quite — you measured ${measuredBoxes} small boxes; target is about ${target.expectedSmallBoxes}. ${target.rationale}`,
    );
    onMeasured?.(ok);
  }, [measuredBoxes, onMeasured, target]);

  return (
    <section className="nn-ecg-measurement-lab" aria-label="Interval measurement practice">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">
          <Ruler className="h-3.5 w-3.5" aria-hidden />
          Interactive measurement lab
        </p>
        <div className="flex gap-1">
          {targets.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setActiveTarget(t.id);
                setDragStart(null);
                setDragEnd(null);
                setFeedback(null);
                setValidated(null);
              }}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[10px] font-semibold",
                activeTarget === t.id
                  ? "border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))]"
                  : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)]",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-2 text-xs text-[var(--semantic-text-secondary)]">
        Pause the strip above, then click two points on the grid to measure {target.label} in small boxes (each small box = 0.04 s).
      </p>
      <div
        className="nn-ecg-measurement-lab__grid mt-3"
        role="application"
        aria-label="Measurement grid"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const box = Math.round((x / rect.width) * 24);
          if (dragStart == null) setDragStart(box);
          else {
            setDragEnd(box);
            setFeedback(null);
            setValidated(null);
          }
        }}
      >
        {dragStart != null ? (
          <span
            className="nn-ecg-measurement-lab__marker nn-ecg-measurement-lab__marker--start"
            style={{ left: `${(dragStart / 24) * 100}%` }}
          />
        ) : null}
        {dragEnd != null ? (
          <span
            className="nn-ecg-measurement-lab__marker nn-ecg-measurement-lab__marker--end"
            style={{ left: `${(dragEnd / 24) * 100}%` }}
          />
        ) : null}
        {measuredBoxes != null ? (
          <span className="nn-ecg-measurement-lab__count">{measuredBoxes} small boxes</span>
        ) : null}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className="nn-ecg-measurement-lab__btn" onClick={validate} disabled={measuredBoxes == null}>
          Validate measurement
        </button>
        <button
          type="button"
          className="nn-ecg-measurement-lab__btn nn-ecg-measurement-lab__btn--ghost"
          onClick={() => {
            setDragStart(null);
            setDragEnd(null);
            setFeedback(null);
            setValidated(null);
          }}
        >
          Reset
        </button>
      </div>
      {feedback ? (
        <p
          className={cn(
            "mt-3 rounded-lg border px-3 py-2 text-sm",
            validated
              ? "border-[color-mix(in_srgb,var(--semantic-success)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))] text-[var(--semantic-text-secondary)]"
              : "border-[color-mix(in_srgb,var(--semantic-warning)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_10%,var(--semantic-surface))] text-[var(--semantic-text-secondary)]",
          )}
        >
          {feedback}
        </p>
      ) : null}
    </section>
  );
}
