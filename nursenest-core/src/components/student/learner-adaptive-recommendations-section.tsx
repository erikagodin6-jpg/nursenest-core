import Link from "next/link";
import type { AdaptiveWireBundleJson } from "@/lib/learner/build-learner-adaptive-wire-bundle";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import { withPathwayScopeHref } from "@/lib/learner/pathway-scoped-href";
import { buildAppLessonsReviewLessonHref } from "@/lib/learner/app-study-internal-links";
import { Activity, Calculator, ChevronRight, FlaskConical, HeartPulse, Sparkles, Theater } from "lucide-react";
import { STUDY_TOOL_ROUTES, withStudyToolPathwayQuery } from "@/lib/study-tools/study-tool-routes";

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

  const {
    recommendations,
    rationaleLines,
    labsStudyNudge,
    scenariosStudyNudge,
    medCalcStudyNudge,
    clinicalSkillsStudyNudge,
    ecgStudyNudge,
  } = bundle;
  const weak = recommendations.rankedWeakTopics.slice(0, 5);
  const lessons = recommendations.lessons.slice(0, 4);
  const catHint = recommendations.practiceCat;
  const pid = bundle.pathwayId;
  const maxUrgency = weak.reduce((m, w) => Math.max(m, w.urgencyScore), 0) || 1;

  return (
    <section
      id="study-adaptive-wired"
      className="nn-dash-section rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_42%,var(--semantic-surface))] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6"
      aria-labelledby="adaptive-recs-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--semantic-border-soft)] pb-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--semantic-info-soft)] text-[var(--semantic-info)]">
              <Sparkles className="h-4 w-4" aria-hidden />
            </span>
            <h2 id="adaptive-recs-heading" className="text-base font-semibold text-[var(--semantic-text-primary)] sm:text-lg">
              {t("learner.studyHome.sectionAttentionTitle")}
            </h2>
          </div>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            {rationaleLines[0] ?? t("learner.studyHome.sectionAttentionIntro")}
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
          {t("learner.studyHome.pageEyebrow")}
        </span>
      </div>

      <div className="mt-5 grid gap-4 min-[960px]:grid-cols-2">
        <div className="flex min-h-full min-w-0 flex-col rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-[var(--semantic-shadow-soft)] sm:p-5">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--semantic-warning)]">
              {t("learner.studyHome.sectionMomentumTitle")}
            </p>
            <span className="tabular-nums text-[10px] font-semibold text-[var(--semantic-text-muted)]">01</span>
          </div>
          {weak.length === 0 ? (
            <p className="mt-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{t("learner.studyHome.recentGainsEmpty")}</p>
          ) : (
            <ul className="mt-3 space-y-3" role="list">
              {weak.map((w) => {
                const pct = Math.min(100, Math.round((w.urgencyScore / maxUrgency) * 100));
                return (
                  <li key={w.topicKey} className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_14%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_05%,var(--semantic-surface))] px-3 py-2.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-[var(--semantic-text-primary)]">{w.topicKey}</span>
                      <span className="shrink-0 text-xs tabular-nums text-[var(--semantic-text-secondary)]">
                        {Math.round(w.urgencyScore * 10) / 10}
                      </span>
                    </div>
                    <div
                      className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--semantic-progress-track)]"
                      role="presentation"
                      aria-hidden
                    >
                      <div
                        className="h-full rounded-full bg-[color-mix(in_srgb,var(--semantic-warning)_78%,var(--semantic-chart-4))]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="flex min-h-full min-w-0 flex-col rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-[var(--semantic-shadow-soft)] sm:p-5">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[11px] font-bold uppercase tracking-wide text-[color-mix(in_srgb,var(--semantic-chart-2)_90%,var(--semantic-text-primary))]">
              {t("learner.profile.quickLinks.lessons")}
            </p>
            <span className="tabular-nums text-[10px] font-semibold text-[var(--semantic-text-muted)]">02</span>
          </div>
          {lessons.length === 0 ? (
            <p className="mt-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{t("learner.studyHome.sectionExploreTitle")}</p>
          ) : (
            <ul className="mt-3 space-y-1" role="list">
              {lessons.map((l) => (
                <li key={l.slug}>
                  <Link
                    className="group flex items-start justify-between gap-2 rounded-lg px-2 py-2 text-sm font-medium text-[color-mix(in_srgb,var(--semantic-brand)_92%,var(--semantic-text-primary))] transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-brand)_06%,var(--semantic-surface))]"
                    href={withPathwayScopeHref(buildAppLessonsReviewLessonHref(pid, l.slug), pid)}
                  >
                    <span className="min-w-0 [overflow-wrap:anywhere]">
                      <span className="block">{l.title}</span>
                      <span className="mt-0.5 block text-xs font-normal text-[var(--semantic-text-secondary)]">{l.topicKey}</span>
                    </span>
                    <ChevronRight
                      className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-text-muted)] opacity-70 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {labsStudyNudge ? (
        <div
          className="mt-4 flex flex-col gap-3 rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-3)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-3)_07%,var(--semantic-surface))] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
          data-nn-adaptive-labs-nudge=""
        >
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-chart-3)_12%,var(--semantic-surface))] text-[color-mix(in_srgb,var(--semantic-chart-3)_88%,var(--semantic-text-primary))]">
              <FlaskConical className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[color-mix(in_srgb,var(--semantic-chart-3)_88%,var(--semantic-text-primary))]">
                {t("learner.studyHome.quickLaunch.labsTitle")}
              </p>
              <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">{t("learner.studyHome.quickLaunch.labsDesc")}</p>
              <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Topics linking to labs">
                {labsStudyNudge.matchedTopicKeys.map((k) => (
                  <li
                    key={k}
                    className="rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-3)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-3)_05%,var(--semantic-surface))] px-2 py-0.5 text-[10px] font-medium text-[var(--semantic-text-primary)]"
                  >
                    {k}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Link
            href={withPathwayScopeHref(labsStudyNudge.href, pid)}
            className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full bg-[var(--role-cta)] px-4 text-xs font-semibold text-[var(--role-cta-foreground)] shadow-[0_2px_8px_var(--role-cta-shadow)] sm:min-h-9"
          >
            {t("learner.studyHome.quickLaunch.labsCta")}
          </Link>
        </div>
      ) : null}

      {ecgStudyNudge ? (
        <div
          className="mt-4 flex flex-col gap-3 rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-2)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-2)_07%,var(--semantic-surface))] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
          data-nn-adaptive-ecg-nudge=""
        >
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-chart-2)_12%,var(--semantic-surface))] text-[color-mix(in_srgb,var(--semantic-chart-2)_88%,var(--semantic-text-primary))]">
              <Activity className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[color-mix(in_srgb,var(--semantic-chart-2)_88%,var(--semantic-text-primary))]">
                {t("learner.studyHome.quickLaunch.ecgTitle")}
              </p>
              <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">{t("learner.studyHome.quickLaunch.ecgDesc")}</p>
              <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Topics linking to ECG telemetry study">
                {ecgStudyNudge.matchedTopicKeys.map((k) => (
                  <li
                    key={k}
                    className="rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-2)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-2)_05%,var(--semantic-surface))] px-2 py-0.5 text-[10px] font-medium text-[var(--semantic-text-primary)]"
                  >
                    {k}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Link
            href={withPathwayScopeHref(ecgStudyNudge.href, pid)}
            className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full bg-[var(--role-cta)] px-4 text-xs font-semibold text-[var(--role-cta-foreground)] shadow-[0_2px_8px_var(--role-cta-shadow)] sm:min-h-9"
          >
            {t("learner.studyHome.quickLaunch.ecgCta")}
          </Link>
        </div>
      ) : null}

      {medCalcStudyNudge ? (
        <div
          className="mt-4 flex flex-col gap-3 rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-5)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-5)_07%,var(--semantic-surface))] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
          data-nn-adaptive-med-calc-nudge=""
        >
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-chart-5)_12%,var(--semantic-surface))] text-[color-mix(in_srgb,var(--semantic-chart-5)_88%,var(--semantic-text-primary))]">
              <Calculator className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[color-mix(in_srgb,var(--semantic-chart-5)_88%,var(--semantic-text-primary))]">
                {t("components.examPathwayHub.premiumModules.medCalcTitle")}
              </p>
              <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
                {t("components.examPathwayHub.premiumModules.medCalcBody")}
              </p>
              <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Topics linking to medication calculations">
                {medCalcStudyNudge.matchedTopicKeys.map((k) => (
                  <li
                    key={k}
                    className="rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-5)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-5)_05%,var(--semantic-surface))] px-2 py-0.5 text-[10px] font-medium text-[var(--semantic-text-primary)]"
                  >
                    {k}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Link
            href={withStudyToolPathwayQuery(STUDY_TOOL_ROUTES.medCalculations, pid)}
            className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-5)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-5)_10%,var(--semantic-surface))] px-4 text-xs font-semibold text-[color-mix(in_srgb,var(--semantic-chart-5)_92%,var(--semantic-text-primary))] shadow-[var(--semantic-shadow-soft)] transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-chart-5)_18%,var(--semantic-surface))] sm:min-h-9"
          >
            {t("components.examPathwayHub.premiumModules.medCalcCta")}
          </Link>
        </div>
      ) : null}

      {clinicalSkillsStudyNudge ? (
        <div
          className="mt-4 flex flex-col gap-3 rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-1)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-1)_07%,var(--semantic-surface))] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
          data-nn-adaptive-clinical-skills-nudge=""
        >
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-chart-1)_12%,var(--semantic-surface))] text-[color-mix(in_srgb,var(--semantic-chart-1)_88%,var(--semantic-text-primary))]">
              <HeartPulse className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[color-mix(in_srgb,var(--semantic-chart-1)_88%,var(--semantic-text-primary))]">
                {t("components.examPathwayHub.premiumModules.skillsRefresherTitle")}
              </p>
              <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
                {t("components.examPathwayHub.premiumModules.skillsRefresherBody")}
              </p>
              <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Topics linking to clinical skills">
                {clinicalSkillsStudyNudge.matchedTopicKeys.map((k) => (
                  <li
                    key={k}
                    className="rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-1)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-1)_05%,var(--semantic-surface))] px-2 py-0.5 text-[10px] font-medium text-[var(--semantic-text-primary)]"
                  >
                    {k}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Link
            href={withStudyToolPathwayQuery(STUDY_TOOL_ROUTES.clinicalSkills, pid)}
            className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-1)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-1)_10%,var(--semantic-surface))] px-4 text-xs font-semibold text-[color-mix(in_srgb,var(--semantic-chart-1)_92%,var(--semantic-text-primary))] shadow-[var(--semantic-shadow-soft)] transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-chart-1)_18%,var(--semantic-surface))] sm:min-h-9"
          >
            {t("components.examPathwayHub.premiumModules.skillsRefresherCta")}
          </Link>
        </div>
      ) : null}

      {scenariosStudyNudge ? (
        <div
          className="mt-4 flex flex-col gap-3 rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-2)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-2)_07%,var(--semantic-surface))] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
          data-nn-adaptive-scenarios-nudge=""
        >
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-chart-2)_12%,var(--semantic-surface))] text-[color-mix(in_srgb,var(--semantic-chart-2)_88%,var(--semantic-text-primary))]">
              <Theater className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[color-mix(in_srgb,var(--semantic-chart-2)_88%,var(--semantic-text-primary))]">
                {t("learner.shell.nav.clinicalScenarios")}
              </p>
              <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">{t("learner.studyHome.quickLaunch.scenariosDesc")}</p>
              <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Topics linking to scenarios">
                {scenariosStudyNudge.matchedTopicKeys.map((k) => (
                  <li
                    key={k}
                    className="rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-2)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-2)_05%,var(--semantic-surface))] px-2 py-0.5 text-[10px] font-medium text-[var(--semantic-text-primary)]"
                  >
                    {k}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Link
            href={withPathwayScopeHref(scenariosStudyNudge.href, pid)}
            className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-2)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-2)_10%,var(--semantic-surface))] px-4 text-xs font-semibold text-[color-mix(in_srgb,var(--semantic-chart-2)_92%,var(--semantic-text-primary))] shadow-[var(--semantic-shadow-soft)] transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-chart-2)_18%,var(--semantic-surface))] sm:min-h-9"
          >
            {t("learner.studyHome.quickLaunch.scenariosCta")}
          </Link>
        </div>
      ) : null}

      <div className="mt-4 rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-chart-4)_08%,var(--semantic-surface))] p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[color-mix(in_srgb,var(--semantic-chart-4)_88%,var(--semantic-text-primary))]">
            {t("learner.profile.quickLinks.catPractice")}
          </p>
          <span className="tabular-nums text-[10px] font-semibold text-[var(--semantic-text-muted)]">03</span>
        </div>
        <ul className="mt-3 space-y-2 text-sm leading-snug text-[var(--semantic-text-secondary)]" role="list">
          {recommendations.flashcards.slice(0, 3).map((f) => (
            <li key={f.topicKey} className="flex gap-2 rounded-lg border border-[color-mix(in_srgb,var(--semantic-border-soft)_80%,transparent)] bg-[var(--semantic-surface)] px-3 py-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--semantic-chart-4)]" aria-hidden />
              <span>
                {t("learner.profile.quickLinks.flashcards")} — {f.topicKey}
                {f.allowed ? "" : ` (${t("learner.profile.quickLinks.questionBank")})`}
              </span>
            </li>
          ))}
          <li className="flex gap-2 rounded-lg border border-[color-mix(in_srgb,var(--semantic-border-soft)_80%,transparent)] bg-[var(--semantic-surface)] px-3 py-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--semantic-info)]" aria-hidden />
            <span>
              {catHint.catPoolSurfaceAvailable
                ? t("learner.profile.quickLinks.catPractice")
                : t("learner.profile.quickLinks.questionBank")}
            </span>
          </li>
          {catHint.suggestStudyModeReview && rationaleLines[1] ? (
            <li className="flex gap-2 rounded-lg border border-[color-mix(in_srgb,var(--semantic-info)_16%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info-soft)_35%,var(--semantic-surface))] px-3 py-2 text-[var(--semantic-text-primary)]">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--semantic-info)]" aria-hidden />
              <span>{rationaleLines[1]}</span>
            </li>
          ) : null}
        </ul>
      </div>

      {rationaleLines.length > 1 ? (
        <p className="mt-3 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{rationaleLines.slice(1).join(" ")}</p>
      ) : null}
    </section>
  );
}
