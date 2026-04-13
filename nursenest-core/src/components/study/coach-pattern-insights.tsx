import type { LearnerPatternSnapshot } from "@/lib/coach/study-coach-types";

function linesFrom(snapshot: LearnerPatternSnapshot): string[] {
  const out: string[] = [];
  if (snapshot.summarySignals.length) out.push(...snapshot.summarySignals.slice(0, 4));
  if (snapshot.repeatedWeakTopics.length) {
    out.push(`Repeated weak areas: ${snapshot.repeatedWeakTopics.slice(0, 4).join(", ")}`);
  }
  if (snapshot.improvingTopics.length) {
    out.push(`Improving: ${snapshot.improvingTopics.slice(0, 3).join(", ")}`);
  }
  return out.slice(0, 6);
}

/**
 * Short deterministic pattern readout for the dashboard.
 */
export function CoachPatternInsights({ patterns }: { patterns: LearnerPatternSnapshot }) {
  const lines = linesFrom(patterns);
  if (lines.length === 0) return null;

  return (
    <section className="nn-coach-pattern-insights" aria-label="Study pattern signals">
      <h3 className="nn-coach-pattern-insights__title">Pattern signals</h3>
      <ul className="nn-coach-pattern-insights__list">
        {lines.map((line, idx) => (
          <li key={`${idx}-${line.slice(0, 48)}`} className="nn-coach-pattern-insights__item">
            {line}
          </li>
        ))}
      </ul>
    </section>
  );
}
