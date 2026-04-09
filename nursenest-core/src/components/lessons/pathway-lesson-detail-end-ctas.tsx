import Link from "next/link";
import { ArrowLeft, ClipboardList, Layers, LineChart } from "lucide-react";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import { pathwayMarketingQuestionBankTopicHref } from "@/components/lessons/pathway-lesson-link-practice";

type Props = {
  pathway: ExamPathwayDefinition;
  lessonsBasePath: string;
  topicLabel: string;
  topicSlug: string;
};

/**
 * Final navigation band on pathway lesson detail pages — hub, topic-filtered questions, CAT landing.
 * Complements {@link PathwayLessonRelatedLearningBlock}; this stays compact and always visible at the end.
 */
export function PathwayLessonDetailEndCtas({ pathway, lessonsBasePath, topicLabel, topicSlug }: Props) {
  const hub = lessonsBasePath.replace(/\/$/, "");
  const questionsMarketing = pathwayMarketingQuestionBankTopicHref(pathway, topicLabel, topicSlug);
  const cat = buildExamPathwayPath(pathway, "cat");
  const topicClusterHref = topicSlug?.trim()
    ? `${hub}/topics/${encodeURIComponent(topicSlug.trim())}`
    : null;

  return (
    <section
      className="nn-study-card nn-study-card--wash mt-12 overflow-hidden border-[color-mix(in_srgb,var(--theme-primary)_14%,var(--border-subtle))] p-6 sm:p-8"
      aria-labelledby="lesson-detail-end-ctas"
    >
      <h2 id="lesson-detail-end-ctas" className="nn-marketing-h3 text-[var(--theme-heading-text)]">
        Continue your study system
      </h2>
      <p className="nn-marketing-body-sm mt-2 max-w-2xl text-[var(--theme-muted-text)]">
        Stay inside {pathway.shortName} so stems, scope, and language match what you are sitting—then layer adaptive practice when
        you are ready for exam-style pressure.
      </p>
      <div className="mt-6 flex flex-wrap gap-4">
        <Link
          href={hub}
          className="group flex min-w-[min(100%,16rem)] flex-1 gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 shadow-[var(--shadow-card)] transition hover:-translate-y-px hover:border-primary/30 hover:shadow-[var(--shadow-card-hover)]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--theme-primary)_10%,transparent)] text-primary">
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-[var(--theme-heading-text)] group-hover:text-primary">
              Lesson hub
            </span>
            <span className="mt-0.5 block text-xs text-[var(--theme-muted-text)]">Browse all lessons for this exam</span>
          </span>
        </Link>
        {topicClusterHref ? (
          <Link
            href={topicClusterHref}
            className="group flex min-w-[min(100%,16rem)] flex-1 gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 shadow-[var(--shadow-card)] transition hover:-translate-y-px hover:border-primary/30 hover:shadow-[var(--shadow-card-hover)]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--theme-primary)_10%,transparent)] text-primary">
              <Layers className="h-5 w-5" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-[var(--theme-heading-text)] group-hover:text-primary">
                Topic index
              </span>
              <span className="mt-0.5 block text-xs text-[var(--theme-muted-text)]">
                {topicLabel.trim() || "This cluster"}
              </span>
            </span>
          </Link>
        ) : null}
        <Link
          href={questionsMarketing}
          className="group flex min-w-[min(100%,16rem)] flex-1 gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 shadow-[var(--shadow-card)] transition hover:-translate-y-px hover:border-primary/30 hover:shadow-[var(--shadow-card-hover)]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--theme-primary)_10%,transparent)] text-primary">
            <ClipboardList className="h-5 w-5" aria-hidden />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-[var(--theme-heading-text)] group-hover:text-primary">
              Practice questions · this topic
            </span>
            <span className="mt-0.5 block text-xs text-[var(--theme-muted-text)]">Pathway question bank (filtered)</span>
          </span>
        </Link>
        <Link
          href={cat}
          className="group flex min-w-[min(100%,16rem)] flex-1 gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 shadow-[var(--shadow-card)] transition hover:-translate-y-px hover:border-primary/30 hover:shadow-[var(--shadow-card-hover)]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--theme-primary)_10%,transparent)] text-primary">
            <LineChart className="h-5 w-5" aria-hidden />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-[var(--theme-heading-text)] group-hover:text-primary">
              CAT exam (adaptive)
            </span>
            <span className="mt-0.5 block text-xs text-[var(--theme-muted-text)]">Sign in to run when your plan allows</span>
          </span>
        </Link>
      </div>
    </section>
  );
}
