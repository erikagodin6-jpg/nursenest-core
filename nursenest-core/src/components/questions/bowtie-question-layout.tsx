"use client";

import { useCallback, useState } from "react";
import { ArrowDown, ArrowRight, CheckCircle2, GitMerge, Heart, User } from "lucide-react";

/* ── Types ──────────────────────────────────────────────────────────────────── */

export type BowTieOption = {
  id: string;
  label: string;
};

export type BowTieColumn = {
  key: "condition" | "findings" | "interventions";
  label: string;
  subLabel: string;
  /** "radio" = pick one, "multi" = pick many */
  selectionMode: "radio" | "multi";
  maxSelections?: number;
  options: BowTieOption[];
  correctIds: string[];
};

export type BowTieQuestionProps = {
  questionStem: string;
  patientVignette?: string | null;
  columns: [BowTieColumn, BowTieColumn, BowTieColumn];
  diagnosisLabel?: string | null;
  diagnosisDescription?: string | null;
  revealed?: boolean;
  onSubmit?: (selections: Record<"condition" | "findings" | "interventions", string[]>) => void;
  selections?: Record<"condition" | "findings" | "interventions", string[]>;
};

type ColumnKey = "condition" | "findings" | "interventions";

/* ── Column component ───────────────────────────────────────────────────────── */

function BowTieCol({
  column,
  selected,
  revealed,
  onToggle,
}: {
  column: BowTieColumn;
  selected: string[];
  revealed: boolean;
  onToggle: (colKey: ColumnKey, optId: string) => void;
}) {
  return (
    <div className="nn-bowtie-column">
      <div className="nn-bowtie-column__header">
        <span className="nn-aqt-col-header">{column.label}</span>
        <span className="nn-aqt-col-subheader">{column.subLabel}</span>
      </div>
      <div className="nn-bowtie-column__options">
        {column.options.map((opt) => {
          const isSelected = selected.includes(opt.id);
          const isCorrect  = revealed && column.correctIds.includes(opt.id);
          const isWrong    = revealed && isSelected && !isCorrect;
          const isMissed   = revealed && !isSelected && column.correctIds.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              role={column.selectionMode === "radio" ? "radio" : "checkbox"}
              aria-pressed={isSelected}
              aria-checked={isSelected}
              disabled={revealed}
              onClick={() => !revealed && onToggle(column.key, opt.id)}
              className={`nn-bowtie-option nn-bowtie-option--${column.selectionMode === "radio" ? "radio" : "checkbox"} ${isSelected ? "nn-bowtie-option--selected" : ""}`}
              style={
                isCorrect || isMissed
                  ? { background: "color-mix(in srgb, var(--semantic-success) 9%, var(--semantic-surface))", borderColor: "transparent" }
                  : isWrong
                    ? { background: "color-mix(in srgb, var(--semantic-danger) 8%, var(--semantic-surface))", borderColor: "transparent" }
                    : undefined
              }
            >
              <span className="nn-bowtie-option__control">
                {(isSelected || isCorrect || isMissed) ? (
                  <CheckCircle2 className="h-2.5 w-2.5" aria-hidden style={{ color: isWrong ? "var(--semantic-danger)" : "white" }} />
                ) : null}
              </span>
              <span className="text-sm leading-snug">{opt.label}</span>
              {(isCorrect || isMissed) ? (
                <CheckCircle2 className="ml-auto h-3.5 w-3.5 flex-shrink-0 text-[var(--semantic-success)]" aria-hidden />
              ) : null}
              {isWrong ? (
                <span className="ml-auto text-xs text-[var(--semantic-danger)]" aria-hidden>✗</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Mobile step-by-step flow ───────────────────────────────────────────────── */

function BowTieMobile({
  columns,
  selections,
  revealed,
  diagnosisLabel,
  diagnosisDescription,
  onToggle,
}: {
  columns: BowTieQuestionProps["columns"];
  selections: Record<ColumnKey, string[]>;
  revealed: boolean;
  diagnosisLabel?: string | null;
  diagnosisDescription?: string | null;
  onToggle: (colKey: ColumnKey, optId: string) => void;
}) {
  const stepTitles: Record<ColumnKey, string> = {
    condition: "Step 1",
    findings: "Step 2",
    interventions: "Step 3",
  };

  return (
    <div className="nn-bowtie-steps sm:hidden">
      {columns.map((col, idx) => (
        <div key={col.key}>
          <div className="nn-bowtie-step">
            <div className="nn-bowtie-step__header">
              <span className="nn-bowtie-step__step-num">{idx + 1}</span>
              <div>
                <span className="nn-aqt-col-header">{col.label}</span>
                <span className="ml-2 text-xs text-[var(--semantic-text-muted)]">{col.subLabel}</span>
              </div>
            </div>
            <div className="nn-bowtie-column__options">
              {col.options.map((opt) => {
                const isSelected = selections[col.key].includes(opt.id);
                const isCorrect  = revealed && col.correctIds.includes(opt.id);
                const isWrong    = revealed && isSelected && !isCorrect;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    aria-pressed={isSelected}
                    disabled={revealed}
                    onClick={() => !revealed && onToggle(col.key, opt.id)}
                    className={`nn-bowtie-option nn-bowtie-option--${col.selectionMode === "radio" ? "radio" : "checkbox"} ${isSelected ? "nn-bowtie-option--selected" : ""}`}
                    style={
                      isCorrect
                        ? { background: "color-mix(in srgb, var(--semantic-success) 9%, var(--semantic-surface))" }
                        : isWrong
                          ? { background: "color-mix(in srgb, var(--semantic-danger) 8%, var(--semantic-surface))" }
                          : undefined
                    }
                  >
                    <span className="nn-bowtie-option__control">
                      {isSelected && <CheckCircle2 className="h-2.5 w-2.5 text-white" aria-hidden />}
                    </span>
                    <span className="text-sm">{opt.label}</span>
                    {isCorrect ? <CheckCircle2 className="ml-auto h-3.5 w-3.5 text-[var(--semantic-success)]" aria-hidden /> : null}
                  </button>
                );
              })}
            </div>
          </div>
          {idx < columns.length - 1 ? (
            <div className="nn-bowtie-step-arrow">
              <ArrowDown className="h-5 w-5" aria-hidden />
            </div>
          ) : null}
        </div>
      ))}

      {/* Diagnosis result */}
      {revealed && diagnosisLabel ? (
        <div className={`nn-bowtie-diagnosis-bubble nn-bowtie-diagnosis-bubble--active mt-3`}>
          <div className="nn-bowtie-diagnosis-bubble__icon" aria-hidden>
            <Heart className="h-5 w-5" />
          </div>
          <span className="nn-bowtie-diagnosis-bubble__label">{diagnosisLabel}</span>
          {diagnosisDescription ? (
            <p className="nn-bowtie-diagnosis-bubble__sub">{diagnosisDescription}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/* ── Desktop three-column layout ────────────────────────────────────────────── */

function BowTieDesktop({
  columns,
  selections,
  revealed,
  diagnosisLabel,
  diagnosisDescription,
  onToggle,
}: {
  columns: BowTieQuestionProps["columns"];
  selections: Record<ColumnKey, string[]>;
  revealed: boolean;
  diagnosisLabel?: string | null;
  diagnosisDescription?: string | null;
  onToggle: (colKey: ColumnKey, optId: string) => void;
}) {
  return (
    <div className="max-sm:hidden flex flex-col gap-3">
      {/* Three columns + arrows */}
      <div className="nn-bowtie-workspace">
        <BowTieCol column={columns[0]} selected={selections.condition}     revealed={revealed} onToggle={onToggle} />
        <div className="nn-bowtie-arrow"><ArrowRight className="h-6 w-6" aria-hidden /></div>
        <BowTieCol column={columns[1]} selected={selections.findings}      revealed={revealed} onToggle={onToggle} />
        <div className="nn-bowtie-arrow"><ArrowRight className="h-6 w-6" aria-hidden /></div>
        <BowTieCol column={columns[2]} selected={selections.interventions} revealed={revealed} onToggle={onToggle} />
      </div>

      {/* Diagnosis bubble */}
      {revealed && diagnosisLabel ? (
        <div className={`nn-bowtie-diagnosis-bubble nn-bowtie-diagnosis-bubble--active`}>
          <div className="nn-bowtie-diagnosis-bubble__icon" aria-hidden>
            <Heart className="h-5 w-5" />
          </div>
          <span className="nn-bowtie-diagnosis-bubble__label">{diagnosisLabel}</span>
          {diagnosisDescription ? (
            <p className="nn-bowtie-diagnosis-bubble__sub">{diagnosisDescription}</p>
          ) : null}
        </div>
      ) : !revealed ? (
        <div className="nn-bowtie-diagnosis-bubble">
          <span className="text-sm text-[var(--semantic-text-muted)]">
            Complete all sections to reveal the clinical diagnosis
          </span>
        </div>
      ) : null}
    </div>
  );
}

/* ── Scoring summary ────────────────────────────────────────────────────────── */

function BowTieScore({ columns, selections }: { columns: BowTieQuestionProps["columns"]; selections: Record<ColumnKey, string[]> }) {
  const results = columns.map((col) => {
    const correct = col.correctIds;
    const picked  = selections[col.key];
    const allCorrect =
      correct.length === picked.length &&
      correct.every((id) => picked.includes(id));
    return { label: col.label, allCorrect, correct: correct.length, picked: picked.length };
  });

  const allPerfect = results.every((r) => r.allCorrect);

  return (
    <div className={`nn-aqt-feedback-banner ${allPerfect ? "nn-aqt-feedback-banner--success" : "nn-aqt-feedback-banner--partial"}`}>
      <CheckCircle2 className="h-5 w-5 flex-shrink-0" aria-hidden />
      <span>
        {allPerfect
          ? "Clinical reasoning pathway complete — excellent work."
          : `${results.filter((r) => r.allCorrect).length} of ${results.length} sections correct. Review the highlighted answers.`}
      </span>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────────── */

export function BowTieQuestionLayout({
  questionStem,
  patientVignette,
  columns,
  diagnosisLabel,
  diagnosisDescription,
  revealed = false,
  onSubmit,
  selections: controlledSelections,
}: BowTieQuestionProps) {
  const [internalSelections, setInternalSelections] = useState<Record<ColumnKey, string[]>>({
    condition: [], findings: [], interventions: [],
  });
  const selections = controlledSelections ?? internalSelections;

  const handleToggle = useCallback((colKey: ColumnKey, optId: string) => {
    if (revealed) return;
    const col = columns.find((c) => c.key === colKey);
    if (!col) return;

    setInternalSelections((prev) => {
      const current = prev[colKey] ?? [];
      if (col.selectionMode === "radio") {
        return { ...prev, [colKey]: [optId] };
      }
      const max = col.maxSelections ?? Infinity;
      if (current.includes(optId)) {
        return { ...prev, [colKey]: current.filter((id) => id !== optId) };
      }
      if (current.length >= max) return prev;
      return { ...prev, [colKey]: [...current, optId] };
    });
  }, [columns, revealed]);

  const allSectionsAnswered = columns.every((col) => {
    const picked = selections[col.key];
    return picked.length > 0;
  });

  return (
    <div className="nn-bowtie-question flex flex-col gap-4">
      {/* Badge */}
      <div className="nn-aqt-badge">
        <div className="nn-aqt-badge__icon">
          <GitMerge className="h-4 w-4" aria-hidden />
        </div>
        <span className="nn-aqt-badge__label">Bowtie</span>
      </div>

      {/* Stem */}
      <p className="text-lg font-bold leading-snug text-[var(--semantic-text-primary)]">
        {questionStem}
      </p>

      {/* Patient vignette */}
      {patientVignette ? (
        <div className="nn-aqt-patient-card">
          <div className="nn-aqt-patient-card__icon" aria-hidden>
            <User className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="nn-aqt-patient-card__label">Patient</span>
            <p className="nn-aqt-patient-card__text">{patientVignette}</p>
          </div>
        </div>
      ) : null}

      {/* Desktop */}
      <BowTieDesktop
        columns={columns}
        selections={selections}
        revealed={revealed}
        diagnosisLabel={diagnosisLabel}
        diagnosisDescription={diagnosisDescription}
        onToggle={handleToggle}
      />

      {/* Mobile */}
      <BowTieMobile
        columns={columns}
        selections={selections}
        revealed={revealed}
        diagnosisLabel={diagnosisLabel}
        diagnosisDescription={diagnosisDescription}
        onToggle={handleToggle}
      />

      {/* Score */}
      {revealed ? <BowTieScore columns={columns} selections={selections} /> : null}

      {/* Submit */}
      {!revealed && allSectionsAnswered && onSubmit ? (
        <button
          type="button"
          className="inline-flex w-full min-h-[3rem] items-center justify-center gap-2 rounded-[0.8rem] border border-[color-mix(in_srgb,var(--semantic-brand)_48%,var(--semantic-border-soft))] bg-[var(--semantic-brand)] text-white text-sm font-[750] shadow-[0_6px_18px_-8px_color-mix(in_srgb,var(--semantic-brand)_48%,transparent)] transition-opacity hover:opacity-95"
          onClick={() => onSubmit(selections)}
        >
          Submit Clinical Pathway
        </button>
      ) : null}
    </div>
  );
}
