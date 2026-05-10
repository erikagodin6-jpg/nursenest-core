"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Calculator, FlaskConical, HeartPulse } from "lucide-react";
import { weakTopicSuggestsClinicalSkillsFocus } from "@/lib/clinical-skills/clinical-skills-adaptive-signals";
import { weakTopicSuggestsLabsFocus } from "@/lib/labs/labs-adaptive-signals";
import { weakTopicSuggestsMedCalcFocus } from "@/lib/med-calculations/med-calc-adaptive-signals";
import { weakTopicSuggestsScenarioFocus } from "@/lib/scenarios/scenario-adaptive-signals";
import { useMarketingI18n } from "@/lib/marketing-i18n";

type PlanItem = {
  id: string;
  topic: string | null;
  bodySystem: string | null;
  priorityScore: number;
  lessonHref: string | null;
  flashcardsHref: string | null;
  practiceQuestionsHref: string | null;
  retestQuestionsHref: string | null;
};

type StudyPlanPayload = {
  enabled: boolean;
  remediationDue: PlanItem[];
};

/**
 * “Focus today” — remediation when due; otherwise weak-topic fallback when provided.
 * Loads `/api/study-plan` client-side so the dashboard shell stays cache-friendly.
 */
export function FocusTodayStrip({
  pathwayId,
  weakTopicFallback = [],
  weakPracticeHref,
}: {
  pathwayId?: string | null;
  /** Topic titles from dashboard snapshot when remediation queue is empty or engine off. */
  weakTopicFallback?: readonly string[];
  /** Pathway-scoped link to question practice filtered to weak areas. */
  weakPracticeHref?: string;
}) {
  const { t } = useMarketingI18n();
  const [plan, setPlan] = useState<StudyPlanPayload | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/study-plan", { method: "GET", credentials: "same-origin" });
      const data = (await res.json()) as StudyPlanPayload;
      if (!res.ok) {
        setPlan({ enabled: false, remediationDue: [] });
        return;
      }
      setPlan(data);
    } catch {
      setPlan({ enabled: false, remediationDue: [] });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const patchOutcome = async (id: string, wellPerformed: boolean) => {
    setBusyId(id);
    try {
      await fetch(`/api/study-plan/queue/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ wellPerformed }),
      });
      await load();
    } finally {
      setBusyId(null);
    }
  };

  if (plan === null) {
    return (
      <section className="nn-dash-section" aria-busy="true" aria-label={t("learner.focusToday.title")}>
        <div className="nn-focus-today-surface nn-focus-today-surface--loading rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_18%,var(--semantic-border-soft))] p-4 sm:p-5">
          <div className="nn-skeleton nn-skeleton-shimmer mb-3 h-3 w-28 rounded-full" />
          <div className="nn-skeleton nn-skeleton-shimmer mb-4 h-3 w-full max-w-md rounded-full" />
          <div className="space-y-3">
            <div className="nn-skeleton nn-skeleton-shimmer h-16 w-full rounded-xl" />
            <div className="nn-skeleton nn-skeleton-shimmer h-16 w-full rounded-xl opacity-80" />
          </div>
        </div>
      </section>
    );
  }

  const due = plan.remediationDue ?? [];
  const remediationItems = plan.enabled ? due.slice(0, 5) : [];
  const weakSlice = weakTopicFallback.slice(0, 5);

  if (remediationItems.length === 0 && weakSlice.length === 0) {
    return null;
  }

  const showRemediation = plan.enabled && remediationItems.length > 0;

  const labsHref =
    pathwayId?.trim().length && pathwayId.trim().length > 0
      ? `/app/labs?pathwayId=${encodeURIComponent(pathwayId.trim())}`
      : "/app/labs";
  const labsHaystack = [
    ...weakSlice,
    ...remediationItems.map((it) => [it.topic, it.bodySystem].filter(Boolean).join(" ").trim()),
  ].filter(Boolean);
  const showLabsRemediation = labsHaystack.some((line) => weakTopicSuggestsLabsFocus(line));
  const showMedCalcRemediation = labsHaystack.some((line) => weakTopicSuggestsMedCalcFocus(line));
  const showScenariosRemediation = labsHaystack.some((line) => weakTopicSuggestsScenarioFocus(line));
  const showClinicalSkillsRemediation = labsHaystack.some((line) => weakTopicSuggestsClinicalSkillsFocus(line));

  const scenariosHref =
    pathwayId?.trim().length && pathwayId.trim().length > 0
      ? `/app/clinical-scenarios?pathwayId=${encodeURIComponent(pathwayId.trim())}`
      : "/app/clinical-scenarios";

  const medCalcHref =
    pathwayId?.trim().length && pathwayId.trim().length > 0
      ? `/app/med-calculations?pathwayId=${encodeURIComponent(pathwayId.trim())}`
      : "/app/med-calculations";

  const clinicalSkillsHref =
    pathwayId?.trim().length && pathwayId.trim().length > 0
      ? `/app/clinical-skills?pathwayId=${encodeURIComponent(pathwayId.trim())}`
      : "/app/clinical-skills";

  return (
    <section className="nn-dash-section" aria-label={t("learner.focusToday.title")}>
      <div className="nn-focus-today-surface rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[var(--semantic-panel-cool)] p-4 shadow-[var(--shadow-card)] transition-shadow duration-200 hover:shadow-[var(--shadow-card-hover)] sm:p-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--semantic-info)]">
          {t("learner.focusToday.title")}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
          {showRemediation ? t("learner.focusToday.intro") : t("learner.focusToday.weakFallbackIntro")}
        </p>

        {showLabsRemediation ? (
          <div
            className="mt-4 flex flex-col gap-2 rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-3)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-3)_07%,var(--semantic-surface))] p-4 sm:flex-row sm:items-center sm:justify-between"
            data-nn-focus-today-labs-nudge=""
          >
            <div className="flex items-start gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-chart-3)_14%,var(--semantic-surface))] text-[color-mix(in_srgb,var(--semantic-chart-3)_88%,var(--semantic-text-primary))]">
                <FlaskConical className="h-4 w-4" aria-hidden strokeWidth={2} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{t("learner.studyHome.quickLaunch.labsTitle")}</p>
                <p className="mt-0.5 text-xs leading-snug text-[var(--semantic-text-secondary)]">{t("learner.studyHome.quickLaunch.labsDesc")}</p>
              </div>
            </div>
            <Link
              href={labsHref}
              className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-3)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-3)_10%,var(--semantic-surface))] px-4 text-xs font-semibold text-[color-mix(in_srgb,var(--semantic-chart-3)_90%,var(--semantic-text-primary))] transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-chart-3)_16%,var(--semantic-surface))] sm:min-h-9"
            >
              {t("learner.studyHome.quickLaunch.labsCta")}
            </Link>
          </div>
        ) : null}

        {showMedCalcRemediation ? (
          <div
            className="mt-4 flex flex-col gap-2 rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-5)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-5)_06%,var(--semantic-surface))] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            data-nn-focus-today-med-calc-nudge=""
          >
            <div className="flex items-start gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-chart-5)_12%,var(--semantic-surface))] text-[color-mix(in_srgb,var(--semantic-chart-5)_88%,var(--semantic-text-primary))]">
                <Calculator className="h-4 w-4" aria-hidden strokeWidth={2} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">
                  {t("components.examPathwayHub.premiumModules.medCalcTitle")}
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-[var(--semantic-text-secondary)]">
                  {t("components.examPathwayHub.premiumModules.medCalcBody")}
                </p>
              </div>
            </div>
            <Link
              href={medCalcHref}
              className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-5)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-5)_08%,var(--semantic-surface))] px-4 text-xs font-semibold text-[color-mix(in_srgb,var(--semantic-chart-5)_90%,var(--semantic-text-primary))] transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-chart-5)_14%,var(--semantic-surface))] sm:min-h-9"
            >
              {t("components.examPathwayHub.premiumModules.medCalcCta")}
            </Link>
          </div>
        ) : null}

        {showClinicalSkillsRemediation ? (
          <div
            className="mt-4 flex flex-col gap-2 rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-1)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-1)_06%,var(--semantic-surface))] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            data-nn-focus-today-clinical-skills-nudge=""
          >
            <div className="flex items-start gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-chart-1)_12%,var(--semantic-surface))] text-[color-mix(in_srgb,var(--semantic-chart-1)_88%,var(--semantic-text-primary))]">
                <HeartPulse className="h-4 w-4" aria-hidden strokeWidth={2} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">
                  {t("components.examPathwayHub.premiumModules.skillsRefresherTitle")}
                </p>
                <p className="mt-0.5 line-clamp-3 text-xs leading-snug text-[var(--semantic-text-secondary)]">
                  {t("components.examPathwayHub.premiumModules.skillsRefresherBody")}
                </p>
              </div>
            </div>
            <Link
              href={clinicalSkillsHref}
              className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-1)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-1)_08%,var(--semantic-surface))] px-4 text-xs font-semibold text-[color-mix(in_srgb,var(--semantic-chart-1)_90%,var(--semantic-text-primary))] transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-chart-1)_14%,var(--semantic-surface))] sm:min-h-9"
            >
              {t("components.examPathwayHub.premiumModules.skillsRefresherCta")}
            </Link>
          </div>
        ) : null}

        {showScenariosRemediation ? (
          <div
            className="mt-4 flex flex-col gap-2 rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-2)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-2)_06%,var(--semantic-surface))] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            data-nn-focus-today-scenarios-nudge=""
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{t("learner.shell.nav.clinicalScenarios")}</p>
              <p className="mt-0.5 text-xs text-[var(--semantic-text-secondary)]">{t("learner.studyHome.quickLaunch.scenariosDesc")}</p>
            </div>
            <Link
              href={scenariosHref}
              className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-2)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-2)_08%,var(--semantic-surface))] px-4 text-xs font-semibold text-[color-mix(in_srgb,var(--semantic-chart-2)_90%,var(--semantic-text-primary))] transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-chart-2)_14%,var(--semantic-surface))] sm:min-h-9"
            >
              {t("learner.studyHome.quickLaunch.scenariosCta")}
            </Link>
          </div>
        ) : null}

        {showRemediation ? (
          <ul className="mt-4 space-y-3">
            {remediationItems.map((it) => (
              <li
                key={it.id}
                className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-4"
              >
                <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">
                  {it.topic?.trim() || it.bodySystem?.trim() || "Review topic"}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {it.lessonHref ? (
                    <Link
                      href={it.lessonHref}
                      className="inline-flex min-h-9 items-center rounded-full border border-[var(--semantic-border-soft)] px-3 text-xs font-semibold text-[var(--semantic-text-primary)] transition-colors duration-200 hover:bg-[var(--semantic-panel-muted)]"
                    >
                      Review lesson
                    </Link>
                  ) : null}
                  {it.flashcardsHref ? (
                    <Link
                      href={it.flashcardsHref}
                      className="inline-flex min-h-9 items-center rounded-full border border-[var(--semantic-border-soft)] px-3 text-xs font-semibold text-[var(--semantic-text-primary)] transition-colors duration-200 hover:bg-[var(--semantic-panel-muted)]"
                    >
                      Do flashcards
                    </Link>
                  ) : null}
                  {it.retestQuestionsHref || it.practiceQuestionsHref ? (
                    <Link
                      href={it.retestQuestionsHref ?? it.practiceQuestionsHref ?? "/app/questions"}
                      className="inline-flex min-h-9 items-center rounded-full px-3 text-xs font-semibold text-[var(--role-cta-foreground)] transition-[filter,transform] duration-200 hover:brightness-105"
                      style={{ background: "var(--role-cta)" }}
                    >
                      Retry questions
                    </Link>
                  ) : null}
                </div>
                <div className="mt-3 flex flex-wrap gap-2 border-t border-[var(--semantic-border-soft)] pt-3">
                  <button
                    type="button"
                    disabled={busyId === it.id}
                    className="nn-btn-secondary min-h-9 rounded-full px-3 text-xs font-semibold disabled:opacity-50"
                    onClick={() => void patchOutcome(it.id, true)}
                  >
                    Done — felt solid
                  </button>
                  <button
                    type="button"
                    disabled={busyId === it.id}
                    className="inline-flex min-h-9 items-center rounded-full border border-[color-mix(in_srgb,var(--semantic-warning)_35%,var(--semantic-border-soft))] px-3 text-xs font-semibold text-[var(--semantic-text-primary)] transition-colors duration-200 hover:bg-[color-mix(in_srgb,var(--semantic-warning)_08%,var(--semantic-surface))] disabled:opacity-50"
                    onClick={() => void patchOutcome(it.id, false)}
                  >
                    Still shaky
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="mt-4 space-y-2">
            {weakSlice.map((topic) => (
              <li
                key={topic}
                className="flex items-center gap-2 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2.5 text-sm text-[var(--semantic-text-secondary)] shadow-sm"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--semantic-warning)]" aria-hidden />
                <span className="font-medium text-[var(--semantic-text-primary)]">{topic}</span>
              </li>
            ))}
          </ul>
        )}

        {!showRemediation && weakPracticeHref ? (
          <div className="mt-4">
            <Link
              href={weakPracticeHref}
              className="nn-btn-primary inline-flex min-h-10 items-center justify-center rounded-full px-5 text-sm font-semibold transition-transform duration-200 hover:-translate-y-px"
            >
              {t("learner.focusToday.practiceWeakCta")}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
