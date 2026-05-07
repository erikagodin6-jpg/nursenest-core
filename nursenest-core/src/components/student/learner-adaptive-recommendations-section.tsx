import Link from "next/link";
import type { AdaptiveWireBundleJson } from "@/lib/learner/build-learner-adaptive-wire-bundle";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import { withPathwayScopeHref } from "@/lib/learner/pathway-scoped-href";
import { buildAppLessonsReviewLessonHref } from "@/lib/learner/app-study-internal-links";

type Props = {
  t: LearnerMarketingT;
  /** Preloaded on the dashboard to avoid a second bundle/dashboard read. */
  bundle: AdaptiveWireBundleJson | null;
};

/**
 * Dashboard-only RSC block (Phase 5B). Parent gates `ADAPTIVE_LEARNING_ENABLED` + subscriber entitlement.
 */
export function LearnerAdaptiveRecommendationsSection({ t, bundle }: Props) {
  if (!bundle) return null;

  const { recommendations, rationaleLines } = bundle;
  const weak = recommendations.rankedWeakTopics.slice(0, 5);
  const lessons = recommendations.lessons.slice(0, 4);
  const catHint = recommendations.practiceCat;
  const pid = bundle.pathwayId;

  return (
    <section
      id="study-adaptive-wired"
      className="nn-dash-section rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_55%,var(--semantic-surface))] p-5 shadow-sm"
      aria-labelledby="adaptive-recs-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="adaptive-recs-heading" className="text-base font-semibold text-[var(--semantic-text-primary)]">
            {t("learner.studyHome.sectionAttentionTitle")}
          </h2>
          <p className="mt-1 max-w-prose text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            {rationaleLines[0] ?? t("learner.studyHome.sectionAttentionIntro")}
          </p>
        </div>
        <span className="shrink-0 rounded-md border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
          {t("learner.studyHome.pageEyebrow")}
        </span>
      </div>

      <div className="mt-5 grid gap-4 min-[900px]:grid-cols-2">
        <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
          <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-warning)]">
            {t("learner.studyHome.sectionMomentumTitle")}
          </h3>
          {weak.length === 0 ? (
            <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{t("learner.studyHome.recentGainsEmpty")}</p>
          ) : (
            <ul className="mt-2 space-y-1.5 text-sm text-[var(--semantic-text-primary)]">
              {weak.map((w) => (
                <li key={w.topicKey} className="flex justify-between gap-2">
                  <span className="truncate font-medium">{w.topicKey}</span>
                  <span className="shrink-0 text-[var(--semantic-text-secondary)] tabular-nums">
                    {Math.round(w.urgencyScore * 10) / 10}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
          <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-chart-2)]">
            {t("learner.profile.quickLinks.lessons")}
          </h3>
          {lessons.length === 0 ? (
            <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{t("learner.studyHome.sectionExploreTitle")}</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {lessons.map((l) => (
                <li key={l.slug}>
                  <Link
                    className="text-sm font-medium text-[color-mix(in_srgb,var(--semantic-brand)_92%,var(--semantic-text-primary))] underline-offset-2 hover:underline"
                    href={withPathwayScopeHref(buildAppLessonsReviewLessonHref(pid, l.slug), pid)}
                  >
                    {l.title}
                  </Link>
                  <p className="text-xs text-[var(--semantic-text-secondary)]">{l.topicKey}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-chart-4)_08%,var(--semantic-surface))] p-4">
        <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-chart-4)]">
          {t("learner.profile.quickLinks.catPractice")}
        </h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--semantic-text-secondary)]">
          {recommendations.flashcards.slice(0, 3).map((f) => (
            <li key={f.topicKey}>
              {t("learner.profile.quickLinks.flashcards")} — {f.topicKey}
              {f.allowed ? "" : ` (${t("learner.profile.quickLinks.questionBank")})`}
            </li>
          ))}
          <li>
            {catHint.catPoolSurfaceAvailable
              ? t("learner.profile.quickLinks.catPractice")
              : t("learner.profile.quickLinks.questionBank")}
          </li>
          {catHint.suggestStudyModeReview && rationaleLines[1] ? <li>{rationaleLines[1]}</li> : null}
        </ul>
      </div>

      {rationaleLines.length > 1 ? (
        <p className="mt-3 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{rationaleLines.slice(1).join(" ")}</p>
      ) : null}
    </section>
  );
}
