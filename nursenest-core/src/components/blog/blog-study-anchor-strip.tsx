import Link from "next/link";

const linkClass =
  "font-semibold text-primary underline-offset-4 hover:underline nn-marketing-body-sm";

type Props = {
  practiceQuestionsHref: string;
  adaptiveCatHref: string;
  flashcardsHref: string;
  /** Defaults match NCLEX-RN crawl targets; override for NP / PN tracks. */
  practiceAnchorText?: string;
  adaptiveAnchorText?: string;
  flashcardsAnchorText?: string;
  className?: string;
  /** Distinct `id` when both top and bottom strips appear on one page. */
  labelledById: string;
};

/**
 * Required internal links for blog SEO: exact anchor phrases requested for crawl + UX.
 */
export function BlogStudyAnchorStrip({
  practiceQuestionsHref,
  adaptiveCatHref,
  flashcardsHref,
  practiceAnchorText = "practice NCLEX questions",
  adaptiveAnchorText = "adaptive NCLEX test",
  flashcardsAnchorText = "NCLEX flashcards",
  className = "",
  labelledById,
}: Props) {
  return (
    <nav
      className={`rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_14%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_40%,transparent)] p-4 sm:p-5 not-prose ${className}`}
      aria-labelledby={labelledById}
    >
      <p id={labelledById} className="text-sm font-semibold text-[var(--theme-heading-text)]">
        Study next on NurseNest
      </p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--theme-muted-text)]">
        <li>
          <Link href={practiceQuestionsHref} className={linkClass}>
            {practiceAnchorText}
          </Link>
        </li>
        <li>
          <Link href={adaptiveCatHref} className={linkClass}>
            {adaptiveAnchorText}
          </Link>
        </li>
        <li>
          <Link href={flashcardsHref} className={linkClass}>
            {flashcardsAnchorText}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
