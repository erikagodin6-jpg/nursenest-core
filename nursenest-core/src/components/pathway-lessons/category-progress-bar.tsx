import { semanticFillClassForAccuracyPct } from "@/lib/ui/semantic-progress-fill";

export function CategoryProgressBar({
  value,
}: {
  value: number;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      className="nn-progress-track-semantic nn-progress-track-semantic--xs"
      role="progressbar"
      aria-label="Category completion"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full ${semanticFillClassForAccuracyPct(pct)} nn-progress-fill-reveal transition-[width] duration-300 ease-out`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
