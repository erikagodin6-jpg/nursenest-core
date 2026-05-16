import type { RetentionMemoryState, ReviewPriority } from "@/lib/learning-science/adaptive-retention-engine";
import { sortConceptsForReview } from "@/lib/learning-science/adaptive-retention-engine";

const PRIORITY_LABEL: Record<ReviewPriority, string> = {
  critical: "Critical misconception",
  high: "High-priority review",
  medium: "Needs reinforcement",
  low: "Spaced review",
};

const PRIORITY_CLASS: Record<ReviewPriority, string> = {
  critical: "border-[color-mix(in_srgb,var(--semantic-danger)_42%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_08%,var(--semantic-surface))]",
  high: "border-[color-mix(in_srgb,var(--semantic-warning)_42%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_08%,var(--semantic-surface))]",
  medium: "border-[color-mix(in_srgb,var(--semantic-info)_32%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_06%,var(--semantic-surface))]",
  low: "border-[color-mix(in_srgb,var(--semantic-success)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_05%,var(--semantic-surface))]",
};

function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function AdaptiveReviewQueue({
  states,
  title = "Your adaptive review queue",
  emptyMessage = "No priority concepts are due right now. Keep learning and this queue will adapt as you answer.",
}: {
  states: readonly RetentionMemoryState[];
  title?: string;
  emptyMessage?: string;
}) {
  const dueStates = sortConceptsForReview(states);

  return (
    <section
      className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_38%,var(--semantic-surface))] p-5 shadow-[var(--semantic-shadow-soft)]"
      aria-labelledby="adaptive-review-queue-heading"
      data-testid="adaptive-review-queue"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-[color-mix(in_srgb,var(--semantic-info)_88%,var(--semantic-text-primary))]">
            Memory-aware study plan
          </p>
          <h2 id="adaptive-review-queue-heading" className="mt-1 text-xl font-semibold text-[var(--semantic-text-primary)]">
            {title}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            Concepts are prioritized by memory strength, confidence calibration, incorrect streaks, and high-confidence misses.
          </p>
        </div>
        <span className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1 text-xs font-semibold text-[var(--semantic-text-secondary)]">
          {dueStates.length} due
        </span>
      </div>

      {dueStates.length === 0 ? (
        <div className="mt-5 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 text-sm text-[var(--semantic-text-secondary)]">
          {emptyMessage}
        </div>
      ) : (
        <div className="mt-5 grid gap-3">
          {dueStates.map((state) => (
            <article
              key={state.conceptId}
              className={`rounded-xl border p-4 ${PRIORITY_CLASS[state.priority]}`}
              data-testid="adaptive-review-concept"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{state.conceptId}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                    {PRIORITY_LABEL[state.priority]}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-semibold text-[var(--semantic-text-secondary)]">
                  <span className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-2.5 py-1">
                    Memory {percent(state.memoryStrength)}
                  </span>
                  <span className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-2.5 py-1">
                    Calibration {percent(state.confidenceCalibration)}
                  </span>
                </div>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
                {state.recommendedAction}
              </p>

              <dl className="mt-3 grid gap-2 text-xs text-[var(--semantic-text-secondary)] sm:grid-cols-3">
                <div className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-2">
                  <dt className="font-semibold text-[var(--semantic-text-primary)]">Correct streak</dt>
                  <dd>{state.correctStreak}</dd>
                </div>
                <div className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-2">
                  <dt className="font-semibold text-[var(--semantic-text-primary)]">Incorrect streak</dt>
                  <dd>{state.incorrectStreak}</dd>
                </div>
                <div className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-2">
                  <dt className="font-semibold text-[var(--semantic-text-primary)]">Overconfidence misses</dt>
                  <dd>{state.overconfidenceMisses}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
