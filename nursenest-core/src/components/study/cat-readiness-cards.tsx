import { PerformanceCard } from "./cat-results-summary";

/**
 * ReadinessSummaryCards — 3-card row below the hero (spec §4).
 *
 * Card 1: Accuracy %
 * Card 2: Difficulty Handling (derived label)
 * Card 3: Consistency (derived label)
 */
export function ReadinessSummaryCards({
  accuracyPct,
  difficultyLabel,
  consistencyLabel,
  correctCount,
  totalCount,
}: {
  accuracyPct: number;
  difficultyLabel: string;
  consistencyLabel: string;
  correctCount: number;
  totalCount: number;
}) {
  return (
    <div className="nn-cat-results__cards">
      <PerformanceCard
        label="Accuracy"
        value={`${accuracyPct}%`}
        sub={`${correctCount} of ${totalCount} questions correct`}
      />
      <PerformanceCard label="Difficulty Handling" value={difficultyLabel} />
      <PerformanceCard label="Consistency" value={consistencyLabel} />
    </div>
  );
}
