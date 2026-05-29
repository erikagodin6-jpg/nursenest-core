"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { Sparkles } from "lucide-react";
import {
  NewGradHeroFull,
  NewGradFirstYearFramework,
  NewGradClinicalScenarios,
  NewGradDashboardPreview,
  NewGradLearningEcosystem,
  NewGradTestimonialStrip,
  NewGradCareerOutcomes,
} from "@/components/marketing/new-grad/new-grad-homepage-sections";
import { getLessonHubSystemVisual } from "@/components/pathway-lessons/lesson-system-hub-visuals";
import { safeHomepageMarketingT, useMarketingI18n } from "@/lib/marketing-i18n";
import type { PublicNewGradStudyDestinations } from "@/lib/navigation/marketing-pathway-nav-destinations";
import { newGradMarketingHubBase, type NewGradMarketingShell } from "@/lib/navigation/new-grad-marketing-hub-paths";
import { listNewGradWorkAreas } from "@/lib/new-grad/new-grad-work-areas";

export function NewGradMarketingLanding({
  shell,
  study,
}: {
  shell: NewGradMarketingShell;
  study: PublicNewGradStudyDestinations;
}) {
  const { t } = useMarketingI18n();
  const base = newGradMarketingHubBase(shell);
  const areas = listNewGradWorkAreas();
  const tr = (key: string, fallback: string) => safeHomepageMarketingT(t, key, fallback);

  // Ecosystem hrefs mapped from study destinations + fixed module paths
  const ecosystemHrefs = {
    lessons: study.lessons,
    flashcards: study.flashcards,
    questions: study.questions,
    simulations: "/clinical-scenarios",
    clinicalSkills: "/clinical-scenarios",
    pharmacology: study.lessons,
    ecg: "/modules/ecg",
    dashboard: "/login",
  } as const;

  return (
    <div
      className="nn-premium-pathway-hub nn-premium-pathway-hub--new-grad space-y-10"
      data-nn-new-grad-marketing-landing="1"
    >
      {/* ── Full Redesigned Hero ──────────────────────────────────────── */}
      <NewGradHeroFull
        primaryHref={study.hubHref}
        simulationsHref="/clinical-scenarios"
      />

      {/* ── First-Year Success Framework ─────────────────────────────── */}
      <NewGradFirstYearFramework lessonsHref={study.lessons} />

      {/* ── Real Clinical Scenarios ──────────────────────────────────── */}
      <NewGradClinicalScenarios simulationsHref="/clinical-scenarios" />

      {/* ── Dashboard Preview ────────────────────────────────────────── */}
      <NewGradDashboardPreview dashboardHref="/login" />

      {/* ── Learning Ecosystem ───────────────────────────────────────── */}
      <NewGradLearningEcosystem hrefs={ecosystemHrefs} />

      {/* ── Testimonials ─────────────────────────────────────────────── */}
      <NewGradTestimonialStrip />

      {/* ── Clinical Work Areas ──────────────────────────────────────── */}
      <section
        className="rounded-[1.5rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 sm:p-8"
        aria-labelledby="ng-work-areas-heading"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="ng-work-areas-heading" className="text-xl font-bold text-[var(--theme-heading-text)]">
              {tr("newGrad.marketing.landing.workAreasHeading", "Choose your clinical work area")}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              {tr(
                "newGrad.marketing.landing.workAreasBody",
                "Each card opens a unit readiness hub: what new grads need first, common presentations, assessments, and communication habits — then lessons, flashcards, and practice questions on the New Grad transition pathway.",
              )}
            </p>
          </div>
        </div>
        <ul className="nn-qa-pathway-lessons-grid mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {areas.map((a) => {
            const visual = getLessonHubSystemVisual(a.lessonVisualKey);
            const Icon = visual.icon;
            const href = `${base}/${a.slug}`;
            const accentName = visual.accentVar.replace(/^--semantic-/, "").replace(/-/g, " ");
            return (
              <li key={a.slug} className="min-w-0">
                <article
                  className="flex h-full min-w-0 flex-col rounded-[1.35rem] border border-[color-mix(in_srgb,var(--nn-system-accent)_20%,var(--semantic-border-soft))] bg-[var(--semantic-panel-muted)] p-5 shadow-[var(--semantic-shadow-soft)] transition motion-safe:hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--semantic-brand)_26%,var(--semantic-border-soft))]"
                  style={{ "--nn-system-accent": `var(${visual.accentVar})` } as CSSProperties}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="inline-flex items-center rounded-full border border-[color-mix(in_srgb,var(--nn-system-accent)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--nn-system-accent)_10%,var(--semantic-surface))] px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-[var(--nn-system-accent)]"
                      title={accentName}
                    >
                      {tr("newGrad.marketing.landing.unitEyebrow", "Unit lens")}
                    </span>
                  </div>
                  <span className="mt-3 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--nn-system-accent)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--nn-system-accent)_10%,var(--semantic-surface))] text-[var(--nn-system-accent)]">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <h3 className="mt-3 text-base font-semibold leading-snug text-[var(--theme-heading-text)]">{a.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{a.tagline}</p>
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--semantic-border-soft)] pt-4">
                    <Link
                      href={href}
                      className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
                      data-nn-new-grad-work-area-card-primary="1"
                    >
                      {tr("newGrad.marketing.landing.openUnitHubCta", "Open unit hub")}
                    </Link>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ── Study Modes Quick Access ──────────────────────────────────── */}
      <section
        aria-labelledby="ng-study-modes-heading"
        className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-6 sm:p-8"
      >
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--semantic-chart-4)_12%,var(--semantic-surface))] text-[var(--semantic-chart-4)]">
            <Sparkles className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="ng-study-modes-heading" className="text-lg font-bold text-[var(--theme-heading-text)]">
              {tr("newGrad.marketing.landing.studyModesHeading", "Transition-to-practice study modes")}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              {tr(
                "newGrad.marketing.landing.studyModesBody",
                "These links stay on the dedicated New Grad transition pathway (lessons, questions, readiness) — not the NCLEX-RN marketing home. Start from a work-area hub above for unit context, or jump straight in here.",
              )}
            </p>
            <div className="mt-5 flex min-w-0 max-w-full flex-wrap gap-2 sm:gap-3 text-sm font-semibold">
              <Link
                href={study.lessons}
                className="rounded-full border border-[color-mix(in_srgb,var(--semantic-success)_30%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] px-4 py-2 text-[var(--semantic-success)] hover:bg-[color-mix(in_srgb,var(--semantic-success)_8%,var(--semantic-surface))]"
              >
                {tr("newGrad.marketing.landing.studyLinkLessons", "Lessons library")}
              </Link>
              <Link
                href={study.flashcards}
                className="rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-1)_30%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] px-4 py-2 text-[var(--semantic-chart-1)] hover:bg-[color-mix(in_srgb,var(--semantic-chart-1)_8%,var(--semantic-surface))]"
              >
                {tr("newGrad.marketing.landing.studyLinkFlashcards", "Flashcards (app)")}
              </Link>
              <Link
                href={study.questions}
                className="rounded-full border border-[color-mix(in_srgb,var(--semantic-info)_30%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] px-4 py-2 text-[var(--semantic-info)] hover:bg-[color-mix(in_srgb,var(--semantic-info)_8%,var(--semantic-surface))]"
              >
                {tr("newGrad.marketing.landing.studyLinkQuestions", "Practice questions")}
              </Link>
              <Link
                href={study.practiceExams}
                className="rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-5)_30%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] px-4 py-2 text-[var(--semantic-chart-5)] hover:bg-[color-mix(in_srgb,var(--semantic-chart-5)_8%,var(--semantic-surface))]"
              >
                {tr("newGrad.marketing.landing.studyLinkPracticeExams", "Practice exams")}
              </Link>
              <Link
                href={study.cat}
                className="rounded-full border border-[color-mix(in_srgb,var(--semantic-warning)_30%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] px-4 py-2 text-[var(--semantic-warning)] hover:bg-[color-mix(in_srgb,var(--semantic-warning)_8%,var(--semantic-surface))]"
              >
                {tr("newGrad.marketing.landing.studyLinkReadiness", "Readiness exams")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Career Outcomes / Closing CTA ────────────────────────────── */}
      <NewGradCareerOutcomes signUpHref="/signup" />
    </div>
  );
}
