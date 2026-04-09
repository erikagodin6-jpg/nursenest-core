import Link from "next/link";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { pathwayLessonMarketingDetailHref } from "@/lib/lessons/pathway-lesson-types";

/**
 * When the question hub is topic-filtered, surface a few pathway lessons from the same topic cluster (bounded list).
 */
export function PathwayQuestionHubRelatedLessons({
  topicLabel,
  lessonsBasePath,
  lessons,
}: {
  topicLabel: string;
  lessonsBasePath: string;
  lessons: PathwayLessonRecord[];
}) {
  if (lessons.length === 0) return null;

  return (
    <section className="nn-study-card nn-study-card--wash mt-8 p-5 sm:p-6" aria-labelledby="qhub-related-lessons-heading">
      <p className="nn-marketing-label nn-marketing-label--accent">Lessons · same cluster</p>
      <h2 id="qhub-related-lessons-heading" className="nn-marketing-h3 mt-2 text-[var(--theme-heading-text)]">
        Related lessons
      </h2>
      <p className="nn-marketing-body-sm mt-2 max-w-prose text-[var(--theme-muted-text)]">
        Pathway lessons grouped with <span className="font-semibold text-[var(--theme-heading-text)]">{topicLabel}</span>. Read
        first, then return to practice with the filter you already set.
      </p>
      <ul className="mt-4 space-y-2 text-sm">
        {lessons.map((l) => {
          const href = pathwayLessonMarketingDetailHref(lessonsBasePath, l.slug);
          if (!href) return null;
          return (
            <li key={l.slug}>
              <Link href={href} className="font-medium text-primary hover:underline">
                {l.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
