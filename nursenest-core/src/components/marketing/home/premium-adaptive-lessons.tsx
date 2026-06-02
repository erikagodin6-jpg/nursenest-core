"use client";

import { ArrowRight } from "lucide-react";

import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";

import { usePremiumHomepageRoutes } from "./premium-homepage-routes";

const LESSONS = [
  { tag: "Med-Surg", title: "Heart Failure: Compensated vs Decompensated", body: "Clear clinical framing, exam-style cues, and a focused concept recap.", tone: "warning" },
  { tag: "Pharm", title: "Beta Blockers: MOA, Indications, Holds", body: "Medication class logic, safety monitoring, and when to pause.", tone: "success" },
  { tag: "OB", title: "Postpartum Hemorrhage Recognition", body: "Priority assessment, escalation cues, and safety sequencing.", tone: "accent" },
  { tag: "Peds", title: "Asthma Exacerbation in Children", body: "Respiratory assessment, deterioration cues, and intervention order.", tone: "info" },
  { tag: "Psych", title: "Suicide Risk: Therapeutic Communication", body: "Assessment language, safety planning, and priority decisions.", tone: "brand" },
  { tag: "Fundamentals", title: "Acid-Base: Stepwise ABG Interpretation", body: "Structured interpretation that connects values to nursing action.", tone: "success" },
] as const;

export function PremiumAdaptiveLessons() {
  const { hrefs, region } = usePremiumHomepageRoutes();

  return (
    <section
      className="nn-premium-home-section nn-premium-home-section--adaptive-lessons border-b border-[var(--border-subtle)]"
      aria-labelledby="premium-adaptive-lessons-heading"
      data-testid="section-premium-adaptive-lessons"
    >
      <div className="nn-section-shell">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <div className="min-w-0">
            <p className="nn-premium-home-eyebrow">Adaptive Lessons</p>
            <h2 id="premium-adaptive-lessons-heading" className="nn-marketing-h2 mt-4 text-balance text-[var(--palette-heading)]">
              Lessons that read your readiness.
            </h2>
            <p className="nn-marketing-body mt-3 max-w-xl text-pretty text-[var(--palette-text-muted)]">
              Each lesson links clinical teaching to the same pathways, systems, and weak-area signals that power questions, CAT, and flashcards.
            </p>
            <MarketingTrackedLink
              href={hrefs.lessons}
              event={PH.marketingHomeExploreHubClick}
              eventProps={{ region, surface: "premium_adaptive_lessons" }}
              className="mt-6 inline-flex items-center text-sm font-bold text-[var(--semantic-brand)]"
            >
              Open lessons
              <ArrowRight className="ml-1.5 h-4 w-4 shrink-0" aria-hidden />
            </MarketingTrackedLink>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {LESSONS.map((lesson) => (
              <article
                key={lesson.title}
                className="nn-adaptive-lesson-card rounded-2xl border p-5"
                style={{ ["--adaptive-lesson-tone" as string]: `var(--nn-premium-tone-${lesson.tone})` }}
              >
                <span className="nn-adaptive-lesson-card__tag">{lesson.tag}</span>
                <h3 className="mt-3 text-base font-black leading-snug text-[var(--palette-heading)]">{lesson.title}</h3>
                <p className="nn-marketing-body-sm mt-2 text-pretty text-[var(--palette-text-muted)]">{lesson.body}</p>
                <div className="mt-5 h-1.5 rounded-full bg-[color-mix(in_srgb,var(--adaptive-lesson-tone)_14%,var(--border-subtle))]" aria-hidden>
                  <div className="h-full w-2/3 rounded-full bg-[var(--adaptive-lesson-tone)]" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
