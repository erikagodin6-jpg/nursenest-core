import Link from "next/link";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";

function marketingQuestionsTopicHref(pathway: ExamPathwayDefinition, topic: string): string {
  const base = buildExamPathwayPath(pathway, "questions");
  const t = topic.trim();
  if (!t) return base;
  return `${base}?topic=${encodeURIComponent(t)}`;
}

function appPracticeTopicHref(pathway: ExamPathwayDefinition, topic: string): string {
  const qs = new URLSearchParams();
  qs.set("pathwayId", pathway.id);
  if (topic.trim()) qs.set("topic", topic.trim());
  qs.set("preset", "topic_drill");
  return loginWithCallback(`/app/questions?${qs.toString()}`);
}

/**
 * End-of-lesson CTA: same exam track in the question bank (marketing + signed-in app), optional topic cluster.
 */
export function PathwayLessonPracticeTopicCta({
  pathway,
  topic,
  topicSlug,
  lessonsBasePath,
}: {
  pathway: ExamPathwayDefinition;
  topic: string;
  topicSlug: string;
  lessonsBasePath: string;
}) {
  const topicHubHref = topicSlug?.trim()
    ? `${lessonsBasePath.replace(/\/$/, "")}/topics/${encodeURIComponent(topicSlug.trim())}`
    : lessonsBasePath;

  return (
    <section
      className="nn-study-callout nn-study-card mt-10 p-5 sm:p-6"
      aria-labelledby="lesson-practice-topic-cta"
    >
      <p className="nn-marketing-label nn-marketing-label--accent">Next step in this exam track</p>
      <h2 id="lesson-practice-topic-cta" className="nn-marketing-h3 mt-2 text-[var(--theme-heading-text)]">
        Practice this topic
      </h2>
      <p className="nn-marketing-body-sm mt-2 max-w-prose text-[var(--theme-muted-text)]">
        Reinforce {topic.trim() || "this area"} with pathway-scoped questions ({pathway.shortName}), then revisit the lesson
        hub if rationales show gaps.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={appPracticeTopicHref(pathway, topic)}
          className="inline-flex min-h-11 items-center rounded-full nn-btn-primary px-5 py-2.5 text-sm font-semibold shadow-none"
        >
          Open question bank (app)
        </Link>
        <Link
          href={marketingQuestionsTopicHref(pathway, topic)}
          className="inline-flex min-h-11 items-center rounded-full nn-btn-secondary px-5 py-2.5 text-sm font-semibold"
        >
          Question bank hub · filtered
        </Link>
        <Link
          href={topicHubHref}
          className="inline-flex min-h-11 items-center rounded-full nn-btn-secondary px-5 py-2.5 text-sm font-semibold"
        >
          {topic.trim() || "Topic"} cluster
        </Link>
        <Link
          href="/app/exams"
          className="inline-flex min-h-11 items-center rounded-full nn-btn-secondary px-5 py-2.5 text-sm font-semibold"
        >
          Practice exams
        </Link>
      </div>
    </section>
  );
}

/** @deprecated Prefer {@link PathwayLessonPracticeTopicCta} with full pathway context. */
export function PathwayLessonLinkToPractice({
  topic,
  pathwayId,
  topicSlug,
}: {
  topic: string;
  pathwayId?: string;
  topicSlug?: string;
}) {
  const topicParam = topic.trim() ? `topic=${encodeURIComponent(topic.trim())}` : "";
  const pathwayParam = pathwayId?.trim() ? `pathwayId=${encodeURIComponent(pathwayId.trim())}` : "";
  const qs = [topicParam, pathwayParam, "preset=topic_drill"].filter(Boolean).join("&");
  const questionsHref = qs ? `/app/questions?${qs}` : "/app/questions";

  const lessonsForTopicHref = topicSlug?.trim()
    ? `/app/lessons?topicSlug=${encodeURIComponent(topicSlug.trim())}`
    : topic.trim()
      ? `/app/lessons?topic=${encodeURIComponent(topic.trim())}`
      : "/app/lessons";

  return (
    <section className="nn-card border-border bg-muted/30 p-5">
      <h2 className="nn-marketing-h3">Link to practice</h2>
      <p className="mt-2 nn-marketing-body-sm text-muted">
        Reinforce this lesson with questions in your bank, then loop back if a topic stays weak.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={questionsHref}
          className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Practice related questions
        </Link>
        <Link
          href={lessonsForTopicHref}
          className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
        >
          More lessons in this topic
        </Link>
        <Link
          href="/app/exams"
          className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
        >
          Timed exam
        </Link>
      </div>
    </section>
  );
}
