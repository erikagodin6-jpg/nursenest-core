import Link from "next/link";
import { ClipboardList, LineChart } from "lucide-react";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";

type Props = {
  pathway: ExamPathwayDefinition;
  /** When true, copy emphasizes using the hub while lesson count is still growing. */
  emphasizeStudyLoop?: boolean;
};

/**
 * Secondary CTA block: pathway question bank + CAT landing (public marketing routes).
 */
export function PathwayLessonsNextStepCtas({ pathway, emphasizeStudyLoop }: Props) {
  const questionsHref = buildExamPathwayPath(pathway, "questions");
  const catHref = buildExamPathwayPath(pathway, "cat");

  return (
    <section
      className="nn-study-card nn-study-card--wash mt-10 p-5 sm:p-6"
      aria-labelledby="lessons-next-steps-heading"
    >
      <h2 id="lessons-next-steps-heading" className="nn-marketing-h3 max-w-3xl">
        Next steps on this pathway
      </h2>
      <p className="nn-marketing-body-sm mt-2 max-w-2xl text-[var(--theme-muted-text)]">
        {emphasizeStudyLoop
          ? "Lessons pair with the same exam scope in the bank. Run items and CAT practice so rationales and difficulty track what you are sitting."
          : "After each lesson, stress-test judgment with pathway-matched items, then adaptive CAT sessions to approximate exam pacing."}
      </p>
      {/* nn-study-card + nn-card-interactive: same recipe as exam hub study tiles (drift fix). */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link
          href={questionsHref}
          className="nn-study-card nn-card-interactive group flex min-h-[5.5rem] gap-4 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-page-bg)] sm:p-5"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--theme-primary)_12%,transparent)] text-primary">
            <ClipboardList className="h-5 w-5" aria-hidden />
          </span>
          <span>
            <span className="block text-sm font-semibold text-[var(--theme-heading-text)] group-hover:text-primary">
              Practice questions
            </span>
            <span className="mt-1 block text-sm text-[var(--theme-muted-text)]">
              Filtered stems and rationales for {pathway.shortName}—same scope as this hub.
            </span>
          </span>
        </Link>
        <Link
          href={catHref}
          className="nn-study-card nn-study-card--wash nn-card-interactive group flex min-h-[5.5rem] gap-4 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-page-bg)] sm:p-5"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--theme-primary)_12%,transparent)] text-primary">
            <LineChart className="h-5 w-5" aria-hidden />
          </span>
          <span>
            <span className="block text-sm font-semibold text-[var(--theme-heading-text)] group-hover:text-primary">
              Take a CAT exam
            </span>
            <span className="mt-1 block text-sm text-[var(--theme-muted-text)]">
              Adaptive difficulty—sign in to run a session matched to your plan when eligible.
            </span>
          </span>
        </Link>
      </div>
    </section>
  );
}
