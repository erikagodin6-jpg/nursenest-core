import Link from "next/link";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { RelatedExamQuestionStem } from "@/lib/lessons/lesson-question-cross-links";
import {
  buildAppQuestionBankTopicDrillHref,
  pathwayAppQuestionBankTopicHref,
  pathwayMarketingQuestionBankTopicHref,
} from "@/components/lessons/pathway-lesson-link-practice";

/**
 * Bounded list of sample stems from `exam_questions` matched by lesson topic / tags — no large payloads.
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
  if (items.length === 0) return null;

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

  return (
    <section className="nn-study-card nn-study-card--wash mt-10 p-5 sm:p-6" aria-labelledby="lesson-related-questions-heading">
      <p className="nn-marketing-label nn-marketing-label--accent">Question bank · related practice</p>
      <h2 id="lesson-related-questions-heading" className="nn-marketing-h3 mt-2 text-[var(--theme-heading-text)]">
        Related practice questions
      </h2>
      <p className="nn-marketing-body-sm mt-2 max-w-prose text-[var(--theme-muted-text)]">
        Sample items from the {pathway.shortName} pool matched to this lesson’s topic and tags (limited list). Tap a stem to open
        that item in the app bank, or run a full topic drill—stays pathway-scoped.
      </p>
      <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-[var(--theme-body-text)]">
        {items.map((q) => (
          <li key={q.id} className="leading-relaxed">
            <Link
              href={appHrefForQuestion(q.id)}
              className="text-primary underline-offset-2 hover:underline"
            >
              {q.stemPreview}
            </Link>
          </li>
        ))}
      </ol>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={appTopicHref}
          className="inline-flex min-h-11 items-center rounded-full nn-btn-primary px-5 py-2.5 text-sm font-semibold shadow-none"
        >
          Practice this topic (app)
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
