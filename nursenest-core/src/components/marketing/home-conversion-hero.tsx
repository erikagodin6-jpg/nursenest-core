"use client";

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
import { formatSentenceCase, formatTitleCase } from "@/lib/format/text-case";
import { useMarketingMobilePerfIsMobile } from "@/lib/ui/marketing-mobile-perf-context";

function safeT(t: ((k: string) => string) | undefined, key: string, fallback: string) {
  try {
    const v = t?.(key);
    return typeof v === "string" && v.trim() ? v : fallback;
  } catch {
    return fallback;
  }
}

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
  let locale = "en";
  let t: ((k: string) => string) | undefined;

  try {
    const ctx = useMarketingI18n();
    locale = safeLocale(ctx.locale);
    t = ctx.t;
  } catch {}

  let region = "CA";
  try {
    region = safeRegion(useNursenestRegion().region);
  } catch {}

  let isMobile = false;
  try {
    isMobile = useMarketingMobilePerfIsMobile() === true;
  } catch {}

  const q = props.questionCount ?? 0;
  const lessons = props.lessonCount ?? 0;

  return (
    <section className="border-b border-[var(--header-nav-border)] bg-[var(--page-bg)]">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl font-bold text-[var(--palette-heading)]">
          {formatTitleCase(
            safeT(t, "pages.home.hero.headline", "Canada-First Nursing Exam Prep"),
            locale
          )}
        </h1>

        <p className="mt-3 text-[var(--palette-text-muted)]">
          {formatSentenceCase(
            safeT(
              t,
              "pages.home.hero.subheading",
              "Practice questions, lessons, and flashcards designed for real exams."
            ),
            locale
          )}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <MarketingTrackedLink
            href={safePath(locale, HUB.questionBank)}
            event={PH.marketingHomeHeroPrimaryCta}
            eventProps={{ region }}
            className={`${MARKETING_PRIMARY_CTA_CLASS} rounded-xl`}
          >
            {formatTitleCase(
              safeT(t, "pages.home.hero.primaryCta", "Start practice questions"),
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
              safeT(t, "pages.home.hero.secondaryCta", "Browse lessons"),
              locale
            )}
          </MarketingTrackedLink>
        </div>

        <p className="mt-4 text-sm text-[var(--palette-text-muted)]">
          {q > 0 || lessons > 0
            ? `${q || ""} questions · ${lessons || ""} lessons`
            : safeT(t, "pages.home.hero.statsFallback", "Updated regularly")}
        </p>

        <p className="mt-2 flex items-center gap-2 text-sm text-[var(--palette-text-muted)]">
          <ShieldCheck className="h-4 w-4 text-green-500" />
          {safeT(t, "pages.home.hero.noCreditCard", "No credit card required")}
        </p>
      </div>
    </section>
  );
}