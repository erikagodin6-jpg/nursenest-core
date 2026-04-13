import type { WeaknessPriority } from "@/lib/coach/study-coach-types";

const rankDots = [
  "nn-coach-priority-list__dot--1",
  "nn-coach-priority-list__dot--2",
  "nn-coach-priority-list__dot--3",
  "nn-coach-priority-list__dot--4",
  "nn-coach-priority-list__dot--5",
] as const;

/**
 * Deterministic ranked weak-topic priorities for the dashboard.
 */
export function CoachPriorityList({
  priorities,
  maxItems = 5,
}: {
  priorities: WeaknessPriority[];
  maxItems?: number;
}) {
  const rows = priorities.slice(0, maxItems);
  if (rows.length === 0) return null;

  return (
    <section className="nn-coach-priority-list" aria-label="Ranked study priorities">
      <h3 className="nn-coach-priority-list__title">Ranked focus</h3>
      <p className="nn-coach-priority-list__intro">Highest impact first, from recent misses and streaks.</p>
      <ol className="nn-coach-priority-list__list">
        {rows.map((p, i) => (
          <li key={p.topicSlug} className="nn-coach-priority-list__item">
            <span className={`nn-coach-priority-list__dot ${rankDots[Math.min(i, rankDots.length - 1)]}`} aria-hidden />
            <div className="nn-coach-priority-list__body">
              <p className="nn-coach-priority-list__label">{p.label}</p>
              {p.reasons[0] ? (
                <p className="nn-coach-priority-list__reason">{p.reasons[0]}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
