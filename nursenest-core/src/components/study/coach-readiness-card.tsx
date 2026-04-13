import type { ReadinessBand, ReadinessScore } from "@/lib/coach/study-coach-types";

function bandLabel(band: ReadinessBand): string {
  if (band === "at_risk") return "At Risk";
  if (band === "borderline") return "Borderline";
  if (band === "passing_range") return "Passing Range";
  return "Strong";
}

function bandModifier(band: ReadinessBand): string {
  return `nn-coach-readiness-card--${band.replace(/_/g, "-")}`;
}

/**
 * Compact Study Coach readiness lens (rule-based), shown next to the app readiness card.
 */
export function CoachReadinessCard({ readiness }: { readiness: ReadinessScore }) {
  return (
    <aside
      className={`nn-coach-readiness-card ${bandModifier(readiness.band)}`}
      aria-label="Study Coach readiness lens"
    >
      <p className="nn-coach-readiness-card__eyebrow">Study Coach lens</p>
      <div className="nn-coach-readiness-card__row">
        <span className="nn-coach-readiness-card__score">{readiness.score}</span>
        <div className="nn-coach-readiness-card__meta">
          <p className="nn-coach-readiness-card__band">{bandLabel(readiness.band)}</p>
          <p className="nn-coach-readiness-card__conf">Confidence: {readiness.confidence}</p>
        </div>
      </div>
      <p className="nn-coach-readiness-card__note">
        Built from the same practice and weak-topic signals you already see here, weighted for coaching.
      </p>
    </aside>
  );
}
