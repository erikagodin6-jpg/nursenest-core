import Link from "next/link";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { pathwayLessonMarketingDetailHref } from "@/lib/lessons/pathway-lesson-types";

/**
 * Metadata-driven related block: lesson refs + topic cluster + study actions (complements same-topic list above).
 */
export function PathwayLessonRelatedNextSteps({
  lessonsBasePath,
  lesson,
}: {
  lessonsBasePath: string;
  lesson: PathwayLessonRecord;
}) {
  const refs = lesson.relatedLessonRefs ?? [];
  if (refs.length === 0) return null;
  const topicCluster = `${lessonsBasePath.replace(/\/$/, "")}/topics/${encodeURIComponent(lesson.topicSlug)}`;
  return (
    <section className="mt-10 rounded-2xl border border-border bg-[var(--theme-muted-surface)]/40 p-5">
      <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">Related lessons &amp; next steps</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Continue your study flow with linked lessons in this exam hub, then reinforce with topic-scoped questions and
        flashcards in your usual bank workflow.
      </p>
      <ul className="mt-4 space-y-2 text-sm">
        {refs.slice(0, 6).map((r) => {
          const href = pathwayLessonMarketingDetailHref(lessonsBasePath, r.slug);
          if (!href) return null;
          const label = r.titleHint?.trim() || r.slug.replace(/-/g, " ");
          return (
            <li key={r.slug}>
              <Link href={href} className="font-medium text-primary hover:underline">
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-sm">
        <Link href={topicCluster} className="font-medium text-primary hover:underline">
          Open the {lesson.topic} lesson cluster
        </Link>{" "}
        for the full topic index in this pathway.
      </p>
    </section>
  );
}
