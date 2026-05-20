import Link from "next/link";
import {
  BAND_HELPER,
  BAND_LABELS,
  ReadinessBandBadge,
  type ReadinessBand,
} from "@/components/study/cat-readiness-hero";

/**
 * LOFT / CNPLE simulation results hero — blueprint readiness framing (not CAT adaptive).
 */
export function LoftSimulationResultsHero({
  readinessLevel,
  score,
  band,
  interpretation,
  simulationHubHref = "/app/cases/cnple",
  lessonsHref,
  onReviewHref,
  hideReviewCta = false,
}: {
  readinessLevel: string;
  score: number;
  band: ReadinessBand;
  interpretation: string;
  simulationHubHref?: string;
  lessonsHref: string;
  onReviewHref?: string | null;
  hideReviewCta?: boolean;
}) {
  return (
    <div className="nn-loft-readiness-hero" data-nn-loft-results-hero="">
      <p className="nn-loft-readiness-hero__score" aria-label={`Blueprint readiness: ${readinessLevel}`}>
        {readinessLevel}
      </p>
      <p className="nn-loft-readiness-hero__score-label">
        Simulation score {score}% · {BAND_LABELS[band]}
      </p>
      <p className="mt-1 text-sm text-[var(--semantic-text-muted)]">{BAND_HELPER[band]}</p>

      <ReadinessBandBadge band={band} />

      <p className="nn-loft-readiness-hero__interpretation">{interpretation}</p>

      <div className="nn-loft-readiness-hero__cta">
        {!hideReviewCta && onReviewHref ? (
          <Link
            href={onReviewHref}
            className="nn-btn-secondary inline-flex min-h-[2.75rem] items-center rounded-lg px-5 text-sm font-semibold"
          >
            Review simulation steps
          </Link>
        ) : null}
        <Link
          href={lessonsHref}
          className="nn-btn-secondary inline-flex min-h-[2.75rem] items-center rounded-lg px-5 text-sm font-semibold"
        >
          Study weak domains
        </Link>
        <Link
          href={simulationHubHref}
          className="nn-btn-primary inline-flex min-h-[2.75rem] items-center rounded-lg px-5 text-sm font-semibold shadow-none"
        >
          Start another LOFT simulation
        </Link>
      </div>
    </div>
  );
}
