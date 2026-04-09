import Link from "next/link";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import { pathwayCountryLabel, pathwayLessonHubH1 } from "@/lib/lessons/pathway-lesson-hub-seo";
import { pathwayLessonsHubLead } from "@/lib/lessons/pathway-lessons-hub-intro";
import { PathwayLessonsHubSearch } from "@/components/pathway-lessons/pathway-lessons-hub-search";

type Props = {
  pathway: ExamPathwayDefinition;
  /** Lessons index path, e.g. `/us/rn/nclex-rn/lessons` */
  lessonsBasePath: string;
  lead?: string;
  /** When false, search is omitted (e.g. zero lessons in catalog). */
  showSearch?: boolean;
  initialQuery?: string;
};

/**
 * Premium header band: pathway context, H1, exam-specific intro, back link to exam hub, optional search.
 * Practice questions + CAT live in {@link PathwayLessonsNextStepCtas} so the page has one clear secondary actions block.
 */
export function PathwayLessonsStudyHero({
  pathway,
  lessonsBasePath,
  lead,
  showSearch = true,
  initialQuery,
}: Props) {
  const place = pathwayCountryLabel(pathway);
  const intro = lead ?? pathwayLessonsHubLead(pathway);
  const examOverviewHref = buildExamPathwayPath(pathway);

  return (
    <header className="relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--theme-primary)_12%,var(--border-subtle))] bg-gradient-to-br from-[var(--nn-presentation-wash)] via-[var(--theme-page-bg)] to-[color-mix(in_srgb,var(--theme-primary)_6%,var(--theme-page-bg))] px-5 py-8 shadow-[var(--shadow-card)] sm:px-8 sm:py-10">
      <div
        className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-[color-mix(in_srgb,var(--theme-primary)_8%,transparent)] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-[color-mix(in_srgb,var(--theme-primary)_5%,transparent)] blur-3xl"
        aria-hidden
      />

      <div className="relative">
        <p className="nn-marketing-label nn-marketing-label--accent">
          {pathway.shortName} · {place}
        </p>
        <h1 className="mt-3 max-w-4xl text-balance text-3xl font-extrabold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl">
          {pathwayLessonHubH1(pathway)}
        </h1>
        <p className="mt-4 max-w-3xl text-pretty text-base leading-relaxed text-[var(--theme-muted-text)] sm:text-[1.05rem]">
          {intro}
        </p>

        <div className="mt-6">
          <Link
            href={examOverviewHref}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-card/90 px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm backdrop-blur-sm transition hover:border-primary/25 hover:bg-card"
          >
            ← {pathway.shortName} exam hub
          </Link>
        </div>

        {showSearch ? (
          <div className="mt-8 border-t border-[color-mix(in_srgb,var(--border-subtle)_80%,transparent)] pt-6">
            <PathwayLessonsHubSearch basePath={lessonsBasePath} initialQuery={initialQuery} />
          </div>
        ) : null}
      </div>
    </header>
  );
}
