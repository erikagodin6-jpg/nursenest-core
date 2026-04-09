import Link from "next/link";
import { BookOpen, Layers, Sparkles } from "lucide-react";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { appPathwayCatSessionStartPath } from "@/lib/exam-pathways/pathway-cat-flow";
import { pathwayAllowsCatAdaptiveStart } from "@/lib/exam-pathways/pathway-entitlements";
import {
  pathwayAppQuestionBankTopicHref,
  pathwayMarketingQuestionBankTopicHref,
} from "@/components/lessons/pathway-lesson-link-practice";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { pathwayLessonPublicDetailPath } from "@/lib/lessons/pathway-lesson-types";

const RELATED_CAP = 5;

type RelatedRow = { slug: string; title: string };

/**
 * End-of-lesson “next learning” block: related lessons, pathway-scoped practice, then adaptive CAT (when enabled).
 * Single surface — avoids duplicating separate practice strips + related lists.
 */
export function PathwayLessonRelatedLearningBlock({
  pathway,
  topic,
  topicSlug,
  lessonsBasePath,
  relatedLessons,
  currentSlug,
}: {
  pathway: ExamPathwayDefinition;
  topic: string;
  topicSlug: string;
  lessonsBasePath: string;
  relatedLessons: RelatedRow[];
  /** Exclude from related list (same page). */
  currentSlug: string;
}) {
  const topicHubHref = topicSlug?.trim()
    ? `${lessonsBasePath.replace(/\/$/, "")}/topics/${encodeURIComponent(topicSlug.trim())}`
    : lessonsBasePath;

  const filtered = relatedLessons.filter((r) => r.slug !== currentSlug).slice(0, RELATED_CAP);
  const topicCode = topicSlug?.trim() || undefined;
  const showCat = pathwayAllowsCatAdaptiveStart(pathway);
  const catHref = loginWithCallback(appPathwayCatSessionStartPath(pathway.id));

  return (
    <section
      className="nn-study-callout nn-related-learning mt-12 overflow-hidden rounded-2xl border border-border/80 bg-[color-mix(in_srgb,var(--theme-primary)_4%,var(--theme-card-bg))] p-6 sm:p-8"
      aria-labelledby="related-learning-heading"
    >
      <div className="border-b border-border/60 pb-5">
        <p className="nn-marketing-label nn-marketing-label--accent">Next steps</p>
        <h2 id="related-learning-heading" className="nn-marketing-h3 mt-2 text-[var(--theme-heading-text)]">
          Keep momentum on {pathway.shortName}
        </h2>
        <p className="nn-marketing-body-sm mt-2 max-w-prose text-[var(--theme-muted-text)]">
          Related lessons, pathway-scoped questions, then adaptive practice when you want exam-style pressure—kept to a small,
          intentional set.
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[var(--theme-heading-text)]">
            <BookOpen className="h-4 w-4 shrink-0 text-primary" aria-hidden />
            <h3 className="text-sm font-semibold tracking-tight">Related lessons</h3>
          </div>
          {filtered.length === 0 ? (
            <p className="nn-marketing-body-sm mt-3 text-muted-foreground">
              No additional lessons in this topic cluster yet. Browse the{" "}
              <Link href={topicHubHref} className="font-medium text-primary hover:underline">
                {topic.trim() || "topic"} index
              </Link>{" "}
              or return to the full hub.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {filtered.map((r) => {
                const href = pathwayLessonPublicDetailPath(pathway, r.slug);
                if (!href) return null;
                return (
                  <li key={r.slug}>
                    <Link
                      href={href}
                      className="group block rounded-lg border border-transparent bg-background/30 px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-background/80 hover:text-primary"
                    >
                      {r.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[var(--theme-heading-text)]">
            <Layers className="h-4 w-4 shrink-0 text-primary" aria-hidden />
            <h3 className="text-sm font-semibold tracking-tight">Practice this topic</h3>
          </div>
          <p className="nn-marketing-body-sm mt-3 text-muted-foreground">
            Same exam scope as this lesson—filter the bank to &ldquo;{topic.trim() || "this topic"}&rdquo; so rationales and
            stems stay aligned.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Link
              href={pathwayAppQuestionBankTopicHref(pathway, topic, topicCode)}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full nn-btn-primary px-5 py-2.5 text-sm font-semibold shadow-none"
            >
              Open practice (app)
            </Link>
            <Link
              href={pathwayMarketingQuestionBankTopicHref(pathway, topic, topicCode)}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full nn-btn-secondary px-5 py-2.5 text-sm font-semibold"
            >
              Question bank hub
            </Link>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Topic cluster:{" "}
            <Link href={topicHubHref} className="font-medium text-primary hover:underline">
              {topic.trim() || "Browse topics"}
            </Link>
          </p>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[var(--theme-heading-text)]">
            <Sparkles className="h-4 w-4 shrink-0 text-primary" aria-hidden />
            <h3 className="text-sm font-semibold tracking-tight">Adaptive (CAT) practice</h3>
          </div>
          {showCat ? (
            <>
              <p className="nn-marketing-body-sm mt-3 text-muted-foreground">
                Short, adaptive sessions use your pathway pool—closer to exam pacing than endless untimed review.
              </p>
              <Link
                href={catHref}
                className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full border-2 border-primary/60 bg-background/80 px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5 sm:w-auto"
              >
                Start CAT session
              </Link>
            </>
          ) : (
            <p className="nn-marketing-body-sm mt-3 text-muted-foreground">
              Adaptive practice for this track is not available yet. Use timed practice exams from your exam hub instead.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
