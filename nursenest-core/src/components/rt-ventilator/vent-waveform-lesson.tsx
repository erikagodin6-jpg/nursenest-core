"use client";

/**
 * VentWaveformLesson — full educational lesson wrapper for a ventilator waveform template.
 *
 * Combines:
 *   - The 3-panel scalar display (pressure, flow, volume)
 *   - Recognition criteria checklist
 *   - Physiology explanation
 *   - Intervention guidance
 *   - Exam trap callouts (NCLEX / RT board)
 *   - Urgency badge
 *
 * Used in the waveforms sub-pages and simulation scenarios.
 */

import { useMemo, useState } from "react";
import { VentScalarDisplay } from "@/components/rt-ventilator/vent-scalar-display";
import { generateVentWaveform } from "@/lib/rt-ventilator/vent-waveform-generator";
import type { VentTemplate } from "@/lib/rt-ventilator/vent-waveform-templates";
import { VENT_URGENCY_LABELS, VENT_CATEGORY_LABELS } from "@/lib/rt-ventilator/vent-waveform-templates";

// ─── Urgency badge ─────────────────────────────────────────────────────────────

const URGENCY_STYLES = {
  routine: "bg-[color-mix(in_srgb,var(--semantic-info)_12%,transparent)] text-[var(--semantic-info)] border-[color-mix(in_srgb,var(--semantic-info)_30%,transparent)]",
  monitor: "bg-[color-mix(in_srgb,var(--semantic-brand)_12%,transparent)] text-[var(--semantic-brand)] border-[color-mix(in_srgb,var(--semantic-brand)_30%,transparent)]",
  act_now: "bg-[color-mix(in_srgb,var(--semantic-warning)_14%,transparent)] text-[var(--semantic-warning)] border-[color-mix(in_srgb,var(--semantic-warning)_35%,transparent)]",
  emergency: "bg-[color-mix(in_srgb,var(--semantic-error)_14%,transparent)] text-[var(--semantic-error)] border-[color-mix(in_srgb,var(--semantic-error)_35%,transparent)]",
};

// ─── Collapsible section ────────────────────────────────────────────────────────

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)]">
      <button
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-[var(--semantic-text-primary)]">{title}</span>
        <span className="text-[var(--semantic-text-muted)]" aria-hidden>
          {open ? "▲" : "▼"}
        </span>
      </button>
      {open && <div className="border-t border-[var(--semantic-border-soft)] px-4 pb-4 pt-3">{children}</div>}
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────

export type VentWaveformLessonProps = {
  template: VentTemplate;
  /** Number of breath cycles to render. Default 4. */
  breathCount?: number;
  /** Show "exam trap" section — may be hidden for new_grad pathway */
  showExamTraps?: boolean;
  /** Show intervention panel */
  showInterventions?: boolean;
  className?: string;
};

export function VentWaveformLesson({
  template,
  breathCount = 4,
  showExamTraps = true,
  showInterventions = true,
  className = "",
}: VentWaveformLessonProps) {
  // Generate waveform on mount — pure function, no side effects
  const result = useMemo(
    () => generateVentWaveform(template.config, { breathCount, includePlateau: true }),
    [template.config, breathCount],
  );

  const urgencyLabel = VENT_URGENCY_LABELS[template.urgency];
  const categoryLabel = VENT_CATEGORY_LABELS[template.category];

  return (
    <article className={`space-y-4 ${className}`} data-nn-vent-lesson={template.key}>
      {/* Title row */}
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--semantic-text-muted)]">
            {categoryLabel}
          </p>
          <h3 className="text-xl font-bold text-[var(--semantic-text-primary)]">{template.label}</h3>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            {template.summary}
          </p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-xs font-bold ${URGENCY_STYLES[template.urgency]}`}
        >
          {urgencyLabel}
        </span>
      </header>

      {/* Scalar waveform display */}
      <VentScalarDisplay
        result={result}
        label={template.label}
        peep={template.config.peep}
        showDerivedValues
        showAnnotations
      />

      {/* Recognition criteria */}
      <Section title="What to Look For" defaultOpen>
        <ul className="space-y-1.5">
          {template.recognitionCriteria.map((criterion, i) => (
            <li key={i} className="flex gap-2 text-sm text-[var(--semantic-text-secondary)]">
              <span className="mt-0.5 shrink-0 text-[var(--semantic-info)]">●</span>
              <span>{criterion}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Physiology explanation */}
      <Section title="Why It Looks This Way" defaultOpen>
        <p className="text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{template.physiology}</p>
        <div className="mt-3 rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
            Patient Experience
          </p>
          <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">{template.patientExperience}</p>
        </div>
      </Section>

      {/* Interventions */}
      {showInterventions && template.interventions.length > 0 && (
        <Section title="Clinical Interventions" defaultOpen={false}>
          <ul className="space-y-2">
            {template.interventions.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm text-[var(--semantic-text-secondary)]">
                <span className="mt-0.5 shrink-0 font-bold text-[var(--semantic-success)]">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Exam traps */}
      {showExamTraps && template.examTraps.length > 0 && (
        <Section title="NCLEX / RT Exam Traps" defaultOpen={false}>
          <div className="space-y-2">
            {template.examTraps.map((trap, i) => (
              <div
                key={i}
                className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_30%,transparent)] bg-[color-mix(in_srgb,var(--semantic-warning)_07%,transparent)] px-3 py-2 text-sm text-[var(--semantic-text-secondary)]"
              >
                <span className="mr-1.5 font-bold text-[var(--semantic-warning)]">⚠</span>
                {trap}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Settings metadata */}
      <div className="grid grid-cols-2 gap-2 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-3 sm:grid-cols-4">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">Mode</p>
          <p className="text-xs font-semibold text-[var(--semantic-text-primary)]">{template.config.mode.replace(/_/g, " ")}</p>
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">PEEP</p>
          <p className="text-xs font-semibold text-[var(--semantic-text-primary)]">{template.config.peep} cmH₂O</p>
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">
            {template.config.tidalVolume ? "Vt" : "PIP"}
          </p>
          <p className="text-xs font-semibold text-[var(--semantic-text-primary)]">
            {template.config.tidalVolume
              ? `${template.config.tidalVolume} mL`
              : template.config.pip
                ? `${template.config.pip} cmH₂O`
                : "—"}
          </p>
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">RR</p>
          <p className="text-xs font-semibold text-[var(--semantic-text-primary)]">{template.config.rr} /min</p>
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">Compliance</p>
          <p className="text-xs font-semibold text-[var(--semantic-text-primary)]">{template.config.compliance} mL/cmH₂O</p>
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">Resistance</p>
          <p className="text-xs font-semibold text-[var(--semantic-text-primary)]">{template.config.resistance} cmH₂O/L/s</p>
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">Ti</p>
          <p className="text-xs font-semibold text-[var(--semantic-text-primary)]">{template.config.ti}s</p>
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">Difficulty</p>
          <p className="text-xs font-semibold capitalize text-[var(--semantic-text-primary)]">{template.difficulty}</p>
        </div>
      </div>
    </article>
  );
}
