import Link from "next/link";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildExamPathwayPath } from "@/lib/exam-pathways/exam-product-registry";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";

/** Marketing question hub with optional topic filter (pathway-scoped). */
export function pathwayMarketingQuestionBankTopicHref(
  pathway: ExamPathwayDefinition,
  topic: string,
  topicCode?: string,
): string {
  const base = buildExamPathwayPath(pathway, "questions");
  const t = topic.trim();
  const qs = new URLSearchParams();
  if (t) qs.set("topic", t);
  if (topicCode?.trim()) qs.set("topicCode", topicCode.trim().toLowerCase());
  const s = qs.toString();
  return s ? `${base}?${s}` : base;
}

export type AppQuestionBankDrillOpts = {
  /** Narrow the bank session to specific question ids (comma-separated in URL; max 16). */
  includeIds?: string[];
};

/**
 * Direct `/app/questions` topic drill URL (no login redirect). Use from authenticated app surfaces.
 */
export function buildAppQuestionBankTopicDrillHref(
  pathway: ExamPathwayDefinition,
  topic: string,
  topicCode?: string,
  opts?: AppQuestionBankDrillOpts,
): string {
  const qs = new URLSearchParams();
  qs.set("pathwayId", pathway.id);
  if (topic.trim()) qs.set("topic", topic.trim());
  if (topicCode?.trim()) qs.set("topicCode", topicCode.trim().toLowerCase());
  qs.set("preset", "topic_drill");
  const ids = (opts?.includeIds ?? []).map((id) => id.trim()).filter((id) => id.length >= 8);
  if (ids.length > 0) qs.set("includeIds", ids.slice(0, 16).join(","));
  return `/app/questions?${qs.toString()}`;
}

/** Signed-in app question bank: topic drill for this pathway (via login callback for marketing). */
export function pathwayAppQuestionBankTopicHref(
  pathway: ExamPathwayDefinition,
  topic: string,
  topicCode?: string,
  opts?: AppQuestionBankDrillOpts,
): string {
  return loginWithCallback(buildAppQuestionBankTopicDrillHref(pathway, topic, topicCode, opts));
}

/**
 * Standalone practice strip (marketing question bank + app + topic cluster).
 * **Prefer** `PathwayLessonRelatedLearningBlock` on public pathway lesson pages — it unifies related lessons,
 * practice, and CAT in one premium block.
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
      <p className="nn-marketing-label nn-marketing-label--accent">Same scope as this lesson</p>
      <h2 id="lesson-practice-topic-cta" className="nn-marketing-h3 mt-2 text-[var(--theme-heading-text)]">
        Drill {topic.trim() || "this topic"} with items
      </h2>
      <p className="nn-marketing-body-sm mt-2 max-w-prose text-[var(--theme-muted-text)]">
        Answer {pathway.shortName}-scoped questions on {topic.trim() || "this content"} while the clinical story is still fresh.
        If rationales expose a weak spot, jump back to this topic in lessons—not a generic review.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={pathwayAppQuestionBankTopicHref(pathway, topic, topicSlug?.trim() || undefined)}
          className="inline-flex min-h-11 items-center rounded-full nn-btn-primary px-5 py-2.5 text-sm font-semibold shadow-none"
        >
          Open practice (app)
        </Link>
        <Link
          href={pathwayMarketingQuestionBankTopicHref(pathway, topic, topicSlug?.trim() || undefined)}
          className="inline-flex min-h-11 items-center rounded-full nn-btn-secondary px-5 py-2.5 text-sm font-semibold"
        >
          Practice hub · same topic
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
