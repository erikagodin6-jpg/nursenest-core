import Link from "next/link";
import { BookOpen, ClipboardList, LineChart } from "lucide-react";
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
}: {
  pathway: ExamPathwayDefinition;
  lessonsBasePath: string;
  topicLabel: string;
  topicSlug: string;
  relatedLessons: RelatedRow[];
  currentSlug: string;
}) {
  const { effectiveLabel, hasTopicFilter } = normalizeLessonTopicContext(topicLabel, topicSlug);
  const practice = lessonStudyLoopPracticeHrefs(pathway, topicLabel, topicSlug);
  const relatedHub = lessonStudyLoopRelatedLessonsHubHref(lessonsBasePath, topicSlug);
  const cat = lessonStudyLoopCatHrefs(pathway);

  const filtered = relatedLessons.filter((r) => r.slug !== currentSlug).slice(0, RELATED_PREVIEW);

  return (
    <section
      className="relative mt-12 overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--theme-primary)_10%,var(--border-subtle))] bg-gradient-to-br from-[var(--nn-presentation-wash)] via-[var(--theme-page-bg)] to-[color-mix(in_srgb,var(--theme-primary)_5%,var(--theme-page-bg))] p-5 shadow-[var(--shadow-card)] sm:p-8"
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

        <div className="mt-8 grid gap-5 sm:gap-6 lg:grid-cols-3">
          {/* Practice */}
          <div className="nn-study-card nn-study-card--wash flex flex-col p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-[var(--theme-heading-text)]">
              <ClipboardList className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              <h3 className="text-sm font-semibold tracking-tight">Practice this topic</h3>
            </div>
            <p className="nn-marketing-body-sm mt-3 text-[var(--theme-muted-text)]">
              {hasTopicFilter
                ? "Open the bank filtered to this topic, then sign in to run items with the same pathway context."
                : "Open the pathway question hub—every item stays inside this exam’s scope."}
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href={practice.app}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95"
              >
                Start practice (sign in)
              </Link>
              <Link
                href={practice.marketing}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:border-primary/25"
              >
                Question hub{hasTopicFilter ? " · filtered" : ""}
              </Link>
            </div>
          </div>

          {/* Related lessons */}
          <div className="nn-study-card nn-study-card--wash flex flex-col p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-[var(--theme-heading-text)]">
              <BookOpen className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              <h3 className="text-sm font-semibold tracking-tight">Review related lessons</h3>
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
                        className="block rounded-xl border border-transparent px-2 py-1.5 text-sm font-semibold text-primary transition hover:border-primary/25 hover:bg-[var(--theme-muted-surface)]/50"
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
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-primary/30 bg-[color-mix(in_srgb,var(--theme-primary)_8%,transparent)] px-4 py-2.5 text-sm font-semibold text-primary hover:bg-[color-mix(in_srgb,var(--theme-primary)_14%,transparent)]"
            >
              {hasTopicFilter ? "All lessons in this topic" : "Back to lesson hub"}
            </Link>
          </div>

          {/* CAT */}
          <div className="nn-study-card nn-study-card--wash flex flex-col p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-[var(--theme-heading-text)]">
              <LineChart className="h-5 w-5 shrink-0 text-primary" aria-hidden />
              <h3 className="text-sm font-semibold tracking-tight">Take a CAT exam</h3>
            </div>
            <p className="nn-marketing-body-sm mt-3 text-[var(--theme-muted-text)]">
              Adaptive difficulty matches this pathway. Use the public CAT landing to learn how sessions work, then sign in when
              you are ready.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href={cat.marketing}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95"
              >
                CAT prep · this pathway
              </Link>
              {cat.showAdaptiveShortcut && cat.appSession ? (
                <Link
                  href={cat.appSession}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border-subtle)] px-4 py-2.5 text-sm font-semibold hover:border-primary/25"
                >
                  Start adaptive session
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
