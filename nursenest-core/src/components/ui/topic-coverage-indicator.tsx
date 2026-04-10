/**
 * Topic coverage indicator — "X / Y topics covered" with a semantic progress bar.
 *
 * Designed to appear near inventory strips on lesson and question hub pages.
 * Uses `--semantic-success` tokens so it stays visually positive even at low coverage.
 */

type Props = {
  /** Topics (or sections / question groups) that have at least some content. */
  covered: number;
  /**
   * Total expected topics for this pathway. When unknown / 0, the bar is omitted
   * and only the count label is shown.
   */
  total?: number;
  /** Noun used in the label (default: "topics"). */
  noun?: string;
  /** When true, renders as a compact single-line chip instead of a two-line block. */
  compact?: boolean;
};

/**
 * Returns a semantic fill class so the bar always reads positive, not alarming,
 * regardless of coverage percentage.
 */
function coverageFillClass(pct: number): string {
  if (pct >= 80) return "nn-progress-fill-semantic-success";
  if (pct >= 40) return "nn-progress-fill-semantic-info";
  return "nn-progress-fill-semantic-brand";
}

export function TopicCoverageIndicator({ covered, total, noun = "topics", compact = false }: Props) {
  if (covered === 0) return null;

  const hasDenominator = typeof total === "number" && total > 0;
  const denominator = hasDenominator ? (total as number) : covered;
  const pct = hasDenominator ? Math.min(100, Math.round((covered / (total as number)) * 100)) : 100;
  const fillClass = coverageFillClass(pct);

  if (compact) {
    return (
      <span
        className="inline-flex items-center gap-2 rounded-full border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-success)_6%,var(--semantic-surface))] px-3 py-1 text-[12px] font-semibold text-[color-mix(in_srgb,var(--semantic-success)_80%,var(--semantic-text-primary))]"
        title={hasDenominator ? `${covered} of ${denominator} ${noun} covered` : `${covered} ${noun} covered`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${pct >= 80 ? "bg-[var(--semantic-success)]" : pct >= 40 ? "bg-[var(--semantic-info)]" : "bg-[var(--semantic-brand)]"}`}
          aria-hidden
        />
        {hasDenominator ? `${covered} / ${denominator} ${noun}` : `${covered} ${noun}`}
      </span>
    );
  }

  return (
    <div className="mt-3" aria-label={hasDenominator ? `${covered} of ${denominator} ${noun} covered` : `${covered} ${noun} covered`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-[var(--theme-muted-text)]">
          {hasDenominator ? (
            <>
              <span className="font-semibold text-[var(--theme-heading-text)]">{covered}</span>
              {" / "}
              <span>{denominator}</span>
              {` ${noun} covered`}
            </>
          ) : (
            <>
              <span className="font-semibold text-[var(--theme-heading-text)]">{covered}</span>
              {` ${noun} covered`}
            </>
          )}
        </span>
        {hasDenominator ? (
          <span className="text-xs font-medium text-[var(--theme-muted-text)]">{pct}%</span>
        ) : null}
      </div>
      {hasDenominator ? (
        <div
          className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--theme-primary)_10%,var(--theme-page-bg))]"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={`h-full rounded-full transition-[width] duration-700 ${fillClass}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}
