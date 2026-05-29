"use client";

import { useCallback, useState } from "react";
import { CheckCircle2, Grid3X3, User, XCircle } from "lucide-react";

/* ── Types ──────────────────────────────────────────────────────────────────── */

export type MatrixColumn = {
  key: string;
  label: string;
  /** "appropriate" | "contraindicated" | "provider-order" | "custom" */
  variant?: "appropriate" | "contraindicated" | "provider-order" | "custom";
};

export type MatrixRow = {
  id: string;
  label: string;
  correctKey: string;
  /** Optional per-row rationale shown after reveal */
  rationale?: string;
};

export type MatrixQuestionProps = {
  questionStem: string;
  patientVignette?: string | null;
  columns: MatrixColumn[];
  rows: MatrixRow[];
  revealed?: boolean;
  /** Called with { rowId, columnKey } on each selection */
  onSelect?: (rowId: string, columnKey: string) => void;
  /** Called when all rows are answered and the learner submits */
  onSubmit?: (selections: Record<string, string>) => void;
  /** Pre-populate selections (controlled) */
  selections?: Record<string, string>;
};

/* ── Helpers ────────────────────────────────────────────────────────────────── */

function columnClass(variant?: MatrixColumn["variant"]) {
  if (variant === "appropriate")   return "nn-matrix-col--appropriate";
  if (variant === "contraindicated") return "nn-matrix-col--contraindicated";
  if (variant === "provider-order")  return "nn-matrix-col--provider-order";
  return "nn-matrix-col--custom";
}

function radioClass(variant?: MatrixColumn["variant"]) {
  if (variant === "appropriate")    return "nn-matrix-radio--appropriate";
  if (variant === "contraindicated") return "nn-matrix-radio--contraindicated";
  if (variant === "provider-order")  return "nn-matrix-radio--provider-order";
  return "";
}

/* ── Desktop table view ─────────────────────────────────────────────────────── */

function MatrixDesktop({
  columns,
  rows,
  selections,
  revealed,
  onSelect,
}: Pick<MatrixQuestionProps, "columns" | "rows" | "revealed"> & {
  selections: Record<string, string>;
  onSelect: (rowId: string, colKey: string) => void;
}) {
  return (
    <div className="nn-matrix-workspace max-sm:hidden">
      <table className="nn-matrix-table">
        <thead>
          <tr>
            <th style={{ width: "36%" }}>Intervention</th>
            {columns.map((col) => (
              <th key={col.key} className={columnClass(col.variant)}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const picked   = selections[row.id] ?? null;
            const isRight  = revealed && picked === row.correctKey;
            const isWrong  = revealed && picked !== null && picked !== row.correctKey;
            return (
              <tr key={row.id}>
                <td>
                  <span className="font-semibold text-sm text-[var(--semantic-text-primary)]">
                    {row.label}
                  </span>
                  {revealed && row.rationale ? (
                    <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
                      {row.rationale}
                    </p>
                  ) : null}
                </td>
                {columns.map((col) => {
                  const isSelected = picked === col.key;
                  const isCorrectCol = revealed && col.key === row.correctKey;
                  return (
                    <td key={col.key}>
                      <div className="flex justify-center">
                        <input
                          type="radio"
                          name={`matrix-row-${row.id}`}
                          aria-label={`${row.label} — ${col.label}`}
                          checked={isSelected}
                          disabled={revealed}
                          onChange={() => !revealed && onSelect(row.id, col.key)}
                          className={`nn-matrix-radio ${radioClass(col.variant)} ${isCorrectCol ? "!border-[var(--semantic-success)] !bg-[var(--semantic-success)]" : ""}`}
                        />
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Row-level result indicators when revealed */}
      {revealed ? (
        <div className="flex items-center gap-2 px-4 py-3 border-t border-[var(--semantic-border-soft)] text-xs text-[var(--semantic-text-muted)]">
          <span className="inline-flex items-center gap-1 text-[var(--semantic-success)]">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> Correct
          </span>
          <span className="inline-flex items-center gap-1 text-[var(--semantic-danger)]">
            <XCircle className="h-3.5 w-3.5" aria-hidden /> Incorrect (green = correct answer)
          </span>
        </div>
      ) : null}
    </div>
  );
}

/* ── Mobile card view ───────────────────────────────────────────────────────── */

function MatrixMobile({
  columns,
  rows,
  selections,
  revealed,
  onSelect,
}: Pick<MatrixQuestionProps, "columns" | "rows" | "revealed"> & {
  selections: Record<string, string>;
  onSelect: (rowId: string, colKey: string) => void;
}) {
  return (
    <div className="nn-matrix-cards sm:hidden">
      {rows.map((row) => {
        const picked = selections[row.id] ?? null;
        return (
          <div key={row.id} className="nn-matrix-intervention-card">
            <span className="nn-matrix-intervention-card__name">{row.label}</span>
            <div className="nn-matrix-intervention-card__options">
              {columns.map((col) => {
                const isSelected = picked === col.key;
                const isCorrect  = revealed && col.key === row.correctKey;
                const isWrong    = revealed && isSelected && !isCorrect;
                return (
                  <button
                    key={col.key}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    disabled={revealed}
                    onClick={() => !revealed && onSelect(row.id, col.key)}
                    data-selected={isSelected ? "true" : undefined}
                    data-variant={col.variant}
                    className={`nn-matrix-option-row ${isCorrect ? "!border-[var(--semantic-success)] !bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))]" : ""} ${isWrong ? "!border-[var(--semantic-danger)] !bg-[color-mix(in_srgb,var(--semantic-danger)_8%,var(--semantic-surface))]" : ""}`}
                  >
                    {/* Radio dot */}
                    <span
                      aria-hidden
                      className={`inline-flex h-4 w-4 flex-shrink-0 rounded-full border-2 items-center justify-center transition-colors ${
                        isSelected
                          ? isCorrect
                            ? "border-[var(--semantic-success)] bg-[var(--semantic-success)]"
                            : isWrong
                              ? "border-[var(--semantic-danger)] bg-[var(--semantic-danger)]"
                              : "border-[var(--semantic-brand)] bg-[var(--semantic-brand)]"
                          : isCorrect
                            ? "border-[var(--semantic-success)] bg-[var(--semantic-success)]"
                            : "border-[color-mix(in_srgb,var(--semantic-border-soft)_72%,var(--semantic-text-muted))]"
                      }`}
                    />
                    <span>{col.label}</span>
                    {isCorrect ? <CheckCircle2 className="ml-auto h-4 w-4 text-[var(--semantic-success)]" aria-hidden /> : null}
                    {isWrong   ? <XCircle      className="ml-auto h-4 w-4 text-[var(--semantic-danger)]"  aria-hidden /> : null}
                  </button>
                );
              })}
            </div>
            {revealed && row.rationale ? (
              <p className="mt-2 text-xs leading-relaxed text-[var(--semantic-text-secondary)] border-t border-[var(--semantic-border-soft)] pt-2">
                {row.rationale}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

/* ── Feedback banner ────────────────────────────────────────────────────────── */

function MatrixFeedback({ rows, selections }: { rows: MatrixRow[]; selections: Record<string, string> }) {
  const total   = rows.length;
  const correct = rows.filter((r) => selections[r.id] === r.correctKey).length;
  const allRight = correct === total;
  const anyAnswered = Object.keys(selections).length > 0;

  if (!anyAnswered) return null;
  const allAnswered = Object.keys(selections).length === total;
  if (!allAnswered) return null;

  return (
    <div className={`nn-aqt-feedback-banner ${allRight ? "nn-aqt-feedback-banner--success" : correct >= total / 2 ? "nn-aqt-feedback-banner--partial" : "nn-aqt-feedback-banner--error"}`}>
      {allRight
        ? <CheckCircle2 className="h-5 w-5 flex-shrink-0" aria-hidden />
        : <XCircle      className="h-5 w-5 flex-shrink-0" aria-hidden />}
      <span>
        {allRight
          ? `Great! You correctly categorized ${total} of ${total} interventions.`
          : `You correctly categorized ${correct} of ${total} interventions.`}
      </span>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────────── */

export function MatrixQuestionLayout({
  questionStem,
  patientVignette,
  columns,
  rows,
  revealed = false,
  onSelect,
  onSubmit,
  selections: controlledSelections,
}: MatrixQuestionProps) {
  const [internalSelections, setInternalSelections] = useState<Record<string, string>>({});
  const selections = controlledSelections ?? internalSelections;

  const handleSelect = useCallback((rowId: string, colKey: string) => {
    if (revealed) return;
    setInternalSelections((prev) => ({ ...prev, [rowId]: colKey }));
    onSelect?.(rowId, colKey);
  }, [onSelect, revealed]);

  const allAnswered = rows.length > 0 && rows.every((r) => selections[r.id]);

  return (
    <div className="nn-matrix-question flex flex-col gap-4">
      {/* Badge */}
      <div className="nn-aqt-badge">
        <div className="nn-aqt-badge__icon">
          <Grid3X3 className="h-4 w-4" aria-hidden />
        </div>
        <span className="nn-aqt-badge__label">Matrix</span>
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

      {/* Desktop table */}
      <MatrixDesktop
        columns={columns}
        rows={rows}
        selections={selections}
        revealed={revealed}
        onSelect={handleSelect}
      />

      {/* Mobile cards */}
      <MatrixMobile
        columns={columns}
        rows={rows}
        selections={selections}
        revealed={revealed}
        onSelect={handleSelect}
      />

      {/* Feedback */}
      {revealed ? <MatrixFeedback rows={rows} selections={selections} /> : null}

      {/* Submit (before reveal, when all answered) */}
      {!revealed && allAnswered && onSubmit ? (
        <button
          type="button"
          className="inline-flex w-full min-h-[3rem] items-center justify-center gap-2 rounded-[0.8rem] border border-[color-mix(in_srgb,var(--semantic-brand)_48%,var(--semantic-border-soft))] bg-[var(--semantic-brand)] text-white text-sm font-[750] shadow-[0_6px_18px_-8px_color-mix(in_srgb,var(--semantic-brand)_48%,transparent)] transition-opacity hover:opacity-95"
          onClick={() => onSubmit(selections)}
        >
          Submit Matrix
        </button>
      ) : null}
    </div>
  );
}
