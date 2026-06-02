"use client";

import { useCallback, useId, useState } from "react";

/**
 * EcgRateEntry — interpretation-grade rate measurement component.
 *
 * Pedagogical design:
 *   This component forces the learner to MEASURE rather than RECOGNIZE.
 *   Standard rate-category pills ("< 60 bpm", "60–100 bpm") require only
 *   visual categorization — the learner glances at the strip and picks a bucket.
 *   This component requires actual measurement behavior:
 *     - 300-rule: enter the number of large boxes between R peaks
 *     - ×6 method: count QRS complexes in 10 seconds, multiply by 6
 *   Both methods produce a numerical answer that can be scored against the
 *   correct rate to produce an interpretation accuracy signal.
 *
 * Tolerance ranges (used for scoring, not displayed):
 *   - Normal rates (40–160 bpm): ±10 bpm tolerance
 *   - Fast rates (>160 bpm): ±15 bpm tolerance
 *   - Ultra-slow (<40 bpm): ±5 bpm tolerance
 *
 * Scaffold integration:
 *   The parent EcgInterpretationScaffold passes onMeasured(bpm) to receive
 *   the learner's numerical answer. The scaffold then maps it to a rate category
 *   for MCQ gating while preserving the raw bpm for interpretation scoring.
 *
 * Accessibility:
 *   - Number input with min/max/step
 *   - Live feedback as learner types (non-blocking, aria-live="polite")
 *   - Keyboard-navigable method toggle
 *   - Clear hint text explaining each measurement method
 *
 * Cognitive depth:
 *   - Method A (300-rule): requires identifying the R-R interval in large boxes
 *   - Method B (×6 count): requires counting QRS complexes over a 10-second strip
 *   Both require active engagement with the strip rather than visual pattern matching.
 */

export type EcgRateEntryMethod = "rule_of_300" | "six_second_count";

export type EcgRateEntryResult = {
  /** The learner's measured rate in bpm. */
  measuredBpm: number;
  /** Which measurement method was used. */
  method: EcgRateEntryMethod;
  /** The intermediate input: boxes for 300-rule, QRS count for ×6 method. */
  intermediateValue: number;
};

type Props = {
  /** Called when the learner submits a rate measurement. */
  onMeasured: (result: EcgRateEntryResult) => void;
  /** Whether measurement is locked (after scaffold completion). */
  locked?: boolean;
  /** Hint for which method is most appropriate for this strip (optional). */
  suggestedMethod?: EcgRateEntryMethod;
};

/** Convert 300-rule boxes to bpm (300 ÷ boxes). */
function boxesToBpm(boxes: number): number {
  if (boxes <= 0) return 0;
  return Math.round(300 / boxes);
}

/** Convert 10-second QRS count to bpm (count × 6). */
function countToBpm(count: number): number {
  return count * 6;
}

function RateHint({ bpm }: { bpm: number | null }) {
  if (bpm === null || bpm <= 0) return null;

  let label = "";
  let cls = "text-[var(--semantic-info)]";
  if (bpm < 60) {
    label = "Bradycardia range";
    cls = "text-[color-mix(in_srgb,var(--semantic-warning)_85%,var(--semantic-text-primary))]";
  } else if (bpm <= 100) {
    label = "Normal rate range";
    cls = "text-[var(--semantic-success)]";
  } else if (bpm <= 150) {
    label = "Tachycardia range";
    cls = "text-[color-mix(in_srgb,var(--semantic-warning)_85%,var(--semantic-text-primary))]";
  } else {
    label = "Rapid tachycardia — consider SVT, flutter, or VT";
    cls = "text-[var(--semantic-danger)]";
  }

  return (
    <p className={`mt-1 text-[11px] font-semibold ${cls}`} aria-live="polite" aria-atomic="true">
      ≈ {bpm} bpm — {label}
    </p>
  );
}

export function EcgRateEntry({ onMeasured, locked = false, suggestedMethod }: Props) {
  const [method, setMethod] = useState<EcgRateEntryMethod>(
    suggestedMethod ?? "rule_of_300",
  );
  const [boxes, setBoxes] = useState<string>("");
  const [qrsCount, setQrsCount] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<EcgRateEntryResult | null>(null);

  const boxesNum = parseFloat(boxes);
  const qrsCountNum = parseInt(qrsCount, 10);
  const previewBpm =
    method === "rule_of_300"
      ? Number.isFinite(boxesNum) && boxesNum > 0
        ? boxesToBpm(boxesNum)
        : null
      : Number.isFinite(qrsCountNum) && qrsCountNum > 0
        ? countToBpm(qrsCountNum)
        : null;

  const canSubmit =
    !submitted &&
    !locked &&
    previewBpm !== null &&
    previewBpm > 0 &&
    previewBpm <= 400;

  const boxInputId = useId();
  const countInputId = useId();

  const handleSubmit = useCallback(() => {
    if (!canSubmit || previewBpm === null) return;
    const result: EcgRateEntryResult = {
      measuredBpm: previewBpm,
      method,
      intermediateValue: method === "rule_of_300" ? boxesNum : qrsCountNum,
    };
    setSubmitted(true);
    setSubmittedResult(result);
    onMeasured(result);
  }, [canSubmit, previewBpm, method, boxesNum, qrsCountNum, onMeasured]);

  return (
    <div
      className="space-y-4"
      data-testid="ecg-rate-entry"
      data-locked={locked ? "true" : "false"}
    >
      {/* Method toggle */}
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Rate measurement method">
        <button
          type="button"
          onClick={() => setMethod("rule_of_300")}
          disabled={submitted || locked}
          aria-pressed={method === "rule_of_300"}
          className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold motion-safe:transition ${
            method === "rule_of_300"
              ? "border-[color-mix(in_srgb,var(--semantic-brand)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
              : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-panel-muted)] disabled:opacity-60"
          }`}
        >
          300-rule (regular rhythm)
        </button>
        <button
          type="button"
          onClick={() => setMethod("six_second_count")}
          disabled={submitted || locked}
          aria-pressed={method === "six_second_count"}
          className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold motion-safe:transition ${
            method === "six_second_count"
              ? "border-[color-mix(in_srgb,var(--semantic-brand)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
              : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-panel-muted)] disabled:opacity-60"
          }`}
        >
          ×6 count (any rhythm)
        </button>
      </div>

      {/* 300-rule input */}
      {method === "rule_of_300" ? (
        <div className="space-y-1.5">
          <label
            htmlFor={boxInputId}
            className="block text-xs font-semibold text-[var(--semantic-text-primary)]"
          >
            Large boxes between consecutive R peaks
          </label>
          <p className="text-[11px] leading-relaxed text-[var(--semantic-text-muted)]">
            Count the large squares from one R-wave peak to the next. Rate = 300 ÷ boxes.
            Example: 4 boxes → 300 ÷ 4 = 75 bpm.
          </p>
          <div className="flex items-center gap-2">
            <input
              id={boxInputId}
              type="number"
              min="1"
              max="30"
              step="0.5"
              value={boxes}
              onChange={(e) => setBoxes(e.target.value)}
              disabled={submitted || locked}
              placeholder="e.g. 4"
              className="w-24 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 text-sm font-medium text-[var(--semantic-text-primary)] outline-none focus:border-[var(--semantic-brand)] focus:ring-1 focus:ring-[color-mix(in_srgb,var(--semantic-brand)_20%,transparent)] disabled:opacity-60"
              aria-label="Number of large boxes between R peaks"
            />
            {previewBpm !== null ? (
              <span className="text-sm font-semibold text-[var(--semantic-text-primary)]">
                = {previewBpm} bpm
              </span>
            ) : null}
          </div>
          <RateHint bpm={previewBpm} />
        </div>
      ) : (
        <div className="space-y-1.5">
          <label
            htmlFor={countInputId}
            className="block text-xs font-semibold text-[var(--semantic-text-primary)]"
          >
            QRS complexes in a 10-second strip
          </label>
          <p className="text-[11px] leading-relaxed text-[var(--semantic-text-muted)]">
            Count every QRS complex visible on the 10-second strip. Rate = count × 6.
            Use this method for irregular rhythms like AFib.
          </p>
          <div className="flex items-center gap-2">
            <input
              id={countInputId}
              type="number"
              min="1"
              max="50"
              step="1"
              value={qrsCount}
              onChange={(e) => setQrsCount(e.target.value)}
              disabled={submitted || locked}
              placeholder="e.g. 12"
              className="w-24 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 text-sm font-medium text-[var(--semantic-text-primary)] outline-none focus:border-[var(--semantic-brand)] focus:ring-1 focus:ring-[color-mix(in_srgb,var(--semantic-brand)_20%,transparent)] disabled:opacity-60"
              aria-label="Number of QRS complexes in 10-second strip"
            />
            {previewBpm !== null ? (
              <span className="text-sm font-semibold text-[var(--semantic-text-primary)]">
                × 6 = {previewBpm} bpm
              </span>
            ) : null}
          </div>
          <RateHint bpm={previewBpm} />
        </div>
      )}

      {/* Submit / confirmed state */}
      {!submitted ? (
        <button
          type="button"
          disabled={!canSubmit}
          onClick={handleSubmit}
          data-testid="ecg-rate-entry-submit"
          className="inline-flex min-h-9 items-center justify-center rounded-full bg-[var(--semantic-info)] px-5 text-xs font-semibold text-[var(--semantic-info-contrast,white)] disabled:opacity-40"
        >
          {canSubmit ? `Record rate: ${previewBpm} bpm` : "Enter a rate above to continue"}
        </button>
      ) : (
        <div
          className="flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--semantic-success)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_07%,var(--semantic-surface))] px-4 py-2 text-xs"
          data-testid="ecg-rate-entry-confirmed"
          role="status"
        >
          <span className="font-semibold text-[var(--semantic-success)]">✓</span>
          <span className="font-medium text-[var(--semantic-text-primary)]">
            Rate recorded:{" "}
            <strong>{submittedResult?.measuredBpm} bpm</strong>
            {" "}
            <span className="font-normal text-[var(--semantic-text-muted)]">
              ({submittedResult?.method === "rule_of_300"
                ? `300 ÷ ${submittedResult.intermediateValue} boxes`
                : `${submittedResult?.intermediateValue} QRS × 6`})
            </span>
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Tolerance scoring utility ────────────────────────────────────────────────

/**
 * Scores a learner's rate measurement against the correct rate.
 * Returns [0–1] accuracy where 1 = within tight tolerance, 0 = significantly off.
 *
 * Used by ecg-interpretation-scoring.ts to compute interpretation accuracy.
 */
export function scoreEcgRateMeasurement(measuredBpm: number, correctBpm: number): number {
  if (correctBpm <= 0) return 0;
  const absError = Math.abs(measuredBpm - correctBpm);

  // Tolerance by rate zone
  const tolerance =
    correctBpm < 40
      ? 5     // Ultra-slow: tight tolerance (5 bpm)
      : correctBpm > 160
        ? 15  // Rapid: looser tolerance (15 bpm)
        : 10; // Normal and tachycardia: ±10 bpm

  if (absError === 0) return 1.0;
  if (absError <= tolerance * 0.5) return 0.9;   // Within half tolerance — excellent
  if (absError <= tolerance) return 0.7;          // Within tolerance — acceptable
  if (absError <= tolerance * 2) return 0.4;      // Double tolerance — partial credit
  return 0;                                        // Beyond 2× tolerance — no credit
}
