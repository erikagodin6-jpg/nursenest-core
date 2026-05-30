"use client";

import { ArrowRight, CalendarCheck, Flame, Target } from "lucide-react";

import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { safeHomepageMarketingT, useMarketingI18n } from "@/lib/marketing-i18n";
import { PH } from "@/lib/observability/posthog-conversion-events";
import {
  MARKETING_SECONDARY_CTA_CLASS,
  MARKETING_TERTIARY_LINK_CLASS,
} from "@/lib/theme/marketing-hero-pattern";

import { usePremiumHomepageRoutes } from "./premium-homepage-routes";

const DOMAINS = [
  { labelKey: "pharmacology", label: "Pharmacology", pct: 86, tone: "success" },
  { labelKey: "medSurg", label: "Medical–surgical", pct: 74, tone: "info" },
  { labelKey: "maternity", label: "Maternity", pct: 62, tone: "warning" },
  { labelKey: "pediatrics", label: "Pediatrics", pct: 48, tone: "danger" },
  { labelKey: "psych", label: "Psychiatric mental health", pct: 81, tone: "brand" },
  { labelKey: "fundamentals", label: "Fundamentals", pct: 90, tone: "success" },
] as const;

const READINESS_INTELLIGENCE = [
  { key: "sessionReports", label: "Session report cards", desc: "Summaries you can revisit and share with instructors" },
  { key: "harmIndex", label: "Harm Index signals", desc: "Safety-weighted weak areas—not just accuracy percentages" },
  { key: "replay", label: "Replay & timeline review", desc: "Walk back through decisions and rationales" },
  { key: "longitudinal", label: "Longitudinal learner intelligence", desc: "Trends across weeks, domains, and study modes" },
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
                "Readiness signals combine domain mastery, NCJMM-aligned judgment cues, competency bands, and study momentum. The preview uses sample data only and avoids outcome guarantees.",
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
            <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
              <div className="nn-premium-readiness-gauge" aria-label="Sample readiness score 75 percent">
                <span>75%</span>
              </div>
              <div>
                <p className="nn-marketing-caption font-bold uppercase tracking-wide text-[var(--palette-text-muted)]">
                  {tr("pages.home.premium.readiness.previewLabel", "Sample readiness")}
                </p>
                <h3 className="mt-1 text-2xl font-black text-[var(--palette-heading)]">
                  {tr("pages.home.premium.readiness.previewHeading", "On track with focused review")}
                </h3>
                <p className="nn-marketing-body-sm mt-2 text-[var(--palette-text-muted)]">
                  {tr(
                    "pages.home.premium.readiness.previewBody",
                    "Next priority: pediatric respiratory assessment and bronchodilator safety.",
                  )}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="nn-premium-mini-metric rounded-2xl border p-4">
                <Target className="h-5 w-5 text-[var(--semantic-brand)]" aria-hidden />
                <p className="mt-3 text-sm font-black text-[var(--palette-heading)]">
                  {tr("pages.home.premium.readiness.metricNext.label", "Next 30 min")}
                </p>
                <p className="text-xs text-[var(--palette-text-muted)]">
                  {tr("pages.home.premium.readiness.metricNext.value", "Pediatric asthma set")}
                </p>
              </div>
              <div className="nn-premium-mini-metric rounded-2xl border p-4">
                <Flame className="h-5 w-5 text-[var(--semantic-warning)]" aria-hidden />
                <p className="mt-3 text-sm font-black text-[var(--palette-heading)]">
                  {tr("pages.home.premium.readiness.metricStreak.label", "Study streak")}
                </p>
                <p className="text-xs text-[var(--palette-text-muted)]">
                  {tr("pages.home.premium.readiness.metricStreak.value", "5 active days")}
                </p>
              </div>
              <div className="nn-premium-mini-metric rounded-2xl border p-4">
                <CalendarCheck className="h-5 w-5 text-[var(--semantic-success)]" aria-hidden />
                <p className="mt-3 text-sm font-black text-[var(--palette-heading)]">
                  {tr("pages.home.premium.readiness.metricProgress.label", "Progress")}
                </p>
                <p className="text-xs text-[var(--palette-text-muted)]">
                  {tr("pages.home.premium.readiness.metricProgress.value", "42 items this week")}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {DOMAINS.map((domain) => (
                <div key={domain.labelKey}>
                  <div className="flex justify-between gap-4 text-xs font-bold text-[var(--palette-text-muted)]">
                    <span>
                      {tr(`pages.home.premium.readiness.domains.${domain.labelKey}`, domain.label)}
                    </span>
                    <span className="text-[var(--palette-heading)]">{domain.pct}%</span>
                  </div>
                  <div className="nn-premium-progress mt-1.5">
                    <span
                      data-nn-progress-fill
                      data-nn-progress-tone={domain.tone}
                      style={{ width: `${domain.pct}%`, ["--progress-tone" as string]: `var(--nn-premium-meter-${domain.tone})` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
