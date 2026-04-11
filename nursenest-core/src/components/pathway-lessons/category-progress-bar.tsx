type Props = {
  completedCount: number;
  inProgressCount: number;
  totalCount: number;
};

export function CategoryProgressBar({ completedCount, inProgressCount, totalCount }: Props) {
  const safeTotal = Math.max(totalCount, 1);
  const progressValue = ((completedCount + inProgressCount * 0.45) / safeTotal) * 100;
  const fillClass =
    completedCount > 0
      ? "nn-progress-fill-semantic-success"
      : inProgressCount > 0
        ? "nn-progress-fill-semantic-info"
        : "nn-progress-fill-semantic-muted";

  return (
    <div
      className="nn-progress-track-semantic nn-progress-track-semantic--xs mt-3"
      role="progressbar"
      aria-label={`Category progress: ${completedCount} of ${totalCount} lessons completed`}
      aria-valuemin={0}
      aria-valuemax={totalCount}
      aria-valuenow={completedCount}
    >
      <div
        className={`nn-progress-fill-reveal h-full rounded-full ${fillClass}`}
        style={{ width: `${Math.max(0, Math.min(progressValue, 100))}%` }}
      />
    </div>
  );
}
