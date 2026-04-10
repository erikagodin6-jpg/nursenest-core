import Link from "next/link";
import { BookOpen, ClipboardList, LineChart } from "lucide-react";
import { catPathwayRegionalExamLine, catPathwayShortCatLabel } from "@/lib/exam-pathways/cat-pathway-labels";
import type { StudyLoopCatAuthState } from "@/lib/exam-pathways/study-loop-cat-routing";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import {
  lessonStudyLoopCatHrefs,
  lessonStudyLoopPracticeHrefs,
  lessonStudyLoopRelatedLessonsHubHref,
  normalizeLessonTopicContext,
} from "@/components/lessons/pathway-lesson-link-practice";
import { pathwayLessonMarketingDetailHref } from "@/lib/lessons/pathway-lesson-types";

type RelatedRow = { slug: string; title: string };

const RELATED_PREVIEW = 4;

/**
 * Canonical end-of-lesson study loop: practice (topic-aware when data allows), related lessons, CAT.
 * All hrefs resolve to live marketing or login-callback app routes for this pathway.
 */
export function PathwayLessonStudyLoopCta({
  pathway,
  lessonsBasePath,
  topicLabel,
  topicSlug,
  relatedLessons,
  currentSlug,
  catAuthState = "public",
}: {
  pathway: ExamPathwayDefinition;
  lessonsBasePath: string;
  topicLabel: string;
  topicSlug: string;
  relatedLessons: RelatedRow[];
  currentSlug: string;
  catAuthState?: StudyLoopCatAuthState;
}) {
  const { effectiveLabel, hasTopicFilter } = normalizeLessonTopicContext(topicLabel, topicSlug);
  const practice = lessonStudyLoopPracticeHrefs(pathway, topicLabel, topicSlug);
  const relatedHub = lessonStudyLoopRelatedLessonsHubHref(lessonsBasePath, topicSlug);
  const cat = lessonStudyLoopCatHrefs(pathway, catAuthState);
  const catLine = catPathwayRegionalExamLine(pathway);
  const catShort = catPathwayShortCatLabel(pathway);

  const filtered = relatedLessons.filter((r) => r.slug !== currentSlug).slice(0, RELATED_PREVIEW);

  return (
    <section
      className="nn-study-loop-outer relative mt-12 overflow-hidden p-5 sm:p-8"
      aria-labelledby="lesson-study-loop-heading"
      data-nn-qa-study-loop="true"
    >
      <div
        className="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full bg-[color-mix(in_srgb,var(--theme-primary)_8%,transparent)] blur-3xl"
        aria-hidden
      />
      <div className="relative">
        <p className="nn-marketing-label nn-marketing-label--accent">After this lesson</p>
        <h2 id="lesson-study-loop-heading" className="nn-marketing-h3 mt-2 text-balance text-[var(--theme-heading-text)]">
          Your next step on {pathway.shortName}
        </h2>
        <p className="nn-marketing-body-sm mt-2 max-w-2xl text-[var(--theme-muted-text)]">
          {hasTopicFilter ? (
            <>
              Stay on{" "}
              <span className="font-medium text-[var(--theme-heading-text)]">
                {effectiveLabel || pathway.shortName}
              </span>
              —questions and lessons stay exam-scoped so you are not mixing tracks.
            </>
          ) : (
            <>
              This lesson does not carry a topic cluster tag yet. Use the full pathway bank and lesson hub—the scope is still
              locked to {pathway.shortName}.
            </>
          )}
        </p>

        {/* Primary column = solid nn-study-card; siblings stay wash so practice leads the loop (hierarchy). */}
        <div className="mt-8 grid gap-5 sm:gap-6 lg:grid-cols-3">
          {/* Practice */}
          <div className="nn-study-card flex flex-col p-5 sm:p-6">
            <div className="flex items-center gap-2 text-[var(--theme-heading-text)]">
              <ClipboardList className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              <h3 className="text-base font-semibold tracking-tight">Practice this topic</h3>
            </div>
            <p className="nn-marketing-body-sm mt-3 text-[var(--theme-muted-text)]">
              {hasTopicFilter
                ? "Open the bank filtered to this topic, then sign in to run items with the same pathway context."
                : "Open the pathway question hub—every item stays inside this exam’s scope."}
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href={practice.app}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-page-bg)]"
              >
                Start practice (sign in)
              </Link>
              <Link
                href={practice.marketing}
                className="nn-study-pill-secondary inline-flex min-h-11 items-center justify-center px-4 py-2.5"
              >
                Question hub{hasTopicFilter ? " · filtered" : ""}
              </Link>
            </div>
          </div>

          {/* Related lessons */}
          <div className="nn-study-card nn-study-card--wash flex flex-col p-5 sm:p-6">
            <div className="flex items-center gap-2 text-[var(--theme-heading-text)]">
              <BookOpen className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              <h3 className="text-base font-semibold tracking-tight">Review related lessons</h3>
            </div>
            {filtered.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {filtered.map((r, relIdx) => {
                  const href = pathwayLessonMarketingDetailHref(lessonsBasePath, r.slug);
                  if (!href) return null;
                  return (
                    <li key={r.slug}>
                      <Link
                        href={href}
                        data-nn-qa-related-lesson={relIdx === 0 ? "true" : undefined}
                        className="block min-h-11 rounded-xl border border-transparent px-2 py-2.5 text-sm font-semibold text-primary transition hover:border-primary/25 hover:bg-[var(--theme-muted-surface)]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                      >
                        {r.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="nn-marketing-body-sm mt-3 text-[var(--theme-muted-text)]">
                No sibling lessons indexed for this cluster yet. Browse the topic or full hub for more reading.
              </p>
            )}
            <Link
              href={relatedHub}
              className="nn-study-pill-secondary nn-study-pill-secondary--accent mt-4 inline-flex min-h-11 w-full items-center justify-center px-4 py-2.5 text-sm font-semibold text-primary"
            >
              {hasTopicFilter ? "All lessons in this topic" : "Back to lesson hub"}
            </Link>
          </div>

          {/* CAT */}
          <div className="nn-study-card nn-study-card--wash flex flex-col p-5 sm:p-6">
            <p className="nn-marketing-label nn-marketing-label--accent text-[11px] font-semibold uppercase tracking-wide text-primary">
              {catLine}
            </p>
            <div className="mt-2 flex items-center gap-2 text-[var(--theme-heading-text)]">
              <LineChart className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              <h3 className="text-base font-semibold tracking-tight">{catShort}</h3>
            </div>
            <p className="nn-marketing-body-sm mt-3 text-[var(--theme-muted-text)]">
              {cat.primaryKind === "app_start"
                ? `Start ${catShort} directly in the app for ${pathway.shortName}.`
                : `Open the public landing for ${catShort} to see how sessions work, then sign in when you are ready.`}
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href={cat.primaryHref}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-page-bg)]"
              >
                {cat.primaryKind === "app_start" ? `Start ${catShort}` : `View ${catShort} landing`}
              </Link>
              {cat.showAdaptiveShortcut && cat.secondaryHref ? (
                <Link
                  href={cat.secondaryHref}
                  className="nn-study-pill-secondary inline-flex min-h-11 items-center justify-center px-4 py-2.5"
                >
                  Start {catShort}
                </Link>
              ) : (
                <p className="text-xs text-[var(--theme-muted-text)]">
                  Timed practice exams are available from your exam hub if adaptive CAT is not enabled for this track yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
