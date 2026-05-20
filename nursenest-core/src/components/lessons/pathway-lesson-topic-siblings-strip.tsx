import Link from "next/link";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { marketingPathwayLessonsIndexPath } from "@/lib/lessons/lesson-routes";
import { listTopicSiblingLessonsForMarketing } from "@/lib/lessons/pathway-lesson-topic-siblings";
import { humanizeTopicSlug } from "@/components/lessons/pathway-lesson-link-practice";

/**
 * Same-topic lesson cluster on public detail — complements sequence nav and auto-related resolver.
 */
export function PathwayLessonTopicSiblingsStrip({
  pathway,
  topicSlug,
  topicLabel,
  excludeSlug,
}: {
  pathway: ExamPathwayDefinition;
  topicSlug: string;
  topicLabel: string;
  excludeSlug: string;
}) {
  const siblings = listTopicSiblingLessonsForMarketing({
    pathway,
    topicSlug,
    excludeSlug,
    limit: 6,
  });
  if (siblings.length < 2) return null;

  const topic = topicSlug.trim().toLowerCase();
  const topicHubHref = topic
    ? `${marketingPathwayLessonsIndexPath(pathway)}?topicSlug=${encodeURIComponent(topic)}`
    : marketingPathwayLessonsIndexPath(pathway);
  const label = topicLabel.trim() || humanizeTopicSlug(topic) || "this topic";

  return (
    <nav
      className="mt-10 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_88%,var(--semantic-brand)_6%)] bg-[color-mix(in_srgb,var(--semantic-surface)_94%,var(--semantic-panel-muted)_6%)] px-4 py-4 sm:px-5"
      aria-labelledby="lesson-topic-siblings-heading"
      data-nn-lesson-topic-cluster
    >
      <h2 id="lesson-topic-siblings-heading" className="text-sm font-semibold text-[var(--theme-heading-text)]">
        More in {label}
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
        Study related lessons in the same clinical topic, then practice with pathway-scoped questions.
      </p>
      <ul className="mt-3 flex flex-col gap-2">
        {siblings.map((s) => (
          <li key={s.href}>
            <Link
              href={s.href}
              className="text-sm font-medium text-primary underline-offset-4 hover:underline [overflow-wrap:anywhere]"
            >
              {s.title}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-[var(--semantic-text-secondary)]">
        <Link href={topicHubHref} className="font-medium text-primary hover:underline">
          Browse all {label} lessons
        </Link>
        <span aria-hidden className="mx-1.5 text-[var(--theme-separator)]">
          ·
        </span>
        <Link
          href={buildExamPathwayPath(pathway, "questions")}
          className="font-medium text-primary hover:underline"
        >
          Practice {label} questions
        </Link>
      </p>
    </nav>
  );
}
