"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";

import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { safeHomepageMarketingT, useMarketingI18n } from "@/lib/marketing-i18n";
import { PH } from "@/lib/observability/posthog-conversion-events";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
} from "@/lib/theme/marketing-hero-pattern";

import { usePremiumHomepageRoutes } from "./premium-homepage-routes";

export function PremiumHomepageCta() {
  const { hrefs, region } = usePremiumHomepageRoutes();
  const { t } = useMarketingI18n();
  const tr = (key: string, fallback: string) => safeHomepageMarketingT(t, key, fallback);
  const assurances = [
    tr("pages.home.premium.bottomCta.assurance0", "Free to start"),
    tr("pages.home.premium.bottomCta.assurance1", "No credit card required"),
    tr("pages.home.premium.bottomCta.assurance2", "Cancel anytime"),
  ];

  return (
    <section
      className="nn-premium-home-section nn-premium-home-section--cta"
      aria-labelledby="premium-homepage-final-cta-heading"
      data-testid="section-premium-homepage-final-cta"
    >
      <div className="nn-section-shell">
        <div className="nn-premium-final-cta rounded-3xl border p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
            <div>
              <p className="nn-premium-home-eyebrow">
                {tr("pages.home.premium.bottomCta.eyebrow", "Start today")}
              </p>
              <h2
                id="premium-homepage-final-cta-heading"
                className="nn-marketing-h2 mt-4 max-w-3xl text-balance text-[var(--palette-heading)]"
              >
                {tr(
                  "pages.home.premium.bottomCta.heading",
                  "Build a sustainable study rhythm before your exam date.",
                )}
              </h2>
              <p className="nn-marketing-body mt-3 max-w-2xl text-pretty text-[var(--palette-text-muted)]">
                {tr(
                  "pages.home.premium.bottomCta.body",
                  "Begin with open lessons and practice items. Upgrade when you want the full bank, adaptive exams, and deeper readiness analytics.",
                )}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <MarketingTrackedLink
                  href={hrefs.signup}
                  event={PH.marketingHomeFinalCta}
                  eventProps={{ region, choice: "signup", surface: "premium_homepage_final_cta" }}
                  className={MARKETING_PRIMARY_CTA_CLASS}
                  data-testid="premium-final-cta-primary"
                >
                  {tr("pages.home.premium.bottomCta.primaryCta", "Create free account")}
                  <ArrowRight className="ml-2 h-4 w-4 shrink-0" aria-hidden />
                </MarketingTrackedLink>
                <MarketingTrackedLink
                  href={hrefs.pricing}
                  event={PH.marketingHomeFinalCta}
                  eventProps={{ region, choice: "pricing", surface: "premium_homepage_final_cta" }}
                  className={MARKETING_SECONDARY_CTA_CLASS}
                  data-testid="premium-final-cta-secondary"
                >
                  {tr("pages.home.premium.bottomCta.secondaryCta", "Compare subscription plans")}
                </MarketingTrackedLink>
              </div>

              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-[var(--palette-text-muted)]">
                {assurances.map((item) => (
                  <li key={item} className="inline-flex min-w-0 items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <MarketingTrackedLink
                href={hrefs.lessons}
                event={PH.marketingHomeFinalCta}
                eventProps={{ region, choice: "lessons", surface: "premium_homepage_final_cta_panel" }}
                className="nn-premium-cta-tile min-w-0 rounded-2xl border p-4"
              >
                <span className="text-xs font-black uppercase tracking-wide text-[var(--semantic-brand)]">
                  {tr("pages.home.premium.bottomCta.tiles.lessons.label", "Lessons")}
                </span>
                <span className="mt-1 block text-sm font-bold text-[var(--palette-heading)]">
                  {tr("pages.home.premium.bottomCta.tiles.lessons.title", "Browse clinical lessons")}
                </span>
              </MarketingTrackedLink>
              <MarketingTrackedLink
                href={hrefs.schools}
                event={PH.marketingHomeFinalCta}
                eventProps={{ region, choice: "schools", surface: "premium_homepage_final_cta_panel" }}
                className="nn-premium-cta-tile min-w-0 rounded-2xl border p-4"
              >
                <span className="text-xs font-black uppercase tracking-wide text-[var(--semantic-info)]">
                  {tr("pages.home.premium.bottomCta.tiles.schools.label", "Schools")}
                </span>
                <span className="mt-1 block text-sm font-bold text-[var(--palette-heading)]">
                  {tr("pages.home.premium.bottomCta.tiles.schools.title", "Explore partner institutions")}
                </span>
              </MarketingTrackedLink>
              <MarketingTrackedLink
                href={hrefs.questionBank}
                event={PH.marketingHomeFinalCta}
                eventProps={{ region, choice: "question_bank", surface: "premium_homepage_final_cta_panel" }}
                className="nn-premium-cta-tile min-w-0 rounded-2xl border p-4"
              >
                <span className="text-xs font-black uppercase tracking-wide text-[var(--semantic-success)]">
                  {tr("pages.home.premium.bottomCta.tiles.practice.label", "Practice")}
                </span>
                <span className="mt-1 block text-sm font-bold text-[var(--palette-heading)]">
                  {tr("pages.home.premium.bottomCta.tiles.practice.title", "Open question bank")}
                </span>
              </MarketingTrackedLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
