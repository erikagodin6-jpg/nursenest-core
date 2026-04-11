import Link from "next/link";
import type { PracticeTestResultsJson } from "@/lib/practice-tests/types";

/** Stat card: 24px padding, rectangular, soft surface variation. */
export function PerformanceCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="nn-cat-perf-card">
      <p className="nn-cat-perf-card__label">{label}</p>
      <p className="nn-cat-perf-card__value tabular-nums">{value}</p>
      {sub ? <p className="nn-cat-perf-card__sub">{sub}</p> : null}
    </div>
  );
}

/** Topic bar row with a narrow 6px fill bar (theme-primary) and accuracy %. */
export function WeakAreaRow({
  topic,
  correct,
  total,
}: {
  topic: string;
  correct: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  return (
    <div className="nn-cat-topic-row">
      <span className="nn-cat-topic-row__name truncate" title={topic}>
        {topic}
      </span>
      <div className="nn-cat-topic-row__track" aria-hidden="true">
        <div className="nn-cat-topic-row__fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="nn-cat-topic-row__pct tabular-nums">
        {correct}/{total}
      </span>
    </div>
  );
}

/** WeakAreasList — top 5 weak topics with bar indicators. */
export function WeakAreasList({
  topics,
  byTopic,
}: {
  topics: string[];
  byTopic: Record<string, { correct: number; total: number }>;
}) {
  if (topics.length === 0) {
    return (
      <p className="text-sm text-[var(--semantic-text-muted)]">
        No weak areas identified in this session.
      </p>
    );
  }
  return (
    <div>
      {topics.slice(0, 5).map((topic) => {
        const data = byTopic[topic] ?? { correct: 0, total: 0 };
        return (
          <WeakAreaRow
            key={topic}
            topic={topic}
            correct={data.correct}
            total={data.total}
          />
        );
      })}
    </div>
  );
}

function deriveStrengths(
  byTopic: Record<string, { correct: number; total: number }>,
  weakAreas: string[],
): Array<{ topic: string; correct: number; total: number }> {
  const weakSet = new Set(weakAreas);
  return Object.entries(byTopic)
    .filter(([topic, { total }]) => !weakSet.has(topic) && total >= 2)
    .map(([topic, data]) => ({ topic, ...data }))
    .sort((a, b) => {
      const pa = a.total > 0 ? a.correct / a.total : 0;
      const pb = b.total > 0 ? b.correct / b.total : 0;
      return pb - pa;
    })
    .slice(0, 5);
}

function formatElapsed(ms: number | null | undefined): string {
  if (ms == null || !Number.isFinite(ms) || ms < 0) return "N/A";
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

/**
 * ResultsSummary — analytics page after CAT session completes.
 *
 * Layout (spec §7):
 *  1. Large readiness score + label
 *  2. Row of 3 stat cards (Accuracy, Questions, Readiness level)
 *  3. Weak Areas section with bar indicators
 *  4. Strengths section with bar indicators
 *  5. Next Steps buttons
 */
export function ResultsSummary({
  results,
  testId,
  elapsedMs,
  pathwayId,
}: {
  results: PracticeTestResultsJson;
  testId: string;
  elapsedMs?: number | null;
  pathwayId?: string | null;
}) {
  const catReport = results.catReport;

  // Readiness score — prefer catReport.readinessScore (0–100), fall back to accuracyPct
  const readinessPct = catReport?.readinessScore != null
    ? Math.round(catReport.readinessScore)
    : results.accuracyPct;

  // Decision display
  const decisionLabel =
    catReport?.decision === "pass"
      ? "On track to pass"
      : catReport?.decision === "fail"
        ? "Needs improvement"
        : catReport?.decision === "uncertain"
          ? "Borderline"
          : null;

  // Strengths derived from byTopic
  const strengths = deriveStrengths(results.byTopic, results.weakAreas ?? []);

  // Pathway-aware lessons URL
  const lessonsHref = pathwayId ? `/app/lessons?pathway=${pathwayId}` : "/app/lessons";

  return (
    <div className="nn-cat-results">
      {/* ── Score block ─────────────────────────────────────────── */}
      <div className="nn-cat-results__score-block">
        <p className="nn-cat-results__score-value tabular-nums">{readinessPct}%</p>
        <p className="nn-cat-results__score-label">Readiness Score</p>
        {decisionLabel ? (
          <p className="mt-3 text-sm font-semibold text-[var(--semantic-text-secondary)]">
            {decisionLabel}
          </p>
        ) : null}
        {catReport?.readinessHeadline && catReport.readinessHeadline !== decisionLabel ? (
          <p className="mt-1 text-sm text-[var(--semantic-text-muted)]">
            {catReport.readinessHeadline}
          </p>
        ) : null}
        {elapsedMs != null ? (
          <p className="mt-2 text-xs text-[var(--semantic-text-muted)]">
            Time: {formatElapsed(elapsedMs)}
          </p>
        ) : null}
      </div>

      {/* ── 3 stat cards ────────────────────────────────────────── */}
      <div className="nn-cat-results__cards">
        <PerformanceCard
          label="Accuracy"
          value={`${results.accuracyPct}%`}
          sub={`${results.scoreCorrect} of ${results.scoreTotal} correct`}
        />
        <PerformanceCard
          label="Questions"
          value={results.scoreTotal}
          sub={catReport ? `CAT · stopped: ${catReport.stoppedReason.replace(/_/g, " ")}` : undefined}
        />
        <PerformanceCard
          label="Estimated Readiness"
          value={results.readinessLabel ?? decisionLabel ?? "—"}
          sub={
            results.estimatedAbility != null
              ? `θ ${results.estimatedAbility.toFixed(2)}${results.abilityStdError != null ? ` ± ${results.abilityStdError.toFixed(2)}` : ""}`
              : undefined
          }
        />
      </div>

      {/* ── Weak Areas ──────────────────────────────────────────── */}
      <div className="nn-cat-results__section">
        <h2 className="nn-cat-results__section-title">Weak Areas</h2>
        <WeakAreasList
          topics={results.weakAreas ?? []}
          byTopic={results.byTopic}
        />
      </div>

      {/* ── Strengths ───────────────────────────────────────────── */}
      <div className="nn-cat-results__section">
        <h2 className="nn-cat-results__section-title">Strengths</h2>
        {strengths.length > 0 ? (
          <div>
            {strengths.map(({ topic, correct, total }) => (
              <WeakAreaRow key={topic} topic={topic} correct={correct} total={total} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--semantic-text-muted)]">
            Not enough data to identify strong areas yet.
          </p>
        )}
      </div>

      {/* ── Breakdown by topic (collapsible detail) ─────────────── */}
      {Object.keys(results.byTopic).length > 0 ? (
        <div className="nn-cat-results__section">
          <details>
            <summary className="cursor-pointer text-sm font-semibold text-[var(--semantic-text-secondary)] hover:text-[var(--semantic-text-primary)]">
              Full topic breakdown
            </summary>
            <div className="mt-4">
              {Object.entries(results.byTopic).map(([topic, { correct, total }]) => (
                <WeakAreaRow
                  key={topic}
                  topic={topic}
                  correct={correct}
                  total={total}
                />
              ))}
            </div>
          </details>
        </div>
      ) : null}

      {/* ── Suggested next steps from CAT report ────────────────── */}
      {catReport?.suggestedNextSteps?.length ? (
        <div className="nn-cat-results__section">
          <h2 className="nn-cat-results__section-title">Recommended Next Steps</h2>
          <ul className="space-y-2">
            {catReport.suggestedNextSteps.map((step) => (
              <li
                key={step.slice(0, 80)}
                className="flex items-start gap-2 text-sm text-[var(--semantic-text-secondary)]"
              >
                <span className="mt-1 shrink-0 text-[var(--semantic-text-muted)]" aria-hidden="true">
                  ›
                </span>
                {step}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* ── Next Steps buttons ───────────────────────────────────── */}
      <div className="nn-cat-results__section">
        <h2 className="nn-cat-results__section-title">Next Steps</h2>
        <div className="nn-cat-results__next-steps">
          <Link
            href={`/app/practice-tests/${testId}/results`}
            className="nn-btn-secondary inline-flex min-h-[2.75rem] items-center rounded-lg px-5 text-sm font-semibold"
          >
            Review Questions
          </Link>
          <Link
            href={lessonsHref}
            className="nn-btn-secondary inline-flex min-h-[2.75rem] items-center rounded-lg px-5 text-sm font-semibold"
          >
            Go to Lessons
          </Link>
          <Link
            href="/app/practice-tests"
            className="nn-btn-primary inline-flex min-h-[2.75rem] items-center rounded-lg px-5 text-sm font-semibold shadow-none"
          >
            Start New CAT
          </Link>
        </div>
      </div>
    </div>
  );
}
