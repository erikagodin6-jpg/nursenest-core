"use client";

import { ArrowRight, ShieldCheck } from "lucide-react";
import { safeHomepageMarketingT, useMarketingI18n } from "@/lib/marketing-i18n";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { HUB } from "@/lib/marketing/marketing-entry-routes";
import { useNursenestRegion } from "@/lib/region/use-nursenest-region";
import { MarketingTrackedLink } from "@/components/marketing/marketing-tracked-link";
import { PH } from "@/lib/observability/posthog-conversion-events";
import {
  MARKETING_PRIMARY_CTA_CLASS,
  MARKETING_SECONDARY_CTA_CLASS,
} from "@/lib/theme/marketing-hero-pattern";
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";

function safeLocale(locale?: string) {
  return locale || "en";
}

function safeRegion(r?: string) {
  return r || "CA";
}

function safePath(locale: string, path: string) {
  try {
    return withMarketingLocale(locale, path);
  } catch {
    return path;
  }
}

export function HomeConversionHero(props: { questionCount?: number; lessonCount?: number }) {
  const ctx = useMarketingI18n();
  const locale = safeLocale(ctx.locale);
  const t = ctx.t;
  const region = safeRegion(useNursenestRegion().region);

  const q = props.questionCount ?? 0;
  const lessons = props.lessonCount ?? 0;

  return (
    <section className="nn-hero-bridge nn-home-marketing-rich-hero border-b border-[var(--header-nav-border)]">
      <div className="mx-auto max-w-6xl px-4 py-[var(--nn-rhythm-page-y)] sm:px-6 md:py-[var(--nn-rhythm-section-y)] lg:px-8">
        <h1
          id="home-conversion-hero-heading"
          className="nn-marketing-h1 max-w-[22ch] text-[var(--palette-heading)]"
        >
          {formatTitleCase(
            safeHomepageMarketingT(t, "pages.home.hero.headline", "Global nursing exam prep · Canada-first depth"),
            locale
          )}
        </h1>

        <p className="nn-marketing-body mt-[var(--nn-rhythm-heading-sub)] max-w-2xl text-pretty text-[var(--palette-text-muted)]">
          {formatSentenceCase(
            safeHomepageMarketingT(
              t,
              "pages.home.hero.subheading",
              "Practice questions, lessons, and flashcards designed for real exams."
            ),
            locale
          )}
        </p>

        <div className="mt-[var(--nn-rhythm-text-to-cta)] flex flex-wrap gap-[var(--nn-rhythm-btn-group-gap)]">
          <MarketingTrackedLink
            href={safePath(locale, HUB.questionBank)}
            event={PH.marketingHomeHeroPrimaryCta}
            eventProps={{ region }}
            className={`${MARKETING_PRIMARY_CTA_CLASS} rounded-xl`}
          >
            {formatTitleCase(
              safeHomepageMarketingT(t, "pages.home.hero.primaryCta", "Start Practice Questions"),
              locale
            )}
            <ArrowRight className="ml-2 h-4 w-4" />
          </MarketingTrackedLink>

          <MarketingTrackedLink
            href={safePath(locale, HUB.examLessons)}
            event={PH.marketingHomeHeroSecondaryCta}
            eventProps={{ region }}
            className={`${MARKETING_SECONDARY_CTA_CLASS} rounded-xl`}
          >
            {formatTitleCase(
              safeHomepageMarketingT(t, "pages.home.hero.secondaryCta", "Browse Lessons"),
              locale
            )}
          </MarketingTrackedLink>
        </div>

        <p className="nn-marketing-body-sm mt-4 text-[var(--palette-text-muted)]">
          {q > 0 || lessons > 0
            ? `${q || ""} questions · ${lessons || ""} lessons`
            : safeHomepageMarketingT(t, "pages.home.hero.statsFallback", "Updated regularly")}
        </p>

        <p className="nn-marketing-body-sm mt-2 flex items-center gap-2 text-[var(--palette-text-muted)]">
          <ShieldCheck className="h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />
          {safeHomepageMarketingT(t, "pages.home.hero.noCreditCard", "No credit card required")}
        </p>
      </div>
    </section>
  );
}
