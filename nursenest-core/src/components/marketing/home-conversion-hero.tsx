"use client";

import { useMemo } from "react";
import { ArrowRight, Stethoscope, HeartPulse, Award, Dna } from "lucide-react";
import { FadeUp, StaggerGroup, StaggerItem } from "@/lib/motion";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { publicMarketingCatHrefForOffering } from "@/lib/marketing/marketing-exam-navigation";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { useMarketingRegionToggleWithRefresh } from "@/lib/region/use-marketing-region-toggle";
import {
  marketingRegionToggleSegment,
  marketingRegionToggleShell,
} from "@/lib/theme/marketing-region-toggle";
import { MarketingTrustSignalsStrip } from "@/components/marketing/marketing-trust-signals-strip";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
} from "@/lib/theme/marketing-hero-pattern";
import {
  getHomeHeroPrimaryTrackSpecs,
  type HomeHeroPrimaryTrackId,
} from "@/lib/marketing/country-exam-offerings";
import type { LucideIcon } from "lucide-react";

const HOME_HERO_TRACK_ICONS: Record<HomeHeroPrimaryTrackId, LucideIcon> = {
  rn: Stethoscope,
  pn: HeartPulse,
  np: Award,
  allied: Dna,
};

/**
 * Above-the-fold hero: headline, exam-hub track cards (primary), signup CTAs, de-emphasized study modes and tertiary links.
 */
export function HomeConversionHero() {
  const { t, locale } = useMarketingI18n();
  const { region, setRegion } = useNursenestRegion();
  const regionToggleAnalytics = useMemo(
    () => ({ currentRegion: region, surface: "home_hero" as const }),
    [region],
  );
  const setRegionAndRefresh = useMarketingRegionToggleWithRefresh(setRegion, regionToggleAnalytics);

  const loc = (path: string) => withMarketingLocale(locale, path);

  const primaryTracks = useMemo(() => getHomeHeroPrimaryTrackSpecs(region), [region]);

  const catHref = useMemo(() => publicMarketingCatHrefForOffering(region, "rn"), [region]);

  const studyModes = useMemo(
    () =>
      [
        { href: HUB.examLessons, labelKey: "home.conversion.heroStudyModes.lessons", kind: "lessons" as const },
        { href: HUB.questionBank, labelKey: "home.conversion.heroStudyModes.questions", kind: "questions" as const },
        { href: catHref, labelKey: "home.conversion.heroStudyModes.cat", kind: "cat" as const },
        { href: HUB.flashcards, labelKey: "home.conversion.heroStudyModes.flashcards", kind: "flashcards" as const },
      ] as const,
    [catHref],
  );

  return (
    <section
      className="nn-hero-branded relative overflow-hidden border-b border-[var(--header-nav-border)]"
      data-testid="hero-section"
      aria-labelledby="home-conversion-hero-heading"
    >
      <div className="pointer-events-none absolute inset-0 nn-hero-pastel-layers opacity-[0.92]" aria-hidden />
      <div className="relative py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <StaggerGroup className="min-w-0 space-y-8 text-left" staggerMs={70} whenInView once>
            <StaggerItem>
              <p className="mb-2 inline-flex items-center rounded-full border border-[var(--accent-surface-a-border)] bg-[var(--accent-surface-a)] px-3 py-0.5 nn-marketing-caption font-bold uppercase tracking-[0.12em] text-[var(--accent-surface-a-text)]">
                {t("home.conversion.heroEyebrow")}
              </p>
            </StaggerItem>
            <StaggerItem>
              <h1
                id="home-conversion-hero-heading"
                className="nn-marketing-h1 text-balance text-[var(--palette-heading)]"
                data-testid="text-hero-heading"
              >
                {t("home.conversion.heroTitle")}
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="nn-marketing-body max-w-xl text-pretty text-[var(--palette-text-muted)]" data-testid="text-hero-subheading">
                {t("home.conversion.heroSub")}
              </p>
            </StaggerItem>

            <StaggerItem>
              <div className="max-w-xl">
                <MarketingTrustSignalsStrip variant="default" homeHeroTrust />
              </div>
            </StaggerItem>

            <StaggerItem>
            <div
              className="nn-accent-surface-b rounded-2xl border border-[var(--accent-surface-b-border)] px-4 py-4 shadow-[var(--shadow-card)]"
              data-testid="hero-tier-quick-entry"
            >
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-1">
                  <p className="nn-marketing-caption font-semibold text-[var(--palette-text)]">
                    {t("home.conversion.heroTracksIntro")}
                  </p>
                  <p className="nn-marketing-body-sm text-pretty text-[var(--palette-text-muted)]">
                    {t("home.conversion.heroTracksSub")}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2" data-testid="region-toggle-hero">
                  <span className="nn-marketing-caption shrink-0 text-[var(--palette-text-muted)]">{t("nav.regionLabel")}</span>
                  <div className={marketingRegionToggleShell("rounded")} role="group" aria-label={t("nav.regionLabel")}>
                    <button
                      type="button"
                      onClick={() => setRegionAndRefresh("US")}
                      className={marketingRegionToggleSegment(region === "US", "default")}
                      data-testid="button-region-us"
                    >
                      {t("home.region.us")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegionAndRefresh("CA")}
                      className={marketingRegionToggleSegment(region === "CA", "default")}
                      data-testid="button-region-ca"
                    >
                      {t("home.region.ca")}
                    </button>
                  </div>
                </div>
              </div>

              <nav
                className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                aria-label={t("home.conversion.heroTracksNavAria")}
              >
                {primaryTracks.map((track) => {
                  const Icon = HOME_HERO_TRACK_ICONS[track.id];
                  const featured = track.id === "rn";
                  return (
                    <MarketingTrackedLink
                      key={track.id}
                      href={loc(track.path)}
                      event={PH.marketingHomeExploreHubClick}
                      eventProps={{ region, destination: track.id, surface: "hero_track_card" }}
                      secondaryCapture={{
                        event: PH.funnelHomeToExamHub,
                        eventProps: { placement: "hero_track_grid", pathway: track.id, region },
                      }}
                      className={`group flex min-h-0 flex-col rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-bubble)] p-3 text-left shadow-sm transition hover:border-[color-mix(in_srgb,var(--palette-accent)_36%,var(--border-subtle))] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring-accent)] ${
                        featured
                          ? "ring-1 ring-[color-mix(in_srgb,var(--palette-accent)_42%,var(--border-subtle))]"
                          : ""
                      }`}
                      data-testid={`button-hero-track-${track.id}`}
                    >
                      <span className="mb-2 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--text-accent)_12%,var(--palette-surface))]">
                        <Icon className="h-4 w-4 text-[var(--text-accent)]" aria-hidden />
                      </span>
                      <span className="nn-marketing-caption font-semibold uppercase tracking-wide text-[var(--palette-text-muted)]">
                        {t(track.metaKey)}
                      </span>
                      <span className="nn-marketing-h3 mt-0.5 text-balance leading-snug text-[var(--palette-heading)]">
                        {t(track.titleKey)}
                      </span>
                      <span className="nn-marketing-body-sm mt-1.5 text-pretty text-[var(--palette-text)]">
                        {t(track.whoKey)}
                      </span>
                      <span className="nn-marketing-body-sm mt-1 text-pretty text-[var(--palette-text-muted)]">
                        {t(track.nextKey)}
                      </span>
                      <span className="mt-3 inline-flex items-center text-sm font-semibold text-[var(--nn-aesthetic-accent)]">
                        {t(track.ctaKey)}
                        <ArrowRight className="ml-1.5 h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
                      </span>
                    </MarketingTrackedLink>
                  );
                })}
              </nav>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <MarketingTrackedLink
                  href={loc(HUB.signup)}
                  event={PH.marketingHomeHeroPrimaryCta}
                  eventProps={{ region, destination: "signup", surface: "hero_primary" }}
                  className={`${MARKETING_PRIMARY_CTA_CLASS} rounded-xl shadow-[var(--shadow-card)]`}
                  data-testid="button-hero-start-practicing"
                >
                  {t("home.conversion.ctaStartPracticing")}
                  <ArrowRight className="ml-2 h-5 w-5 shrink-0" aria-hidden />
                </MarketingTrackedLink>
                <MarketingTrackedLink
                  href={loc(HUB.questionBank)}
                  event={PH.marketingHomeHeroSecondaryCta}
                  eventProps={{ region, destination: "question_bank", surface: "hero_try_free" }}
                  className={`${MARKETING_SECONDARY_CTA_CLASS} rounded-xl border border-[var(--border-subtle)] shadow-sm`}
                  data-testid="button-hero-try-free-questions"
                >
                  {t("home.conversion.ctaTryFreeBank")}
                </MarketingTrackedLink>
              </div>

              <div className="mt-4 border-t border-[var(--accent-surface-b-border)] pt-4">
                <p className="nn-marketing-caption mb-2 font-medium text-[var(--palette-text-muted)]">
                  {t("home.conversion.heroStudyModesIntro")}
                </p>
                <ul
                  className="flex flex-wrap gap-x-3 gap-y-2"
                  aria-label={t("home.conversion.heroStudyModesAria")}
                >
                  {studyModes.map((sm) => (
                    <li key={sm.kind}>
                      <MarketingTrackedLink
                        href={loc(sm.href)}
                        event={PH.marketingHomeSampleContentClick}
                        eventProps={{
                          region,
                          surface: "hero_study_mode",
                          kind: sm.kind,
                        }}
                        className="nn-marketing-body-sm text-[var(--palette-text-muted)] underline decoration-[color-mix(in_srgb,var(--palette-text-muted)_45%,transparent)] underline-offset-2 transition hover:text-[var(--palette-text)]"
                        data-testid={`link-hero-study-${sm.kind}`}
                      >
                        {t(sm.labelKey)}
                      </MarketingTrackedLink>
                    </li>
                  ))}
                </ul>
              </div>

              <nav
                className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-[var(--accent-surface-b-border)] pt-3"
                aria-label={t("home.conversion.heroTertiaryAria")}
              >
                <MarketingTrackedLink
                  href={loc(HUB.tools)}
                  event={PH.marketingHomeSampleContentClick}
                  eventProps={{ region, surface: "hero_tertiary", kind: "tools" }}
                  className="nn-marketing-caption text-[var(--palette-text-muted)] underline decoration-transparent underline-offset-2 transition hover:text-[var(--palette-text)] hover:decoration-[color-mix(in_srgb,var(--palette-text-muted)_45%,transparent)]"
                  data-testid="link-hero-tools"
                >
                  {t("home.conversion.heroTertiary.tools")}
                </MarketingTrackedLink>
                <MarketingTrackedLink
                  href={loc("/pre-nursing")}
                  event={PH.marketingHomeSampleContentClick}
                  eventProps={{ region, surface: "hero_tertiary", kind: "pre_nursing" }}
                  className="nn-marketing-caption text-[var(--palette-text-muted)] underline decoration-transparent underline-offset-2 transition hover:text-[var(--palette-text)] hover:decoration-[color-mix(in_srgb,var(--palette-text-muted)_45%,transparent)]"
                  data-testid="link-hero-pre-nursing"
                >
                  {t("home.conversion.heroTertiary.preNursing")}
                </MarketingTrackedLink>
              </nav>
            </div>
            </StaggerItem>

            <StaggerItem>
              <p className="nn-marketing-caption max-w-xl text-pretty text-[var(--palette-text-muted)]">{t("home.conversion.heroDisclaimer")}</p>
            </StaggerItem>
            <StaggerItem>
              <p className="nn-marketing-body-sm max-w-lg text-pretty text-[var(--palette-text)]">{t("home.conversion.heroFreeLine")}</p>
            </StaggerItem>
            <StaggerItem>
              <p className="nn-marketing-caption max-w-lg text-pretty text-[var(--palette-text-muted)]">{t("home.conversion.heroTrustMicro")}</p>
            </StaggerItem>
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
