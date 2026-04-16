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
  /** Tighter copy and spacing for sticky side rails (`xl` layout). */
  compact = false,
  className,
}: {
  pathway: ExamPathwayDefinition;
  lessonTopic: string;
  /** Normalized cluster slug — narrows app/marketing bank links via `topicCode` when present. */
  topicSlug?: string;
  items: RelatedExamQuestionStem[];
  appLinksMode?: "login" | "direct";
  compact?: boolean;
  className?: string;
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
  const displayItems = compact ? items.slice(0, 5) : items;

  const shell = compact
    ? "rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_40%,transparent)] p-3.5"
    : "nn-study-card nn-study-card--wash nn-study-card--accent-leading mx-auto mt-8 max-w-5xl p-4 sm:p-5";

  return (
    <section
      className={[shell, className].filter(Boolean).join(" ")}
      aria-labelledby="lesson-related-questions-heading"
      data-testid="lesson-practice-questions-topic"
    >
      <div className="flex flex-wrap items-center gap-2">
        <p className={compact ? "text-xs font-semibold text-[var(--theme-heading-text)]" : "nn-marketing-label nn-marketing-label--accent"}>
          {compact ? "Related questions" : "Question bank · lesson-linked"}
        </p>
        <LessonCardChip variant="exam">{pathway.shortName}</LessonCardChip>
      </div>
      <h2
        id="lesson-related-questions-heading"
        className={
          compact
            ? "mt-1.5 text-sm font-semibold tracking-tight text-[var(--theme-heading-text)]"
            : "mt-1.5 text-lg font-medium tracking-tight text-[var(--theme-heading-text)]"
        }
      >
        {compact ? "Linked practice stems" : "Practice questions for this topic"}
      </h2>
      {!compact ? (
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
      ) : (
        <p className="mt-1 text-xs leading-relaxed text-[var(--theme-muted-text)]">
          {hasSamples
            ? `Sample items from your ${pathway.shortName} pool — open in the bank to practice.`
            : `Run a topic drill in the ${pathway.shortName} bank with the same filters.`}
        </p>
      )}
      {hasSamples ? (
        <ol
          className={
            compact
              ? "mt-3 list-decimal space-y-2 pl-4 text-xs text-[var(--theme-body-text)]"
              : "mt-4 list-decimal space-y-3 pl-5 text-sm text-[var(--theme-body-text)]"
          }
        >
          {displayItems.map((q) => (
            <li key={q.id} className={compact ? "line-clamp-3 leading-snug" : "leading-relaxed"}>
              <Link href={appHrefForQuestion(q.id)} className="text-primary underline-offset-2 hover:underline">
                {q.stemPreview}
              </Link>
            </li>
          ))}
        </ol>
      ) : null}
      <div className={compact ? "mt-3 flex flex-col gap-2" : "mt-5 flex flex-wrap gap-2"}>
        <Link
          href={appTopicHref}
          className={
            compact
              ? "inline-flex min-h-10 items-center justify-center rounded-full nn-btn-primary px-4 py-2 text-xs font-semibold shadow-none"
              : "inline-flex min-h-11 items-center rounded-full nn-btn-primary px-5 py-2.5 text-sm font-semibold shadow-none"
          }
        >
          {hasSamples ? "Practice this topic (app)" : "Open topic drill (app)"}
        </Link>
        <Link
          href={pathwayMarketingQuestionBankTopicHref(pathway, lessonTopic, topicCode)}
          className={
            compact
              ? "inline-flex min-h-10 items-center justify-center rounded-full nn-btn-secondary px-4 py-2 text-xs font-semibold"
              : "inline-flex min-h-11 items-center rounded-full nn-btn-secondary px-5 py-2.5 text-sm font-semibold"
          }
        >
          {compact ? "Question hub" : "Question hub · filtered"}
        </Link>
      </div>
    </section>
  );
}
