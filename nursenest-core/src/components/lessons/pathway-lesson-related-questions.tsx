import Link from "next/link";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { RelatedExamQuestionStem } from "@/lib/lessons/lesson-question-cross-links";
import { pathwayAppQuestionBankTopicHref, pathwayMarketingQuestionBankTopicHref } from "@/components/lessons/pathway-lesson-link-practice";

/**
 * Bounded list of sample stems from `exam_questions` matched by lesson topic / tags — no large payloads.
 */
export function PathwayLessonRelatedQuestions({
  pathway,
  lessonTopic,
  items,
}: {
  pathway: ExamPathwayDefinition;
  lessonTopic: string;
  items: RelatedExamQuestionStem[];
}) {
  if (items.length === 0) return null;

  return (
    <section className="nn-study-card nn-study-card--wash mt-10 p-5 sm:p-6" aria-labelledby="lesson-related-questions-heading">
      <p className="nn-marketing-label nn-marketing-label--accent">Question bank · same topic</p>
      <h2 id="lesson-related-questions-heading" className="nn-marketing-h3 mt-2 text-[var(--theme-heading-text)]">
        Related questions
      </h2>
      <p className="nn-marketing-body-sm mt-2 max-w-prose text-[var(--theme-muted-text)]">
        Sample items from the {pathway.shortName} pool tagged like this lesson (topic / category). Open the hub to run a full
        drill—stays pathway-scoped in the app.
      </p>
      <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-[var(--theme-body-text)]">
        {items.map((q) => (
          <li key={q.id} className="leading-relaxed">
            {q.stemPreview}
          </li>
        ))}
      </ol>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={pathwayAppQuestionBankTopicHref(pathway, lessonTopic)}
          className="inline-flex min-h-11 items-center rounded-full nn-btn-primary px-5 py-2.5 text-sm font-semibold shadow-none"
        >
          Topic drill (app)
        </Link>
        <Link
          href={pathwayMarketingQuestionBankTopicHref(pathway, lessonTopic)}
          className="inline-flex min-h-11 items-center rounded-full nn-btn-secondary px-5 py-2.5 text-sm font-semibold"
        >
          Question hub · filtered
        </Link>
      </div>
    </section>
  );
}
