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
import {
  NEW_GRAD_CONTENT_LAUNCH_TARGETS,
  NEW_GRAD_COMPETENCY_DOMAINS,
  NEW_GRAD_PRACTICE_READINESS_DOMAINS,
  NEW_GRAD_READINESS_DIMENSIONS,
  NEW_GRAD_RESIDENCY_CORE_MODULES,
  NEW_GRAD_RESIDENCY_MARKETING_POSITIONING,
  NEW_GRAD_RESIDENCY_PILLARS,
  NEW_GRAD_RESIDENCY_TRACKS,
  NEW_GRAD_ROADMAP_MILESTONES,
  NEW_GRAD_SHIFT_READINESS_MODULES,
} from "@/lib/new-grad/new-grad-residency-program";
import { listNewGradWorkAreas } from "@/lib/new-grad/new-grad-work-areas";
import { MarketingProductProofBand } from "@/components/marketing/marketing-product-proof-band";
import { GENERATED_SCREENSHOT_PATHS } from "@/lib/marketing/generated-screenshot-registry";

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

      <MarketingProductProofBand
        kicker="Platform preview"
        title="New Grad study hub inside NurseNest"
        body="Specialty prep, clinical skills, simulations, and readiness — one connected transition workspace."
        shot={{
          src: GENERATED_SCREENSHOT_PATHS.newGradMarketingHub,
          alt: "New graduate nursing transition hub with specialty preparation and clinical confidence tools",
          theme: "blossom",
        }}
      />

      {/* ── First-Year Success Framework ─────────────────────────────── */}
      <NewGradFirstYearFramework lessonsHref={study.lessons} />

      {/* ── Residency Program Foundation ─────────────────────────────── */}
      <section
        className="rounded-[1.5rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 shadow-[var(--semantic-shadow-soft)] sm:p-8"
        aria-labelledby="ng-residency-program-heading"
        data-nn-new-grad-residency-program="1"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--semantic-chart-4)]">
              Digital nurse residency
            </p>
            <h2 id="ng-residency-program-heading" className="mt-2 text-xl font-bold text-[var(--theme-heading-text)]">
              First-year transition roadmap
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              The New Grad pathway is organized around real orientation milestones, specialty tracks, competency evidence,
              shift-readiness modules, and practical simulation practice.
            </p>
          </div>
          <Link
            href={study.lessons}
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-4)_30%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] px-4 text-sm font-semibold text-[var(--semantic-chart-4)] hover:bg-[color-mix(in_srgb,var(--semantic-chart-4)_8%,var(--semantic-surface))]"
          >
            Open residency lessons
          </Link>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-4)_20%,var(--semantic-border-soft))] bg-[var(--semantic-panel-muted)] p-4 sm:p-5">
            <h3 className="text-sm font-bold text-[var(--theme-heading-text)]">30 / 60 / 90 / 180 / 365-day roadmaps</h3>
            <ol className="mt-4 grid list-none gap-3 p-0 sm:grid-cols-2">
              {NEW_GRAD_ROADMAP_MILESTONES.map((milestone) => (
                <li
                  key={milestone.window}
                  className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3"
                >
                  <p className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-chart-4)]">
                    {milestone.label}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{milestone.focus}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_18%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] p-4 sm:p-5">
            <h3 className="text-sm font-bold text-[var(--theme-heading-text)]">Residency dashboard signals</h3>
            <ul className="mt-4 grid list-none gap-2 p-0">
              {NEW_GRAD_READINESS_DIMENSIONS.map((dimension) => (
                <li key={dimension.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-[var(--semantic-text-secondary)]">{dimension.label}</span>
                  <span className="rounded-full bg-[color-mix(in_srgb,var(--semantic-info)_10%,var(--semantic-surface))] px-2.5 py-1 text-xs font-bold text-[var(--semantic-info)]">
                    {dimension.weight}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-sm font-bold text-[var(--theme-heading-text)]">Six residency pillars</h3>
              <p className="mt-1 max-w-3xl text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
                Phase 1 organizes New Grad around first-year survival, high-risk scenarios, medication confidence,
                clinical skills, telemetry/ECG, and shift-based simulation.
              </p>
            </div>
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-chart-4)]">
              First-year nurse residency program
            </p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {NEW_GRAD_RESIDENCY_PILLARS.map((pillar) => (
              <article
                key={pillar.id}
                className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-3"
              >
                <p className="text-xs font-bold text-[var(--theme-heading-text)]">{pillar.title}</p>
                <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
                  {pillar.positioning}
                </p>
                <p className="mt-2 text-[0.68rem] font-semibold uppercase tracking-wide text-[var(--semantic-chart-4)]">
                  {pillar.topics.length} focus areas
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--semantic-border-soft))] bg-[var(--semantic-panel-muted)] p-4 sm:p-5">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--semantic-brand)]">
              {NEW_GRAD_RESIDENCY_MARKETING_POSITIONING.headline}
            </p>
            <h3 className="mt-2 text-sm font-bold text-[var(--theme-heading-text)]">Residency Academy Core Modules</h3>
            <p className="mt-2 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
              {NEW_GRAD_RESIDENCY_MARKETING_POSITIONING.productPromise}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {NEW_GRAD_RESIDENCY_CORE_MODULES.map((module) => (
                <span
                  key={module.id}
                  className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-2.5 py-1 text-xs font-semibold text-[var(--semantic-text-secondary)]"
                >
                  {module.title}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-success)_18%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] p-4 sm:p-5">
            <h3 className="text-sm font-bold text-[var(--theme-heading-text)]">Practice Readiness Domains</h3>
            <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
              Readiness is evidence-based: activities must show safe clinical judgment, communication, documentation,
              medication administration, and emergency response in realistic first-year conditions.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {NEW_GRAD_PRACTICE_READINESS_DOMAINS.map((domain) => (
                <div key={domain.id} className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-3">
                  <p className="text-xs font-bold text-[var(--theme-heading-text)]">{domain.label}</p>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
                    {domain.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
            <h3 className="text-sm font-bold text-[var(--theme-heading-text)]">Specialty tracks</h3>
            <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
              {NEW_GRAD_RESIDENCY_TRACKS.length} dedicated transition pathways.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {NEW_GRAD_RESIDENCY_TRACKS.slice(0, 8).map((track) => (
                <span
                  key={track.id}
                  className="rounded-full border border-[var(--semantic-border-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--semantic-text-secondary)]"
                >
                  {track.title}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
            <h3 className="text-sm font-bold text-[var(--theme-heading-text)]">Competency checklist</h3>
            <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
              Knowledge, skills, communication, documentation, professional practice, judgment, time management,
              delegation, and prioritization.
            </p>
            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-[var(--semantic-success)]">
              {NEW_GRAD_COMPETENCY_DOMAINS.length} competency domains
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
            <h3 className="text-sm font-bold text-[var(--theme-heading-text)]">Shift readiness</h3>
            <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
              Practical modules for first shift, first night shift, first charge shift, first ICU assignment, and first
              telemetry assignment.
            </p>
            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-[var(--semantic-warning)]">
              {NEW_GRAD_SHIFT_READINESS_MODULES.length} readiness modules
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-success)_20%,var(--semantic-border-soft))] bg-[var(--semantic-panel-muted)] p-4">
          <h3 className="text-sm font-bold text-[var(--theme-heading-text)]">Launch content targets</h3>
          <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
            Targets keep New Grad positioned as a dedicated transition-to-practice product, not a repackaged NCLEX bank.
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {NEW_GRAD_CONTENT_LAUNCH_TARGETS.slice(0, 5).map((target) => (
              <div
                key={target.id}
                className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3"
              >
                <p className="text-lg font-bold text-[var(--semantic-success)]">{target.minimum.toLocaleString()}+</p>
                <p className="text-xs font-semibold text-[var(--semantic-text-secondary)]">{target.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
