import React from "react";

type Props = {
  completedCount: number;
  inProgressCount: number;
  totalCount: number;
};

/**
 * Bar width reflects **completed / total** only (strict). Styling:
 * - 0% completed: muted track fill (in-progress lessons still show at lesson row level).
 * - 1–99%: brand/accent fill.
 * - 100%: success fill.
 */
export function CategoryProgressBar({ completedCount, inProgressCount, totalCount }: Props) {
  const safeTotal = Math.max(totalCount, 1);
  const completedPct = Math.min(100, Math.round((100 * completedCount) / safeTotal));
  const fillClass =
    completedPct >= 100
      ? "nn-progress-fill-semantic-success"
      : completedPct >= 1
        ? "nn-progress-fill-semantic-brand"
        : "nn-progress-fill-semantic-muted";

  const ariaLabel =
    inProgressCount > 0
      ? `Category progress: ${completedCount} of ${totalCount} lessons completed, ${inProgressCount} in progress`
      : `Category progress: ${completedCount} of ${totalCount} lessons completed`;

  return (
    <div
      className="nn-progress-track-semantic nn-progress-track-semantic--xs mt-2"
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={totalCount}
      aria-valuenow={completedCount}
    >
      <div
        className={`nn-progress-fill-reveal h-full rounded-full ${fillClass}`}
        style={{ width: `${Math.max(0, Math.min(completedPct, 100))}%` }}
      />
    </div>
  );
}
