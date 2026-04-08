import Link from "next/link";

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
  const qs = [topicParam, pathwayParam].filter(Boolean).join("&");
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
