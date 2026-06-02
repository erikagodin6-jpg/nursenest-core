import Link from "next/link";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { buildAppQuestionBankTopicDrillHref } from "@/components/lessons/pathway-lesson-link-practice";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";

type Props = {
  pathway: ExamPathwayDefinition;
  topic: string;
  topicSlug?: string | null;
  t: LearnerMarketingT;
};

/**
 * Places lesson → topic-scoped practice above the fold so the loop is obvious (learn, then drill).
 */
export function PathwayLessonPracticeBridge({ pathway, topic, topicSlug, t }: Props) {
  const href = buildAppQuestionBankTopicDrillHref(pathway, topic, topicSlug ?? undefined);
  return (
    <section
      className="mt-5 rounded-xl border border-[color-mix(in_srgb,var(--semantic-success)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_12%,var(--semantic-surface))] p-4 shadow-sm"
      aria-labelledby="lesson-practice-bridge-heading"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p
            id="lesson-practice-bridge-heading"
            className="text-xs font-bold uppercase tracking-wide text-[color-mix(in_srgb,var(--semantic-success)_90%,var(--semantic-text-primary))]"
          >
            {t("learner.lessons.detail.practiceBridgeEyebrow")}
          </p>
          <p className="mt-1 text-sm font-semibold leading-snug text-[var(--semantic-text-primary)]">
            {t("learner.lessons.detail.practiceBridgeTitle")}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
            {t("learner.lessons.detail.practiceBridgeLead")}
          </p>
        </div>
        <Link
          href={href}
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-role-cta px-5 py-2.5 text-sm font-semibold text-role-cta-foreground shadow-[0_2px_8px_var(--role-cta-shadow)] transition hover:bg-role-cta-hover"
        >
          {t("learner.lessons.detail.practiceBridgeCta")}
        </Link>
      </div>
    </section>
  );
}
