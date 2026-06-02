"use client";

import { ArrowRight, BrainCircuit, Compass, Route, ShieldCheck } from "lucide-react";

import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { safeHomepageMarketingT, useMarketingI18n } from "@/lib/marketing-i18n";
import { PH } from "@/lib/observability/posthog-conversion-events";
import {
  MARKETING_SECONDARY_CTA_CLASS,
  MARKETING_TERTIARY_LINK_CLASS,
} from "@/lib/theme/marketing-hero-pattern";

import { usePremiumHomepageRoutes } from "./premium-homepage-routes";

const READINESS_INTELLIGENCE = [
  { key: "sessionReports", label: "Session report cards", desc: "Summaries you can revisit and share with instructors" },
  { key: "harmIndex", label: "Harm Index signals", desc: "Safety-weighted weak areas—not just accuracy percentages" },
  { key: "replay", label: "Replay & timeline review", desc: "Walk back through decisions and rationales" },
  { key: "longitudinal", label: "Longitudinal learner intelligence", desc: "Trends across weeks, domains, and study modes" },
] as const;

const READINESS_FLOW = [
  {
    key: "detect",
    title: "Detect the weak area",
    body: "Recent answers, confidence, and clinical risk signals identify where study time should move next.",
    icon: BrainCircuit,
    tone: "brand",
  },
  {
    key: "route",
    title: "Route into remediation",
    body: "The system connects missed concepts to lessons, flashcards, clinical skills, ECG, labs, and targeted practice.",
    icon: Route,
    tone: "info",
  },
  {
    key: "forecast",
    title: "Forecast readiness",
    body: "Learners see whether momentum is improving and which domains still need work before full-length practice.",
    icon: Compass,
    tone: "warning",
  },
] as const;

export function PremiumReadinessPreview() {
  const { hrefs, region } = usePremiumHomepageRoutes();
  const { t } = useMarketingI18n();
  const tr = (key: string, fallback: string) => safeHomepageMarketingT(t, key, fallback);

  return (
    <section
      className="nn-premium-home-section nn-premium-home-section--readiness nn-marketing-brand-leaf-band border-b border-[var(--border-subtle)]"
      aria-labelledby="premium-readiness-heading"
      data-testid="section-premium-readiness-preview"
    >
      <div className="nn-section-shell">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="nn-premium-home-eyebrow">
              {tr("pages.home.premium.readiness.eyebrow", "Readiness dashboard")}
            </p>
            <h2 id="premium-readiness-heading" className="nn-marketing-h2 mt-4 text-balance text-[var(--palette-heading)]">
              {tr("pages.home.premium.readiness.heading", "Know where to study next without guessing.")}
            </h2>
            <p className="nn-marketing-body mt-3 max-w-xl text-pretty text-[var(--palette-text-muted)]">
              {tr(
                "pages.home.premium.readiness.body",
                "Readiness signals combine domain mastery, NCJMM-aligned judgment cues, competency bands, and study momentum without pretending a single score can guarantee an outcome.",
              )}
            </p>

            <div className="nn-home-readiness-intelligence mt-6 rounded-2xl border p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-info)]">
                {tr("pages.home.premium.readiness.intelligenceLabel", "Platform intelligence")}
              </p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {READINESS_INTELLIGENCE.map((item) => (
                  <li
                    key={item.key}
                    className="nn-home-readiness-intelligence__item rounded-xl border px-3 py-2.5"
                  >
                    <p className="text-sm font-semibold text-[var(--palette-heading)]">
                      {tr(`pages.home.premium.readiness.intelligence.${item.key}.label`, item.label)}
                    </p>
                    <p className="nn-marketing-body-sm mt-0.5 text-[var(--palette-text-muted)]">
                      {tr(`pages.home.premium.readiness.intelligence.${item.key}.desc`, item.desc)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <MarketingTrackedLink
                href={hrefs.dashboard}
                event={PH.marketingHomeFinalCta}
                eventProps={{ region, surface: "premium_readiness_preview", choice: "login_dashboard" }}
                className={MARKETING_SECONDARY_CTA_CLASS}
                data-testid="premium-readiness-dashboard-link"
              >
                {tr("pages.home.premium.readiness.dashboardCta", "Open dashboard")}
                <ArrowRight className="ml-2 h-4 w-4 shrink-0" aria-hidden />
              </MarketingTrackedLink>
              <MarketingTrackedLink
                href={hrefs.practiceExams}
                event={PH.marketingHomeExploreHubClick}
                eventProps={{ region, surface: "premium_readiness_preview", choice: "practice_exams" }}
                className={MARKETING_TERTIARY_LINK_CLASS}
              >
                {tr("pages.home.premium.readiness.catCta", "See CAT practice")}
              </MarketingTrackedLink>
            </div>
          </div>

          <div className="nn-premium-readiness-panel rounded-3xl border p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <span className="nn-premium-readiness-signal flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border" aria-hidden>
                <ShieldCheck className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <p className="nn-marketing-caption font-bold uppercase tracking-wide text-[var(--palette-text-muted)]">
                  {tr("pages.home.premium.readiness.previewLabel", "Readiness intelligence")}
                </p>
                <h3 className="mt-1 text-2xl font-black text-[var(--palette-heading)]">
                  {tr("pages.home.premium.readiness.previewHeading", "Know what to fix before the next exam block.")}
                </h3>
                <p className="nn-marketing-body-sm mt-2 text-[var(--palette-text-muted)]">
                  {tr(
                    "pages.home.premium.readiness.previewBody",
                    "NurseNest turns practice results into a study decision: what is weak, why it matters clinically, and where to go next.",
                  )}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {READINESS_FLOW.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.key}
                    className="nn-premium-readiness-flow-card rounded-2xl border p-4"
                    style={{ ["--readiness-flow-tone" as string]: `var(--nn-premium-tone-${item.tone})` }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-sm font-black text-[var(--palette-heading)]">
                          {tr(`pages.home.premium.readiness.flow.${item.key}.title`, item.title)}
                        </h4>
                        <p className="nn-marketing-body-sm mt-1 text-[var(--palette-text-muted)]">
                          {tr(`pages.home.premium.readiness.flow.${item.key}.body`, item.body)}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
