"use client";

import type { ExamReviewJson } from "@/lib/exams/exam-session-review";
import type { PostTestStudyNextBundle } from "@/lib/learner/adaptive-recommendations";
import { useMarketingI18n } from "@/lib/marketing-i18n";

/**
 * Short, data-grounded copy after a mock — complements {@link PostTestStudyNextCard}.
 */
export function PostSessionExamInsights({
  review,
  studyNext,
}: {
  review: ExamReviewJson | null | undefined;
  studyNext: PostTestStudyNextBundle | null | undefined;
}) {
  const { t } = useMarketingI18n();
  const weak = review?.weakAreas?.filter(Boolean) ?? [];
  const struggleTopics = weak.slice(0, 3).join(", ");
  const primaryNext = studyNext?.primary?.title?.trim() || "";
  const topWeak = weak[0]?.trim() || "";

  if (!struggleTopics && !primaryNext && !topWeak) return null;

  return (
    <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))] px-4 py-3.5 shadow-sm">
      {struggleTopics ? (
        <p className="text-sm text-foreground/90">{t("learner.sessionInsight.struggle", { topics: struggleTopics })}</p>
      ) : null}
      {primaryNext ? (
        <p className={`text-sm text-muted-foreground ${struggleTopics ? "mt-2" : ""}`}>
          {t("learner.sessionInsight.focusNext", { label: primaryNext })}
        </p>
      ) : topWeak ? (
        <p className={`text-sm text-muted-foreground ${struggleTopics ? "mt-2" : ""}`}>
          {t("learner.sessionInsight.focusTopicDrill", { topic: topWeak })}
        </p>
      ) : null}
    </div>
  );
}
