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
  /**
   * NP hubs: extra soft glow from `--theme-secondary` so headers stay multi-hue (not single-accent flat).
   * All values are theme tokens — safe across theme switching.
   */
  heroAccent?: "default" | "np";
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
  heroAccent = "default",
}: Props) {
  const place = pathwayCountryLabel(pathway);
  const intro = lead ?? pathwayLessonsHubLead(pathway);
  const examOverviewHref = buildExamPathwayPath(pathway);
  const npAccent = heroAccent === "np";

  return (
    <header
      className={`relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--theme-primary)_10%,var(--border-subtle))] bg-gradient-to-br from-[var(--nn-presentation-wash)] via-[var(--theme-page-bg)] to-[color-mix(in_srgb,var(--theme-primary)_5%,var(--theme-page-bg))] px-5 py-7 shadow-[var(--shadow-card)] sm:px-8 sm:py-10${npAccent ? " nn-lessons-hero--np" : ""}`}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-[color-mix(in_srgb,var(--theme-primary)_8%,transparent)] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-[color-mix(in_srgb,var(--theme-primary)_5%,transparent)] blur-3xl"
        aria-hidden
      />
      {npAccent ? (
        <div
          className="pointer-events-none absolute bottom-8 right-1/4 h-44 w-44 rounded-full bg-[color-mix(in_srgb,var(--theme-secondary)_18%,transparent)] blur-3xl"
          aria-hidden
        />
      ) : null}

      <div className="relative">
        <p className="nn-marketing-label nn-marketing-label--accent">
          {pathway.shortName} · {place}
        </p>
        <h1 className="nn-marketing-h1 mt-3 max-w-4xl text-balance">
          {pathwayLessonHubH1(pathway)}
        </h1>
        <p className="nn-marketing-body mt-4 max-w-3xl text-pretty text-[var(--theme-muted-text)]">
          {intro}
        </p>

        <div className="mt-6">
          <Link
            href={examOverviewHref}
            className="nn-study-pill-secondary inline-flex min-h-11 items-center justify-center px-5 py-2.5 text-sm font-semibold"
          >
            ← {pathway.shortName} exam hub
          </Link>
        </div>

        {showSearch ? (
          <div className="mt-8 border-t border-[color-mix(in_srgb,var(--border-subtle)_85%,var(--theme-primary))] pt-6">
            <PathwayLessonsHubSearch basePath={lessonsBasePath} initialQuery={initialQuery} />
          </div>
        ) : null}
      </div>
    </header>
  );
}
