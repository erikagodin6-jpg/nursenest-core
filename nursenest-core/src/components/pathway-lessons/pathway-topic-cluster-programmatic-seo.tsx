import Link from "next/link";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { buildPathwayLessonTopicProgrammaticIntroParagraphs } from "@/lib/lessons/pathway-lesson-topic-programmatic-intro";
import { marketingPathwayLessonTopicClusterPath } from "@/lib/lessons/lesson-routes";
import { pathwayLessonMarketingDetailHref } from "@/lib/lessons/pathway-lesson-types";
import { cleanLessonTitleForDisplay } from "@/lib/lessons/lesson-title-presentation";

const linkClass =
  "font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:underline";

export type TopicClusterRelatedLesson = { slug: string; title: string; topic: string };

type TopicClusterSibling = { topicSlug: string; label: string };

/**
 * Long-form programmatic intro + high-intent internal links for topic lesson landing pages.
 */
export function PathwayTopicClusterProgrammaticSeo({
  pathway,
  lessonsBasePath,
  topicLabel,
  topicSlug,
  relatedLessons,
  siblingTopics,
}: {
  pathway: ExamPathwayDefinition;
  lessonsBasePath: string;
  topicLabel: string;
  topicSlug: string;
  relatedLessons: TopicClusterRelatedLesson[];
  siblingTopics: TopicClusterSibling[];
}) {
  const paragraphs = buildPathwayLessonTopicProgrammaticIntroParagraphs(pathway, topicLabel, topicSlug);
  const questionsHref = buildExamPathwayPath(pathway, "questions");
  const catHref = buildExamPathwayPath(pathway, "cat");
  const examHubHref = buildExamPathwayPath(pathway);
  const lessonsHubHref = lessonsBasePath.split("?")[0] ?? lessonsBasePath;

  const topRelated = relatedLessons.slice(0, 4);
  const siblingPick = siblingTopics.filter((t) => t.topicSlug !== topicSlug).slice(0, 5);

  return (
    <div className="mt-6 space-y-6">
      <article className="nn-marketing-body space-y-4 text-[var(--theme-body-text)]">
        {paragraphs.map((p, i) => (
          <p key={i} className="leading-relaxed">
            {p}
          </p>
        ))}
      </article>

      <section
        className="nn-card border-[color-mix(in_srgb,var(--semantic-brand)_16%,var(--semantic-border-soft))] p-5 sm:p-6"
        aria-labelledby="topic-cluster-study-links-heading"
      >
        <h2 id="topic-cluster-study-links-heading" className="text-lg font-semibold text-[var(--theme-heading-text)]">
          Study this topic inside your {pathway.shortName} track
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--theme-muted-text)]">
          Same exam scope across tools: start with the lessons on this page, then rehearse with the pathway question bank and
          CAT entry point below.
        </p>
        <ul className="mt-4 list-none space-y-2 text-sm">
          <li>
            <Link href={questionsHref} className={linkClass}>
              Open {pathway.shortName} practice questions (marketing hub) →
            </Link>
          </li>
          <li>
            <Link href={catHref} className={linkClass}>
              Open {pathway.shortName} CAT / adaptive practice hub →
            </Link>
          </li>
          <li>
            <Link href={examHubHref} className={linkClass}>
              {pathway.shortName} exam hub overview →
            </Link>
          </li>
        </ul>

        {topRelated.length > 0 ? (
          <div className="mt-6 border-t border-[var(--semantic-border-soft)] pt-5">
            <h3 className="text-base font-semibold text-[var(--theme-heading-text)]">Related lessons in {topicLabel}</h3>
            <ul className="mt-3 space-y-2">
              {topRelated.map((l) => {
                const href = pathwayLessonMarketingDetailHref(lessonsBasePath, l.slug);
                if (!href) return null;
                return (
                  <li key={l.slug}>
                    <Link href={href} className={linkClass}>
                      {cleanLessonTitleForDisplay(l.title)}
                    </Link>
                    {l.topic && l.topic !== topicLabel ? (
                      <span className="ml-1 text-xs text-[var(--theme-muted-text)]">({l.topic})</span>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        {siblingPick.length > 0 ? (
          <div className="mt-6 border-t border-[var(--semantic-border-soft)] pt-5">
            <h3 className="text-base font-semibold text-[var(--theme-heading-text)]">Nearby lesson topics</h3>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {siblingPick.map((t) => (
                <li key={t.topicSlug}>
                  <Link href={marketingPathwayLessonTopicClusterPath(pathway, t.topicSlug)} className={linkClass}>
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    </div>
  );
}
