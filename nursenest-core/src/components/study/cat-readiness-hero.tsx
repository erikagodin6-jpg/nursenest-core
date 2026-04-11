import Link from "next/link";

export type ReadinessBand =
  | "not_ready"
  | "building"
  | "approaching"
  | "exam_ready";

/** Deterministic readiness band from a 0–100 score (spec §3). */
export function getReadinessBand(score: number): ReadinessBand {
  if (score >= 75) return "exam_ready";
  if (score >= 60) return "approaching";
  if (score >= 40) return "building";
  return "not_ready";
}

export const BAND_LABELS: Record<ReadinessBand, string> = {
  not_ready: "Not Ready Yet",
  building: "Building Readiness",
  approaching: "Approaching Readiness",
  exam_ready: "Exam Ready",
};

/** Short helper text shown below the band badge (spec §3). */
export const BAND_HELPER: Record<ReadinessBand, string> = {
  not_ready: "Focus on core content review and targeted question practice.",
  building: "Your foundation is improving, but performance is still inconsistent.",
  approaching: "You are close, but a few weak areas are still lowering reliability.",
  exam_ready:
    "Your performance is strong and stable enough to continue exam-style training.",
};

const BAND_CSS: Record<ReadinessBand, string> = {
  not_ready: "nn-cat-readiness-badge--not-ready",
  building: "nn-cat-readiness-badge--building",
  approaching: "nn-cat-readiness-badge--approaching",
  exam_ready: "nn-cat-readiness-badge--exam-ready",
};

/** Pill badge that displays the readiness band label. */
export function ReadinessBandBadge({ band }: { band: ReadinessBand }) {
  return (
    <span className={`nn-cat-readiness-badge ${BAND_CSS[band]}`}>
      {BAND_LABELS[band]}
    </span>
  );
}

/**
 * CatResultsHero — full-width hero card at the top of the results page.
 *
 * Shows: large score → "Readiness Score" label → band badge →
 * one-sentence interpretation → primary CTA row (spec §2).
 */
export function CatResultsHero({
  score,
  band,
  interpretation,
  testId,
  lessonsHref,
}: {
  score: number;
  band: ReadinessBand;
  interpretation: string;
  testId: string;
  lessonsHref: string;
}) {
  return (
    <div className="nn-cat-readiness-hero">
      <p
        className="nn-cat-readiness-hero__score tabular-nums"
        aria-label={`Readiness score: ${score}%`}
      >
        {score}%
      </p>
      <p className="nn-cat-readiness-hero__score-label">Readiness Score</p>

      <ReadinessBandBadge band={band} />

      <p className="nn-cat-readiness-hero__interpretation">{interpretation}</p>

      <div className="nn-cat-readiness-hero__cta">
        <Link
          href={`/app/practice-tests/${testId}/results`}
          className="nn-btn-secondary inline-flex min-h-[2.75rem] items-center rounded-lg px-5 text-sm font-semibold"
        >
          Review This CAT
        </Link>
        <Link
          href={lessonsHref}
          className="nn-btn-secondary inline-flex min-h-[2.75rem] items-center rounded-lg px-5 text-sm font-semibold"
        >
          Study Weak Areas
        </Link>
        <Link
          href="/app/practice-tests"
          className="nn-btn-primary inline-flex min-h-[2.75rem] items-center rounded-lg px-5 text-sm font-semibold shadow-none"
        >
          Start Another CAT
        </Link>
      </div>
    </div>
  );
}
