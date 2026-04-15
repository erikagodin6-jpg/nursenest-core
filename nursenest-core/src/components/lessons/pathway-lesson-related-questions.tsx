import Link from "next/link";
import { LessonCardChip } from "@/components/student/product/lesson-card";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { RelatedExamQuestionStem } from "@/lib/lessons/lesson-question-cross-links";
import {
  buildAppQuestionBankTopicDrillHref,
  pathwayAppQuestionBankTopicHref,
  pathwayMarketingQuestionBankTopicHref,
} from "@/components/lessons/pathway-lesson-link-practice";

/**
 * Bounded list of sample stems from `exam_questions` matched by lesson topic / tags — no large payloads.
 * When no stems match, still surfaces topic-scoped bank links (no invented items).
 */
export function PathwayLessonRelatedQuestions({
  pathway,
  lessonTopic,
  topicSlug,
  items,
  /** `direct` = `/app/questions` without login redirect (subscriber app lesson pages). */
  appLinksMode = "login",
}: {
  pathway: ExamPathwayDefinition;
  lessonTopic: string;
  /** Normalized cluster slug — narrows app/marketing bank links via `topicCode` when present. */
  topicSlug?: string;
  items: RelatedExamQuestionStem[];
  appLinksMode?: "login" | "direct";
}) {
  const topicCode = topicSlug?.trim() || undefined;
  const appTopicHref =
    appLinksMode === "direct"
      ? buildAppQuestionBankTopicDrillHref(pathway, lessonTopic, topicCode)
      : pathwayAppQuestionBankTopicHref(pathway, lessonTopic, topicCode);

  function appHrefForQuestion(id: string): string {
    return appLinksMode === "direct"
      ? buildAppQuestionBankTopicDrillHref(pathway, lessonTopic, topicCode, { includeIds: [id] })
      : pathwayAppQuestionBankTopicHref(pathway, lessonTopic, topicCode, { includeIds: [id] });
  }

  const hasSamples = items.length > 0;

  return (
    <section
      className="nn-study-card nn-study-card--wash nn-study-card--accent-leading mx-auto mt-8 max-w-5xl p-4 sm:p-5"
      aria-labelledby="lesson-related-questions-heading"
      data-testid="lesson-practice-questions-topic"
    >
      <div className="flex flex-wrap items-center gap-2">
        <p className="nn-marketing-label nn-marketing-label--accent">Question bank · lesson-linked</p>
        <LessonCardChip variant="exam">{pathway.shortName}</LessonCardChip>
      </div>
      <h2
        id="lesson-related-questions-heading"
        className="mt-1.5 text-lg font-medium tracking-tight text-[var(--theme-heading-text)]"
      >
        Practice questions for this topic
      </h2>
      <p className="nn-marketing-body-sm mt-2 max-w-prose text-[var(--theme-muted-text)]">
        {hasSamples ? (
          <>
            Sample stems (up to the current display cap) from the same {pathway.shortName} pool aligned to this lesson—open
            any item in the app bank or run a full topic drill.
          </>
        ) : (
          <>
            We didn’t match sample stems to this lesson in the bank yet. You can still run a topic-scoped drill with the same
            pathway filters—items load from your live {pathway.shortName} pool.
          </>
        )}
      </p>
      {hasSamples ? (
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-[var(--theme-body-text)]">
          {items.map((q) => (
            <li key={q.id} className="leading-relaxed">
              <Link href={appHrefForQuestion(q.id)} className="text-primary underline-offset-2 hover:underline">
                {q.stemPreview}
              </Link>
            </li>
          ))}
        </ol>
      ) : null}
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={appTopicHref}
          className="inline-flex min-h-11 items-center rounded-full nn-btn-primary px-5 py-2.5 text-sm font-semibold shadow-none"
        >
          {hasSamples ? "Practice this topic (app)" : "Open topic drill (app)"}
        </Link>
        <Link
          href={pathwayMarketingQuestionBankTopicHref(pathway, lessonTopic, topicCode)}
          className="inline-flex min-h-11 items-center rounded-full nn-btn-secondary px-5 py-2.5 text-sm font-semibold"
        >
          Question hub · filtered
        </Link>
      </div>
    </section>
  );
}
