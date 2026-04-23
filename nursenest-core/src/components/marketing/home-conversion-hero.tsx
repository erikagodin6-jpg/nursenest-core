"use client";

import { useMemo, type ReactNode } from "react";
import Image from "next/image";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
} from "@/lib/theme/marketing-hero-pattern";
import { formatEyebrow, formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";
import { StaggerGroup, StaggerItem } from "@/lib/motion";
import { buildHomepageHeroSlidesAtIndices } from "@/config/home-hero-carousel";

/** 0-based slide index → `screenshot9.png` (study modes / platform chrome—reads as real product UI). */
const HOME_HERO_ABOVE_FOLD_STILL_INDEX = 8 as const;

function formatStat(n: number, locale: string): string {
  if (n <= 0) return "";
  return n.toLocaleString(locale.replace(/_/g, "-"));
}

/**
 * Homepage hero: left column (headline, scannable copy, CTAs) + right column (product still).
 */
export function HomeConversionHero({
  questionCount = 0,
  lessonCount = 0,
}: {
  questionCount?: number;
  lessonCount?: number;
}) {
  const { locale, t } = useMarketingI18n();
  const { region } = useNursenestRegion();
  const loc = (path: string) => withMarketingLocale(locale, path);
  const q = formatStat(questionCount, locale);
  const lessons = formatStat(lessonCount, locale);

  const statsSegments: ReactNode[] = [];
  if (q) {
    statsSegments.push(
      <span key="q" className="font-semibold text-[var(--semantic-success)]">
        {t("pages.home.hero.statQuestions", { count: q })}
      </span>,
    );
  }
  if (lessons) {
    statsSegments.push(
      <span key="l" className="font-medium text-[var(--palette-text-muted)]">
        {t("pages.home.hero.statLessons", { count: lessons })}
      </span>,
    );
  }
  statsSegments.push(
    <span key="u" className="text-[var(--palette-text-muted)]">
      {formatSentenceCase(t("pages.home.hero.statUpdates"), locale)}
    </span>,
  );

  const heroDesktopPreview = useMemo(
    () => buildHomepageHeroSlidesAtIndices(t, [HOME_HERO_ABOVE_FOLD_STILL_INDEX])[0],
    [t],
  );

  const scanItems = useMemo(
    () =>
      [1, 2, 3, 4].map((n) => t(`pages.home.hero.scanItem${n}`)).filter((line) => line.trim().length > 0),
    [t],
  );

  return (
    <section
      className="hero nn-gradient-safe nn-hero-branded nn-hero-branded--ambient-depth relative overflow-x-hidden border-b border-[var(--header-nav-border)]"
      data-testid="hero-section"
      aria-labelledby="home-conversion-hero-heading"
    >
      <div className="relative pt-10 pb-[var(--nn-rhythm-page-y)] md:pt-12 md:pb-[calc(var(--nn-rhythm-page-y)+var(--nn-rhythm-tight-y))]">
        <div className="nn-section-shell">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
            <StaggerGroup
              className="min-w-0 space-y-5 lg:col-span-7 lg:max-w-none xl:col-span-6"
              whenInView={false}
            >
              <StaggerItem variant="softReveal" timing="hero">
                <p className="nn-marketing-caption inline-block max-w-full text-balance break-words rounded-full border border-[var(--pill-border)] bg-[var(--pill-bg)] px-3.5 py-1.5 font-semibold tracking-wide text-[var(--pill-fg)]">
                  {formatTitleCase(t("pages.home.hero.eyebrowBrand"), locale)}
                </p>
              </StaggerItem>
              <StaggerItem timing="hero">
                <h1
                  id="home-conversion-hero-heading"
                  className="nn-marketing-h1 max-w-[22rem] text-balance break-words text-[var(--palette-heading)] sm:max-w-2xl sm:leading-[1.06]"
                  data-testid="text-hero-heading"
                >
                  {formatTitleCase(t("pages.home.hero.headline"), locale)}
                </h1>
              </StaggerItem>
              <StaggerItem variant="softReveal" timing="hero">
                <p
                  className="nn-marketing-body max-w-lg text-pretty break-words leading-relaxed text-[var(--palette-text-muted)]"
                  data-testid="text-hero-subheading"
                >
                  {formatSentenceCase(t("pages.home.hero.subheading"), locale)}
                </p>
              </StaggerItem>
              <StaggerItem variant="softReveal" timing="hero">
                <p
                  className="nn-marketing-body max-w-lg text-pretty break-words leading-relaxed text-[var(--palette-text-muted)]"
                  data-testid="text-hero-subheading2"
                >
                  {formatSentenceCase(t("pages.home.hero.subheading2"), locale)}
                </p>
              </StaggerItem>
              {scanItems.length > 0 ? (
                <StaggerItem variant="softReveal" timing="hero">
                  <ul className="nn-marketing-body-sm max-w-lg list-none space-y-2 text-[var(--palette-text-muted)]">
                    {scanItems.map((line) => (
                      <li key={line} className="flex gap-2.5">
                        <span className="mt-0.5 shrink-0 font-semibold text-[var(--semantic-brand)]" aria-hidden>
                          ·
                        </span>
                        <span className="min-w-0 leading-snug">{line}</span>
                      </li>
                    ))}
                  </ul>
                </StaggerItem>
              ) : null}
              <StaggerItem variant="softReveal" timing="hero">
                <p
                  className="nn-marketing-body-sm max-w-lg text-pretty leading-relaxed text-[var(--palette-text-muted)]"
                  data-testid="text-hero-emotional-anchor"
                >
                  {formatSentenceCase(t("pages.home.hero.emotionalAnchorLine"), locale)}
                </p>
              </StaggerItem>
              <StaggerItem variant="softReveal" timing="hero">
                <p className="nn-marketing-caption max-w-lg font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">
                  {formatEyebrow(t("pages.home.hero.nextStepEyebrow"), locale)}
                </p>
              </StaggerItem>
              <StaggerItem variant="softReveal" timing="hero">
                <p
                  className="nn-marketing-body-sm max-w-lg text-pretty leading-relaxed text-[var(--semantic-success)]"
                  data-testid="text-hero-safe-to-try"
                >
                  {formatSentenceCase(t("pages.home.hero.safeToTryLine"), locale)}
                </p>
              </StaggerItem>
              <StaggerItem timing="hero">
                <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch sm:justify-start sm:gap-4">
                  <MarketingTrackedLink
                    href={loc(HUB.questionBank)}
                    event={PH.marketingHomeHeroPrimaryCta}
                    eventProps={{
                      region,
                      marketing_region: region,
                      marketing_locale: locale,
                      destination: "question_bank",
                      surface: "hero_primary",
                      exam_tier_band: "undifferentiated_cta",
                    }}
                    className={`${MARKETING_PRIMARY_CTA_CLASS} nn-motion-standard rounded-xl shadow-[var(--shadow-card)]`}
                    data-testid="button-hero-start-practice-questions"
                  >
                    {formatTitleCase(t("pages.home.hero.primaryCta"), locale)}
                    <ArrowRight className="h-5 w-5 shrink-0" aria-hidden />
                  </MarketingTrackedLink>
                  <MarketingTrackedLink
                    href={loc(HUB.examLessons)}
                    event={PH.marketingHomeHeroSecondaryCta}
                    eventProps={{
                      region,
                      marketing_region: region,
                      marketing_locale: locale,
                      destination: "lessons",
                      surface: "hero_browse_lessons",
                      exam_tier_band: "undifferentiated_cta",
                    }}
                    className={`${MARKETING_SECONDARY_CTA_CLASS} nn-motion-standard rounded-xl border border-[var(--border-subtle)] shadow-sm`}
                    data-testid="button-hero-browse-lessons"
                  >
                    {formatTitleCase(t("pages.home.hero.secondaryCta"), locale)}
                  </MarketingTrackedLink>
                </div>
                <p className="nn-marketing-caption mt-3 max-w-md text-pretty text-[var(--palette-text-muted)]">
                  {formatSentenceCase(t("pages.home.hero.ctaSupportingLine"), locale)}
                </p>
              </StaggerItem>
              <StaggerItem variant="softReveal" timing="hero">
                <p
                  className="nn-mobile-hero-stats-reserve nn-marketing-caption flex max-w-xl flex-wrap items-baseline gap-x-1.5 gap-y-1 text-balance text-[var(--palette-text-muted)]"
                  data-testid="text-hero-live-stats"
                >
                  {statsSegments.map((node, i) => (
                    <span key={i} className="inline-flex items-baseline gap-1.5">
                      {i > 0 ? (
                        <span className="text-[var(--semantic-border-soft)]" aria-hidden>
                          ·
                        </span>
                      ) : null}
                      {node}
                    </span>
                  ))}
                </p>
                {!q && !lessons ? (
                  <p className="nn-marketing-caption mt-2 max-w-xl text-pretty text-[var(--palette-text-muted)]">
                    {formatSentenceCase(t("pages.home.hero.statsFallback"), locale)}
                  </p>
                ) : null}
              </StaggerItem>
              <StaggerItem variant="softReveal" timing="hero">
                <p className="nn-marketing-caption flex min-w-0 items-start gap-2 text-balance break-words text-[var(--palette-text-muted)]">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />
                  {formatSentenceCase(t("pages.home.hero.noCreditCard"), locale)}
                </p>
              </StaggerItem>
            </StaggerGroup>

            <div className="min-w-0 lg:col-span-5 lg:self-center xl:col-span-6">
              <figure
                className="card mx-auto w-full max-w-md rounded-2xl border border-[var(--border-subtle)] bg-[var(--semantic-panel-muted)] p-2 shadow-[var(--shadow-card)] lg:mx-0 lg:max-w-none lg:sticky lg:top-24"
                aria-label={heroDesktopPreview.alt}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[var(--page-bg)]">
                  <Image
                    src={heroDesktopPreview.publicUrl}
                    alt={heroDesktopPreview.alt}
                    width={1200}
                    height={900}
                    fill
                    sizes="(min-width: 1024px) 42vw, 100vw"
                    className="object-cover object-top"
                    priority
                    fetchPriority="high"
                  />
                </div>
                <figcaption className="mt-2 space-y-1 px-1 text-center text-[var(--palette-text-muted)] lg:text-start">
                  {heroDesktopPreview.label ? (
                    <span className="nn-marketing-caption block font-semibold uppercase tracking-wide text-[var(--palette-text-muted)]">
                      {heroDesktopPreview.label}
                    </span>
                  ) : null}
                  <span className="block text-sm font-semibold leading-snug text-[var(--palette-heading)]">
                    {heroDesktopPreview.title}
                  </span>
                  <span className="nn-marketing-caption block text-pretty">{heroDesktopPreview.caption}</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
