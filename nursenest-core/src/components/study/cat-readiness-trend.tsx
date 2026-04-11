/**
 * ReadinessTrendCard — compact session comparison section (spec §7).
 *
 * If `priorScore` is provided, shows current / previous / change delta.
 * Otherwise shows an empty state prompting the user to complete another CAT.
 *
 * Note: prior session score is not yet stored in `PracticeTestResultsJson`.
 * Pass `priorScore` when the parent can supply it (e.g. from a session
 * history API). Until then, the empty state is shown by default.
 */
export function ReadinessTrendCard({
  currentScore,
  priorScore,
}: {
  currentScore: number;
  priorScore?: number | null;
}) {
  const hasPrior = priorScore != null;
  const delta = hasPrior ? currentScore - priorScore : null;
  const deltaPositive = delta != null && delta > 0;
  const deltaNeutral = delta === 0;

  return (
    <div className="nn-cat-results__section">
      <div className="nn-cat-trend-card">
        <h2 className="nn-cat-trend-card__title">Readiness Trend</h2>
        {hasPrior ? (
          <div className="nn-cat-trend-grid">
            <div>
              <p className="nn-cat-trend-stat__label">Current</p>
              <p className="nn-cat-trend-stat__value tabular-nums">
                {currentScore}%
              </p>
            </div>
            <div>
              <p className="nn-cat-trend-stat__label">Previous</p>
              <p className="nn-cat-trend-stat__value tabular-nums">
                {priorScore}%
              </p>
            </div>
            <div>
              <p className="nn-cat-trend-stat__label">Change</p>
              <p
                className={[
                  "nn-cat-trend-stat__value tabular-nums",
                  deltaPositive
                    ? "nn-cat-trend-stat__value--positive"
                    : !deltaNeutral
                      ? "nn-cat-trend-stat__value--negative"
                      : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {deltaPositive ? "+" : ""}
                {delta}%
              </p>
            </div>
          </div>
        ) : (
          <p className="nn-cat-trend-empty">
            Complete another CAT to start tracking your trend.
          </p>
        )}
      </div>
    </div>
  );
}
