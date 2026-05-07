"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { Sparkles } from "lucide-react";
import { getLessonHubSystemVisual } from "@/components/pathway-lessons/lesson-system-hub-visuals";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import type { PublicNewGradStudyDestinations } from "@/lib/navigation/marketing-pathway-nav-destinations";
import { newGradMarketingHubBase, type NewGradMarketingShell } from "@/lib/navigation/new-grad-marketing-hub-paths";
import { listNewGradWorkAreas } from "@/lib/new-grad/new-grad-work-areas";

function hubVisualKeyForSlug(slug: string): string {
  const s = slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_");
  return s.length > 0 ? s : "fundamentals";
}

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
  const regionLabel = shell === "us" ? "United States" : "Canada";

  return (
    <div className="space-y-10" data-nn-new-grad-marketing-landing="1">
      <header className="relative overflow-hidden rounded-[1.75rem] border border-[color-mix(in_srgb,var(--semantic-chart-2)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-2)_8%,var(--semantic-surface))] px-6 py-10 shadow-[var(--semantic-shadow-soft)] sm:px-10 sm:py-12">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_12%,transparent)] blur-3xl"
          aria-hidden
        />
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--semantic-brand)]">
          {regionLabel} · {t("nav.mega.newGrad.label")}
        </p>
        <h1 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-[var(--theme-heading-text)] sm:text-4xl sm:leading-[1.12]">
          {t("nav.mega.newGrad.label")}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--semantic-text-secondary)] sm:text-lg">
          First-year nurses: pick your clinical unit to see shift priorities, safety edges, and study entry points scoped to
          the New Grad transition-to-practice library — without dropping you into the generic NCLEX-RN marketing hub.
        </p>
        <p className="mt-4 max-w-2xl text-sm text-[var(--semantic-text-secondary)]">
          {t("nav.mega.newGrad.hubDescription")}
        </p>
      </header>

      <section
        className="rounded-[1.5rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 sm:p-8"
        aria-labelledby="ng-work-areas-heading"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="ng-work-areas-heading" className="text-xl font-bold text-[var(--theme-heading-text)]">
              Choose your clinical work area
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[var(--semantic-text-secondary)]">
              Each card opens a unit readiness hub: what new grads need first, common presentations, assessments, and
              communication habits — then lessons, flashcards, and practice questions on the New Grad transition pathway.
            </p>
          </div>
        </div>
        <ul className="nn-qa-pathway-lessons-grid mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {areas.map((a) => {
            const visual = getLessonHubSystemVisual(hubVisualKeyForSlug(a.slug));
            const Icon = visual.icon;
            const href = `${base}/${a.slug}`;
            return (
              <li key={a.slug}>
                <article
                  className="flex h-full flex-col rounded-[1.35rem] border border-[color-mix(in_srgb,var(--semantic-chart-3)_18%,var(--semantic-border-soft))] bg-[var(--semantic-panel-muted)] p-5 shadow-[var(--semantic-shadow-soft)] transition hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))]"
                  style={{ "--nn-system-accent": `var(${visual.accentVar})` } as CSSProperties}
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--nn-system-accent)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--nn-system-accent)_10%,var(--semantic-surface))] text-[var(--nn-system-accent)]">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <h3 className="mt-3 text-base font-semibold text-[var(--theme-heading-text)]">{a.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{a.tagline}</p>
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--semantic-border-soft)] pt-4">
                    <Link
                      href={href}
                      className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
                      data-nn-new-grad-work-area-card-primary="1"
                    >
                      Open unit hub
                    </Link>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </section>

      <section
        aria-labelledby="ng-study-modes-heading"
        className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-6 sm:p-8"
      >
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--semantic-chart-4)_12%,var(--semantic-surface))] text-[var(--semantic-chart-4)]">
            <Sparkles className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h2 id="ng-study-modes-heading" className="text-lg font-bold text-[var(--theme-heading-text)]">
              Transition-to-practice study modes
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[var(--semantic-text-secondary)]">
              These links stay on the dedicated New Grad transition pathway (lessons, questions, readiness) — not the
              NCLEX-RN marketing home. Start from a work-area hub above for unit context, or jump straight in here.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
              <Link
                href={study.lessons}
                className="rounded-full border border-[color-mix(in_srgb,var(--semantic-success)_30%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] px-4 py-2 text-[var(--semantic-success)] hover:bg-[color-mix(in_srgb,var(--semantic-success)_8%,var(--semantic-surface))]"
              >
                Lessons library
              </Link>
              <Link
                href={study.flashcards}
                className="rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-1)_30%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] px-4 py-2 text-[var(--semantic-chart-1)] hover:bg-[color-mix(in_srgb,var(--semantic-chart-1)_8%,var(--semantic-surface))]"
              >
                Flashcards (app)
              </Link>
              <Link
                href={study.questions}
                className="rounded-full border border-[color-mix(in_srgb,var(--semantic-info)_30%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] px-4 py-2 text-[var(--semantic-info)] hover:bg-[color-mix(in_srgb,var(--semantic-info)_8%,var(--semantic-surface))]"
              >
                Practice questions
              </Link>
              <Link
                href={study.cat}
                className="rounded-full border border-[color-mix(in_srgb,var(--semantic-warning)_30%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] px-4 py-2 text-[var(--semantic-warning)] hover:bg-[color-mix(in_srgb,var(--semantic-warning)_8%,var(--semantic-surface))]"
              >
                Readiness exams
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
