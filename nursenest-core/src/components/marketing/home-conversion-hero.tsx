"use client";

import { useMemo } from "react";
import { ArrowRight, BookOpen, Server, ShieldCheck, Target } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { MarketingHeroCarousel } from "@/components/marketing/marketing-hero-carousel";
import { buildHomepageHeroSlidesAtIndices, getHomeHeroSlideExamTrackKey } from "@/config/home-hero-carousel";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { trackProductEvent } from "@/lib/observability/product-analytics";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
} from "@/lib/theme/marketing-hero-pattern";
import { PRIMARY_CTA, SECONDARY_CTA } from "@/lib/copy/cta-copy";
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";
import { ScaleIn, StaggerGroup, StaggerItem } from "@/lib/motion";

const HERO_SLIDE_ORDER: readonly number[] = [9, 0, 6, 2, 8];

/**
 * Premium split hero: concise message + conversion CTAs + real product preview carousel.
 */
export function HomeConversionHero() {
  const { locale, t } = useMarketingI18n();
  const { region } = useNursenestRegion();
  const loc = (path: string) => withMarketingLocale(locale, path);
  const slides = useMemo(
    () => buildHomepageHeroSlidesAtIndices(t, HERO_SLIDE_ORDER),
    [t],
  );

  const trustChips = [
    {
      icon: BookOpen,
      text:
        region === "US"
          ? "NCLEX-RN, NCLEX-PN, NP branches, and allied scopes"
          : "NCLEX-RN, REx-PN, NP branches, and allied scopes",
    },
    { icon: Target, text: "CAT-style readiness checks where your track supports them" },
    { icon: Server, text: "Server-enforced access with pathway-scoped study surfaces" },
  ] as const;

  return (
    <section
      className="nn-hero-branded nn-hero-branded--ambient-depth relative overflow-hidden border-b border-[var(--header-nav-border)]"
      data-testid="hero-section"
      aria-labelledby="home-conversion-hero-heading"
    >
      <div className="relative pt-10 pb-20 md:pt-12 md:pb-24">
        <div className="nn-section-shell">
          <div className="grid min-w-0 gap-12 lg:grid-cols-[1.06fr_0.94fr] lg:items-center lg:gap-14">
            <StaggerGroup className="min-w-0 space-y-7" staggerMs={55} whenInView once viewMargin="-12px">
              <StaggerItem variant="softReveal">
                <p className="nn-marketing-caption inline-block max-w-full text-balance break-words rounded-full border border-[var(--pill-border)] bg-[var(--pill-bg)] px-3.5 py-1.5 font-semibold tracking-wide text-[var(--pill-fg)]">
                  {formatTitleCase("NurseNest Exam Prep Platform", locale)}
                </p>
              </StaggerItem>
              <StaggerItem>
                <h1
                  id="home-conversion-hero-heading"
                  className="nn-marketing-h1 max-w-[22rem] text-balance break-words text-[var(--palette-heading)] sm:max-w-2xl sm:leading-[1.08]"
                  data-testid="text-hero-heading"
                >
                  <span className="block text-[var(--palette-heading)]">
                    {formatTitleCase("Pass your exam with prep", locale)}
                  </span>
                  <span className="mt-1 block text-[color-mix(in_srgb,var(--text-accent)_92%,var(--palette-heading))]">
                    {formatTitleCase("built for your license", locale)}
                  </span>
                </h1>
              </StaggerItem>
              <StaggerItem variant="softReveal">
                <p
                  className="nn-marketing-body max-w-xl text-pretty break-words leading-relaxed text-[var(--palette-text-muted)]"
                  data-testid="text-hero-subheading"
                >
                  {formatSentenceCase(
                    "Train with pathway-scoped questions, full rationales, and readiness signals so each session advances a clear prep plan.",
                    locale,
                  )}
                </p>
              </StaggerItem>
              <StaggerItem>
                <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch sm:justify-start sm:gap-4">
                  <MarketingTrackedLink
                    href={loc(HUB.signup)}
                    event={PH.marketingHomeHeroPrimaryCta}
                    eventProps={{
                      region,
                      marketing_region: region,
                      marketing_locale: locale,
                      destination: "signup",
                      surface: "hero_primary",
                      exam_tier_band: "undifferentiated_cta",
                    }}
                    className={`${MARKETING_PRIMARY_CTA_CLASS} nn-motion-standard rounded-xl shadow-[var(--shadow-card)]`}
                    data-testid="button-hero-start-practicing"
                  >
                    {formatTitleCase(PRIMARY_CTA, locale)}
                    <ArrowRight className="h-5 w-5 shrink-0" aria-hidden />
                  </MarketingTrackedLink>
                  <MarketingTrackedLink
                    href={loc(HUB.questionBank)}
                    event={PH.marketingHomeHeroSecondaryCta}
                    eventProps={{
                      region,
                      marketing_region: region,
                      marketing_locale: locale,
                      destination: "question_bank",
                      surface: "hero_try_free",
                      exam_tier_band: "undifferentiated_cta",
                    }}
                    className={`${MARKETING_SECONDARY_CTA_CLASS} nn-motion-standard rounded-xl border border-[var(--border-subtle)] shadow-sm`}
                    data-testid="button-hero-try-free-questions"
                  >
                    {formatTitleCase(SECONDARY_CTA, locale)}
                  </MarketingTrackedLink>
                </div>
              </StaggerItem>
              <StaggerItem variant="softReveal">
                <ul className="grid gap-2.5 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-2">
                  {trustChips.map((row) => {
                    const RowIcon = row.icon;
                    return (
                      <li
                        key={row.text}
                        className="flex min-w-0 items-start gap-2 rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_1,var(--border-subtle))] bg-[color-mix(in_srgb,var(--bg-card)_55%,transparent)] px-3 py-2.5"
                      >
                        <RowIcon
                          className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-brand)]"
                          aria-hidden
                        />
                        <span className="nn-marketing-caption text-balance leading-snug text-[var(--palette-text-muted)]">
                          {formatSentenceCase(row.text, locale)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </StaggerItem>
              <StaggerItem variant="softReveal">
                <p className="nn-marketing-caption flex min-w-0 items-start gap-2 text-balance break-words text-[var(--palette-text-muted)]">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />
                  {formatSentenceCase("No credit card required to start your first practice sessions.", locale)}
                </p>
              </StaggerItem>
            </StaggerGroup>

            <ScaleIn className="min-w-0" whenInView once viewMargin="-20px">
            <div
              className="relative rounded-[1.35rem] p-[2px] shadow-[0_28px_72px_-28px_color-mix(in_srgb,var(--palette-heading)_14%,transparent)]"
              style={{
                background:
                  "linear-gradient(145deg, color-mix(in srgb, var(--semantic-brand) 28%, var(--border-subtle)), color-mix(in srgb, var(--semantic-info) 22%, var(--border-subtle)), color-mix(in srgb, var(--theme-primary) 20%, var(--border-subtle)))",
              }}
            >
            <div
              className="overflow-hidden rounded-[1.25rem] border bg-[var(--bg-card)] p-2 shadow-[var(--shadow-elevated)]"
              style={{ borderColor: "color-mix(in srgb, var(--theme-primary) 16%, var(--border-subtle))" }}
            >
              <MarketingHeroCarousel
                slides={slides}
                mediaFrame="hero"
                testIdPrefix="hero-platform-carousel"
                imgTestIdPrefix="hero-platform"
                captionOverlay
                onActiveSlideAnalytics={(slide) => {
                  trackProductEvent(PH.marketingHomeHeroCarouselTierImpression, {
                    marketing_locale: locale,
                    marketing_region: region,
                    hero_screenshot_index: slide.index,
                    hero_exam_track: getHomeHeroSlideExamTrackKey(slide.index),
                    surface: "home_conversion_hero_carousel",
                  });
                }}
              />
            </div>
            </div>
            </ScaleIn>
          </div>
        </div>
      </div>
    </section>
  );
}
