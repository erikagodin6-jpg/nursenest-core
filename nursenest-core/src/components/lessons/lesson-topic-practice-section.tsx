import Link from "next/link";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import type { RelatedExamQuestionStem } from "@/lib/lessons/lesson-question-cross-links";
import { loadLessonTopicLinkedQuizItems } from "@/lib/lessons/load-lesson-topic-linked-quiz-items";
import type { LessonBankQuizItem } from "@/lib/lessons/exam-question-to-lesson-quiz-item";
import { syntheticPathwayLessonId } from "@/lib/lessons/pathway-lesson-progress";
import { LessonTopicLinkedQuiz } from "@/components/lessons/lesson-topic-linked-quiz";
import {
  buildAppQuestionBankTopicDrillHref,
  pathwayAppQuestionBankTopicHref,
  pathwayMarketingQuestionBankTopicHref,
} from "@/components/lessons/pathway-lesson-link-practice";

export type LessonTopicPracticeSectionProps = {
  pathway: ExamPathwayDefinition;
  lessonTopic: string;
  topicSlug?: string | null;
  lessonSlug: string;
  relatedQuestionStems: readonly RelatedExamQuestionStem[];
  bankEntitlement: AccessScope | null;
  /** Full lesson body access (subscriber, trial, or staff). */
  fullQuizAccess: boolean;
  userId: string;
  appLinksMode?: "login" | "direct";
  compact?: boolean;
  /** App page may preload quiz rows in the parent to avoid duplicate bank queries. */
  preloadedQuizItems?: readonly LessonBankQuizItem[] | null;
};

/**
 * Lesson-linked practice: interactive MCQ quiz (no passive stem list).
 * Preview learners see a concise gate + hub links.
 */
export async function LessonTopicPracticeSection({
  pathway,
  lessonTopic,
  topicSlug,
  lessonSlug,
  relatedQuestionStems,
  bankEntitlement,
  fullQuizAccess,
  userId,
  appLinksMode = "login",
  compact = false,
  preloadedQuizItems,
}: LessonTopicPracticeSectionProps) {
  const topicCode = topicSlug?.trim() || undefined;
  const stemIds = relatedQuestionStems.map((s) => s.id).filter(Boolean);

  let quizItems: LessonBankQuizItem[] =
    preloadedQuizItems != null ? [...preloadedQuizItems] : [];

  if (preloadedQuizItems == null && fullQuizAccess && bankEntitlement?.hasAccess && stemIds.length > 0) {
    const res = await loadLessonTopicLinkedQuizItems({
      entitlement: bankEntitlement,
      countryCode: pathway.countryCode,
      stemIds,
      logContext: { pathwayId: pathway.id, lessonSlug },
    });
    quizItems = res.items;
  }

  const appTopicHref =
    appLinksMode === "direct"
      ? buildAppQuestionBankTopicDrillHref(pathway, lessonTopic, topicCode)
      : pathwayAppQuestionBankTopicHref(pathway, lessonTopic, topicCode);

  const shell = compact
    ? "rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_40%,transparent)] p-3.5"
    : "nn-study-card nn-study-card--wash nn-study-card--accent-leading mx-auto mt-8 max-w-5xl p-4 sm:p-5";

  const lessonId = syntheticPathwayLessonId(pathway.id, lessonSlug);

  if (!fullQuizAccess) {
    return (
      <section
        className={shell}
        data-testid="lesson-topic-practice-gate"
        aria-labelledby="lesson-topic-practice-gate-heading"
      >
        <h2
          id="lesson-topic-practice-gate-heading"
          className={
            compact
              ? "text-sm font-semibold tracking-tight text-[var(--theme-heading-text)]"
              : "text-lg font-medium tracking-tight text-[var(--theme-heading-text)]"
          }
        >
          {compact ? "Lesson quiz" : "Check your understanding"}
        </h2>
        <p className={compact ? "mt-1 text-xs text-[var(--theme-muted-text)]" : "mt-2 text-sm text-[var(--theme-muted-text)]"}>
          Unlock the interactive lesson quiz with a plan that includes this {pathway.shortName} pathway. You can still
          explore topic-filtered questions from the bank hubs below.
        </p>
        <div className={compact ? "mt-3 flex flex-col gap-2" : "mt-5 flex flex-wrap gap-2"}>
          <Link
            href={appTopicHref}
            className={
              compact
                ? "inline-flex min-h-10 items-center justify-center rounded-full nn-btn-primary px-4 py-2 text-xs font-semibold"
                : "inline-flex min-h-11 items-center rounded-full nn-btn-primary px-5 py-2.5 text-sm font-semibold"
            }
          >
            Open topic in app bank
          </Link>
          <Link
            href={pathwayMarketingQuestionBankTopicHref(pathway, lessonTopic, topicCode)}
            className={
              compact
                ? "inline-flex min-h-10 items-center justify-center rounded-full nn-btn-secondary px-4 py-2 text-xs font-semibold"
                : "inline-flex min-h-11 items-center rounded-full nn-btn-secondary px-5 py-2.5 text-sm font-semibold"
            }
          >
            Question hub
          </Link>
        </div>
      </section>
    );
  }

  if (quizItems.length === 0) {
    return (
      <section
        className={shell}
        data-testid="lesson-topic-practice-empty"
        aria-labelledby="lesson-topic-practice-empty-heading"
      >
        <h2
          id="lesson-topic-practice-empty-heading"
          className={
            compact
              ? "text-sm font-semibold text-[var(--theme-heading-text)]"
              : "text-lg font-medium text-[var(--theme-heading-text)]"
          }
        >
          {compact ? "Lesson quiz" : "Check your understanding"}
        </h2>
        <p className={compact ? "mt-1 text-xs text-[var(--theme-muted-text)]" : "mt-2 text-sm text-[var(--theme-muted-text)]"}>
          We could not assemble multiple-choice items for this topic yet. Run a topic drill in the bank — questions still
          match your {pathway.shortName} filters.
        </p>
        <div className={compact ? "mt-3 flex flex-col gap-2" : "mt-5 flex flex-wrap gap-2"}>
          <Link
            href={appTopicHref}
            className={
              compact
                ? "inline-flex min-h-10 items-center justify-center rounded-full nn-btn-primary px-4 py-2 text-xs font-semibold"
                : "inline-flex min-h-11 items-center rounded-full nn-btn-primary px-5 py-2.5 text-sm font-semibold"
            }
          >
            Open topic drill
          </Link>
          <Link
            href={pathwayMarketingQuestionBankTopicHref(pathway, lessonTopic, topicCode)}
            className={
              compact
                ? "inline-flex min-h-10 items-center justify-center rounded-full nn-btn-secondary px-4 py-2 text-xs font-semibold"
                : "inline-flex min-h-11 items-center rounded-full nn-btn-secondary px-5 py-2.5 text-sm font-semibold"
            }
          >
            Question hub
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div data-testid="lesson-topic-practice-section">
      <LessonTopicLinkedQuiz
        pathway={pathway}
        lessonTopic={lessonTopic}
        topicSlug={topicSlug}
        items={quizItems}
        fullAccess={fullQuizAccess}
        appLinksMode={appLinksMode}
        compact={compact}
        userId={userId}
        lessonId={lessonId}
        pathwayId={pathway.id}
      />
    </div>
  );
}
