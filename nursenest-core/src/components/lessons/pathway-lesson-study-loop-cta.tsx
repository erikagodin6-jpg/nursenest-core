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
import { TrackedStudyLoopCatLink } from "@/components/student/tracked-study-loop-cat-link";
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
  /** Calmer chrome for in-app learner lesson (vs marketing lesson detail). */
  visualVariant = "marketing",
}: {
  pathway: ExamPathwayDefinition;
  lessonsBasePath: string;
  topicLabel: string;
  topicSlug: string;
  relatedLessons: RelatedRow[];
  currentSlug: string;
  catAuthState?: StudyLoopCatAuthState;
  visualVariant?: "marketing" | "learner";
}) {
  const { effectiveLabel, hasTopicFilter } = normalizeLessonTopicContext(topicLabel, topicSlug);
  const practice = lessonStudyLoopPracticeHrefs(pathway, topicLabel, topicSlug);
  const relatedHub = lessonStudyLoopRelatedLessonsHubHref(lessonsBasePath, topicSlug);
  const cat = lessonStudyLoopCatHrefs(pathway, catAuthState);
  const catLine = catPathwayRegionalExamLine(pathway);
  const catShort = catPathwayShortCatLabel(pathway);

  const filtered = relatedLessons.filter((r) => r.slug !== currentSlug).slice(0, RELATED_PREVIEW);
  const learner = visualVariant === "learner";

  return (
    <section
      className={`relative mx-auto max-w-5xl overflow-hidden p-4 sm:p-5 ${
        learner
          ? "nn-lesson-study-loop--learner mt-6"
          : "nn-study-loop-outer mt-8 rounded-lg border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--theme-page-bg)_97%,var(--semantic-panel-positive)_3%)] sm:mt-10"
      }`}
      aria-labelledby="lesson-study-loop-heading"
      data-nn-qa-study-loop="true"
    >
      <div className="relative">
        <p className="nn-lesson-module-eyebrow">After this lesson</p>
        <h2
          id="lesson-study-loop-heading"
          className="mt-1 text-balance text-base font-semibold tracking-tight text-[var(--theme-heading-text)] sm:text-lg"
        >
          Keep momentum
        </h2>
        <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-[var(--theme-muted-text)] sm:text-sm">
          {hasTopicFilter ? (
            <>
              Stay on <span className="font-medium text-[var(--theme-heading-text)]">{effectiveLabel || "this topic"}</span>
              —everything below stays on the same exam track.
            </>
          ) : (
            <>Topic tag not set on this lesson yet; hubs below still respect pathway scope.</>
          )}
        </p>

        <div className="mt-5 grid gap-4 sm:gap-5 lg:grid-cols-3">
          <div className="flex flex-col rounded-lg border border-[color-mix(in_srgb,var(--semantic-border-soft)_88%,var(--semantic-brand)_12%)] bg-[var(--bg-card)] p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-2 text-[var(--theme-heading-text)]">
              <ClipboardList className="h-4 w-4 shrink-0 text-[var(--semantic-brand)]" aria-hidden />
              <h3 className="text-sm font-semibold tracking-tight sm:text-base">Practice this topic</h3>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-[var(--theme-muted-text)] sm:text-sm">
              {hasTopicFilter
                ? "Topic-filtered bank, then sign in for full items in this pathway."
                : "Pathway question hub—exam-scoped items only."}
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <Link
                href={practice.app}
                className="inline-flex min-h-10 items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-page-bg)]"
              >
                {catAuthState === "signed_in" ? "Open topic drill" : "Start practice (sign in)"}
              </Link>
              <Link
                href={practice.marketing}
                className="inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--semantic-border-soft)] px-3 py-2 text-sm font-semibold text-[var(--theme-heading-text)] transition hover:bg-[var(--theme-muted-surface)]/40"
              >
                Question hub{hasTopicFilter ? " · filtered" : ""}
              </Link>
            </div>
          </div>

          <div className="flex flex-col rounded-lg border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--bg-card)_96%,var(--semantic-panel-cool)_4%)] p-4 sm:p-5">
            <div className="flex items-center gap-2 text-[var(--theme-heading-text)]">
              <BookOpen className="h-4 w-4 shrink-0 text-[var(--semantic-info)]" aria-hidden />
              <h3 className="text-sm font-semibold tracking-tight sm:text-base">Related lessons</h3>
            </div>
            {filtered.length > 0 ? (
              <ul className="mt-2 space-y-1">
                {filtered.map((r, relIdx) => {
                  const href = pathwayLessonMarketingDetailHref(lessonsBasePath, r.slug);
                  if (!href) return null;
                  return (
                    <li key={r.slug}>
                      <Link
                        href={href}
                        data-nn-qa-related-lesson={relIdx === 0 ? "true" : undefined}
                        className="block min-h-9 rounded-md px-1.5 py-1.5 text-sm font-medium text-[var(--semantic-brand)] transition hover:bg-[color-mix(in_srgb,var(--semantic-brand)_6%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_35%,transparent)]"
                      >
                        {r.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-2 text-xs text-[var(--theme-muted-text)] sm:text-sm">
                No indexed siblings yet—use the topic or lesson hub.
              </p>
            )}
            <Link
              href={relatedHub}
              className="mt-auto inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--semantic-border-soft)] px-3 py-2 text-sm font-semibold text-primary transition hover:border-primary/30 hover:bg-[var(--theme-muted-surface)]/30"
            >
              {hasTopicFilter ? "All lessons in this topic" : "Back to lesson hub"}
            </Link>
          </div>

          <div className="flex flex-col rounded-lg border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--bg-card)_96%,var(--semantic-panel-warm)_4%)] p-4 sm:p-5">
            <p className="nn-lesson-module-eyebrow text-[var(--semantic-chart-2)]">{catLine}</p>
            <div className="mt-1 flex items-center gap-2 text-[var(--theme-heading-text)]">
              <LineChart className="h-4 w-4 shrink-0 text-[var(--semantic-chart-2)]" aria-hidden />
              <h3 className="text-sm font-semibold tracking-tight sm:text-base">{catShort}</h3>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-[var(--theme-muted-text)] sm:text-sm">
              {cat.primaryKind === "app_start"
                ? `Run ${catShort} in the app when you want adaptive pressure.`
                : `Preview how ${catShort} sessions work, then sign in from the app.`}
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <TrackedStudyLoopCatLink
                href={cat.primaryHref}
                sourceSurface="lesson_study_loop_primary"
                pathwayId={pathway.id}
                className="inline-flex min-h-10 items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-page-bg)]"
              >
                {cat.primaryKind === "app_start" ? `Start ${catShort}` : `View ${catShort} landing`}
              </TrackedStudyLoopCatLink>
              {cat.showAdaptiveShortcut && cat.secondaryHref ? (
                <TrackedStudyLoopCatLink
                  href={cat.secondaryHref}
                  sourceSurface="lesson_study_loop_secondary"
                  pathwayId={pathway.id}
                  className="inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--semantic-border-soft)] px-3 py-2 text-sm font-semibold text-[var(--theme-heading-text)]"
                >
                  Start {catShort}
                </TrackedStudyLoopCatLink>
              ) : (
                <p className="text-[11px] text-[var(--theme-muted-text)]">
                  Timed mocks also live on your exam hub when CAT is not enabled for this track.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
