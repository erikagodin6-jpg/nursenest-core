import Link from "next/link";
import type { PracticeTestResultsJson } from "@/lib/practice-tests/types";
import {
  CatResultsHero,
  getReadinessBand,
  BAND_HELPER,
} from "./cat-readiness-hero";
import { ReadinessSummaryCards } from "./cat-readiness-cards";
import { TopicImpactBars } from "./cat-topic-impact";
import type { TopicWithAccuracy } from "./cat-topic-impact";
import { ReadinessTrendCard } from "./cat-readiness-trend";
import { NextStepsCards } from "./cat-next-steps";
import { OptionalUpgradeCard } from "./cat-upgrade-card";

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

/** Topic bar row with a narrow fill bar and accuracy %. */
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

// ── Helpers ────────────────────────────────────────────────────────────────

function formatElapsed(ms: number | null | undefined): string {
  if (ms == null || !Number.isFinite(ms) || ms < 0) return "N/A";
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

/** Derive a "Difficulty Handling" label from available signals. */
function deriveDifficultyLabel(results: PracticeTestResultsJson): string {
  const coachDiff = results.catCoach?.difficultyTrendLabel;
  if (coachDiff === "rising") return "Strong on harder items";
  if (coachDiff === "falling") return "Struggled with harder items";

  const theta = results.estimatedAbility;
  if (theta != null) {
    if (theta > 0.5) return "Strong on harder items";
    if (theta < -0.5) return "Struggled with harder items";
    return "Stable across moderate difficulty";
  }

  const traj = results.catReport?.trajectory;
  if (traj === "improving") return "Strong on harder items";
  if (traj === "slipping") return "Struggled with harder items";

  return "Stable across moderate difficulty";
}

/** Derive a "Consistency" label from available signals. */
function deriveConsistencyLabel(results: PracticeTestResultsJson): string {
  const level =
    results.catCoach?.confidenceLevel ?? results.catReport?.confidenceLevel;
  if (level === "high") return "Stable";
  if (level === "medium") return "Moderate";
  if (level === "low") return "Low";

  const se = results.abilityStdError;
  if (se != null) {
    if (se < 0.3) return "Stable";
    if (se < 0.5) return "Moderate";
    return "Low";
  }

  return "Moderate";
}

/** Build sorted weak-topic list from catReport.categoryBreakdown or weakAreas. */
function buildWeakTopics(results: PracticeTestResultsJson): TopicWithAccuracy[] {
  const breakdown = results.catReport?.categoryBreakdown;
  if (breakdown?.length) {
    return breakdown
      .filter((c) => c.strength === "weak")
      .sort(
        (a, b) =>
          (a.total > 0 ? a.correct / a.total : 0) -
          (b.total > 0 ? b.correct / b.total : 0),
      )
      .slice(0, 5)
      .map((c) => ({ topic: c.category, correct: c.correct, total: c.total }));
  }

  return (results.weakAreas ?? [])
    .slice(0, 5)
    .map((topic) => {
      const data = results.byTopic[topic] ?? { correct: 0, total: 1 };
      return { topic, ...data };
    })
    .sort(
      (a, b) =>
        (a.total > 0 ? a.correct / a.total : 0) -
        (b.total > 0 ? b.correct / b.total : 0),
    );
}

/** Build sorted strength-topic list from catReport.categoryBreakdown or byTopic. */
function buildStrengthTopics(
  results: PracticeTestResultsJson,
): TopicWithAccuracy[] {
  const breakdown = results.catReport?.categoryBreakdown;
  if (breakdown?.length) {
    return breakdown
      .filter((c) => c.strength === "strong")
      .sort(
        (a, b) =>
          (b.total > 0 ? b.correct / b.total : 0) -
          (a.total > 0 ? a.correct / a.total : 0),
      )
      .slice(0, 5)
      .map((c) => ({ topic: c.category, correct: c.correct, total: c.total }));
  }

  const weakSet = new Set(results.weakAreas ?? []);
  return Object.entries(results.byTopic)
    .filter(([topic, { total }]) => !weakSet.has(topic) && total >= 2)
    .map(([topic, data]) => ({ topic, ...data }))
    .filter(({ correct, total }) => total > 0 && correct / total >= 0.6)
    .sort(
      (a, b) =>
        (b.total > 0 ? b.correct / b.total : 0) -
        (a.total > 0 ? a.correct / a.total : 0),
    )
    .slice(0, 5);
}

// ── Main component ─────────────────────────────────────────────────────────

/**
 * ResultsSummary — full readiness report after a CAT session completes.
 *
 * Final page order (spec §12):
 *  1. CatResultsHero (score + band + interpretation + CTAs)
 *  2. ReadinessSummaryCards (accuracy · difficulty · consistency)
 *  3. TopicImpactBars — Weak Areas Holding You Back
 *  4. TopicImpactBars — Current Strengths
 *  5. ReadinessTrendCard
 *  6. NextStepsCards — What To Do Next
 *  7. OptionalUpgradeCard (hidden when isEntitled = true)
 *
 * `isEntitled` defaults to true so existing call sites without entitlement
 * wiring never show the upgrade card. Pass `false` for free/trial users.
 */
export function ResultsSummary({
  results,
  testId,
  elapsedMs,
  pathwayId,
  isEntitled = true,
  priorScore,
}: {
  results: PracticeTestResultsJson;
  testId: string;
  elapsedMs?: number | null;
  pathwayId?: string | null;
  /** When false, the upgrade/paywall card is shown at the bottom. */
  isEntitled?: boolean;
  /** Prior CAT readiness score for trend display. Omit to show empty state. */
  priorScore?: number | null;
}) {
  const catReport = results.catReport;

  // ── Readiness score ────────────────────────────────────────
  const score =
    catReport?.readinessScore != null
      ? Math.round(catReport.readinessScore)
      : results.accuracyPct;

  const band = getReadinessBand(score);

  // One-sentence interpretation: prefer coach narrative, fall back to band helper
  const interpretation =
    results.catCoach?.readinessNarrative ?? BAND_HELPER[band];

  // ── Summary card values ────────────────────────────────────
  const difficultyLabel = deriveDifficultyLabel(results);
  const consistencyLabel = deriveConsistencyLabel(results);

  // ── Topic data ─────────────────────────────────────────────
  const weakTopics = buildWeakTopics(results);
  const strengthTopics = buildStrengthTopics(results);

  // ── Navigation targets ─────────────────────────────────────
  const lessonsHref = pathwayId
    ? `/app/lessons?pathway=${pathwayId}`
    : "/app/lessons";

  return (
    <div className="nn-cat-results">
      {/* 1 — Results hero ───────────────────────────────────── */}
      <CatResultsHero
        score={score}
        band={band}
        interpretation={interpretation}
        testId={testId}
        lessonsHref={lessonsHref}
      />

      {/* 2 — 3-card summary row ─────────────────────────────── */}
      <ReadinessSummaryCards
        accuracyPct={results.accuracyPct}
        difficultyLabel={difficultyLabel}
        consistencyLabel={consistencyLabel}
        correctCount={results.scoreCorrect}
        totalCount={results.scoreTotal}
      />

      {/* 3 & 4 — Weak areas + Strengths ────────────────────── */}
      <TopicImpactBars
        weakTopics={weakTopics}
        strengthTopics={strengthTopics}
      />

      {/* 5 — Readiness trend ────────────────────────────────── */}
      <ReadinessTrendCard currentScore={score} priorScore={priorScore} />

      {/* 6 — What To Do Next ────────────────────────────────── */}
      <NextStepsCards
        testId={testId}
        lessonsHref={lessonsHref}
        readinessTier={results.catCoach?.readinessTier ?? null}
        lessonPrimaryReady={results.catCoach?.lessonContentSignal?.lessonPrimaryReady ?? null}
      />

      {/* 7 — Optional upgrade/paywall block ────────────────── */}
      <OptionalUpgradeCard isEntitled={isEntitled} />

      {/* ── Collapsible full topic breakdown ─────────────────── */}
      {Object.keys(results.byTopic).length > 0 ? (
        <div className="nn-cat-results__section">
          <details>
            <summary className="cursor-pointer text-sm font-semibold text-[var(--semantic-text-secondary)] hover:text-[var(--semantic-text-primary)]">
              Full topic breakdown
            </summary>
            <div className="mt-4">
              {Object.entries(results.byTopic).map(
                ([topic, { correct, total }]) => (
                  <WeakAreaRow
                    key={topic}
                    topic={topic}
                    correct={correct}
                    total={total}
                  />
                ),
              )}
            </div>
          </details>
        </div>
      ) : null}

      {/* ── Session metadata ─────────────────────────────────── */}
      {(elapsedMs != null || catReport?.stoppedReason) ? (
        <div className="nn-cat-results__section">
          <p className="text-xs text-[var(--semantic-text-muted)]">
            {elapsedMs != null ? `Time: ${formatElapsed(elapsedMs)}` : null}
            {elapsedMs != null && catReport?.stoppedReason ? " · " : null}
            {catReport?.stoppedReason
              ? `Stopped: ${catReport.stoppedReason.replace(/_/g, " ")}`
              : null}
          </p>
        </div>
      ) : null}

      {/* ── Coach next-step actions (if available) ────────────── */}
      {catReport?.suggestedNextSteps?.length ? (
        <div className="nn-cat-results__section">
          <h2 className="nn-cat-results__section-title">
            Additional Recommendations
          </h2>
          <ul className="space-y-2">
            {catReport.suggestedNextSteps.map((step) => (
              <li
                key={step.slice(0, 80)}
                className="flex items-start gap-2 text-sm text-[var(--semantic-text-secondary)]"
              >
                <span
                  className="mt-1 shrink-0 text-[var(--semantic-text-muted)]"
                  aria-hidden="true"
                >
                  ›
                </span>
                {step}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
